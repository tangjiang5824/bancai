package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.ProductDataService;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.service.TableService;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class ProductDataController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AllExcelService allExcelService;
    @Autowired
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private PanelMatchService panelMatchService;
    @Autowired
    private ProductDataService productDataService;

    Logger log = Logger.getLogger(ProductDataController.class);
    private static String isPureNumber = "[0-9]+";

    /*
     * 新增产品品名格式
     * */
    @RequestMapping(value = "/product/addFormat.do")
    public WebResponse productAddFormat(String s, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String productTypeId=jsonTemp.get("productTypeId")+"";
                String format1=jsonTemp.get("format1")+"";
                String format2=jsonTemp.get("format2")+"";
                String format3=jsonTemp.get("format3")+"";
                String format4=jsonTemp.get("format4")+"";
                String productFormat = format1+format2+format3+format4;
                if((productTypeId.equals("null"))||(productTypeId.length()==0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未选择类型");
                else if((productFormat.length()!=4)||(!productFormat.matches(isPureNumber)))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"格式错误或选择不完全");
                else if(analyzeNameService.isFormatExist("product",productTypeId,productFormat)!=0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"此格式已存在");
                else
                    insertList = productDataService.productAddInsertRowToFormatList(insertList,productTypeId,productFormat);
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                return response;
            }
            boolean uploadResult = productDataService.productAddNewFormat(insertList,userId);
            response.setSuccess(uploadResult);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 新增产品基础信息
     * */
    @RequestMapping(value = "/product/addInfo.do")
    public WebResponse productAddInfo(String s, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
                String inventoryUnit = (jsonTemp.get("inventoryUnit") + "").trim().toUpperCase();
                String unitWeight = (jsonTemp.get("unitWeight") + "").trim().toUpperCase();
                String unitArea = (jsonTemp.get("unitArea") + "").trim().toUpperCase();
                String remark = jsonTemp.get("remark") + "";
//                if((productTypeId.equals("null"))||(productTypeId.length()==0))
//                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未选择类型");
//                else if((productFormat.length()!=4)||(!productFormat.matches(isPureNumber)))
//                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"格式错误或选择不完全");
//                else if(analyzeNameService.isInfoExist("product",productName)!=0)
//                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"已经存在这种产品");
//                else
//                    insertList = productDataService.productAddInsertRowToFormatList(insertList,productTypeId,productFormat);
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                return response;
            }
            boolean uploadResult = productDataService.productAddNewFormat(insertList,userId);
            response.setSuccess(uploadResult);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
//            String sql_addLog = "insert into product_log (type,userId,time,isrollback) values(?,?,?,?)";
//            int productlogId = insertProjectService.insertDataToTable(sql_addLog, "6", userId, simpleDateFormat.format(date),"0");
//            for (int i = 0; i < jsonArray.length(); i++) {
//                JSONObject jsonTemp = jsonArray.getJSONObject(i);
//                System.out.println("第" + i + "个---" + jsonTemp);
//                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
////                String classificationId = jsonTemp.get("classificationId") + "";
//                String inventoryUnit = jsonTemp.get("inventoryUnit") + "";
//                String unitWeight = jsonTemp.get("unitWeight") + "";
//                String unitArea = jsonTemp.get("unitArea") + "";
//                String remark = jsonTemp.get("remark") + "";
//                int productId = productDataService.productAddNewInfo(productName, inventoryUnit,
//                        unitWeight, unitArea, remark, userId);
//
//                }
//                String sql_addLogDetail = "insert into product_logdetail (productlogId,productId,isrollback) values (?,?,?)";
//                boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                        String.valueOf(productlogId), String.valueOf(productId),"0");

//            }
    }

    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/product/addData.do")
    public boolean productAddData(String s, String projectId, String buildingId, String operator, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
        String userId = (String) session.getAttribute("userid");
//        String userId ="1";
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_backLog = "insert into product_log (type,userId,time,projectId,buildingId,operator) values(?,?,?,?,?,?)";
        int productlogId = insertProjectService.insertDataToTable(sql_backLog, "2", userId, simpleDateFormat.format(date)
                , projectId, buildingId, operator);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            System.out.println("第" + i + "个:userid=" + userId + "---" + jsonTemp);
            String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
            String warehouseName = jsonTemp.get("warehouseName") + "";
            String count = jsonTemp.get("count") + "";
            int[] productId = productDataService.addProduct(productName, warehouseName, count);
            if (productId[0] == 0) {
                return false;
            }
            String sql_addLogDetail = "insert into product_logdetail (productId,count,productlogId,productstoreId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail, String.valueOf(productId[0]),
                    count, String.valueOf(productlogId),String.valueOf(productId[1]));
            if (!is_log_right) {
                return false;
            }
        }
        return true;
    }
    /*
     * 产品库存查询
     * */
    @RequestMapping(value = "/product/queryData.do")
    public WebResponse query_data(Integer start, Integer limit, String tableName,String productTypeId,
                                  String maxCount,String minCount,String warehouseName) throws ParseException {
        if(null==start||start.equals("")) start=0;
        if(null==limit||limit.equals("")) limit=50;
        mysqlcondition c=new mysqlcondition();
        if (productTypeId.length() != 0) {
            c.and(new mysqlcondition("productTypeId", "=", productTypeId));
        }
        if (warehouseName.length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName));
        }
        if (maxCount.length() != 0) {
            c.and(new mysqlcondition("countUse", "<=", maxCount));
        }
        if (minCount.length() != 0) {
            c.and(new mysqlcondition("countUse", ">=", minCount));
        }
        if (maxCount.length() != 0) {
            c.and(new mysqlcondition("countStore", "<=", maxCount));
        }
        if (minCount.length() != 0) {
            c.and(new mysqlcondition("countStore", ">=", minCount));
        }
        WebResponse wr=queryService.queryDataPage(start, limit, c, tableName);
        return wr;
    }




}
