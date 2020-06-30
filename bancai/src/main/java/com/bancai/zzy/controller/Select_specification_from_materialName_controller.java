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
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		mysqlcondition c=new mysqlcondition();
		if (materialName.length() != 0) {
			c.and(new mysqlcondition("materialName", "=", materialName));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

//	/*
//	 * 查询出入库记录
//	 * */
//	@RequestMapping(value = "/oldpanel/oldpanel_query_records.do")
//	public WebResponse materialDataList(Integer start, Integer limit, String projectId,
//										String optionType, String startTime, String endTime, String username) throws ParseException {
//		//log.debug(startWidth+" "+endWidth);
//		if(null==start||start.equals("")) start=0;
//		if(null==limit||limit.equals("")) limit=50;
//		String tableName = "oldpanellog";
////		System.out.println(startWidth);
////		System.out.println(endWidth);
////
//		mysqlcondition c=new mysqlcondition();
//		if (projectId.length() != 0) {
//			c.and(new mysqlcondition("projectId", "=", projectId));
//		}
//		if (optionType.length() != 0) {
//			c.and(new mysqlcondition("type", "=", optionType));
//		}
//		if (startTime.length() != 0) {
//			c.and(new mysqlcondition("time", ">=", startTime));
//		}
//		if (endTime.length() != 0) {
//			c.and(new mysqlcondition("time", "<=", endTime));
//		}
//		if (username.length() != 0) {
//			c.and(new mysqlcondition("username", "=", username));
//		}
//		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
//		return wr;
//	}
	/*
	 * 旧板查询出入库记录
	 * */
	@RequestMapping(value = "/oldpanel/oldpanel_query_records.do")
	public WebResponse oldpanelDataList1(String start, String limit, String projectId,
										 String type, String page,String startTime, String endTime, String operator) throws ParseException {
		//log.debug(startWidth+" "+endWidth);
		int thisPage=1;
		int thisStart=0;
		int thisLimit=25;
		if(null==page||page.equals("")){
			thisPage=1;
		}else {
			thisPage=Integer.parseInt(page);
		}
		if(null==start||start.equals("")||null==limit||limit.equals("")){
			thisStart=0;
			thisLimit=25;
		}else {
			thisLimit=Integer.parseInt(limit);
			thisStart=(thisPage-1)*thisLimit;
		}
		String tableName = "oldpanellog_projectname_buildingname";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (null!=projectId&&projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (null!=type&&type.length() != 0) {
			c.and(new mysqlcondition("type", "=", type));
		}
		if (null!=startTime&&startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (null!=endTime&&endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (null!=operator&&operator.length() != 0) {
			c.and(new mysqlcondition("operator", "=", operator));
		}
		WebResponse wr=queryAllService.queryDataPage(thisStart, thisLimit, c, tableName);
		return wr;
	}
	/*
	 * 原材料查询出入库记录
	 * */
	@RequestMapping(value = "/material/material_query_records.do")
	public WebResponse materialDataList1(String start, String limit, String projectId,
										String type, String page,String startTime, String endTime, String operator) throws ParseException {
		//log.debug(startWidth+" "+endWidth);
		int thisPage=1;
		int thisStart=0;
		int thisLimit=25;
		if(null==page||page.equals("")){
			thisPage=1;
		}else {
			thisPage=Integer.parseInt(page);
		}
		if(null==start||start.equals("")||null==limit||limit.equals("")){
			thisStart=0;
			thisLimit=25;
		}else {
			thisLimit=Integer.parseInt(limit);
			thisStart=(thisPage-1)*thisLimit;
		}
		String tableName = "materiallog_projectname_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (null!=projectId&&projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (null!=type&&type.length() != 0) {
			c.and(new mysqlcondition("type", "=", type));
		}
		if (null!=startTime&&startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (null!=endTime&&endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (null!=operator&&operator.length() != 0) {
			c.and(new mysqlcondition("operator", "=", operator));
		}
		WebResponse wr=queryAllService.queryDataPage(thisStart, thisLimit, c, tableName);
		return wr;
	}
	/*
	 * 原材料查询出入库记录
	 * */
	@RequestMapping(value = "/material/material_statistic_records.do")
	public WebResponse materialStatisticRecords(Integer start, Integer limit,
										 String optionType, String startTime, String endTime, String username) throws ParseException {
		//log.debug(startWidth+" "+endWidth);
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "materiallog_materiallogdetail_user_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (username.length() != 0) {
			c.and(new mysqlcondition("username", "=", username));
		}
		if (username.length() != 0) {
			c.and(new mysqlcondition("type", "=", optionType));
		}
		WebResponse wr=queryAllService.queryDataPage_statistic(start, limit, c, tableName);
		return wr;
	}
	/*
	 * 原材料查询出入库记录
	 * */
	@RequestMapping(value = "/oldpanel/oldpanel_statistic_records.do")
	public WebResponse oldpanelStatisticRecords(Integer start, Integer limit,
												String optionType, String startTime, String endTime, String username) throws ParseException {
		//log.debug(startWidth+" "+endWidth);
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "oldpanellog_oldpanellogdetail_user";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (startTime.length() != 0) {
			c.and(new mysqlcondition("time", ">=", startTime));
		}
		if (endTime.length() != 0) {
			c.and(new mysqlcondition("time", "<=", endTime));
		}
		if (username.length() != 0) {
			c.and(new mysqlcondition("username", "=", username));
		}
		if (username.length() != 0) {
			c.and(new mysqlcondition("type", "=", optionType));
		}
		WebResponse wr=queryAllService.queryDataPage_statistic_oldpanel(start, limit, c, tableName);
		return wr;
	}
	/*
	 * 原材料报警
	 * */
	@RequestMapping(value = "/material/material_alarm.do")
	public WebResponse materialAlarm(Integer start, Integer limit, String threshold) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		if(null==threshold||threshold.equals("")) threshold="50";
		String tableName = "material";
		mysqlcondition c=new mysqlcondition();
		if (threshold.length() != 0) {
			c.and(new mysqlcondition("number", "<=", threshold));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}
	/*
	 * 原成本核算
	 * sql视图：
	 * select `designlist`.`projectId` AS `projectId`,
	 * `designlist`.`buildingId` AS `buildingId`,`designlist`.
	 * `productName` AS `productName`,`product`.`id` AS `productID`,
	 * `building`.`buildingNo` AS `buildingNo`,`project`.`projectName`
	 * AS `projectName`,`newpanelmateriallist`.`materialName` AS `newPanelMaterialName`,
	 * `newpanelmateriallist`.`materialCount` AS `newPanelMaterialCount`,`oldpanelmateriallist`.
	 * `oldpanelName` AS `oldpanelName`,`oldpanelmateriallist`.`materialName` AS `oldPanelMaterialName`,
	 * `oldpanelmateriallist`.`materialCount` AS `oldPanelMaterialCount`
	 * from ((((`designlist` join `product`) join (`building` join `project`
	 * on((`building`.`projectId` = `project`.`id`)))) join `newpanelmateriallist`)
	 * join `oldpanelmateriallist`) where ((`designlist`.`productName` = `product`.`productName`)
	 * and (`designlist`.`buildingId` = `building`.`id`) and (`designlist`.`projectId` = `project`.`id`)
	 * and (`product`.`id` = `newpanelmateriallist`.`productId`) and
	 * (`product`.`id` = `oldpanelmateriallist`.`productId`))
	 * */
	@RequestMapping(value = "/project/buildingproductcost.do")
	public WebResponse buildingProductCost(Integer start, Integer limit, String projectId,
										   String buildingId) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "designlist_product_old_new_materiallist";
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (buildingId.length() != 0) {
			c.and(new mysqlcondition("buildingId", "=", projectId));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

	@RequestMapping(value = "/project/project_building_info.do")
	public WebResponse project_building_info(Integer start, Integer limit, String projectId,
										   String storeLeader,String financeLeader,
											 String purchaseLeader,String planLeader,String endTime,
											 String startTime) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "building_project_view";
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (storeLeader.length() != 0) {
			c.and(new mysqlcondition("storeLeader", "=", storeLeader));
		}
		if (financeLeader.length() != 0) {
			c.and(new mysqlcondition("financeLeader", "=", financeLeader));
		}
		if (purchaseLeader.length() != 0) {
			c.and(new mysqlcondition("purchaseLeader", "=", purchaseLeader));
		}
		if (planLeader.length() != 0) {
			c.and(new mysqlcondition("planLeader", "=", planLeader));
		}
		if (endTime.length() != 0) {
			c.and(new mysqlcondition("endTime", "<=", endTime));
		}
		if (startTime.length() != 0) {
			c.and(new mysqlcondition("startTime", ">=", startTime));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

	@RequestMapping(value = "/material/material_outbound.do")
	public WebResponse material_outbound(Integer start, Integer limit, String projectId,
											 String pickName,String pickTime) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "materialreceivelist_material";
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (pickName.length() != 0) {
			c.and(new mysqlcondition("storeLeader", "=", pickName));
		}
		if (pickTime.length() != 0) {
			c.and(new mysqlcondition("financeLeader", "=", pickTime));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

}
