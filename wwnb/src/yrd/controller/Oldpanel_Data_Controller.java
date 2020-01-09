package yrd.controller;

import controller.DataHistoryController;
import db.mysqlcondition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import service.Excel_Service;
import service.QueryService;
import vo.UploadDataResult;
import vo.WebResponse;
import yrd.service.Y_Upload_Data_Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;

@RestController
public class Oldpanel_Data_Controller {

    @Autowired
    private QueryService queryService;
    @Autowired
    private Y_Upload_Data_Service Y_Upload_Data_Service;
    @Autowired
    private Excel_Service excel_Service;

    Logger log=Logger.getLogger(Oldpanel_Data_Controller.class);

    /*
     * 添加单个数据
     * */
    @RequestMapping(value="/oldpanel/addData.do")
    public boolean oldpanelAddData(String s, HttpSession session) {

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
            Y_Upload_Data_Service.oldpanelAddData(tableName,oldpanelName,length,type,width,number,respo,respoNum,location,weight,userid);

        }

        return true;

    }


}
