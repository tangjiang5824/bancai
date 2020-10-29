package com.bancai.cg.controller;


import com.alibaba.excel.EasyExcel;
import com.bancai.cg.dao.designlistdao;
import com.bancai.cg.dao.workorderdetaildao;
import com.bancai.cg.dao.workorderlogdao;
import com.bancai.cg.dao.workordermatchresultdao;
import com.bancai.cg.entity.*;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.newPanelMatch;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.service.ProductService;
import com.bancai.service.ProjectService;
import com.bancai.service.QueryService;
import com.bancai.util.risk.easyexcel.MatchResult;
import com.bancai.util.risk.easyexcel.RequisitionOrder;
import com.bancai.util.risk.easyexcel.WorkOrder;
import com.bancai.vo.WebResponse;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class ProjectController {

    private Logger log = Logger.getLogger(ProjectController.class);
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProductService productService;
    @Autowired
    private QueryService queryService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private QueryAllService queryAllService;
    @Autowired
    private workorderdetaildao workorderdetaildao;
    @Autowired
    private workorderlogdao workorderlogdao;
    @Autowired
    private workordermatchresultdao workordermatchresultdao;
    @Autowired
    private designlistdao designlistdao;
    @Autowired
    private AnalyzeNameService analyzeNameService;


    /**
     * 生成项目计划，添加楼栋信息
     *
     * @param s
     * @param session
     * @param projectName
     * @param proEndTime
     * @param planLeaderId
     * @param produceLeaderId
     * @param purchaseLeaderId
     * @param financeLeaderId
     * @param storeLeaderId
     * @return
     */
    @RequestMapping(value = "/generate_project.do")
    @Transactional(rollbackFor = Exception.class)
    public WebResponse add_project(String s, HttpSession session, String projectName, String proStartTime, String proEndTime, String planLeaderId, String produceLeaderId, String purchaseLeaderId, String financeLeaderId, String storeLeaderId, String isPreprocess) throws IOException, JSONException {
        WebResponse response = new WebResponse();
        if (projectName == null || projectName.trim().length() == 0) {
            response.setSuccess(false);
            response.setMsg("请输入项目名！");
            response.setErrorCode(100);
            return response;
        }
        if (isPreprocess == null || isPreprocess.trim().length() == 0) {
            response.setSuccess(false);
            response.setMsg("请选择是否为预加工项目！");
            response.setErrorCode(200);
            return response;
        }
        JSONArray jsonArray = new JSONArray(s);
        String userid = null;
        if (session.getAttribute("userid") != null)
            userid = session.getAttribute("userid") + "";

        //应该先验证是否有项目重名的情况，返回时输出错误信息
        String sql_search = "select count(*) from project where projectName='" + projectName + "'";
        try {
            int projectName_count = insertProjectService.queryisexist(sql_search);
            if (projectName_count != 0) {
                response.setMsg("项目名已经存在！操作失败");
                response.setSuccess(false);
                response.setErrorCode(500);
                return response;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (planLeaderId.equals("")) planLeaderId = null;
        if (produceLeaderId.equals("")) produceLeaderId = null;
        if (purchaseLeaderId.equals("")) purchaseLeaderId = null;
        if (financeLeaderId.equals("")) financeLeaderId = null;
        if (storeLeaderId.equals("")) storeLeaderId = null;
        //生成project计划表
        String sql1 = "insert into project (uploadId,startTime,proStartTime,projectName,proEndTime,planLeaderId,produceLeaderId,purchaseLeaderId,financeLeaderId,storeLeaderId,statusId,isPreprocess) values(?,?,?,?,?,?,?,?,?,?,?,?) ";
        //插入到project表的同时返回projectId
        String projectId = insertProjectService.insertDataToTable(sql1, userid, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()), proStartTime, projectName, proEndTime, planLeaderId, produceLeaderId, purchaseLeaderId, financeLeaderId, storeLeaderId, "1", isPreprocess) + "";
        for (int i = 0; i < jsonArray.length(); i++) {
            ArrayList arrayList = new ArrayList();
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String BuildingNo = null;
            String BuildName = null;
            String BuildOwner = null;
            //获得第i条数据的各个属性值
            try {
                BuildingNo = jsonTemp.get("buildingNo") + "";
            } catch (JSONException e) {

            }
            try {
                BuildName = jsonTemp.get("buildingName") + "";
            } catch (JSONException e) {

            }
            try {
                BuildOwner = jsonTemp.get("buildingOwner") + "";
            } catch (JSONException e) {

            }
            if (BuildingNo == null && BuildName == null && BuildOwner == null) {
                break;
            }
            //插入楼栋信息
            String sql2 = "insert into building (buildingNo,buildingName,buildingLeader,projectId) values(?,?,?,?)";
            //插入到planlist表的同时返回planlistid
            String BuildingId = insertProjectService.insertDataToTable(sql2, BuildingNo, BuildName, BuildOwner, projectId) + "";
        }

        response.setSuccess(true);
        response.setMsg("创建成功");
        return response;
    }

    @RequestMapping("/com/bancai/cg/test.do")
    public void newPanelMatch(String projectId, String buildingId, String start, String limit) {
        if (null == start) start = "0";
        if (null == limit) limit = "50";
        //只设置了status一个查询条件
        DataList dataList = insertProjectService.findallbytableNameAndinfo("designlist", "status", "0", start, limit);
        ArrayList<Map> arrayList = new ArrayList<>();
        for (DataRow row : dataList) {
            Map<String, String> map = new HashMap<>();
            String name = (row.get("productName") + "").trim();
            if (name.contains("（")) {
                name.replace("（", "(");
            }
            if (name.contains("）")) {
                name.replace("）", ")");
            }
            String id = row.get("id") + "";
            map.put(name, id);
            arrayList.add(map);
        }
        ArrayList<Map> rsarrayList = new ArrayList<>();
        for (Map map : arrayList) {
            for (Object o : map.keySet()) {
                String temp = o + "";
                Map<String, Integer> newpanellsit = newPanelMatch.newpanel(temp);
                rsarrayList.add(newpanellsit);
                String id = map.get(temp) + "";
                String sql = "update designlist set status='1' where id=" + id;
                int flag = insertProjectService.update(sql);
                if (flag == 0) {
                    log.error("update错误");
                }
            }
        }

        HashMap<String, Integer> listmap = new HashMap<>();
        for (int i = 0; i < rsarrayList.size(); i++) {
            Map<String, Integer> map = rsarrayList.get(i);
            for (Map.Entry<String, Integer> entry : map.entrySet()) {
                String mapKey = entry.getKey();
                int mapValue = entry.getValue();
                if (listmap.containsKey(mapKey)) {
                    int temp = listmap.get(mapKey);
                    listmap.put(mapKey, mapValue + temp);
                } else {
                    listmap.put(mapKey, mapValue);
                }
            }
        }
        String sql2 = "insert into newpanelmateriallist (projectId,buildingId,materialName,materialCount) values(?,?,?,?)";
        String sql3 = "insert into projectmateriallist (projectId,buildingId,materialName,materialCount,countReceived,countNotReceived,countTemp) values(?,?,?,?,?,?,?)";
        for (Map.Entry<String, Integer> entry : listmap.entrySet()) {
            String materialName = entry.getKey();
            String materialCount = entry.getValue() + "";
            int i = insertProjectService.insertDataToTable(sql2, projectId, buildingId, materialName, materialCount);
            int j = insertProjectService.insertDataToTable(sql3, projectId, buildingId, materialName, materialCount, "0", materialCount, materialCount);
        }

    }


    //返回对应projectId的所有项目信息和对应的楼栋信息
    @RequestMapping(value = "/project/findProjectAndBuilding.do")
    public void findProjectAndBuilding(String projectId, String start, String limit, HttpServletResponse response) throws IOException, JSONException {

        DataList projectList = insertProjectService.findallbytableNameAndinfo("project_view", "id", projectId, start, limit);
        DataList buildingList = insertProjectService.findallbytableNameAndinfo("building_view", "projectId", projectId, start, limit);
        JSONObject object = new JSONObject();
        JSONArray parray = new JSONArray(projectList);
        JSONArray barray = new JSONArray(buildingList);
        object.put("project", parray);
        object.put("building", barray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    //返回对应projectId的楼栋信息
    @RequestMapping(value = "/project/findBuilding.do")
    public void findProjectBuilding(String projectId, String start, String limit, HttpServletResponse response) throws IOException, JSONException {
        //DataList projectList= insertProjectService.findallbytableNameAndinfo("project","id",projectId);
        DataList buildingList = insertProjectService.findallbytableNameAndinfo("building_view", "projectId", projectId, start, limit);
        JSONObject object = new JSONObject();
        //JSONArray parray =new JSONArray(projectList);
        JSONArray barray = new JSONArray(buildingList);
        //object.put("project",parray);
        object.put("building", barray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    //返回有查询条件的项目信息
    @RequestMapping("/project/findprojectBycondition.do")
    public WebResponse findProjectbyCondition(Integer start, Integer limit, String projectName, String startTime, String endTime, String proStartTime, String proEndTime, String planLeader, String produceLeader, String purchaseLeader, String financeLeader, String storeLeader) {
        mysqlcondition c = new mysqlcondition();
        String tableName = "project_view";
        if (null != projectName && projectName.length() != 0) {
            c.and(new mysqlcondition("projectName", "=", projectName));
        }
        if (null != startTime && startTime.length() != 0) {
            c.and(new mysqlcondition("startTime", ">=", startTime));
        }
        if (null != endTime && endTime.length() != 0) {
            c.and(new mysqlcondition("endTime", "<=", endTime));
        }
        if (null != proStartTime && proStartTime.length() != 0) {
            c.and(new mysqlcondition("proStartTime", ">=", proStartTime));
        }
        if (null != proEndTime && proEndTime.length() != 0) {
            c.and(new mysqlcondition("proEndTime", "<=", proEndTime));
        }
        if (null != planLeader && planLeader.length() != 0) {
            c.and(new mysqlcondition("planLeaderId", "=", planLeader));
        }
        if (null != produceLeader && produceLeader.length() != 0) {
            c.and(new mysqlcondition("produceLeaderId", "=", produceLeader));
        }
        if (null != purchaseLeader && purchaseLeader.length() != 0) {
            c.and(new mysqlcondition("purchaseLeaderId", "=", purchaseLeader));
        }
        if (null != financeLeader && financeLeader.length() != 0) {
            c.and(new mysqlcondition("financeLeaderId", "=", financeLeader));
        }
        if (null != storeLeader && storeLeader.length() != 0) {
            c.and(new mysqlcondition("storeLeaderId", "=", storeLeader));
        }
        return queryAllService.queryDataPage(start, limit, c, tableName);
    }

    /**
     * 下拉选择原材料类型
     *
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/material/materialType.do")
    public void findmaterialtype(HttpServletResponse response, String start, String limit) throws IOException, JSONException {
        DataList projectList = insertProjectService.findmaterialtype(start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(projectList);
        object.put("typeList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /**
     * 返回仓库所有的信息（仓库查询）
     *
     * @param
     * @throws IOException
     */
    @RequestMapping(value = "/material/findStoreInfo.do")
    public WebResponse findStoreInfo(Integer materialId, String countStore_min, String countStore_max, String countUse_min, String countUse_max, String warehouseName, Integer start, Integer limit, String tableName) {
//        String tableName = "Store_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
        mysqlcondition c = new mysqlcondition();
        if (null != materialId) {
            c.and(new mysqlcondition("materialId", "=", materialId));
        }
        if (null != countUse_min && countUse_min.length() != 0) {
            c.and(new mysqlcondition("countUse", ">=", countUse_min));
        }
        if (null != countUse_max && countUse_max.length() != 0) {
            c.and(new mysqlcondition("countUse", "<=", countUse_max));
        }
        if (null != countStore_min && countStore_min.length() != 0) {
            c.and(new mysqlcondition("countStore", ">=", countStore_min));
        }
        if (null != countStore_max && countStore_max.length() != 0) {
            c.and(new mysqlcondition("countStore", "<=", countStore_max));
        }
        if (null != warehouseName && warehouseName.length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName));
        }
        //不显示库存数量为0的记录
        c.and(new mysqlcondition("countStore", ">", 0));
        return queryAllService.queryDataPage(start, limit, c, tableName);
    }
    /**
     * 返回仓库中阈值数量以下所有的信息（仓库查询）
     *
     * @param
     * @throws IOException
     */
    @RequestMapping(value = "/material/findStoreThresholdInfo.do")
    public WebResponse findStoreThresholdInfo(Integer threshold, Integer start, Integer limit, String tableName) {
//        String tableName = "Store_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
        mysqlcondition c = new mysqlcondition();

        if (null != threshold) {
            //Integer threshold_int = Integer.parseInt(threshold);
            c.and(new mysqlcondition("countStore", "<=", threshold));
        }

        //不显示库存数量为0的记录
        //c.and(new mysqlcondition("countStore", ">", 0));
        return queryAllService.queryDataPage(start, limit, c, tableName);
    }
    /**
     * 返回所有的仓库名
     *
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/material/findStore.do")
    public void findStore(HttpServletResponse response, String start, String limit) throws IOException, JSONException {
        DataList StoreList = insertProjectService.findallbytableName("storeposition", start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray StoreNamearray = new JSONArray(StoreList);
        object.put("StoreName", StoreNamearray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 返回任意表的所有字段
     *
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/material/findAllBytableName.do")
    public void findAllbyTableName(HttpServletResponse response, String tableName, String start, String limit) throws IOException, JSONException {
        //thisPage，thisStart，thislimit用作分页，代码可以复用
        if (start == null) start = "0";
        if (limit == null) limit = "50";
        DataList table = insertProjectService.findallbytableName(tableName, start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray StoreArray = new JSONArray(table);
        object.put(tableName, StoreArray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 返回任意表的所有字段,需要传递一个字段和值作为查询条件
     *
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/material/findAllbyTableNameAndOnlyOneCondition.do")
    public void findAllbyTableNameAndOnlyOneCondition(HttpServletResponse response, String start, String limit, String tableName, String columnName, String columnValue) throws IOException, JSONException {
        DataList table = insertProjectService.findallbytableNameAndinfo(tableName, columnName, columnValue, start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray StoreNamearray = new JSONArray(table);
        object.put(tableName, StoreNamearray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 通过传入warehouseNo返回对应的行和列
     *
     * @param response
     * @param warehouseNo
     * @throws IOException
     */
    @RequestMapping(value = "/material/findStorePosition.do")
    public void findStorePosition(HttpServletResponse response, String start, String limit, String warehouseNo) throws IOException, JSONException {
        if (null == start) start = "0";
        if (null == limit) limit = "50";
        DataList rowNum = insertProjectService.findallbytableNameAndinfo("storeposition", "warehouseNo", warehouseNo, start, limit);
        List<Map> rowList = new ArrayList<>();
        List<Map> columnList = new ArrayList<>();
        for (int i = 1; i < Integer.parseInt(rowNum.get(0).get("rowNum") + "") + 1; i++) {
            Map<String, Integer> rowMap = new HashMap<>();
            rowMap.put("rowNum", i);
            rowList.add(rowMap);
        }
        for (int i = 1; i < Integer.parseInt(rowNum.get(0).get("columnNum") + "") + 1; i++) {
            Map<String, Integer> columnMap = new HashMap<>();
            columnMap.put("columnNum", i);
            columnList.add(columnMap);
        }
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array1 = new JSONArray(rowList);
        JSONArray array2 = new JSONArray(columnList);
        object.put("rowNum", array1);
        object.put("columnNum", array2);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }


    @RequestMapping(value = "/material/insertIntoOldPanelType.do")
    @Transactional
    public boolean insertToOldPanelType(String s) throws JSONException {
        JSONArray jsonArray = new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject = jsonArray.getJSONObject(i);
            String oldpanelTypeName = jsonObject.get("oldpanelTypeName") + "";
            String description = jsonObject.get("description") + "";
            String classificationId = jsonObject.get("classificationId") + "";
            String sql = "insert into oldpaneltype (oldpanelTypeName,description,classificationId) values(?,?,?)";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql, oldpanelTypeName, description, classificationId);
            if (!flag) {
                return false;
            }
        }
        return true;
    }

    @RequestMapping(value = "/material/insertIntoProductbasicinfo.do")
    @Transactional
    public boolean insertIntoProductbasicinfo(String s) throws JSONException {
        JSONArray jsonArray = new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject = jsonArray.getJSONObject(i);
            String productTypeName = jsonObject.get("productTypeName") + "";
            String description = jsonObject.get("description") + "";
            String sql = "insert into producttype (productTypeName,description) values(?,?)";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql, productTypeName, description);
            if (!flag) {
                return false;
            }
        }
        return true;
    }

//    //原材料仓库出库入库回滚
//    //类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
//    @RequestMapping(value = "/material/backMaterialstore.do")
//    @Transactional
//    public boolean backMaterialstore(String materiallogId,HttpSession session ,String operator,String type) throws JSONException {
//        String sql_find_log_detail="select * from material_logdetail where materiallogId=? and isrollback<>1";
//        String userid = (String) session.getAttribute("userid");
//        Date date=new Date();
//        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String update_log="update material_log set isrollback=1 where id=?";
//        //把isrollback改为1
//        insertProjectService.insertIntoTableBySQL(update_log,materiallogId);
//
//        //log主键
//        String sql_insert_new_log="insert into material_log (type,userId,time,operator,isrollback) values(?,?,?,?,?)";
//        int main_key=0;
//        //插入新的log
//        if (type.equals("0")) main_key= insertProjectService.insertDataToTable(sql_insert_new_log,"3",userid,simpleDateFormat.format(date),operator,"1");
//
//
//        DataList list=queryService.query(sql_find_log_detail,materiallogId);
//        for(int i=0;i<list.size();i++){
//            String materialstoreId=list.get(i).get("materialstoreId")+"";
//            String materialName="";
//            String specification="";
//            String materialId="";
//
//            if(null!=list.get(i).get("materialName")) materialName=list.get(i).get("materialName")+"";
//            if(null!=list.get(i).get("specification")) specification=list.get(i).get("specification")+"";
//            if(null!=list.get(i).get("materialId")) materialId=list.get(i).get("materialId")+"";
//            String count=list.get(i).get("count")+"";
//            int count_to_op=Integer.valueOf(count);
//            if(type.equals("0")){
//                //撤销入库
//
//                //进行回滚出库
//               String sql_find_list="select * from material_store where id=?";
//               DataList count_list=queryService.query(sql_find_list,materialstoreId);
//               if(count_list.size()!=1||Integer.valueOf(count_list.get(0).get("count")+"")!=count_to_op) return  false;
//               String sql_update_count="update material_store set count=0 where id=?";
//               insertProjectService.insertIntoTableBySQL(sql_update_count,materialstoreId);
//
//                //修改完成撤销的原logdetail
//                String detail_id=list.get(i).get("id")+"";
//                String update_detail_isrollback="update material_logdetail set isrollback=1 where id=?";
//                insertProjectService.insertIntoTableBySQL(update_detail_isrollback,detail_id);
//                //插入新的detail
//                String sql_insert_new_detial="insert into material_logdetail (materialName,count,specification,materiallogId,materialId,materialstoreId,isrollback) values(?,?,?,?,?,?,?)";
//                insertProjectService.insertIntoTableBySQL(sql_insert_new_detial,materialName,count,specification,main_key+"",materialId,materialstoreId,"1");
//            }
//        }
//
//        return true;
//    }


    //原材料仓库出库，直接进行给定数值的仓库扣减
    @RequestMapping(value = "/material/updateMaterialNum.do")
    @Transactional
    public boolean updateMaterialNum(String s) throws JSONException {
        JSONArray jsonArray = new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            String id = jsonObject.get("id") + "";
            String tempPickNum = "0";
            try {
                tempPickNum = jsonObject.get("tempPickNum") + "";
            } catch (Exception e) {

            }
            String sql = "update material set number=number-? where id=?";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql, tempPickNum, id);
            if (!flag) {
                return false;
            }
        }

        return true;
    }
    //修改待领、已领、本次领取数量
//    @RequestMapping(value = "/material/updateprojectmateriallist.do")
//    @Transactional
//    public boolean updateprojectmateriallist(String s){
//        JSONArray jsonArray = new JSONArray(s);
//        for (int i = 0; i < jsonArray.length(); i++) {
//            JSONObject jsonObject=jsonArray.getJSONObject(i);
//            String countTemp=jsonObject.get("countTemp")+"";
//            String id=jsonObject.get("id")+"";
//            String sql="update projectmateriallist set countTemp=countNotReceived-? ,countReceived=countReceived+? ,countNotReceived=countNotReceived-?  where id=?";
//            boolean flag=insertProjectService.insertIntoTableBySQL(sql,countTemp,countTemp,countTemp,id);
//            if(!flag){
//                return  false;
//            }
//        }
//        return true;
//    }

    //原材料出库以及更新领料单
    //在原材料和入库之间新增领料
    //这个方法是领料出库界面
    @RequestMapping(value = "/material/updateprojectmateriallist.do")
    @Transactional
    public boolean updateprojectmateriallist(String s, String materialList, HttpSession session) throws JSONException {
        //原材料,原材料仓库出库，直接进行给定数值的仓库扣减
        materialList = materialList.substring(0, materialList.length() - 2);
        materialList = materialList + "]";
        String userid = (String) session.getAttribute("userid");
        String sql_log = "insert into materiallog (type,userId,time,projectId) values(?,?,?,?)";
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //领料单 jsonArray
        JSONArray jsonArray = new JSONArray(s);
        String projectId = jsonArray.getJSONObject(0).get("projectId") + "";
        int main_key = insertProjectService.insertDataToTable(sql_log, "1", userid, simpleDateFormat.format(date), projectId);
        //详细领的material
        JSONArray jsonArray1 = new JSONArray(materialList);
        for (int i = 0; i < jsonArray1.length(); i++) {
            JSONObject jsonObject = jsonArray1.getJSONObject(i);
            String id = jsonObject.get("id") + "";
            String tempPickNum = "0";
            try {
                tempPickNum = jsonObject.get("tempPickNum") + "";
            } catch (Exception e) {

            }
            if (!tempPickNum.equals("0")) {
                String materialName = jsonObject.get("materialName") + "";
                String specification = jsonObject.get("specification") + "";
                String sql_log_detail = "insert into materiallogdetail (materialName,count,specification,materiallogId) values (?,?,?,?)";
                boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_log_detail, materialName, tempPickNum, specification, String.valueOf(main_key));
                if (!is_log_right) {
                    return false;
                }
            }
            String sql = "update material set number=number-? where id=?";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql, tempPickNum, id);
            if (!flag) {
                return false;
            }
//            //插入log详细信息
//            String sql_detail="insert into materiallogdetail (materialName,count,specification,materiallogId) values (?,?,?,?) ";
//            boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_detail,materialName,count,specification,String.valueOf(main_key));
//            if(!is_log_right){
//                return false;
//            }
        }

        //领料单
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            String countTemp = jsonObject.get("countTemp") + "";
            String id = jsonObject.get("id") + "";
            String sql = "update projectmateriallist set countTemp=countNotReceived-? ,countReceived=countReceived+? ,countNotReceived=countNotReceived-?  where id=?";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql, countTemp, countTemp, countTemp, id);
            if (!flag) {
                return false;
            }
        }
        return true;
    }

    @RequestMapping("/material/materialreceivelist.do")
    public boolean addmaterialreceivelist(String s, String pickName, String pickTime, HttpSession session) {
        String userid = session.getAttribute("userid") + "";
        JSONArray array = new JSONArray(s);
        for (int i = 0; i < array.length(); i++) {
            JSONObject jsonObject = array.getJSONObject(i);
            String materialId = jsonObject.get("materialId") + "";
            String count = jsonObject.get("countTemp") + "";
            String id = jsonObject.get("id") + "";
            String sql = "insert into materialreceivelist (pickName,pickTime,materialId,count,uploadId) values (?,?,?,?,?)";
            boolean is_insert_right = insertProjectService.insertIntoTableBySQL(sql, pickName, pickTime, materialId, count, userid);
            if (!is_insert_right) {
                return false;
            }
            String sql2 = "update projectmateriallist set countTemp=countNotReceived-? ,countReceived=countReceived+? ,countNotReceived=countNotReceived-?  where id=?";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql2, count, count, count, id);
            if (!flag) {
                return false;
            }
        }
        return true;
    }

    /**
     * 通过projectId查询对应的领料单
     *
     * @param proejctId
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/materiallsitbyproject.do")
    public void findmateriallistbyproject(String proejctId, HttpServletResponse response, String start, String limit) throws IOException, JSONException {
        if (null == start) start = "0";
        if (null == limit) limit = "50";
        DataList materialtList = insertProjectService.findmateriallist(proejctId, start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(materialtList);
        object.put("materialList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /**
     * 通过projectId查询对应的旧板领料单
     *
     * @param proejctId
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/oldpanellsitbyproject.do")
    public void findoldpanellistbyproject(String proejctId, HttpServletResponse response, String start, String limit) throws IOException, JSONException {
        if (null == start) start = "0";
        if (null == limit) limit = "50";
        DataList materialtList = insertProjectService.findmateriallist(proejctId, start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(materialtList);
        object.put("materialList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /**
     * 通过领料单中的materialname 返回有库存中有哪些，数量多少
     *
     * @param materialName
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/materiallsitbyname.do")
    public void findmateriallistbybname(String materialName, HttpServletResponse response, String start, String limit) throws IOException, JSONException {
        if (null == start) start = "0";
        if (null == limit) limit = "50";
        //System.out.println("---------------------------------------1");
        DataList materialtList = insertProjectService.findmateriallistbyname(materialName, start, limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(materialtList);
        object.put("materialstoreList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
        //log.info(response);
    }

    //查询产品对应的匹配详情
    @RequestMapping("/project/workOrderDetialList.do")
    public WebResponse find_Workorder_List(Integer projectId, Integer buildingId, Integer buildingpositionId, Integer productMadeBy, Integer productId) {

        mysqlcondition c = new mysqlcondition();
        if (null != projectId) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null != buildingId) {
            c.and(new mysqlcondition("buildingId", "=", buildingId));
        }
        if (null != buildingpositionId) {
            c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
        }
        if (null != productMadeBy) {
            c.and(new mysqlcondition("productMadeBy", "=", productMadeBy));
        }
        if (null != productId) {
            c.and(new mysqlcondition("productId", "=", productId));
        }
        c.and(new mysqlcondition("processStatus", "=", 0));
        WebResponse response = queryAllService.queryDataPage(0, -1, c, "query_match_result");
        DataList dataList = (DataList) response.get("value");
        Map<WorkorderproductList, Integer> map_list = new HashMap<>();
        WorkorderproductList sublist = new WorkorderproductList();
        for (int i = 0; i < dataList.size(); i++) {
            DataRow row = dataList.get(i);
            if (sublist.getDesignlistId() == null) {
                sublist.setDesignlistId((Integer) row.get("designlistId"));
                //  sublist.addId((Integer)row.get("designlistId"));
            }
            //   System.out.println(row.get("designlistId")!=sublist.getDesignlistId());
            if (!Objects.equals(row.get("designlistId"), sublist.getDesignlistId())) {
                if (map_list.containsKey(sublist)) {
                    map_list.put(sublist, map_list.get(sublist) + 1);
                } else {
                    map_list.put(sublist, 1);
                }
                sublist = new WorkorderproductList();
                sublist.setDesignlistId((Integer) row.get("designlistId"));
                // sublist.addId((Integer)row.get("designlistId"));
                sublist.addMap(row.get("name") + "", (Double) row.get("count"));
            } else {
                sublist.addMap(row.get("name") + "", (Double) row.get("count"));
            }
            if (i == dataList.size() - 1) {
                if (map_list.containsKey(sublist)) {
                    map_list.put(sublist, map_list.get(sublist) + 1);
                } else {
                    map_list.put(sublist, 1);
                }
            }
        }
        List<Map<String, Object>> rslist = new ArrayList<>();
        map_list.size();
        int index = 1;
        for (Map.Entry<WorkorderproductList, Integer> entry : map_list.entrySet()) {
            WorkorderproductList list = entry.getKey();
            Map<String, Double> submap = list.getMap();
            Map<String, Object> rsmap = null;
            for (Map.Entry<String, Double> subentry : submap.entrySet()) {
                rsmap = new HashMap<>();
                rsmap.put("index", index);
                rsmap.put("name", subentry.getKey());
                rsmap.put("count", subentry.getValue());
                rsmap.put("totalNumber", entry.getValue());
                rslist.add(rsmap);
            }
            index++;

        }
        response.put("value", rslist);

        return response;
    }

    @RequestMapping("/order/createworkorder.do")
    @Transactional
    public boolean createworkorder(String s, Integer operator, Integer projectId) {
        if (s == null || s.length() == 0) return false;
        WorkorderLog log = new WorkorderLog();
        log.setOperator(operator);
        log.setTime(new Date());
        log.setIsActive(0);
        log.setProjectId(projectId);
        workorderlogdao.save(log);
        JSONArray array = new JSONArray(s);
        for (int i = 0; i < array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            Integer productId = Integer.parseInt(object.get("productId") + "");
            Integer madeby = Integer.parseInt(object.get("madeBy") + "");
            Double count = Double.parseDouble(object.get("count") + "");
            WorkorderDetail detail = new WorkorderDetail();
            detail.setProductId(productId);
            detail.setProductMadeBy(madeby);
            detail.setWorkorderlogId(log.getId());
            detail.setStatus(0);
            detail.setCount(count);
            //Integer projectId=Integer.parseInt(object.get("projectId")+"");
            detail.setProjectId(projectId);
            Integer buildingId = Integer.parseInt(object.get("buildingId") + "");
            detail.setBuildingId(buildingId);
            Integer buildingpositionId = Integer.parseInt(object.get("buildingpositionId") + "");
            detail.setBuildingpositionId(buildingpositionId);
            workorderdetaildao.save(detail);
            mysqlcondition c = new mysqlcondition();
            if (null != projectId) {
                c.and(new mysqlcondition("projectId", "=", projectId));
            }
            if (null != buildingId) {
                c.and(new mysqlcondition("buildingId", "=", buildingId));
            }
            if (null != buildingpositionId) {
                c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
            }
            if (null != madeby) {
                c.and(new mysqlcondition("productMadeBy", "=", madeby));
            }
            if (null != productId) {
                c.and(new mysqlcondition("productId", "=", productId));
            }
            c.and(new mysqlcondition("processStatus", "=", 0));
            WebResponse response = queryAllService.queryDataPage(0, -1, c, "query_match_result");
            DataList dataList = (DataList) response.get("value");
            Set<Integer> set = new HashSet<>();
            for (int j = 0; j < dataList.size(); j++) {
                WorkorderMatchresult result = new WorkorderMatchresult();
                result.setMatchResultId(Integer.parseInt(dataList.get(j).get("id") + ""));
                result.setDetailId(detail.getId());
                workordermatchresultdao.save(result);
                set.add(Integer.parseInt(dataList.get(j).get("designlistId") + ""));
            }
            for (Integer designlistId : set) {
                String sql = "update designlist set processStatus=1,workorderLogId=? where id=?";
                boolean flag = insertProjectService.insertIntoTableBySQL(sql, log.getId() + "", designlistId + "");
                if (!flag) {
                    return false;
                }
            }
        }
        return true;

    }

    // 工单
    @RequestMapping("/order/workApproval.do")
    public boolean workApproval(Integer id, String type) {
        String isActive = null;
        String sql = "update work_order_log set isActive=? where id=?";
        //审核通过
        if (type.equals("1")) {
            isActive = "1";
        } else if (type.equals("2")) {
            isActive = "2";
            String sql2 = "update designlist set processStatus=0,workorderLogId=null where workorderLogId=?";
            boolean flag = insertProjectService.insertIntoTableBySQL(sql2, id + "");
            if (!flag) {
                return false;
            }
        }
        boolean flag = insertProjectService.insertIntoTableBySQL(sql, isActive, id + "");
        if (!flag) {
            return false;
        }
        return true;
    }

    //查询工单
    @RequestMapping("/order/workApprovalview.do")
    public WebResponse workApprovalview(Integer start, Integer limit, Integer projectId, Integer isActive) {
        if (start == null) start = 0;
        if (limit == null) limit = -1;
        mysqlcondition c = new mysqlcondition();
        if (null != projectId) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null != isActive) {
            c.and(new mysqlcondition("isActive", "=", isActive));
        }
        WebResponse response = queryAllService.queryDataPage(start, limit, c, "work_order_log_view");
        return response;
    }

    //下料
    @RequestMapping("/process/flow1")
    public Boolean workProcess1(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 1) {
            designlist.setProcessStatus(2);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //回滚下料
    @RequestMapping("/process/backflow1")
    public Boolean workBackProcess1(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 2) {
            designlist.setProcessStatus(1);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //焊接
    @RequestMapping("/process/flow2")
    public Boolean workProcess2(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 2) {
            designlist.setProcessStatus(3);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //回滚焊接
    @RequestMapping("/process/backflow2")
    public Boolean workBackProcess2(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 3) {
            designlist.setProcessStatus(2);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //喷漆
    @RequestMapping("/process/flow3")
    public Boolean workProcess3(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 3) {
            designlist.setProcessStatus(4);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //喷漆
    @RequestMapping("/process/backflow3")
    public Boolean workBackProcess3(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 4) {
            designlist.setProcessStatus(3);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //组装
    @RequestMapping("/process/flow4")
    public Boolean workProcess4(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 4) {
            designlist.setProcessStatus(5);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //回滚组装
    @RequestMapping("/process/backflow4")
    public Boolean workBackProcess4(Integer id) {
        Designlist designlist = designlistdao.findById(id).orElse(null);
        if (designlist != null && designlist.getProcessStatus() == 5) {
            designlist.setProcessStatus(4);
            designlistdao.save(designlist);
        } else {
            return false;
        }
        return true;
    }

    //打印工单
    @RequestMapping("/project/printWorkOrder.do")
    public Boolean printWorkOrder(Integer start, Integer limit, Integer workorderlogId, Integer isActive) {
        System.out.println("zzyzzyzyyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzzyyzyzyzyzy");
        System.out.println(workorderlogId);

        String fileName = "C:\\Users\\Administrator\\Desktop\\" + "easytest.xlsx";
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // 如果这里想使用03 则 传入excelType参数即可
        //write(fileName,格式类)
        //sheet(表名)
        //doWrite(数据)


        if (start == null) start = 0;
        if (limit == null) limit = -1;
        mysqlcondition c = new mysqlcondition();
        if (null != workorderlogId) {
            c.and(new mysqlcondition("workorderlogId", "=", workorderlogId));
        }
//        if (null!=isActive) {
//            c.and(new mysqlcondition("isActive", "=", isActive));
//        }
        WebResponse response = queryAllService.queryDataPage(start, limit, c, "work_order_detail_match_result");
        if (!(boolean) response.get("success"))
            return false;
        //return response;
        EasyExcel.write(fileName, WorkOrder.class).sheet("工单").doWrite(WorkOrder_Data(response));
        return true;
    }

    //打印领料单
    @RequestMapping("/project/printRequisitionOrder.do")
    public Boolean printRequisitionOrder(Integer start, Integer limit, Integer requisitionOrderId) {
        System.out.println("zzyzzyzyyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzzyyzyzyzyzy");
        System.out.println(requisitionOrderId);

        String fileName = "C:\\Users\\Administrator\\Desktop\\单号" +requisitionOrderId +"领料单.xlsx";
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // 如果这里想使用03 则 传入excelType参数即可
        //write(fileName,格式类)
        //sheet(表名)
        //doWrite(数据)


        if (start == null) start = 0;
        if (limit == null) limit = -1;
        mysqlcondition c = new mysqlcondition();
        if (null != requisitionOrderId) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
        }
//        if (null!=isActive) {
//            c.and(new mysqlcondition("isActive", "=", isActive));
//        }
        WebResponse response = queryAllService.queryDataPage(start, limit, c, "work_order_detail_match_result");
        if (!(boolean) response.get("success"))
            return false;
        //return response;
        EasyExcel.write(fileName, WorkOrder.class).sheet("领料单").doWrite(RequisitionOrder_Data(response));
        return true;
    }
    //工单数据绑定
    private List<WorkOrder> WorkOrder_Data(WebResponse response) {
        List<WorkOrder> list = new ArrayList<WorkOrder>();
        System.out.println("之后为工单打印后台代码");
        System.out.println(response.get("totalCount"));
        int totalCount = Integer.parseInt(response.get("totalCount") + "");
        //boolean success = (boolean) response.get("success");
        System.out.println(response.get("success"));
        System.out.println(response.get("value"));
        //response中的具体数值
        DataList WorkOrder_TempList = (DataList) response.get("value");
        //System.out.println(WorkOrder_TempList.get(1));
        //System.out.println(WorkOrder_TempList.get(1).get("workOrderDetailId"));
        for (int i = 0; i < totalCount; i++) {
            WorkOrder workOrder_row = new WorkOrder();
            workOrder_row.setDate((Date) WorkOrder_TempList.get(i).get("date"));
            workOrder_row.setWorkorderlogId(WorkOrder_TempList.get(i).get("workorderlogId") + "");
            workOrder_row.setProjectName(WorkOrder_TempList.get(i).get("projectName").toString());
            workOrder_row.setBuildingName(WorkOrder_TempList.get(i).get("buildingName") + "");
            workOrder_row.setPositionName(WorkOrder_TempList.get(i).get("positionName") + "");
            workOrder_row.setProductMadeBy(WorkOrder_TempList.get(i).get("productMadeBy") + "");
            workOrder_row.setProductName(WorkOrder_TempList.get(i).get("productName") + "");
            workOrder_row.setProductCount(Double.parseDouble(WorkOrder_TempList.get(i).get("productCount") + ""));
            workOrder_row.setIsActive(WorkOrder_TempList.get(i).get("isActive").toString());
            workOrder_row.setName(WorkOrder_TempList.get(i).get("name") + "");
            workOrder_row.setMaterialCount(Double.parseDouble((WorkOrder_TempList.get(i).get("materialCount")) + ""));
            workOrder_row.setIsCompleteMatch(WorkOrder_TempList.get(i).get("isCompleteMatch") + "");
            list.add(workOrder_row);
        }
        return list;
    }
    //领料单数据绑定
    private List<RequisitionOrder> RequisitionOrder_Data(WebResponse response) {
        List<RequisitionOrder> list = new ArrayList<RequisitionOrder>();
        System.out.println("之后为工单打印后台代码");
        System.out.println(response.get("totalCount"));
        int totalCount = Integer.parseInt(response.get("totalCount") + "");
        //boolean success = (boolean) response.get("success");
        System.out.println(response.get("success"));
        System.out.println(response.get("value"));
        //response中的具体数值
        DataList RequisitionOrder_TempList = (DataList) response.get("value");
        //System.out.println(WorkOrder_TempList.get(1));
        //System.out.println(WorkOrder_TempList.get(1).get("workOrderDetailId"));
        for (int i = 0; i < totalCount; i++) {
            RequisitionOrder requisitionOrder_row = new RequisitionOrder();
            //workOrder_row.setDate((Date)WorkOrder_TempList.get(i).get("date"));
            requisitionOrder_row.setRequisitionOrderId(RequisitionOrder_TempList.get(i).get("requisitionOrderId")+"");
            requisitionOrder_row.setWorkorderlogId(RequisitionOrder_TempList.get(i).get("workorderlogId")+"");
            requisitionOrder_row.setProjectName(RequisitionOrder_TempList.get(i).get("projectName").toString());
            requisitionOrder_row.setBuildingName(RequisitionOrder_TempList.get(i).get("buildingName") + "");
            requisitionOrder_row.setPositionName(RequisitionOrder_TempList.get(i).get("positionName") + "");
            requisitionOrder_row.setWarehouseName(RequisitionOrder_TempList.get(i).get("warehouseName")+"");
            requisitionOrder_row.setName(RequisitionOrder_TempList.get(i).get("name") + "");
            //requisitionOrder_row.setProductCount(Double.parseDouble(RequisitionOrder_TempList.get(i).get("productCount")+""));
//            requisitionOrder_row.setIsActive(RequisitionOrder_TempList.get(i).get("isActive").toString());
//            requisitionOrder_row.setName(RequisitionOrder_TempList.get(i).get("name")+"");
//            requisitionOrder_row.setMaterialCount(Double.parseDouble((RequisitionOrder_TempList.get(i).get("materialCount"))+""));
            requisitionOrder_row.setCountAll(RequisitionOrder_TempList.get(i).get("countAll") + "");
            requisitionOrder_row.setCountRec(RequisitionOrder_TempList.get(i).get("countRec") + "");
            requisitionOrder_row.setTime((Date)RequisitionOrder_TempList.get(i).get("time"));
            requisitionOrder_row.setCountAll(RequisitionOrder_TempList.get(i).get("countAll") + "");
            list.add(requisitionOrder_row);
        }
        return list;
    }

    //打印匹配结果
    @RequestMapping(value = "/project/printMatchResult.do")
    @ApiOperation("打印旧板匹配结果")
    public Boolean printOldpanelMatchResult(Integer start, Integer limit, Integer projectId,
                                            Integer buildingId, Integer buildingpositionId,Integer madeBy) {
        String fileName = "C:\\Users\\Administrator\\Desktop\\" + "匹配结果" + analyzeNameService.getTime() + ".xlsx";
        if (start == null) start = 0;
        if (limit == null) limit = -1;
        mysqlcondition c = new mysqlcondition();
        if (null != projectId) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null != buildingId) {
            c.and(new mysqlcondition("buildingId", "=", buildingId));
        }
        if (null != buildingpositionId) {
            c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
        }
        if (null != madeBy) {
            c.and(new mysqlcondition("productMadeBy", "=", madeBy));
        }
        WebResponse response = queryAllService.queryDataPage(start, limit, c, "query_match_result");
        //return response;
        EasyExcel.write(fileName, MatchResult.class).sheet("匹配结果").doWrite(MatchResult_Data(response));
        return true;
    }
    //匹配结果数据绑定
    private List<MatchResult> MatchResult_Data(WebResponse response) {
        List<MatchResult> list = new ArrayList<MatchResult>();
        DataList tempList = (DataList) response.get("value");
        if (tempList != null && tempList.size() != 0) {
            for (DataRow dataRow : tempList) {
                MatchResult row = new MatchResult();
                row.setProjectName(dataRow.get("projectName") + "");
                row.setBuildingName(dataRow.get("buildingName") + "");
                row.setBuildingpositionName(dataRow.get("buildingpositionName") + "");
                row.setProductName(dataRow.get("productName") + "");
//                row.setProductInventoryUnit(dataRow.get("productInventoryUnit") + "");
//                row.setProductUnitArea(Double.parseDouble(dataRow.get("productUnitArea") + ""));
//                row.setProductUnitWeight(Double.parseDouble(dataRow.get("productUnitWeight") + ""));
//                row.setProductCount(Double.parseDouble(dataRow.get("productCount") + ""));
//                row.setProductTotalArea(Double.parseDouble(dataRow.get("productTotalArea") + ""));
//                row.setProductTotalWeight(Double.parseDouble(dataRow.get("productTotalWeight") + ""));
//                row.setOldpanelName(dataRow.get("oldpanelName") + "");
//                row.setOldpanelInventoryUnit(dataRow.get("oldpanelInventoryUnit") + "");
//                row.setOldpanelCount(Double.parseDouble(dataRow.get("oldpanelCount") + ""));
//                row.setOldpanelTotalArea(Double.parseDouble(dataRow.get("oldpanelTotalArea") + ""));
//                row.setOldpanelTotalWeight(Double.parseDouble(dataRow.get("oldpanelTotalWeight") + ""));
//                row.setWarehouseName(dataRow.get("warehouseName") + "");
                row.setIsCompleteMatch(dataRow.get("productMadeBy") + "");
                row.setIsCompleteMatch(dataRow.get("name") + "");
                row.setIsCompleteMatch(dataRow.get("count") + "");
                row.setIsCompleteMatch(dataRow.get("isCompleteMatch") + "");
                list.add(row);
            }
        }
        return list;
    }



}
