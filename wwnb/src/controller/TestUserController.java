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
public class TestUserController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;

	
	@RequestMapping(value = "/testLogin.do")
	public boolean login(String username, String password, String usertype, HttpSession session) {
		System.out.println("===============================================TestUserController");

		DataList list = queryService.query(
				"select * from user where username=? and password=? and usertype=?",
				username, password, usertype);
		System.out.println(list.size());
		if(list.size()==0)
			return false;
		String userTypeName = String.valueOf(list.get(0).get("usertype"));
		System.out.println("用户类型名：："+userTypeName);
		if (userTypeName != null) {
			session.setAttribute("username", username);
			session.setAttribute("usertype", usertype);
			session.setAttribute("usertypeName", userTypeName);
			session.setMaxInactiveInterval(7200); // 会话超时2小时
			return true;
		} else
			return false;
	}

}
