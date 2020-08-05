package com.bancai.zj.controller;

import com.bancai.cg.dao.materialLogdao;
import com.bancai.cg.entity.MaterialLog;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AllExcelService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.controller.DataHistoryController;
import com.bancai.db.mysqlcondition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;
import com.bancai.zj.service.Material_Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;

@RestController
public class MaterialDataController {

    @Autowired
    private QueryAllService queryAllService;
    //private QueryService queryService;
    @Autowired
    private Material_Service material_Service;
    @Autowired
    private AllExcelService allExcelService;
    //private MaterialExcelService excelService;
    @Autowired
    private InsertProjectService insertProjectService;

    @Autowired
    private materialLogdao logdao;

    Logger log=Logger.getLogger(DataHistoryController.class);



    /*
     * 录入单个原材料数据
     * 入库
     *
     * */
//    @RequestMapping(value="/material/backData.do")
//    @Transactional
//    public boolean MaterialDataBack(String tableName,String operator, , HttpSession session) throws JSONException {
//
//        JSONArray jsonArray =new JSONArray(s);
//        String userId = (String)session.getAttribute("userid");
//        //入库记录sql
//        Date date=new Date();
//        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String sql_addLog = "insert into material_log (type,userId,time,operator,isrollback) values(?,?,?,?,?)";
//        String sql_backLog = "insert into material_log (type,userId,time,projectId) values(?,?,?,?)";
//        JSONObject jsonBack = jsonArray.getJSONObject(0);
//        String projectId = "";
//        try{
//            projectId = jsonBack.get("projectId")+"";
//        }catch(Exception e){
//            projectId = "";
//        }
//
//        int main_key;
//
//        main_key= insertProjectService.insertDataToTable(sql_backLog,"2",userId,simpleDateFormat.format(date),projectId);
//
//
//        for(int i=0;i< jsonArray.length();i++) {
//            JSONObject jsonTemp = jsonArray.getJSONObject(i);
//            String row_index=null;
//            String materialName=null;
//            String materialId=null;
//            String width=null;
//            String specification=null;
//            String inventoryUnit=null;
//            String count=null;
//            String rowNo=null;
//            String columNo=null;
//            String warehouseName=null;
//            String unitWeight=null;
//            String totalWeight="0.0";
//            //if(null!=jsonTemp.get("序号")) row_index=jsonTemp.get("序号")+"";
//            if(JSONObject.NULL!=jsonTemp.get("品号")&&!jsonTemp.get("品号").equals(""))   materialId=jsonTemp.get("品号")+"";
//            if(JSONObject.NULL!=jsonTemp.get("品名")&&!jsonTemp.get("品名").equals(""))  materialName=jsonTemp.get("品名")+"";
//            if(JSONObject.NULL!=jsonTemp.get("规格")&&!jsonTemp.get("规格").equals(""))   specification=jsonTemp.get("规格")+"";
//            if(JSONObject.NULL!=jsonTemp.get("库存单位")&&!jsonTemp.get("库存单位").equals(""))    inventoryUnit=jsonTemp.get("库存单位")+"";
//            if(JSONObject.NULL!=jsonTemp.get("数量")&&!jsonTemp.get("数量").equals(""))    count=jsonTemp.get("数量")+"";
//            if((jsonTemp.get("行")!=JSONObject.NULL&&!jsonTemp.get("行").equals(""))) rowNo=jsonTemp.get("行")+"";
//            if(jsonTemp.get("列")!=JSONObject.NULL&&!jsonTemp.get("列").equals(""))   columNo=jsonTemp.get("列")+"";
//            if(JSONObject.NULL!=jsonTemp.get("仓库名称")&&!jsonTemp.get("仓库名称").equals(""))    warehouseName=jsonTemp.get("仓库名称")+"";
//            if(JSONObject.NULL!=jsonTemp.get("单重")&&!jsonTemp.get("单重").equals("")) unitWeight=jsonTemp.get("单重")+"";
//            if(JSONObject.NULL!=jsonTemp.get("横截面")&&!jsonTemp.get("横截面").equals(""))  width=jsonTemp.get("横截面")+"";
//            try{
//                totalWeight=Double.parseDouble(unitWeight)*Double.parseDouble(count)+"";
//            }catch (Exception e){
//
//            }
//
//            //System.out.println(jsonTemp);
//            String sql = "insert into "+ tableName+" (materialId,specification,inventoryUnit,count,countUse,rowNo,columNo,uploadId,warehouseName,unitWeight,totalWeight) values(?,?,?,?,?,?,?,?,?,?,?)";
//            int store_main= insertProjectService.insertDataToTable(sql,materialId,specification,inventoryUnit,count,count,rowNo,columNo,userId,warehouseName,unitWeight,totalWeight);
//
//            //插入log详细信息
//            String sql_detail="insert into material_logdetail (materialName,materialId,count,specification,materiallogId,materialstoreId,isrollback) values (?,?,?,?,?,?,?) ";
//            boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_detail,materialName,materialId,count,specification,String.valueOf(main_key),store_main+"","0");
//            if(!is_log_right){
//                return false;
//            }
//        }
//        return true;
//    }

    /*
     * 上传excel文件,produces = { "text/html;charset=UTF-8" }
     * */
    @RequestMapping(value = "/uploadMaterialExcel.do")
    @Transactional
    public WebResponse uploadMaterial(MultipartFile uploadFile, String tableName, Integer operator ,HttpSession session) {
        WebResponse response = new WebResponse();
//        String userid = (String) session.getAttribute("userid");
//        MaterialLog log=new MaterialLog();
//        if(userid!=null)
//        log.setUserId(Integer.parseInt(userid));
//        log.setTime(new Timestamp(new Date().getTime()));
//        log.setIsrollback(0);
//        log.setType(0);
//        log.setOperator(operator);
//        logdao.save(log);
      //  JSONArray array = new JSONArray();
        try {
            //UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName,log);
            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream());
            if(result.success==true){
                response.put("value",result.dataList);
                response.put("totalCount", result.dataList.size());
            }else {
                response.setSuccess(false);
                response.setErrorCode(100);
                response.put("errorlist",result.dataList);
                response.put("totalCount", result.dataList.size());
            }

        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }

       // System.out.println(response.get("success"));
       // System.out.println(response.get("value"));
        
        return response;
    }



    /*
     * 根据条件查询
     *
     * */
    @RequestMapping(value = "/material/historyDataList.do")
    public WebResponse materialDataList(Integer start, Integer limit, String tableName, String startWidth,
                                         String endWidth, String startLength, String endLength, String materialType) throws ParseException {
        //log.debug(startWidth+" "+endWidth);

        System.out.println("------");
        System.out.println(startWidth);
        System.out.println(endWidth);

        mysqlcondition c=new mysqlcondition();
        //String loginName = (String) session.getAttribute("loginName");
        if (startWidth.length() != 0) {
            c.and(new mysqlcondition("width", ">=", startWidth));
        }
        if (endWidth.length() != 0) {
            c.and(new mysqlcondition("width", "<=", endWidth));
        }
        if (startLength.length() != 0) {
            c.and(new mysqlcondition("length", ">=", startLength));
        }
        if (endLength.length() != 0) {
            c.and(new mysqlcondition("length", "<=", endLength));
        }
        if (materialType.length() != 0) {
            c.and(new mysqlcondition("materialType", "=", materialType));
        }
//        if (materialType.length() != 0) {
//            c.and(new mysqlcondition("materialtype", "=", materialType));
//        }
        //WebResponse wr=queryService.mysqlqueryPage(start, limit, c, tableName);
        WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
        return wr;
    }

    



}
