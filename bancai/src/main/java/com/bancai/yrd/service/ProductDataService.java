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
}
