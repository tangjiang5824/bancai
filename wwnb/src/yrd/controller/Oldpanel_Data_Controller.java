package yrd.controller;

import cg.service.InsertProjectService;
import commonMethod.NewCondition;
import commonMethod.QueryAllService;
import domain.DataList;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import service.TableService;
import vo.UploadDataResult;
import vo.WebResponse;
import yrd.service.Y_Upload_Data_Service;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashSet;
import java.util.Iterator;

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

    Logger log=Logger.getLogger(Oldpanel_Data_Controller.class);

    /*
     * 添加单个数据
     * */
    @RequestMapping(value="/oldpanel/addData.do")
    public boolean oldpanelAddData(String s, HttpSession session) {

        JSONArray jsonArray =new JSONArray(s);
        String tableName = "oldpanel";
        int uploadId = Integer.parseInt(session.getAttribute("userid").toString());
        for(int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            log.debug(tableName+"第"+i+"个:userid="+uploadId+"---"+jsonTemp);
            int oldpanelNo = Integer.parseInt(jsonTemp.get("oldpanelNo").toString());
            String oldpanelName = (String) jsonTemp.get("oldpanelName");
            double length = Double.parseDouble(jsonTemp.get("length").toString());
            double length2 = Double.parseDouble(jsonTemp.get("length2").toString());
            String oldpanelType = jsonTemp.get("oldpanelType").toString();
            double width = Double.parseDouble(jsonTemp.get("width").toString());
            double width2 = Double.parseDouble(jsonTemp.get("width2").toString());
            double width3 = Double.parseDouble(jsonTemp.get("width3").toString());
            String inventoryUnit = (String) jsonTemp.get("inventoryUnit");
            String warehouseNo = (String) jsonTemp.get("warehouseNo");
            String position = (String) jsonTemp.get("position");
            double number = Double.parseDouble(jsonTemp.get("number").toString());
            double weight = Double.parseDouble(jsonTemp.get("weight").toString());

            //对每条数据处理
            y_Upload_Data_Service.oldpanelAddData(tableName,oldpanelNo,oldpanelName,length,length2,oldpanelType,width,
                    width2,width3,inventoryUnit,warehouseNo,position,number,weight,uploadId);

        }

        return true;

    }

    /*
     * 上传excel文件
     * */

    @RequestMapping(value = "/oldpanel/uploadExcel.do",produces = { "text/html;charset=UTF-8" })
    public String oldpanelUploadData(MultipartFile uploadFile, HttpSession session) {
        WebResponse response = new WebResponse();
        String tableName = "oldpanel";
        int userid = Integer.parseInt(session.getAttribute("userid").toString());
        try {
            UploadDataResult result = y_Upload_Data_Service.oldpanelUploadData(uploadFile.getInputStream(),tableName,userid);
            response.setSuccess(result.success);
            response.setErrorCode(result.errorCode);
            response.setValue(result.data);

        } catch (IOException e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
        return json.toString();
    }

    /**
     * 查旧板表
     */
    @RequestMapping(value="/oldpanel/updateData.do")
    public WebResponse oldpanelFindList(Integer start, Integer limit,String tableName, String oldpanelType){
//            , String startLength, String endLength, String startWidth, String endWidth, String mType, HttpSession session){
//        log.debug("search["+tableName+"]length:"+startLength+"--"+endLength+";width"+startWidth+"--"+endWidth);

        log.debug("search["+tableName+"]oldpanelType:"+oldpanelType);
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
        if(oldpanelType !=null){
            NewCondition c=new NewCondition();
            WebResponse re=new WebResponse();
            if (oldpanelType.length() != 0) {
                c.and(new NewCondition("oldpanelType", "=", oldpanelType));
            }
            re = queryService.queryPage(start, limit, c, tableName);
            String typeTableName = "oldpaneltype";
//            System.out.println(re);
            re = y_Upload_Data_Service.ChangeQueryPageFromAToB(re, typeTableName,"oldpanelType","oldpanelTypeName");
//                System.out.println(re);
            return re;

        }

//        System.out.println("-------------------------------------------------------33");
        return queryService.queryPage(start,limit,"select * from " + tableName);
    }
    /**
     * 下拉选择旧板类型
     * @param response
     * @throws IOException
     */
    @RequestMapping(value="/oldpanel/oldpanelType.do")
    public void findOldpanelType(HttpServletResponse response) throws IOException {
        DataList projectList = insertProjectService.findOldpanelType();
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(projectList);
        object.put("typeList", array);
        // System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }



}
