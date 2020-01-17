package cg.controller;


import cg.service.InsertProjectService;
import cg.util.newPanelMatch;
import domain.DataList;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
    public void add_project(String s,HttpServletResponse response,HttpSession session,String projectName,String startTime,String proEndTime,String planLeader,String produceLeader,String purchaseLeader,String financeLeader,String storeLeader ) throws IOException {
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

    public void newPanelMatch(){
        DataList dataList = insertProjectService.findallbytableNameAndinfo("designlight","status","0");
        ArrayList<Map> arrayList = new ArrayList<Map>();
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
                String sql="update designlist set status='0' where id="+id;
                int flag=insertProjectService.update(sql);
                if(flag==0){
                    log.error("update错误");
                }
            }
        }

        HashMap<String, Integer> listmap = new HashMap<>();
//        for (int i = 0; i < rsarrayList.size(); i++) {
//            Map<String,Integer> map= rsarrayList.get(i);
//            for(Map.Entry<String, Integer> entry : map.entrySet()){
//                String mapKey = entry.getKey();
//                int mapValue = entry.getValue();
//                if(listmap)
//            }
//        }


    }





    //返回对应projectId的所有项目信息和对应的楼栋信息
    @RequestMapping(value="/project/findProjectAndBuilding.do")
    public void findProjectAndBuilding(String projectId,HttpServletResponse response) throws IOException {
            DataList projectList= insertProjectService.findallbytableNameAndinfo("project","id",projectId);
            DataList buildingList=insertProjectService.findallbytableNameAndinfo("building","projectId",projectId);
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

    /**
     * 下拉选择原材料类型
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/materialType.do")
    public void findmaterialtype(HttpServletResponse response) throws IOException {
        DataList projectList = insertProjectService.findmaterialtype();
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
     * 返回所有的仓库名
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/material/findStore.do")
    public void findStore(HttpServletResponse response) throws IOException {
        DataList StoreName = insertProjectService.findallbytableName("storeposition","warehouseNo","warehouseName");
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray StoreNamearray = new JSONArray(StoreName);
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
    public void findAllbyTableName(HttpServletResponse response,String tableName) throws IOException {
        DataList table = insertProjectService.findallbytableName(tableName);
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
    public void findAllbyTableNameAndOnlyOneCondition(HttpServletResponse response,String tableName,String columnName,String columnValue) throws IOException {
        DataList table = insertProjectService.findallbytableNameAndinfo(tableName,columnName,columnValue);
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
    public void findStorePosition(HttpServletResponse response,String warehouseNo) throws IOException {
          DataList rowNum=insertProjectService.findallbytableNameAndinfo("storeposition","warehouseNo",warehouseNo);
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
        object.put("rowNum", rowList);
        object.put("columnNum", columnList);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }
    //向materialtype原材料类型表插入
    @RequestMapping(value = "/material/insertIntoMaterialType.do")
    @Transactional
    public boolean insertToMaterialType(String s){
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String materialTypeName = jsonObject.get("materialTypeName")+"";
            String name = jsonObject.get("name")+"";
            String sql ="insert into materialtype (materialTypeName,name) values(?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,materialTypeName,name);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    @RequestMapping(value = "/material/insertIntoOldPanelType.do")
    @Transactional
    public boolean insertToOldPanelType(String s){
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String oldpanelTypeName = jsonObject.get("oldpanelTypeName")+"";
            String name = jsonObject.get("name")+"";
            String sql ="insert into oldpaneltype (oldpanelTypeName,name) values(?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,oldpanelTypeName,name);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    @RequestMapping(value = "/material/insertIntoProductbasicinfo.do")
    @Transactional
    public boolean insertIntoProductbasicinfo(String s){
        JSONArray jsonArray =new JSONArray(s);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject=jsonArray.getJSONObject(i);
            String productName = jsonObject.get("productName")+"";
            String productType = jsonObject.get("productType")+"";
            String length = jsonObject.get("length")+"";
            String length2 = jsonObject.get("length2")+"";
            String width = jsonObject.get("width")+"";
            String width2 = jsonObject.get("width2")+"";
            String weight = jsonObject.get("weight")+"";
            String cost = "0";//jsonObject.get("cost")+""
            String sql ="insert into productbasicinfo (productName,productType,length,length2,width,width2,weight,cost) values(?,?,?,?,?,?,?,?)";
            boolean flag= insertProjectService.insertIntoTableBySQL(sql,productName,productType,length,length2,width,width2,weight,cost);
            if(!flag){
                return  false;
            }
        }
        return true;
    }

    //原材料仓库出库，直接进行给定数值的仓库扣减
//    @RequestMapping(value = "/material/updateMaterialNum.do")
//    @Transactional
//    public boolean updateMaterialNum(String s){
//        JSONArray jsonArray =new JSONArray(s);
//        for (int i = 0; i < jsonArray.length(); i++) {
//            JSONObject jsonObject=jsonArray.getJSONObject(i);
//            String id =jsonObject.get("id")+"";
//            String tempPickNum="0";
//            try {
//                tempPickNum = jsonObject.get("tempPickNum") + "";
//            }catch (Exception e){
//
//            }
//            String sql="update material set number=number-? where id=?";
//            boolean flag=insertProjectService.insertIntoTableBySQL(sql,tempPickNum,id);
//            if(!flag){
//                return  false;
//            }
//        }
//
//        return true;
//    }

    //修改待领、已领、本次领取数量
    @RequestMapping(value = "/material/updateprojectmateriallist.do")
    @Transactional
    public boolean updateprojectmateriallist(String s,String materialList){
        //原材料,原材料仓库出库，直接进行给定数值的仓库扣减
        JSONArray jsonArray1 =new JSONArray(materialList);
        for (int i = 0; i < jsonArray1.length(); i++) {
            JSONObject jsonObject=jsonArray1.getJSONObject(i);
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

        //领料单
        JSONArray jsonArray = new JSONArray(s);
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


    /**
     * 通过projectId查询对应的领料单
     * @param proejctId
     * @param response
     * @throws IOException
     */
    @RequestMapping("/material/materiallsitbyproject.do")
    public void findmateriallistbyproject(String proejctId,HttpServletResponse response) throws IOException {
        DataList materialtList = insertProjectService.findmateriallist(proejctId);
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
    public void findmateriallistbybname(String materialName,HttpServletResponse response) throws IOException {

        //System.out.println("---------------------------------------1");
        DataList materialtList = insertProjectService.findmateriallistbyname(materialName);
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
    @Test
    public void test(){
        String s="a*b LS（SN） m LA";
        String[]a=s.split(" ");
        //String[]b=a[0].split("\\+");
       // double b=Double.parseDouble(a[0]); //java.lang.NumberFormatException: For input string: "a*b"
        System.out.println(Arrays.toString(a));
        ObjectMapper objectMapper=new ObjectMapper();
        //System.out.println(Arrays.toString(b));

    }


}
