package zj.controller;

import commonMethod.AllExcelService;
import commonMethod.QueryAllService;
import controller.DataHistoryController;
import db.mysqlcondition;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import service.QueryService;
import vo.UploadDataResult;
import vo.WebResponse;
import zj.service.MaterialExcelService;
import zj.service.Material_Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;

@RestController
public class MaterialDataController {

    @Autowired
    private QueryAllService queryAllService;
    //private QueryService queryService;
    @Autowired
    private Material_Service material_Service;
    @Autowired
    private AllExcelService allExcelService;
    //private MaterialExcelService excelService;

    Logger log=Logger.getLogger(DataHistoryController.class);

    /*
    * 录入单个原材料数据
    *
    * */
    @RequestMapping(value="/addMaterial.do")
    public boolean addMaterialData(String s, String tableName, HttpSession session) {

        JSONArray jsonArray =new JSONArray(s);
        String userid = (String)session.getAttribute("userid");
        for(int i=0;i< jsonArray.length();i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            //int id=Integer.parseInt(jsonTemp.get("id"));
            System.out.println(jsonTemp);
            int proNum=Integer.parseInt(jsonTemp.get("品号").toString());
            String materialName=(String) jsonTemp.get("材料名");
            String Length=(String) jsonTemp.get("长");
            String Type=(String) jsonTemp.get("类型");
            String Width=(String) jsonTemp.get("宽");
            String scale=(String) jsonTemp.get("规格");
            String respo=(String) jsonTemp.get("库存单位");
            String respoNum=(String) jsonTemp.get("仓库编号");
            int count=Integer.parseInt(jsonTemp.get("数量").toString());
            double cost= Double.parseDouble(jsonTemp.get("成本").toString());
            String location=(String) jsonTemp.get("存放位置");
            //int material_type = Integer.parseInt(materialType);

            //对每条数据处理addMaterialData
            //String sql = "insert into " +tableName+" (materialName,品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,uploadID) values(?,?,?,?,?,?,?,?,?,?,?,?)";
            int k = material_Service.addMaterialData(tableName,materialName,proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,userid);
            if(k == -1){
                //插入失败
                return false;
            }
            //Upload_Data_Service.addData(tableName,proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,material_type,userid);
        }

        return true;
    }
    /*
     * 上传excel文件
     * */

    @RequestMapping(value = "/uploadMaterialExcel.do",produces = { "text/html;charset=UTF-8" })
    public String uploadMaterial(MultipartFile uploadFile, String tableName, HttpSession session) {
        WebResponse response = new WebResponse();
        String userid = (String) session.getAttribute("userid");
        try {
            //UploadDataResult result = excelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName);
            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName);
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

    /*
     * 根据条件查询
     *
     * */
    @RequestMapping(value = "/material/historyDataList.do")
    public WebResponse materialDataList(Integer start, Integer limit, String tableName, String startWidth,
                                         String endWidth, String startLength, String endLength, String mType) throws ParseException {
        //log.debug(startWidth+" "+endWidth);

        System.out.println("------");
        System.out.println(startWidth);
        System.out.println(endWidth);

        mysqlcondition c=new mysqlcondition();
        //String loginName = (String) session.getAttribute("loginName");
        if (startWidth.length() != 0) {
            c.and(new mysqlcondition("宽", ">=", startWidth));
        }
        if (endWidth.length() != 0) {
            c.and(new mysqlcondition("宽", "<=", endWidth));
        }
        if (startLength.length() != 0) {
            c.and(new mysqlcondition("长", ">=", startLength));
        }
        if (endLength.length() != 0) {
            c.and(new mysqlcondition("长", "<=", endLength));
        }
        if (mType.length() != 0) {
            c.and(new mysqlcondition("类型", "=", mType));
        }
//        if (materialType.length() != 0) {
//            c.and(new mysqlcondition("materialtype", "=", materialType));
//        }
        //WebResponse wr=queryService.mysqlqueryPage(start, limit, c, tableName);
        WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
        return wr;
    }


    /*
     * 根据选中的id删除数据
     *
     * */



}
