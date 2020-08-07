package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AllExcelService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.NewCondition;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
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
import com.bancai.yrd.service.OldpanelDataService;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

@RestController
public class OldpanelDataController {

    @Autowired
    private QueryAllService queryService;
    @Autowired
    private OldpanelDataService oldpanelDataService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private AllExcelService allExcelService;
    @Autowired
    private AnalyzeNameService analyzeNameService;

    Logger log = Logger.getLogger(OldpanelDataController.class);
    private static String isPureNumber = "[0-9]+";

    /*
     * 新增旧板品名格式
     * */
    @RequestMapping(value = "/oldpanel/addFormat.do")
    public WebResponse oldpanelAddFormat(String s, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String typeId=jsonTemp.get("oldpanelTypeId")+"";
                String format1=jsonTemp.get("format1")+"";
                String format2=jsonTemp.get("format2")+"";
                String format3=jsonTemp.get("format3")+"";
                String format4=jsonTemp.get("format4")+"";
                String format = format1+format2+format3+format4;
                map.put("oldpanelTypeId",typeId);
                map.put("format1",format1);
                map.put("format2",format2);
                map.put("format3",format3);
                map.put("format4",format4);
                if((typeId.equals("null"))||(typeId.length()==0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未选择类型",map);
                else if((format.length()!=4)||(!format.matches(isPureNumber)))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"格式错误或选择不完全",map);
                else if(analyzeNameService.isFormatExist("oldpanel",typeId,format)!=0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"此格式已存在",map);
                else
                    insertList = oldpanelDataService.oldpanelAddInsertRowToFormatList(insertList,typeId,format);
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            boolean uploadResult = oldpanelDataService.oldpanelAddNewFormat(insertList,userId);
            response.setSuccess(uploadResult);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
//        try {
//            JSONArray jsonArray = new JSONArray(s);
//            JSONObject jsonTemp = jsonArray.getJSONObject(0);
//            String oldpanelTypeId=jsonTemp.get("oldpanelTypeId")+"";
//            String format1=jsonTemp.get("format1")+"";
//            String format2=jsonTemp.get("format2")+"";
//            String format3=jsonTemp.get("format3")+"";
//            String format4=jsonTemp.get("format4")+"";
//            String oldpanelFormat = format1+format2+format3+format4;
//            int formatId = oldpanelDataService.oldpanelAddNewFormat(oldpanelTypeId, oldpanelFormat);
//            if (formatId == 0) {
//                return false;//已经存在
//            }
//            String userId = (String) session.getAttribute("userid");
//            Date date = new Date();
//            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//            String sql_addLog = "insert into format_log (type,formatId,userId,time) values(?,?,?,?)";
//            boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLog,
//                    "2", String.valueOf(formatId),userId,simpleDateFormat.format(date));
//            if (!is_log_right) {
//                return false;
//            }
//        } catch (Exception e) {
//            return false;
//        }
//        return true;
    }

    /*
     * 添加旧板基础信息
     * */
    @RequestMapping(value = "/oldpanel/addInfo.do")
    public WebResponse oldpanelAddInfo(String s, HttpSession session) throws JSONException {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                String id = jsonTemp.get("id")+"";
                String oldpanelName = (jsonTemp.get("oldpanelName") + "").trim().toUpperCase();
                String inventoryUnit = (jsonTemp.get("inventoryUnit") + "").trim().toUpperCase();
                String unitWeight = (jsonTemp.get("unitWeight") + "").trim().toUpperCase();
                String unitArea = (jsonTemp.get("unitArea") + "").trim().toUpperCase();
                String remark = jsonTemp.get("remark") + "";
                map.put("oldpanelName",oldpanelName);
                map.put("inventoryUnit",inventoryUnit);
                map.put("unitWeight",unitWeight);
                map.put("unitArea",unitArea);
                map.put("remark",remark);
                if(analyzeNameService.isInfoExist("oldpanel",oldpanelName)!=0)
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"已经存在这种旧板",map);
                else if(((unitWeight.split("\\.").length==1)&&(!unitWeight.matches(isPureNumber)))||
                        ((unitWeight.split("\\.").length==2)&&(
                                (!unitWeight.split("\\.")[0].matches(isPureNumber))||(!unitWeight.split("\\.")[1].matches(isPureNumber))
                        ))||((unitWeight.split("\\.").length!=1)&&((unitWeight.split("\\.").length!=2))))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"重量输入有误",map);
                else if(((unitArea.split("\\.").length==1)&&(!unitArea.matches(isPureNumber)))||
                        ((unitArea.split("\\.").length==2)&&(
                                (!unitArea.split("\\.")[0].matches(isPureNumber))||(!unitArea.split("\\.")[1].matches(isPureNumber))
                        ))||((unitArea.split("\\.").length!=1)&&((unitArea.split("\\.").length!=2))))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"面积输入有误",map);
                else{
                    String[] a = analyzeNameService.analyzeOldpanelName(oldpanelName);
                    if(a==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"未找到这种旧板类型",map);
                    else {
                        int formatId = analyzeNameService.isFormatExist("oldpanel", a[1], a[0]);
                        if (formatId == 0)
                            errorList = analyzeNameService.addErrorRowToErrorList(errorList, id, "未找到这种旧板格式",map);
                        else
                            insertList = oldpanelDataService.oldpanelAddInsertRowToInfoList(insertList, String.valueOf(formatId), oldpanelName, inventoryUnit,
                                    unitWeight, unitArea, remark, a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12]);
                    }
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            boolean uploadResult = oldpanelDataService.oldpanelAddNewInfo(insertList,userId);
            response.setSuccess(uploadResult);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误或品名错误
            response.setMsg(e.getMessage());
        }
        return response;
//        try{
//            JSONArray jsonArray = new JSONArray(s);
//            String userId = (String)session.getAttribute("userid");
//            String sql_addLog = "insert into oldpanel_log (type,userId,time,isrollback) values(?,?,?,?)";
//            int oldpanellogId= insertProjectService.insertDataToTable(sql_addLog,"6",userId,analyzeNameService.getTime(),"0");
//            for (int i = 0; i < jsonArray.length(); i++) {
//                JSONObject jsonTemp = jsonArray.getJSONObject(i);
//                System.out.println("第" + i + "个---" + jsonTemp);
//                String oldpanelName=(jsonTemp.get("oldpanelName")+"").trim().toUpperCase();
////                String classificationId=jsonTemp.get("classificationId")+"";
//                String inventoryUnit=jsonTemp.get("inventoryUnit")+"";
//                String unitWeight=jsonTemp.get("unitWeight")+"";
//                String unitArea=jsonTemp.get("unitArea")+"";
//                String remark=jsonTemp.get("remark")+"";
//                int oldpanelId =  oldpanelDataService.oldpanelAddNewInfo(oldpanelName,inventoryUnit,
//                        unitWeight,unitArea,remark,userId);
//                if(oldpanelId==0){
//                    return false;//已经存在这种旧板
//                }
//                String sql_addLogDetail="insert into oldpanel_logdetail (oldpanellogId,oldpanelId,isrollback) values (?,?,?)";
//                boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
//                        String.valueOf(oldpanellogId),String.valueOf(oldpanelId),"0");
//                if(!is_log_right){
//                    return false;
//                }
//            }
//        }catch (Exception e){
//            return false;
//        }
//        return true;
    }

    /*
     * 旧板入库
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/oldpanel/addData.do")
    public WebResponse oldpanelAddData(String s,String operator,String inputTime, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            //检查
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            System.out.println("[===checkOldpanelUploadData===]");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个:" + jsonTemp);
                String id = jsonTemp.get("id")+"";
                String oldpanelName = (jsonTemp.get("oldpanelName") + "").trim().toUpperCase();
                String warehouseName = (jsonTemp.get("warehouseName") + "").trim().toUpperCase();
                String count = (jsonTemp.get("count") + "").trim();
                String remark = (jsonTemp.get("remark") + "").trim();
                map.put("oldpanelName",oldpanelName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                map.put("remark",remark);
                if((!count.matches(isPureNumber))||(Integer.parseInt(count)<=0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] oldpanelId = analyzeNameService.isInfoExistBackUnit("oldpanel",oldpanelName);
                    if(oldpanelId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该旧板的基础信息",map);
                    else
                        insertList = oldpanelDataService.oldpanelAddInsertRowToInboundList(insertList,oldpanelId[0],warehouseName,count,remark,oldpanelId[1],oldpanelId[2]);
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.setMsg("提交的数据存在错误内容");
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                return response;
            }
            System.out.println("[===checkOldpanelUploadData==Complete=NoError]");
            boolean uploadResult= oldpanelDataService.insertOldpanelDataToStore(insertList,userId,operator,inputTime);
            response.setSuccess(uploadResult);
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }
    /*
     * 旧板退库
     * */
    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/oldpanel/backData.do")
    public WebResponse oldpanelBackData(String s, String projectId, String buildingId, String operator,String description,String inputTime, HttpSession session) {
        WebResponse response = new WebResponse();
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String) session.getAttribute("userid");
            //检查
            if(jsonArray.length()==0){
                response.setSuccess(false);
                response.setErrorCode(100); //提交的s为空
                response.setMsg("提交的数据为空");
                return response;
            }
            if((projectId==null)||(projectId.length()==0)||(buildingId==null)||(buildingId.length()==0)||(operator==null)||(operator.length()==0)||(description==null)||(description.length()==0)){
                response.setSuccess(false);
                response.setErrorCode(300); //项目或楼栋或退料原因或退料人为空
                response.setMsg("未选择项目或楼栋或退料原因或退料人");
                return response;
            }
            DataList errorList = new DataList();
            DataList insertList = new DataList();
            HashMap<String,String> map = new HashMap<>();
            System.out.println("[===checkOldpanelUploadData===]");
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个:" + jsonTemp);
                String id = jsonTemp.get("id")+"";
                String oldpanelName = (jsonTemp.get("oldpanelName") + "").trim().toUpperCase();
                String backWarehouseName = (jsonTemp.get("backWarehouseName") + "").trim().toUpperCase();
                String warehouseName = (jsonTemp.get("warehouseName") + "").trim().toUpperCase();
                String count = (jsonTemp.get("count") + "").trim();
                String remark = (jsonTemp.get("remark") + "").trim();
                if(warehouseName.equals("NULL")||warehouseName.length()==0)
                    warehouseName = "退料仓";
                map.put("oldpanelName",oldpanelName);
                map.put("backWarehouseName",backWarehouseName);
                map.put("warehouseName",warehouseName);
                map.put("count",count);
                map.put("remark",remark);
                if((!count.matches(isPureNumber))||(Integer.parseInt(count)<=0))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"输入数量不为正整数",map);
                else if(analyzeNameService.isWarehouseNameNotExist(warehouseName))
                    errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"仓库名不存在",map);
                else {
                    String [] oldpanelId = analyzeNameService.isInfoExistBackUnit("oldpanel",oldpanelName);
                    if(oldpanelId==null)
                        errorList = analyzeNameService.addErrorRowToErrorList(errorList,id,"没有该旧板的基础信息",map);
                    else
                        insertList = oldpanelDataService.oldpanelAddInsertRowToBackList(insertList,oldpanelId[0],backWarehouseName,warehouseName,count,remark,oldpanelId[1],oldpanelId[2]);
                }
            }
            if(!errorList.isEmpty()){
                response.setSuccess(false);
                response.setErrorCode(200);//提交的s存在错误内容
                response.put("errorList",errorList);
                response.put("errorCount",errorList.size());
                response.setMsg("提交的数据存在错误内容");
                return response;
            }
            System.out.println("[===checkOldpanelUploadData==Complete=NoError]");
            boolean uploadResult= oldpanelDataService.insertOldpanelDataBackStore(insertList,userId,operator,projectId,buildingId,description,inputTime);
            response.setSuccess(uploadResult);
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }

    /*
     * 旧板入库上传excel文件
     * */

    //produces = {"text/html;charset=UTF-8"}
    @RequestMapping(value = "/oldpanel/uploadExcel.do")
    public WebResponse uploadOldpanel(MultipartFile uploadFile) {
        WebResponse response = new WebResponse();
        try {
            UploadDataResult result = allExcelService.uploadOldpanelExcelData(uploadFile.getInputStream());
            response.put("dataList",result.dataList);
            response.put("listSize", result.dataList.size());
            response.setSuccess(true);
        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
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
            re = oldpanelDataService.ChangeQueryPageFromAToB(re, typeTableName, "oldpanelType", "oldpanelTypeName");
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

    /*
     * 旧板入库撤销
     * */
    @RequestMapping("/oldpanel/addDataRollback.do")
    public WebResponse wasteAddDataRollback(String oldpanellogId,String operator,HttpSession session){
        WebResponse response = new WebResponse();
        try {
            DataRow row = analyzeNameService.canRollback("oldpanel_log",oldpanellogId);
            if(!row.isEmpty()){
                String userId = (String) session.getAttribute("userid");
                String projectId = row.get("projectId").toString();
                String buildingId = row.get("buildingId").toString();
                String time = row.get("time").toString();
                if(!analyzeNameService.isFitRollbackTime(time)){
                    response.setSuccess(false);
                    response.setErrorCode(200);
                    response.setMsg("无法撤销，超过可撤销时间");
                }
//                boolean result = productDataService.rollbackWasteData(wasteLogId,operator,userId,projectId,buildingId);
//                response.setSuccess(result);
            }else {
                response.setSuccess(false);
                response.setErrorCode(100);
                response.setMsg("该次记录无法撤销");
            }
        }catch (Exception e){
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        return response;
    }








}
