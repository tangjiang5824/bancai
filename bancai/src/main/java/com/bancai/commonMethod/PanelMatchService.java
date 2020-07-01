package com.bancai.commonMethod;


import com.bancai.domain.DataRow;
import com.bancai.service.BaseService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.crypto.Data;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;


@Service
public class PanelMatchService extends BaseService{
    private Logger log = Logger.getLogger(AnalyzeNameService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;

    /**
     * 设计清单解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userid, String projectId, String buildingId) throws IOException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
        DataRow designlistMap = new DataRow();
        for (int i = 0; i < dataList.size(); i++) {
            String productName = dataList.get(i).get("productName").toString();
            String position = dataList.get(i).get("position").toString();
            if(!queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                    ,projectId,buildingId,position).isEmpty()){
                result.setErrorCode(2);
                return result;
            }else if(designlistMap.containsKey(productName)){
                int countOld = Integer.parseInt(designlistMap.get(productName).toString());
                String countNew = String.valueOf(countOld+1);
                designlistMap.put(productName,countNew);
            }else {
                designlistMap.put(productName,"1");
            }
        }
        return result;
    }
    /**
     * 旧板匹配
     */
    @Transactional
    public DataList matchOldpanel(String productName, String number){
        DataList matchList = new DataList();
        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}

        return matchList;
    }

    @Transactional
    public DataList findOldpanelMatchRules(String productTypeId, String productNameFormat) {
        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
        DataList list = queryService.query(sql, productTypeId, productNameFormat);
        return list;
    }

}
