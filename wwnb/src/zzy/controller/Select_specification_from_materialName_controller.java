package zzy.controller;

import commonMethod.QueryAllService;
import db.mysqlcondition;
import domain.DataList;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.ProjectService;
import service.QueryService;
import service.UpdateService;
import vo.WebResponse;
import zzy.service.Select_specification_from_materialName_service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
public class Select_specification_from_materialName_controller {

	@Autowired
	private QueryAllService queryAllService;

	/*
	 * 根据原材料名称如400U找出其所有的规格。（原材料领料模块）周洁
	 * */
	@RequestMapping(value="/material/findMaterial_SpecificationList.do")
	public WebResponse findMaterialbasicinfoList(Integer start, Integer limit,String materialName) throws IOException {
		String tableName = "material";
		mysqlcondition c=new mysqlcondition();
		if (materialName.length() != 0) {
			c.and(new mysqlcondition("materialName", "=", materialName));
		}
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}


}
