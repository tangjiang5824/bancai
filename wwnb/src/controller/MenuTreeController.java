package controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import domain.DataList;
import domain.DataRow;
import service.EnterpriseService;
import service.QueryService;
/**
 * TODO 这个类缺少漂亮的注释
 * @author liuji
 *
 */
@RestController
public class MenuTreeController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private EnterpriseService enterpriseService;
	private Logger log = Logger.getLogger(MenuTreeController.class);
	@RequestMapping(value = "/wzdsMenu.do")
	public DataList wzdsMenu() {// 通过读取organization的id和name来构造菜单树
		DataList nodes = new DataList();
		DataList nodes1 = new DataList();
		DataList menu = new DataList();
		DataList child = new DataList();
		DataRow row = null;
		DataList list = queryService.query("select id,name from organization");
		for (int i = 0; i < list.size(); i++) {// 构造叶节点
if(list.get(i).get("name").equals("万州区地税")||list.get(i).get("name").equals("万州区国税")) {
				
			}else {
				row = new DataRow();
				row.put("id", "tax.data." + list.get(i).get("id"));
				row.put("text", list.get(i).get("name"));
				row.put("leaf", true);
				nodes.add(row);
			}
			
		}
		for (int i = 0; i < list.size(); i++) {// 构造叶节点
			if(list.get(i).get("name").equals("万州区地税")||list.get(i).get("name").equals("万州区国税")||list.get(i).get("name").equals("公管办")||list.get(i).get("name").equals("什么局（测试）")) {
				
			}else {
				row = new DataRow();
				row.put("id", "tax.checkdata." + list.get(i).get("id"));
				row.put("text", list.get(i).get("name"));
				row.put("leaf", true);
				nodes1.add(row);
			}
			
		}

		child = new DataList();
		row = new DataRow();
		row.put("text", "数据上传");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.remind");
		row.put("text", "未上传提醒");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("text", "上传记录");
		row.put("expanded", false);
		row.put("id", "tax.edit.uploadRecords");
		row.put("children", nodes);
		child.add(row);
		row = new DataRow();
		row.put("text", "未匹配数据处理");
		row.put("id", "tax.edit.unmatchData");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.reportForms");
		row.put("text", "单位上传情况统计（分报表）");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.reportFormsOfOrganization");
		row.put("text", "单位上传情况统计（分单位）");
		row.put("leaf", true);
		child.add(row);
		child = new DataList();
		row = new DataRow();
		row.put("text", "金三数据");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("id", "data.UploadData");
		row.put("text", "数据上传");
		row.put("leaf", true);
		child.add(row);
		
		row = new DataRow();
		row.put("id", "org.data.UploadZipFiles");
		row.put("text", "批量数据上传");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.uploadRecords1");
		row.put("text", "上传记录");
		row.put("leaf", true);
		child.add(row);


		child = new DataList();
		row = new DataRow();
		row.put("text", "数据查询");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("text", "按部门查询");
		row.put("expanded", false);
		row.put("children", nodes1);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.advancedQuery.main");
		row.put("text", "高级查询");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.columnQuery.Main");
		row.put("text", "按字段名查询");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.enterpriseQuery.main");
		row.put("text", "企业信息一户式查询");
		row.put("leaf", true);
		child.add(row);

		child = new DataList();
		row = new DataRow();
		row.put("text", "风险发现");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);

		row = new DataRow();
		row.put("id", "tax.check.riskDiscoveryLog");// 待填
		row.put("text", "查看风险发现日志");
		row.put("leaf", true);
		child.add(row);

		row = new DataRow();
		row.put("id", "tax.check.resultView");
		row.put("text", "风险发现结果");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.check.discover");
		row.put("text", "手动风险发现");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.check.dealRisk");
		row.put("text", "风险处理");
		row.put("leaf", true);
		child.add(row);
		/*
		 * child1 = new DataList(); row = new DataRow(); row.put("text",
		 * "手动风险发现"); row.put("expanded", false); row.put("children",child1);
		 * child.add(row); DataRow row1 = new DataRow(); row1.put("id",
		 * "tax.check.standard1"); row1.put("text", "区房管局涉税信息表一（新建商品房销售信息）");
		 * row1.put("leaf", true); child1.add(row1); row1 = new DataRow();
		 * row1.put("id", "tax.check.standard2"); row1.put("text",
		 * "区房管局涉税信息表五（土地登记信息）"); row1.put("leaf", true); child1.add(row1); row1
		 * = new DataRow(); row1.put("id", "tax.check.standard3");
		 * row1.put("text", "运管处涉税信息传递表二（营运车辆信息）"); row1.put("leaf", true);
		 * child1.add(row1);
		 */
		
		row = new DataRow();
		row.put("id", "");
		row.put("text", "风险发现报表");
		row.put("leaf", true);
		child.add(row);

		row=new DataRow();
		row.put("id", "tax.rule.create");
		row.put("text", "定义风险发现规则");
		row.put("leaf", true);
		menu.add(row);
		
		row = new DataRow();
		row.put("id", "tax.edit.userInfo");
		row.put("text", "修改用户信息");
		row.put("leaf", true);
		menu.add(row);
		row = new DataRow();
		row.put("id", "logout");
		row.put("text", "退出系统");
		row.put("leaf", true);
		menu.add(row);

		return menu;
	}
	@RequestMapping(value = "/wzgsMenu.do")
	public DataList wzgsMenu() {// 通过读取organization的id和name来构造菜单树
		DataList nodes = new DataList();
		DataList nodes1 = new DataList();
		DataList menu = new DataList();
		DataList child = new DataList();
		DataRow row = null;
		DataList list = queryService.query("select id,name from organization");
		for (int i = 0; i < list.size(); i++) {// 构造叶节点
if(list.get(i).get("name").equals("万州区地税")||list.get(i).get("name").equals("万州区国税")) {
				
			}else {
				row = new DataRow();
				row.put("id", "tax.data." + list.get(i).get("id"));
				row.put("text", list.get(i).get("name"));
				row.put("leaf", true);
				nodes.add(row);
			}
			
		}
		for (int i = 0; i < list.size(); i++) {// 构造叶节点
			if(list.get(i).get("name").equals("万州区地税")||list.get(i).get("name").equals("万州区国税")) {
				
			}else {
				row = new DataRow();
				row.put("id", "tax.checkdata." + list.get(i).get("id"));
				row.put("text", list.get(i).get("name"));
				row.put("leaf", true);
				nodes1.add(row);
			}
			
		}

		child = new DataList();
		row = new DataRow();
		row.put("text", "数据上传");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.remind");
		row.put("text", "未上传提醒");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("text", "上传记录");
		row.put("expanded", false);
		row.put("id", "tax.edit.uploadRecords");
		row.put("children", nodes);
		child.add(row);
		row = new DataRow();
		row.put("text", "未匹配数据处理");
		row.put("id", "tax.edit.unmatchData");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.reportForms");
		row.put("text", "单位上传情况统计（分报表）");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.reportFormsOfOrganization");
		row.put("text", "单位上传情况统计（分单位）");
		row.put("leaf", true);
		child.add(row);
		child = new DataList();
		row = new DataRow();
		row.put("text", "金三数据");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("id", "data.UploadData");
		row.put("text", "数据上传");
		row.put("leaf", true);
		child.add(row);
		
		row = new DataRow();
		row.put("id", "org.data.UploadZipFiles");
		row.put("text", "批量数据上传");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.edit.uploadRecords1");
		row.put("text", "上传记录");
		row.put("leaf", true);
		child.add(row);


		child = new DataList();
		row = new DataRow();
		row.put("text", "数据查询");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);
		row = new DataRow();
		row.put("text", "按部门查询");
		row.put("expanded", false);
		row.put("children", nodes1);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.advancedQuery.main");
		row.put("text", "高级查询");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.columnQuery.Main");
		row.put("text", "按字段名查询");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.enterpriseQuery.main");
		row.put("text", "企业信息一户式查询");
		row.put("leaf", true);
		child.add(row);

		child = new DataList();
		row = new DataRow();
		row.put("text", "风险发现");
		row.put("expanded", false);
		row.put("children", child);
		menu.add(row);

		row = new DataRow();
		row.put("id", "tax.check.riskDiscoveryLog");// 待填
		row.put("text", "查看风险发现日志");
		row.put("leaf", true);
		child.add(row);

		row = new DataRow();
		row.put("id", "tax.check.resultView");
		row.put("text", "风险发现结果");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.check.discover");
		row.put("text", "手动风险发现");
		row.put("leaf", true);
		child.add(row);
		row = new DataRow();
		row.put("id", "tax.check.dealRisk");
		row.put("text", "风险处理");
		row.put("leaf", true);
		child.add(row);
		/*
		 * child1 = new DataList(); row = new DataRow(); row.put("text",
		 * "手动风险发现"); row.put("expanded", false); row.put("children",child1);
		 * child.add(row); DataRow row1 = new DataRow(); row1.put("id",
		 * "tax.check.standard1"); row1.put("text", "区房管局涉税信息表一（新建商品房销售信息）");
		 * row1.put("leaf", true); child1.add(row1); row1 = new DataRow();
		 * row1.put("id", "tax.check.standard2"); row1.put("text",
		 * "区房管局涉税信息表五（土地登记信息）"); row1.put("leaf", true); child1.add(row1); row1
		 * = new DataRow(); row1.put("id", "tax.check.standard3");
		 * row1.put("text", "运管处涉税信息传递表二（营运车辆信息）"); row1.put("leaf", true);
		 * child1.add(row1);
		 */

		row = new DataRow();
		row.put("id", "");
		row.put("text", "风险发现报表");
		row.put("leaf", true);
		child.add(row);

		row = new DataRow();
		row.put("id", "tax.edit.userInfo");
		row.put("text", "修改用户信息");
		row.put("leaf", true);
		menu.add(row);
		row = new DataRow();
		row.put("id", "logout");
		row.put("text", "退出系统");
		row.put("leaf", true);
		menu.add(row);

		return menu;
	}
//	@RequestMapping(value = "/tax/enterprise/main.do")
//	public DataList enterpriseInfo () {// 跳转到企业信息页
//		DataList menu = new DataList();
//		DataRow row = new DataRow();
//		row.put("id", "tax.enterprise.main");
//		menu.add(row);
//		return menu;
//	
//	}
	@RequestMapping(value="/enterpriseRelated/createTableTree.do")
	public DataList createTableTree(String taxId,String startTime,String endTime) throws SQLException {
		DataList menu=new DataList();
		
		Map<String,List<String>> goldenMap=enterpriseService.findExistData(taxId, startTime, endTime,1);
		Map<String,List<String>> thirdMap=enterpriseService.findExistData(taxId, startTime, endTime,0);
		DataRow enterprise=new DataRow();
		DataList list=new DataList();
		DataRow golden=new DataRow();
		DataRow third=new DataRow();
		enterprise.put("text","地税企业信息");
		enterprise.put("leaf",true);
		enterprise.put("id", "tax.enterprise.local.info");
		menu.add(enterprise);
		enterprise=new DataRow();
		enterprise.put("text","国税企业信息");
		enterprise.put("leaf",true);
		enterprise.put("id", "tax.enterprise.nation.info");
		menu.add(enterprise);
		for(String goldenTableName:goldenMap.keySet()){
			DataRow row = new DataRow();
			row.put("text", goldenTableName);
			row.put("id", goldenTableName);
			row.put("leaf", true);
			list.add(row);
		}
		if(list.size()>0) {
			golden.put("children", list);
			golden.put("text", "金三数据");
			golden.put("expanded", false);
			menu.add(golden);
		}else {
			golden.put("text", "金三数据");
			golden.put("leaf", true);
			menu.add(golden);
		}
		list=new DataList();
		for(String thirdTableName:thirdMap.keySet()){
			DataRow row = new DataRow();
			row.put("text", thirdTableName);
			row.put("id", thirdTableName);
			row.put("leaf", true);
			list.add(row);
		}
		if(list.size()>0) {
			third.put("children",list);
			third.put("text","第三方数据");
			third.put("expanded",false);
			menu.add(third);
		}else {
			third.put("text","第三方数据");
			third.put("leaf",true);
			menu.add(third);
		}
		return menu;
	}
	@RequestMapping(value="/queryColumnData/createTableTree.do")
	public DataList createTableTree( String []tableNames) {
		log.debug("=======");
		log.debug(tableNames);
		log.debug("=======");
		for(int i=0;i<tableNames.length;i++) {
			log.debug(tableNames[i]);
		}
		String goldenSql = "select tableName from dataTable where type=1";
		String thirdSql = "select tableName from dataTable where type=0";
		DataRow golden=new DataRow();
		DataRow third=new DataRow();
		DataList menu = new DataList();
		DataList goldenTables=queryService.query(goldenSql);
		
		DataList thirdTables=queryService.query(thirdSql);
		
		DataList goldenNode = new DataList();
		DataList thirdNode = new DataList();
		for(int i=0;i<tableNames.length;i++) {
			String tableName = tableNames[i];
			for(DataRow row : goldenTables) {
				String stringTableName = (String)row.get("tableName");
				DataRow table=new DataRow();
				log.debug("goldenTables");
				table.put("id", tableName);
				table.put("text", tableName);
				table.put("leaf", true);
				if(tableName.equals(stringTableName)) {
					goldenNode.add(table);
					break;
				}
			}
			for(DataRow row : thirdTables) {
				String stringTableName = (String)row.get("tableName");
				DataRow table=new DataRow();
				table.put("id", tableName);
				table.put("text", tableName);
				table.put("leaf", true);
				if(tableName.equals(stringTableName)) {
					thirdNode.add(table);
					break;
				}
			}
		}
		if(goldenNode.size()>0) {
			golden.put("children", goldenNode);
			golden.put("expanded", false);
			golden.put("text", "金三数据");
			menu.add(golden);
		}else {
			golden.put("text", "金三数据");
			golden.put("leaf", true);
			menu.add(golden);
		}
		if(thirdNode.size()>0) {
			third.put("children", thirdNode);
			third.put("expanded", false);
			third.put("text", "第三方数据");
			menu.add(third);
		}else {
			third.put("text", "第三方数据");
			third.put("leaf", true);
			menu.add(third);
		}
		return menu;
	}
	public static void main(String []a) {
		MenuTreeController menu = new MenuTreeController();
		String tableNames[]= {"1","2"};
		menu.createTableTree(tableNames);
	}
}
