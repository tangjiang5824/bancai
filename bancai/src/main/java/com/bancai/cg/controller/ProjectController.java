package com.bancai.cg.controller;


import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.newPanelMatch;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.vo.WebResponse;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.service.ProductService;
import com.bancai.service.ProjectService;
import com.bancai.service.QueryService;

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

    /**
     *生成项目计划，添加楼栋信息
     * @param s
     * @param session
     * @param projectName
     * @param startTime
     * @param proEndTime
     * @param planLeader
     * @param produceLeader
     * @param purchaseLeader
     * @param financeLeader
     * @param storeLeader
     * @return
     */
    @RequestMapping(value="/generate_project.do")
    public void add_project(String s,HttpServletResponse response,HttpSession session,String projectName,String startTime,String proEndTime,String planLeader,String produceLeader,String purchaseLeader,String financeLeader,String storeLeader ) throws IOException, JSONException {
        JSONArray jsonArray = new JSONArray(s);
        String userid = session.getAttribute("userid")+"";

        //应该先验证是否有项目重名的情况，返回时输出错误信息
        String sql_search="select count(*) from project where projectName='"+projectName+"'";
        try {
            int projectName_count=insertProjectService.queryisexist(sql_search);
            if (projectName_count!=0){
                response.setCharacterEncoding("UTF-8");
                response.setContentType("text/html");
                response.getWriter().write("{'success':false,'showmessage':'项目名已经存在！操作失败'}");
                response.setStatus(500);
                response.getWriter().flush();
                response.getWriter().close();
                return ;
            }
        }catch (Exception e){
        e.printStackTrace();
    }
        //生成project计划表
        String sql1="insert into project (uploadId,startTime,projectName,proEndTime,planLeader,produceLeader,purchaseLeader,financeLeader,storeLeader,statusId) values(?,?,?,?,?,?,?,?,?,?) ";
        //插入到project表的同时返回projectId
        String projectId =insertProjectService.insertDataToTable(sql1,userid,startTime,projectName,proEndTime,planLeader,produceLeader,purchaseLeader,financeLeader,storeLeader,"1")+"";
        for (int i = 0; i < jsonArray.length(); i++) {
            ArrayList arrayList=new ArrayList();
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            String BuildingNo = jsonTemp.get("buildingNo")+"";
            String BuildName = jsonTemp.get("buildingName")+"";
            String BuildOwner = jsonTemp.get("buildingOwner")+"";

            //插入楼栋信息
            String sql2="insert into building (buildingNo,buildingName,buildingLeader,projectId) values(?,?,?,?)";
            //插入到planlist表的同时返回planlistid
            String BuildingId=insertProjectService.insertDataToTable(sql2,BuildingNo,BuildName,BuildOwner,projectId)+"";
        }
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(
                "{'success':true,'showmessage':'创建成功！'}");
        response.getWriter().flush();
        response.getWriter().close();
    }

    @RequestMapping("/com/bancai/cg/test.do")
    public void newPanelMatch(String projectId,String buildingId,String start,String limit){
        if(null==start) start="0";
        if(null==limit) limit="50";
        //只设置了status一个查询条件
        DataList dataList = insertProjectService.findallbytableNameAndinfo("designlist","status","0",start,limit);
        ArrayList<Map> arrayList = new ArrayList<>();
        for (DataRow row : dataList) {
            Map<String,String> map=new HashMap<>();
            String name = (row.get("productName")+"").trim();
            if(name.contains("（")){
                name.replace("（","(");
            }
            if(name.contains("）")){
                name.replace("）",")");
            }
            String id =row.get("id")+"";
            map.put(name,id);
            arrayList.add(map);
        }
        ArrayList<Map> rsarrayList =new ArrayList<>();
        for (Map map : arrayList) {
            for (Object o : map.keySet()) {
                String temp=o+"";
                Map<String, Integer> newpanellsit = newPanelMatch.newpanel(temp);
                rsarrayList.add(newpanellsit);
                String id= map.get(temp)+"";
                String sql="update designlist set status='1' where id="+id;
                int flag=insertProjectService.update(sql);
                if(flag==0){
                    log.error("update错误");
                }
            }
        }

        HashMap<String, Integer> listmap = new HashMap<>();
        for (int i = 0; i < rsarrayList.size(); i++) {
            Map<String,Integer> map= rsarrayList.get(i);
            for(Map.Entry<String, Integer> entry : map.entrySet()){
                String mapKey = entry.getKey();
                int mapValue = entry.getValue();
                if(listmap.containsKey(mapKey)){
                    int temp=listmap.get(mapKey);
                    listmap.put(mapKey,mapValue+temp);
                }else {
                    listmap.put(mapKey,mapValue);
                }
            }
        }
        String sql2="insert into newpanelmateriallist (projectId,buildingId,materialName,materialCount) values(?,?,?,?)";
        String sql3="insert into projectmateriallist (projectId,buildingId,materialName,materialCount,countReceived,countNotReceived,countTemp) values(?,?,?,?,?,?,?)";
        for(Map.Entry<String,Integer> entry: listmap.entrySet()){
            String materialName= entry.getKey();
            String materialCount=entry.getValue()+"";
            int i= insertProjectService.insertDataToTable(sql2,projectId,buildingId,materialName,materialCount);
            int j =insertProjectService.insertDataToTable(sql3,projectId,buildingId,materialName,materialCount,"0",materialCount,materialCount);
        }

    }





    //返回对应projectId的所有项目信息和对应的楼栋信息
    @RequestMapping(value="/project/findProjectAndBuilding.do")
    public void findProjectAndBuilding(String projectId,String start,String limit,HttpServletResponse response) throws IOException, JSONException {
            if(null==start) start="0";
            if(null==limit) limit="50";
            DataList projectList= insertProjectService.findallbytableNameAndinfo("project","id",projectId,start,limit);
            DataList buildingList=insertProjectService.findallbytableNameAndinfo("building","projectId",projectId,start,limit);
            JSONObject object=new JSONObject();
            JSONArray parray =new JSONArray(projectList);
            JSONArray barray=new JSONArray(buildingList);
            object.put("project",parray);
            object.put("building",barray);
            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/html");
            response.getWriter().write(object.toString());
            response.getWriter().flush();
            response.getWriter().close();
    }
    //返回对应projectId的楼栋信息
    @RequestMapping(value="/project/findBuilding.do")
    public void findProjectBuilding(String projectId,String start,String limit,HttpServletResponse response) throws IOException, JSONException {
        //DataList projectList= insertProjectService.findallbytableNameAndinfo("project","id",projectId);
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList buildingList=insertProjectService.findallbytableNameAndinfo("building","projectId",projectId,start,limit);
        JSONObject object=new JSONObject();
        //JSONArray parray =new JSONArray(projectList);
        JSONArray barray=new JSONArray(buildingList);
        //object.put("project",parray);
        object.put("building",barray);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 下拉选择原材料类型
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/materialType.do")
    public void findmaterialtype(HttpServletResponse response,String start,String limit) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList projectList = insertProjectService.findmaterialtype(start,limit);
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
     * @param
     * @throws IOException
     */
    @RequestMapping(value="/material/findStoreInfo.do")
    public WebResponse findStoreInfo(String materialName,String specification,String totalCount_min,String totalCount_max,String warehouseName,String page, String start, String limit)  {
        int thisPage=1;
        int thisStart=0;
        int thisLimit=25;
        if(null==page||page.equals("")){
            thisPage=1;
        }else {
            thisPage=Integer.parseInt(page);
        }
        if(null==start||start.equals("")||null==limit||limit.equals("")){
            thisStart=0;
            thisLimit=25;
        }else {
            thisLimit=Integer.parseInt(limit);
            thisStart=(thisPage-1)*thisLimit;
        }
        String tableName = "Store_view";
//		System.out.println(startWidth);
//		System.out.println(endWidth);
//
        mysqlcondition c=new mysqlcondition();
        if (null!=materialName&&materialName.length() != 0) {
            c.and(new mysqlcondition("materialName", "=", materialName));
        }
        if (null!=specification&&specification.length() != 0) {
            c.and(new mysqlcondition("specification", "=", specification));
        }
        if (null!=totalCount_min&&totalCount_min.length() != 0) {
            c.and(new mysqlcondition("totalCount", ">=", totalCount_min));
        }
        if (null!=totalCount_max&&totalCount_max.length() != 0) {
            c.and(new mysqlcondition("time", "<=", totalCount_max));
        }
        if (null!=warehouseName&&warehouseName.length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName));
        }
        return queryAllService.queryDataPage(thisStart, thisLimit, c, tableName);
    }

    /**
     * 返回所有的仓库名
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/findStore.do")
    public void findStore(HttpServletResponse response,String page,String start,String limit) throws IOException, JSONException {
        int thisPage=1;
        int thisStart=0;
        int thisLimit=25;
        if(null==page||page.equals("")){
            thisPage=1;
        }else {
            thisPage=Integer.parseInt(page);
        }
        if(null==start||start.equals("")||null==limit||limit.equals("")){
            thisStart=0;
            thisLimit=25;
        }else {
            thisLimit=Integer.parseInt(limit);
            thisStart=(thisPage-1)*thisLimit;
        }
        DataList StoreList = insertProjectService.findallbytableName("storeposition",start,limit);
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
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/findAllBytableName.do")
    public void findAllbyTableName(HttpServletResponse response,String tableName,String page,String start,String limit) throws IOException, JSONException {
        //thisPage，thisStart，thislimit用作分页，代码可以复用
        int thisPage=1;
        int thisStart=0;
        int thisLimit=25;
        if(null==page||page.equals("")){
            thisPage=1;
        }else {
            thisPage=Integer.parseInt(page);
        }
        if(null==start||start.equals("")||null==limit||limit.equals("")){
            thisStart=0;
            thisLimit=25;
        }else {
            thisLimit=Integer.parseInt(limit);
            thisStart=(thisPage-1)*thisLimit;
        }
        DataList table = insertProjectService.findallbytableName(tableName,thisStart+"",thisLimit+"");
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
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/findAllbyTableNameAndOnlyOneCondition.do")
    public void findAllbyTableNameAndOnlyOneCondition(HttpServletResponse response,String page,String start,String limit,String tableName,String columnName,String columnValue) throws IOException, JSONException {
        int thisPage=1;
        int thisStart=0;
        int thisLimit=25;
        if(null==page||page.equals("")){
            thisPage=1;
        }else {
            thisPage=Integer.parseInt(page);
        }
        if(null==start||start.equals("")||null==limit||limit.equals("")){
            thisStart=0;
            thisLimit=25;
        }else {
            thisLimit=Integer.parseInt(limit);
            thisStart=(thisPage-1)*thisLimit;
        }
        DataList table = insertProjectService.findallbytableNameAndinfo(tableName,columnName,columnValue,thisStart+"",thisLimit+"");
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
     * @param response
     * @param warehouseNo
     * @throws IOException
     */
    @RequestMapping(value="/material/findStorePosition.do")
    public void findStorePosition(HttpServletResponse response,String start,String limit,String warehouseNo) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList rowNum=insertProjectService.findallbytableNameAndinfo("storeposition","warehouseNo",warehouseNo,start,limit);
            List<Map> rowList =new ArrayList<>();
            List<Map> columnList =new ArrayList<>();
            for (int i = 1; i < Integer.parseInt(rowNum.get(0).get("rowNum")+"")+1; i++) {
                Map<String,Integer> rowMap = new HashMap<>();
                rowMap.put("rowNum",i);
                rowList.add(rowMap);
            }
            for (int i = 1; i < Integer.parseInt(rowNum.get(0).get("columnNum")+"")+1; i++) {
                Map<String, Integer> columnMap = new HashMap<>();
                columnMap.put("columnNum",i);
                columnList.add(columnMap);
            }
        //写回前端
        JSONObject object = new JSONObject();
            JSONArray array1=new JSONArray(rowList);
            JSONArray array2=new JSONArray(columnList);
        object.put("rowNum", array1);
        object.put("columnNum", array2);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }
    //向materialtype原材料类型表插入
    @RequestMapping(value = "/material/insertIntoMaterialType.do")
    @Transactional
    public boolean insertToMaterialType(String s) throws JSONException {
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String materialTypeName = jsonObject.get("materialTypeName")+"";
            String description = jsonObject.get("description")+"";
            String sql ="insert into materialtype (materialTypeName,description) values(?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,materialTypeName,description);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    @RequestMapping(value = "/material/insertIntoOldPanelType.do")
    @Transactional
    public boolean insertToOldPanelType(String s) throws JSONException {
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String oldpanelTypeName = jsonObject.get("oldpanelTypeName")+"";
            String description = jsonObject.get("description")+"";
            String sql ="insert into oldpaneltype (oldpanelTypeName,description) values(?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,oldpanelTypeName,description);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    @RequestMapping(value = "/material/insertIntoProductbasicinfo.do")
    @Transactional
    public boolean insertIntoProductbasicinfo(String s) throws JSONException {
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String productTypeName = jsonObject.get("productTypeName")+"";
            String description = jsonObject.get("description")+"";
//            String length = jsonObject.get("length")+"";
//            String length2 = jsonObject.get("length2")+"";
//            String width = jsonObject.get("width")+"";
//            String width2 = jsonObject.get("width2")+"";
//            String weight = jsonObject.get("weight")+"";
//            String cost = "0";//jsonObject.get("cost")+""
            String sql ="insert into producttype (productTypeName,description) values(?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,productTypeName,description);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    //原材料仓库出库入库回滚
    //类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
    @RequestMapping(value = "/material/backMaterialstore.do")
    @Transactional
    public boolean backMaterialstore(String materiallogId,HttpSession session,String id ,String operator,String type) throws JSONException {
        String sql_find_log_detail="select * from material_logdetail where materiallogId=? and isrollbcak<>1";
        String userid = (String) session.getAttribute("userid");
        String sql_insert_new_log="insert into material_log (type,userId,time,operator,isrollback) values(?,?,?,?,?)";
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String update_log="update material_log set isrollbcak=1 where id=?";
        //把isrollbcak改为1
        insertProjectService.insertIntoTableBySQL(update_log,id);

        //log主键
        int main_key=0;
        //插入新的log
        if (type.equals("0")) main_key= insertProjectService.insertDataToTable(sql_insert_new_log,"3",userid,simpleDateFormat.format(date),operator,"1");


        DataList list=queryService.query(sql_find_log_detail,materiallogId);
        for(int i=0;i<list.size();i++){
            String materialstoreId=list.get(i).get("materialstoreId")+"";
            String materialName="";
            String specification="";
            String materialId="";

            if(null!=list.get(i).get("materialName")) materialName=list.get(i).get("materialName")+"";
            if(null!=list.get(i).get("specification")) specification=list.get(i).get("specification")+"";
            if(null!=list.get(i).get("materialId")) materialId=list.get(i).get("materialId")+"";
            String count=list.get(i).get("count")+"";
            int count_to_op=Integer.valueOf(count);
            if(type.equals("0")){
                //撤销入库

                //进行回滚出库
               String sql_find_list="select * from material_store where id=?";
               DataList count_list=queryService.query(sql_find_list,materialstoreId);
               if(count_list.size()!=1||Integer.valueOf(count_list.get(0).get("count")+"")!=count_to_op) return  false;
               String sql_update_count="update material_store set count=0 where id=?";
               insertProjectService.insertIntoTableBySQL(sql_update_count,materialstoreId);

                //修改完成撤销的原logdetail
                String detail_id=list.get(i).get("id")+"";
                String update_detail_isrollback="update material_logdetail set isrollback=1 where id=?";
                insertProjectService.insertIntoTableBySQL(update_detail_isrollback,detail_id);
                //插入新的detail
                String sql_insert_new_detial="insert into material_logdetial (materialName,count,specification,materiallogId,materialId,materialstoreId,isrollback) values(?,?,?,?,?,?,?)";
                insertProjectService.insertDataToTable(sql_insert_new_detial,materialName,count,specification,materiallogId,materialId,main_key+"","1");
            }
        }

        return true;
    }



    //原材料仓库出库，直接进行给定数值的仓库扣减
    @RequestMapping(value = "/material/updateMaterialNum.do")
    @Transactional
    public boolean updateMaterialNum(String s) throws JSONException {
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject=jsonArray.getJSONObject(i);
            String id =jsonObject.get("id")+"";
            String tempPickNum="0";
            try {
                tempPickNum = jsonObject.get("tempPickNum") + "";
            }catch (Exception e){

            }
            String sql="update material set number=number-? where id=?";
            boolean flag=insertProjectService.insertIntoTableBySQL(sql,tempPickNum,id);
            if(!flag){
                return  false;
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
    public boolean updateprojectmateriallist(String s,String materialList,HttpSession session) throws JSONException {
        //原材料,原材料仓库出库，直接进行给定数值的仓库扣减
        materialList=materialList.substring(0,materialList.length()-2);
        materialList=materialList+"]";
        String userid= (String) session.getAttribute("userid");
        String sql_log="insert into materiallog (type,userId,time,projectId) values(?,?,?,?)";
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //领料单 jsonArray
        JSONArray jsonArray = new JSONArray(s);
        String projectId= jsonArray.getJSONObject(0).get("projectId")+"";
        int main_key= insertProjectService.insertDataToTable(sql_log,"1",userid,simpleDateFormat.format(date),projectId);
        //详细领的material
        JSONArray jsonArray1 = new JSONArray(materialList);
        for (int i = 0; i < jsonArray1.length(); i++) {
            JSONObject jsonObject=jsonArray1.getJSONObject(i);
            String id =jsonObject.get("id")+"";
            String tempPickNum="0";
            try {
                tempPickNum = jsonObject.get("tempPickNum") + "";
            }catch (Exception e){

            }
            if(!tempPickNum.equals("0")){
                String materialName =jsonObject.get("materialName")+"";
                String specification=jsonObject.get("specification")+"";
                String sql_log_detail="insert into materiallogdetail (materialName,count,specification,materiallogId) values (?,?,?,?)";
                boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_log_detail,materialName,tempPickNum,specification,String.valueOf(main_key));
                if(!is_log_right){
                    return false;
                }
            }
            String sql="update material set number=number-? where id=?";
            boolean flag=insertProjectService.insertIntoTableBySQL(sql,tempPickNum,id);
            if(!flag){
                return  false;
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
            JSONObject jsonObject=jsonArray.getJSONObject(i);
            String countTemp=jsonObject.get("countTemp")+"";
            String id=jsonObject.get("id")+"";
            String sql="update projectmateriallist set countTemp=countNotReceived-? ,countReceived=countReceived+? ,countNotReceived=countNotReceived-?  where id=?";
            boolean flag=insertProjectService.insertIntoTableBySQL(sql,countTemp,countTemp,countTemp,id);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    @RequestMapping("/material/materialreceivelist.do")
    public boolean addmaterialreceivelist(String s,String pickName,String pickTime,HttpSession session){
        String userid=session.getAttribute("userid")+"";
        JSONArray array=new JSONArray(s);
        for(int i=0;i<array.length();i++){
            JSONObject jsonObject=array.getJSONObject(i);
            String materialId = jsonObject.get("materialId")+"";
            String count=jsonObject.get("countTemp")+"";
            String id=jsonObject.get("id")+"";
            String sql="insert into materialreceivelist (pickName,pickTime,materialId,count,uploadId) values (?,?,?,?,?)";
            boolean is_insert_right= insertProjectService.insertIntoTableBySQL(sql,pickName,pickTime,materialId,count,userid);
            if(!is_insert_right){
                return false;
            }
            String sql2="update projectmateriallist set countTemp=countNotReceived-? ,countReceived=countReceived+? ,countNotReceived=countNotReceived-?  where id=?";
            boolean flag=insertProjectService.insertIntoTableBySQL(sql2,count,count,count,id);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    /**
     * 通过projectId查询对应的领料单
     * @param proejctId
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/materiallsitbyproject.do")
    public void findmateriallistbyproject(String proejctId,HttpServletResponse response,String start,String limit) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList materialtList = insertProjectService.findmateriallist(proejctId,start,limit);
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
     * @param proejctId
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/oldpanellsitbyproject.do")
    public void findoldpanellistbyproject(String proejctId,HttpServletResponse response,String start,String limit) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList materialtList = insertProjectService.findmateriallist(proejctId,start,limit);
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
     * @param materialName
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/materiallsitbyname.do")
    public void findmateriallistbybname(String materialName,HttpServletResponse response,String start,String limit) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        //System.out.println("---------------------------------------1");
        DataList materialtList = insertProjectService.findmateriallistbyname(materialName,start,limit);
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




    }
