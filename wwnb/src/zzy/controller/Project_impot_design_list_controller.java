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
import zzy.service.Project_import_design_list_service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class Project_impot_design_list_controller {
	@Autowired
	private QueryService queryService;
	@Autowired
	private UpdateService updateService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private Project_import_design_list_service project_import_design_list_service;

	/*
	*用户登录
	*
	* */

	/*
	 * 查询所有的building，
	 * */
	@RequestMapping(value="/project/findBuildingList.do")
	public void findProjectList(HttpServletResponse response,String projectName) throws IOException {
		System.out.println("project/findBuildingList.do");
		DataList buildingList = project_import_design_list_service.findBuildingList(projectName);
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(buildingList);
		object.put("buildingList", array);
		System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();

	}

}
