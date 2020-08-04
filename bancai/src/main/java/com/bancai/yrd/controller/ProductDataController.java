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
import java.util.HashMap;

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
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String typeId=jsonTemp.get("productTypeId")+"";
                String format1=jsonTemp.get("format1")+"";
                String format2=jsonTemp.get("format2")+"";
                String format3=jsonTemp.get("format3")+"";
                String format4=jsonTemp.get("format4")+"";
                String format = format1+format2+format3+format4;
                map.put("productTypeId",typeId);
                map.put("format1",format1);
                map.put("format2",format2);
                map.put("format3",format3);
                map.put("format4",format4);
                if((typeId.equals("null"))||(typeId.length()==0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未选择类型",map);
                else if((typeId.length()!=4)||(!typeId.matches(isPureNumber)))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"格式错误或选择不完全",map);
                else if(analyzeNameService.isFormatExist("product",typeId,format)!=0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"此格式已存在",map);
                else
                    insertList = productDataService.productAddInsertRowToFormatList(insertList,typeId,format);
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
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
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
                String inventoryUnit = (jsonTemp.get("inventoryUnit") + "").trim().toUpperCase();
                String unitWeight = (jsonTemp.get("unitWeight") + "").trim().toUpperCase();
                String unitArea = (jsonTemp.get("unitArea") + "").trim().toUpperCase();
                String remark = jsonTemp.get("remark") + "";
                map.put("productName",productName);
                map.put("inventoryUnit",inventoryUnit);
                map.put("unitWeight",unitWeight);
                map.put("unitArea",unitArea);
                map.put("remark",remark);
                if(analyzeNameService.isInfoExist("product",productName)!=0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"已经存在这种产品",map);
                else if(((unitWeight.split("\\.").length==1)&&(!unitWeight.matches(isPureNumber)))||
                        ((unitWeight.split("\\.").length==2)&&(
                                (!unitWeight.split("\\.")[0].matches(isPureNumber))||(!unitWeight.split("\\.")[1].matches(isPureNumber))
                        ))||((unitWeight.split("\\.").length!=1)&&((unitWeight.split("\\.").length!=2))))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"重量输入有误",map);
                else if(((unitArea.split("\\.").length==1)&&(!unitArea.matches(isPureNumber)))||
                        ((unitArea.split("\\.").length==2)&&(
                                (!unitArea.split("\\.")[0].matches(isPureNumber))||(!unitArea.split("\\.")[1].matches(isPureNumber))
                        ))||((unitArea.split("\\.").length!=1)&&((unitArea.split("\\.").length!=2))))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"面积输入有误",map);
                else{
                    String[] a = analyzeNameService.analyzeProductName(productName);
                    if(a==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未找到这种产品类型",map);
                    else {
                        int formatId = analyzeNameService.isFormatExist("product", a[1], a[0]);
                        if (formatId == 0)
                            errorList = analyzeNameService.addErrorRowToErrorList(errorList, id, "未找到这种产品格式",map);
                        else
                            insertList = productDataService.productAddInsertRowToInfoList(insertList, String.valueOf(formatId), productName, inventoryUnit,
                                    unitWeight, unitArea, remark, a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13]);
                    }
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            boolean uploadResult = productDataService.productAddNewInfo(insertList,userId);
            response.setSuccess(uploadResult);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误或品名错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/product/addData.do")
    public boolean productAddData(String s, String projectId, String buildingId, String operator, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
        String userId = (String) session.getAttribute("userid");
        String sql_backLog = "insert into product_log (type,userId,time,projectId,buildingId,operator) values(?,?,?,?,?,?)";
        int productlogId = insertProjectService.insertDataToTable(sql_backLog, "2", userId, analyzeNameService.getTime()
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
     * 退库成品添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/backproduct/addData.do")
    public WebResponse backproductAddData(String s, String projectId, String buildingId, String operator, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            //检查
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个:" + jsonTemp);
                String id = jsonTemp.get("id")+"";
                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
                String warehouseName = (jsonTemp.get("warehouseName") + "").trim().toUpperCase();
                String count = (jsonTemp.get("count") + "").trim();
                map.put("productName",productName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                if((!count.matches(isPureNumber))||(Integer.parseInt(count)<=0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] productId = analyzeNameService.isInfoExistBackUnit("product",productName);
                    if(productId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该产品的基础信息",map);
                    else
                        insertList = productDataService.productAddInsertRowToInboundList(insertList,productId[0],warehouseName,count,productId[1],productId[2]);
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            System.out.println("[===checkBackproductUploadData==Complete=NoError]");
            boolean uploadResult= productDataService.insertProductDataToStore("backproduct",insertList,userId,operator,projectId,buildingId);
            response.setSuccess(uploadResult);
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
//        JSONArray jsonArray = new JSONArray(s);
//        String userId = (String) session.getAttribute("userid");
//        Date date = new Date();
//        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String sql_backLog = "insert into backproduct_log (type,userId,time,projectId,buildingId,operator,isrollback) values(?,?,?,?,?,?,?)";
//        int backproductlogId = insertProjectService.insertDataToTable(sql_backLog, "2", userId, simpleDateFormat.format(date)
//                , projectId, buildingId, operator,"0");
//        for (int i = 0; i < jsonArray.length(); i++) {
//            JSONObject jsonTemp = jsonArray.getJSONObject(i);
//            //获得第i条数据的各个属性值
//            System.out.println("第" + i + "个:userid=" + userId + "---" + jsonTemp);
//            String productName = (jsonTemp.get("productName") + "").toUpperCase().trim();
//            String warehouseName = jsonTemp.get("warehouseName") + "";
//            String count = jsonTemp.get("count") + "";
//            int[] productId = productDataService.backProduct(productName, warehouseName, count);
//            if (productId[0] == 0) {
//                return false;
//            }
//            String sql_addLogDetail = "insert into backproduct_logdetail (productId,count,backproductlogId,backproductstoreId,isrollback) values (?,?,?,?,?)";
//            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail, String.valueOf(productId[0]),
//                    count, String.valueOf(backproductlogId),String.valueOf(productId[1]),"0");
//            if (!is_log_right) {
//                return false;
//            }
//        }
//        return true;
    }
    /*
     * 预加工半成品添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/preprocess/addData.do")
    public WebResponse preprocessAddData(String s, String operator,String projectId,String buildingId, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            //检查
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个:" + jsonTemp);
                String id = jsonTemp.get("id")+"";
                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
                String warehouseName = (jsonTemp.get("warehouseName") + "").trim().toUpperCase();
                String count = (jsonTemp.get("count") + "").trim();
                map.put("productName",productName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                if((!count.matches(isPureNumber))||(Integer.parseInt(count)<=0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] productId = analyzeNameService.isInfoExistBackUnit("product",productName);
                    if(productId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该产品的基础信息",map);
                    else
                        insertList = productDataService.productAddInsertRowToInboundList(insertList,productId[0],warehouseName,count,productId[1],productId[2]);
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            System.out.println("[===checkPreprocessUploadData==Complete=NoError]");
            boolean uploadResult= productDataService.insertProductDataToStore("preprocess",insertList,userId,operator,projectId,buildingId);
            response.setSuccess(uploadResult);
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
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
