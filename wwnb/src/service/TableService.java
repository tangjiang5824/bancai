package service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import domain.DataList;
import domain.DataRow;
import domain.DataTable;
import domain.DataTableDefinition;
import domain.DataTableDefinition4Add;

@Service
public class TableService extends BaseService {
	private Logger log = Logger.getLogger(TableService.class);
	@Autowired
	private QueryService queryService;
	/**
	 * 数据表对应列是否有数据
	 * @param tableName
	 * @param fieldName
	 * @return
	 */
	public boolean haveData(String tableName,String fieldName) {
		int n=queryService.getCount("select count(["+fieldName+"]) as num from ["+tableName+"] ;");
		if(n>0)
			return true;
		else
			return false;
		
	}
	/**
	 * 获取表类型
	 * @param tableName
	 * @return 0表示三方，1表示金三
	 */
	public int getTableType(String tableName) {
		return jo.queryForObject("select type from dataTable where tableName=?", new Object[] { tableName }, Integer.class);
	}
	/**
	 * 获取对应字段的类型
	 * @param tableName
	 * @param name
	 * @return varchar或者float
	 */
	public String getColumnType(String tableName,String name)
	{
		return jo.queryForObject("select type from dataTableDefinition where tableName=? and text=?",String.class,tableName,name);
	}
	/**
	 * 获取对应数据表的列名
	 * 
	 * @param tableName
	 * @return 以List方式返回
	 */
	public DataList getColumnList(String tableName) {
		return queryService.query("select * from dataTableDefinition where tableName='" + tableName + "' order by tableRecord ASC;");
	}
	/**
	 * 获取对应数据表的列名
	 * @param tableName
	 * @return 以Map方式返回
	 */
	public Map<String, DataRow> getColumnMap(String tableName) {
		Map<String, DataRow> map = new HashMap<String, DataRow>();
		DataList columnList = getColumnList(tableName);
		for (DataRow row : columnList) {
			map.put(row.get("text").toString(), row);
		}
		return map;
	}

	/**
	 * 根据表名和上传id获取表数据
	 * 
	 * @param tableName
	 * @param uploadId
	 * @return
	 */
	public DataList getTableData(String tableName, Integer uploadId) {
		return queryService.query("select * from [" + tableName + "] where uploadId = ?", uploadId);
	}
	/**
	 * 添加数据表
	 * @param dataTable
	 * @param definitions
	 * @return
	 */
	@Transactional
	public boolean addDBTable(DataTable dataTable, List<DataTableDefinition4Add> definitions) {
		String tableName = dataTable.getTableName();

		String organizationId = dataTable.getOrganizationId();
		String tableType = dataTable.getTableType();
		String cycleStart = dataTable.getCycleStart();
		String uploadCycle = dataTable.getUploadCycle();

		jo.update("insert into dataTable(tableName,organizationId,[type],cycleStart,uploadCycle) values(?,?,?,?,?)", tableName, organizationId,
				Integer.parseInt(tableType), cycleStart, Integer.parseInt(uploadCycle));

		for (int i = 0; i < definitions.size(); i++) {
			DataTableDefinition4Add definition = definitions.get(i);
			jo.update(
					"insert into dataTableDefinition(tableName,text,[type],isNull,taxUnitCode,taxUnitName,[check],tableRecord,width) values(?,?,?,?,?,?,?,?,?)",
					tableName, definition.getFieldName(), definition.getFieldType(), definition.getIsNull(), definition.getTaxUnitCode(),
					definition.getTaxUnitName(), definition.getFieldCheck(), i, Integer.parseInt(definition.getWidth()));
		}

		StringBuffer buffer = new StringBuffer();
		buffer.append("create table [").append(tableName).append("] (");
		for (int i = 0; i < definitions.size(); i++) {
			DataTableDefinition4Add definition = definitions.get(i);
			buffer.append("[").append(definition.getFieldName());
			if(definition.getFieldType().equals("float"))
			{
				buffer.append("] float,");
			}else
			{
				buffer.append("] varchar(3000),");
			}

		}
		buffer.append(" id INT IDENTITY(1,1) PRIMARY KEY,uploadId int not null);");
		jo.update(buffer.toString());

		StringBuffer buff = new StringBuffer();
		buff.append("alter table [").append(tableName).append("] add constraint [FK_uploadId_").append(tableName)
				.append("] foreign key (uploadId) references uploadRecords (id) on update cascade on delete cascade;");
		jo.update(buff.toString());

		return true;

	}
	/**
	 * 修改数据表
	 * @param editTable
	 * @param definitions
	 * @return
	 */
	@Transactional
	public boolean editDBTable(DataTable editTable, List<DataTableDefinition> definitions) {
		String oldTableName = editTable.getOldTableName();
		String tableName = editTable.getTableName();
		String organizationId = editTable.getOrganizationId();
		String tableType = editTable.getTableType();
		//String cycleStart = editTable.getCycleStart();
		String uploadCycle = editTable.getUploadCycle();

		jo.update(
				"delete from dataTable where tableName=?",oldTableName);
		jo.update("insert into dataTable(tableName,organizationId,[type],uploadCycle) values(?,?,?,?)", tableName, organizationId, Integer.parseInt(tableType),Integer.parseInt(uploadCycle));
		jo.update("delete from dataTableDefinition where tableName=?", oldTableName);

		for (int i = 0; i < definitions.size(); i++) {
			DataTableDefinition definition = definitions.get(i);
			jo.update(
					"insert into dataTableDefinition(tableName,text,[type],isNull,taxUnitCode,taxUnitName,[check],tableRecord,width) values(?,?,?,?,?,?,?,?,?)",
					tableName, definition.getFieldName(), definition.getFieldType(), definition.getIsNull(), definition.getTaxUnitCode(),
					definition.getTaxUnitName(), definition.getFieldCheck(), i, Integer.parseInt(definition.getWidth()));
		}
		if (!tableName.equals(oldTableName)) {
			jo.update("sp_rename ?,?", oldTableName, tableName);
			jo.update("update [uploadRecords] set tableName=? where tableName=?",tableName,oldTableName);
		}
		for (int i = 0; i < definitions.size(); i++) {
			DataTableDefinition definition = definitions.get(i);
			if (definition.getOldFileldName().equals("")) {// 原字段为空，则新增列
				StringBuffer buffer = new StringBuffer();
				buffer.append("ALTER TABLE [").append(tableName).append("] ADD [").append(definition.getFieldName());
//				if(definition.getFieldType().equals("float"))
//				{
//					buffer.append("] float");
//				}else
//				{
					buffer.append("] varchar(3000)");
//				}
				log.debug(buffer);
				jo.update(buffer.toString());

			}
//			else
//			{
//				StringBuffer buffer=new StringBuffer();
//				buffer.append("alter table [").append(tableName).append("] alter column [").append(definition.getFieldName());
//				if(definition.getFieldType().equals("float"))
//				{
//					buffer.append("] float");
//				}else
//				{
//					buffer.append("] varchar(3000)");
//				}
//				jo.update(buffer.toString());
//			}
			if (!definition.getFieldName().equals(definition.getOldFileldName()) && !definition.getOldFileldName().equals("")) {// 原字段名称改变，则改变名称
				StringBuffer buffer = new StringBuffer();
				buffer.append("sp_rename '[").append(tableName).append("].[").append(definition.getOldFileldName()).append("]',[")
						.append(definition.getFieldName()).append("],'column'");
				log.debug(buffer.toString());
				jo.update(buffer.toString());
				
			}

		}
		return true;
	}
	/**
	 * 删除数据表
	 * @param tableName
	 * @return
	 */
	@Transactional
	public boolean deleteTable(String tableName) {
		jo.update("UPDATE [dataTable] SET [deltable] = '1' WHERE tableName = ?",tableName);
//		jo.update("drop table ["+tableName+"]");
//		jo.update("delete from dataTableDefinition where tableName=?",tableName);
//		jo.update("delete from dataTable where tableName=?",tableName);
		return true;
	}
	/**
	 * 删除数据表中的字段
	 * @param tableName
	 * @param fieldName
	 * @return
	 */
	@Transactional
	public boolean dropColumn(String tableName, String fieldName) {
		jo.update("delete from dataTableDefinition where tableName=? and text=?",tableName,fieldName);
		jo.update("alter table "+tableName+" drop column ["+fieldName+"]");
		return true;
	}
	/**
	 * 判断表是否存在
	 * @param tableName
	 * @return
	 */
	public boolean exist(String tableName) {
		int count=queryService.getCount("select count(*) from [dataTable] where tableName=?", tableName);
		if(count>0)
			return false;
		else
			return true;
		
	}
}

