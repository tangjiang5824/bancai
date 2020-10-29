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
    private AnalyzeNameService analyzeNameService;
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
        if ((!position.equals("-1"))&&(!isDesignlistPositionValid(projectId, buildingId, position)))
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
        String sql_addLog = "insert into designlist_log (userId,time,isrollback,projectId,buildingId,buildingpositionId) values(?,?,?,?,?,?)";
        int designlistlogId= insertProjectService.insertDataToTable(sql_addLog,userId,analyzeNameService.getTime(),"0"
                ,projectId, buildingId, buildingpositionId);
        for (DataRow dataRow : validList) {
            String productId = dataRow.get("productId").toString();
            String position = dataRow.get("position").toString();
            String figureNum = dataRow.get("figureNum").toString();
            setDesignlistOrigin(designlistlogId, projectId, buildingId, buildingpositionId, String.valueOf(productId), position, figureNum,0, 0);
        }
        return designlistlogId;
    }
    /**
     * 设计清单匹配
     */
    @Transactional
    public boolean matchDesignlist(String projectId, String buildingId, String buildingpositionId) throws ScriptException {
        if(!isProjectPreprocess(projectId)){
            panelMatchService.matchBackProduct(projectId,buildingId,buildingpositionId);
            panelMatchService.matchPreprocess(projectId,buildingId,buildingpositionId);
            panelMatchService.matchOldpanel(projectId,buildingId,buildingpositionId);
            new_panel_match.match(Integer.parseInt(projectId),Integer.parseInt(buildingId),Integer.parseInt(buildingpositionId));
        }else {
            new_panel_match.match(Integer.parseInt(projectId),Integer.parseInt(buildingId),Integer.parseInt(buildingpositionId));
        }
        return panelMatchService.matchError(projectId,buildingId,buildingpositionId);
    }

    private boolean isProjectPreprocess(String projectId){
        DataList list = queryService.query("select * from project where id=?",projectId);
        if(!list.isEmpty()){
            return Integer.parseInt(list.get(0).get("isPreprocess").toString()) != 0;
        }
        return false;
    }

    private boolean isDesignlistPositionValid(String projectId,String buildingId,String position){
        return queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                , projectId, buildingId, position).isEmpty();
    }

    /**
     * 导入设计清单，返回清单id
     */
    private int setDesignlistOrigin(int designlistlogId,String projectId, String buildingId, String buildingpositionId,
                                    String productId, String position, String figureNum,int madeBy, int processStatus){
        return insertProjectService.insertDataToTable("insert into designlist " +
                        "(designlistlogId,projectId,buildingId,buildingpositionId,productId,position,figureNum,madeBy,processStatus) values " +
                        "(?,?,?,?,?,?,?,?,?)",String.valueOf(designlistlogId), projectId, buildingId, buildingpositionId, productId,
                position, figureNum,String.valueOf(madeBy), String.valueOf(processStatus));
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
        boolean b = true;
        DataList list = queryService.query("select * from designlist where designlistlogId=?",designlistlogId);
        if(!list.isEmpty()){
            for (DataRow dataRow : list) {
                String designlistId = dataRow.get("id").toString();
                b=b&deleteDesignList(designlistId);
            }
            jo.update("update designlist_log set isrollback=1,userId=\""+userId+
                    "\",time=\""+analyzeNameService.getTime()+"\" where id=\""+designlistlogId+"\"");
        }
        return b;
    }

    @Transactional
    public boolean deleteDesignList(String designlistId){
        boolean b =true;
        DataList list = queryService.query("select * from query_match_result where designlistId=?",designlistId);
        if(!list.isEmpty()){
            for (DataRow dataRow : list) {
                String matchResultId = dataRow.get("id").toString();
                int type = Integer.parseInt(dataRow.get("materialMadeBy").toString());
                int storeId = Integer.parseInt(dataRow.get("matchId").toString());
                double count = Double.parseDouble(dataRow.get("count").toString());
                b=b&designlistMatchResultBackStore(type, storeId, count);
                designlistDeleteById("match_result", matchResultId);
            }
            designlistDeleteById("designlist",designlistId);
        }
        return b;
    }

    @Transactional
    public boolean designlistDeleteMatchResult(JSONArray jsonArray){
        boolean b = true;
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String matchResultId = jsonTemp.get("id").toString();
            double count = Double.parseDouble(jsonTemp.get("count").toString());
            int storeId = Integer.parseInt(jsonTemp.get("matchId").toString());
            int type = Integer.parseInt(jsonTemp.get("materialMadeBy").toString());
            designlistDeleteById("match_result", matchResultId);
            b=b&designlistMatchResultBackStore(type, storeId, count);
        }
        return b;
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
                sql = "update material_store set countUse=countUse+\""+count+"\" where id=\""+storeId+"\"";
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
    public DataList getDesignlistByPosition(String projectId,String buildingId,String position){
        return queryService.query("select * from designlist_product_info_view where projectId=? and buildingId=? and position=?"
                ,projectId,buildingId,position);
    }

    @Transactional
    public DataList addMatchResultBackErrorList(JSONArray jsonArray,String isCompleteMatch,String designlistId){
        DataList errorList = new DataList();
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String matchResultId = jsonTemp.get("id").toString();
            if(!matchResultId.equals("-1")) {
                jo.update("update match_result set isCompleteMatch=\""+isCompleteMatch+"\" where id=\""+matchResultId+"\"");
                continue;
            }
            String count = jsonTemp.get("count")+"";
            String storeId = jsonTemp.get("storeId").toString();
            String name = jsonTemp.get("name").toString();
            String type = jsonTemp.get("type").toString();
            String typeName = jsonTemp.get("typeName").toString();
            if((analyzeNameService.isStringNotNonnegativeNumber(count))||(Double.parseDouble(count)==0)){
                addMatchResultErrorRow(errorList,name,type,count,"数量输入错误");
                continue;
            }
            DataList infoList = queryService.query("select * from "+typeName+"_info_store_type where storeId=?",storeId);
            if(infoList.isEmpty()){
                addMatchResultErrorRow(errorList,name,type,count,"找不到该库存id");
                continue;
            }
            double countUse = Double.parseDouble(infoList.get(0).get("countUse").toString());
            if(Double.parseDouble(count)>countUse){
                addMatchResultErrorRow(errorList,name,type,count,"库存数量不足");
                continue;
            }
            countUse = countUse-Double.parseDouble(count);
            updateStoreCountUse(typeName,countUse,storeId);
            if(!addChangeMatchResult(designlistId,storeId,count,name,type,isCompleteMatch))
                addMatchResultErrorRow(errorList,name,type,count,"添加匹配结果失败");
        }
        return errorList;
    }

    private void addMatchResultErrorRow(DataList errorList, String name, String type, String count,String errorType){
        DataRow errorRow = new DataRow();
        errorRow.put("name",name);
        errorRow.put("type",type);
        errorRow.put("count",count);
        errorRow.put("errorType",errorType);
        errorList.add(errorRow);
    }
    private void updateStoreCountUse(String storeName, double countUse, String id){
        jo.update("update "+storeName+"_store set countUse=\"" + countUse + "\" where id=\"" + id+"\"");
    }
    private boolean addChangeMatchResult(String designlistId,String storeId,String count,String name,String type,String isCompleteMatch){
        return insertProjectService.insertIntoTableBySQL("insert into match_result (designlistId,matchId,count,name,madeBy,isCompleteMatch) values (?,?,?,?,?,?)",
                designlistId,storeId,count,name,type,isCompleteMatch);
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
     * 创建领料单
     * */
    @Transactional
    public boolean createRequisition(String workOrderDetailIdString, String userId, String operator){
        //requisition_order
        //requisition_order_log
        //fori:requisition_order_detail,requisition_order_logdetail
        String sql_query = "select id,type,storeId,productId,projectId,buildingId,buildingpositionId,isCompleteMatch,sum(singleNum) as count from " +
                "requisition_create_preview_work_order_match_store where workOrderDetailId in ("+workOrderDetailIdString
                +") group by workOrderDetailId,type,storeId,isCompleteMatch";
        DataList insertList = queryService.query(sql_query);
        String projectId = insertList.get(0).get("projectId").toString();
        int requisitionOrderId = createRequisitionOrderBackId(userId,operator,projectId);
        int requisitionOrderLogId = requisitionOrderAddLogBackId("1",String.valueOf(requisitionOrderId),userId,operator);
        String sql_updateStatus = "update work_order_detail set status=1 where id=\"";
        boolean b = true;
        for (DataRow dataRow : insertList) {
            String workOrderDetailId = dataRow.get("id").toString();
            String type = dataRow.get("type").toString();
            String storeId = dataRow.get("storeId").toString();
            String productId = dataRow.get("productId").toString();
            String count = dataRow.get("count").toString();
            String buildingId = dataRow.get("buildingId").toString();
            String buildingpositionId = dataRow.get("buildingpositionId").toString();
            String isCompleteMatch = dataRow.get("isCompleteMatch").toString();
            int requisitionOrderDetailId = createRequisitionOrderDetailBackId(String.valueOf(requisitionOrderId),workOrderDetailId,
                    type,storeId,productId,count,buildingId,buildingpositionId,isCompleteMatch);
            jo.update(sql_updateStatus+workOrderDetailId+"\"");
            b = b&requisitionOrderAddLogDetail(String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
        }
        return b;
    }
    private int createRequisitionOrderBackId(String userId,String operator,String projectId){
        return insertProjectService.insertDataToTable("insert into requisition_order (userId,operator,time,projectId,status) values (?,?,?,?,?)",
                userId,operator,analyzeNameService.getTime(),projectId,"0");
    }
    private int createRequisitionOrderDetailBackId(String requisitionOrderId,String workOrderDetailId,String type, String storeId,
                                                   String productId,String count,String buildingId,String buildingpositionId,String isCompleteMatch){
        return insertProjectService.insertDataToTable("insert into requisition_order_detail (requisitionOrderId,workOrderDetailId," +
                        "type,storeId,productId,countRec,countAll,buildingId,buildingpositionId,isCompleteMatch) values (?,?,?,?,?,?,?,?,?,?)",
                requisitionOrderId, workOrderDetailId, type, storeId, productId, count, count, buildingId, buildingpositionId,isCompleteMatch);
    }
    private int requisitionOrderAddLogBackId(String type, String requisitionOrderId, String userId, String operator){
        return insertProjectService.insertDataToTable("insert into requisition_order_log (type,requisitionOrderId,userId,time,operator) values(?,?,?,?,?)",
                type,requisitionOrderId,userId,analyzeNameService.getTime(),operator);
    }
    private boolean requisitionOrderAddLogDetail(String requisitionOrderLogId,String requisitionOrderDetailId,String count){
        return insertProjectService.insertIntoTableBySQL("insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count) values (?,?,?)",
                requisitionOrderLogId,requisitionOrderDetailId,count);
    }
    /*
     * 创建领料单时根据勾选工单生成明细
     * */
//    @Transactional
//    public DataList createRequisitionPreview(DataList createList, String workOrderDetailId){
//        DataList workOrderDetailListList = queryService.query("select * from work_order_detail_list where detailId=?",workOrderDetailId);
//        //工单detail_list
//        for (DataRow workOrderDetailListRow : workOrderDetailListList) {
////            System.out.println("[addRequisitionPreview]");
////            System.out.println("(1)createList==now=="+ Arrays.toString(createList.toArray()));
////            System.out.println("(2)workOrderDetailListRow==="+workOrderDetailListRow.toString());
//            createList = addRequisitionPreview(createList,workOrderDetailListRow,workOrderDetailId);
//        }
//        return createList;
//    }

//    @Transactional
//    public DataList addRequisitionPreview(DataList createList, DataRow workOrderDetailListRow,String workOrderDetailId){
//        String matchResultId = workOrderDetailListRow.get("matchResultId").toString();
//        DataList matchResultList = queryService.query("select * from query_match_result where id=?", matchResultId);
//        String projectId = matchResultList.get(0).get("projectId").toString();
//        String projectName = matchResultList.get(0).get("projectName").toString();
//        String buildingId = matchResultList.get(0).get("buildingId").toString();
//        String buildingName = matchResultList.get(0).get("buildingName").toString();
//        String buildingpositionId = matchResultList.get(0).get("buildingpositionId").toString();
//        String buildingpositionName = matchResultList.get(0).get("positionName").toString();
//        String type = matchResultList.get(0).get("materialMadeBy").toString();
//        String storeId = matchResultList.get(0).get("matchId").toString();
//        String count = matchResultList.get(0).get("count").toString();
//        String productId = matchResultList.get(0).get("productId").toString();
//        String productName = matchResultList.get(0).get("productName").toString();
//        int con = 0;
//        if(!createList.isEmpty()) {
//            for (DataRow createRow : createList) {
//                if((createRow.get("workOrderDetailId").toString().equals(workOrderDetailId))&&
//                        (createRow.get("type").toString().equals(type))&&
//                        (createRow.get("storeId").toString().equals(storeId))&&
//                        (createRow.get("productId").toString().equals(productId))){
//                    String newCount = String.valueOf(Double.parseDouble(createRow.get("count").toString())+Double.parseDouble(count));
//                    createRow.replace("count",newCount);
//                    con++;
//                    break;
//                }
//            }
//        }
//        if(con==0){
//            String name = "";
//            String warehouseName = "";
//            DataRow queryRow = new DataRow();
//            switch (type){
//                case "1":
//                    queryRow = queryService.query("select * from backproduct_info_store_type where storeId=?",storeId).get(0);
//                    name = queryRow.get("productName").toString();
//                    warehouseName = queryRow.get("warehouseName").toString();
//                    break;
//                case "2":
//                    queryRow = queryService.query("select * from preprocess_info_store_type where storeId=?",storeId).get(0);
//                    name = queryRow.get("productName").toString();
//                    warehouseName = queryRow.get("warehouseName").toString();
//                    break;
//                case "3":
//                    queryRow = queryService.query("select * from oldpanel_info_store_type where storeId=?",storeId).get(0);
//                    name = queryRow.get("oldpanelName").toString();
//                    warehouseName = queryRow.get("warehouseName").toString();
//                    break;
//                case "4":
//                    queryRow = queryService.query("select * from material_store_view where storeId=?",storeId).get(0);
//                    name = queryRow.get("materialName").toString();
//                    warehouseName = queryRow.get("warehouseName").toString();
//                    break;
//                default:
//                    break;
//            }
//            DataRow newRow = new DataRow();
//            newRow.put("workOrderDetailId",workOrderDetailId);
//            newRow.put("projectId",projectId);
//            newRow.put("projectName",projectName);
//            newRow.put("buildingId",buildingId);
//            newRow.put("buildingName",buildingName);
//            newRow.put("buildingpositionId",buildingpositionId);
//            newRow.put("buildingpositionName",buildingpositionName);
//            newRow.put("type",type);
//            newRow.put("storeId",storeId);
//            newRow.put("count",count);
//            newRow.put("productId",productId);
//            newRow.put("productName",productName);
//            newRow.put("name",name);
//            newRow.put("warehouseName",warehouseName);
//            createList.add(newRow);
//        }
//        return createList;
//    }


    /**
     * 添加领料单
     */
//    @Transactional
//    public int[] orderAddRequisition(String userId, String operator, String time) {
//        int requisitionOrderId = insertProjectService.insertDataToTable("insert into requisition_order (userId,operator,time) values (?,?,?)"
//                , userId, operator, time);
//        String sql_addLog = "insert into requisition_order_log (type,requisitionOrderId,userId,time,operator) values(?,?,?,?,?)";
//        int requisitionOrderLogId= insertProjectService.insertDataToTable(sql_addLog, "1"
//                , String.valueOf(requisitionOrderId),userId,time,operator);
//        return new int[] {requisitionOrderId,requisitionOrderLogId};
//    }

    /**
     * 添加领料单内容
     */
//    @Transactional
//    public void orderAddRequisitionDetail(int requisitionOrderId,int requisitionOrderLogId,String workOrderDetailId
//            ,String type,String storeId,String productId,String count,String projectId,String buildingId,String buildingpositionId) {
//        String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
//                " values (?,?,?)";
//        String sql_updateWorkOrderDetail = "update work_order_detail set status=1 where id=\""+workOrderDetailId+"\"";
//        int requisitionOrderDetailId = insertProjectService.insertDataToTable("insert into requisition_order_detail " +
//                        "(requisitionOrderId,workOrderDetailId,type,storeId,productId,countRec,countAll" +
//                        ",projectId,buildingId,buildingpositionId) values (?,?,?,?,?,?,?,?,?,?)"
//                , String.valueOf(requisitionOrderId), workOrderDetailId, type, storeId, productId, count, count
//                , projectId, buildingId, buildingpositionId);
//        insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                String.valueOf(requisitionOrderLogId), String.valueOf(requisitionOrderDetailId), count);
//        jo.update(sql_updateWorkOrderDetail);
//    }

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




    /**
     * 领料单内容领料
     */
    @Transactional
    public void finishRequisitionOrder(JSONArray jsonArray, String requisitionOrderId, String projectId, String operator, String userId){
        String type = jsonArray.getJSONObject(0).get("type")+"";
        String origin = jsonArray.getJSONObject(0).get("origin")+"";
        String store = "";
        switch (type){
            case "1":
                store = "backproduct";
                break;
            case "2":
                store = "preprocess";
                break;
            case "3":
                store = "oldpanel";
                break;
            case "4":
                store = "material";
                break;
            default:
                break;
        }
        //order log
        //store log
        if(origin.equals("1")){
            int requisitionOrderLogId = requisitionOrderAddLogBackId("2",requisitionOrderId,userId,operator);
            int storeLogId = outboundStoreAddLogBackId(store,userId,operator,projectId);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String requisitionOrderDetailId=jsonTemp.get("requisitionOrderDetailId")+"";
                String count = (jsonTemp.get("count")+"").trim();
                String storeId =  jsonTemp.get("storeId")+"";
                String infoId = jsonTemp.get("infoId")+"";
                String buildingId =  jsonTemp.get("buildingId")+"";
                String buildingpositionId = jsonTemp.get("buildingpositionId")+"";
                //store count reduce
                //order count reduce
                //store log detail
                //order log detail
                outboundStoreCountUpdate(store,storeId,count);
                outboundRequisitionCountUpdate(requisitionOrderDetailId,count);
                outboundStoreAddLogDetail(type,count,buildingId,buildingpositionId,infoId,storeId,String.valueOf(storeLogId));
                outboundRequisitionAddLogDetail(String.valueOf(requisitionOrderLogId),requisitionOrderDetailId,count);
            }
        }else if(origin.equals("2")){
            int storeLogId = outboundStoreAddLogBackId(store,userId,operator,projectId);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String requisitionOrderDetailId=jsonTemp.get("requisitionOrderDetailId")+"";
                String count = (jsonTemp.get("count")+"").trim();
                String storeId =  jsonTemp.get("storeId")+"";
                String infoId = jsonTemp.get("infoId")+"";
                String buildingId =  jsonTemp.get("buildingId")+"";
                String buildingpositionId = jsonTemp.get("buildingpositionId")+"";
                outboundStoreCountUpdate(store,storeId,count);
                outboundOverRequisitionCountUpdate(requisitionOrderDetailId,count);
                outboundStoreAddLogDetail(type,count,buildingId,buildingpositionId,infoId,storeId,String.valueOf(storeLogId));
            }
        }

    }

    /**
     * 原材料自定义领料单领料
     */
    @Transactional
    public void materialRequisition(JSONArray jsonArray, String requisitionOrderId, String projectId, String operator, String userId){
//        String type = jsonArray.getJSONObject(0).get("type")+"";
        String store = "material";
//        switch (type){
//            case "1":
//                store = "backproduct";
//                break;
//            case "2":
//                store = "preprocess";
//                break;
//            case "3":
//                store = "oldpanel";
//                break;
//            case "4":
//                store = "material";
//                break;
//        }
        //order log
        //store log
        int requisitionOrderLogId = requisitionOrderAddLogBackId("2",requisitionOrderId,userId,operator);
        int storeLogId = outboundStoreAddLogBackId("material",userId,operator,projectId);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String requisitionOrderDetailId=jsonTemp.get("requisitionOrderDetailId")+"";
            String count = (jsonTemp.get("count")+"").trim();
            String storeId =  jsonTemp.get("materialStoreId")+"";
            String infoId = jsonTemp.get("infoId")+"";
            String buildingId =  jsonTemp.get("buildingId")+"";
            String buildingpositionId = jsonTemp.get("buildingpositionId")+"";
            String countRec=jsonTemp.get("countRec")+"";
            //store count reduce
            //order count reduce
            //store log detail
            //order log detail
            outboundStoreCountUpdate(store,storeId,count);
            outboundRequisitionCountUpdate(requisitionOrderDetailId,countRec);
            outboundStoreAddLogDetail("4",count,buildingId,buildingpositionId,infoId,storeId,String.valueOf(storeLogId));
            outboundRequisitionAddLogDetail(String.valueOf(requisitionOrderLogId),requisitionOrderDetailId,countRec);
        }
    }


    private int outboundStoreAddLogBackId(String store, String userId, String operator,String projectId){
        return insertProjectService.insertDataToTable("insert into " + store +
                "_log (type,time,userId,operator,projectId,isrollback) values (?,?,?,?,?,?)",
                "1",analyzeNameService.getTime(),userId,operator,projectId,"1");
    }
    private void outboundStoreCountUpdate(String store, String storeId, String count){
        jo.update("update " + store + "_store set countStore=countStore-\"" + count + "\" where id=\"" + storeId + "\"");
    }
    private void outboundRequisitionCountUpdate(String requisitionOrderDetailId,String count){
        jo.update("update requisition_order_detail set countRec=countRec-\""+count+
                "\" where id=\""+requisitionOrderDetailId+"\"");
    }
    private void outboundOverRequisitionCountUpdate(String requisitionOrderDetailId,String count){
        jo.update("update over_requisition_order_detail set countRec=countRec-\""+count+
                "\" where id=\""+requisitionOrderDetailId+"\"");
    }
    private boolean outboundStoreAddLogDetail(String type,String count,String buildingId, String buildingpositionId,
                                              String infoId, String storeId, String storeLogId){
        String store = "";
        String info = "";
        switch (type){
            case "1":
                store = "backproduct";
                info = "product";
                break;
            case "2":
                store = "preprocess";
                info = "product";
                break;
            case "3":
                store = "oldpanel";
                info = "oldpanel";
                break;
            case "4":
                store = "material";
                info = "material";
                break;
        }
        return insertProjectService.insertIntoTableBySQL("insert into "+store+"_logdetail (isrollback,count,buildingId,buildingpositionId,"+
                info+"Id,"+store+"storeId,"+store+"logId) values (?,?,?,?,?,?,?)",
                "1",count,buildingId,buildingpositionId,infoId,storeId,storeLogId);
    }
    private boolean outboundRequisitionAddLogDetail(String requisitionOrderLogId,String requisitionOrderDetailId,String count){
        return insertProjectService.insertIntoTableBySQL("insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count) values (?,?,?)",
                requisitionOrderLogId,requisitionOrderDetailId,count);
    }
//    @Transactional
//    public boolean orderUpdateRequisitionDetail(String requisitionOrderDetailId, String count,int type,String storeId) {
//        String sql1 = ;
//        System.out.println(sql1);
//        jo.update(sql1);
//        String sql2="";
//        switch (type){
//            case 1:
//                sql2 = "update backproduct_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
//                break;
//            case 2:
//                sql2 = "update preprocess_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
//                break;
//            case 3:
//                sql2 = "update oldpanel_store set countStore=countStore-\""+count+"\" where id=\""+storeId+"\"";
//                break;
//            case 4:
//                sql2 = "update material_store set count=count-\""+count+"\" where id=\""+storeId+"\"";
//                break;
//            default:
//                return true;
//        }
//        jo.update(sql2);
//        return true;
//    }


    /*
     * 创建退料单
     * */
    @Transactional
    public boolean createReturnOrder(JSONArray jsonArray,String type,String projectId,String buildingId,String description,String operator,String userId){
        boolean b = true;
        int orderId = addReturnOrderBackId(type,projectId,buildingId,description,operator,userId);
        int logId = addReturnOrderLogBackId(String.valueOf(orderId),userId,operator,"1");
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String storeId = jsonTemp.get("storeId")+"";
            String name=jsonTemp.get("name")+"";
            String backWarehouseName = (jsonTemp.get("backWarehouseName")+"").trim();
            String warehouseName =  jsonTemp.get("warehouseName")+"";
            String count = jsonTemp.get("count")+"";
            String unitWeight =  jsonTemp.get("unitWeight")+"";
            String unitArea = jsonTemp.get("unitArea")+"";
            String totalWeight = jsonTemp.get("totalWeight")+"";
            String totalArea = jsonTemp.get("totalArea")+"";
            String inventoryUnit = jsonTemp.get("inventoryUnit")+"";
            String remark = jsonTemp.get("remark")+"";
            int detailId = addReturnOrderDetailBackId(String.valueOf(orderId),storeId,name,backWarehouseName,warehouseName,count,unitWeight,unitArea,
                    totalWeight,totalArea,inventoryUnit,remark);
            b = b&addReturnOrderLogDetail(String.valueOf(logId),String.valueOf(detailId),count);
        }
        return b;
    }

    private int addReturnOrderBackId(String type,String projectId,String buildingId,String description,String operator,String userId){
        return insertProjectService.insertDataToTable("insert into return_order (type,projectId,buildingId,description,operator,userId,status,time) values (?,?,?,?,?,?,?,?)"
                , type,projectId,buildingId,description,operator,userId,"0",analyzeNameService.getTime());
    }
    private int addReturnOrderLogBackId(String orderId,String userId,String operator,String type){
        return insertProjectService.insertDataToTable("insert into return_order_log (returnOrderId,userId,operator,type,time) values (?,?,?,?,?)"
                , orderId,userId,operator,type,analyzeNameService.getTime());
    }
    private int addReturnOrderDetailBackId(String orderId,String storeId,String name,String backWarehouseName,String warehouseName,String count,
                                              String unitWeight ,String unitArea,String totalWeight,String totalArea,String inventoryUnit, String remark){
        return insertProjectService.insertDataToTable("insert into return_order_detail (returnOrderId,storeId,name,backWarehouseName,warehouseName" +
                ",countAll,countReturn,unitWeight,unitArea,totalWeight,totalArea,inventoryUnit,remark) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                orderId,storeId,name,backWarehouseName,warehouseName,count,count,unitWeight,unitArea,
                totalWeight,totalArea,inventoryUnit,remark);
    }
    private boolean addReturnOrderLogDetail(String logId,String detailId,String count){
        return insertProjectService.insertIntoTableBySQL("insert into return_order_logdetail (returnOrderLogId,returnOrderDetailId,count) values (?,?,?)",
                logId,detailId,count);
    }

    /**
     * 退料单内容退料
     */
    @Transactional
    public boolean finishReturnOrder(JSONArray jsonArray,String type, String returnOrderId,String operator, String userId){
        String store = "";
        boolean b = true;
        DataRow orderRow = queryService.query("select * from return_order where id=?",returnOrderId).get(0);
        String projectId = orderRow.get("projectId").toString();
        String buildingId = orderRow.get("buildingId").toString();
        String description = orderRow.get("description").toString();
        switch (type){
            case "1":
                store = "backproduct";
                break;
            case "2":
                store = "preprocess";
                break;
            case "3":
                store = "oldpanel";
                break;
            case "4":
                store = "material";
                break;
        }
        //order logszer
        //store log
        int returnOrderLogId = addReturnOrderLogBackId(returnOrderId,userId,operator,"2");
        int storeLogId = backStoreAddLogBackId(store,userId,operator,projectId,buildingId,description);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String returnOrderDetailId=jsonTemp.get("returnOrderDetailId")+"";
            String count = (jsonTemp.get("count")+"").trim();
            String storeId =  jsonTemp.get("storeId")+"";
            String infoId = jsonTemp.get("infoId")+"";
            String backWarehouseName = jsonTemp.get("backWarehouseName")+"";
            String remark = jsonTemp.get("remark")+"";
            //store count reduce
            //order count reduce
            //store log detail
            //order log detail
            if(!storeId.equals("0")){
                backStoreCountUpdate(store,storeId,count);
                updateReturnOrderDetailCountReturn(returnOrderDetailId,count);
            }else {
                String totalArea =  jsonTemp.get("totalArea")+"";
                String totalWeight =  jsonTemp.get("totalWeight")+"";
                String warehouseName = jsonTemp.get("warehouseName")+"";
                storeId = String.valueOf(backStoreCountInsert(store,count,infoId,totalArea,totalWeight,warehouseName));
                updateReturnOrderDetailCountReturnAndStoreId(returnOrderDetailId,count,storeId);
            }
            backStoreAddLogDetail(type,count,backWarehouseName,remark,infoId,storeId,String.valueOf(storeLogId));
            b=b&addReturnOrderLogDetail(String.valueOf(returnOrderLogId),returnOrderDetailId,count);
        }
        return b;
    }
    private int backStoreAddLogBackId(String store, String userId, String operator,String projectId,String buildingId,String description){
        return insertProjectService.insertDataToTable("insert into " + store +
                        "_log (type,time,userId,operator,projectId,buildingId,description,isrollback) values (?,?,?,?,?,?,?,?)",
                "2",analyzeNameService.getTime(),userId,operator,projectId,buildingId,description,"1");
    }
    private void backStoreCountUpdate(String store, String storeId, String count){
        jo.update("update " + store + "_store set countStore=countStore+\"" + count +
                "\",countUse=countUse+\""+count+"\" where id=\"" + storeId + "\"");
    }
    private int backStoreCountInsert(String store,String count,String infoId,String totalArea,String totalWeight,String warehouseName){
        return insertProjectService.insertDataToTable("insert into "+store+"_store ("+store+
                "Id,countUse,countStore,totalArea,totalWeight,warehouseName) values (?,?,?,?,?,?)"
                ,infoId,count,count,totalArea,totalWeight,warehouseName);

    }
    private void updateReturnOrderDetailCountReturn(String detailId,String count){
        jo.update("update return_order_detail set countReturn=countReturn-\""+Double.parseDouble(count)+ "\" where id=\""+detailId+"\"");
    }
    private void updateReturnOrderDetailCountReturnAndStoreId(String detailId,String count,String storeId){
        jo.update("update return_order_detail set countReturn=countReturn-\""+Double.parseDouble(count)+ "\",storeId=\""+storeId
                +"\" where id=\""+detailId+"\"");
    }
    private boolean backStoreAddLogDetail(String type,String count,String backWarehouseName, String remark,
                                              String infoId, String storeId, String storeLogId){
        String store = "";
        String info = "";
        switch (type){
            case "1":
                store = "backproduct";
                info = "product";
                break;
            case "2":
                store = "preprocess";
                info = "product";
                break;
            case "3":
                store = "oldpanel";
                info = "oldpanel";
                break;
            case "4":
                store = "material";
                info = "material";
                break;
        }
        return insertProjectService.insertIntoTableBySQL("insert into "+store+"_logdetail (isrollback,count,"+
                        info+"Id,"+store+"storeId,"+store+"logId,backWarehouseName,remark) values (?,?,?,?,?,?,?)",
                "1",count,infoId,storeId,storeLogId,backWarehouseName,remark);
    }


    /*
     * 创建超领单
     * */
    @Transactional
    public boolean createOverReqOrder(JSONArray jsonArray,String projectId,String buildingId,String buildingpositionId,String description,String operator,String userId){
        int orderId = addOverReqBackId(projectId,buildingId,buildingpositionId,description,operator,userId);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String storeId = jsonTemp.get("storeId")+"";
            String count = jsonTemp.get("count")+"";
            jo.update("update material_store set countUse=countUse-\""+count+"\" where id=\""+storeId+"\"");
            int detailId = addOverReqOrderDetailBackId(String.valueOf(orderId),storeId,count,buildingId,buildingpositionId);
        }
        return true;
    }
    private int addOverReqBackId(String projectId,String buildingId,String buildingpositionId,String description,String operator,String userId){
        return insertProjectService.insertDataToTable("insert into over_requisition_order (projectId,buildingId,buildingpositionId,description,operator,userId,status,time) values (?,?,?,?,?,?,?,?)"
                , projectId,buildingId,buildingpositionId,description,operator,userId,"0",analyzeNameService.getTime());
    }
    private int addOverReqOrderDetailBackId(String orderId,String storeId,String count,String buildingId,String buildingpositionId){
        return insertProjectService.insertDataToTable("insert into over_requisition_order_detail (overReqOrderId,storeId,countAll,countRec,type,buildingId,buildingpositionId) values (?,?,?,?,?,?,?)",
                orderId,storeId,count,count,"4",buildingId,buildingpositionId);
    }








}
