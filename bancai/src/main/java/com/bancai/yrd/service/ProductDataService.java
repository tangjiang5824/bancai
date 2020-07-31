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
    public DataList productAddInsertRowToInfoList(DataList insertList,String productFormatId,String productName,String inventoryUnit,
                                                  String unitWeight,String unitArea,String remark,String mValue,String nValue,String pValue,
                                                  String aValue,String bValue,String mAngle,String nAngle,String pAngle,
                                                  String suffix,String ignoredSuffix){
        DataRow row = new DataRow();
        row.put("productFormatId",productFormatId);
        row.put("productName",productName);
        row.put("inventoryUnit",inventoryUnit);
        row.put("unitWeight",unitWeight);
        row.put("unitArea",unitArea);
        row.put("remark",remark);
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
            int productId = insertProjectService.insertDataToTable("insert into product_info (productName,inventoryUnit,unitWeight,unitArea,remark," +
                            "productFormatId,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,ignoredSuffix,userId) " +
                            "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    productName,inventoryUnit,unitWeight,unitArea,remark,productFormatId,mValue,nValue,pValue,aValue,bValue
                    ,values[5],values[6],values[7],values[8],values[9],userId);
            b = b&insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                    String.valueOf(logId), String.valueOf(productId));
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
            if (analyzeNameService.getTypeByProductName(productName).size() == 0)
                return 0;
            String sql_addLog = "insert into product_log (type,userId,time) values(?,?,?)";
            productId = productAddSingleInfo(productName, "", "", "", "", userId);
            if (productId == 0)
                return 0;
            int productlogId = insertProjectService.insertDataToTable(sql_addLog, "6", "0", analyzeNameService.getTime());
            boolean isLogRight = insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                    String.valueOf(productlogId), String.valueOf(productId));
            if (!isLogRight)
                return 0;
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

    /**
     * 添加数据,返回添加的产品id
     */
    @Transactional
    public int[] backProduct(String productName, String warehouseName, String count) {
        String[] info = analyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("backproductUpload===productId=" + productId);
        if (productId == 0) {
            return new int[]{0,0};
        }
        int backproductstoreId = backproductSaveData(info, warehouseName, count);
        return new int[]{productId,backproductstoreId};
    }

    private int backproductSaveData(String[] info, String warehouseName, String countNum){
        //id,unitWeight,unitArea
        int con = 0;
        String count = String.valueOf(Double.parseDouble(countNum));
        if((info[1]!=null)&&(!info[1].equals("")))
            info[1] = String.valueOf(Double.parseDouble(info[1])*Double.parseDouble(count));
        else {
            info[1] = null;
            con += 1;
        }
        if((info[2]!=null)&&(!info[2].equals("")))
            info[2] = String.valueOf(Double.parseDouble(info[2])*Double.parseDouble(count));
        else {
            info[2]=null;
            con += 10;
        }
        String sql = "select * from backproduct_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            return insertProjectService.insertDataToTable("insert into backproduct_store " +
                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,info[2], info[1]);
        } else {
            String sql2 = "update backproduct_store set countUse=countUse+\"" + count + "\",countStore=countStore+\"" + count+"\"";

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
            sql2 = sql2 + " where id=\"" + queryList.get(0).get("id").toString()+"\"";
            jo.update(sql2);
            return Integer.parseInt(queryList.get(0).get("id").toString());
        }
    }



}
