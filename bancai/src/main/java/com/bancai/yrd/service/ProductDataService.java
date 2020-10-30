package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
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

@Service
public class ProductDataService extends BaseService{
    private Logger log = Logger.getLogger(ProductDataService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;

    @Transactional
    public DataList productAddInsertRowToFormatList(DataList insertList,String typeId,String format){
        DataRow row = new DataRow();
        row.put("productTypeId",typeId);
        row.put("productFormat",format);
        insertList.add(row);
        return insertList;
    }
    @Transactional
    public DataList productAddInsertRowToInfoList(DataList insertList,String productFormatId,String productTypeId,String classificationId,String productName,String inventoryUnit,
                                                  String unitWeight,String unitArea,String remark,String mValue,String nValue,String pValue,
                                                  String aValue,String bValue,String mAngle,String nAngle,String pAngle,
                                                  String suffix,String ignoredSuffix){
        DataRow row = new DataRow();
        row.put("productFormatId",productFormatId);
        row.put("productTypeId",productTypeId);
        row.put("classificationId",classificationId);
        row.put("productName",productName);
        row.put("inventoryUnit",inventoryUnit);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        row.put("remark",remark);
        if(suffix.length()==0)
            suffix = "null";
        if(ignoredSuffix.length()==0)
            ignoredSuffix = "null";
        String values = mValue + "%" + nValue + "%" + pValue + "%" + aValue + "%" + bValue + "%" + mAngle +
                "%" + nAngle + "%" + pAngle + "%" + suffix + "%" + ignoredSuffix;
        row.put("values", values);
//        row.put("mValue",mValue);
//        row.put("nValue",nValue);
//        row.put("pValue",pValue);
//        row.put("aValue",aValue);
//        row.put("bValue",bValue);
//        row.put("mAngle",mAngle);
//        row.put("nAngle",nAngle);
//        row.put("pAngle",pAngle);
//        row.put("suffix",suffix);
//        row.put("ignoredSuffix",ignoredSuffix);
        insertList.add(row);
        return insertList;
    }

    @Transactional
    public DataList productAddInsertRowToInboundList(DataList insertList,String productId,String warehouseName,String count,String unitWeight,String unitArea,String remark){
        DataRow row = new DataRow();
        row.put("productId",productId);
        row.put("warehouseName",warehouseName);
        row.put("count",count);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        row.put("remark",remark);
        insertList.add(row);
        return insertList;
    }

    /**
     * 添加新的产品format
     */
    @Transactional
    public boolean productAddNewFormat(DataList insertList,String userId) {
        boolean b = true;
        for (DataRow dataRow : insertList) {
            String typeId = dataRow.get("productTypeId").toString();
            String format = dataRow.get("productFormat").toString();
            int formatId = insertProjectService.insertDataToTable("insert into product_format (productTypeId,productFormat) values (?,?)",
                    typeId,format);
            b = b&insertProjectService.insertIntoTableBySQL("insert into format_log (type,formatId,userId,time) values(?,?,?,?)",
                    "1",String.valueOf(formatId),userId,analyzeNameService.getTime());
        }
        return b;
    }

    /**
     * 添加新的产品info
     */
    @Transactional
    public boolean productAddNewInfo(DataList insertList,String userId){
        boolean b = true;
        int logId = insertProjectService.insertDataToTable("insert into product_log (type,userId,time) values(?,?,?)",
                "6",userId,analyzeNameService.getTime());
        for (DataRow dataRow : insertList) {
            String productFormatId = dataRow.get("productFormatId").toString();
            String productTypeId = dataRow.get("productTypeId").toString();
            String classificationId = dataRow.get("classificationId").toString();
            String productName = dataRow.get("productName").toString();
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
            if(values[9].equals("null"))
                values[9] = "";
            int productIdNew = insertProjectService.insertDataToTable("insert into product_info (productName,inventoryUnit,unitWeight,unitArea,remark," +
                            "productFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,ignoredSuffix,userId) " +
                            "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    productName,inventoryUnit,unitWeight,unitArea,remark,productFormatId,mValue,nValue,pValue,aValue,bValue
                    ,values[5],values[6],values[7],values[8],values[9],userId);
            int productIdOld = insertProjectService.insertDataToTable("insert into product_info (productName,inventoryUnit,unitWeight,unitArea,remark," +
                            "productFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,ignoredSuffix,userId) " +
                            "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    productName,inventoryUnit,unitWeight,unitArea,remark,productFormatId,mValue,nValue,pValue,aValue,bValue
                    ,values[5],values[6],values[7],values[8],values[9],userId);
            String partNoNew = analyzeNameService.productPartNoNewGenerator(productTypeId,String.valueOf(productIdNew),classificationId);
            jo.update("update product_info set partNo=\""+partNoNew+"\" where id=\""+productIdNew+"\"");
            b = b&insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                    String.valueOf(logId), String.valueOf(productIdNew));
            String partNoOld = analyzeNameService.productPartNoOldGenerator(productTypeId,String.valueOf(productIdOld),classificationId);
            jo.update("update product_info set partNo=\""+partNoOld+"\" where id=\""+productIdOld+"\"");
            b = b&insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                    String.valueOf(logId), String.valueOf(productIdOld));
        }
        return b;
    }


    @Transactional
    public int productAddSingleInfo(String productName, String inventoryUnit, String unitWeight,
                                 String unitArea, String remark, String userId) {
        if(analyzeNameService.isInfoExist("product",productName)!=0)
            return 0;
        return productSaveInfo(productName, inventoryUnit, unitWeight, unitArea, remark, userId);
    }

    /**
     * 如果没有info，且品名合法则添加产品info，返回info id或0
     */
    @Transactional
    public int addProductInfoIfNameValid(String productName,String userId){
        int productId = analyzeNameService.isInfoExist("product", productName);
        if (productId == 0) {
            DataList list = analyzeNameService.getTypeByProductName(productName);
            if (list.size() == 0)
                return 0;
            else {
                String productTypeId = list.get(0).get("id").toString();
                String classificationId = list.get(0).get("classificationId").toString();
                String sql_addLog = "insert into product_log (type,userId,time) values(?,?,?)";
                int productIdNew = productAddSingleInfo(productName, "", "", "", "", userId);
                if (productIdNew == 0)
                    return 0;
                int productlogIdNew = insertProjectService.insertDataToTable(sql_addLog, "6", "0", analyzeNameService.getTime());
                String partNoNew = analyzeNameService.productPartNoNewGenerator(productTypeId,String.valueOf(productIdNew),classificationId);
                jo.update("update product_info set partNo=\""+partNoNew+"\" where id=\""+productId+"\"");
                boolean isLogRightNew = insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                        String.valueOf(productlogIdNew), String.valueOf(productIdNew));
                if (!isLogRightNew)
                    return 0;
                int productIdOld = productAddSingleInfo(productName, "", "", "", "", userId);
                if (productIdOld == 0)
                    return 0;
                int productlogIdOld = insertProjectService.insertDataToTable(sql_addLog, "6", "0", analyzeNameService.getTime());
                String partNoOld = analyzeNameService.productPartNoOldGenerator(productTypeId,String.valueOf(productIdOld),classificationId);
                jo.update("update product_info set partNo=\""+partNoOld+"\" where id=\""+productId+"\"");
                boolean isLogRightOld = insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                        String.valueOf(productlogIdOld), String.valueOf(productIdOld));
                if (!isLogRightOld)
                    return 0;
            }
        }
        return productId;
    }

    private int productSaveInfo(String productName, String inventoryUnit, String unitWeight,
                                String unitArea, String remark, String userId){
        if(!unitArea.equals(""))
            unitArea = String.valueOf(Double.parseDouble(unitArea));
        else
            unitArea = null;
        if(!unitWeight.equals(""))
            unitWeight = String.valueOf(Double.parseDouble(unitWeight));
        else
            unitWeight = null;
        String[] analyzeProductName = analyzeNameService.analyzeProductName(productName);
        if(analyzeProductName==null)
            return 0;
        DataList formatList = queryService.query("select * from product_format where productTypeId=? and productFormat=?",
                analyzeProductName[1],analyzeProductName[0]);
        if(formatList.size()==0)
            return 0;
        String productFormatId = formatList.get(0).get("id").toString();
        //返回String[]{format,productTypeId,classificationId,m,n,p,a,b,mAngle,nAngle,pAngle,suffix,igSuffix,productTypeName};
        String sql = "insert into product_info (productName,inventoryUnit,unitWeight,unitArea,remark," +
                "productFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,ignoredSuffix,userId) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String[] t = {productName,inventoryUnit,
                unitWeight,unitArea,remark, productFormatId,
                analyzeProductName[3], analyzeProductName[4],analyzeProductName[5],
                analyzeProductName[6],analyzeProductName[7],analyzeProductName[8],analyzeProductName[9],
                analyzeProductName[10],analyzeProductName[11],analyzeProductName[12],userId};
        System.out.println("SaveInfo======="+Arrays.toString(t));
        return insertProjectService.insertDataToTable(sql,productName,inventoryUnit,
                unitWeight,unitArea,remark, productFormatId,
                analyzeProductName[3], analyzeProductName[4],analyzeProductName[5],
                analyzeProductName[6],analyzeProductName[7],analyzeProductName[8],analyzeProductName[9],
                analyzeProductName[10],analyzeProductName[11],analyzeProductName[12],userId);
    }
    /**
     * 添加数据,返回添加的产品id
     */
    @Transactional
    public int[] addProduct(String productName, String warehouseName, String count) {
        String[] info = analyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("productUpload===productId=" + productId);
        if (productId == 0) {
            return new int[] {0,0};
        }
        int productstoreId = productSaveData(info, warehouseName, count);
        return new int[] {productId,productstoreId};
    }

    private int productSaveData(String[] info, String warehouseName, String countNum){
        //id,unitWeight,unitArea
        String count = String.valueOf(Double.parseDouble(countNum));
        int con = 0;
        if((info[1]!=null)&&(!info[1].equals("")))
            info[1] = String.valueOf(Double.parseDouble(info[1])*Double.parseDouble(count));
        else
            con += 1;
        if((info[2]!=null)&&(!info[2].equals("")))
            info[2] = String.valueOf(Double.parseDouble(info[2])*Double.parseDouble(count));
        else
            con += 10;
        String sql = "select * from product_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            return insertProjectService.insertDataToTable("insert into product_store " +
                            "(productId,count,warehouseName,totalArea,totalWeight) values (?,?,?,?,?)",
                    info[0],count,warehouseName,info[2], info[1]);
        } else {
            String sql2 = "update product_store set count=count+\"" + count+"\"";

            switch (con) {
                case 0:
                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2] + "\",totalWeight=totalWeight+\"" + info[1]+"\"";
                    break;
                case 1:
                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2]+"\"";
                    break;
                case 10:
                    sql2 = sql2 + ",totalWeight=totalWeight+\"" + info[1]+"\"";
                    break;
                case 11:
                default:
                    break;
            }
            sql2 = sql2 + " where id=" + queryList.get(0).get("id").toString();
            jo.update(sql2);
            return Integer.parseInt(queryList.get(0).get("id").toString());
        }
    }

    /*
     * 查询所有的产品类型
     * */
    @Transactional
    public DataList findProductTypeList(){
        return queryService.query("select * from producttype order by classificationId,productTypeName ASC");

    }
    /*
     * 根据类型id查询所有的产品格式
     * */
    @Transactional
    public DataList findProductFormatList(String productTypeId){
        DataList formatList = queryService.query("select * from product_format where productTypeId=? order by id ASC",productTypeId);
        String productTypeName = queryService.query("select * from producttype where id=?",productTypeId)
                .get(0).get("productTypeName").toString();
        for (DataRow dataRow : formatList) {
            String productFormat = dataRow.get("productFormat").toString();
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < productFormat.length(); j++) {
                switch (productFormat.charAt(j)) {
                    case '0':
                        sb.append("无 ");
                        break;
                    case '1':
                        sb.append(productTypeName).append(" ");
                        break;
                    case '2':
                        sb.append("m ");
                        break;
                    case '3':
                        sb.append("n ");
                        break;
                    case '4':
                        sb.append("aXb ");
                        break;
                    case '5':
                        sb.append("bXa ");
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
            dataRow.replace("productFormat", sb.toString().trim());
        }
        return formatList;
    }

    @Transactional
    public boolean insertProductDataToStore(String method,DataList insertList,String userId,String operator,String projectId,String buildingId){
        boolean b = true;
        int logId = 0;
        if (projectId.equals("-1") && buildingId.equals("-1")) {//入库
            logId = productAddLogBackId(method,"0",userId,operator);
        } else {//退库
            logId = productAddLogBackId(method,"2",userId,operator);
        }
        if(logId==0)
            return false;
        for (DataRow dataRow : insertList) {
            b = b&productAddStoreAndLogDetailByRow(method,dataRow,String.valueOf(logId));
        }
        return b;
    }
    private int productAddLogBackId(String method,String type,String userId,String operator){
        return insertProjectService.insertDataToTable(
                "insert into "+method+"_log (type,userId,time,operator,isrollback) values(?,?,?,?,?)",
                type,userId,analyzeNameService.getTime(),operator,"0");
    }
    private boolean productAddStoreAndLogDetailByRow(String method, DataRow dataRow,String logId){
        String productId = dataRow.get("productId").toString();
        String warehouseName = dataRow.get("warehouseName").toString();
        String count = dataRow.get("count").toString();
        String remark = dataRow.get("remark").toString();
        String totalWeight = "";
        String totalArea = "";
        if(dataRow.get("unitWeight")!=null)
            totalWeight = String.valueOf(Double.parseDouble(count)*Double.parseDouble(dataRow.get("unitWeight").toString()));
        if(dataRow.get("unitArea")!=null)
            totalArea = String.valueOf(Double.parseDouble(count)*Double.parseDouble(dataRow.get("unitArea").toString()));
        DataList queryList = queryService.query("select * from "+method+"_store where productId=? and warehouseName=?"
                ,productId,warehouseName);
        String storeId = "";
        if(queryList.isEmpty()){
            storeId = String.valueOf(insertProjectService.insertDataToTable(
                    "insert into "+method+"_store (productId,countUse,countStore,warehouseName,totalWeight,totalArea) values (?,?,?,?,?,?)",
                    productId,count,count,warehouseName,totalWeight,totalArea));
        } else {
            storeId = queryList.get(0).get("id").toString();
            double countStore = Double.parseDouble(queryList.get(0).get("countStore").toString());
            String countStoreNew = String.valueOf(countStore+Double.parseDouble(count));
            String countUseNew = String.valueOf(Double.parseDouble(queryList.get(0).get("countUse").toString())+Double.parseDouble(count));
            if(totalArea.length()!=0)
                totalArea = String.valueOf(Double.parseDouble(dataRow.get("unitArea").toString())*countStore+Double.parseDouble(totalArea));
            if(totalWeight.length()!=0)
                totalWeight = String.valueOf(Double.parseDouble(dataRow.get("unitWeight").toString())*countStore+Double.parseDouble(totalWeight));
            jo.update("update "+method+"_store set countUse=\""+countUseNew+
                    "\",countStore=\""+countStoreNew+"\",totalArea=\""+ totalArea +
                    "\",totalWeight=\""+totalWeight+ "\" where id=\""+storeId+"\"");
        }
        return insertProjectService.insertIntoTableBySQL(
                "insert into "+method+"_logdetail (productId,count,"+method+"logId,"+method+"storeId,isrollback,remark) values (?,?,?,?,?,?)",
                productId,count,logId,storeId,"0",remark);
    }
    /*
     * 预加工入库撤销
     * */
    @Transactional
    public boolean rollbackProductData(String method,String logId,String operator,String userId,String projectId,String buildingId){
        boolean b = true;
        analyzeNameService.updateIsrollbackToOneById(method+"_log",logId);
        int rollbackLogId = productAddLogBackId(method,"3",userId,operator,projectId,buildingId,"1");
        DataList dataList = queryService.query("select * from "+method+"_logdetail where "+method+"logId=? and isrollback=0",logId);
        for (DataRow dataRow : dataList) {
            String detailId = dataRow.get("id").toString();
            String storeId = dataRow.get(method+"storeId").toString();
            String count = dataRow.get("count").toString();
            analyzeNameService.updateIsrollbackToOneById(method+"_logdetail",detailId);
            b=b&productUpdateRollbackStoreById(method,storeId,count,String.valueOf(rollbackLogId));
        }
        return b;
    }
    private int productAddLogBackId(String method,String type,String userId,String operator,String projectId,String buildingId,String isrollback){
        return insertProjectService.insertDataToTable("insert into "+method+"_log (type,userId,operator,projectId,buildingId,time,isrollback) values (?,?,?,?,?,?,?)",
                type,userId,operator,projectId,buildingId,analyzeNameService.getTime(),isrollback);
    }
    private boolean productUpdateRollbackStoreById(String method,String storeId,String count,String logId){
        DataRow dataRow = queryService.query("select * from "+method+"_info_store_type where storeId=?",storeId).get(0);
        String totalWeight = "";
        String totalArea = "";
        String countStore = dataRow.get("countStore").toString();
        String productId = dataRow.get("productId").toString();
        if((dataRow.get("unitWeight")!=null)&&(dataRow.get("unitWeight").toString().length()!=0))
            totalWeight = String.valueOf((Double.parseDouble(countStore)-(Double.parseDouble(count)))*Double.parseDouble(dataRow.get("unitWeight").toString()));
        if((dataRow.get("unitArea")!=null)&&(dataRow.get("unitArea").toString().length()!=0))
            totalArea = String.valueOf((Double.parseDouble(countStore)-(Double.parseDouble(count)))*Double.parseDouble(dataRow.get("unitArea").toString()));
        jo.update("update "+method+"_store set countUse=countUse-\""+count+
                "\",countStore=countStore-\""+count+"\",totalArea=\""+ totalArea +
                "\",totalWeight=\""+totalWeight+ "\" where id=\""+storeId+"\"");
        return insertProjectService.insertIntoTableBySQL(
                "insert into "+method+"_logdetail (productId,count,"+method+"logId,"+method+"storeId,isrollback) values (?,?,?,?,?)",
                productId,count,logId,storeId,"1");
    }

    @Transactional
    public DataList wasteAddInsertRowToInboundList(DataList insertList,String wasteName,String warehouseName,String inventoryUnit,String count,String remark){
        DataRow row = new DataRow();
        row.put("wasteName",wasteName);
        row.put("warehouseName",warehouseName);
        row.put("inventoryUnit",inventoryUnit);
        row.put("count",count);
        row.put("remark",remark);
        insertList.add(row);
        return insertList;
    }

    /*
     * 废料入库
     * */
    @Transactional
    public boolean insertWasteDataToStore(DataList insertList,String userId,String operator,String projectId,String buildingId){
        boolean b = true;
        int logId = wasteAddLogBackId("0",userId,operator,projectId,buildingId,"0");
        for (DataRow dataRow : insertList) {
            String wasteName = dataRow.get("wasteName").toString();
            String warehouseName = dataRow.get("warehouseName").toString();
            String inventoryUnit = dataRow.get("inventoryUnit").toString();
            String count = dataRow.get("count").toString();
            String remark = dataRow.get("remark").toString();
            DataList queryList = queryService.query("select * from waste_store where wasteName=? and warehouseName=? and inventoryUnit=?",
                    wasteName,warehouseName,inventoryUnit);
            if(queryList.isEmpty()){
                int storeId = wasteAddStoreBackId(wasteName,warehouseName,inventoryUnit,count);
                b = b&wasteAddLogDetail(String.valueOf(logId),String.valueOf(storeId),count,remark,"0");
            }else {
                String storeId = queryList.get(0).get("id").toString();
                wasteUpdateStoreById(storeId,"+",count);
                b = b&wasteAddLogDetail(String.valueOf(logId),storeId,count,remark,"0");
            }
        }
        return b;
    }

    private int wasteAddLogBackId(String type,String userId,String operator,String projectId,String buildingId,String isrollback){
        return insertProjectService.insertDataToTable("insert into waste_log (type,userId,operator,projectId,buildingId,time,isrollback) values (?,?,?,?,?,?,?)",
                type,userId,operator,projectId,buildingId,analyzeNameService.getTime(),isrollback);
    }
    private int wasteAddStoreBackId(String wasteName,String warehouseName,String inventoryUnit,String count){
        return insertProjectService.insertDataToTable("insert into waste_store (wasteName,warehouseName,inventoryUnit,countStore) values (?,?,?,?)",
                wasteName,warehouseName,inventoryUnit,count);
    }
    private void wasteUpdateStoreById(String storeId,String compute,String count){
        jo.update("update waste_store set countStore=countStore"+compute+"\""+count+"\" where id=\""+storeId+"\"");
    }
    private boolean wasteAddLogDetail(String logId,String storeId,String count,String remark,String isrollback){
        return insertProjectService.insertIntoTableBySQL("insert into waste_logdetail (wastelogId,wastestoreId,count,remark,isrollback) values (?,?,?,?,?)",
                logId,storeId,count,remark,isrollback);
    }
    /*
     * 废料入库撤销
     * */
    @Transactional
    public boolean rollbackWasteData(String wastelogId,String operator,String userId,String projectId,String buildingId){
        boolean b = true;
        analyzeNameService.updateIsrollbackToOneById("waste_log",wastelogId);
        int logId = wasteAddLogBackId("3",userId,operator,projectId,buildingId,"1");
        DataList dataList = queryService.query("select * from waste_logdetail where wastelogId=? and isrollback=0",wastelogId);
        for (DataRow dataRow : dataList) {
            String detailId = dataRow.get("id").toString();
            String storeId = dataRow.get("wastestoreId").toString();
            String count = dataRow.get("count").toString();
            analyzeNameService.updateIsrollbackToOneById("waste_logdetail",detailId);
            wasteUpdateStoreById(storeId,"-",count);
            b=b&wasteAddLogDetail(String.valueOf(logId),storeId,count,"","1");
        }
        return b;
    }


    /*
     * 废料出库
     * */
    @Transactional
    public boolean wasteOutStore(JSONArray jsonArray,String operator,String userId){
        boolean b = true;
        int logId = wasteAddLogBackId("1",userId,operator,null,null,"1");
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String count = (jsonTemp.get("count")+"").trim();
            String storeId = jsonTemp.get("id")+"";
            wasteUpdateStoreById(storeId,"-",count);
            b = b&wasteAddLogDetail(String.valueOf(logId),storeId,count,"","1");
        }
        return b;
    }
    /*
     * 废料结算
     * */
    @Transactional
    public boolean addWasteSettleData(String account,String remark,String userId,String operator,String projectId,String buildingId){
        return insertWasteSettleData(userId,operator,projectId,buildingId,account,remark);
    }

    private boolean insertWasteSettleData(String userId,String operator,String projectId,String buildingId,String account,String remark){
        return insertProjectService.insertIntoTableBySQL("insert into waste_settle_account (userId,operator,projectId,buildingId,account,remark,time) values (?,?,?,?,?,?,?)",
                userId,operator,projectId,buildingId,account,remark,analyzeNameService.getTime());
    }

//    /**
//     * 添加数据,返回添加的产品id
//     */
//    @Transactional
//    public int[] backProduct(String productName, String warehouseName, String count) {
//        String[] info = analyzeNameService.isInfoExistBackUnit("product", productName);
//        //id,unitWeight,unitArea
//        int productId = Integer.parseInt(info[0]);
//        System.out.println("backproductUpload===productId=" + productId);
//        if (productId == 0) {
//            return new int[]{0,0};
//        }
//        int backproductstoreId = backproductSaveData(info, warehouseName, count);
//        return new int[]{productId,backproductstoreId};
//    }
//
//    private int backproductSaveData(String[] info, String warehouseName, String countNum){
//        //id,unitWeight,unitArea
//        int con = 0;
//        String count = String.valueOf(Double.parseDouble(countNum));
//        if((info[1]!=null)&&(!info[1].equals("")))
//            info[1] = String.valueOf(Double.parseDouble(info[1])*Double.parseDouble(count));
//        else {
//            info[1] = null;
//            con += 1;
//        }
//        if((info[2]!=null)&&(!info[2].equals("")))
//            info[2] = String.valueOf(Double.parseDouble(info[2])*Double.parseDouble(count));
//        else {
//            info[2]=null;
//            con += 10;
//        }
//        String sql = "select * from backproduct_store where productId=? and warehouseName=?";
//        DataList queryList = queryService.query(sql,info[0],warehouseName);
//        if(queryList.isEmpty()){
//            return insertProjectService.insertDataToTable("insert into backproduct_store " +
//                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
//                    info[0],count,count,warehouseName,info[2], info[1]);
//        } else {
//            String sql2 = "update backproduct_store set countUse=countUse+\"" + count + "\",countStore=countStore+\"" + count+"\"";
//
//            switch (con) {
//                case 0:
//                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2] + "\",totalWeight=totalWeight+\"" + info[1]+"\"";
//                    break;
//                case 1:
//                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2]+"\"";
//                    break;
//                case 10:
//                    sql2 = sql2 + ",totalWeight=totalWeight+\"" + info[1]+"\"";
//                    break;
//                case 11:
//                default:
//                    break;
//            }
//            sql2 = sql2 + " where id=\"" + queryList.get(0).get("id").toString()+"\"";
//            jo.update(sql2);
//            return Integer.parseInt(queryList.get(0).get("id").toString());
//        }
//    }
//
//    /**
//     * 添加数据,返回添加的产品id
//     */
//    @Transactional
//    public int[] preprocessInbound(String productName, String warehouseName, String count) {
//        String[] info = analyzeNameService.isInfoExistBackUnit("product", productName);
//        //id,unitWeight,unitArea
//        int productId = Integer.parseInt(info[0]);
//        System.out.println("preprocessUpload===productId=" + productId);
//        if (productId == 0) {
//            return new int[]{0,0};
//        }
//        int preprocessstoreId = preprocessSaveData(info, warehouseName, count);
//        return new int[]{productId,preprocessstoreId};
//    }
//
//    private int preprocessSaveData(String[] info, String warehouseName, String countNum){
//        //id,unitWeight,unitArea
//        String count = String.valueOf(Double.parseDouble(countNum));
//        int con = 0;
//        if((info[1]!=null)&&(!info[1].equals("")))
//            info[1] = String.valueOf(Double.parseDouble(info[1])*Double.parseDouble(count));
//        else
//            con += 1;
//        if((info[2]!=null)&&(!info[2].equals("")))
//            info[2] = String.valueOf(Double.parseDouble(info[2])*Double.parseDouble(count));
//        else
//            con += 10;
//        String sql = "select * from preprocess_store where productId=? and warehouseName=?";
//        DataList queryList = queryService.query(sql,info[0],warehouseName);
//        if(queryList.isEmpty()){
//            return insertProjectService.insertDataToTable("insert into preprocess_store " +
//                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
//                    info[0],count,count,warehouseName,info[2], info[1]);
//        } else {
//            String sql2 = "update preprocess_store set countUse=countUse+\"" + count + "\",countStore=countStore+\"" + count+"\"";
//
//            switch (con) {
//                case 0:
//                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2] + "\",totalWeight=totalWeight+\"" + info[1]+"\"";
//                    break;
//                case 1:
//                    sql2 = sql2 + ",totalArea=totalArea+\"" + info[2]+"\"";
//                    break;
//                case 10:
//                    sql2 = sql2 + ",totalWeight=totalWeight+\"" + info[1]+"\"";
//                    break;
//                case 11:
//                default:
//                    break;
//            }
//            sql2 = sql2 + " where id=\"" + queryList.get(0).get("id").toString()+"\"";
//            jo.update(sql2);
//            return Integer.parseInt(queryList.get(0).get("id").toString());
//        }
//    }


}
