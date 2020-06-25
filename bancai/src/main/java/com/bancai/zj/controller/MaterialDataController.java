package com.bancai.zj.controller;

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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

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

    Logger log=Logger.getLogger(DataHistoryController.class);

    /*
    * 录入单个原材料数据
    * 入库
    *
    * */
    @RequestMapping(value="/material/addData.do")
    @Transactional
    public boolean addMaterialData(String s, String tableName,String operator, HttpSession session) throws JSONException {

        JSONArray jsonArray =new JSONArray(s);
        String userId = (String)session.getAttribute("userid");
        //入库记录sql
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_addLog = "insert into material_log (type,userId,time,operator) values(?,?,?,?)";
        String sql_backLog = "insert into material_log (type,userId,time,projectId) values(?,?,?,?)";
        JSONObject jsonBack = jsonArray.getJSONObject(0);
        String projectId = "";
        try{
            projectId = jsonBack.get("projectId")+"";
        }catch(Exception e){
            projectId = "";
        }

        int main_key;
        if(projectId.equals("")){
            main_key= insertProjectService.insertDataToTable(sql_addLog,"0",userId,simpleDateFormat.format(date),operator);
        } else {
            main_key= insertProjectService.insertDataToTable(sql_backLog,"2",userId,simpleDateFormat.format(date),projectId);
        }

        for(int i=0;i< jsonArray.length();i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String row_index="";
            String materialName="";
            String materialId="";
            String width="";
            String specification="";
            String inventoryUnit="";
            String count="";
            String rowNo="";
            String columNo="";
            String warehouseName="";
            String unitWeight="";
            String totalWeight="0.0";
            try{
                row_index=jsonTemp.get("序号")+"";
            }catch (Exception e){

            }
            try{
                materialId=jsonTemp.get("品号")+"";
            }catch (Exception e){
            }
            try{
                materialName=jsonTemp.get("品名")+"";
            }catch (Exception e){
            }
            try{
                specification=jsonTemp.get("规格")+"";
            }catch (Exception e){
            }
            try{
                inventoryUnit=jsonTemp.get("库存单位")+"";
            }catch (Exception e){
            }

            try{
                count=jsonTemp.get("数量")+"";
            }catch (Exception e){
            }

            try{
                rowNo=jsonTemp.get("行")+"";
            }catch (Exception e){
            }
            try{
                columNo=jsonTemp.get("列")+"";
            }catch (Exception e){
            }
            try{
                warehouseName=jsonTemp.get("仓库名称")+"";
            }catch (Exception e){
            }
            try{
                unitWeight=jsonTemp.get("单重")+"";
            }catch (Exception e){
            }
            try{
                width=jsonTemp.get("横截面")+"";
            }catch (Exception e){
            }

            try{
                totalWeight=Double.parseDouble(unitWeight)*Double.parseDouble(count)+"";
            }catch (Exception e){

            }

            //System.out.println(jsonTemp);
            String sql = "insert into "+ tableName+" (materialId,specification,inventoryUnit,count,rowNo,columNo,uploadId,warehouseName,unitWeight,totalWeight) values(?,?,?,?,?,?,?,?,?,?)";
            boolean isright= insertProjectService.insertIntoTableBySQL(sql,materialId,specification,inventoryUnit,count,rowNo,columNo,userId,warehouseName,unitWeight,totalWeight);
            if(!isright){
                return false;
            }
            //插入log详细信息
            String sql_detail="insert into material_logdetail (materialName,materialId,count,specification,materiallogId) values (?,?,?,?,?) ";
            boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_detail,materialName,materialId,count,specification,String.valueOf(main_key));
            if(!is_log_right){
                return false;
            }
        }
        return true;
    }
    /*
     * 上传excel文件,produces = { "text/html;charset=UTF-8" }
     * */
    @RequestMapping(value = "/uploadMaterialExcel.do")
    @Transactional
    public WebResponse uploadMaterial(MultipartFile uploadFile, String tableName, String operator ,HttpSession session) {
        WebResponse response = new WebResponse();
        String userid = (String) session.getAttribute("userid");
        String sql_log="insert into material_log (type,userId,time,operator) values(?,?,?,?)";
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        int main_key= insertProjectService.insertDataToTable(sql_log,"0",userid,simpleDateFormat.format(date),operator);
      //  JSONArray array = new JSONArray();
        try {
            //UploadDataResult result = excelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName);
            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName,String.valueOf(main_key));
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());


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
