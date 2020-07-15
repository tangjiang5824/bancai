package com.bancai.commonMethod;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.controller.DataHistoryController;
import com.bancai.db.mysqlcondition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.Excel_Service;
import com.bancai.service.QueryService;
import com.bancai.service.Upload_Data_Service;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.io.IOException;
import java.text.ParseException;

@RestController
public class CommonDataController {

    protected JdbcOperations jo;
    @Autowired
    public void setDataSource(DataSource dataSource) {
        jo = new JdbcTemplate(dataSource);
    }

    @Autowired
    private QueryService queryService;
    @Autowired
    private Upload_Data_Service Upload_Data_Service;
    @Autowired
    private Excel_Service excel_Service;
    @Autowired
    private InsertProjectService insertProjectService;

    Logger log=Logger.getLogger(DataHistoryController.class);


    /*修改数据*/
    //Status 0 2 删除
    @RequestMapping(value = "/data/EditCellById.do")
    public boolean EditDataById(String tableName,String field , String value,String id,String type){
       String sql;
        if(type.equals("delete")){
            sql="delete from "+ tableName +" where  id= ?";
            int i = jo.update(sql,id);
            if(i == 0){
                return false;
            }
        }else {
            if(id.matches("^[1-9][0-9]*")){
                sql = "update "+tableName+" set "+field +"= ? where id =?";
                int i = jo.update(sql,value,id);
                if(i == 0){
                    return false;
                }
            }else {
                sql="insert into "+tableName+"("+field +") values (?) ";
                int i = jo.update(sql,value);
                if(i == 0){
                    return false;
                }
            }
        }
        return true;
    }

    @RequestMapping(value = "/data/BuildingEditCellById.do")
    public void BuildingEditCellById(String tableName, String field , String projectId, String value, String id, HttpServletResponse response) throws IOException {
        int cid= Integer.parseInt(id);
        String sql;
        int i;
        if(cid!=0) {
            sql = "update " + tableName + " set " + field + "= '" + value + "' where id =" + id;
            i= jo.update(sql);
        }else {
            sql="insert into "+tableName+" ("+field+", projectId)"+" values (?,?)";
            i = insertProjectService.insertDataToTable(sql,value,projectId);
        }
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(
                i+"");
    }

    /*
    * 根据选中的id删除数据
    *
    * */
    @RequestMapping(value = "/data/deleteItemById.do")
    public boolean deleteDataById(String tableName,String id ){
        String sql = "delete from "+tableName+" where id ="+id;
        int i = jo.update(sql);
        if(i == 0){
            return false;
        }
        return true;
    }

    @RequestMapping(value = "/data/listDataByConditions.do")
    public WebResponse materialDataList(Integer start, Integer limit, String tableName, String startWidth,
                                        String endWidth, String startLength, String endLength, String mType) throws ParseException {
        System.out.println(startWidth);
        System.out.println(endWidth);

        mysqlcondition c=new mysqlcondition();
        //String loginName = (String) session.getAttribute("loginName");
        if (startWidth.length() != 0) {
            c.and(new mysqlcondition("宽", ">=", startWidth));
        }
        if (endWidth.length() != 0) {
            c.and(new mysqlcondition("宽", "<=", endWidth));
        }
        if (startLength.length() != 0) {
            c.and(new mysqlcondition("长", ">=", startLength));
        }
        if (endLength.length() != 0) {
            c.and(new mysqlcondition("长", "<=", endLength));
        }
        if (mType.length() != 0) {
            c.and(new mysqlcondition("类型", "=", mType));
        }
//        if (materialType.length() != 0) {
//            c.and(new mysqlcondition("materialtype", "=", materialType));
//        }
        WebResponse wr=queryService.mysqlqueryPage(start, limit, c, tableName);
        return wr;
    }

}
