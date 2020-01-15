package zzy.controller;

import domain.DataList;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.ProjectService;
import service.QueryService;
import service.UpdateService;
import zzy.service.SelectAllBasic_material_oldpanel_product_service;
import zzy.service.Select_specification_from_materialName_service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
public class Select_specification_from_materialName_controller {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private Select_specification_from_materialName_service select_specification_from_materialName_service;

	/*
	 * 根据原材料名称如400U找出其所有的规格。（原材料领料模块）周洁
	 * */
	@RequestMapping(value="/material/findMaterialbasicinfo_SpecificationList.do")
	public void findMaterialbasicinfoList(HttpServletResponse response, HttpSession session,String materialName) throws IOException {
		DataList materialbasicinfo_SpecificationList = select_specification_from_materialName_service.findMaterialbasicinfo_SpecificationList("materialName");
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(materialbasicinfo_SpecificationList);
		object.put("materialbasicinfo_SpecificationList", array);
		//System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();
	}


}
