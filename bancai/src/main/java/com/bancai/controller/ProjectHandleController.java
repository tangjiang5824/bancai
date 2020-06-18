package com.bancai.controller;


import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.service.ProductService;
import com.bancai.service.ProjectService;
import com.bancai.service.QueryService;
import com.bancai.service.Upload_Data_Service;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ProjectHandleController {

    private Logger log = Logger.getLogger(Upload_Data_Service.class);
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProductService productService;
    @Autowired
    private QueryService queryService;


    @RequestMapping(value="/generateproduct.do")
    public boolean add_project(String s,HttpSession session,String projectName,String startTime) throws JSONException {
        JSONArray jsonArray = new JSONArray(s);
        String userid = (String) session.getAttribute("userid");
        //生成project计划表
        String sql1="insert into project (userId,startTime,projectName,statusId) values(?,?,?,?) ";
        //插入到project表的同时返回projectId
        String projectId =projectService.insertDataToProject(sql1,userid,startTime,projectName)+"";
        for (int i = 0; i < jsonArray.length(); i++) {
            ArrayList arrayList=new ArrayList();
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            String Length = (String) jsonTemp.get("长");
            String Type = (String) jsonTemp.get("类型");
            String Width = (String) jsonTemp.get("宽");
            String count = jsonTemp.get("数量")+"";
            int number= Integer.parseInt(count);
            int changstart=Integer.parseInt(Length);
            int changend=changstart+100;
            int kuanstart= Integer.parseInt(Width);
            int kuanend=kuanstart+100;
            //查询product表里面是否有相应的产品
            DataList list = queryService.query(
                    "select * from product where 长=? and 类型=? and 宽=?",
                    Length, Type, Width);
            if(list.size()!=1)
            {
                log.error("查询产品表product不为一个结果！ 结果为"+list.size());
                return false;
            }
            String productId=list.get(0).get("id")+"";

            String sql2="insert into planlist (projectId,productId,number) values(?,?,?)";
            //插入到planlist表的同时返回planlistid
            String planlistId=projectService.insertDataToPlanlist(sql2,projectId,productId,count)+"";
            while (number!=0){
                //通过product的长、类型、宽模糊查询material_info视图数量大于0，materialtype=0或1的值

                //只返回新旧版项
                DataList material_info_head=queryService.query("select * from material_info where 类型=? and 长>=? and 长<=? and 宽>=? and 宽<=? and (materialtype=1 or materialtype=0) and 数量>0 order by materialtype",Type,changstart,changend,kuanstart,kuanend);

                for (int i1 = 0; i1 < material_info_head.size(); i1++) {
                    if("0".equals(material_info_head.get(i1).get("materialType")+"")) {
                        DataList rule_list = queryService.query(
                                "select * from rule_union where productId=? and materialType=? and 规格='旧板' UNION select * from rule_union where productId=? and materialType=? and 规格<>'旧板'",
                                productId, "0",productId, "0"
                        );
                        int do_num =0;
                        for (int i2 = 0; i2 < rule_list.size(); i2++) {
                            if("旧板".equals(rule_list.get(i2).get("规格"))) {
                                Map<String,String> map = new HashMap<>();
                                int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "");
                                int have_num = Integer.parseInt(material_info_head.get(i1).get("数量") + "");
                                int need_num_per=Integer.parseInt(rule_list.get(i2).get("number") + "");
                                if(have_num<(number*need_num_per)) {  //拥有的件数少于要做的件数
                                    res = have_num - (have_num / need_num_per) * need_num_per;//做完后剩余数量
                                    do_num = (have_num - res) / need_num_per;           //做的件数
                                }else {
                                    res =have_num-(number*need_num_per);
                                    do_num = number;
                                }
                                map.put("name","旧版扣减");
                                map.put("doNum",do_num+"");
                                map.put("扣减数量",do_num*need_num_per+"");
                                map.put("materialId",material_info_head.get(i1).get("materialId")+"");
                                map.put("原本数量",material_info_head.get(i1).get("数量") + "");
                                map.put("剩余数量",res+"");
                                arrayList.add(map);
                            }else{
                                Map<String,String> map = new HashMap<>();
                                int need_num=Integer.parseInt(rule_list.get(i2).get("number") + "")*do_num;
                                //int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "")-need_num;  读不到原材料已有的数量，改用materialId直接扣减
                                map.put("name",rule_list.get(i2).get("规格")+"");
                                map.put("materialId",rule_list.get(i2).get("materialId")+"");
                                map.put("扣减数量",need_num+"");
                                arrayList.add(map);
                            }

                        }
                        number=number-do_num;
                        if(0==number)  break;
                    }

                }
                if (0==number) break;

                for (int i1 = 0; i1 < material_info_head.size(); i1++) {
                    if("1".equals(material_info_head.get(i1).get("materialType")+"")) {
                        DataList rule_list = queryService.query(
                                "select * from rule_union where productId=? and materialType=? and 规格='原材料' UNION select * from rule_union where productId=? and materialType=? and 规格<>'原材料'",
                                productId, "1",productId, "1"
                        );
                        for (int i2 = 0; i2 < rule_list.size(); i2++) {
                            if("原材料".equals(rule_list.get(i2).get("规格"))) {
                                Map<String,String> map = new HashMap<>();
                                //int have_num = Integer.parseInt(material_info_head.get(i1).get("数量") + "");
                                int need_num_per=Integer.parseInt(rule_list.get(i2).get("number") + "");
                                int all_need=number*need_num_per;//总共需要做的件数
                                map.put("name","原材料扣减");
                                map.put("doNum",number+"");
                                map.put("materialId",material_info_head.get(i1).get("materialId")+"");
                                map.put("扣减数量",all_need+"");
                                arrayList.add(map);
                            }else{
                                Map<String,String> map = new HashMap<>();
                                int need_num=Integer.parseInt(rule_list.get(i2).get("number") + "")*number;
                                //int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "")-need_num;  读不到原材料已有的数量，改用materialId直接扣减
                                map.put("name",rule_list.get(i2).get("规格")+"");
                                map.put("materialId",rule_list.get(i2).get("materialId")+"");
                                map.put("扣减数量",need_num+"");
                                arrayList.add(map);
                            }

                        }
                        number=0;
                        break;

                    }

                }
            }

            for (int i1 = 0; i1 < arrayList.size(); i1++) {
                String sql3= "insert into projectlist (projectId,planProductId,materialStoreId,number) values (?,?,?,?)";
                HashMap<String,String> tmp= (HashMap<String, String>) arrayList.get(i1);
                String Num =tmp.get("扣减数量");
                String materialId=tmp.get("materialId");
                //返回全部表项
                DataList material_info_list =queryService.query(
                        "select * from material_info where materialId=? and 数量>0 order by materialtype",materialId
                );
                String materialStoreId=material_info_list.get(0).get("id")+"";
                String projectListId =projectService.insertDataToProjectlist(sql3,projectId,productId,materialStoreId,Num)+"";

            }

        }
        return true;
    }


    /*
    * 添加计划清单
    *
    * */
    @RequestMapping(value="/createProject.do")
    public boolean createProject(String s,String startTime, String projectName, HttpSession session) throws JSONException {
        System.out.println("-------"+startTime);
        //项目创建时 statusId默认为1
        int statusId=1;
        //对project表进行操作
        String tableName="project";
        //获取用户id
        String userId = (String)session.getAttribute("userid");

        DataList productList=null;

        JSONArray jsonArray =new JSONArray(s);

        //project表插入数据
        projectService.createProject(tableName, startTime, projectName, userId, statusId);

//        //查询新创建的项目id
//        DataList project = projectService.findProjectByName(startTime, projectName, userId);
//        //获得对应产品的id
//        int projectId = (int) project.get(0).get("id");

        //根据传入的参数：长，类型，宽，与product表比较，查找产品productid，并添加到planList中
        for(int i=0;i< jsonArray.length();i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            String Length = (String) jsonTemp.get("长");
            String Type = (String) jsonTemp.get("类型");
            String Width = (String) jsonTemp.get("宽");
            int number = Integer.parseInt(jsonTemp.get("数量").toString());
            productList = productService.findProductIdByName(Length,Type,Width);


//            HashMap h =new HashMap();
//            h.put("长",Length);
//            h.put("类型",Type);
//            h.put("宽",Width);
//            h.put("数量",number);

            //获得对应产品的id
            int productId = (int) productList.get(0).get("id");
            System.out.println("产品id---："+productId);

            if(productList.size()==0){
                log.error("请输入正确的产品类型");
                return false;
            }
            //对计划清单表操作planList
            //projectService.createPlanList(projectId,productId,number);
            projectService.addPlanList(productId,number,userId,startTime,projectName);

            //与材料库中的长类型宽进行比对，返回匹配的材料
            String table = "material_info";//materialstore
            DataList materialList = projectService.materialTypeMap(jsonTemp,table);

            //返回满足条件的材料
            System.out.println("满足的有：---------------------------");
            System.out.println(materialList);

            //用一个hashmap存储需要更新的材料及数量
            HashMap material = new HashMap();

            //对数据处理，查规则
            for(int j=0; j<materialList.size();j++){
                DataRow dataRow = materialList.get(0);
                System.out.println("每条数据=====："+dataRow);
                //首先对materialList中材料类型为0（旧版）进行处理
                if(String.valueOf(dataRow.get("materialType")) == "0"){
                    //对旧版处理

                    //材料数量与输入的要求的数量进行比较
                    int materialType = 0;
                    //根据materialType和productId查询规则， 返回数组中主板数据放在最前面[0]
                    DataList rulesList = projectService.findrulesByTypeandId(materialType,productId);

                    //所需的材料
//                    int mId1 = (int) rulesList.get(0).get("materialId");
//                    int ruleNumber1 = (int) rulesList.get(0).get("number");
//                    int mId2 = (int) rulesList.get(1).get("materialId");
//                    int ruleNumber2 = (int) rulesList.get(1).get("number");
//                    int mId3 = (int) rulesList.get(2).get("materialId");
//                    int ruleNumber3 = (int) rulesList.get(2).get("number");
//
//                    //主板实际需要的数量=规则数量×产品数量
//                    int count = number*ruleNumber1;//一共需要的数量
//                    int RealNumber =(int)dataRow.get("数量");
//                    //当前主板数量足够时
//                    if(count < RealNumber){
//
//                        //数量进行扣减，操作数据库，并退出循环
//                        projectService.subMaterialNumber(mId1,count);
//
//                        break;
//
//
//                    }
                    //保存材料中主板的实际数量
//                    int temp;
//                    for(int k =0;k<rulesList.size();k++){
//                        //材料的id和所需数量
//                        DataRow oneRule = rulesList.get(0);
//                        int materialId = (int) oneRule.get("materialId");
//                        int ruleNumber = (int) oneRule.get("number");
//
//                        int count = number*ruleNumber;//一共需要的数量
//
//                        //为主板才时，可替换
//                        if(k == 0) {
//                            int realNumber = (int) dataRow.get("数量");
//                            if (count < realNumber) {
//                                //主板数量足够,
//                                //数量进行扣减，操作数据库，并退出循环
//                                int uploadNumber = realNumber - count;
//                                projectService.uploadMaterialNumber(materialId, uploadNumber);
//                            }else{
//
//                            }
//                        }
//                    }
//                    //数量是否已经足够，若足够则退出该for
//                   // if(){}
                }
                else{
                    //新版材料

                }


            }




        }

        return true;

    }


    /*
    * 查询所有的project，
    * */
    @RequestMapping(value="/project/findProjectList.do")
    public void findProjectList(HttpServletResponse response) throws IOException, JSONException {
       // System.out.println("???????????");
        DataList projectList = projectService.findProjectList();
       // System.out.println(projectList);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(projectList);
        object.put("projectList", array);
        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /*
    * 展示每个project中具体数据
    * */
    @RequestMapping(value="/project/showProject.do")
    public WebResponse showProject(String projectName,HttpServletResponse response) throws IOException {

        //根据项目名查找
        DataList materialList = projectService.findProjectByName(projectName);
        WebResponse wr = new WebResponse();
        wr.put("value",materialList);
        //写回
        return wr;


    }

    public boolean addmaterialrecevinglist(String s){

        return false;
    }

    /*根据materialType和productId查询规则*/
//    public DataRow findRules(int mType,int pId){
//        DataList rulesList = projectService.findrulesByTypeandId(mType,pId);
//        //所需的材料
//        DataRow data = new DataRow();
//        for(int k =0;k<rulesList.size();k++){
//            //材料的id和所需数量
//            DataRow oneRule = rulesList.get(0);
//            String materialId = (String) oneRule.get("materialId");
//            int ruleNumber = (int) oneRule.get("number");
//            data.put(materialId,ruleNumber);
//        }
//        return data;
//    }

}
