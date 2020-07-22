package com.bancai.yrd.service;

import com.bancai.cg.controller.new_panel_match;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;

import javax.script.ScriptException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class DesignlistService extends BaseService{
    private Logger log = Logger.getLogger(DesignlistService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private PanelMatchService panelMatchService;
    @Autowired
    private ProductDataService productDataService;
    @Autowired
    private new_panel_match new_panel_match;

    /**
     * 设计清单解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userId, String projectId, String buildingId,
                                             String buildingpositionId) throws IOException, ScriptException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
        for (DataRow dataRow : dataList) {
            String productName = dataRow.get("productName").toString().trim().toUpperCase();
            String position = dataRow.get("position").toString();
            if (!isDesignlistPositionValid(projectId, buildingId, position)) {
                result.dataList = dataList;
                result.setErrorCode(2);
                return result;
            }
            int productId = productDataService.addProductInfoIfNameValid(productName,userId);
            if(productId==0){
                result.setErrorCode(2);
                result.dataList = dataList;
                return result;
            }
            setDesignlistOrigin(projectId,buildingId,buildingpositionId,String.valueOf(productId),position,0,0);
        }

        panelMatchService.matchBackProduct(projectId,buildingId,buildingpositionId);
        panelMatchService.matchPreprocess(projectId,buildingId,buildingpositionId);
        panelMatchService.matchOldpanel(projectId,buildingId,buildingpositionId);
        new_panel_match.match(Integer.parseInt(projectId),Integer.parseInt(buildingId),Integer.parseInt(buildingpositionId));
        result.success = panelMatchService.matchError(projectId,buildingId,buildingpositionId);
        result.dataList = dataList;
        return result;
    }

    private boolean isDesignlistPositionValid(String projectId,String buildingId,String position){
        return queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                , projectId, buildingId, position).isEmpty();
    }

    /**
     * 导入设计清单，返回清单id
     */
    private void setDesignlistOrigin(String projectId, String buildingId, String buildingpositionId, String productId, String position,
                                     int madeBy, int processStatus){
        insertProjectService.insertDataToTable("insert into designlist " +
                        "(projectId,buildingId,buildingpositionId,productId,position,madeBy,processStatus) values " +
                        "(?,?,?,?,?,?,?)", projectId, buildingId, buildingpositionId, productId, position,
                String.valueOf(madeBy), String.valueOf(processStatus));
    }

    @Transactional
    public void saveDepartmentWorkerData(String id, String departmentId, String workerName,String tel,boolean exist){
        if(exist){
            String sql1 = "update department_worker set departmentId=\""+departmentId+"\",workerName=\""+workerName+"\",tel=\""+tel+"\" where id=\""+id+"\"";
            jo.update(sql1);
        }else {
            String sql2 = "insert into department_worker (departmentId,workerName,tel) values (?,?,?)";
            insertProjectService.insertIntoTableBySQL(sql2,departmentId,workerName,tel);
        }
    }

    /*
     * 查询工单
     * */
    @Transactional
    public DataList findWorkOrder(String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from work_order_view where processStatus=0 ");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" and projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
            if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
                sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        }
        return queryService.query(sb.toString());
    }

    /*
     * 查询工单
     * */
    @Transactional
    public DataList findWorkOrderLog(String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from work_order_log_view");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" where projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
            if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
                sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        }
        return queryService.query(sb.toString());
    }

    /**
     * 添加领料单
     */
    @Transactional
    public int[] orderAddRequisition(String userId, String operator, String time) {
        int requisitionOrderId = insertProjectService.insertDataToTable("insert into requisition_order (userId,operator,time) values (?,?,?)"
                , userId, operator, time);
        String sql_addLog = "insert into requisition_order_log (type,requisitionOrderId,userId,time,operator) values(?,?,?,?,?)";
        int requisitionOrderLogId= insertProjectService.insertDataToTable(sql_addLog, "1"
                , String.valueOf(requisitionOrderId),userId,time,operator);
        return new int[] {requisitionOrderId,requisitionOrderLogId};
    }

    /**
     * 添加领料单内容
     */
    @Transactional
    public void orderAddRequisitionDetail(int requisitionOrderId,int requisitionOrderLogId,String workOrderDetailId) {
        DataList workOrderDetailListList = queryService.query("select * from work_order_detail_list where detailId=?",workOrderDetailId);
        for (DataRow dataRow : workOrderDetailListList) {
            insertRequisitionDetail(dataRow,requisitionOrderId,requisitionOrderLogId,workOrderDetailId);
        }
        String sql_updateStatus = "update work_order_detail set status=1 where id=\""+workOrderDetailId+"\"";
        jo.update(sql_updateStatus);
    }

    @Transactional
    public void insertRequisitionDetail(DataRow dataRow, int requisitionOrderId,int requisitionOrderLogId,String workOrderDetailId){
        String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
                " values (?,?,?)";
        String sql = "select * from requisition_order_detail where requisitionOrderId=? and workOrderDetailId=?" +
                " and type=? and storeId=? and productId=?";
        String matchResultId = dataRow.get("matchResultId").toString();
        DataList matchResultList = new DataList();
        matchResultList = queryService.query("select * from query_match_result where id=?", matchResultId);
        String projectId = matchResultList.get(0).get("projectId").toString();
        String buildingId = matchResultList.get(0).get("buildingId").toString();
        String buildingpositionId = matchResultList.get(0).get("buildingpositionId").toString();
        String type = matchResultList.get(0).get("materialMadeBy").toString();
        String storeId = matchResultList.get(0).get("matchId").toString();
        String count = matchResultList.get(0).get("count").toString();
        String productId = matchResultList.get(0).get("productId").toString();
        DataList queryList = queryService.query(sql, String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId);
        if (queryList.isEmpty()) {
            int requisitionOrderDetailId = insertProjectService.insertDataToTable("insert into requisition_order_detail " +
                            "(requisitionOrderId,workOrderDetailId,type,storeId,productId,countRec,countAll" +
                            ",projectId,buildingId,buildingpositionId) values (?,?,?,?,?,?,?,?,?,?)"
                    , String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId, count, count
                    , projectId, buildingId, buildingpositionId);
            insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
                    String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
        } else {
            int requisitionOrderDetailId = Integer.parseInt(queryList.get(0).get("id").toString());
            jo.update("update requisition_order_detail set countRec=countRec+\"" + count + "\"" + ",countAll=countAll+\"" + count + "\""
                    + " where id=\"" + requisitionOrderDetailId + "\"");
            insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
                    String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
        }
    }




    /*
     * 查询领料单（未完成）
     * */
    @Transactional
    public DataList findRequisitionOrder(String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from work_order_view");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" where projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
            if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
                sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        }
        return queryService.query(sb.toString());
    }

    /*
     * 查询领料单细节
     * */
    @Transactional
    public DataList findRequisitionOrderDetail(String requisitionOrderId){
        return queryService.query("select * from requisition_order_detail where requisitionOrderId=?",requisitionOrderId);
    }

    /**
     * 领料单内容领料
     */
    @Transactional
    public boolean orderUpdateRequisitionDetail(String requisitionOrderDetailId, String count,int type,String storeId) {
        String sql1 = "update requisition_order_detail set countRec=countRec-\""+count+
                "\" where requisitionOrderDetailId=\""+requisitionOrderDetailId+"\"";
        jo.update(sql1);
        String sql2="";
        switch (type){
            case 1:
                sql2 = "update backproduct_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 2:
                sql2 = "update preprocess_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 3:
                sql2 = "update oldpanel_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 4:
                sql2 = "update material_store set count=count-\""+count+"\" where id=\""+storeId+"\"";
                break;
        }
        jo.update(sql2);
        return true;
    }












}
