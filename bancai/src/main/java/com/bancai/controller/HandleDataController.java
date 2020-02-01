package com.bancai.controller;

import com.bancai.db.mysqlcondition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.Excel_Service;
import com.bancai.service.QueryService;
import com.bancai.service.Upload_Data_Service;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;

@RestController
public class HandleDataController {

    @Autowired
    private QueryService queryService;
    @Autowired
    private Upload_Data_Service Upload_Data_Service;
    @Autowired
    private Excel_Service excel_Service;

    Logger log=Logger.getLogger(DataHistoryController.class);


    /*
    * 添加单个数据
    * */
    @RequestMapping(value="/addData")
    public boolean addData(String s, String tableName, String materialType, HttpSession session) throws JSONException {

        JSONArray jsonArray =new JSONArray(s);
        String userid = (String)session.getAttribute("userid");
        for(int i=0;i< jsonArray.length();i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            //int id=Integer.parseInt(jsonTemp.get("id"));
            System.out.println(jsonTemp);
            int proNum=Integer.parseInt(jsonTemp.get("品号").toString());
            String Length=(String) jsonTemp.get("长");
            String Type=(String) jsonTemp.get("类型");
            String Width=(String) jsonTemp.get("宽");
            String scale=(String) jsonTemp.get("规格");
            String respo=(String) jsonTemp.get("库存单位");
            String respoNum=(String) jsonTemp.get("仓库编号");
            int count=Integer.parseInt(jsonTemp.get("数量").toString());
            double cost= Double.parseDouble(jsonTemp.get("成本").toString());
            String location=(String) jsonTemp.get("存放位置");
            int material_type = Integer.parseInt(materialType);

            //对每条数据处理
            Upload_Data_Service.addData(tableName,proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,material_type,userid);

        }

        return true;

    }

    /*
    * 上传excel文件
    * */

    @RequestMapping(value = "/data/uploadExcel.do",produces = { "text/html;charset=UTF-8" })
    public String uploadData(MultipartFile uploadFile, String materialtype, String tableName, Boolean check, HttpSession session) {
        WebResponse response = new WebResponse();
        String userid = (String) session.getAttribute("userid");
        try {
            UploadDataResult result = excel_Service.upload_Data(uploadFile.getInputStream(),materialtype,userid,tableName);
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


    /*
    * 根据条件查询
    *
    * */
    @RequestMapping(value = "/org/data/history_ExcelList.do")
    public WebResponse history_ExcelList(Integer start, Integer limit, String tableName, String materialType, String startWidth,
                                         String endWidth, String startLength, String endLength, String mType) throws ParseException {
        log.debug(startWidth+" "+endWidth);
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
        if (materialType.length() != 0) {
            c.and(new mysqlcondition("materialtype", "=", materialType));
        }
        WebResponse wr=queryService.mysqlqueryPage(start, limit, c, tableName);
        return wr;
    }

    /*修改数据*/

    @RequestMapping(value = "/EditDataById.do")
    public boolean uploadDataByEdit(String tableName,String field , String value,String id){

        String sql = "update "+tableName+" set "+field +"="+value +" where id ="+id;
        Upload_Data_Service.updateData(sql);
        return true;
    }

    /*
    * 根据选中的id删除数据
    *
    * */

    @RequestMapping(value = "/deleteDataById.do")
    public boolean deleteDataByID(String tableName,String id ){

        String sql = "delete from "+tableName+" where id ="+id;
        Upload_Data_Service.updateData(sql);
        return true;
    }
}
