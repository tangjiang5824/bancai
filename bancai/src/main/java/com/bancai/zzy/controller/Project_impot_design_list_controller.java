package com.bancai.zzy.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.domain.DataList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.ProjectService;
import com.bancai.service.QueryService;
import com.bancai.service.UpdateService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;
import com.bancai.zzy.service.Project_import_design_list_service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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
	@Autowired
	private InsertProjectService insertProjectService;

	/*
	*用户登录
	*
	* */

	/*
	 * 查询所有的building，
	 * */
	@RequestMapping(value="/project/findBuildingList.do")
	public void findBuildingList(HttpServletResponse response, HttpSession session) throws IOException, JSONException {
		String projectName = (String)session.getAttribute("projectName");
		System.out.println("project/findBuildingList.do"+projectName);
		DataList buildingList = project_import_design_list_service.findBuildingList(projectName);
		//写回前端
		JSONObject object = new JSONObject();
		JSONArray array = new JSONArray(buildingList);
		object.put("buildingList", array);
		//System.out.println("类型1：--"+array.getClass().getName().toString());
		response.getWriter().write(object.toString());
		response.getWriter().flush();
		response.getWriter().close();
	}

	@RequestMapping(value="/project/getSelectedProjectName.do") 
	public void getSelectedProjectName(String projectName, HttpSession session) throws IOException {
		session.setAttribute("projectName", projectName);
		System.out.println("getSelectedProjectName===="+projectName);
	}
	@RequestMapping(value="/project/getSelectedBuildingName.do")
	public void getSelectedBuildingName(String buildingName, String projectName,HttpSession session) throws IOException {
		//session.setAttribute("buildingName", buildingName);
		System.out.println("getSelectedProjectName===="+buildingName);
		//获得buildingName对应的buildingId
		DataList buildingId = project_import_design_list_service.findBuildingId(buildingName);
		session.setAttribute("buildingId",buildingId.get(0).get("buildingId"));
	}

	/*
	 * 上传excel文件
	 * */

	@RequestMapping(value = "/project/Upload_Design_List_Excel.do",produces = { "text/html;charset=UTF-8" })
	public String uploadData(MultipartFile uploadFile, String materialtype, String tableName, Boolean check, HttpSession session) {
		WebResponse response = new WebResponse();
		String userid = (String) session.getAttribute("userid");
		try {
			UploadDataResult result = project_import_design_list_service.upload_Data(uploadFile.getInputStream(),materialtype,userid,tableName);
			response.setSuccess(result.success);
			response.setErrorCode(result.errorCode);
			response.setValue(result.data);

		} catch (IOException e) {
			e.printStackTrace();
			response.setSuccess(false);
			response.setErrorCode(1000); //未知错误
			response.setMsg(e.getMessage());
		}
		net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
		return json.toString();
	}

}
