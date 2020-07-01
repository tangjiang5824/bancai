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
    private Logger log = Logger.getLogger(Y_Upload_Data_Service.class);
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
//        return productSaveInfo(productName, classificationId, inventoryUnit, unitWeight, unitArea, remark, userId);
        return 1;
    }

//    private int productSaveInfo(String productName, String classificationId, String inventoryUnit,
//                                 String unitWeight0, String unitArea0, String remark, String userId){
//        double unitArea = Double.parseDouble(unitArea0);
//        double unitWeight = Double.parseDouble(unitWeight0);
//        String[] analyzeOldpanelName = AnalyzeNameService.analyzeOldpanelName(oldpanelName);
//        //返回String[]{format,oldpanelType,m,n,a,b,mnAngle,suffix,oldpanelTypeName};
//        String sql = "insert into oldpanel_info (oldpanelName,classificationId,inventoryUnit,unitWeight,unitArea,remark," +
//                "oldpanelFormat,oldpanelType,mValue,nValue,aValue,bValue,mnAngle,suffix,userId) " +
//                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//        String[] t = {oldpanelName,classificationId,inventoryUnit,
//                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
//                analyzeOldpanelName[0],analyzeOldpanelName[1],analyzeOldpanelName[2],analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],userId};
//        System.out.println("SaveInfo======="+Arrays.toString(t));
//        return insertProjectService.insertDataToTable(sql,oldpanelName,classificationId,inventoryUnit,
//                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
//                analyzeOldpanelName[0],analyzeOldpanelName[1],analyzeOldpanelName[2],analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],userId);
//    }
}
