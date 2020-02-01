package com.bancai.zzy.controller;

import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;

@RestController
public class Select_specification_from_materialName_controller {

	@Autowired
	private QueryAllService queryAllService;

	/*
	 * 根据原材料名称如400U找出其所有的规格。（原材料领料模块）周洁
	 * */
	@RequestMapping(value="/material/findMaterial_SpecificationList.do")
	public WebResponse findMaterialbasicinfoList(Integer start, Integer limit,String materialName) throws IOException {
		String tableName = "material";
		mysqlcondition c=new mysqlcondition();
		if (materialName.length() != 0) {
			c.and(new mysqlcondition("materialName", "=", materialName));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

	/*
	 * 查询出入库记录
	 * */
	@RequestMapping(value = "/oldpanel/oldpanel_query_records.do")
	public WebResponse materialDataList(Integer start, Integer limit, String projectId,
										String optionType, String startTime, String endTime, String userId) throws ParseException {
		//log.debug(startWidth+" "+endWidth);

		String tableName = "oldpanellog_projectname";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (optionType.length() != 0) {
			c.and(new mysqlcondition("type", "=", optionType));
		}
		if (startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (userId.length() != 0) {
			c.and(new mysqlcondition("userId", "=", userId));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

	/*
	 * 原材料查询出入库记录
	 * */
	@RequestMapping(value = "/material/material_query_records.do")
	public WebResponse materialDataList1(Integer start, Integer limit, String projectId,
										String optionType, String startTime, String endTime, String username) throws ParseException {
		//log.debug(startWidth+" "+endWidth);

		String tableName = "materiallog_projectname";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (optionType.length() != 0) {
			c.and(new mysqlcondition("type", "=", optionType));
		}
		if (startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (username.length() != 0) {
			c.and(new mysqlcondition("username", "=", username));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

}
