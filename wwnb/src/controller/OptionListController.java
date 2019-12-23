package controller;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import domain.DataList;
import service.QueryService;

@RestController
public class OptionListController {
	Logger log = Logger.getLogger(OptionListController.class);
	@Autowired
	private QueryService queryService;
	/**
	 * 列出系统角色
	 * @return
	 */
	@RequestMapping(value = "/roleList.do")
	public DataList roleList()// 列出所有权限0（系统管理员），1（税务管理员），2（组织管理员）
	{
		DataList list = queryService.query("select * from role");
		return list;
	}
	/**
	 * 列出全部涉税结构
	 * @return
	 */
	@RequestMapping(value = "/organizationList.do")
	public DataList organizationList() {// 列出所有组织
		DataList list = queryService.query("select * from organization");
		return list;
	}
	/**
	 * 涉税机构数据表表名
	 * @return
	 */
	@RequestMapping(value = "/uptableName.do")
	public DataList uptableName() {// 根据组织Id获取表名
		DataList list = queryService.query("select tableName from [dataTable] where type = 0");
		return list;
	}
	
	/**
	 * 列出该组织的数据表表名
	 * @param organizationId
	 * @return
	 */
	@RequestMapping(value = "/tableNameListById.do")
	public DataList tableNameListById(String organizationId,HttpSession session) {// 根据组织Id获取表名
		if(organizationId==null||organizationId.length()<=0) {
			organizationId=(String) session.getAttribute("organizationId");
		}
		DataList list = queryService.query("select tableName from [dataTable] where organizationId = ? and deltable!=1",organizationId);
		return list;
	}
	/**
	 * 列出全部用户
	 * @return
	 */
	@RequestMapping(value = "/listUser.do")
	public DataList userList()// 列出所有的用户
	{
		DataList list = queryService.query("select * from [user]");
		return list;
	}

	
	/**
	 * 根据登录名获得与之相关的表名
	 * @param session
	 * @return
	 */
	/*@RequestMapping(value = "/tableList.do")
	public DataList tableList(HttpSession session) {
		String loginName = (String) session.getAttribute("loginName");
		return queryService.query(
				"select a.tableName as tableName from dataTable as a,[user] as b where a.organizationId=b.organizationId and b.loginName=? and type!=2",
				loginName);
	}*/
	
	@RequestMapping(value = "/tableList.do")
	public DataList tableListDel(HttpSession session) {
		String loginName = (String) session.getAttribute("loginName");
		return queryService.query(
				"select a.tableName as tableName from dataTable as a,[user] as b where a.organizationId=b.organizationId and b.loginName=? and type!=2 and a.deltable!=1",
				loginName);
	}
	

	

}
