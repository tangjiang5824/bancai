package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AllExcelService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.yrd.service.DesignlistService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
    @Autowired
    private AnalyzeNameService analyzeNameService;

    Logger log=Logger.getLogger(DesignlistController.class);

    /*
     * 上传excel文件designlist
     * */
    @RequestMapping(value = "/designlist/uploadExcel.do",method = RequestMethod.POST)
    @ApiOperation("上传设计清单文件")
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
    @RequestMapping(value = "/designlist/uploadData.do", method = RequestMethod.POST)
    @ApiOperation("提交设计清单数据")
    public WebResponse designlistUploadData(@ApiParam("品名，位置编号，图号")String s, String projectId, String buildingId, String buildingpositionId, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            DataList errorList = new DataList();
            DataList validList = new DataList();
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String)session.getAttribute("userid");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个---" + jsonTemp);
                String productName=(jsonTemp.get("品名")+"").trim().toUpperCase();
                String position=(jsonTemp.get("位置编号")+"").trim().toUpperCase();
                if(position.equals("NULL")||position.length()==0)
                    position = "-1";
                String figureNum=(jsonTemp.get("图号")+"").trim().toUpperCase();
                int analyzeDesignlist = designlistService.analyzeDesignlist(productName, position, userId, projectId, buildingId);
                if(analyzeDesignlist==-100){
                    DataRow errorRow = new DataRow();
                    errorRow.put("productName",productName);
                    errorRow.put("position",position);
                    errorRow.put("figureNum",figureNum);
                    errorRow.put("errorType","位置重复");
                    errorList.add(errorRow);
                }else if(analyzeDesignlist==-200){
                    DataRow errorRow = new DataRow();
                    errorRow.put("productName",productName);
                    errorRow.put("position",position);
                    errorRow.put("figureNum",figureNum);
                    errorRow.put("errorType","品名不合法");
                    errorList.add(errorRow);
                }else {
                    DataRow validRow = new DataRow();
                    validRow.put("productId",String.valueOf(analyzeDesignlist));
                    validRow.put("position",position);
                    validRow.put("figureNum",figureNum);
                    validList.add(validRow);
                }
            }
            if(errorList.size()!=0){
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
    @ApiOperation("查询设计清单导入记录")
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
    @ApiOperation("根据logid查询设计清单")
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
    @ApiOperation("根据logid撤销设计清单")
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
    @ApiOperation("添加或更新操作员信息")
    public boolean addOrUpdateWorkerInfo(String id, String departmentId, String workerName,String tel){
        workerName = workerName.trim();
        tel = tel.trim();
        boolean exist = false;
        if(!analyzeNameService.isStringNotPureNumber(id)){
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
    @ApiOperation("工单查询")
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
    @ApiOperation("工单细节查询")
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
    @ApiOperation("根据选取工单生成领料单材料汇总预览")
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
            StringBuilder sb =new StringBuilder("select type,name,sum(singleNum) AS count from requisition_create_preview_work_order_match_store where workOrderDetailId in (\"");
            //StringBuilder sb =new StringBuilder("select type,name,warehouseName,sum(singleNum) AS count from requisition_create_preview_work_order_match_store where workOrderDetailId in (\"");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String workOrderDetailId=jsonTemp.get("workOrderDetailId")+"";
                System.out.println("第" + i + "个workOrderDetailId---" + workOrderDetailId);
                sb.append(workOrderDetailId).append("\",\"");
//                createList = designlistService.createRequisitionPreview(createList, workOrderDetailId);
            }
            sb.deleteCharAt(sb.length()-1);
            sb.deleteCharAt(sb.length()-1);
            sb.append(") group by type,storeId");
            System.out.println(sb.toString());
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
    @ApiOperation("新建领料单")
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
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String workOrderDetailId=jsonTemp.get("workOrderDetailId")+"";
                sb.append("\"").append(workOrderDetailId).append("\",");
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
    public WebResponse queryRequisitionOrder(String origin,String projectId, String operator,String requisitionOrderId, String timeStart, String timeEnd,Integer start,Integer limit){
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
        if (null!=origin&&origin.length() != 0) {
            c.and(new mysqlcondition("origin", "=", origin));
        }else {
            c.and(new mysqlcondition("origin", "=", 1));
        }
        return queryService.queryDataPage(start, limit, c, "requisition_order_union_view");
    }

    /*
     * 查询超领单
     * */
    @RequestMapping("/order/queryOverRequisitionOrder.do")
    public WebResponse queryOverRequisitionOrder(String projectId, String operator,String requisitionOrderId, String timeStart, String timeEnd,Integer start,Integer limit){
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
        return queryService.queryDataPage(start, limit, c, "over_requisition_order_view");
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
    @ApiOperation("领料单细节查询")
    public WebResponse queryRequisitionOrderDetail(String type,String origin, String requisitionOrderId, String warehouseName, String buildingId,
                                                   String buildingpositionId,String isCompleteMatch,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        String tableName = "requisition_order_detail_view";
        if (null!=requisitionOrderId&&requisitionOrderId.length() != 0) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
        }else {
            WebResponse response = new WebResponse();
            response.setSuccess(false);
            response.setErrorCode(100);
            response.setMsg("未获取到领料单号");
            return response;
        }
        if (null!=type&&type.length() != 0) {
            System.out.println(type);
            if((!type.equals("4"))||(origin.equals("1"))) c.and(new mysqlcondition("type", "=", type));
            else tableName = "over_requisition_order_detail_view";
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
        if (null!=isCompleteMatch&&isCompleteMatch.length() != 0) {
            c.and(new mysqlcondition("isCompleteMatch", "=", isCompleteMatch));
        }
        return queryService.queryDataPage(start, limit, c, tableName);
    }
    /*
     * 查询某张超领单细节zzy
     * */
    @RequestMapping("/order/zzyqueryOverRequisitionOrderDetail.do")
    @ApiOperation("领料单细节查询")
    public WebResponse zzyqueryOverRequisitionOrderDetail(String requisitionOrderId, String buildingId,
                                                   String buildingpositionId,String isCompleteMatch,Integer start,Integer limit){
        mysqlcondition c=new mysqlcondition();
        String tableName = "over_requisition_order_detail_view";
        if (null!=requisitionOrderId&&requisitionOrderId.length() != 0) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
        }
        if (null!=buildingId&&buildingId.length() != 0) {
            c.and(new mysqlcondition("buildingId", "=", buildingId));
        }
        if (null!=buildingpositionId&&buildingpositionId.length() != 0) {
            c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
        }
        if (null!=isCompleteMatch&&isCompleteMatch.length() != 0) {
            c.and(new mysqlcondition("isCompleteMatch", "=", isCompleteMatch));
        }
        return queryService.queryDataPage(start, limit, c, tableName);
    }
    /*
     * 查询某张超领单细节
     * */
    @RequestMapping("/order/queryOverRequisitionOrderDetail.do")
    @ApiOperation("超领单细节查询")
    public WebResponse queryOverRequisitionOrderDetail(String type, String requisitionOrderId, String warehouseName, String buildingId,
                                                   String buildingpositionId,String isCompleteMatch,Integer start,Integer limit){
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
        if (null!=isCompleteMatch&&isCompleteMatch.length() != 0) {
            c.and(new mysqlcondition("isCompleteMatch", "=", isCompleteMatch));
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
            DataList errorList = analyzeNameService.checkCountALessThanCountBInJsonArray(jsonArray,"count","countRec");
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
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }
    /*
     * 自定义原材料领料
     * */
    @RequestMapping(value = "/requisition/MaterialRequisitionOrder.do")
    public WebResponse materialOrderFinish(String s, String requisitionOrderId, String projectId, String operator, HttpSession session) throws JSONException {
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
//            DataList errorList = analyzeNameService.checkCountALessThanCountBInJsonArray(jsonArray,"count","countRec");
//            if(errorList.size()!=0){
//                response.put("errorList",errorList);
//                response.put("errorNum",errorList.size());
//                response.setSuccess(false);
//                response.setErrorCode(400);//存在错误输入
//                response.setMsg("存在错误输入");
//                return response;
//            }
            designlistService.materialRequisition(jsonArray,requisitionOrderId,projectId,operator,userId);
            response.setSuccess(true);
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
    public WebResponse backStoreUploadExcel(MultipartFile uploadFile,String type,String projectId,String buildingId) {
        WebResponse response = new WebResponse();
        try {
            if(type==null||type.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //退料类型错误
                response.setMsg("未选择退料类型");
                return response;
            }
            if(projectId==null||projectId.length()==0||buildingId==null||buildingId.length()==0){
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("未选择项目或楼栋");
                return response;
            }
            String typeName = "";
            String originName = "";
            switch (type){
                case "1":
                    typeName = "backproduct";
                    originName = "product";
                    break;
                case "2":
                    typeName = "preprocess";
                    originName = "product";
                    break;
                case "3":
                    typeName = "oldpanel";
                    originName = "oldpanel";
                    break;
                case "4":
                    typeName = "material";
                    originName = "material";
                    break;
                default:
                    response.setSuccess(false);
                    response.setErrorCode(100); //退料类型错误
                    response.setMsg("退料类型错误");
                    return response;
            }
            UploadDataResult result = allExcelService.uploadBackExcelData(typeName,originName,projectId,buildingId,uploadFile.getInputStream());
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
            DataList errorList = analyzeNameService.checkCountALessThanCountBInJsonArray(jsonArray,"count","countReturn");
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

    /**
     * 下拉获取仓库信息
     * @param response
     */
    @RequestMapping(value="/store/findAllStoreInfo.do")
    public void findAllStoreInfo(HttpServletResponse response,String typeName) throws JSONException {
        try{
            if((typeName!=null)&&(typeName.length()!=0)){
                DataList infoList = queryService.query("select * from "+typeName+"_info_store_type where countUse>=1");
                //写回前端
                JSONObject object = new JSONObject();
                JSONArray array = new JSONArray(infoList);
                object.put("infoList", array);
                // System.out.println("类型1：--"+array.getClass().getName().toString());
                response.setCharacterEncoding("UTF-8");
                response.setContentType("text/html");
                response.getWriter().write(object.toString());
                response.getWriter().flush();
                response.getWriter().close();
            }
        }catch (Exception ignored){
        }
    }

    /*
     * 匹配结果删除行
     * */
    @RequestMapping(value = "/designlist/deleteMatchResult.do")
    @ApiOperation("匹配结果删除行")
    public WebResponse deleteDesignlistMatchResult(String s) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的s为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            boolean result = designlistService.designlistDeleteMatchResult(jsonArray);
            response.setSuccess(result);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 修改匹配结果
     * */
    @RequestMapping(value = "/designlist/changeMatchResult.do")
    @ApiOperation("匹配结果修改")
    public WebResponse changeDesignlistMatchResult(String s,String isCompleteMatch, String designlistId) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);//接收到的s为空
                response.setMsg("接收到的数据为空");
                return response;
            }
            DataList result = designlistService.addMatchResultBackErrorList(jsonArray,isCompleteMatch,designlistId);
            if (result.size()>0){
                response.put("errorList",result);
                response.put("errorNum",result.size());
                response.setSuccess(false);
                response.setErrorCode(400);//存在错误输入
                response.setMsg("存在错误输入");
                return response;
            }
            response.setSuccess(true);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }



    @RequestMapping(value = "/order/createOverRequisitionOrder.do",method = RequestMethod.POST)
    @ApiOperation("新建超领单")
    public WebResponse createOverReqOrder(String s, String projectId,String buildingId,String buildingpositionId,String description,String operator, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("接收到的数据为空");
                return response;
            }
            if((projectId==null)||(projectId.length()==0)||(buildingId==null)||(buildingId.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(200);
                response.setMsg("未选择项目或楼栋");
                return response;
            }
            if((operator==null)||(operator.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("未选择超领申请人");
                return response;
            }
            if((description==null)||(description.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(400);
                response.setMsg("未输入超领原因");
                return response;
            }
            if((buildingpositionId==null)||(buildingpositionId.length()==0))
                buildingpositionId = null;
            String userId = (String)session.getAttribute("userid");
            DataList errorList = analyzeNameService.checkCountALessThanCountBInJsonArray(jsonArray,"count","countUse");
            if(errorList.size()!=0){
                response.put("errorList",errorList);
                response.put("errorNum",errorList.size());
                response.setSuccess(false);
                response.setErrorCode(400);
                response.setMsg("存在错误输入");
                return response;
            }
            boolean result = designlistService.createOverReqOrder(jsonArray,projectId,buildingId,buildingpositionId,description,operator,userId);
            response.setSuccess(result);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }










}
