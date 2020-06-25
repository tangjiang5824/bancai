package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AllExcelService;
import com.bancai.commonMethod.NewCondition;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
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
import com.bancai.yrd.service.Y_Upload_Data_Service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class Oldpanel_Data_Controller {

    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private Y_Upload_Data_Service y_Upload_Data_Service;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AllExcelService allExcelService;

    Logger log = Logger.getLogger(Oldpanel_Data_Controller.class);


    /*
     * 添加旧板基础信息
     * */
    @RequestMapping(value = "/oldpanel/addInfo.do")
    public boolean oldpanelAddInfo(String format, String info,HttpSession session) throws JSONException {
        String[] sFormat = format.split("");
        String[] sInfo = info.split("%");
        String tableName = "oldpanel_info";
        String sql = "insert into "+ tableName +" (oldpanelType,oldpanelFormat,formatInfo) values (?,?,?)";
        for (int i = 0; i < sFormat.length; i++) {
            if (sFormat[i].equals("1")){
                String type = sInfo[i];
                boolean isright= insertProjectService.insertIntoTableBySQL(sql,type,format,info);
                return isright;
            }
        }
        return false;

    }

    /*
     * 添加单个数据
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/oldpanel/addData.do")
    public boolean oldpanelAddData(String s, HttpSession session) {
        JSONArray jsonArray = new JSONArray(s);
        String tableName = "oldpanel_store";
//        int uploadId = Integer.parseInt(session.getAttribute("userid").toString());
        String uploadId = (String)session.getAttribute("userid");
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_addLog = "insert into oldpanellog (type,userId,time) values(?,?,?)";
        String sql_backLog = "insert into oldpanellog (type,userId,time,projectId) values(?,?,?,?)";
        JSONObject jsonBack = jsonArray.getJSONObject(0);
        String projectId;
        try{
            projectId = jsonBack.get("projectId")+"";
        }catch (JSONException e){
            projectId="";
        }
        int oldpanellogId;
        if(projectId.equals("")){
            oldpanellogId= insertProjectService.insertDataToTable(sql_addLog,"0",uploadId,simpleDateFormat.format(date));
        } else {
            oldpanellogId= insertProjectService.insertDataToTable(sql_backLog,"2",uploadId,simpleDateFormat.format(date),projectId);
        }
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            System.out.println(tableName + "第" + i + "个:userid=" + uploadId + "---" + jsonTemp);
            String oldpanelName=jsonTemp.get("oldpanelName")+"";
            String classificationId=jsonTemp.get("classificationId")+"";
            String inventoryUnit=jsonTemp.get("inventoryUnit")+"";
            String number=jsonTemp.get("number")+"";
            String warehouseNo=jsonTemp.get("warehouseNo")+"";
            String unitArea=jsonTemp.get("unitArea")+"";
            String unitWeight=jsonTemp.get("unitWeight")+"";
            String remark=jsonTemp.get("remark")+"";
            boolean result = y_Upload_Data_Service.oldpanelUpload(y_Upload_Data_Service.analyzeOldpanelName(oldpanelName),
                    oldpanelName,classificationId,inventoryUnit, number,warehouseNo,unitArea,unitWeight,remark,uploadId);
            if(!result){
                return false;
            }
            String sql_addLogDetail="insert into oldpanellogdetail (oldpanelName,count,oldpanellogId) values (?,?,?,?)";
            boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_addLogDetail,oldpanelName,number,String.valueOf(oldpanellogId));
            if(!is_log_right){
                return false;
            }
        }

//        JSONArray array = new JSONArray();
//        try {
//            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),uploadId,tableName,String.valueOf(oldpanellogId));
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
        return true;
    }

    /*
     * 上传excel文件
     * */

    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/uploadOldpanelExcel.do")
    public WebResponse uploadOldpanel(MultipartFile uploadFile, String tableName, HttpSession session) {
        WebResponse response = new WebResponse();
        String uploadId = (String) session.getAttribute("userid");
        Date date=new Date();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sql_addLog = "insert into oldpanellog (type,userId,time) values(?,?,?)";
        int oldpanellogId= insertProjectService.insertDataToTable(sql_addLog,"0",uploadId,simpleDateFormat.format(date));
        JSONArray array = new JSONArray();
        try {
            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),uploadId,tableName,String.valueOf(oldpanellogId));
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
//    public String oldpanelUploadData(MultipartFile uploadFile, HttpSession session) {
//        WebResponse response = new WebResponse();
//        String tableName = "oldpanel";
//        int userid = Integer.parseInt(session.getAttribute("userid").toString());
//        try {
//            UploadDataResult result = y_Upload_Data_Service.oldpanelUploadData(uploadFile.getInputStream(), tableName, userid);
//            response.setSuccess(result.success);
//            response.setErrorCode(result.errorCode);
//            response.setValue(result.data);
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            response.setSuccess(false);
//            response.setErrorCode(1000); //未知错误
//            response.setMsg(e.getMessage());
//        }
//        net.sf.json.JSONObject json = net.sf.json.JSONObject.fromObject(response);
//        return json.toString();
//    }

    /**
     * 查旧板表
     */
    @RequestMapping(value = "/oldpanel/updateData.do")
    public WebResponse oldpanelFindList(Integer start, Integer limit, String tableName, String oldpanelType) {
//            , String startLength, String endLength, String startWidth, String endWidth, String mType, HttpSession session){
//        log.debug("search["+tableName+"]length:"+startLength+"--"+endLength+";width"+startWidth+"--"+endWidth);

        log.debug("search[" + tableName + "]oldpanelType:" + oldpanelType);
        //根据输入的数据查询
        //DataList dataList = testAddService.findList(proName);
        //查询字段不为空
//        if((startLength !=null)||(endLength !=null)||(startWidth !=null)||(endWidth !=null)){
//            NewCondition c=new NewCondition();
//            if ((startLength.length() != 0)&&(endLength.length() != 0)&&(startWidth.length() != 0)&&(endWidth.length() != 0)) {
//                c.and(new NewCondition("长", " between", startLength, endLength));
//                c.and(new NewCondition("宽", " between", startWidth, endWidth));
//                c.and(new NewCondition("类型", "=", mType));
//            }
//            //调用函数，查询满足条件的所有数据
//            return queryService.queryPage(start, limit, c, tableName);
//        }
//        System.out.println(oldpanelType);
        if (oldpanelType != null&&!oldpanelType.equals("")) {
            NewCondition c = new NewCondition();
            WebResponse re = new WebResponse();
            if (oldpanelType.length() != 0) {
                c.and(new NewCondition("oldpanelType", "=", oldpanelType));
            }
            re = queryService.queryPage(start, limit, c, tableName);
            String typeTableName = "oldpaneltype";
//            System.out.println(re);
            re = y_Upload_Data_Service.ChangeQueryPageFromAToB(re, typeTableName, "oldpanelType", "oldpanelTypeName");
//                System.out.println(re);
            return re;

        }

//        System.out.println("-------------------------------------------------------33");
        return queryService.queryPage(start, limit, "select * from " + tableName);
    }
    /**
     * 下拉选择旧板类型
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/oldpanel/oldpanelType.do")
    public void findOldpanelType(HttpServletResponse response,String start,String limit) throws IOException, JSONException {
        if(null==start) start="0";
        if(null==limit) limit="50";
        DataList oldpanelTypeList = insertProjectService.findOldpanelType(start,limit);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(oldpanelTypeList);
        object.put("typeList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }



}
