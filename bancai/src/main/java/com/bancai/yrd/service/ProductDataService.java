package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;

    /**
     * 添加新的产品format，返回新增的format id
     */
    @Transactional
    public int productAddNewFormat(String productTypeId, String productFormat) {
        if(AnalyzeNameService.isFormatExist("product",productTypeId,productFormat)!=0)
            return 0;
        return productSaveFormat(productTypeId, productFormat);
    }
    private int productSaveFormat(String productTypeId, String productFormat){
        return insertProjectService.insertDataToTable("insert into product_format (productTypeId,productFormat) values (?,?)"
                , productTypeId, productFormat);
    }
    /**
     * 添加新的产品info，返回新增的info id
     */
    @Transactional
    public int productAddNewInfo(String productName, String inventoryUnit, String unitWeight,
                                 String unitArea, String remark, String userId) {
        if(AnalyzeNameService.isInfoExist("product",productName)!=0)
            return 0;
        return productSaveInfo(productName, inventoryUnit, unitWeight, unitArea, remark, userId);
    }

    private int productSaveInfo(String productName, String inventoryUnit, String unitWeight,
                                String unitArea, String remark, String userId){
        if(!unitArea.equals(""))
            unitArea = String.valueOf(Double.parseDouble(unitArea));
        else
            unitArea = "0";
        if(!unitWeight.equals(""))
            unitWeight = String.valueOf(Double.parseDouble(unitWeight));
        else
            unitWeight = "0";
        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        if(analyzeProductName==null)
            return 0;
        DataList formatList = queryService.query("select * from product_format where productTypeId=? and productFormat=?",
                analyzeProductName[1],analyzeProductName[0]);
        if(formatList.size()==0)
            return 0;
        String productFormatId = formatList.get(0).get("id").toString();
        //返回String[]{format,productTypeId,classificationId,m,n,p,a,b,mAngle,nAngle,pAngle,suffix,igSuffix,productTypeName};
        String sql = "insert into product_info (productName,classificationId,inventoryUnit,unitWeight,unitArea,remark," +
                "productFormatId,productType,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,ignoredSuffix,userId) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String[] t = {productName,analyzeProductName[2],inventoryUnit,
                unitWeight,unitArea,remark, productFormatId,analyzeProductName[1],
                analyzeProductName[2],analyzeProductName[3], analyzeProductName[4],analyzeProductName[5],
                analyzeProductName[6],analyzeProductName[7],analyzeProductName[8],analyzeProductName[9],
                analyzeProductName[10],analyzeProductName[11],userId};
        System.out.println("SaveInfo======="+Arrays.toString(t));
        return insertProjectService.insertDataToTable(sql,productName,analyzeProductName[2],inventoryUnit,
                unitWeight,unitArea,remark, productFormatId,analyzeProductName[1],
                analyzeProductName[2],analyzeProductName[3], analyzeProductName[4],analyzeProductName[5],
                analyzeProductName[6],analyzeProductName[7],analyzeProductName[8],analyzeProductName[9],
                analyzeProductName[10],analyzeProductName[11],userId);
    }
    /**
     * 添加数据,返回添加的产品id
     */
    @Transactional
    public int[] addProduct(String productName, String warehouseName, String count) {
        String[] info = AnalyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("productUpload===productId=" + productId);
        if (productId == 0) {
            return new int[] {0,0};
        }
        int productstoreId = productSaveData(info, warehouseName, count);
        return new int[] {productId,productstoreId};
    }

    private int productSaveData(String[] info, String warehouseName, String count){
        //id,unitWeight,unitArea
        info[1] = String.valueOf(Double.parseDouble(info[1])*Integer.parseInt(count));
        info[2] = String.valueOf(Double.parseDouble(info[2])*Integer.parseInt(count));
        String sql = "select * from product_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            return insertProjectService.insertDataToTable("insert into product_store " +
                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,info[2], info[1]);
        } else {
            String productstoreId = queryList.get(0).get("id").toString();
            String sql2 = "update product_store set countUse=countUse+"+count+
                    ",countStore=countStore+"+count+",totalArea=totalArea+"+ info[2] +
                    ",totalWeight=totalWeight+"+info[1]+
                    " where id="+queryList.get(0).get("id").toString();
            jo.update(sql2);
            return Integer.parseInt(productstoreId);
        }
    }
}
