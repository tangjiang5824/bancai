package com.bancai.commonMethod;


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
