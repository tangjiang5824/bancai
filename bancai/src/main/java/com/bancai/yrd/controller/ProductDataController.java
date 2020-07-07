package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.ProductDataService;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class ProductDataController {
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
    private ProductDataService productDataService;

    Logger log = Logger.getLogger(ProductDataController.class);

    /*
     * 新增产品品名格式
     * */
    @RequestMapping(value = "/product/addFormat.do")
    public boolean productAddFormat(String productTypeId, String productFormat, HttpSession session) throws JSONException {
        try {
            int formatId = productDataService.productAddNewFormat(productTypeId, productFormat);
            if (formatId == 0) {
                return false;//已经存在
            }
            String userId = (String) session.getAttribute("userid");
            Date date = new Date();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String sql_addLog = "insert into format_log (type,formatId,userId,time) values(?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLog,
                    "1",String.valueOf(formatId), userId, simpleDateFormat.format(date));
            if (!is_log_right) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /*
     * 新增产品基础信息
     * */
    @RequestMapping(value = "/product/addInfo.do")
    public boolean productAddInfo(String s, HttpSession session) throws JSONException {
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            Date date = new Date();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String sql_addLog = "insert into product_log (type,userId,time) values(?,?,?)";
            int productlogId = insertProjectService.insertDataToTable(sql_addLog, "6", userId, simpleDateFormat.format(date));
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个---" + jsonTemp);
                String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
//                String classificationId = jsonTemp.get("classificationId") + "";
                String inventoryUnit = jsonTemp.get("inventoryUnit") + "";
                String unitWeight = jsonTemp.get("unitWeight") + "";
                String unitArea = jsonTemp.get("unitArea") + "";
                String remark = jsonTemp.get("remark") + "";
                int productId = productDataService.productAddNewInfo(productName, inventoryUnit,
                        unitWeight, unitArea, remark, userId);
                if (productId == 0) {
                    return false;//已经存在
                }
                String sql_addLogDetail = "insert into product_logdetail (productlogId,productId) values (?,?)";
                boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
                        String.valueOf(productlogId), String.valueOf(productId));
                if (!is_log_right) {
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/product/addData.do")
    public boolean productAddData(String s, String projectId, String buildingId, String operator, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
        String userId = (String) session.getAttribute("userid");
//        String userId ="1";
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_backLog = "insert into product_log (type,userId,time,projectId,buildingId,operator) values(?,?,?,?,?,?)";
        int productlogId = insertProjectService.insertDataToTable(sql_backLog, "2", userId, simpleDateFormat.format(date)
                , projectId, buildingId, operator);
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            System.out.println("第" + i + "个:userid=" + userId + "---" + jsonTemp);
            String productName = (jsonTemp.get("productName") + "").trim().toUpperCase();
            String warehouseName = jsonTemp.get("warehouseName") + "";
            String count = jsonTemp.get("count") + "";
            int[] productId = productDataService.addProduct(productName, warehouseName, count);
            if (productId[0] == 0) {
                return false;
            }
            String sql_addLogDetail = "insert into product_logdetail (productId,count,productlogId,productstoreId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail, String.valueOf(productId[0]),
                    count, String.valueOf(productlogId),String.valueOf(productId[1]));
            if (!is_log_right) {
                return false;
            }
        }
        return true;
    }
    /*
     * 产品库存查询
     * */
    @RequestMapping(value = "/product/queryData.do")
    public WebResponse query_data(Integer start, Integer limit, String tableName,String productTypeId,
                                  String maxCount,String minCount,String warehouseName) throws ParseException {
        if(null==start||start.equals("")) start=0;
        if(null==limit||limit.equals("")) limit=50;
        mysqlcondition c=new mysqlcondition();
        if (productTypeId.length() != 0) {
            c.and(new mysqlcondition("productTypeId", "=", productTypeId));
        }
        if (warehouseName.length() != 0) {
            c.and(new mysqlcondition("warehouseName", "=", warehouseName));
        }
        if (maxCount.length() != 0) {
            c.and(new mysqlcondition("countUse", "<=", maxCount));
        }
        if (minCount.length() != 0) {
            c.and(new mysqlcondition("countUse", ">=", minCount));
        }
        if (maxCount.length() != 0) {
            c.and(new mysqlcondition("countStore", "<=", maxCount));
        }
        if (minCount.length() != 0) {
            c.and(new mysqlcondition("countStore", ">=", minCount));
        }
        WebResponse wr=queryService.queryDataPage(start, limit, c, tableName);
        return wr;
    }




}
