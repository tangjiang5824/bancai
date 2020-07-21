package com.bancai.yrd.controller;

import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.DesignlistService;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.TableService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
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
    @Autowired
    private DesignlistService designlistService;

    private static String isPureNumber = "^-?[0-9]+";
    Logger log=Logger.getLogger(DesignlistController.class);

    /*
     * 上传excel文件designlist
     * */
    @RequestMapping(value = "/designlist/uploadExcel.do")
    public WebResponse oldpanelUploadMatchData(MultipartFile uploadFile, String projectId, String buildingId, String buildingpositionId, HttpSession session) {
        WebResponse response = new WebResponse();
        String userId = (String)session.getAttribute("userid");
        try {
            UploadDataResult result = designlistService.uploadDesignlist(uploadFile.getInputStream(), userId, projectId, buildingId, buildingpositionId);
            response.setSuccess(result.success);
            response.setErrorCode(result.errorCode);
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());

        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        //net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
        return response;
    }
    /*
     * 添加或更新操作员信息
     * */
    @RequestMapping("/department/addOrUpdateWorkerInfo.do")
    public boolean addOrUpdateWorkerInfo(String id, String departmentId, String workerName,String tel){
        workerName = workerName.trim();
        tel = tel.trim();
        boolean exist = false;
        if(id.matches(isPureNumber)){
            DataList list = queryService.query("select * from department_worker where id=?",id);
            if(!list.isEmpty())
                exist = true;
        }
        System.out.println(id+"==="+departmentId+"==="+workerName+"==="+tel);
        designlistService.saveDepartmentWorkerData(id,departmentId,workerName,tel,exist);
        return true;
    }

    /*
     * 查询工单
     * */
    @RequestMapping("/order/queryWorkOrder.do")
    public void queryWorkOrder(String projectId, String buildingId, String buildingpositionId,
                               HttpServletResponse response) throws IOException, JSONException {
        DataList workOrderList = designlistService.findWorkOrder(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(workOrderList);
        object.put("workOrderList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }



}
