package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AllExcelService;
import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.yrd.service.DesignlistService;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.TableService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.crypto.Data;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

@RestController
public class DesignlistController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private PanelMatchService panelMatchService;
    @Autowired
    private DesignlistService designlistService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AllExcelService allExcelService;

    private static String isPureNumber = "[0-9]+";
    Logger log=Logger.getLogger(DesignlistController.class);

    /*
     * 上传excel文件designlist
     * */
    @RequestMapping(value = "/designlist/uploadExcel.do")
    public WebResponse designlistUploadExcel(MultipartFile uploadFile) {
        WebResponse response = new WebResponse();
        try {
            UploadDataResult result = designlistService.uploadDesignlist(uploadFile.getInputStream());
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
     * 上传designlist
     * */
    @RequestMapping(value = "/designlist/uploadData.do")
    public WebResponse designlistUploadData(String s, String projectId, String buildingId, String buildingpositionId, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            int errorCount = 0;
            DataList errorList = new DataList();
            DataList validList = new DataList();
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String)session.getAttribute("userid");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个---" + jsonTemp);
                String productName=(jsonTemp.get("productName")+"").trim().toUpperCase();
                String position=(jsonTemp.get("position")+"").trim().toUpperCase();
                int analyzeDesignlist = designlistService.analyzeDesignlist(productName, position, userId, projectId, buildingId);
                if(analyzeDesignlist==-100){
                    DataRow errorRow = new DataRow();
                    errorRow.put("productName",productName);
                    errorRow.put("position",position);
                    errorRow.put("errorCode","100");//位置重复
                    errorList.add(errorRow);
                    errorCount++;
                }else if(analyzeDesignlist==-200){
                    DataRow errorRow = new DataRow();
                    errorRow.put("productName",productName);
                    errorRow.put("position",position);
                    errorRow.put("errorCode","200");//品名不合法
                    errorList.add(errorRow);
                    errorCount++;
                }else {
                    DataRow validRow = new DataRow();
                    validRow.put("productId",String.valueOf(analyzeDesignlist));
                    validRow.put("position",position);
                    validList.add(validRow);
                }
            }
            if(errorCount!=0){
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setSuccess(false);
                response.setErrorCode(150); //位置重复或品名不合法
                response.setMsg("位置重复或品名不合法");
                return response;
            } else {
                designlistService.createDesignlistData(validList,userId,projectId,buildingId,buildingpositionId);
                boolean matchDesignlist = designlistService.matchDesignlist(projectId, buildingId, buildingpositionId);
                if(!matchDesignlist){
                    response.setSuccess(false);
                    response.setErrorCode(300); //匹配失败
                    response.setMsg("匹配失败");
                    return response;
                }
                response.setSuccess(true);
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 查询导入的designlist记录
     * */
    @RequestMapping(value = "/designlist/queryUploadLog.do")
    public void designlistqueryUploadLog(String projectId, String buildingId, String buildingpositionId,
                                                HttpServletResponse response) throws IOException, JSONException {
        DataList designlistlogList = designlistService.queryDesignlistlog(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(designlistlogList);
        object.put("designlistlogList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
    }

    /*
     * 查询导入的designlist详情by logid
     * */
    @RequestMapping(value = "/designlist/queryDesignlistByLogId.do")
    public void designlistqueryByLogId(String designlistlogId, HttpServletResponse response) throws IOException, JSONException {
        DataList designlistList = designlistService.queryDesignlistContain(designlistlogId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(designlistList);
        object.put("designlistList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
    }

    /*
     * 对上传的designlist进行撤销
     * */
    @RequestMapping(value = "/designlist/rollbackUploadData.do")
    public WebResponse designlistRollbackUploadData(String designlistlogId, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            if((designlistlogId==null)||(designlistlogId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(100); //未获取到该行数据
                response.setMsg("未获取到该行数据");
                return response;
            }
            if(!designlistService.designlistCanRollback(designlistlogId)){
                response.setSuccess(false);
                response.setErrorCode(200); //已生成工单，或该清单不存在
                response.setMsg("已生成工单，或该清单不存在");
                return response;
            }
            //撤销
            String userId = (String)session.getAttribute("userid");
            response.setSuccess(designlistService.deleteDesignListLog(designlistlogId,userId));
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 添加或更新操作员信息
     * */
    @RequestMapping("/department/addOrUpdateWorkerInfo.do")
    public boolean addOrUpdateWorkerInfo(String id, String departmentId, String workerName,String tel){
        workerName = workerName.trim();
        tel = tel.trim();
        boolean exist = false;
        if(id.matches(isPureNumber)){
            DataList list = queryService.query("select * from department_worker where id=?",id);
            if(!list.isEmpty())
                exist = true;
        }
        System.out.println(id+"==="+departmentId+"==="+workerName+"==="+tel);
        designlistService.saveDepartmentWorkerData(id,departmentId,workerName,tel,exist);
        return true;
    }

    /*
     * 查询工单
     * */
    @RequestMapping("/order/queryWorkOrder.do")
    public void queryWorkOrder(String projectId, String buildingId, String buildingpositionId,
                               HttpServletResponse response) throws IOException, JSONException {
        DataList workOrderList = designlistService.findWorkOrder(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(workOrderList);
        object.put("workOrderList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
    /*
     * 查询工单detail
     * */
    @RequestMapping("/order/queryWorkOrderDetail.do")
    public void queryWorkOrderDetail(String projectId, String buildingId, String buildingpositionId,
                               HttpServletResponse response) throws IOException, JSONException {
        DataList workOrderDetailList = designlistService.findWorkOrderDetail(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(workOrderDetailList);
        object.put("workOrderDetailList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /*
     * 根据选取工单生成领料单材料汇总预览
     * */
    @RequestMapping("/order/requisitionCreatePreview.do")
    public WebResponse requisitionCreatePreview(String s) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            DataList createList = new DataList();
            StringBuilder sb =new StringBuilder("select type,name,warehouseName,sum(singleNum) AS count from requisition_create_preview_work_order_match_store where workOrderDetailId in (\"");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String workOrderDetailId=jsonTemp.get("workOrderDetailId")+"";
                System.out.println("第" + i + "个workOrderDetailId---" + workOrderDetailId);
                sb.append(workOrderDetailId).append("\",");
//                createList = designlistService.createRequisitionPreview(createList, workOrderDetailId);
            }
            sb.deleteCharAt(sb.length()-1);
            sb.append(") group by type,storeId");
            createList = queryService.query(sb.toString());
            response.put("createList",createList);
            if(createList.isEmpty()) {
                response.setSuccess(false);
                response.setErrorCode(200);//生成的领料单为空
                response.setMsg("生成的领料单为空");
            }
            else
                response.setSuccess(true);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 新建领料单
     * */
    @RequestMapping(value = "/order/addRequisitionOrder.do")
    public WebResponse addRequisitionOrder(String s, String operator, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            String userId = (String)session.getAttribute("userid");
//            Date date=new Date();
//            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//            int[] requisitionId = designlistService.orderAddRequisition(userId,operator,simpleDateFormat.format(date));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String workOrderDetailId=jsonTemp.get("workOrderDetailId")+"";
                sb.append("\"").append(workOrderDetailId).append("\",");
//                String type=jsonTemp.get("type")+"";
//                String storeId=jsonTemp.get("storeId")+"";
//                String productId=jsonTemp.get("productId")+"";
//                String count=jsonTemp.get("count")+"";
//                String projectId=jsonTemp.get("projectId")+"";
//                String buildingId=jsonTemp.get("buildingId")+"";
//                String buildingpositionId=jsonTemp.get("buildingpositionId")+"";
//                designlistService.orderAddRequisitionDetail(requisitionId[0], requisitionId[1], workOrderDetailId,
//                        type, storeId, productId, count, projectId, buildingId, buildingpositionId);
            }
            sb.deleteCharAt(sb.length()-1);
            System.out.println("workOrderDetailId====="+sb.toString());
            boolean result = designlistService.createRequisition(sb.toString(),userId,operator);
            response.setSuccess(result);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 查询领料单
     * */
    @RequestMapping("/order/queryRequisitionOrder.do")
    public WebResponse queryRequisitionOrder(String projectId, String operator,String requisitionOrderId, String timeStart, String timeEnd,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=projectId&&projectId.length() != 0) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null!=requisitionOrderId&&requisitionOrderId.length() != 0) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
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
        return queryService.queryDataPage(start, limit, c, "requisition_order_view");
    }
//    public void queryRequisitionOrder(String projectId, String operator, String timeStart, String timeEnd,
//                                      HttpServletResponse response) throws IOException, JSONException {
//        DataList requisitionOrderList = designlistService.findRequisitionOrder(projectId,operator,timeStart,timeEnd);
//        //写回前端
//        JSONObject object = new JSONObject();
//        JSONArray array = new JSONArray(requisitionOrderList);
//        object.put("requisitionOrderList", array);
////        System.out.println("类型1：--"+array.getClass().getName().toString());
//        response.setCharacterEncoding("UTF-8");
//        response.setContentType("text/html");
//        response.getWriter().write(object.toString());
//        response.getWriter().flush();
//        response.getWriter().close();
//    }

    /*
     * 查询某张领料单细节
     * */
    @RequestMapping("/order/queryRequisitionOrderDetail.do")
    public WebResponse queryRequisitionOrderDetail(String type, String requisitionOrderId, String warehouseName, String buildingId,
                                                   String buildingpositionId,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=requisitionOrderId&&requisitionOrderId.length() != 0) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
        }else {
            WebResponse response = new WebResponse();
            response.setSuccess(false);
            response.setErrorCode(100);//未获取到领料单号
            response.setMsg("未获取到领料单号");
            return response;
        }
        if (null!=type&&type.length() != 0) {
            c.and(new mysqlcondition("type", "=", type));
        }
        if (null!=warehouseName&&warehouseName.length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName));
        }
        if (null!=buildingId&&buildingId.length() != 0) {
            c.and(new mysqlcondition("buildingId", "=", buildingId));
        }
        if (null!=buildingpositionId&&buildingpositionId.length() != 0) {
            c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
        }
        return queryService.queryDataPage(start, limit, c, "requisition_order_detail_view");
    }
//    public void queryRequisitionOrderDetail(String type, String requisitionOrderId, String warehouseName, String buildingId,
//                                            String buildingpositionId,HttpServletResponse response) throws IOException, JSONException {
//        if((requisitionOrderId==null)||(requisitionOrderId.length()==0)){
//            response.sendError(100,"未选择领料单");
//        }else {
//            DataList requisitionOrderDetailList = designlistService.findRequisitionOrderDetail(type, requisitionOrderId, warehouseName, buildingId, buildingpositionId);
//            //写回前端
//            JSONObject object = new JSONObject();
//            JSONArray array = new JSONArray(requisitionOrderDetailList);
//            object.put("requisitionOrderDetailList", array);
//            response.setCharacterEncoding("UTF-8");
//            response.setContentType("text/html");
//            response.getWriter().write(object.toString());
//            response.getWriter().flush();
//            response.getWriter().close();
//        }
//    }

    /*
     * 确认领料完成
     * */
    @RequestMapping(value = "/order/finishRequisitionOrder.do")
    public WebResponse requisitionOrderFinish(String s, String requisitionOrderId, String projectId, String operator, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的s为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            if((requisitionOrderId==null)||(requisitionOrderId.length()==0)||(projectId==null)||(projectId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(200);//未收到领料单号或项目ID
                response.setMsg("未收到领料单号或项目ID");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);//未选择领料人
                response.setMsg("未选择领料人");
                return response;
            }
            String userId = (String)session.getAttribute("userid");
            DataList errorList = designlistService.checkFinishRequisitionOrder(jsonArray);
            if(errorList.size()!=0){
                response.put("errorList",errorList);
                response.put("errorNum",errorList.size());
                response.setSuccess(false);
                response.setErrorCode(400);//存在错误输入
                response.setMsg("存在错误输入");
                return response;
            }
            designlistService.finishRequisitionOrder(jsonArray,requisitionOrderId,projectId,operator,userId);
            response.setSuccess(true);
//            Date date=new Date();
//            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//            String sql_addLog = "insert into requisition_order_log (type,requisitionOrderId,userId,time,operator) values(?,?,?,?,?)";
//            int requisitionOrderLogId= insertProjectService.insertDataToTable(sql_addLog, "2"
//                    , requisitionOrderId,userId,simpleDateFormat.format(date),operator);
//            for (int i = 0; i < jsonArray.length(); i++) {
//                JSONObject jsonTemp = jsonArray.getJSONObject(i);
//                System.out.println("第" + i + "个---" + jsonTemp);
//                String requisitionOrderDetailId=jsonTemp.get("requisitionOrderDetailId")+"";
//                String count = (jsonTemp.get("count")+"").trim();
//                String countRec = jsonTemp.get("countRec")+"";
//                int type = Integer.parseInt(jsonTemp.get("type")+"");
//                String storeId = jsonTemp.get("storeId")+"";
//                if((count.length()==0)||(Double.parseDouble(count)<0)||(Double.parseDouble(count)>Double.parseDouble(countRec)))
//                    continue;
//                boolean is_update_right = designlistService.orderUpdateRequisitionDetail(requisitionOrderDetailId,count,type,storeId);
//                if(!is_update_right)
//                    return false;
//                String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
//                        " values (?,?,?)";
//                boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                        String.valueOf(requisitionOrderLogId),requisitionOrderDetailId,count);
//                if(!is_log_right){
//                    return false;
//                }
//            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 上传excel文件退料单
     * */
    @RequestMapping(value = "/backStore/uploadExcel.do")
    public WebResponse backStoreUploadExcel(MultipartFile uploadFile,String type) {
        WebResponse response = new WebResponse();
        try {
            if(type==null||type.trim().length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //退料类型错误
                response.setMsg("未选择退料类型");
                return response;
            }
            UploadDataResult result = new UploadDataResult();
            switch (type){
                case "1":
                    break;
                case "2":
                    break;
                case "3":
                    result = allExcelService.uploadBackOldpanelExcelData(uploadFile.getInputStream());
                    break;
                case "4":
                    result = allExcelService.uploadBackMaterialExcelData(uploadFile.getInputStream());
                    break;
                default:
                    response.setSuccess(false);
                    response.setErrorCode(100); //退料类型错误
                    response.setMsg("退料类型错误");
                    return response;
            }
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
     * 新建退料单
     * */
    @RequestMapping(value = "/backStore/createReturnOrder.do")
    public WebResponse backStoreAddData(String s, String type, String projectId,String buildingId,String description, String operator, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的s为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            if((projectId==null)||(projectId.length()==0)||(buildingId==null)||(buildingId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(200);//未收到项目或楼栋ID
                response.setMsg("未选择项目或楼栋");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);//未选择退料人
                response.setMsg("未选择退料人");
                return response;
            }
            if((description==null)||(description.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(400);//未输入退料原因
                response.setMsg("未输入退料原因");
                return response;
            }
            if((type==null)||(type.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(500);//未选择退料类型
                response.setMsg("未选择退料类型");
                return response;
            }
            String userId = (String)session.getAttribute("userid");
            boolean result = designlistService.createReturnOrder(jsonArray,type,projectId,buildingId,description,operator,userId);
            response.setSuccess(result);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 查询退料单
     * */
    @RequestMapping("/backStore/queryReturnOrder.do")
    public WebResponse queryReturnOrder(String type,String projectId, String buildingId,String operator,String returnOrderId, String timeStart, String timeEnd,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=type&&type.length() != 0) {
            c.and(new mysqlcondition("type", "=", type));
        }else {
            WebResponse response = new WebResponse();
            response.setSuccess(false);
            response.setErrorCode(100);//未获取到类型
            response.setMsg("未获取到类型");
            return response;
        }
        if (null!=projectId&&projectId.length() != 0) {
            c.and(new mysqlcondition("projectId", "=", projectId));
        }
        if (null!=buildingId&&buildingId.length() != 0) {
            c.and(new mysqlcondition("buildingId", "=", projectId));
        }
        if (null!=returnOrderId&&returnOrderId.length() != 0) {
            c.and(new mysqlcondition("returnOrderId", "=", returnOrderId));
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
        return queryService.queryDataPage(start, limit, c, "return_order_view");
    }

    /*
     * 查询某张退料单细节
     * */
    @RequestMapping("/backStore/queryReturnOrderDetail.do")
    public WebResponse queryReturnOrderDetail(String returnOrderId,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        if (null!=returnOrderId&&returnOrderId.length() != 0) {
            c.and(new mysqlcondition("returnOrderId", "=", returnOrderId));
        }else {
            WebResponse response = new WebResponse();
            response.setSuccess(false);
            response.setErrorCode(100);//未获取到退料单号
            response.setMsg("未获取到退料单号");
            return response;
        }
        return queryService.queryDataPage(start, limit, c, "return_order_detail_view");
    }

    /*
     * 确认退料完成
     * */
    @RequestMapping(value = "/order/finishReturnOrder.do")
    public WebResponse returnOrderFinish(String s, String type,String returnOrderId,String operator, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的s为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            if((type==null)||(type.length()==0)||(returnOrderId==null)||(returnOrderId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(200);//未收到退料单号
                response.setMsg("未获取到类型或退料单号");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);//未选择退料人
                response.setMsg("未选择退料人");
                return response;
            }
            String userId = (String)session.getAttribute("userid");
            DataList errorList = designlistService.checkFinishReturnOrder(jsonArray);
            if(errorList.size()!=0){
                response.put("errorList",errorList);
                response.put("errorNum",errorList.size());
                response.setSuccess(false);
                response.setErrorCode(400);//存在错误输入
                response.setMsg("存在错误输入");
                return response;
            }
            boolean result = designlistService.finishReturnOrder(jsonArray,type,returnOrderId,operator,userId);
            response.setSuccess(result);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }












}
