package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.vo.UploadDataResult;
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
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
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
                else if((typeId.length()!=4)||(analyzeNameService.isStringNotPureNumber(typeId)))
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
                else if(analyzeNameService.isStringNotNonnegativeNumber(unitWeight))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"重量输入有误",map);
                else if(analyzeNameService.isStringNotNonnegativeNumber(unitArea))
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
                            insertList = productDataService.productAddInsertRowToInfoList(insertList, String.valueOf(formatId),a[1],a[2], productName, inventoryUnit,
                                    unitWeight, unitArea, remark,a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12]);
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
                String remark = (jsonTemp.get("remark") + "").trim();
                map.put("productName",productName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                map.put("remark",remark);
                if(analyzeNameService.isStringNotPositiveInteger(count))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] productId = analyzeNameService.isInfoExistBackUnit("product",productName);
                    if(productId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该产品的基础信息",map);
                    else
                        insertList = productDataService.productAddInsertRowToInboundList(insertList,productId[0],warehouseName,count,productId[1],productId[2],remark);
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
//    /*
//     * 预加工仓库记录查询
//     * */
//    @RequestMapping("/preprocess/queryLog.do")
//    public WebResponse queryPreprocessLog(String type,String projectId, String buildingId,String operator,String timeStart, String timeEnd,Integer start,Integer limit){
//        mysqlcondition c=new mysqlcondition();
//        if (null!=type&&type.length() != 0) {
//            c.and(new mysqlcondition("type", "=", type));
//        }
//        if (null!=projectId&&projectId.length() != 0) {
//            c.and(new mysqlcondition("projectId", "=", projectId));
//        }
//        if (null!=buildingId&&buildingId.length() != 0) {
//            c.and(new mysqlcondition("buildingId", "=", projectId));
//        }
//        if (null!=operator&&operator.length() != 0) {
//            c.and(new mysqlcondition("operator", "=", operator));
//        }
//        if (null!=timeStart&&timeStart.length() != 0) {
//            c.and(new mysqlcondition("time", ">=", timeStart));
//        }
//        if (null!=timeEnd&&timeEnd.length() != 0) {
//            c.and(new mysqlcondition("time", "<=", timeEnd));
//        }
//        return queryService.queryDataPage(start, limit, c, "preprocess_log_view");
//    }
//
//    /*
//     * 预加工仓库记录查询detail
//     * */
//    @RequestMapping("/preprocess/queryLogDetail.do")
//    public WebResponse queryPreprocessLogDetail(String wastelogId,Integer start,Integer limit){
//        mysqlcondition c=new mysqlcondition();
//        if (null!=wastelogId&&wastelogId.length() != 0) {
//            c.and(new mysqlcondition("wasteLogId", "=", wastelogId));
//        }else {
//            WebResponse response = new WebResponse();
//            response.setSuccess(false);
//            response.setErrorCode(100);//未获取到退料单号
//            response.setMsg("未获取到该次记录");
//            return response;
//        }
//        return queryService.queryDataPage(start, limit, c, "preprocess_log_detail_view");
//    }

    /*
     * 预加工入库撤销
     * */
    @RequestMapping("/preprocess/addDataRollback.do")
    public WebResponse preprocessAddDataRollback(String preprocesslogId,String operator,HttpSession session){
        WebResponse response = new WebResponse();
        if(operator==null||operator.trim().length()==0){
            response.setErrorCode(300);
            response.setMsg("请选择撤销人！");
            response.setSuccess(false);
            return response;
        }
        try {
            DataRow row = analyzeNameService.canRollback("preprocess_log",preprocesslogId);
            if(!row.isEmpty()){
                String userId = (String) session.getAttribute("userid");
                String projectId = null;
                if(row.get("projectId")!=null)
                    projectId = row.get("projectId").toString();
                String buildingId = null;
                if(row.get("buildingId")!=null)
                    buildingId = row.get("buildingId").toString();
                String time = row.get("time").toString();
                if(analyzeNameService.isNotFitRollbackTime(time)){
                    response.setSuccess(false);
                    response.setErrorCode(200);
                    response.setMsg("无法撤销，超过可撤销时间");
                }
                boolean result = productDataService.rollbackProductData("preprocess",preprocesslogId,operator,userId,projectId,buildingId);
                response.setSuccess(result);
            }else {
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("该次记录无法撤销");
            }
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
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
                String remark = (jsonTemp.get("remark") + "").trim();
                map.put("productName",productName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                map.put("remark",remark);
                if(analyzeNameService.isStringNotPositiveInteger(count))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] productId = analyzeNameService.isInfoExistBackUnit("product",productName);
                    if(productId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该产品的基础信息",map);
                    else
                        insertList = productDataService.productAddInsertRowToInboundList(insertList,productId[0],warehouseName,count,productId[1],productId[2],remark);
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
    }

    /*
     * 退库成品入库撤销
     * */
    @RequestMapping("/backproduct/addDataRollback.do")
    public WebResponse backproductAddDataRollback(String backproductlogId,String operator,HttpSession session){
        WebResponse response = new WebResponse();
        if(operator==null||operator.trim().length()==0){
            response.setErrorCode(300);
            response.setMsg("请选择撤销人！");
            response.setSuccess(false);
            return response;
        }
        try {
            DataRow row = analyzeNameService.canRollback("backproduct_log",backproductlogId);
            if(!row.isEmpty()){
                String userId = (String) session.getAttribute("userid");
                String projectId = null;
                if(row.get("projectId")!=null)
                    projectId = row.get("projectId").toString();
                String buildingId = null;
                if(row.get("buildingId")!=null)
                    buildingId = row.get("buildingId").toString();
                String time = row.get("time").toString();
                if(analyzeNameService.isNotFitRollbackTime(time)){
                    response.setSuccess(false);
                    response.setErrorCode(200);
                    response.setMsg("无法撤销，超过可撤销时间");
                }
                boolean result = productDataService.rollbackProductData("backproduct",backproductlogId,operator,userId,projectId,buildingId);
                response.setSuccess(result);
            }else {
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("该次记录无法撤销");
            }
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 预加工上传excel文件
     * */

    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/preprocess/uploadExcel.do")
    public WebResponse uploadPreprocess(MultipartFile uploadFile) {
        WebResponse response = new WebResponse();
        try {
            UploadDataResult result = allExcelService.uploadPreprocessExcelData(uploadFile.getInputStream());
            response.put("dataList",result.dataList);
            response.put("listSize", result.dataList.size());
            response.setSuccess(true);
        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 退库成品上传excel文件
     * */

    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/backproduct/uploadExcel.do")
    public WebResponse uploadBackproduct(MultipartFile uploadFile) {
        WebResponse response = new WebResponse();
        try {
            UploadDataResult result = allExcelService.uploadBackproductExcelData(uploadFile.getInputStream());
            response.put("dataList",result.dataList);
            response.put("listSize", result.dataList.size());
            response.setSuccess(true);
        } catch (IOException e) {
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
        c.and(new mysqlcondition("countStore", ">", "0"));
        return queryService.queryDataPage(start, limit, c, tableName);
    }

    /*
     * 上传excel文件废料入库单
     * */
    @RequestMapping(value = "/waste/uploadExcel.do")
    public WebResponse wasteUploadExcel(MultipartFile uploadFile) {
        WebResponse response = new WebResponse();
        try {
            UploadDataResult result = allExcelService.uploadWasteExcelData(uploadFile.getInputStream());
            response.setSuccess(result.success);
            response.setErrorCode(result.errorCode);
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        //net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
        return response;
    }

    /*
     * 废料入库
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/waste/addData.do")
    public WebResponse wasteAddData(String s,String operator,String projectId,String buildingId, HttpSession session) {
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
            if((projectId==null)||(projectId.length()==0)||(buildingId==null)||(buildingId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("未选择项目或楼栋");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(400);
                response.setMsg("未选择入库人");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            System.out.println("[===checkWasteUploadData===]");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个:" + jsonTemp);
                String id = jsonTemp.get("id")+"";
                String wasteName = (jsonTemp.get("wasteName") + "").trim().toUpperCase();
                String warehouseName = (jsonTemp.get("warehouseName") + "").trim().toUpperCase();
                String inventoryUnit = (jsonTemp.get("inventoryUnit") + "").trim().toUpperCase();
                String count = (jsonTemp.get("count") + "").trim();
                String remark = jsonTemp.get("remark") + "";
                map.put("wasteName",wasteName);
                map.put("warehouseName",warehouseName);
                map.put("inventoryUnit",inventoryUnit);
                map.put("count",count);
                map.put("remark",remark);
                if(wasteName.equals("NULL")||wasteName.length()==0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未输入品名",map);
                else if(analyzeNameService.isStringNotNonnegativeNumber(count))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"数量输入有误",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                if(errorList.isEmpty())
                    insertList = productDataService.wasteAddInsertRowToInboundList(insertList,wasteName,warehouseName,inventoryUnit,count,remark);
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.setMsg("提交的数据存在错误内容");
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                return response;
            }
            System.out.println("[===checkWasteUploadData==Complete=NoError]");
            boolean uploadResult= productDataService.insertWasteDataToStore(insertList,userId,operator,projectId,buildingId);
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
     * 废料仓库记录查询
     * */
    @RequestMapping("/waste/queryLog.do")
    public WebResponse queryWasteLog(String type,String projectId, String buildingId,String operator,String timeStart, String timeEnd,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=type&&type.length() != 0) {
            c.and(new mysqlcondition("type", "=", type));
        }
        if (null!=projectId&&projectId.length() != 0) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null!=buildingId&&buildingId.length() != 0) {
            c.and(new mysqlcondition("buildingId", "=", projectId));
        }
        if (null!=operator&&operator.length() != 0) {
            c.and(new mysqlcondition("operator", "=", operator));
        }
        if (null!=timeStart&&timeStart.length() != 0) {
            c.and(new mysqlcondition("time", ">=", timeStart));
        }
        if (null!=timeEnd&&timeEnd.length() != 0) {
            c.and(new mysqlcondition("time", "<=", timeEnd));
        }
        return queryService.queryDataPage(start, limit, c, "waste_log_view");
    }

    /*
     * 废料仓库记录查询detail
     * */
    @RequestMapping("/waste/queryLogDetail.do")
    public WebResponse queryWasteLogDetail(String wastelogId,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=wastelogId&&wastelogId.length() != 0) {
            c.and(new mysqlcondition("wasteLogId", "=", wastelogId));
        }else {
            WebResponse response = new WebResponse();
            response.setSuccess(false);
            response.setErrorCode(100);//未获取到退料单号
            response.setMsg("未获取到该次记录");
            return response;
        }
        return queryService.queryDataPage(start, limit, c, "waste_log_detail_view");
    }

    /*
     * 废料入库撤销
     * */
    @RequestMapping("/waste/addDataRollback.do")
    public WebResponse wasteAddDataRollback(String wastelogId,String operator,HttpSession session){
        WebResponse response = new WebResponse();
       if(operator==null||operator.trim().length()==0){
           response.setErrorCode(300);
           response.setMsg("请选择撤销人！");
           response.setSuccess(false);
           return  response;
       }
        try {
            DataRow row = analyzeNameService.canRollback("waste_log",wastelogId);
            if(!row.isEmpty()){
                String userId = (String) session.getAttribute("userid");
                String projectId = row.get("projectId").toString();
                String buildingId = row.get("buildingId").toString();
                String time = row.get("time").toString();
                if(analyzeNameService.isNotFitRollbackTime(time)){
                    response.setSuccess(false);
                    response.setErrorCode(200);
                    response.setMsg("无法撤销，超过可撤销时间");
                }
                boolean result = productDataService.rollbackWasteData(wastelogId,operator,userId,projectId,buildingId);
                response.setSuccess(result);
            }else {
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("该次记录无法撤销");
            }
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 废料仓库库存查询
     * */
    @RequestMapping("/waste/queryStore.do")
    public WebResponse queryWasteStore(String wasteName, String warehouseName,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
//        if (null!=wasteName&&wasteName.trim().length() != 0) {
//            c.and(new mysqlcondition("wasteName", "=", wasteName.trim().toUpperCase()));
//        }
        if (null!=wasteName&&wasteName.trim().length() != 0) {
            c.and(new mysqlcondition("wasteName", "like", "%"+wasteName.trim().toUpperCase()+"%"));
        }
        if (null!=warehouseName&&warehouseName.trim().length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName.trim().toUpperCase()));
        }
        return queryService.queryDataPage(start, limit, c, "waste_store");
    }

    /*
     * 废料出库
     * */
    @RequestMapping("/waste/outStore.do")
    public WebResponse outWasteStore(String s, String operator,HttpSession session){
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
            if((operator==null)||(operator.length()==0)) {
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("未选择出库人");
                return response;
            }
            DataList errorList = analyzeNameService.checkCountALessThanCountBInJsonArray(jsonArray,"count","countStore");
            if(errorList.size()!=0){
                response.put("errorList",errorList);
                response.put("errorNum",errorList.size());
                response.setSuccess(false);
                response.setErrorCode(400);//存在错误输入
                response.setMsg("存在错误输入");
                return response;
            }
            boolean result = productDataService.wasteOutStore(jsonArray,operator,userId);
            response.setSuccess(result);
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 废料结算
     * */
    @RequestMapping("/waste/settleAccount.do")
    public WebResponse settleAccountWaste(String account,String remark, String operator,String projectId, String buildingId,HttpSession session){
        WebResponse response = new WebResponse();
        try {
            String userId = (String) session.getAttribute("userid");
            //检查
            account = (account+"").trim();
            if((account.equals("null"))||(account.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            if(analyzeNameService.isStringNotNumber(account)){
                response.setSuccess(false);
                response.setErrorCode(200);
                response.setMsg("结算金额错误输入");
                return response;
            }
            if((projectId==null)||(projectId.length()==0)||(buildingId==null)||(buildingId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("未选择项目或楼栋");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(400);
                response.setMsg("未选择结算人");
                return response;
            }
            System.out.println("[===checkWasteSettleData==Complete=NoError]");
            boolean uploadResult= productDataService.addWasteSettleData(account,remark,userId,operator,projectId,buildingId);
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
     * 废料结算查询
     * */
    @RequestMapping("/waste/querySettle.do")
    public WebResponse queryWasteSettle(String projectId, String buildingId,String operator,String timeStart, String timeEnd,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=projectId&&projectId.length() != 0) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null!=buildingId&&buildingId.length() != 0) {
            c.and(new mysqlcondition("buildingId", "=", projectId));
        }
        if (null!=operator&&operator.length() != 0) {
            c.and(new mysqlcondition("operator", "=", operator));
        }
        if (null!=timeStart&&timeStart.length() != 0) {
            c.and(new mysqlcondition("time", ">=", timeStart));
        }
        if (null!=timeEnd&&timeEnd.length() != 0) {
            c.and(new mysqlcondition("time", "<=", timeEnd));
        }
        return queryService.queryDataPage(start, limit, c, "waste_settle_account_view");
    }









}
