package com.bancai.controller;

import java.io.IOException;
import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bancai.db.Condition;
import com.bancai.service.ExcelService;
import com.bancai.service.QueryService;
import com.bancai.service.Upload_Data_Service;
import com.bancai.util.Excel;
import com.bancai.vo.WebResponse;

@RestController
public class DataHistoryController {
	@Autowired
	private ExcelService excelService;
	@Autowired
	private QueryService queryService;
	Logger log=Logger.getLogger(DataHistoryController.class);

	@Autowired
	private Upload_Data_Service Upload_Data_Service;
	/**
	 * 查询当前用户提交的表
	 * @param session
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping(value = "/org/data/historyExcelList.do")
	public WebResponse historyExcelList(Integer start, Integer limit, HttpSession session, String tableName, String startTime,
			String endTime) throws ParseException {
		log.debug(startTime+" "+endTime);
		Condition c=new Condition();
		String loginName = (String) session.getAttribute("loginName");
		if (loginName.length() != 0) {
			c.and(new Condition("uploads", "=", loginName));
		}
		if (tableName.length() != 0) {
			c.and(new Condition("tableName", "=", tableName));
		}
		if (startTime.length() != 0) {
			c.and(new Condition("startTime", ">=", startTime));
		}
		if (endTime.length() != 0) {
			c.and(new Condition("endTime", "<=", endTime));
		}
		WebResponse wr=queryService.queryPage(start, limit, c, "uploadRecords");
		return wr;
	}


//	@RequestMapping(value = "/update_Data_By_Edit.do")
//	public boolean uploadDataByEdit(String tableName,String field , String value,String id){
//
//		String sql = "update "+tableName+" set "+field +"="+value +" where id ="+id;
//		Upload_Data_Service.updateData(sql);
//		return true;
//	}


	@RequestMapping(value="/downloadExcelbyID.do")
	public void downloadExcelbyID(HttpServletRequest request,HttpServletResponse response,String tableName,int id) throws IOException {
		Excel excelFile=excelService.createExcelFromTable(tableName, id);
		log.debug("tableName:"+tableName);
		log.debug("id"+id);
		excelFile.download(request,response, tableName);
	}
	@RequestMapping(value="/downloadExcelbyTime.do")
	public void downloadExcelbyID(HttpServletRequest request,HttpServletResponse response,String tableName,String begintime, String deadline) throws IOException {
		log.debug("tableName:"+tableName);
		log.debug("begintime"+begintime);
		log.debug("deadline"+deadline);
		Excel excelFile=excelService.createExcelFromTable(tableName, begintime,deadline);
		excelFile.download(request,response, tableName);
	}
	@RequestMapping(value="/downExcelbyCondition.do")
	public void downExcelbyCondition(HttpServletRequest request,HttpServletResponse response,String tableName,String condition) throws IOException {
		log.debug("7777777"+condition);
		Excel excelFile=excelService.createExcelFromTable(tableName, condition);
		excelFile.download(request,response, tableName);
	}
	/**
	 * 高级查询下载excel，只有一个表名和一个条件
	 * @param request
	 * @param response
	 * @param tableName
	 * @param condition
	 * @throws IOException
	 */
	@RequestMapping(value="/downExcelbyTableNameAndCondition.do")
	public void downExcelbyTableNameAndCondition(HttpServletRequest request,HttpServletResponse response,String tableName,String columnName,String compareName,String conditionName,String columnType) throws IOException {
		log.debug("7777777"+columnName);
		log.debug("7777777"+compareName);
		log.debug("7777777"+conditionName);
		log.debug("7777777"+columnType);
//		Excel excelFile=excelService.createExcelFromTable(tableName,columnName,compareName,conditionName,columnType);
		Excel excelFile=excelService.createExcelFromTable(tableName,columnName,compareName,conditionName,columnType);

		excelFile.download(request,response, tableName);
	}

}
