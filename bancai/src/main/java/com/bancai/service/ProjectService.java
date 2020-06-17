package com.bancai.service;

import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Service
public class ProjectService extends BaseService {

    private Logger log = Logger.getLogger(Upload_Data_Service.class);
    @Autowired
    private QueryService queryService;


    @Transactional
    //插入数据到project
    public int insertDataToProject(String sql,String userid,String startTime,String projectName){
        log.debug(sql);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        //int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
        int j=jo.update(new PreparedStatementCreator(){
                            @Override
                            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                                PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
                                ps.setString(1, userid);
                                ps.setString(2, startTime);
                                ps.setString(3, projectName);
                                ps.setString(4, "1");
                                return ps;
                            }
                        },
                keyHolder);
        return keyHolder.getKey().intValue();
    }

    @Transactional
    //插入数据到planlist
    public int insertDataToPlanlist(String sql,String projectId,String productId,String number){
        log.debug(sql);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        //int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
        int j=jo.update(new PreparedStatementCreator(){
                            @Override
                            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                                PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
                                ps.setString(1, projectId);
                                ps.setString(2, productId);
                                ps.setString(3, number);
                                return ps;
                            }
                        },
                keyHolder);
        return keyHolder.getKey().intValue();
    }
    @Transactional
    //插入数据到projectlist
    public int insertDataToProjectlist(String sql,String projectId,String productId,String materialStoreId,String Num){
        log.debug(sql);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        //int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
        int j=jo.update(new PreparedStatementCreator(){
                            @Override
                            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                                PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
                                ps.setString(1, projectId);
                                ps.setString(2, productId);
                                ps.setString(3, materialStoreId);
                                ps.setString(4, Num);
                                return ps;
                            }
                        },
                keyHolder);
        return keyHolder.getKey().intValue();
    }




    /*
     * 新建一个项目
     * */
    @Transactional
    public void createProject(String tableName,String startTime, String projectName,String userId,int statusId){

        //返回自增主键
        // KeyHolder keyHolder = new GeneratedKeyHolder();

        jo.update("insert into "+ tableName+" (userId,startTime,projectName,statusId) values(?,?,?,?)",
                userId,startTime, projectName, statusId);
        //return true;
        //System.out.println("主键id：-----"+keyHolder.getKey().intValue());
    }

//    /*
//     * 根据项目名查找
//     * */
//    @Transactional
//    public DataList findProjectByName(String startTime, String projectName,String userId){
//
//        DataList list = queryService.query(
//                "select * from project where userId=? and startTime=? and projectName=?",
//                userId,startTime, projectName);
//        return list;
//    }


    /*
     * 新建一个计划清单
     * */
//    @Transactional
//    public void createPlanList(int projectId, int productId, int number){
//
//
//        jo.update("insert into planlist (projectId,productId,number) values(?,?,?)",
//                projectId,productId,number);
//        //return true;
//    }

    /*
     * 新建一个计划清单,同时查询projectid
     * */
    @Transactional
    public void addPlanList(int productId, int number,String userId, String startTime, String projectName){

        jo.update("insert into planlist (productId,number,projectId) values(?,?,(select id from project where userId=? and startTime=? and projectName=?))",
                productId,number,userId,startTime,projectName);

    }

    /*
    *与材料库中的长类型宽进行比对，返回匹配的材料
    *
    * */
    @Transactional
    public DataList materialTypeMap(JSONObject jsonTemp, String table) throws JSONException {

        int Length = Integer.parseInt(jsonTemp.get("长").toString());
        String Type =  (String) jsonTemp.get("类型");
        int Width = Integer.parseInt(jsonTemp.get("宽").toString());
        int number = Integer.parseInt(jsonTemp.get("数量").toString());
        //查询
        //String sql = "SELECT * FROM "+table+" WHERE 长>=? and 长<=? and 类型=? and 宽>=? AND 宽<=? and materialType=0 or materialType=1";
        DataList materialList = queryService.query("SELECT * FROM "+table+" WHERE 类型=? AND 长>=? AND 长<=? and 宽>=? AND 宽<=? AND 数量>0 AND (materialType=0 OR materialType=1)",Type,Length,Length+100,Width,Width+100);

        return materialList;

    }


    /*
     *根据materialType和productId查询规则
     *
     * */
    @Transactional
    public DataList findrulesByTypeandId(int materialType, int productId){
        //查询规则的id   select * from rule_union where productId=1 and materialType=0 and 规格='旧板' UNION select * from rule_union where productId=1 and materialType=0 and 规格<>'旧板'
       // String sql = "SELECT id FROM rule_union WHERE productId=? AND materialType=?";
        //将主板数据放在返回值数组的前面
        String sql = "select * from rule_union where productId=? and materialType=? and 规格='旧板' UNION select * from rule_union where productId=? and materialType=? and 规格<>'旧板'";
        DataList list = queryService.query(sql,productId,materialType,productId,materialType);
        return list;

    }

    /*
    * 数量扣减
    * */
    @Transactional
    public void uploadMaterialNumber(int materialId, int uploadNumber){
        //查询规则的id
        String sql = "UPLOAD materialstore SET number=? WHERE materialId=?";
        //DataList materialList = queryService.query("SELECT * FROM "+table+" WHERE 类型=? AND 长>=? AND 长<=? and 宽>=? AND 宽<=? AND 数量>0 AND (materialType=0 OR materialType=1)",Type,Length,Length+100,Width,Width+100);

       jo.update(sql,uploadNumber,materialId);
        //return true;

    }

    /*
    * 查询所有的project
    * */

    @Transactional
    public DataList findProjectList(){
        String sql = "select * from project where statusId <>3 order by id DESC";
        DataList namelist = queryService.query(sql);
        return namelist;

    }

    /*
    * 根据项目名查询,产品名，材料名
    * */
    @Transactional
    public DataList findProjectByName(String projectName){
        //String sql = "select * from projectlist where projectId in (select id from project where  projectName = ?)";
        String sql = "select 长, 类型, 宽, number, materialName, productName from project_info where id in (select id from project where  projectName = ?)";
        DataList cellList = queryService.query(sql,projectName);
        return cellList;

    }

}
