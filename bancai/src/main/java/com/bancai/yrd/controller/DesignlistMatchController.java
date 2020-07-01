package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.Y_Upload_Data_Service;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.TableService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class DesignlistMatchController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AllExcelService allExcelService;
    @Autowired
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private PanelMatchService panelMatchService;

    Logger log = Logger.getLogger(Oldpanel_Data_Controller.class);

    /*
     * 上传设计清单
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/designlist/uploadExcel.do")
    public WebResponse uploadDesignlist(MultipartFile uploadFile, String projectId, String buildingId, String operator, HttpSession session) {
        WebResponse response = new WebResponse();
        String uploadId = (String) session.getAttribute("userid");
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_addLog = "insert into oldpanellog (type,userId,time,operator) values(?,?,?,?)";
        int oldpanellogId= insertProjectService.insertDataToTable(sql_addLog,"0",uploadId,simpleDateFormat.format(date),operator);
        JSONArray array = new JSONArray();
        try {
            UploadDataResult result = allExcelService.uploadOldpanelExcelData(uploadFile.getInputStream(),uploadId,String.valueOf(oldpanellogId));
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());
        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        System.out.println(response.get("success"));
        System.out.println(response.get("value"));
        return response;
    }



}
