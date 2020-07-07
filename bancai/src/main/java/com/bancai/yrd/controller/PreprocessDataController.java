package com.bancai.yrd.controller;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.BackproductDataService;
import com.bancai.yrd.service.PreprocessDataService;
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
public class PreprocessDataController {
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
    private PreprocessDataService preprocessDataService;

    Logger log = Logger.getLogger(PreprocessDataController.class);
    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/preprocess/addData.do")
    public boolean preprocessAddData(String s, String operator, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
//        String userId = (String) session.getAttribute("userid");
        String userId ="1";
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_backLog = "insert into preprocess_log (type,userId,time,operator) values(?,?,?,?)";
        int preprocesslogId = insertProjectService.insertDataToTable(sql_backLog, "0", userId, simpleDateFormat.format(date), operator);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            System.out.println("第" + i + "个:userid=" + userId + "---" + jsonTemp);
            String productName = (jsonTemp.get("productName") + "").toUpperCase();
            String warehouseName = jsonTemp.get("warehouseName") + "";
            String count = jsonTemp.get("count") + "";
            int[] productId = preprocessDataService.preprocessInbound(productName, warehouseName, count);
            if (productId[0] == 0) {
                return false;
            }
            String sql_addLogDetail = "insert into preprocess_logdetail (productId,count,preprocesslogId,preprocessstoreId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail, String.valueOf(productId[0]),
                    count, String.valueOf(preprocesslogId), String.valueOf(productId[1]));
            if (!is_log_right) {
                return false;
            }
        }
        return true;
    }

}
