package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;

@Service
public class MatchRulesService extends BaseService {
    private Logger log = Logger.getLogger(MatchRulesService.class);

    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;

    /*
     * 添加旧板匹配规则
     * */
    @Transactional
    public int addOldpanelMatchRules(String pCon1,String pCon2,String pCon3,String pCon4, String productFormatId,
                                        String oRan1,String oRan2,String oRan3,String oRan4, String oldpanelFormatId,
                                        String priority, String isCompleteMatch) {
        return insertProjectService.insertDataToTable("insert into oldpanel_match_rules (productFormatId,oldpanelFormatId," +
                "pCon1,pCon2,pCon3,pCon4,oRan1,oRan2,oRan3,oRan4,priority,isCompleteMatch,isValid) values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,productFormatId,oldpanelFormatId,pCon1,pCon2,pCon3,pCon4,oRan1,oRan2,oRan3,oRan4,priority,isCompleteMatch,"1");
    }








}

