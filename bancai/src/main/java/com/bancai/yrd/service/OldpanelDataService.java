package com.bancai.yrd.service;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.vo.WebResponse;

@Service
public class OldpanelDataService extends BaseService {
    private Logger log = Logger.getLogger(OldpanelDataService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;

    @Transactional
    public DataList oldpanelAddInsertRowToFormatList(DataList insertList,String typeId,String format){
        DataRow row = new DataRow();
        row.put("oldpanelTypeId",typeId);
        row.put("oldpanelFormat",format);
        insertList.add(row);
        return insertList;
    }

    @Transactional
    public DataList oldpanelAddInsertRowToInfoList(DataList insertList,String oldpanelFormatId,String classificatioanId,String oldpanelTypeId,String oldpanelName,String inventoryUnit,
                                                  String unitWeight,String unitArea,String remark,String mValue,String nValue,String pValue,
                                                  String aValue,String bValue,String mAngle,String nAngle,String pAngle,
                                                  String suffix){
        DataRow row = new DataRow();
        row.put("oldpanelFormatId",oldpanelFormatId);
        row.put("oldpanelTypeId",oldpanelTypeId);
        row.put("classificatioanId",classificatioanId);
        row.put("oldpanelName",oldpanelName);
        row.put("inventoryUnit",inventoryUnit);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        row.put("remark",remark);
        if(suffix.length()==0)
            suffix = "null";
        String values = mValue + "%" + nValue + "%" + pValue + "%" + aValue + "%" + bValue + "%" + mAngle +
                "%" + nAngle + "%" + pAngle + "%" + suffix;
        row.put("values", values);
        insertList.add(row);
        return insertList;
    }
    /**
     * 添加新的旧板format
     */
    @Transactional
    public boolean oldpanelAddNewFormat(DataList insertList,String userId) {
        boolean b = true;
        for (DataRow dataRow : insertList) {
            String typeId = dataRow.get("oldpanelTypeId").toString();
            String format = dataRow.get("oldpanelFormat").toString();
            int formatId = insertProjectService.insertDataToTable("insert into oldpanel_format (oldpanelTypeId,oldpanelFormat) values (?,?)",
                    typeId,format);
            b = b&insertProjectService.insertIntoTableBySQL("insert into format_log (type,formatId,userId,time) values(?,?,?,?)",
                    "2",String.valueOf(formatId),userId,analyzeNameService.getTime());
        }
        return b;
    }

    /**
     * 添加新的旧板info
     */
    @Transactional
    public boolean oldpanelAddNewInfo(DataList insertList,String userId){
        boolean b = true;
        int logId = oldpanelAddLogBackId("6","1",userId,null,null,null,"");
        for (DataRow dataRow : insertList) {
            String oldpanelFormatId = dataRow.get("oldpanelFormatId").toString();
            String oldpanelTypeId = dataRow.get("oldpanelTypeId").toString();
            String classificatioanId = dataRow.get("classificatioanId").toString();
            String oldpanelName = dataRow.get("oldpanelName").toString();
            String inventoryUnit = dataRow.get("inventoryUnit").toString();
            String unitWeight = dataRow.get("unitWeight").toString();
            String unitArea = dataRow.get("unitArea").toString();
            String remark = dataRow.get("remark").toString();
            String[] values = dataRow.get("values").toString().split("%");
            String mValue = null;
            String nValue = null;
            String pValue = null;
            String aValue = null;
            String bValue = null;
            if((!values[0].equals("null"))&&(values[0].length()!=0))
                mValue = values[0];
            if((!values[1].equals("null"))&&(values[1].length()!=0))
                nValue = values[1];
            if((!values[2].equals("null"))&&(values[2].length()!=0))
                pValue = values[2];
            if((!values[3].equals("null"))&&(values[3].length()!=0))
                aValue = values[3];
            if((!values[4].equals("null"))&&(values[4].length()!=0))
                bValue = values[4];
            if(values[8].equals("null"))
                values[8] = "";
//            System.out.println(dataRow.get("values").toString());
            int oldpanelId = insertProjectService.insertDataToTable("insert into oldpanel_info (oldpanelName,inventoryUnit,unitWeight,unitArea,remark," +
                            "oldpanelFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,userId) " +
                            "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    oldpanelName,inventoryUnit,unitWeight,unitArea,remark,oldpanelFormatId,mValue,nValue,pValue,aValue,bValue
                    ,values[5],values[6],values[7],values[8],userId);
            String partNo = analyzeNameService.oldpanelPartNoGenerator(oldpanelTypeId,String.valueOf(oldpanelId),classificatioanId);
            jo.update("update oldpanel_info set partNo=\""+partNo+"\" where id=\""+oldpanelId+"\"");
            b = b&insertProjectService.insertIntoTableBySQL("insert into oldpanel_logdetail (oldpanellogId,oldpanelId) values (?,?)",
                    String.valueOf(logId), String.valueOf(oldpanelId));
        }
        return b;
    }

    @Transactional
    public DataList oldpanelAddInsertRowToInboundList(DataList insertList,String oldpanelId,String warehouseName,String count,String remark,String unitWeight,String unitArea){
        DataRow row = new DataRow();
        row.put("oldpanelId",oldpanelId);
        row.put("warehouseName",warehouseName);
        row.put("count",count);
        row.put("remark",remark);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        insertList.add(row);
        return insertList;
    }
    @Transactional
    public DataList oldpanelAddInsertRowToBackList(DataList insertList,String oldpanelId,String backWarehouseName,String warehouseName,String count,String remark,String unitWeight,String unitArea){
        DataRow row = new DataRow();
        row.put("oldpanelId",oldpanelId);
        row.put("backWarehouseName",backWarehouseName);
        row.put("warehouseName",warehouseName);
        row.put("count",count);
        row.put("remark",remark);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        insertList.add(row);
        return insertList;
    }

    /*
     * 入库
     * */
    @Transactional
    public boolean insertOldpanelDataToStore(DataList insertList,String userId,String operator){
        boolean b = true;
        int logId = oldpanelAddLogBackId("0","0",userId,operator,null,null,"");
        if(logId==0)
            return false;
        for (DataRow dataRow : insertList) {
            b = b&oldpanelAddStoreAndLogDetailByRow(dataRow,String.valueOf(logId),1);
        }
        return b;
    }
    /*
     * 旧板入库撤销
     * */
    @Transactional
    public boolean rollbackOldpanelAddData(String oldpanellogId,String operator,String userId,String projectId,String buildingId){
        boolean b = true;
        analyzeNameService.updateIsrollbackToOneById("oldpanel_log",oldpanellogId);
        int logId = oldpanelAddLogBackId("3","1",userId,operator,projectId,buildingId,"");
        DataList dataList = queryService.query("select * from oldpanel_logdetail where oldpanellogId=? and isrollback=0",oldpanellogId);
        for (DataRow dataRow : dataList) {
            String detailId = dataRow.get("id").toString();
            String storeId = dataRow.get("oldpanelstoreId").toString();
            String count = dataRow.get("count").toString();
            analyzeNameService.updateIsrollbackToOneById("oldpanel_logdetail",detailId);
            b=b&oldpanelUpdateRollbackStoreById(storeId,count,String.valueOf(logId));
        }
        return b;
    }
    /*
     * 退库
     * */
    @Transactional
    public boolean insertOldpanelDataBackStore(DataList insertList,String userId,String operator,String projectId,String buildingId,String description){
        boolean b = true;
        int logId = oldpanelAddLogBackId("2","1",userId,operator,projectId,buildingId,description);
        if(logId==0)
            return false;
        for (DataRow dataRow : insertList) {
            b = b&oldpanelAddStoreAndLogDetailByRow(dataRow,String.valueOf(logId),2);
        }
        return b;
    }
    private boolean oldpanelAddStoreAndLogDetailByRow(DataRow dataRow,String logId,int method){//method=1入库，2退库
        String oldpanelId = dataRow.get("oldpanelId").toString();
        String warehouseName = dataRow.get("warehouseName").toString();
        String count = dataRow.get("count").toString();
        String remark = dataRow.get("remark").toString();
        String totalWeight = "";
        String totalArea = "";
        String backWarehouseName = null;
        if(method==2)
            backWarehouseName = dataRow.get("backWarehouseName").toString();
        if((dataRow.get("unitWeight")!=null)&&(dataRow.get("unitWeight").toString().length()!=0))
            totalWeight = String.valueOf(Double.parseDouble(count)*Double.parseDouble(dataRow.get("unitWeight").toString()));
        if((dataRow.get("unitArea")!=null)&&(dataRow.get("unitArea").toString().length()!=0))
            totalArea = String.valueOf(Double.parseDouble(count)*Double.parseDouble(dataRow.get("unitArea").toString()));
        DataList queryList = queryService.query("select * from oldpanel_store where oldpanelId=? and warehouseName=?"
                ,oldpanelId,warehouseName);
        String storeId = "";
        if(queryList.isEmpty()){
            storeId = String.valueOf(insertProjectService.insertDataToTable(
                    "insert into oldpanel_store (oldpanelId,countUse,countStore,warehouseName,totalWeight,totalArea) values (?,?,?,?,?,?)",
                    oldpanelId,count,count,warehouseName,totalWeight,totalArea));
        } else {
            storeId = queryList.get(0).get("id").toString();
            double countStore = Double.parseDouble(queryList.get(0).get("countStore").toString());
            String countStoreNew = String.valueOf(countStore+Double.parseDouble(count));
            String countUseNew = String.valueOf(Double.parseDouble(queryList.get(0).get("countUse").toString())+Double.parseDouble(count));
            if(totalArea.length()!=0)
                totalArea = String.valueOf(Double.parseDouble(dataRow.get("unitArea").toString())*countStore+Double.parseDouble(totalArea));
            if(totalWeight.length()!=0)
                totalWeight = String.valueOf(Double.parseDouble(dataRow.get("unitWeight").toString())*countStore+Double.parseDouble(totalWeight));
            jo.update("update oldpanel_store set countUse=\""+countUseNew+
                    "\",countStore=\""+countStoreNew+"\",totalArea=\""+ totalArea +
                    "\",totalWeight=\""+totalWeight+ "\" where id=\""+storeId+"\"");
        }
        return insertProjectService.insertIntoTableBySQL(
                "insert into oldpanel_logdetail (oldpanelId,count,oldpanellogId,oldpanelstoreId,isrollback,backWarehouseName,remark) values (?,?,?,?,?,?,?)",
                oldpanelId,count,logId,storeId,"0",backWarehouseName,remark);
    }

    private boolean oldpanelUpdateRollbackStoreById(String storeId,String count,String logId){
        DataRow dataRow = queryService.query("select * from oldpanel_store_info_format_type_class_view where storeId=?",storeId).get(0);
        String totalWeight = "";
        String totalArea = "";
        String countStore = dataRow.get("countStore").toString();
        String oldpanelId = dataRow.get("oldpanelId").toString();
        if((dataRow.get("unitWeight")!=null)&&(dataRow.get("unitWeight").toString().length()!=0))
            totalWeight = String.valueOf((Double.parseDouble(countStore)-(Double.parseDouble(count)))*Double.parseDouble(dataRow.get("unitWeight").toString()));
        if((dataRow.get("unitArea")!=null)&&(dataRow.get("unitArea").toString().length()!=0))
            totalArea = String.valueOf((Double.parseDouble(countStore)-(Double.parseDouble(count)))*Double.parseDouble(dataRow.get("unitArea").toString()));
        jo.update("update oldpanel_store set countUse=countUse-\""+count+
                "\",countStore=countStore-\""+count+"\",totalArea=\""+ totalArea +
                "\",totalWeight=\""+totalWeight+ "\" where id=\""+storeId+"\"");
        return insertProjectService.insertIntoTableBySQL(
                "insert into oldpanel_logdetail (oldpanelId,count,oldpanellogId,oldpanelstoreId,isrollback) values (?,?,?,?,?)",
                oldpanelId,count,logId,storeId,"1");
    }

    private int oldpanelAddLogBackId(String type,String isrollback,String userId,String operator,String projectId,String buildingId,String description){
        return insertProjectService.insertDataToTable(
                "insert into oldpanel_log (type,userId,time,operator,isrollback,projectId,buildingId,description) values(?,?,?,?,?,?,?,?)",
                type,userId,analyzeNameService.getTime(),operator,isrollback,projectId,buildingId,description);
    }


//    private int oldpanelSaveInfo(String oldpanelName, String inventoryUnit, String unitWeight0,
//                                 String unitArea0, String remark, String userId){
//        double unitArea = Double.parseDouble(unitArea0);
//        double unitWeight = Double.parseDouble(unitWeight0);
//        String[] analyzeOldpanelName = analyzeNameService.analyzeOldpanelName(oldpanelName);
//        if(analyzeOldpanelName==null)
//            return 0;
//        DataList formatList = queryService.query("select * from oldpanel_format where oldpanelTypeId=? and oldpanelFormat=?",
//                analyzeOldpanelName[1],analyzeOldpanelName[0]);
//        if(formatList.size()==0)
//            return 0;
//        String productFormatId = formatList.get(0).get("id").toString();
//        //返回String[]{format,oldpanelTypeId,classificationId,m,n,p,a,b,mAngle,nAngle,pAngle,suffix,oldpanelTypeName};
//        String sql = "insert into oldpanel_info (oldpanelName,inventoryUnit,unitWeight,unitArea,remark," +
//                "oldpanelFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,userId) " +
//                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//        String[] t = {oldpanelName,inventoryUnit,
//                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
//                productFormatId,analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],
//                analyzeOldpanelName[8],analyzeOldpanelName[9],analyzeOldpanelName[10],analyzeOldpanelName[11],userId};
//        System.out.println("SaveInfo======="+Arrays.toString(t));
//        return insertProjectService.insertDataToTable(sql,oldpanelName,inventoryUnit,
//                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
//                productFormatId,analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],
//                analyzeOldpanelName[8],analyzeOldpanelName[9],analyzeOldpanelName[10],analyzeOldpanelName[11],userId);
//    }


//    private int oldpanelSaveData(String[] analyzeOldpanelName, String oldpanelName, String classificationId, String inventoryUnit,
//                                  String number, String warehouseName, String unitArea0, String unitWeight0, String remark, String uploadId) {
//        double unitArea = Double.parseDouble(unitArea0);
//        double unitWeight = Double.parseDouble(unitWeight0);
//        double num = Double.parseDouble(number);
//        double totalArea = unitArea*num;
//        double totalWeight = unitWeight*num;
//        String sql2 = "insert into oldpanel_store (oldpanelName,classificationId,inventoryUnit,countUse,countStore,warehouseName," +
//                "unitArea,unitWeight,remark,uploadId,totalArea,totalWeight,format,oldpanelType,length,width,aValue,bValue,mnAngle,suffix) " +
//                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//        String[] t = {oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]};
//        System.out.println("Save======="+Arrays.toString(t));
//        return insertProjectService.insertDataToTable(sql2,oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]);
//        jo.update(sql2,oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]);
//    }
    /**
     * queryPage替换指定属性值为对应另一属性值
     *
     * @param
     * @return
     */
    @Transactional
    public WebResponse ChangeQueryPageFromAToB(WebResponse re, String tableName, String ChangeFrom, String ChangeTo){
        DataList dataList=(DataList)re.get("value");

        for (DataRow dataRow : dataList) {
            int type=Integer.parseInt( dataRow.get(ChangeFrom)+"");
            DataList list = queryService.query("select "+ChangeTo+" from "+tableName+" where "+ChangeFrom+"=?", type);
            String typeName = String.valueOf(list.get(0).get(ChangeTo));
            dataRow.put(ChangeFrom,typeName);
        }

        re.setValue(dataList);
        return re;
    }
    /*
     * 查询所有的旧板类型
     * */
    @Transactional
    public DataList findOldpanelTypeList(){
        return queryService.query("select * from oldpaneltype order by id ASC");

    }
    /*
     * 根据类型id查询所有的旧板格式
     * */
    @Transactional
    public DataList findOldpanelFormatList(String oldpanelTypeId){
        DataList formatList = queryService.query("select * from oldpanel_format where oldpanelTypeId=? order by id ASC",oldpanelTypeId);
        String oldpanelTypeName = queryService.query("select * from oldpaneltype where id=?",oldpanelTypeId)
                .get(0).get("oldpanelTypeName").toString();
        for (DataRow dataRow : formatList) {
            String oldpanelFormat = dataRow.get("oldpanelFormat").toString();
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < oldpanelFormat.length(); j++) {
                switch (oldpanelFormat.charAt(j)) {
                    case '0':
                        sb.append("无 ");
                        break;
                    case '1':
                        sb.append(oldpanelTypeName).append(" ");
                        break;
                    case '2':
                        sb.append("m ");
                        break;
                    case '3':
                        sb.append("n ");
                        break;
                    case '4':
                        sb.append("a*b ");
                        break;
                    case '5':
                        sb.append("b*a ");
                        break;
                    case '6':
                        sb.append("m+n ");
                        break;
                    case '7':
                        sb.append("后缀 ");
                        break;
                    case '8':
                        sb.append("m+n+p ");
                        break;
                    case '9':
                        sb.append("a+b ");
                        break;
                }
            }
            dataRow.replace("oldpanelFormat", sb.toString().trim());
        }
        return formatList;
    }

}

