package com.bancai.yrd.service;

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

    /**
     * 设计清单解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userId, String projectId, String buildingId,
                                             String buildingpositionId) throws IOException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
        Map<String, ArrayList<String>> map = new HashMap<>();
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
            productName = String.valueOf(productId) + "N" + productName;
            //productName形如 15N100 B 200  即  idNproductName
            setDesignlistOrigin(projectId,buildingId,buildingpositionId,String.valueOf(productId),position,0,0);
            if (map.containsKey(productName)) {
                ArrayList<String> a = new ArrayList<>();
                a = map.get(productName);
                a.add(position);
                map.put(productName, a);
            } else {
                ArrayList<String> a = new ArrayList<>();
                a.add(position);
                map.put(productName, a);
            }
        }
        map = panelMatchService.matchBackProduct(map,projectId,buildingId,buildingpositionId);
        map = panelMatchService.matchPreprocess(map,projectId,buildingId,buildingpositionId);
        map = panelMatchService.matchOldpanel(map,projectId,buildingId,buildingpositionId);
//            map = matchMaterial(map);
        result.success = panelMatchService.matchError(map,projectId,buildingId,buildingpositionId);
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




}
