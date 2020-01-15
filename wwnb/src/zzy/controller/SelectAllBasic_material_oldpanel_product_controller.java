package zzy.controller;

import domain.DataList;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import service.ProjectService;
import service.QueryService;
import service.UpdateService;
import vo.UploadDataResult;
import vo.WebResponse;
import zzy.service.Project_import_design_list_service;
import zzy.service.SelectAllBasic_material_oldpanel_product_service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
public class SelectAllBasic_material_oldpanel_product_controller {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private SelectAllBasic_material_oldpanel_product_service selectAllBasic_material_oldpanel_product_service;

	/*
	 * 查询所有的materialbasicinfo
	 * */
	@RequestMapping(value="/material/findMaterialbasicinfoList.do")
	public void findMaterialbasicinfoList(HttpServletResponse response, HttpSession session) throws IOException {
//		String projectName = (String)session.getAttribute("projectName");
//		System.out.println("project/findBuildingList.do"+projectName);
		DataList materialbasicinfoList = selectAllBasic_material_oldpanel_product_service.findMaterialbasicinfoList("materialbasicinfo");
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(materialbasicinfoList);
		object.put("materialbasicinfoList", array);
		//System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();
	}
	/*
	 * 查询所有的oldpanelbasicinfo
	 * */
	@RequestMapping(value="/material/findOldpanelbasicinfoList.do")
	public void findOldpanelbasicinfoList(HttpServletResponse response, HttpSession session) throws IOException {
		DataList oldpanelbasicinfoList = selectAllBasic_material_oldpanel_product_service.findOldpanelbasicinfoList("oldpanelbasicinfo");
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(oldpanelbasicinfoList);
		object.put("oldpanelbasicinfoList", array);
		//System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();
	}
	/*
	 * 查询所有的productbasicinfo
	 * */
	@RequestMapping(value="/material/findProductbasicinfoList.do")
	public void findProductbasicinfoList(HttpServletResponse response, HttpSession session) throws IOException {
		DataList productbasicinfoList = selectAllBasic_material_oldpanel_product_service.findProductbasicinfoList("productbasicinfo");
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(productbasicinfoList);
		object.put("productbasicinfoList", array);
		//System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();
	}


}
