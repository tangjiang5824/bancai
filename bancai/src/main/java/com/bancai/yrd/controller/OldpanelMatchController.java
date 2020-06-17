package com.bancai.yrd.controller;

import com.bancai.commonMethod.QueryAllService;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.TableService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
public class OldpanelMatchController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private com.bancai.yrd.service.OldpanelMatchService OldpanelMatchService;

    Logger log=Logger.getLogger(OldpanelMatchController.class);

    /*
     * 上传cad导出的excel文件
     * */

    @RequestMapping(value = "/oldpanel/uploadMatchExcel.do")
    public WebResponse oldpanelUploadMatchData(MultipartFile uploadFile, String projectId, String buildingId, HttpSession session) {
        WebResponse response = new WebResponse();
//        String tableName = "oldpanel";
//        int userid = Integer.parseInt(session.getAttribute("userid").toString());
//        int projectid = Integer.parseInt(projectId);
//        int buildingid = Integer.parseInt(buildingId);
        System.out.println(projectId+"==="+buildingId);
        try {
            UploadDataResult result = OldpanelMatchService.oldpanelUploadMatchData(uploadFile.getInputStream(), projectId, buildingId);
            response.setSuccess(result.success);
            response.setErrorCode(result.errorCode);
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());

        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        //net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
        return response;
    }


}
