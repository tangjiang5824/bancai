package controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import db.Condition;
import domain.DataList;
import domain.DataRow;
import net.sf.json.JSONArray;
import service.EnterpriseService;
import service.QueryService;
import util.MapListUtil;
import vo.WebResponse;
@RestController
public class EnterpriseController {
	Logger log = Logger.getLogger(EnterpriseController.class);
	@Autowired
	private QueryService queryService;
	@Autowired
	private EnterpriseService enterpriseService;
	@RequestMapping(value = "/tax/enterprise/getGoldTables.do")
	public DataList getGoldTables(String taxId) {//根据税号获取金三数据的表名
		DataList tableList =queryService.query("select tableName from dataTable where type=?", 1);//获取所有的金三数据的表名
			
		DataList tableNameAndTaxId = new DataList();//构造类似[{'tableName': ,'taxId': },{'tableName': ,'taxId': }...]的数组
		for (int i = 0; i < tableList.size(); i++) {
			String tableName = (String) tableList.get(i).get("tableName");
			//根据tableName在dataTableDefinition中找出某张表的税号字段名称
			DataList list = queryService.query("select tableName, text from dataTableDefinition where tableName=? and taxUnitCode=?", tableName,1);
			if (list.size() != 0)
				tableNameAndTaxId.add(list.get(0));
		}
		DataList value = new DataList();
		DataRow row = null;
		for (int j = 0; j < tableNameAndTaxId.size(); j++) {

			String tableName = (String) tableNameAndTaxId.get(j).get("tableName");
			String taxColumn = (String) tableNameAndTaxId.get(j).get("text");
			String sql1 = String.format("select * from %s", "[" + tableName + "] ");
			String sql2 = String.format("where [%s] = ", taxColumn);
			String sql = sql1 + sql2 + "?";
			DataList list =queryService.query(sql, taxId);
			if (list.size() != 0) {//在list的长度不为空的情况下，即可确定包括某税号的表
				row = new DataRow();
				row.put("表名", tableName);
				value.add(row);
			}
		}
		return value;

	}

	@RequestMapping(value = "/tax/enterprise/getGoldData.do")
	public WebResponse getGoldData(Integer start, Integer limit, String tableName, String taxId) {//根据表名和税号获取金三数据
		//获取某张金三数据表的的税号名称
		DataList list = queryService.query("select  text from dataTableDefinition where tableName=? and taxUnitCode=?",tableName,1) ;
		
		String columnName = (String) list.get(0).get("text");//获取税号的字段名
		Condition a = new Condition(columnName, "=", taxId);
		WebResponse response = queryService.queryPage(start, limit, a,  tableName );
		DataRow value = ((DataList) response.get("value")).get(0);
		DataList columns = new DataList();//生成columns
		DataRow row = null;
		for (String s : value.keySet()) {
			row = new DataRow();
			row.put("text", s);
			row.put("dataIndex", s);
			row.put("width", 250);
			columns.add(row);
		}
		response.setColumns(columns);
		return response;
	}

	@RequestMapping(value = "/tax/enterprise/getUpTables.do")
	public WebResponse getUpTables(String taxId) {//根据税号获取上传数据的表名
		WebResponse response = new WebResponse();
		DataList tableList = queryService.query("select tableName from dataTable where type=?", 0);
	
		DataList tableNameAndTaxId = new DataList();
		for (int i = 0; i < tableList.size(); i++) {
			String tableName = (String) tableList.get(i).get("tableName");
			DataList list = queryService.query("select tableName, text from dataTableDefinition where tableName=? and taxUnitCode=?", tableName,1);
			
			if (list.size() != 0)
				tableNameAndTaxId.add(list.get(0));
		}
		DataList value = new DataList();
		DataRow row = null;
		for (int j = 0; j < tableNameAndTaxId.size(); j++) {

			String tableName = (String) tableNameAndTaxId.get(j).get("tableName");
			String taxColumn = (String) tableNameAndTaxId.get(j).get("text");
			String sql1 = String.format("select * from %s", "[" + tableName + "]");
			String sql2 = String.format("where [%s] = ", taxColumn);
			String sql = sql1 + sql2 + "?";//生成SQL语句
			DataList list = queryService.query(sql, taxId);
			if (list.size() != 0) {//在list的长度不为空的情况下，即可确定包括某税号的表
				row = new DataRow();
				row.put("表名", tableName);
				value.add(row);
			}
		}
		response.setValue(value);
		return response;
	}

	@RequestMapping(value = "/tax/enterprise/getUpData.do")
	public WebResponse getUpData(Integer start, Integer limit, String tableName, String taxId) {
		log.debug(tableName);
		//获取某张金三数据表的的税号名称
		DataList list = queryService.query("select  text from dataTableDefinition where tableName=? and taxUnitCode=?", tableName,1);
		
		String columnName = (String) list.get(0).get("text");//获取税号字段名称
		Condition a = new Condition(columnName, "=", taxId);
		WebResponse response = queryService.queryPage(start, limit, a, tableName);//获取指定税号的数据
		DataRow value = ((DataList) response.get("value")).get(0);
		DataList columns = new DataList();//生成columns
		DataRow row = null;
		for (String s : value.keySet()) {
			row = new DataRow();
			row.put("text", s);
			row.put("dataIndex", s);
			row.put("width", 250);
			columns.add(row);
		}
		response.setColumns(columns);//
		return response;

	}

	@RequestMapping(value = "/tax/enterprise/getTaxIdName.do")
	public WebResponse getTaxIdName(String tableName) {//根据表名获取税号名称
		WebResponse response = new WebResponse();
		System.out.println("tablename：  "+tableName);
		DataList list = queryService.query("select text from [dataTableDefinition] where tableName= ?" + " and taxUnitCode = ?", tableName,1);
		if(list.size()==0)
			response.setSuccess(false);
		response.setValue(list);
		return response;
	}

	@RequestMapping(value = "/tax/enterprise/getEnterprise.do")
	public WebResponse getEnterprise(String taxIds) {//根据税号查询企业
		log.debug("taxId: "+taxIds);
		log.debug(taxIds.split(":"));
		JSONArray array = JSONArray.fromObject(taxIds);
		LinkedList<String> list = new LinkedList<>();
		List<Map<String, Object>> mapListJson = MapListUtil.filter(new ArrayList<Map<String, Object>>(array));//生成json对象
		for(int i = 0 ;i<mapListJson.size();i++) {
			Map<String, Object> obj = mapListJson.get(i);
			for(Entry<String, Object> entry:obj.entrySet()) {
				String key = entry.getKey();
				String value = entry.getValue().toString();
				log.debug("key: "+key+" value: "+value);
				list.add(value);
			}
		}
		DataList value = new DataList();
		for(int j = 0; j<list.size();j++) {
			String str= list.get(j);
			log.debug("str: "+str);
			DataList data = queryService.query("select * from [企业信息地税] where [社会信用代码(纳税人识别号)] = ?", str);
			DataRow row = new DataRow();
			if(data.size()!=0) {
				row.put("local", data.get(0));
				value.add(row);
			}
				
		}
		for(int j = 0; j<list.size();j++) {
			String str= list.get(j);
			log.debug("str: "+str);
			DataList data = queryService.query("select * from [企业信息国税] where [社会信用代码（纳税人识别号）] = ?", str);
			DataRow row = new DataRow();
			if(data.size()!=0) {
				row.put("nation", data.get(0));
				value.add(row);
			}
				
		}
//		DataList columns = new DataList();
//		DataRow row = null;
//		if(value.size()!=0) {
//			DataRow v0 =  (DataRow) value.get(0).get("local");
//			for (String s : v0.keySet()) {
//				row = new DataRow();
//				row.put("text", s);
//				row.put("dataIndex", s);
//				row.put("width", 250);
//				columns.add(row);
//			}
//		}
		WebResponse response = new WebResponse();
		response.setValue(value);
//		response.setColumns(columns);
		return response;
	}

	@RequestMapping(value = "/tax/enterprise/listEnterprise.do")
	public WebResponse listEnterprise(Integer start, Integer limit, String taxId,String taxName,
			String represent,String category,String bigCategory,String midCategory,
			String smallCategory,String op) {//列出企业信息
		Condition c=new Condition();
		WebResponse response = null;
		if (taxId != null && taxId.length() != 0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("社会信用代码(纳税人识别号)", "like", "%"+taxId.trim()+"%"));
			else
				c.or(new Condition("社会信用代码(纳税人识别号)", "like", "%"+taxId.trim()+"%"));
		}
		if(taxName !=null && taxName.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("纳税人名称", "like", "%"+taxName.trim()+"%"));
			else
				c.or(new Condition("纳税人名称", "like", "%"+taxName.trim()+"%"));
		}
		if(represent!=null&&represent.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("法定代表人（负责人、业主）姓名", "like", "%"+represent.trim()+"%"));
			else
				c.or(new Condition("法定代表人（负责人、业主）姓名", "like", "%"+represent.trim()+"%"));
		}
		if(category!=null&&category.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("行业门类[地税]]", "like", "%"+category.trim()+"%"));
			else
				c.or(new Condition("行业门类[地税]]", "like", "%"+category.trim()+"%"));
		}
		if(bigCategory!=null&&bigCategory.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("行业大类[地税]]", "like", "%"+bigCategory.trim()+"%"));
			else
				c.or(new Condition("行业大类[地税]]", "like", "%"+bigCategory.trim()+"%"));
		}
		if(midCategory!=null&&midCategory.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("行业中类[地税]]", "like", "%"+midCategory.trim()+"%"));
			else
				c.or(new Condition("行业中类[地税]]", "like", "%"+midCategory.trim()+"%"));
		}
		if(smallCategory!=null&&smallCategory.length()!=0) {
			if(op==null||op.equals("and"))
				c.and(new Condition("行业小类[地税]]", "like", "%"+smallCategory.trim()+"%"));
			else
				c.or(new Condition("行业小类[地税]]", "like", "%"+smallCategory.trim()+"%"));
		}
		
		response = queryService.queryPage(start, limit, c, "企业信息");//条件查看企业信息
		return response;
	}
	@RequestMapping(value = "/tax/enterprise/listTables.do")
	public WebResponse listTables(Integer start,Integer limit,Integer type) {
		Condition a= new Condition("type", "=", type);
		WebResponse response = queryService.queryPage(start, limit, a, "dataTable");
		return response;
		
	}
	@SuppressWarnings("unchecked")
	@RequestMapping(value="tax/enterprise/getEnterpriseRelatedData.do")
	public WebResponse get(String taxId,String startTime,String tableMap,String endTime,Integer start,Integer limit) throws SQLException {
		WebResponse response=new WebResponse();
		
		JSONArray array = JSONArray.fromObject(tableMap);
		List<Map<String, Object>> mapListJson = MapListUtil.filter(new ArrayList<Map<String, Object>>(array));//生成json对象
		Map<String, Object> map = mapListJson.get(0);
		for(String key: map.keySet()) {
			log.debug(key);
			log.debug(map.get(key));
			response=enterpriseService.getData(taxId.trim(), key, (List<String>) map.get(key), startTime, endTime, start, limit);
		}
		return response;
	}
	@RequestMapping(value="tax/enterprise/tableNameListWithData.do")
	public WebResponse tableNameListWithData(String taxId,String startTime,String endTime) throws SQLException {
		WebResponse response=new WebResponse();
		log.debug("tableNameListWithData");
		log.debug(taxId);
		log.debug(startTime);
		log.debug(endTime);
		DataList value=new DataList();
	
		Map<String,List<String>> goldenMap=enterpriseService.findExistData(taxId.trim(), startTime, endTime,1);
		Map<String,List<String>> thirdMap=enterpriseService.findExistData(taxId.trim(), startTime, endTime,0);
		for(String goldenTableName:goldenMap.keySet()){
			DataRow row = new DataRow();
			DataRow gold=new DataRow();
			row.put(goldenTableName, goldenMap.get(goldenTableName));
			gold.put("gold", row);
			value.add(row);
		}
		for(String thirdTableName:thirdMap.keySet()){
			DataRow row = new DataRow();
			DataRow third=new DataRow();
			row.put(thirdTableName, thirdMap.get(thirdTableName));
			third.put("third", row);
			value.add(row);
		}
		response.setValue(value);
		return response;
	}
	public static void main(String arg[]) throws SQLException {
//		EnterpriseController en = new EnterpriseController();
//		en.tableNameListWithData("51222119651118438501", "2017-10", "2017-12");
		String s="[{'hello':'0123'}]";
		JSONArray array=JSONArray.fromObject(s);
		array.get(0);
	}
}