package controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import db.Condition;
import domain.DataList;
import domain.DataRow;
import domain.DataTable;
import domain.DataTableDefinition;
import domain.DataTableDefinition4Add;
import service.QueryService;
import service.TableService;
import vo.WebResponse;

/**
 * URL地址映射到/system/dataTable/xxx.do
 * @author 
 *
 */
@RestController
public class DataTableController {
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;

	private Logger log = Logger.getLogger(DataTableController.class); 
	/**
	 * 根据条件列出全部表
	 */
	@RequestMapping(value="/system/dataTable/listTable.do")
	public WebResponse listTable(Integer start, Integer limit,String tableName,String organizationId) {		
		Condition c=new Condition();
		if(tableName!=null&&!tableName.equals(""))
		{
			c.and( new Condition("id","=",tableName));
		}
		if(organizationId!=null&&!organizationId.equals("")&& !"a".equals(organizationId))
		{
			
			c.and(new Condition("organizationId","=",organizationId));
		}
		
		log.debug(c.toString());

		return queryService.queryPage(start, limit, c, "dataTableView");
	}
	
	/**
	 * 添加时判断表是否存在
	 */
	@RequestMapping(value = "/system/dataTable/existForAdd.do")
	public boolean existForAdd(String tableName)
	{
			return tableService.exist(tableName);
	}
	/**
	 * 修改时判断表是否存在
	 * @param newTableName
	 * @param oldTableName
	 * @return
	 */
	@RequestMapping(value = "/system/dataTable/existForEdit.do")
	public boolean existForEdit(String newTableName,String oldTableName)
	{
		if(!newTableName.equals(oldTableName))
			return tableService.exist(newTableName);
		else
			return true;
	}
	/**
	 * 新建表
	 */
	@RequestMapping(value="/system/dataTable/addTable.do")
	public boolean addTable(String tableName,String organizationId,String tableType,String s,String cycleStart,String uploadCycle){		
		DataTable dataTable=new DataTable();
		
		dataTable.setTableName(tableName);
		dataTable.setOrganizationId(organizationId);
		dataTable.setCycleStart(cycleStart.substring(0, 7));
		dataTable.setUploadCycle(uploadCycle);
		dataTable.setTableType(tableType);
		
	    JSONArray  jsonArray=new JSONArray(s);
	    List<DataTableDefinition4Add> definitions=new ArrayList<DataTableDefinition4Add>();
	    
	    for(int i = 0; i < jsonArray.length(); i++)
	    {
	    	JSONObject jsonTemp = (JSONObject)jsonArray.getJSONObject(i);
	    	
	    	DataTableDefinition4Add definition=new DataTableDefinition4Add(jsonTemp);
	    	definitions.add(definition);
	    	
	    }
	  
	    
	   return tableService.addDBTable(dataTable,definitions);
	
	}
	
	/**
	 * 列出表中的数据
	 */
	@RequestMapping(value="/system/dataTable/get.do")
	public WebResponse get(String tableName)
	{
		WebResponse response = new WebResponse();
		DataList list=queryService.query("select * from dataView where tableName = ? order by tableRecord ASC", tableName);
		response.put("value", list);
		return response;
	}

	
	/**
	 * 修改表
	 */
	@RequestMapping(value="/system/dataTable/editTable.do")
	public boolean editTable(String oldTableName,String tableName,String oldOrganizationId,String organizationId,String tableType,String s,String uploadCycle,String cycleStart) {
		log.debug(s);
		DataTable editTable=new DataTable();
		editTable.setTableName(tableName);
		editTable.setOldTableName(oldTableName);
		editTable.setOrganizationId(organizationId);
		editTable.setOldOrganizationId(oldOrganizationId);
		editTable.setTableType(tableType);
		//editTable.setCycleStart(cycleStart.substring(0, 7));
		
		if(uploadCycle.equals("月报(1)")) uploadCycle="1";
		else if(uploadCycle.equals("实时(0)")) uploadCycle="0";
		else if(uploadCycle.equals("季报(3)")) uploadCycle="3";
		else if(uploadCycle.equals("半年报(6)")) uploadCycle="6";
		else if(uploadCycle.equals("年报(12)")) uploadCycle="12";
		editTable.setUploadCycle(uploadCycle);
		
		JSONArray  jsonArray=new JSONArray(s);
		    List<DataTableDefinition> definitions=new ArrayList<DataTableDefinition>();
		    
		    for(int i = 0; i < jsonArray.length(); i++)
		    {
		    	JSONObject jsonTemp = (JSONObject)jsonArray.getJSONObject(i);
		    	
		    	DataTableDefinition definition=new DataTableDefinition(jsonTemp);
		    	definitions.add(definition);
		    	
		    }
		
		 return tableService.editDBTable(editTable, definitions);
	}
		
		
	
	
	/**
	 * 删除表
	 */
	@RequestMapping(value="/system/dataTable/deleteTable.do")
	public boolean delete(String tableName) {
		return tableService.deleteTable(tableName);
	}
	/**
	 * 查询表中特定字段是否存在数据
	 */
	@RequestMapping(value="/system/dataTable/haveData.do")
	public boolean haveData(String tableName,String fieldName) {
		return tableService.haveData(tableName, fieldName);
	}
	
	/**
	 * 删除表中特定字段（不存在数据情况下）
	 */
	@RequestMapping(value="/system/dataTable/dropColumn.do")
	public boolean dropColumn(String tableName,String fieldName) {
		return tableService.dropColumn(tableName,fieldName);
	}
	
	/**
	 * 获取数据表对应的字段和域
	 * @param tableName
	 * @return
	 */
	@RequestMapping(value="/system/dataTable/getColumnsAndFields.do")
	public WebResponse getColumnsAndFields(String tableName)
	{
		WebResponse response=new WebResponse();
		log.debug(tableName);
		DataList columns=new DataList();
		List<String> fields=new ArrayList<String>();
		DataList list=new DataList();
		
		list=tableService.getColumnList(tableName);
		
		if(tableName.contains("统计局涉税信息表")) {
			DataRow column1=new DataRow();
			column1.put("text", "  ");
			column1.put("dataIndex", "A");
			column1.put("width", 250);
			columns.add(column1);
			column1=new DataRow();
			column1.put("text", "  ");
			column1.put("dataIndex", "B");
			column1.put("width", 250);
			columns.add(column1);
			column1=new DataRow();
			column1.put("text", "  ");
			column1.put("dataIndex", "C");
			column1.put("width", 250);
			columns.add(column1);
			fields.add("A");
			fields.add("B");
			fields.add("C");
		}else {
			DataRow columnNum=new DataRow();
			columnNum.put("text", "序号");
			columnNum.put("xtype", "rownumberer");
			columnNum.put("width", 50);
			columns.add(columnNum);
			for(DataRow row:list)
			{
				DataRow column=new DataRow();
				column.put("text", row.get("text").toString());
				column.put("dataIndex", row.get("text").toString());
				Object width=row.get("width");
				if(width==null)
					column.put("width", 200);
				else
					column.put("width", Integer.parseInt(width.toString()));
				columns.add(column);
				fields.add(row.get("text").toString());
			}
		}
		
		response.setColumns(columns);
		response.setFields(fields);
		return response;
	}
//	@RequestMapping(value="/system/dataTable/getColumn.do")
//	public WebResponse getColumn(String tableName)
//	{
//		WebResponse response=new WebResponse();
//		log.debug(tableName);
//		List<String> columnslist = tableService.tableQuery("[" + tableName + "]");
//		List<String> fields=new ArrayList<String>();
//		DataList columns = new DataList();// 字段名称
//		for (int j = 0; j < columnslist.size(); j++) {
//			DataRow row = new DataRow();
//			String a1 = columnslist.get(j);
//			if (!a1.equals("uploadId") && !a1.equals("序号")&&!a1.equals("处理时间")&&!a1.equals("状态")&&!a1.equals("处理人")&&!a1.equals("id")) {
//				if (a1.equals("startTime")) {
//					a1 = "开始时间";
//					row.put("text", a1);
//					row.put("dataIndex", columnslist.get(j));
//					row.put("width", 200);
//					columns.add(row);
//					fields.add(row.get("text").toString());
//				} else if (a1.equals("endTime")) {
//					a1 = "截止时间";
//					row.put("text", a1);
//					row.put("dataIndex", columnslist.get(j));
//					row.put("width", 200);
//					columns.add(row);
//					fields.add(row.get("text").toString());
//				} else {
//					row.put("text", a1);
//					row.put("dataIndex", a1);
//					row.put("width", 200);
//					columns.add(row);
//					fields.add(row.get("text").toString());
//				}
//			}
//		}
//		response.setColumns(columns);
//		response.setFields(fields);
//		return response;
//		}

//	@RequestMapping(value="/system/dataTable/dataTableList.do")
//	public DataList dataTableList() {
//		DataList list=tableService.tableNameList();
//		DataList goldenNodes=new DataList();
//		DataList upDataNodes=new DataList();
//		DataList menu=new DataList();
//		for(DataRow row:list) {
//			DataRow node=new DataRow();
//			int type=(int) row.get("type");
//			if(type>0) {
//				node.put("id", row.get("tableName"));
//				node.put("text", row.get("tableName"));
//				node.put("leaf", true);
//				goldenNodes.add(node);
//			}
//			else {
//				node.put("id", row.get("tableName"));
//				node.put("text", row.get("tableName"));
//				node.put("leaf", true);
//				upDataNodes.add(node);
//			}
//		}
//		DataRow child=new DataRow();
//		child.put("children", upDataNodes);
//		child.put("expanded",false);
//		child.put("text", "第三方数据");
//		menu.add(child);
//		child=new DataRow();
//		child.put("children", goldenNodes);
//		child.put("expanded",false);
//		child.put("text", "金三数据");
//		menu.add(child);
//		return menu;
//	}
//	@RequestMapping(value="/system/dataTable/tableNameList.do")
//	public DataList listTableNames() {
//		return tableService.tableNameList();
//	}
	
}
