package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.*;
import com.bancai.domain.DataList;
import com.bancai.vo.WebResponse;
import com.bancai.yrd.service.MatchRulesService;
import com.bancai.yrd.service.ProductDataService;
import com.bancai.yrd.service.OldpanelDataService;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    private OldpanelDataService oldpanel_data_service;
    @Autowired
    private MatchRulesService matchRulesService;

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
        DataList typeList = oldpanel_data_service.findOldpanelTypeList();
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
        DataList formatList = oldpanel_data_service.findOldpanelFormatList(oldpanelTypeId);
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
    @ApiOperation("新增旧板匹配规则")
    @RequestMapping(value = "/match/addOldpanelMatchRules.do")
    public WebResponse addOldpanelMatchRules(String productFormatId, String oldpanelFormatId, String priority, String isCompleteMatch,
                                             String isVaild, String s_product, String s_old, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            if(analyzeNameService.isStringNotPureNumber(priority)){
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("优先级内容错误");
                return response;
            }
            if((isCompleteMatch==null)||isCompleteMatch.equals("")){
                response.setSuccess(false);
                response.setErrorCode(200);
                response.setMsg("完全匹配内容错误");
                return response;
            }
            if((isVaild==null)||isVaild.equals("")){
                response.setSuccess(false);
                response.setErrorCode(300);
                response.setMsg("有效性内容错误");
                return response;
            }
            String userId = (String)session.getAttribute("userid");
            JSONArray jsonArrayP = new JSONArray(s_product);
            JSONObject jsonTempP = jsonArrayP.getJSONObject(0);
            String pm1 = (jsonTempP.get("pm1")+"").trim();
            String pm2 = (jsonTempP.get("pm2")+"").trim();
            String pn1 = (jsonTempP.get("pn1")+"").trim();
            String pn2 = (jsonTempP.get("pn2")+"").trim();
            String pp1 = (jsonTempP.get("pp1")+"").trim();
            String pp2 = (jsonTempP.get("pp2")+"").trim();
            String pa1 = (jsonTempP.get("pa1")+"").trim();
            String pa2 = (jsonTempP.get("pa2")+"").trim();
            String pb1 = (jsonTempP.get("pb1")+"").trim();
            String pb2 = (jsonTempP.get("pb2")+"").trim();
            String pma = (jsonTempP.get("pma")+"").trim();
            String pna = (jsonTempP.get("pna")+"").trim();
            String ppa = (jsonTempP.get("ppa")+"").trim();
            String ps = (jsonTempP.get("ps")+"").trim().toUpperCase();
            if(analyzeNameService.isStringNotPureNumber(pma))
                pma = "0";
            if(analyzeNameService.isStringNotPureNumber(pna))
                pna = "0";
            if(analyzeNameService.isStringNotPureNumber(ppa))
                ppa = "0";
            JSONArray jsonArrayO = new JSONArray(s_old);
            JSONObject jsonTempO = jsonArrayO.getJSONObject(0);
            String om1 = (jsonTempO.get("om1")+"").trim();
            String om2 = (jsonTempO.get("om2")+"").trim();
            String on1 = (jsonTempO.get("on1")+"").trim();
            String on2 = (jsonTempO.get("on2")+"").trim();
            String op1 = (jsonTempO.get("op1")+"").trim();
            String op2 = (jsonTempO.get("op2")+"").trim();
            String oa1 = (jsonTempO.get("oa1")+"").trim();
            String oa2 = (jsonTempO.get("oa2")+"").trim();
            String ob1 = (jsonTempO.get("ob1")+"").trim();
            String ob2 = (jsonTempO.get("ob2")+"").trim();
            String oma = (jsonTempO.get("oma")+"").trim();
            String ona = (jsonTempO.get("ona")+"").trim();
            String opa = (jsonTempO.get("opa")+"").trim();
            String os = (jsonTempO.get("os")+"").trim().toUpperCase();
            if(analyzeNameService.isStringNotPureNumber(oma))
                oma = "0";
            if(analyzeNameService.isStringNotPureNumber(ona))
                ona = "0";
            if(analyzeNameService.isStringNotPureNumber(opa))
                opa = "0";
            int oldpanelMatchRulesId = matchRulesService.addOldpanelMatchRules(productFormatId,oldpanelFormatId,priority,isCompleteMatch,isVaild
                    ,pm1,pm2,pn1,pn2,pp1,pp2,pa1,pa2,pb1,pb2,pma,pna,ppa,ps
                    ,om1,om2,on1,on2,op1,op2,oa1,oa2,ob1,ob2,oma,ona,opa,os);
            String sql_addLog = "insert into oldpanel_match_ruleslog (oldpanelMatchRulesId,type,time,userId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLog,String.valueOf(oldpanelMatchRulesId)
                    ,"0",analyzeNameService.getTime(),userId);
            if(!is_log_right){
                response.setSuccess(false);
                response.setErrorCode(300);//插入表错误
                return response;
            }
            response.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }
    @RequestMapping(value = "/match/addOldpanelMatchRules1.do")
    public WebResponse addOldpanelMatchRules1(String productFormatId, String oldpanelFormatId, String priority, String isCompleteMatch,
                                             String s_product, String s_old, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            if(analyzeNameService.isStringNotPureNumber(priority)){
                response.setSuccess(false);
                response.setErrorCode(100);//优先级错误
                return response;
            }
            if((isCompleteMatch==null)||isCompleteMatch.equals("")){
                response.setSuccess(false);
                response.setErrorCode(200);//是否完全匹配错误
                return response;
            }
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
            String suffixP = (jsonTempP.get("suffixP")+"").trim().toUpperCase();
            if(analyzeNameService.isStringNotPureNumber(mAngleP))
                mAngleP = "0";
            if(analyzeNameService.isStringNotPureNumber(nAngleP))
                nAngleP = "0";
            if(analyzeNameService.isStringNotPureNumber(pAngleP))
                pAngleP = "0";
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
            String suffixO = (jsonTempO.get("suffixO")+"").trim().toUpperCase();
            if(analyzeNameService.isStringNotPureNumber(mAngleO))
                mAngleO = "0";
            if(analyzeNameService.isStringNotPureNumber(nAngleO))
                nAngleO = "0";
            if(analyzeNameService.isStringNotPureNumber(pAngleO))
                pAngleO = "0";
            int oldpanelMatchRulesId = matchRulesService.addOldpanelMatchRules1(productFormatId,oldpanelFormatId,priority,isCompleteMatch
                    ,mValueP,nValueP,pValueP,aValueP,bValueP,mAngleP,nAngleP,pAngleP,suffixP
                    ,mValueO,nValueO,pValueO,aValueO,bValueO,mAngleO,nAngleO,pAngleO,suffixO);
            String sql_addLog = "insert into oldpanel_match_ruleslog (oldpanelMatchRulesId,type,time,userId) values (?,?,?,?)";
            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLog,String.valueOf(oldpanelMatchRulesId)
                    ,"0",simpleDateFormat.format(date),userId);
            if(!is_log_right){
                response.setSuccess(false);
                response.setErrorCode(300);//插入表错误
                return response;
            }
            response.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }



//[{"mValueP":">200&<400","nValueP":"<=150","pValueP":"","aValueP":">150","bValueP":"","mAngleP":"1","nAngleP":"0","pAngleP":"","suffixP":"#LA","id":"extModel254-1"}]
//[{"mValueO":"20&100","nValueO":"10&50","pValueO":"","aValueO":"0&0","bValueO":"0&0","mAngleO":"2","nAngleO":"0","pAngleO":"","suffixO":"#LA","id":"extModel254-1"}]
}
