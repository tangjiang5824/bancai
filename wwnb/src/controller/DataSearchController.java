package controller;

import java.util.ArrayList;
import java.util.List;

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
public class DataSearchController {
	@Autowired
	private QueryService queryService;
	private Logger log = Logger.getLogger(DataTableController.class);
	/**
	 * 获取数据表中的全部字段
	 * @return
	 */
	@RequestMapping(value="/dataSearch/getAllColumnsName.do")
	public DataList getAllColumnsName() {
		String sql="select distinct text from dataTableDefinition"; 
		DataList value=queryService.query(sql);
		return value;
		
	}
	/**
	 * 获取有数据的表名称
	 * @param columnName
	 * @param compareName
	 * @param conditionName
	 * @return WebResponse
	 * TODO 算法逻辑显然是可以优化的。用select count比queryPage更好
	 */
	@RequestMapping(value="/dataSearch/getTableNames.do")
	public WebResponse getTableNames(String columnName,String compareName,String conditionName,boolean columnType) {
		WebResponse response = new WebResponse();
		log.debug(columnName);
		log.debug(columnType);
		String condition = conditionName;
		if(compareName.equals("like")) {
			condition = "%"+conditionName+"%";
		}
		List<String> value = new ArrayList<String>();
		DataList tableNames=queryService.query("select tableName from dataTableDefinition where text=?", columnName);
		DataRow row;
		for(DataRow tableName : tableNames) {
			row=new DataRow();
			String table=(String) tableName.get("tableName");
			Condition c=new Condition(columnName,compareName,condition,columnType);
			WebResponse res=queryService.queryPage(0, 1, c, table);
			if((int)res.get("totalCount")!=0) {
				row.put(table, res);
				value.add(table);
			}
		}
		response.setValue(value);
		return response;
	}
	/**
	 * 获取数据
	 * @param start
	 * @param limit
	 * @param tableName	表名
	 * @param columnName 字段名
	 * @param compareName 比较符号
	 * @param conditionName 比较值
	 * @param columnType true：为文本,false: 为数字
	 * @return
	 */
	@RequestMapping(value="/dataSearch/getData.do")
	public WebResponse getData(Integer start,Integer limit,String tableName,String columnName,String compareName,String conditionName,boolean columnType) {
		String condition = conditionName;
		log.debug(columnType);
		WebResponse res=null;
		if(compareName.equals("like")) {
			condition="%"+condition+"%";
		}
		Condition c=new Condition(columnName,compareName,condition,columnType);
		res=queryService.queryPage(start, limit, c, tableName);
		return res;
	}
	

}
