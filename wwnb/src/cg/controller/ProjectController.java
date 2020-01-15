package cg.controller;


import cg.service.InsertProjectService;
import domain.DataList;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
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
            String BuildOwner = (String) jsonTemp.get("buildingOwner");

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
