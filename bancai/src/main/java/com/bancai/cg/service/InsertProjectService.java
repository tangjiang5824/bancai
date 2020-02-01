package com.bancai.cg.service;

import com.bancai.commonMethod.QueryAllService;
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
import com.bancai.service.BaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Service
public class InsertProjectService extends BaseService {

    private Logger log = Logger.getLogger(InsertProjectService.class);
    @Autowired
    private QueryAllService queryService;

    /**
     * 插入通用接口，sql和要插入的字段值，所有插入都是String
     * @param sql
     * @param args
     * @return
     */
    @Transactional
    public int insertDataToTable(String sql,String... args){
        log.debug(sql);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        //int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
        int j=jo.update(new PreparedStatementCreator(){
                            @Override
                            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                                PreparedStatement ps = conn.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS);
                                for (int i = 1; i < args.length+1; i++) {
                                    ps.setObject(i, args[i-1]);
                                }
                                return ps;
                            }
                        },
                keyHolder);
        return keyHolder.getKey().intValue();
    }

    /**
     * 查询返回所有的原材料类型
     * @return
     */
    @Transactional
    public DataList findmaterialtype(){
        String sql = "select * from materialtype";
        DataList typelist = queryService.query(sql);
        return typelist;
    }
    /**
     * 查询返回所有的旧板类型
     * @return
     */
    @Transactional
    public DataList findOldpanelType(){
        String sql = "select * from oldpaneltype";
        DataList typelist = queryService.query(sql);
        return typelist;

    }
    @Transactional
    public int update(String sql){
        return jo.update(sql);

    }


    /**
     * 通用接口  通过表名和要查的字段查询结果，如果全查第二个参数设为空
     * @param tablename
     * @param args
     * @return
     */
    @Transactional
    public DataList findallbytableName(String tablename,String...args){
        String colum="";
        if(null==args){
            colum="*";
        }else {
            for (String arg : args) {
                colum=colum+arg+",";
            }
            int index=colum.lastIndexOf(",");
            colum=colum.substring(0,index);
        }
        String sql = "select "+colum+" from "+tablename;
        DataList typelist = queryService.query(sql);
        return typelist;
    }
    //通用接口 重载 全查 只用传入tablename
    @Transactional
    public DataList findallbytableName(String tablename){
        String sql = "select * from "+tablename;
        DataList typelist = queryService.query(sql);
        return typelist;
    }

    //通用接口    通过表名和一个键值对查询
    @Transactional
    public DataList findallbytableNameAndinfo(String tablename,String variable,String value){
        String sql = "select * from "+tablename+" where "+variable+"= ?";
        DataList list = queryService.query(sql,value);
        return list;
    }
    //通用接口
    @Transactional
    public boolean insertIntoTableBySQL(String sql,String...args){
        int i=jo.update(sql,args);
        if(i!=0){
            return true;
        }
        return false;
    }



    //-----------------------------------------------------------------------------------


    /**
     * 查询返回对应projectId的领料单
     * @return
     */
    @Transactional
    public DataList findmateriallist(String projectId){
        String sql = "select * from projectmateriallist where projectId=?";
        DataList materiallist = queryService.query(sql,projectId);
        return materiallist;
    }

    /**
     * 用原材料名查询库存中有的原材料库存
     * @param materialName
     * @return
     */
    @Transactional
    public DataList findmateriallistbyname(String materialName){
        String sql = "select id,materialName,length,width,materialType,number from material where materialName=? and number>0";
        DataList materiallist = queryService.query(sql,materialName);
        return materiallist;
    }

    /**
     * 查询一个值是否在数据库中存在
     *
     **/
    @Transactional
    public int queryisexist(String sql){
        return  jo.queryForObject(sql,Integer.class);
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
        String sql = "select projectName from project";
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
