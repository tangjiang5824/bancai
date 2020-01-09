package yrd.controller;

import db.mysqlcondition;
import db.Condition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import service.Excel_Service;
import service.QueryService;
import service.TableService;
import vo.UploadDataResult;
import vo.WebResponse;
import yrd.service.Y_Upload_Data_Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class Oldpanel_Data_Controller {

    @Autowired
    private TableService tableService;
    @Autowired
    private QueryService queryService;
    @Autowired
    private Y_Upload_Data_Service y_Upload_Data_Service;

    Logger log=Logger.getLogger(Oldpanel_Data_Controller.class);

    /*
     * 添加单个数据
     * */
    @RequestMapping(value="/oldpanel/addData.do")
    public boolean oldpanel_Add_Data(String s, HttpSession session) {

        JSONArray jsonArray =new JSONArray(s);
        String tableName = "oldpanel";
        int userid = Integer.parseInt(session.getAttribute("userid").toString());
        for(int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            log.debug(tableName+"第"+i+"个:userid="+userid+"---"+jsonTemp);
            String oldpanelName = (String) jsonTemp.get("旧板名称");
            int length = Integer.parseInt(jsonTemp.get("长").toString());
            String type = (String) jsonTemp.get("类型");
            int width = Integer.parseInt(jsonTemp.get("宽").toString());
            int number = Integer.parseInt(jsonTemp.get("数量").toString());
            String respo = (String) jsonTemp.get("库存单位");
            String respoNum = (String) jsonTemp.get("仓库编号");
            String location = (String) jsonTemp.get("存放位置");
            double weight = Double.parseDouble(jsonTemp.get("重量").toString());

            //对每条数据处理
            y_Upload_Data_Service.oldpanel_Add_Data(tableName,oldpanelName,length,type,width,number,respo,respoNum,location,weight,userid);

        }

        return true;

    }

    /*
     * 上传excel文件
     * */

    @RequestMapping(value = "/oldpanel/uploadExcel.do",produces = { "text/html;charset=UTF-8" })
    public String oldpanel_Upload_Data(MultipartFile uploadFile, HttpSession session) {
        WebResponse response = new WebResponse();
        String tableName = "oldpanel";
        int userid = Integer.parseInt(session.getAttribute("userid").toString());
        try {
            UploadDataResult result = y_Upload_Data_Service.oldpanel_Upload_Data(uploadFile.getInputStream(),tableName,userid);
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
    public WebResponse oldpanel_Find_List(Integer start, Integer limit, String startLength, String endLength, String startWidth, String endWidth, String mType, HttpSession session){

        //查询的数据表名
        String tableName = "oldpanel";

        //根据输入的数据查询
        //DataList dataList = testAddService.findList(proName);
        //查询字段不为空
        if((startLength !=null)||(endLength !=null)||(startWidth !=null)||(endWidth !=null)){
            Condition c=new Condition();
            if ((startLength.length() != 0)&&(endLength.length() != 0)&&(startWidth.length() != 0)&&(endWidth.length() != 0)) {
                c.and(new Condition("长", " between", startLength, endLength));
                c.and(new Condition("宽", " between", startWidth, endWidth));
                c.and(new Condition("类型", "=", mType));
            }
            //调用函数，查询满足条件的所有数据
            return queryService.queryPage(start, limit, c, tableName);
        }

//        System.out.println("-------------------------------------------------------33");
        return queryService.queryPage(start,limit,"select * from " + tableName);
    }

    /**
     * 根据ID删除旧板表某行数据
     */
    @RequestMapping(value="/system/dataTable/dropColumn.do")
    public boolean dropColumn(String tableName,String fieldName) {
        return tableService.dropColumn(tableName,fieldName);
    }


}
