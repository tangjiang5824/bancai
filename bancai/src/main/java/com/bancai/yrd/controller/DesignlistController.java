package com.bancai.yrd.controller;

import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import org.apache.log4j.Logger;
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
public class DesignlistController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private PanelMatchService panelMatchService;

    Logger log=Logger.getLogger(DesignlistController.class);

    /*
     * 上传excel文件designlist
     * */

    @RequestMapping(value = "/designlist/uploadExcel.do")
    public WebResponse oldpanelUploadMatchData(MultipartFile uploadFile, String projectId, String buildingId, String buildingpositionId, HttpSession session) {
        WebResponse response = new WebResponse();
        String userId = (String)session.getAttribute("userid");
        try {
            UploadDataResult result = panelMatchService.uploadDesignlist(uploadFile.getInputStream(), userId, projectId, buildingId, buildingpositionId);
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
