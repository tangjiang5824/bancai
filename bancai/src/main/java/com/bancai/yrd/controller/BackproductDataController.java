package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.BackproductDataService;
import com.bancai.yrd.service.ProductDataService;
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
public class BackproductDataController {
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
    @Autowired
    private BackproductDataService backproductDataService;

    Logger log = Logger.getLogger(BackproductDataController.class);

    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/backproduct/addData.do")
    public boolean backproductAddData(String s, String projectId, String buildingId, String operator, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
        String userId = (String) session.getAttribute("userid");
//        String userId ="1";
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_backLog = "insert into backproduct_log (type,userId,time,projectId,buildingId,operator) values(?,?,?,?,?,?)";
        int backproductlogId = insertProjectService.insertDataToTable(sql_backLog, "2", userId, simpleDateFormat.format(date), projectId, buildingId, operator);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            System.out.println("第" + i + "个:userid=" + userId + "---" + jsonTemp);
            String productName = (jsonTemp.get("productName") + "").toUpperCase();
            String warehouseName = jsonTemp.get("warehouseName") + "";
            String count = jsonTemp.get("count") + "";
            int[] productId = backproductDataService.backProduct(productName, warehouseName, count);
            if (productId[0] == 0) {
                return false;
            }
            String sql_addLogDetail = "insert into backproduct_logdetail (productId,count,backproductlogId,backproductstoreId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail, String.valueOf(productId[0]),
                    count, String.valueOf(backproductlogId),String.valueOf(productId[1]));
            if (!is_log_right) {
                return false;
            }
        }
        return true;
    }
//    /*
//     * 上传excel文件
//     * */
//
//    //produces = {"text/html;charset=UTF-8"}
//    @RequestMapping(value = "/backproduct/uploadExcel.do")
//    public WebResponse uploadOldpanel(MultipartFile uploadFile, String projectId, String buildingId, String operator, HttpSession session) {
//        WebResponse response = new WebResponse();
//        String userId = (String) session.getAttribute("userid");
//        Date date=new Date();
//        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String sql_addLog = "insert into backproduct_log (type,userId,time,projectId,buildingId,operator) values(?,?,?,?,?,?)";
//        int backproductlogId= insertProjectService.insertDataToTable(sql_addLog,"0",userId,simpleDateFormat.format(date),projectId,buildingId,operator);
//        try {
//            UploadDataResult result = allExcelService.uploadBackproductExcelData(uploadFile.getInputStream(),userId,backproductlogId);
//            response.put("value",result.dataList);
//            response.put("totalCount", result.dataList.size());
//        } catch (IOException e) {
//            e.printStackTrace();
//            response.setSuccess(false);
//            response.setErrorCode(1000); //未知错误
//            response.setMsg(e.getMessage());
//        }
//        System.out.println(response.get("success"));
//        System.out.println(response.get("value"));
//        return response;
//    }


}
