package controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import domain.DataList;
import domain.DataRow;
import service.QueryService;
@RestController
public class RemindAndReport {
	Logger log = Logger.getLogger(RemindAndReport.class);
	@Autowired
	private QueryService queryService;
	/**
	 * 未上传提醒 默认开始时间是XXXX－01-01 上传的周期是 月、年、季
	 * 上传数据时间 ：周期结束的下一个月内上传 
	 * 未上传提醒时间 ： 周期结束的下一个月开始进行提醒
	 *     
	 */
	@RequestMapping(value = "/tax/edit/noUpload.do")
	public DataList noUploadRemindList() {
		// 获取所有上传方的表 及相关信息
		DataList tableList = queryService.query("select * from reportFormView where type = 0 and deltable!=1");
		Calendar now=Calendar.getInstance();
		Integer year=now.get(Calendar.YEAR);
		Integer month=now.get(Calendar.MONTH)+1;//当前月
		DataList value = new DataList();
		for(DataRow table : tableList)
		{
			String tableName = (String) table.get("tableName");
			Integer uploadCycle=(Integer) table.get("uploadCycle");
			if(uploadCycle!=0){
			List<String> date=getShouldUploadDate(year,month,uploadCycle);//获取需要上传的月份的 数据所属期时间
			if(date!=null){ //不为空，表示本月需要上传
				String start=date.get(0);
				String end=date.get(1);
				DataList c = getDateCount(tableName, start, end);//查看所属日期内该表是否上传
				String num = c.get(0).get("num").toString();
				if(num.compareTo("0")==0){
					getValue(value, tableName);//若未上传，获取相关表的信息
				}			
			}
		}
		}
		return value;
	}

	private DataList getDateCount(String tableName, String start, String end) {
		DataList c = queryService.query("select count(*) as num from uploadRecords where tableName='"+tableName+"' and startTime=? and endTime=? and state<>0"
			,start,end);
		return c;
	}

	private void getValue(DataList value, String tableName) {
		DataList list = queryService.query("select name,tableName,tel,contacts,leadership,uploadCycle from reportFormView where tableName = ?", tableName);
		for (int j = 0; j < list.size(); j++) {
			DataRow row = new DataRow();
			row.put("tableName", tableName);
			row.put("name", list.get(j).get("name"));
			row.put("tel", list.get(j).get("tel"));
			row.put("contacts", list.get(j).get("contacts"));
			row.put("uploadCycle", list.get(j).get("uploadCycle"));
			row.put("leadership", list.get(j).get("leadership"));
			value.add(row);
		}
	}
	private List<String> getShouldUploadDate(Integer year, Integer month, Integer uploadCycle) {
		List<String> allDate = null;
		List<String> date = new ArrayList<String>();

		if (month == 1) {
			allDate = getDate(year - 1, uploadCycle); // 获取应该上传的月份
			date.add(allDate.get(allDate.size() - 2));
			date.add(allDate.get(allDate.size() - 1));
			return date;
		} else {
			allDate = getDate(year, uploadCycle); // 获取应该上传的月份
			String s = year + "-" + (month >= 10 ? month : "0" + month);
			for (int i = 0; i < allDate.size()-2; i+= 2) {
				if (s.compareTo(allDate.get(i + 2)) == 0) {
					date.add(allDate.get(i));
					date.add(allDate.get(i + 1));
					return date;
				}
			}
		}
		return null;
	}
	/**
	 * 根据年份和上传周期计算应该上传的月份（起止）
	 * @param year
	 * @param uploadCycle
	 * @return
	 */
	private List<String> getDate(Integer year, Integer uploadCycle) {
		List<String> allDate=new ArrayList<String>();
		Calendar c=Calendar.getInstance();
		c.set(Calendar.YEAR,year);
		c.set(Calendar.MONTH,0);//修改处
		for(int i=0;i<12/uploadCycle;i++)
		{
			Integer newYear=c.get(Calendar.YEAR);
			Integer newMonth=c.get(Calendar.MONTH)+1;
			allDate.add(newYear+"-"+(newMonth>=10?newMonth:"0"+newMonth));
			c.add(Calendar.MONTH, uploadCycle);
//			newYear=c.get(Calendar.YEAR);
			newYear=year;
			c.add(Calendar.MONTH, -1);
			newMonth=c.get(Calendar.MONTH)+1;
			allDate.add(newYear+"-"+(newMonth>=10?newMonth:"0"+newMonth));
			c.add(Calendar.MONTH, 1);
		}
		return allDate;
	}
	

	/**
	 * 单位上传情况统计（分单位） 
	 */
	@RequestMapping(value = "/tax/edit/listReport1.do")
	public DataList reportFormList(String startTime, String endTime) {
		//获取所有表的基本信息 包括uploadCycle
		 HashMap<String, DataRow> map = new HashMap<String, DataRow>() ;
        DataList list = new DataList();
		DataList tableList = queryService.query("select * from reportFormView where type = 0");
		List<DataRow> rows=tableList.parallelStream().map(table->{
			String start = startTime.substring(0, 4);
			String end = endTime.substring(0, 4);
			int onTimeUploadCount=0;
			int delayUploadCount=0;
			int noUploadCount=0;
			int recordCount=0;
			int uploadCount=0;
			int advancedCount=0;
			String tableName = (String) table.get("tableName");
			if((int) table.get("uploadCycle")==0){
				recordCount=queryService.getCount("select count(a.id) from ["+tableName+"] as a left join uploadRecords as b on a.uploadId=b.id where state>=2 and state<>4 and startTime>=? and endTime<=?", startTime,endTime);
				uploadCount=queryService.getCount("select count(id) from uploadRecords where tableName=? and  state>=2 and state<>4 and startTime>=? and endTime<=?", tableName,startTime,endTime);
			}else{
			List<String> allDate=getDate1(start, end ,(int) table.get("uploadCycle"));//获取每张表 今年 应该上传的周期节点
			//log.debug(allDate);
			List<String> needTime=getDate1(startTime, endTime, allDate);//该上传的月份的数据所属日期
//			log.debug(needTime);

			//判断每张表应该上传的周期数内的上传情况
			for(int i=0;i<needTime.size()-1;i+=2){
				String st=needTime.get(i);
				String endt=needTime.get(i+1);
				//log.debug("st:"+st);
				//log.debug("et:"+endt);
				//获取正常上传的 数据应该在它周期结束的下一个月上传  uploadTime = 周期截止月份的下个月 ---> uploadTime的上个月 = 周期截止月份
				int normalToUpload = queryService.getCount("select count(id)  from uploadRecords where tableName=? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7)=endTime",tableName,st,endt);
				//获取延迟上传的 数据应该大于周期结束的下一个月上传 uploadTime > 周期截止月份的下个月 ---> uploadTime的上个月 > 周期截止月份
				if(normalToUpload==0){
					int delayToUpload = queryService.getCount("select count(id)  from uploadRecords where tableName = ? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7) > endTime",tableName,st,endt);
					delayUploadCount+=delayToUpload;
					int advancedToUpload=queryService.getCount("select count(id)  from uploadRecords where tableName=? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7) < endTime",tableName,st,endt);
					advancedCount+=advancedToUpload;
				}
				onTimeUploadCount+=normalToUpload;
			}
			recordCount=queryService.getCount("select count(a.id) from ["+tableName+"] as a left join uploadRecords as b on a.uploadId=b.id where state>=2 and state<>4 and startTime>=? and endTime<=?", startTime,endTime);
			uploadCount=queryService.getCount("select count(id) from uploadRecords where tableName = ? and state>=2 and state<>4 and startTime>=? and endTime<=?", tableName,startTime,endTime);
			noUploadCount=needTime.size()/2-uploadCount;
			}
			String organization=table.get("name").toString();

			DataRow row=new DataRow();
			row.put("delayNum", delayUploadCount);
			row.put("onTimeNum", onTimeUploadCount);
			row.put("advancedCount", advancedCount);
			row.put("noUploadNum", noUploadCount);
			row.put("tableName", tableName);
			row.put("organization", organization);
			row.put("recordCount", recordCount);
			row.put("uploadCount", uploadCount);
			return row;
		}).collect(Collectors.toList());
		int allDelayUploadCount=0;
		int allOnTimeUploadCount=0;
		int allNoUploadCount=0;
		int allUploadCount=0;
		int allAdvancedUploadCount=0;
		int allRecordCount=0;
		DataList value=new DataList();
		for(DataRow row : rows){
			allDelayUploadCount+=(int)row.get("delayNum");
			allOnTimeUploadCount+=(int)row.get("onTimeNum");
			allAdvancedUploadCount+=(int)row.get("advancedCount");
			allNoUploadCount+=(int)row.get("noUploadNum");
			allUploadCount+=(int)row.get("uploadCount");
			allRecordCount+=(int)row.get("recordCount");
			value.add(row);
			
		}

		 ////////////////////////////////////////////////		
		 for(DataRow d : value){
			 String key = d.get("organization").toString();
			 if(!map.containsKey(key)){
				 map.put(key, d);
		    }else{
		    	     DataRow dr = (DataRow) map.get(key);
		    	     dr.put("delayNum", (int)d.get("delayNum")+(int)dr.get("delayNum"));
				 dr.put("onTimeNum", (int)d.get("onTimeNum")+(int)dr.get("onTimeNum"));
				 dr.put("noUploadNum", (int)d.get("noUploadNum")+(int)dr.get("noUploadNum"));
				 dr.put("advancedCount", (int)d.get("advancedCount")+(int)dr.get("advancedCount"));
	    	     	 dr.put("recordCount", (int)d.get("recordCount")+(int)dr.get("recordCount"));
				 dr.put("uploadCount", (int)d.get("uploadCount")+(int)dr.get("uploadCount"));
				 map.put(key, dr);
		    }
		 }  
		for(String key:map.keySet()){
		DataRow row1=  (DataRow) map.get(key);
		list.add(row1);
		}
		////////////////////////////////////////////////
		DataRow totalNum=new DataRow();
		totalNum.put("delayNum", allDelayUploadCount);
		totalNum.put("onTimeNum", allOnTimeUploadCount);
		totalNum.put("noUploadNum", allNoUploadCount);
		totalNum.put("advancedCount", allAdvancedUploadCount);
		totalNum.put("organization", "合计：");
		totalNum.put("uploadCount", allUploadCount);
		totalNum.put("recordCount", allRecordCount);
		list.add(totalNum);
		return list;
	}

	
	/**
	 * 单位上传情况统计（分报表） 
	 *
	 */
	@RequestMapping(value = "/tax/edit/listReport.do")
	public DataList reportFormList1(String startTime, String endTime) {
		//获取所有表的基本信息 包括uploadCycle
		DataList tableList = queryService.query("select * from reportFormView where type = 0");
		//log.debug(tableList);
	
		List<DataRow> rows=tableList.parallelStream().map(table->{
			String start = startTime.substring(0, 4);
			String end = endTime.substring(0, 4);
			int onTimeUploadCount=0;
			int delayUploadCount=0;
			int noUploadCount=0;
			int recordCount=0;
			int uploadCount=0;
			int advancedCount=0;
			String tableName = (String) table.get("tableName");
			if((int) table.get("uploadCycle")==0){
				recordCount=queryService.getCount("select count(a.id) from ["+tableName+"] as a left join uploadRecords as b on a.uploadId=b.id where state>=2 and state<>4 and startTime>=? and endTime<=?", startTime,endTime);
				uploadCount=queryService.getCount("select count(id) from uploadRecords where tableName=? and  state>=2 and state<>4 and startTime>=? and endTime<=?", tableName,startTime,endTime);
			}else{
			List<String> allDate=getDate1(start, end ,(int) table.get("uploadCycle"));//获取每张表 今年 应该上传的周期节点
			//log.debug(allDate);
			List<String> needTime=getDate1(startTime, endTime, allDate);//该上传的月份的数据所属日期
//			log.debug(needTime);

			//判断每张表应该上传的周期数内的上传情况
			for(int i=0;i<needTime.size()-1;i+=2){
				String st=needTime.get(i);
				String endt=needTime.get(i+1);
				//log.debug("st:"+st);
				//log.debug("et:"+endt);
				//获取正常上传的 数据应该在它周期结束的下一个月上传  uploadTime = 周期截止月份的下个月 ---> uploadTime的上个月 = 周期截止月份
				int normalToUpload = queryService.getCount("select count(id)  from uploadRecords where tableName=? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7)=endTime",tableName,st,endt);
				//获取延迟上传的 数据应该大于周期结束的下一个月上传 uploadTime > 周期截止月份的下个月 ---> uploadTime的上个月 > 周期截止月份
				if(normalToUpload==0){
					int delayToUpload = queryService.getCount("select count(id)  from uploadRecords where tableName = ? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7) > endTime",tableName,st,endt);
					delayUploadCount+=delayToUpload;
					int advancedToUpload=queryService.getCount("select count(id)  from uploadRecords where tableName=? and state >= 2 and state<>4 and startTime =? and endTime = ? and SUBSTRING(convert(varchar,DATEADD(MONTH,-1,uploadTime),23),1,7) < endTime",tableName,st,endt);
					advancedCount+=advancedToUpload;
				}
				onTimeUploadCount+=normalToUpload;
			}
//			noUploadCount=needTime.size()/2-delayUploadCount-onTimeUploadCount;
			recordCount=queryService.getCount("select count(a.id) from ["+tableName+"] as a left join uploadRecords as b on a.uploadId=b.id where state>=2 and state<>4 and startTime>=? and endTime<=?", startTime,endTime);
			uploadCount=queryService.getCount("select count(id) from uploadRecords where tableName=? and  state>=2 and state<>4 and startTime>=? and endTime<=?", tableName,startTime,endTime);
			noUploadCount=needTime.size()/2-uploadCount;//包含本月上传本月的数据
			}

			String organization=table.get("name").toString();
			DataRow row=new DataRow();
			row.put("delayNum", delayUploadCount);
			row.put("onTimeNum", onTimeUploadCount);
			row.put("advancedCount", advancedCount);
			row.put("noUploadNum", noUploadCount);
			row.put("tableName", tableName);
			row.put("organization", organization);
			row.put("recordCount", recordCount);
			row.put("uploadCount", uploadCount);
			return row;
		}).collect(Collectors.toList());
		int allDelayUploadCount=0;
		int allOnTimeUploadCount=0;
		int allAdvancedUploadCount=0;
		int allNoUploadCount=0;
		int allUploadCount=0;
		int allRecordCount=0;
		DataList value=new DataList();
		for(DataRow row : rows){
			allDelayUploadCount+=(int)row.get("delayNum");
			allOnTimeUploadCount+=(int)row.get("onTimeNum");
			allAdvancedUploadCount+=(int)row.get("advancedCount");
			allNoUploadCount+=(int)row.get("noUploadNum");
			allUploadCount+=(int)row.get("uploadCount");
			allRecordCount+=(int)row.get("recordCount");
			value.add(row);
			
		}
		DataRow totalNum=new DataRow();
		totalNum.put("delayNum", allDelayUploadCount);
		totalNum.put("onTimeNum", allOnTimeUploadCount);
		totalNum.put("advancedCount", allAdvancedUploadCount);
		totalNum.put("noUploadNum", allNoUploadCount);
		totalNum.put("tableName", "合计：");
		totalNum.put("organization", "");
		totalNum.put("uploadCount", allUploadCount);
		totalNum.put("recordCount",allRecordCount);
		value.add(totalNum);
		return value;
	}
	
/**
 * 根据 起止 年份和上传周期计算应该上传的月份（起止）
 * @param startYear
 * @param endYear
 * @param cycle
 * @return
 */
	private List<String> getDate1(String startYear, String endYear, int cycle) {
		List<String> allDate = new ArrayList<String>();
		int s = Integer.parseInt(startYear);
		int e = Integer.parseInt(endYear);
		for (int j = s; j <= e; j++) {
			Integer newMonth = 1;
			for (int i = 0; i < 12 / cycle; i++) {
				allDate.add(j + "-" + (newMonth >= 10 ? newMonth : "0" + newMonth));
				newMonth = newMonth + cycle - 1;
				allDate.add(j + "-" + (newMonth >= 10 ? newMonth : "0" + newMonth));
				newMonth = newMonth + 1;
			}
		}
		return allDate;
	}
	/**
	 * 根据 起止 时间 计算 应该上传数据所属期
	 * @param startTime
	 * @param endTime
	 * @param allDate
	 * @return
	 */
	private  List<String> getDate1(String startTime, String endTime,List<String> allDate){
		List<String> list=new ArrayList<String>();
		for(int i=0;i<allDate.size()-1;i+=2){
			if(startTime.compareTo(allDate.get(i))<=0&&endTime.compareTo(allDate.get(i+1))>=0){
				list.add(allDate.get(i));
				list.add(allDate.get(i+1));
			}
		}
      return list;
	}
	public static void main(String[] args) {
//
		RemindAndReport report=new RemindAndReport();
//		List<String> allDate=new ArrayList<String>();
//		allDate=report.getDate1("2017","2018",3);
//		System.out.println(allDate);//今年应该上传的月份周期
		System.out.println(report.reportFormList1("2017-01","2018-12"));
//		List<String> date=report.getShouldUploadDate(2018,7,6);//获取需要上传的月份的 数据所属期时间
//		System.out.println(date);
//		System.out.println(report.getDate(2017, 1));

		
	}}
