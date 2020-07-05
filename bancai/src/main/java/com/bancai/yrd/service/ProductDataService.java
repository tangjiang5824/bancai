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
     * 添加新的产品info，返回新增的info id
     */
    @Transactional
    public int productAddNewInfo(String productName, String classificationId, String inventoryUnit,
                                  String unitWeight, String unitArea, String remark, String userId) {
        if(AnalyzeNameService.isInfoExist("product",productName)!=0)
            return 0;
        return productSaveInfo(productName, classificationId, inventoryUnit, unitWeight, unitArea, remark, userId);
    }

    private int productSaveInfo(String productName, String classificationId, String inventoryUnit,
                                 String unitWeight, String unitArea, String remark, String userId){
        if(!unitArea.equals(""))
            unitArea = String.valueOf(Double.parseDouble(unitArea));
        else
            unitArea = "0";
        if(!unitWeight.equals(""))
            unitWeight = String.valueOf(Double.parseDouble(unitWeight));
        else
            unitWeight = "0";
        if(classificationId.equals(""))
            classificationId = "0";
        String[] analyzeOldpanelName = AnalyzeNameService.analyzeProductName(productName);
        //返回String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName};
        String sql = "insert into product_info (productName,classificationId,inventoryUnit,unitWeight,unitArea,remark," +
                "productFormat,productType,mValue,nValue,aValue,bValue,mnAngle,suffix,ignoredSuffix,userId) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String[] t = {productName,classificationId,inventoryUnit,
                unitWeight,unitArea,remark, analyzeOldpanelName[0],analyzeOldpanelName[1],
                analyzeOldpanelName[2],analyzeOldpanelName[3], analyzeOldpanelName[4],analyzeOldpanelName[5],
                analyzeOldpanelName[6],analyzeOldpanelName[7],analyzeOldpanelName[8],userId};
        System.out.println("SaveInfo======="+Arrays.toString(t));
        return insertProjectService.insertDataToTable(sql,productName,classificationId,inventoryUnit,
                unitWeight,unitArea,remark, analyzeOldpanelName[0],analyzeOldpanelName[1],
                analyzeOldpanelName[2],analyzeOldpanelName[3], analyzeOldpanelName[4],analyzeOldpanelName[5],
                analyzeOldpanelName[6],analyzeOldpanelName[7],analyzeOldpanelName[8],userId);
    }
    /**
     * 添加数据,返回添加的产品id
     */
    @Transactional
    public int addProduct(String productName, String warehouseName, String count) {
        String[] info = AnalyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("productUpload===productId=" + productId);
        if (productId == 0) {
            return 0;
        }
        productSaveData(info, warehouseName, count);
        return productId;
    }

    private void productSaveData(String[] info, String warehouseName, String count){
        //id,unitWeight,unitArea
        info[1] = String.valueOf(Double.parseDouble(info[1])*Integer.parseInt(count));
        info[2] = String.valueOf(Double.parseDouble(info[2])*Integer.parseInt(count));
        String sql = "select * from product_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            insertProjectService.insertDataToTable("insert into product_store " +
                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,info[2], info[1]);
        } else {
            String sql2 = "update product_store set countUse=countUse+"+count+
                    ",countStore=countStore+"+count+",totalArea=totalArea+"+ info[2] +
                    ",totalWeight=totalWeight+"+info[1]+
                    " where id="+queryList.get(0).get("id").toString();
            jo.update(sql2);
        }
    }
}
