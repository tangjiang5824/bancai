package controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import db.Condition;
import domain.DataList;
import service.QueryService;
import service.UpdateService;
import util.MD5;
import vo.FormResponse;
import vo.WebResponse;

@RestController
public class UserController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;
	/**
	 * 用户登录
	 * @param loginName
	 * @param pwd
	 * @param roleId
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/login.do")
	public boolean login(String loginName, String pwd, int roleId, HttpSession session) {
		System.out.println("===============================================");
		System.out.println(MD5.encode(pwd));
		DataList list = queryService.query(
				"select [user].organizationId as organizationId,organization.name as organizationName from [user] left join organization on [user].organizationId=organization.id where [user].loginName=? and [user].pwd=? and [user].roleId=?",
				loginName, MD5.encode(pwd), roleId);
		if(list.size()==0)
			return false;
		String organizationId = (String) list.get(0).get("organizationId");
		String organizationName = (String) list.get(0).get("organizationName");
		if (organizationId != null) {
			session.setAttribute("loginName", loginName);
			session.setAttribute("roleId", roleId);
			session.setAttribute("organizationId", organizationId);
			session.setAttribute("organizationName", organizationName);
			session.setMaxInactiveInterval(7200); // 会话超时2小时
			return true;
		} else
			return false;
	}
	/**
	 * 用户登出
	 * @param session
	 */
	@RequestMapping(value = "/logout.do")
	public void logout(HttpSession session) {
		session.invalidate();
	}
	/**
	 * 修改密码
	 * @param session
	 * @param oldPwd
	 * @param newPwd
	 * @return
	 */
	@RequestMapping(value = "/changePassword.do")
	public boolean changePassword(HttpSession session, String oldPwd, String newPwd) {
		
		String loginName = (String) session.getAttribute("loginName");
		int n=updateService.update("update [user] set pwd=? where loginName=? and pwd=?", MD5.encode(newPwd), loginName, MD5.encode(oldPwd));
		if(n>0)
			return true;
		else
			return false;
	}
	/**
	 * 重置密码
	 * @param loginName
	 * @param pwd
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/resetPassword.do")
	public boolean resetPassword(String loginName, String pwd) {

		int n=updateService.update("update [user] set pwd=? where loginName=?", MD5.encode(pwd), loginName);
		if(n>0)
			return true;
		else
			return false;
	}
	/**
	 * 密码MD5加密
	 */
	@RequestMapping(value = "/system/userAdmin/reset.do")
	public boolean  passwordReset() {
		int n=0;
		DataList list = queryService.query("select * from [user] ");
		System.out.println(list.toString());
		for (int i = 0; i < list.size(); i++) {
			String loginName=(String) list.get(i).get("loginName");
			String pwd = (String) list.get(i).get("pwd");
			if(pwd.length()<32)
			n=updateService.update("update [user] set pwd=? where loginName=?",MD5.encode(pwd),loginName);
		}
		
		if(n>0)
			return true;
		else
			return false;
       
    }
	/**
	 * 列出用户
	 * @param start
	 * @param limit
	 * @param roleId
	 * @param organizationId
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/listUser.do")
	public WebResponse list(Integer start, Integer limit, Integer roleId, String organizationId) {

		Condition c=new Condition();
		if(roleId!=null&&!roleId.equals("")&& roleId != -1)
		{
			c.and(new Condition("roleId", "=", roleId));
		}
		if(organizationId!=null&&!organizationId.equals("")&& !"a".equals(organizationId))
		{
			
			c.and(new Condition("organizationId","=",organizationId));
		}
		return queryService.queryPage(start, limit, c, "userView");
	}
	/**
	 * 获取用户角色
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getRoleId.do")
	public FormResponse getRoleId(HttpSession session) {
		FormResponse response = new FormResponse();
		String loginName = (String) session.getAttribute("loginName");
		DataList list = queryService.query("select * from [user] where loginName =?", loginName);
		response.setValue(list.get(0).get("roleId"));
		return response;

	}
	/**
	 * 获取当前用户信息
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/org/edit/user.do")
	public WebResponse getUser(HttpSession session) {
		WebResponse response = new WebResponse();
		String loginName = (String) session.getAttribute("loginName");
		DataList list =queryService.query("select * from userView where loginName = ?", loginName);
		response.put("value", list);
		return response;
	}
	/**
	 * 获取用户信息
	 * @param loginName
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/get.do")
	public WebResponse get(String loginName) {
		WebResponse response = new WebResponse();
		DataList list =queryService.query("select * from userView where loginName = ?", loginName);
		response.put("value", list);
		return response;
	}
	/**
	 * TODO 不明白此函数是干吗。。。
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/organizationList.do")
	public DataList organizationList() {
		DataList list=null;
			
		list=queryService.query("select * from organization");

		return list;
	}
	/**
	 * 添加用户
	 * @param loginName
	 * @param pwd
	 * @param roleId
	 * @param name
	 * @param addr
	 * @param tel
	 * @param mailbox
	 * @param organizationId
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/addUser.do")
	public boolean addUser(String loginName, @RequestParam(value = "pwd", defaultValue = "000000") String pwd, int roleId, String name, String tel,
			 String organizationId) {

		updateService.update("insert into [user](loginName,pwd,roleId,name,tel,organizationId) values(?,?,?,?,?,?)"
				, loginName
			, MD5.encode(pwd)
			, roleId
			, name
			, tel
			, organizationId);
		return true;
	}
	/**
	 * 删除用户
	 * @param loginName
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/deleteUser.do")
	public boolean delete(String loginName) {
		updateService.update("delete from [user] where loginName=?"
				, loginName);
		return true;
	}
	/**
	 * 修改用户
	 * @param loginName
	 * @param roleId
	 * @param name
	 * @param tel
	 * @param organizationId
	 * @return
	 */
	@RequestMapping(value = "/system/userAdmin/editUser.do")
	public boolean editUser(String loginName, String roleId,String name, String tel, String organizationId) {
		updateService.update(
			"update [user] set name=?,tel=? ,organizationId=?,roleId=? where loginName=?"
				, name
				, tel
				, organizationId
				, roleId
				, loginName);	
		
		return true;
	
	}
}