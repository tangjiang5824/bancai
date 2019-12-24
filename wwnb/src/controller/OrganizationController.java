package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import domain.DataList;
import service.QueryService;
import service.UpdateService;
import vo.WebResponse;

@RestController
public class OrganizationController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;

	/**
	 * 列出组织
	 * 
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/system/organization/listOrganization.do")
	public WebResponse listOrganization(Integer start, Integer limit) {
		return queryService.queryPage(start, limit, "select * from organization");
	}

	/**
	 * 添加组织
	 * 
	 * @param id
	 * @param name
	 * @param tel
	 * @param contacts
	 * @param leadership
	 * @return
	 */
	@RequestMapping(value = "/system/organization/addOrganization.do") // 添加组织
	public boolean addOrganization(String id, String name, String tel, String contacts,String leadership) {
		int n = updateService.update("insert into organization(id,name,tel,contacts,leadership) values(?,?,?,?,?)", id, name, tel, contacts,leadership);
		if (n > 0)
			return true;
		else
			return false;
	}

	/**
	 * 删除组织
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/system/organization/deleteOrganization.do")
	public boolean deleteOrganization(String id) {// 根据Id删除某个组织
		int n = updateService.update("delete from [organization] where id=?", id);
		if (n > 0)
			return true;
		else
			return false;
	}

	/**
	 * 修改组织
	 * 
	 * @param id
	 * @param name
	 * @param tel
	 * @param address
	 * @return
	 */
	@RequestMapping(value = "/system/organization/editOrganization.do")
	public boolean editOrganization(String id, String name, String tel, String contacts,String leadership) {
		int n = updateService.update("update [Organization] set name=?,tel=? ,contacts=?,leadership=? where id=?", name, tel, contacts,leadership, id);
		if (n > 0)
			return true;
		else
			return false;
	}

	/**
	 * 获取某个组织的信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/system/organization/get.do")
	public WebResponse get(String id) {
		WebResponse response = new WebResponse();
		DataList list = queryService.query("select * from [organization] where id = ?", id);
		response.put("value", list);
		return response;
	}
}
