package controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import db.Condition;
import domain.DataList;
import domain.DataRow;
import service.QueryService;
import vo.WebResponse;
@RestController

public class UploadRecordsController {
		private Logger log=Logger.getLogger(UploadRecordsController.class);
		@Autowired
		private QueryService queryService;
		/**
		 * 根据用户所在部门显示其所有上传记录
		 * @param start
		 * @param limit
		 * @param organizationId
		 * @param startTime
		 * @param deadline
		 * @return
		 * @throws ParseException
		 */
		@RequestMapping(value="/uploadRecordsListAll.do")
		public WebResponse uploadRcordsListAll(HttpSession session,Integer start, Integer limit,String organizationId,String startTime,String deadline) throws ParseException {
			
			log.debug("organizationId:"+organizationId);
			if(organizationId==null||organizationId.length()<=0) {
				organizationId=(String) session.getAttribute("organizationId");
			}
			DataList tableNameList = queryService.query("select tableName from [dataTable] where organizationId = ?", organizationId);
			
			Condition tableNameCondition=new Condition();
			for(int m = 0;m<tableNameList.size();m++) {
				tableNameCondition.or(new Condition("tableName", "=", (String) tableNameList.get(m).get("tableName")));
			}
			Condition timeCondition=new Condition();
			timeCondition.and(new Condition("startTime", ">=", startTime));// 大于开始时间
			timeCondition.and(new Condition("endTime", "<=", deadline));// 小于结束时间
			Condition c=new Condition();
			c.and(tableNameCondition);
			c.and(timeCondition);
			log.debug(c);
			WebResponse response = queryService.queryPage(start, limit, c, "uploadRecords");
			return response;
		}
		/*
		 * 根据上传记录表名查找相关记录
		 */
		@RequestMapping(value="/uploadRecordsList.do")//列出上传记录
		public WebResponse uploadRcordsList(Integer start, Integer limit,String tableName,String startTime,String deadline) throws ParseException {

			//log.debug("start:"+start+"limit: "+limit+"tableName: "+tableName+" startTime: "+startTime+" deadline:"+deadline);
			WebResponse response = new WebResponse();
			//Date s = format.parse(startTime+" 00:00:00");
			//Date d = format.parse(deadline+" 23:59:59");
			//Timestamp begin = new Timestamp(s.getTime());
			//Timestamp end = new Timestamp(d.getTime());
			DataList data = new DataList();//需要展示的值
		//	DataList columns = new DataList();//字段名称
			DataRow row =null;
			Condition c=new Condition();
			c.and(new Condition("startTime", ">=", startTime));// 大于开始时间
			c.and(new Condition("endTime", "<=", deadline));// 小于结束时间
			if(tableName!=null&&tableName.length()!=0) {
				c.and(new Condition("tableName", "=", tableName));
			}
			WebResponse wlist = queryService.queryPage(start, limit, c, "uploadRecords");
			DataList list = (DataList) wlist.get("value");
			int totalCount=(int) wlist.get("totalCount");
			if(list.size()==0)
				response.setSuccess(false);
			for(int i = 0;i<list.size();i++) {
				row = new DataRow();
				row.put("id",list.get(i).get("id"));
				row.put("uploads",list.get(i).get("uploads"));
				row.put("uploadTime", list.get(i).get("uploadTime"));
				row.put("startTime",list.get(i).get("startTime"));
				row.put("endTime",list.get(i).get("endTime"));
				row.put("state",list.get(i).get("state"));
				row.put("tableName", list.get(i).get("tableName"));
				data.add(row);
			}

			response.put("totalCount", totalCount);
			response.setValue(data);
			return response;
		}
		/*
		 * 显示近三个月内的上传记录（按上传时间）
		 */
		@RequestMapping(value = "/tax/edit/uploadRecords.do")
		public WebResponse uploadRecords(int start,int limit) {
			Calendar now = Calendar.getInstance(); // 获得当天时间
			log.debug("当天时间："+new SimpleDateFormat("yyyy-MM-dd").format(now.getTime()));
			now.set(Calendar.MONTH, now.get(Calendar.MONTH) - 3); // 重置月份 三个月
			now.set(Calendar.DATE, 1); // 重置日期 第一天
			String begin = new SimpleDateFormat("yyyy-MM-dd").format(now.getTime());
			log.debug("上传的数据startTime是：" + begin);
			
			Calendar now1 = Calendar.getInstance(); // 获得当天时间
			log.debug("当天时间："+new SimpleDateFormat("yyyy-MM-dd").format(now1.getTime()));
//			now1.set(Calendar.MONTH, now1.get(Calendar.MONTH) - 1); // 重置月份 上个月
//			now1.set(Calendar.DATE, now1.getActualMaximum(Calendar.DATE)); //最后一天
			String end = new SimpleDateFormat("yyyy-MM-dd").format(now1.getTime());
			log.debug("上传的数据endTime是：" + end);

			Condition a=new Condition("startTime",">=",begin);
			Condition b=new Condition("endTime","<=",end);
			a.and(b);
			WebResponse list = queryService.queryPage(start, limit, a, "uploadRecordsView");
			/*DataList list = DB.doQuery(conn -> {
				String sql = "select * from uploadRecordsView where uploadTime>='"
						+ begin + "' and uploadTime <='" + end + "'";
				System.out.println(sql.toString());// 打印出整条SQl语句
				PreparedStatement st = conn.prepareStatement(sql);
				return st;
			});*/
			log.debug(list);
			return list;
		}
		
}
