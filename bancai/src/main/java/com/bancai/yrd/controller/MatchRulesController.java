package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
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
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class MatchRulesController {
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private PanelMatchService panelMatchService;
    @Autowired
    private ProductDataService productDataService;
    @Autowired
    private Y_Upload_Data_Service y_upload_data_service;

    Logger log = Logger.getLogger(MatchRulesController.class);

    /*
     * 查询所有的产品类型
     * */
    @RequestMapping(value="/match/findProductTypeList.do")
    public void findProductType(HttpServletResponse response) throws IOException, JSONException {
        DataList typeList = productDataService.findProductTypeList();
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(typeList);
        object.put("productTypeList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
    /*
     * 根据类型id查询所有的产品格式
     * */
    @RequestMapping(value="/match/findProductFormatList.do")
    public void findProductFormat(String productTypeId, HttpServletResponse response) throws IOException, JSONException {
        DataList formatList = productDataService.findProductFormatList(productTypeId);
        
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(formatList);
        object.put("productFormatList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
    /*
     * 查询所有的旧板类型
     * */
    @RequestMapping(value="/match/findOldpanelTypeList.do")
    public void findOldpanelType(HttpServletResponse response) throws IOException, JSONException {
        DataList typeList = y_upload_data_service.findOldpanelTypeList();
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(typeList);
        object.put("oldpanelTypeList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
    /*
     * 根据类型id查询所有的旧板格式
     * */
    @RequestMapping(value="/match/findOldpanelFormatList.do")
    public void findOldpanelFormat(String oldpanelTypeId, HttpServletResponse response) throws IOException, JSONException {
        DataList formatList = y_upload_data_service.findOldpanelFormatList(oldpanelTypeId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(formatList);
        object.put("oldpanelFormatList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
}
