package com.bancai.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bancai.domain.DataList;
import com.bancai.service.QueryService;
import com.bancai.service.UpdateService;

@RestController
public class TestUserController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;

	/*
	*用户登录
	*
	* */
	
	@RequestMapping(value = "/testLogin.do")
	@Transactional
	public boolean login(String username, String password, String usertype, HttpSession session) {
		DataList list = queryService.query(
				"select * from user where username=? and password=? and usertype=?",
				username, password, usertype);
//		System.out.println(list.size());
		if(list.size()==0)
			return false;
		String id = String.valueOf(list.get(0).get("id"));
		//System.out.println("用户类型名：："+userTypeName);
		if (id != null) {
			session.setAttribute("username", username);
			session.setAttribute("usertype", usertype);
			session.setAttribute("userid", id);
			session.setMaxInactiveInterval(7200); // 会话超时2小时
			return true;
		} else
			return false;
	}

}
