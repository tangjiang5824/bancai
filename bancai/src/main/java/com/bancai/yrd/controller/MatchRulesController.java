package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.MatchRulesService;
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
    @Autowired
    private MatchRulesService matchRulesService;

    Logger log = Logger.getLogger(MatchRulesController.class);
    private static String isPureNumber = "^-?[0-9]+";

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
    /*
     * 新增旧板匹配规则
     * */
    @RequestMapping(value = "/match/addOldpanelMatchRules.do")
    public boolean addOldpanelMatchRules(String productFormatId,String oldpanelFormatId,String priority,String isCompleteMatch,
                                         String s_product,String s_old, HttpSession session) throws JSONException {
        try {
            if(!priority.matches(isPureNumber))
                return false;
            if((isCompleteMatch==null)||isCompleteMatch.equals(""))
                return false;
            String userId = (String)session.getAttribute("userid");
            Date date=new Date();
            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            JSONArray jsonArrayP = new JSONArray(s_product);
            JSONObject jsonTempP = jsonArrayP.getJSONObject(0);
            String mValueP = (jsonTempP.get("mValueP")+"").trim();
            String nValueP = (jsonTempP.get("nValueP")+"").trim();
            String pValueP = (jsonTempP.get("pValueP")+"").trim();
            String aValueP = (jsonTempP.get("aValueP")+"").trim();
            String bValueP = (jsonTempP.get("bValueP")+"").trim();
            String mAngleP = (jsonTempP.get("mAngleP")+"").trim();
            String nAngleP = (jsonTempP.get("nAngleP")+"").trim();
            String pAngleP = (jsonTempP.get("pAngleP")+"").trim();
            String suffixP = (jsonTempP.get("suffixP")+"").trim();
            JSONArray jsonArrayO = new JSONArray(s_old);
            JSONObject jsonTempO = jsonArrayO.getJSONObject(0);
            String mValueO = (jsonTempO.get("mValueO")+"").trim();
            String nValueO = (jsonTempO.get("nValueO")+"").trim();
            String pValueO = (jsonTempO.get("pValueO")+"").trim();
            String aValueO = (jsonTempO.get("aValueO")+"").trim();
            String bValueO = (jsonTempO.get("bValueO")+"").trim();
            String mAngleO = (jsonTempO.get("mAngleO")+"").trim();
            String nAngleO = (jsonTempO.get("nAngleO")+"").trim();
            String pAngleO = (jsonTempO.get("pAngleO")+"").trim();
            String suffixO = (jsonTempO.get("suffixO")+"").trim();
            int oldpanelMatchRulesId = matchRulesService.addOldpanelMatchRules(productFormatId,oldpanelFormatId,priority,isCompleteMatch
                    ,mValueP,nValueP,pValueP,aValueP,bValueP,mAngleP,nAngleP,pAngleP,suffixP
                    ,mValueO,nValueO,pValueO,aValueO,bValueO,mAngleO,nAngleO,pAngleO,suffixO);
            String sql_addLog = "insert into oldpanel_match_ruleslog (oldpanelMatchRulesId,type,time,userId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLog,String.valueOf(oldpanelMatchRulesId)
                    ,"0",simpleDateFormat.format(date),userId);
            if(!is_log_right)
                return false;
        } catch (Exception e) {
            return false;
        }
        return true;
    }



//[{"mValueP":">200&<400","nValueP":"<=150","pValueP":"","aValueP":">150","bValueP":"","mAngleP":"1","nAngleP":"0","pAngleP":"","suffixP":"#LA","id":"extModel254-1"}]
//[{"mValueO":"20&100","nValueO":"10&50","pValueO":"","aValueO":"0&0","bValueO":"0&0","mAngleO":"2","nAngleO":"0","pAngleO":"","suffixO":"#LA","id":"extModel254-1"}]
}
