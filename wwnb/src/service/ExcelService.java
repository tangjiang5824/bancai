package service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import domain.DataList;
import domain.DataRow;
import net.sf.json.JSONArray;
import util.Excel;
import util.Readhtml;
import vo.NextBatch;
import vo.UploadDataResult;
import vo.WebResponse;

@Service
public class ExcelService extends BaseService {
	private Logger log = Logger.getLogger(ExcelService.class);
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;
	@Transactional
	public boolean setNoData(String tableName, Integer year, Integer batchNo, String startTime, String endTime, String uploads) { // 校验批次
		if (!checkBatch(tableName, year, batchNo, startTime, endTime))
			return false;
		int ret = jo.update("insert into uploadRecords(tableName,uploads,uploadTime,startTime,endTime,state,batchNo) values(?,?,?,?,?,?,?)", tableName,
				uploads, new Timestamp(System.currentTimeMillis()), startTime, endTime, 5, batchNo);
		if (ret > 0)
			return true;
		else
			return false;
	}

	/**
	 * 批次校验
	 * 
	 * @param tableName
	 * @param year
	 * @param batchNo
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	private boolean checkBatch(String tableName, Integer year, Integer batchNo, String startTime, String endTime) {
		NextBatch nextBatch = getNextBatch(tableName, year);
		if (log.isDebugEnabled()) {
			log.debug(String.format("tableName=%s,year=%s", tableName, year));
			log.debug(String.format("batchNo=%d,nextBatch.batchNo=%d", batchNo, nextBatch.batchNo));
			log.debug(String.format("startTime=%s,nextBatch.startTime=%s", startTime, nextBatch.startTime));
			log.debug(String.format("endTime=%s,nextBatch.endTime=%s", endTime, nextBatch.endTime));
		}
		if (nextBatch.batchNo != batchNo) {
			return false;
		}
		if (nextBatch.uploadCycle != 0) {
			if (!nextBatch.startTime.equals(startTime) || !nextBatch.endTime.equals(endTime))
				return false;
		}
		return true;
	}

	/**
	 * 返回下一个上传批次，若返回null，表明当年已经完成全部批次的上传
	 * 
	 * @param tableName
	 * @param year
	 * @return
	 */
	public NextBatch getNextBatch(String tableName, Integer year) {
		Long count=null;
		//有没有删除的数据
		count = jo.queryForObject("select min(batchNo) from uploadRecords as u where u.state=4 and not exists(select id from uploadRecords where tableName=? and SUBSTRING(startTime,1,4)=? and state<>4 and batchNo=u.batchNo) and u.tableName=? and SUBSTRING(u.startTime,1,4)=?", Long.class,
				tableName, year.toString(),tableName, year.toString());
		if(count==null)
		{
			//无
			count = jo.queryForObject("select max(batchNo) from uploadRecords where (state<>0 or state<>4) and tableName=? and SUBSTRING(startTime,1,4)=?", Long.class,
					tableName, year.toString());
			if(count==null)
				count=0L;
		}
		else
		{
			//有
			count--;
		}
		Integer uploadCycle = jo.queryForObject("select uploadCycle from dataTable where tableName=?", Integer.class, tableName);
		return getNextBatch(year, count, uploadCycle);

	}

	/**
	 * 拆分出这个函数的目的是为了便于测试，测试是可以只测试这个函数，上面那个函数与数据库相关。
	 * 
	 * @param year
	 * @param count
	 * @param uploadCycle
	 * @return
	 */
	private NextBatch getNextBatch(Integer year, Long count, Integer uploadCycle) {
		NextBatch nextBatch = new NextBatch();
		nextBatch.uploadCycle = uploadCycle;
		// 确定batchNo
		if (nextBatch.uploadCycle == 0) {// 实时上传
			nextBatch.batchNo = count.intValue() + 1;
		} else {
			if (count < 12 / nextBatch.uploadCycle) {
				nextBatch.batchNo = count.intValue() + 1;
			}
		}
		if (nextBatch.batchNo != null) {
			// 确定startTime和endTime
			if (nextBatch.uploadCycle == 0) {
				// 实时上传，默认当前月份
				Calendar c = Calendar.getInstance();
				c.set(Calendar.YEAR, year);
				//c.add(Calendar.MONTH, -1);
				Integer startMonth = c.get(Calendar.MONTH) + 1;
				nextBatch.startTime = c.get(Calendar.YEAR) + "-" + (startMonth >= 10 ? startMonth : "0" + startMonth);
				//c.add(Calendar.MONTH, 1);
				Integer endMonth = c.get(Calendar.MONTH) + 1;
				nextBatch.endTime = c.get(Calendar.YEAR) + "-" + (endMonth >= 10 ? endMonth : "0" + endMonth);
			} else {
				// 非实时上传，计算批次对应时间
				Calendar c = Calendar.getInstance();
				c.set(Calendar.YEAR, year);
				c.set(Calendar.MONTH, nextBatch.uploadCycle * (nextBatch.batchNo - 1));
				Integer startMonth = c.get(Calendar.MONTH) + 1;
				nextBatch.startTime = c.get(Calendar.YEAR) + "-" + (startMonth >= 10 ? startMonth : "0" + startMonth);
				c.set(Calendar.MONTH, nextBatch.uploadCycle * nextBatch.batchNo-1);
				Integer endMonth = c.get(Calendar.MONTH) + 1;
				nextBatch.endTime = c.get(Calendar.YEAR) + "-" + (endMonth >= 10 ? endMonth : "0" + endMonth);
			}
		}
		if (log.isDebugEnabled()) {
			log.debug("year=" + year + ",count=" + count + ",uploadCycle=" + nextBatch.uploadCycle);
			log.debug("batchNo=" + nextBatch.batchNo);
			log.debug("startTime=" + nextBatch.startTime + ",endTime=" + nextBatch.endTime);
		}
		return nextBatch;
	}

	public static void main(String args[]) {
		ExcelService service = new ExcelService();
		service.getNextBatch(2015, 0L, 0);
	}

	/**
	 * 根据上传数据表名和上传id生成数据excel
	 * 
	 * @param tableName
	 * @param uploadId
	 * @return
	 */
	public Excel createExcelFromTable(String tableName, Integer uploadId) {
		DataList columnList = tableService.getColumnList(tableName);

		DataList tableData = tableService.getTableData(tableName, uploadId);
		
		return new Excel(tableData, columnList);
	}
	/**
	 * 根据表名和数据所属期生成excel
	 * @param tableName
	 * @param begintime
	 * @param deadline
	 * @return
	 */
	public Excel createExcelFromTable(String tableName,String begintime, String deadline) {
		DataList columnList = tableService.getColumnList(tableName);
		DataList tableData = queryService.query("select * from ["+tableName+"] where uploadId in (select id from uploadRecords where tableName=? and startTime>=? and endTime<=?)", tableName,begintime,deadline);
		return new Excel(tableData, columnList);
	}

	public Excel createExcelFromTable(String tableName, String columnName, String compareName, String conditionName,
			String columnType) {
		if(compareName.equals("like"))
			conditionName="%"+conditionName+"%";
		log.debug(columnName);
		log.debug(compareName);
		log.debug(columnType);
		
		DataList columnList = tableService.getColumnList(tableName);
		if(columnType.equals("0"))
		{
			DataList tableData = queryService.query("select * from ["+tableName+"] where convert(float,["+columnName+"])"+compareName+"?",conditionName);
			return new Excel(tableData, columnList);
		}
		else
		{
			DataList tableData = queryService.query("select * from ["+tableName+"] where ["+columnName+"]"+compareName+"'"+conditionName+"'");
			return new Excel(tableData, columnList);
		}

		
	}
	
	public Excel createExcelFromTable(String tableName, String condition) {
		DataList columnList = tableService.getColumnList(tableName);
		JSONArray jArray = JSONArray.fromObject(condition);
		List<Map<String, Object>> mapList=new ArrayList<Map<String, Object>>(jArray);
		WebResponse wr=queryService.advanceQuery(tableName, mapList, 0, 9999999);
		DataList tableData = (DataList) wr.get("value");
		return new Excel(tableData, columnList);
	}
	
	private void saveData(String tableName, int uploadId, DataList dataList) {
		for (int i = 0; i < dataList.size(); i += 1000) {
			log.debug("保存第" + i + "条数据");
			String sql = dataList.toInsertSQL(i, i + 1000, tableName, uploadId);
			jo.update(sql);
		}
	}
	

	private int insertUploadRecord(String uploads, String tableName, Integer batchNo, String startTime, String endTime) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jo.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
				String sql = "insert into uploadRecords(tableName,uploads,uploadTime,startTime,endTime,state,batchNo) values(?,?,?,?,?,?,?)";
				PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
				ps.setString(1, tableName);
				ps.setString(2, uploads);
				ps.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
				ps.setString(4, startTime);
				ps.setString(5, endTime);
				ps.setInt(6, 1);
				ps.setInt(7, batchNo);
				return ps;
			}

		}, keyHolder);
		return keyHolder.getKey().intValue();
	}

	private List<String> checkColumn(DataList columnList1, DataList columnList2) {
		List<String> noExist = new ArrayList<String>();
		for (DataRow row1 : columnList1) {
			String text1 = row1.get("text").toString();
			boolean flag = false;
			for (DataRow row2 : columnList2) {
				String text2 = row2.get("text").toString();
				if (text1.equals(text2)) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				noExist.add(text1);
			}
		}
		return noExist;

	}

	/**
	 * 上传数据
	 * 
	 * @param inputStream
	 * @param uploads
	 * @param tableName
	 * @param year
	 * @param batchNo
	 * @param startTime
	 * @param endTime
	 * @param check
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadData(InputStream inputStream, String uploads, String tableName, Integer year, Integer batchNo, String startTime,
			String endTime, Boolean check) throws IOException {
		DataList dataList;
		UploadDataResult result = new UploadDataResult();
		// 检查上传批号信息正确性
		if (!checkBatch(tableName, year, batchNo, startTime, endTime)) {
			result.success = false;
			result.errorCode = 0;// 上传批次或者所属期错误，重新生成上传批次和所属期
			return result;
		}
		Excel excel = new Excel(inputStream);
		Integer batchNoFromExcel = excel.readBatchNo();
		// 检查excel表中信息的正确性
		if (!batchNo.equals(batchNoFromExcel)) {
			result.success = false;
			result.errorCode = 1; // 上传文件中的批次与生成的上传批次不同，请检查上传文件
			result.setFileds("name", "input", "expected");
			result.addData("上传批次", batchNoFromExcel, batchNo);
			return result;
		}
		//判断是否是统计局的表
		if(tableName.equals("统计局涉税信息表一（生产总值）")||tableName.equals("统计局涉税信息表二（工业增加值）")||tableName.equals("统计局涉税信息表三（交通）")||tableName.equals("统计局涉税信息表四（投资）")||tableName.equals("统计局涉税信息表五（房地产）")||tableName.equals("统计局涉税信息表六（社零）")||tableName.equals("统计局涉税信息表七（人民生活物价）")||tableName.equals("统计局涉税信息表八（工业总产值）")) {
			 dataList = excel.readExcelContent_field1(2);			
			int uploadId = insertUploadRecord(uploads, tableName, batchNo, startTime, endTime);
			String value="'"+JSONArray.fromObject(dataList).toString()+"'";
			jo.update(String.format("insert into [%s] (value,uploadId) values (%s,%s)", tableName,value,uploadId));
			result.dataList=dataList;
			result.success = true;
			result.uploadId = uploadId;
			return result;			
		}
		else {
		// 检查数据列名
		DataList columnListFromDB = tableService.getColumnList(tableName);
		DataList columnListFromExcel = excel.readExcelColumns();
		List<String> noExistInExcel = checkColumn(columnListFromDB, columnListFromExcel);
		List<String> noExistInDB = checkColumn(columnListFromExcel, columnListFromDB);
		if (noExistInExcel.size() != 0 || noExistInDB.size() != 0) {
			result.success = false;
			result.errorCode = 2; // 上传文件中的数据项与系统需要的不一致，请检查上传文件
			result.setFileds("name", "value");
			if (noExistInExcel.size() != 0)
				result.addData("系统需要但上传文件中不存在", noExistInExcel);
			if (noExistInDB.size() != 0)
				result.addData("上传文件中存在但系统不需要", noExistInDB);
			return result;
		}
		
		 dataList = excel.readExcelContent();
		 
		
		// TODO 检查数据字段
		if (check) {
			Map<String, DataRow> columnMap = tableService.getColumnMap(tableName);
			result.setFileds("row", "col", "value", "type");
			for (int i = 0; i < dataList.size(); i++) {
				DataRow row = dataList.get(i);
				for (String columnName : row.keySet()) {
					DataRow column = columnMap.get(columnName);
					if (column.get("type").toString().startsWith("float")) {
						// 类型为数字
						try {
							Float.parseFloat(row.get(columnName).toString());
						} catch (Exception e) {
							result.addData(i + 4, columnName, row.get(columnName).toString(), "数字");
						}
					}
				}
			}
			if (result.data.size() != 0) {
				result.success = false;
				result.errorCode = 3;
				return result;
			}
		}
		
		// 插入数据
		int uploadId = uploadData(uploads, tableName, batchNo, startTime, endTime, dataList);
		result.dataList=dataList;
		result.success = true;
		result.uploadId = uploadId;
		return result;
		}
		
	}

	@Transactional
	private int uploadData(String uploads, String tableName, Integer batchNo, String startTime, String endTime, DataList dataList) {
		int uploadId = insertUploadRecord(uploads, tableName, batchNo, startTime, endTime);
		saveData(tableName, uploadId, dataList);
		//updateEnterpriseInfo(tableName);
		return uploadId;
	}
	@Transactional
	public void updateEnterpriseInfo() {
//		jo.update("IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[企业信息]') AND type in (N'U')) DROP TABLE [企业信息]");
//		jo.update("select * into [企业信息] from [企业信息视图]");
		
		jo.update("delete from [企业信息]");
		jo.update("insert into 企业信息([社会信用代码(纳税人识别号)]\n" + 
				"      ,[纳税人名称]\n" + 
				"      ,[纳税人状态]\n" + 
				"      ,[组织机构代码]\n" + 
				"      ,[法定代表人（负责人、业主）姓名]\n" + 
				"      ,[法定代表人（负责人、业主）身份证件种类]\n" + 
				"      ,[法定代表人（负责人、业主）身份证件号码]\n" + 
				"      ,[主管税务所（科、分局）]\n" + 
				"      ,[行业门类[地税]]]\n" + 
				"      ,[行业大类[地税]]]\n" + 
				"      ,[行业中类[地税]]]\n" + 
				"      ,[行业小类[地税]]]\n" + 
				"      ,[生产经营地址]\n" + 
				"      ,[国地管户类型]\n" + 
				"      ,[从业人数]\n" + 
				"      ,[国有控股类型]\n" + 
				"      ,[一般纳税人标志]\n" + 
				"      ,[国有投资比例[国税]]]) (select [社会信用代码[地税]]], [纳税人名称[地税]]],[纳税人状态[地税]]],[组织机构代码[地税]]], [法定代表人（负责人、业主）姓名[地税] ,[法定代表人（负责人、业主）身份证件种类[地税],[法定代表人（负责人、业主）身份证件号码[地税]]],[主管税务所（科、分局）[地税]]],\n" + 
				"       [行业门类[地税]]] ,[行业大类[地税]]],[行业种类[地税]]],[行业小类[地税]]],[生产经营地址[地税]]],[国地管户类型[地税]]],[从业人数[地税]]],[国有控股类型[地税]]],[一般纳税人标志[地税]]],[国有投资比例[国税]]] from [企业信息视图国地税相同] where [社会信用代码[地税]]] is not null)");
		jo.update("insert into 企业信息([社会信用代码(纳税人识别号)]\n" + 
				"      ,[纳税人名称]\n" + 
				"      ,[纳税人状态]\n" + 
				"      ,[组织机构代码]\n" + 
				"      ,[法定代表人（负责人、业主）姓名]\n" + 
				"      ,[法定代表人（负责人、业主）身份证件种类]\n" + 
				"      ,[法定代表人（负责人、业主）身份证件号码]\n" + 
				"      ,[主管税务所（科、分局）]\n" + 
				"      ,[行业门类[地税]]]\n" + 
				"      ,[行业大类[地税]]]\n" + 
				"      ,[行业中类[地税]]]\n" + 
				"      ,[行业小类[地税]]]\n" + 
				"      ,[生产经营地址]\n" + 
				"      ,[国地管户类型]\n" + 
				"      ,[从业人数]\n" + 
				"      ,[国有控股类型]\n" + 
				"      ,[一般纳税人标志]\n" + 
				"      ,[国有投资比例[国税]]]) (select [社会信用代码[国税]]], [纳税人名称[国税]]],[纳税人状态[国税]]],[组织机构代码[国税]]] ,[法定代表人姓名[国税]]], [法定代表人身份证件类型[国税]]], [法定代表人身份证号码[国税]]], [主管税务所（科、分局）[国税]]],\n" + 
				"       [行业门类[地税]]] ,[行业大类[地税]]],[行业种类[地税]]],[行业小类[地税]]],[生产经营地址[国税]]],[国地管户类型[国税]]],[从业人数[国税]]],[国有控股类型[国税]]],[一般纳税人标志[地税]]],[国有投资比例[国税]]] from [企业信息视图国地税相同] where [社会信用代码[地税]]] is null and [社会信用代码[国税]]] is not null)");
	}

	@Transactional
	public void uploadZipFiles(List<String> tableNames, List<InputStream> streams, String uploads, String startTime, String endTime)
			throws UnsupportedEncodingException, IOException {
		Integer year = Integer.parseInt(startTime.substring(0, 4));
		for (int i = 0; i < tableNames.size(); i++) {
			NextBatch nextBatch = getNextBatch(tableNames.get(i), year);
			ZipInputStream zin = new ZipInputStream(streams.get(i));
			zin.getNextEntry();
			DataList dataList = Readhtml.getList(zin);
			zin.close();
			uploadData(uploads, tableNames.get(i), nextBatch.batchNo, startTime, endTime, dataList);

		}
	}
	/**
	 * 根据uploadId删除对应数据
	 * @param uploadId
	 * @param tableName
	 */
	@Transactional
	public void deleteByUploadId(Integer uploadId, String tableName) {
		jo.update("delete from [" + tableName + "] where uploadId=?",uploadId);
		jo.update("update uploadRecords set state=4 where id=?",uploadId);
	}

public static void main(){
	ExcelService s = new ExcelService();
	System.out.println(s.createExcelFromTable("区房管局涉税信息表一（新建商品房销售信息）", "金额", ">", "0", "0"));
}
	
	

}
