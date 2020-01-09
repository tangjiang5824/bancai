package cg.controller;


import cg.service.InsertProjectService;
import domain.DataList;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.ProductService;
import service.ProjectService;
import service.QueryService;
import service.Upload_Data_Service;
import vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ProjectController {

    private Logger log = Logger.getLogger(Upload_Data_Service.class);
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProductService productService;
    @Autowired
    private QueryService queryService;
    @Autowired
    private InsertProjectService insertProjectService;

    /*
    *这个方法实现项目的新建
    *
     */
    @RequestMapping(value="/generate_project.do")
    public boolean add_project(String s,HttpSession session,String projectName,String startTime,String proEndTime,String planLeader,String produceLeader,String purchaseLeader,String financeLeader,String storeLeader ) {
        JSONArray jsonArray = new JSONArray(s);
        String userid = session.getAttribute("userid")+"";
        //生成project计划表
        String sql1="insert into project (uploadId,startTime,projectName,proEndTime,planLeader,produceLeader,purchaseLeader,financeLeader,storeLeader,statusId) values(?,?,?,?,?,?,?,?,?,?) ";
        //插入到project表的同时返回projectId
        String projectId =insertProjectService.insertDataToTable(sql1,userid,startTime,projectName,proEndTime,planLeader,produceLeader,purchaseLeader,financeLeader,storeLeader,"1")+"";
        for (int i = 0; i < jsonArray.length(); i++) {
            ArrayList arrayList=new ArrayList();
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            String BuildingNo = jsonTemp.get("楼栋编号")+"";
            String BuildName = jsonTemp.get("楼栋名")+"";
            String BuildOwner = (String) jsonTemp.get("楼栋负责人");

            //插入楼栋信息
            String sql2="insert into building (buildingNo,buildingName,buildingOwner,projectId) values(?,?,?,?)";
            //插入到planlist表的同时返回planlistid
            String BuildingId=insertProjectService.insertDataToTable(sql2,BuildingNo,BuildName,BuildOwner,projectId)+"";
        }
        return true;
    }




}
