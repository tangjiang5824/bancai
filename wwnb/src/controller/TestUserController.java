package controller;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



import db.Condition;
import domain.DataList;
import service.InsertService;
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
	@Autowired
	private InsertService insertService;

	
	@RequestMapping(value = "/testLogin.do")
	public boolean login(String username, String password, int roleId, HttpSession session) {
		System.out.println("===============================================TestUserController");

		DataList list = queryService.query(
				"select * from user where username=? and password=? and usertype=?",
				username, password, roleId);
		System.out.println(list.size());
		if(list.size()==0)
			return false;
		else
		{
			session.setAttribute("username", username);
			session.setAttribute("roleId", roleId);
			session.setMaxInactiveInterval(7200); // 会话超时2小时
			return true;
		}
	}
	/**
	 * 修改密码
	 * @param session
	 * @param oldPwd
	 * @param newPwd
	 * @return
	 */
	@RequestMapping(value = "/bancai_info_upload.do")
	public boolean bancai_info_upload(String s) {
		System.out.println("===============================================TestUpLoad");
		JSONArray jsa = new JSONArray(s);
		//System.out.println(jsa);
		//int successNum=0;
		for(int i=0;i<jsa.length();i++)
		{
			int pinhao =Integer.parseInt(jsa.getJSONObject(i).getString("pinhao"));
			System.out.println("===============================================TestUpLoad2"+pinhao);
			String pinming=jsa.getJSONObject(i).getString("pinming");
			String guige=jsa.getJSONObject(i).getString("guige");
			String kucundanwei=jsa.getJSONObject(i).getString("kucundanwei");
			String cangkubianhao=jsa.getJSONObject(i).getString("cangkubianhao");
			int shuliang=Integer.parseInt(jsa.getJSONObject(i).getString("shuliang"));
			double chengben=Double.parseDouble(jsa.getJSONObject(i).getString("chengben"));
			String cunfangweizhi=jsa.getJSONObject(i).getString("cunfangweizhi");
			
			
			System.out.println("============="+pinhao+pinming+kucundanwei+cangkubianhao+shuliang+chengben+cunfangweizhi);
			insertService.addData(pinhao, pinming, guige, kucundanwei, cangkubianhao, shuliang, chengben, cunfangweizhi);
			//successNum=successNum + updateService.update(sqlStr, pinhao, pinming,guige,kucundanwei,cangkubianhao,shuliang,chengben,cunfangweizhi);
			
		}
		//if(successNum==jsa.length())
		return true;
		//else
			//return false;
	}

}
