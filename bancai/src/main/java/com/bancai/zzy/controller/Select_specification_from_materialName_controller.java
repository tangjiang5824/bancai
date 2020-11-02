package com.bancai.zzy.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.service.QueryService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class Select_specification_from_materialName_controller {

	@Autowired
	private QueryAllService queryAllService;
	@Autowired
	private QueryService queryService;
	@Autowired
	private InsertProjectService insertProjectService;

	//旧板仓库出库入库回滚
	//类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
	@RequestMapping(value = "/oldpanel/backOldpanelStore.do")
	@Transactional
	public boolean backOldpanelStore(String oldpanellogId,HttpSession session ,String operator,String type,String whichStore) throws JSONException {
		String which_logdetail;
		String which_log;
		String which_logId;
		String which_storeId;
		String which_Id;
		String which_store;
		if(whichStore.contains("oldpanel"))
		{
			which_logdetail="oldpanel_logdetail";
			which_log="oldpanel_log";
			which_logId="oldpanellogId";
			which_storeId="oldpanelstoreId";
			which_Id="oldpanelId";
			which_store="oldpanel_store";
		}
		else if(whichStore.contains("preprocess"))
		{
			which_logdetail="preprocess_logdetail";
			which_log="preprocess_log";
			which_logId="preprocesslogId";
			which_storeId="preprocessstoreId";
			which_Id="preprocessId";
			which_store="preprocess_store";
		}
		else if(whichStore.contains("backproduct"))
		{
			which_logdetail="backproduct_logdetail";
			which_log="backproduct_log";
			which_logId="backproductlogId";
			which_storeId="backproductstoreId";
			which_Id="backproductId";
			which_store="backproduct_store";
		}
		else if(whichStore.contains("product"))
		{
			which_logdetail="product_logdetail";
			which_log="product_log";
			which_logId="productlogId";
			which_storeId="productstoreId";
			which_Id="productId";
			which_store="product_store";
		}
		else {
			return false;
		}
		String sql_find_log_detail="select * from "+which_logdetail+" where "+which_logId+"=? and isrollback<>1";
		String userid = (String) session.getAttribute("userid");

		Date date=new Date();
		SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String update_log="update "+which_log+" set isrollback=1 where id=?";
		//把isrollback改为1
		insertProjectService.insertIntoTableBySQL(update_log,oldpanellogId);//更新log表

		//log主键
		String sql_insert_new_log="insert into "+which_log+" (type,userId,time,operator,isrollback) values(?,?,?,?,?)";
		int main_key=0;
		//插入新的log
		if (type.equals("0")) main_key= insertProjectService.insertDataToTable(sql_insert_new_log,"3",userid,simpleDateFormat.format(date),operator,"1");


		DataList list=queryService.query(sql_find_log_detail,oldpanellogId);//通过oldpanellogId找对应的oldpanellogdetail
		for(int i=0;i<list.size();i++){
			String oldpanelstoreId=list.get(i).get(which_storeId)+"";
			String oldpanelName="";
			String specification="";
			String oldpanelId=list.get(i).get(which_Id)+"";

			//if(null!=list.get(i).get("oldpanelName")) oldpanelName=list.get(i).get("oldpanelName")+"";
			//if(null!=list.get(i).get("specification")) specification=list.get(i).get("specification")+"";
			//if(null!=list.get(i).get("oldpanelId")) oldpanelId=list.get(i).get("oldpanelId")+"";
			String count=list.get(i).get("count")+"";
			//int count_to_op=Integer.valueOf(count);
			if(type.equals("0")){
				//撤销入库

				//进行回滚出库
				String sql_find_list="select * from "+which_store+" where id=?";
				DataList count_list=queryService.query(sql_find_list,oldpanelstoreId);
				//if(count_list.size()!=1||Integer.valueOf(count_list.get(0).get("count")+"")!=count_to_op) return  false;
				String sql_update_count="update "+which_store+" set countUse=countUse-?,countStore=countStore-? where id=?";
				insertProjectService.insertIntoTableBySQL(sql_update_count,count,count,oldpanelstoreId);

				//修改完成撤销的原logdetail
				String detail_id=list.get(i).get("id")+"";
				String update_detail_isrollback="update "+which_logdetail+" set isrollback=1 where id=?";
				insertProjectService.insertIntoTableBySQL(update_detail_isrollback,detail_id);
				//插入新的detail
				String sql_insert_new_detial="insert into "+which_logdetail+" (count,"+which_logId
						+","+which_Id+","+which_storeId+",isrollback) values(?,?,?,?,?)";
				insertProjectService.insertIntoTableBySQL(sql_insert_new_detial,count,main_key+"",oldpanelId,oldpanelstoreId,"1");
			}
		}

		return true;
	}


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
	 * 旧板出库界面查询出入库记录
	 * */
	@RequestMapping(value = "/oldpanel/outbound_query_records.do")
	public WebResponse outboundQueryRecords(String start, String limit,String page, String type,
											String startTime, String endTime, String operator,String tableName) throws ParseException {
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

		mysqlcondition c=new mysqlcondition();

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
	public WebResponse materialDataList1(Integer start,Integer limit, String projectId,
										String type,String startTime, String endTime, String operator,String tableName)  {
		//log.debug(startWidth+" "+endWidth);
		//String tableName = "materiallog_projectname_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
		mysqlcondition c=new mysqlcondition();
		if (null!=projectId&&projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (null!=type&&type.length() != 0) {
			//type = "0";
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
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
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
	/*
	 * 返回项目整体匹配结果
	 * */
	@RequestMapping(value="/project/findProjectMatchResult.do")
	public WebResponse findProjectMatchResult(String start, String limit,String page,String projectId,String buildingId) throws ParseException {
		String tableName = "projectMatchResult";
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
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (buildingId.length() != 0) {
			c.and(new mysqlcondition("buildingId", "=", buildingId));
		}
		WebResponse wr=queryAllService.queryDataPage(thisStart, thisLimit, c, tableName);
		return wr;
	}
	//查询旧板匹配结果
	@RequestMapping(value = "/project/queryBackproductMatchResult.do")
	public WebResponse queryBackproductMatchResult(Integer start, Integer limit, String projectId,
										 String buildingId,String positionId) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "query_backproduct_match_result";
		mysqlcondition c=new mysqlcondition();
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (buildingId.length() != 0) {
			c.and(new mysqlcondition("buildingId", "=", buildingId));
		}
		if (positionId.length() != 0) {
			c.and(new mysqlcondition("buildingpositionId", "=", positionId));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}
	//查询新板匹配结果
	@RequestMapping(value = "/project/queryNewPanelMatchResult.do")
	public WebResponse queryNewPanelMatchResult(Integer start, Integer limit, String projectId,
												   String buildingId,String buildingpositionId,String madeBy) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		String tableName = "query_match_result";
		//String madeBy = "4";
		mysqlcondition c=new mysqlcondition();
		if (madeBy!=null&&madeBy.length() != 0) {
			c.and(new mysqlcondition("productMadeBy", "=", madeBy));
		}
		if (projectId.length() != 0) {
			c.and(new mysqlcondition("projectId", "=", projectId));
		}
		if (buildingId.length() != 0) {
			c.and(new mysqlcondition("buildingId", "=", buildingId));
		}
		if (buildingpositionId.length() != 0) {
			c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}
	@RequestMapping(value = "/oldpanel/query_data.do")
	public WebResponse query_data(Integer start, Integer limit, String tableName,String oldpanelType,String productType,
										 String maxCount,String minCount,String warehouseName) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		mysqlcondition c=new mysqlcondition();
		if(tableName.contains("oldpanel"))
		{
			if (oldpanelType.length() != 0) {
				c.and(new mysqlcondition("oldpanelTypeName", "=", oldpanelType));
			}
		}
		if(tableName.contains("product")||tableName.contains("process"))
		{
			if (productType.length() != 0) {
				c.and(new mysqlcondition("productTypeName", "=", productType));
			}
		}
		if (warehouseName.length() != 0) {
			c.and(new mysqlcondition("warehouseName", "=", warehouseName));
		}
		if (maxCount.length() != 0) {
			c.and(new mysqlcondition("countUse", "<=", maxCount));
		}
		if (minCount.length() != 0) {
			c.and(new mysqlcondition("countUse", ">=", minCount));
		}
		if (maxCount.length() != 0) {
			c.and(new mysqlcondition("countStore", "<=", maxCount));
		}
		if (minCount.length() != 0) {
			c.and(new mysqlcondition("countStore", ">=", minCount));
		}
		c.and(new mysqlcondition("countStore", ">", "0"));
		return queryAllService.queryDataPage(start, limit, c, tableName);
	}
	//查询新板匹配规则
	@RequestMapping(value = "/project/queryNewPanelMatchRules.do")
	public WebResponse queryNewPanelMatchRules(Integer start, Integer limit, Integer productTypeId,
											   Integer materialTypeId,Integer productFormatId,String tableName) throws ParseException {
		if(null==start||start.equals("")) start=0;
		if(null==limit||limit.equals("")) limit=50;
		//String madeBy = "4";
		mysqlcondition c=new mysqlcondition();
		if (productTypeId!=null) {
			c.and(new mysqlcondition("productTypeId", "=", productTypeId));
		}
		if (materialTypeId!=null) {
			c.and(new mysqlcondition("materialTypeId", "=", materialTypeId));
		}
		if (productFormatId!=null) {
			c.and(new mysqlcondition("productFormatId", "=", productFormatId));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

}
