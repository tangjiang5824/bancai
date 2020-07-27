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
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;

import javax.script.ScriptException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

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
     * 设计清单excel解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream) throws IOException {
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);
        result.dataList = excel.readExcelContent();
        return result;
    }

    /**
     * 设计清单内容检查
     */
    @Transactional
    public int analyzeDesignlist(String productName, String position, String userId, String projectId, String buildingId) {
        if (!isDesignlistPositionValid(projectId, buildingId, position))
            return -100;//位置重复导入
        int productId = productDataService.addProductInfoIfNameValid(productName,userId);
        if(productId==0)
            return -200;//品名不合法
        return productId;
    }
    /**
     * 设计清单生成
     */
    @Transactional
    public int createDesignlistData(DataList validList, String userId, String projectId, String buildingId,
                                 String buildingpositionId) {
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_addLog = "insert into designlist_log (userId,time,isrollback,projectId,buildingId,buildingpositionId) values(?,?,?,?,?,?)";
        int designlistlogId= insertProjectService.insertDataToTable(sql_addLog,userId,simpleDateFormat.format(date),"0"
                ,projectId, buildingId, buildingpositionId);
        for (DataRow dataRow : validList) {
            String productId = dataRow.get("productId").toString();
            String position = dataRow.get("position").toString();
            setDesignlistOrigin(designlistlogId, projectId, buildingId, buildingpositionId, String.valueOf(productId), position, 0, 0);
        }
        return designlistlogId;
    }
    /**
     * 设计清单匹配
     */
    @Transactional
    public boolean matchDesignlist(String projectId, String buildingId, String buildingpositionId) throws ScriptException {
        panelMatchService.matchBackProduct(projectId,buildingId,buildingpositionId);
        panelMatchService.matchPreprocess(projectId,buildingId,buildingpositionId);
        panelMatchService.matchOldpanel(projectId,buildingId,buildingpositionId);
        new_panel_match.match(Integer.parseInt(projectId),Integer.parseInt(buildingId),Integer.parseInt(buildingpositionId));
        return panelMatchService.matchError(projectId,buildingId,buildingpositionId);
    }

    private boolean isDesignlistPositionValid(String projectId,String buildingId,String position){
        return queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                , projectId, buildingId, position).isEmpty();
    }

    /**
     * 导入设计清单，返回清单id
     */
    private int setDesignlistOrigin(int designlistlogId,String projectId, String buildingId, String buildingpositionId, String productId, String position,
                                     int madeBy, int processStatus){
        return insertProjectService.insertDataToTable("insert into designlist " +
                        "(designlistlogId,projectId,buildingId,buildingpositionId,productId,position,madeBy,processStatus) values " +
                        "(?,?,?,?,?,?,?,?)",String.valueOf(designlistlogId), projectId, buildingId, buildingpositionId, productId, position,
                String.valueOf(madeBy), String.valueOf(processStatus));
    }

    @Transactional
    public DataList queryDesignlistlog(String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from designlist_log_view where userId<>0");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" and projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
        }
        if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
            sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        return queryService.query(sb.toString());
    }

    @Transactional
    public DataList queryDesignlistContain(String designlistlogId){
        return queryService.query("select * from designlist_product_info_view where designlistlogId=?",designlistlogId);
    }

    @Transactional
    public boolean designlistCanRollback(String designlistlogId){
        DataList list = queryService.query("select * from designlist where designlistlogId=?",designlistlogId);
        if(list.isEmpty())
            return false;
        else {
            int processStatusSum = 0;
            for (DataRow dataRow : list)
                processStatusSum = processStatusSum + Integer.parseInt(dataRow.get("processStatus").toString());
            return processStatusSum == 0;
        }
    }
    @Transactional
    public boolean deleteDesignListLog(String designlistlogId,String userId){
        DataList list = queryService.query("select * from designlist where designlistlogId=?",designlistlogId);
        if(list.isEmpty())
            return true;
        else {
            Date date=new Date();
            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (DataRow dataRow : list) {
                String designlistId = dataRow.get("id").toString();
                deleteDesignList(designlistId);
            }
            jo.update("update designlist_log set isrollback=1,userId=\""+userId+
                    "\",time=\""+simpleDateFormat.format(date)+"\" where id=\""+designlistlogId+"\"");
            return true;
        }
    }

    @Transactional
    public boolean deleteDesignList(String designlistId){
        DataList list = queryService.query("select * from query_match_result where designlistId=?",designlistId);
        if(list.isEmpty())
            return true;
        else {
            for (DataRow dataRow : list) {
                String matchResultId = dataRow.get("id").toString();
                int type = Integer.parseInt(dataRow.get("materialMadeBy").toString());
                int storeId = Integer.parseInt(dataRow.get("matchId").toString());
                double count = Double.parseDouble(dataRow.get("count").toString());
                designlistMatchResultBackStore(type, storeId, count);
                designlistDeleteById("match_result", matchResultId);
            }
            designlistDeleteById("designlist",designlistId);
            return true;
        }
    }

    private boolean designlistMatchResultBackStore(int type,int storeId,double count){
        String sql="";
        switch (type){
            case 1:
                sql = "update backproduct_store set countUse=countUse+\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 2:
                sql = "update preprocess_store set countUse=countUse+\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 3:
                sql = "update oldpanel_store set countUse=countUse+\""+count+"\" where id=\""+storeId+"\"";
                break;
            case 4:
                sql = "update material_store set count=count+\""+count+"\" where id=\""+storeId+"\"";
                break;
            default:
                return true;
        }
        jo.update(sql);
        return true;
    }

    private void designlistDeleteById(String tableName, String matchResultId){
        jo.update("delete from "+tableName+" where id=\""+matchResultId+"\"");
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
        }
        if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
            sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        return queryService.query(sb.toString());
    }

    /*
     * 创建领料单时查询工单Detail
     * */
    @Transactional
    public DataList findWorkOrderDetail(String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from work_order_detail_view where status=0 and isActive=1");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" and projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
        }
        if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
            sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
        return queryService.query(sb.toString());
    }

    /*
     * 创建领料单时根据勾选工单生成明细
     * */
    @Transactional
    public DataList createRequisitionPreview(DataList createList, String workOrderDetailId){
        DataList workOrderDetailListList = queryService.query("select * from work_order_detail_list where detailId=?",workOrderDetailId);
        //工单detail_list
        for (DataRow workOrderDetailListRow : workOrderDetailListList) {
            System.out.println("[addRequisitionPreview]");
            System.out.println("(1)createList==now=="+ Arrays.toString(createList.toArray()));
            System.out.println("(2)workOrderDetailListRow==="+workOrderDetailListRow.toString());
            createList = addRequisitionPreview(createList,workOrderDetailListRow,workOrderDetailId);
        }
        return createList;
    }

    @Transactional
    public DataList addRequisitionPreview(DataList createList, DataRow workOrderDetailListRow,String workOrderDetailId){
        String matchResultId = workOrderDetailListRow.get("matchResultId").toString();
        DataList matchResultList = queryService.query("select * from query_match_result where id=?", matchResultId);
        String projectId = matchResultList.get(0).get("projectId").toString();
        String projectName = matchResultList.get(0).get("projectName").toString();
        String buildingId = matchResultList.get(0).get("buildingId").toString();
        String buildingName = matchResultList.get(0).get("buildingName").toString();
        String buildingpositionId = matchResultList.get(0).get("buildingpositionId").toString();
        String buildingpositionName = matchResultList.get(0).get("positionName").toString();
        String type = matchResultList.get(0).get("materialMadeBy").toString();
        String storeId = matchResultList.get(0).get("matchId").toString();
        String count = matchResultList.get(0).get("count").toString();
        String productId = matchResultList.get(0).get("productId").toString();
        String productName = matchResultList.get(0).get("productName").toString();
        String name = "";
        String warehouseName = "";
        DataRow queryRow = new DataRow();
        switch (type){
            case "1":
                queryRow = queryService.query("select * from backproduct_info_store_type where storeId=?").get(0);
                name = queryRow.get("productName").toString();
                warehouseName = queryRow.get("warehouseName").toString();
                break;
            case "2":
                queryRow = queryService.query("select * from preprocess_info_store_type where storeId=?").get(0);
                name = queryRow.get("productName").toString();
                warehouseName = queryRow.get("warehouseName").toString();
                break;
            case "3":
                queryRow = queryService.query("select * from oldpanel_info_store_type where storeId=?").get(0);
                name = queryRow.get("oldpanelName").toString();
                warehouseName = queryRow.get("warehouseName").toString();
                break;
            case "4":
                queryRow = queryService.query("select * from material_store_view where storeId=?").get(0);
                name = queryRow.get("materialName").toString();
                warehouseName = queryRow.get("warehouseName").toString();
                break;
            default:
                break;
        }
        int con = 0;
        if(!createList.isEmpty()) {
            for (DataRow createRow : createList) {
                if((createRow.get("workOrderDetailId").toString().equals(workOrderDetailId))&&
                        (createRow.get("type").toString().equals(type))&&
                        (createRow.get("storeId").toString().equals(storeId))&&
                        (createRow.get("productId").toString().equals(productId))){
                    String newCount = String.valueOf(Double.parseDouble(createRow.get("count").toString())+Double.parseDouble(count));
                    createRow.replace("count",newCount);
                    con++;
                    break;
                }
            }
        }
        if(con==0){
            DataRow newRow = new DataRow();
            newRow.put("workOrderDetailId",workOrderDetailId);
            newRow.put("projectId",projectId);
            newRow.put("projectName",projectName);
            newRow.put("buildingId",buildingId);
            newRow.put("buildingName",buildingName);
            newRow.put("buildingpositionId",buildingpositionId);
            newRow.put("buildingpositionName",buildingpositionName);
            newRow.put("type",type);
            newRow.put("storeId",storeId);
            newRow.put("count",count);
            newRow.put("productId",productId);
            newRow.put("productName",productName);
            newRow.put("name",name);
            newRow.put("warehouseName",warehouseName);
            createList.add(newRow);
        }
        return createList;
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
    public void orderAddRequisitionDetail(int requisitionOrderId,int requisitionOrderLogId,String workOrderDetailId
            ,String type,String storeId,String productId,String count,String projectId,String buildingId,String buildingpositionId) {
        String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
                " values (?,?,?)";
        int requisitionOrderDetailId = insertProjectService.insertDataToTable("insert into requisition_order_detail " +
                        "(requisitionOrderId,workOrderDetailId,type,storeId,productId,countRec,countAll" +
                        ",projectId,buildingId,buildingpositionId) values (?,?,?,?,?,?,?,?,?,?)"
                , String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId, count, count
                , projectId, buildingId, buildingpositionId);
        insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
                String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);

    }

//        DataList workOrderDetailListList = queryService.query("select * from work_order_detail_list where detailId=?",workOrderDetailId);
//        for (DataRow dataRow : workOrderDetailListList) {
//            insertRequisitionDetail(dataRow,requisitionOrderId,requisitionOrderLogId,workOrderDetailId);
//        }
//        String sql_updateStatus = "update work_order_detail set status=1 where id=\""+workOrderDetailId+"\"";
//        jo.update(sql_updateStatus);
//    }

//    @Transactional
//    public void insertRequisitionDetail(DataRow dataRow, int requisitionOrderId,int requisitionOrderLogId,String workOrderDetailId){
//        String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
//                " values (?,?,?)";
//        String sql = "select * from requisition_order_detail where requisitionOrderId=? and workOrderDetailId=?" +
//                " and type=? and storeId=? and productId=?";
//        String matchResultId = dataRow.get("matchResultId").toString();
//        DataList matchResultList = new DataList();
//        matchResultList = queryService.query("select * from query_match_result where id=?", matchResultId);
//        String projectId = matchResultList.get(0).get("projectId").toString();
//        String buildingId = matchResultList.get(0).get("buildingId").toString();
//        String buildingpositionId = matchResultList.get(0).get("buildingpositionId").toString();
//        String type = matchResultList.get(0).get("materialMadeBy").toString();
//        String storeId = matchResultList.get(0).get("matchId").toString();
//        String count = matchResultList.get(0).get("count").toString();
//        String productId = matchResultList.get(0).get("productId").toString();
//        DataList queryList = queryService.query(sql, String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId);
//        if (queryList.isEmpty()) {
//            int requisitionOrderDetailId = insertProjectService.insertDataToTable("insert into requisition_order_detail " +
//                            "(requisitionOrderId,workOrderDetailId,type,storeId,productId,countRec,countAll" +
//                            ",projectId,buildingId,buildingpositionId) values (?,?,?,?,?,?,?,?,?,?)"
//                    , String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId, count, count
//                    , projectId, buildingId, buildingpositionId);
//            insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                    String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
//        } else {
//            int requisitionOrderDetailId = Integer.parseInt(queryList.get(0).get("id").toString());
//            jo.update("update requisition_order_detail set countRec=countRec+\"" + count + "\"" + ",countAll=countAll+\"" + count + "\""
//                    + " where id=\"" + requisitionOrderDetailId + "\"");
//            insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                    String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
//        }
//    }




    /*
     * 查询领料单
     * */
    @Transactional
    public DataList findRequisitionOrder(){
        return queryService.query("select * from requisition_order_view");
    }

    /*
     * 查询领料单细节
     * */
    @Transactional
    public DataList findRequisitionOrderDetail(String requisitionOrderId,String projectId, String buildingId, String buildingpositionId){
        StringBuilder sb = new StringBuilder("select * from requisition_order_detail_view where requisitionOrderId=?");
        if((projectId!=null)&&(projectId.length()!=0)){
            sb.append(" and projectId=\"").append(projectId).append("\"");
            if((buildingId!=null)&&(buildingId.length()!=0))
                sb.append(" and buildingId=\"").append(buildingId).append("\"");
        }
        if((buildingpositionId!=null)&&(buildingpositionId.length()!=0))
            sb.append(" and buildingpositionId=\"").append(buildingpositionId).append("\"");
//        DataList queryList = new DataList();
//        queryList = queryService.query(sb.toString(),requisitionOrderId);
//        for (int i = 0; i < queryList.size(); i++) {
//            int type = Integer.parseInt(queryList.get(i).get("type").toString());
//            String storeId = queryList.get(i).get("storeId").toString();
//            String sql = "";
//            switch (type){
//                case 1:
//                    sql = "select * from backproduct_info_store_type where storeId=?";
//                    break;
//                case 2:
//                    sql = "select * from preprocess_info_store_type where storeId=?";
//                    break;
//                case 3:
//                    sql = "select * from oldpanel_info_store_type where storeId=?";
//                    break;
//                case 4:
//                    sql = "select * from material_store_view where storeId=?";
//                    break;
//            }
//        }
        return queryService.query(sb.toString(),requisitionOrderId);
    }

    /**
     * 领料单内容领料
     */
    @Transactional
    public boolean orderUpdateRequisitionDetail(String requisitionOrderDetailId, String count,int type,String storeId) {
        String sql1 = "update requisition_order_detail set countRec=countRec-\""+count+
                "\" where id=\""+requisitionOrderDetailId+"\"";
        System.out.println(sql1);
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
            default:
                return true;
        }
        jo.update(sql2);
        return true;
    }












}
