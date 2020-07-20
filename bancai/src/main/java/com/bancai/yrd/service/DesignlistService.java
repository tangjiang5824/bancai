package com.bancai.yrd.service;

import com.bancai.cg.controller.new_panel_match;
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

import javax.script.ScriptException;
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
    @Autowired
    private new_panel_match new_panel_match;

    /**
     * 设计清单解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userId, String projectId, String buildingId,
                                             String buildingpositionId) throws IOException, ScriptException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
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
            setDesignlistOrigin(projectId,buildingId,buildingpositionId,String.valueOf(productId),position,0,0);
        }

        panelMatchService.matchBackProduct(projectId,buildingId,buildingpositionId);
        panelMatchService.matchPreprocess(projectId,buildingId,buildingpositionId);
        panelMatchService.matchOldpanel(projectId,buildingId,buildingpositionId);
        new_panel_match.match(Integer.parseInt(projectId),Integer.parseInt(buildingId),Integer.parseInt(buildingpositionId));
        result.success = panelMatchService.matchError(projectId,buildingId,buildingpositionId);
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

    @Transactional
    public void saveDepartmentWorkerData(String id, String departmentId, String workerName,String tel,boolean exist){
        if(exist){
            String sql1 = "update department_worker set departmentId=\""+departmentId+"\",workerName=\""+workerName+"\",tel=\""+tel+"\" where id=\""+id+"\"";
            jo.update(sql1);
        }else {
            String sql2 = "insert into department_worker (departmentId,workerName,tel) values (?,?,?)";
            insertProjectService.insertIntoTableBySQL(sql2,departmentId,workerName,tel);
        }
    }



}
