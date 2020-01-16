package zj.controller;

import commonMethod.AllExcelService;
import commonMethod.QueryAllService;
import controller.DataHistoryController;
import db.mysqlcondition;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
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
    * 入库
    *
    * */
    @RequestMapping(value="/material/addData.do")
    public boolean addMaterialData(String s, String tableName, HttpSession session) {

        JSONArray jsonArray =new JSONArray(s);
        String userId = (String)session.getAttribute("userid");
        for(int i=0;i< jsonArray.length();i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            //获得第i条数据的各个属性值
            //int id=Integer.parseInt(jsonTemp.get("id"));
            String length2="";
            String width2="";
           try{
              length2=jsonTemp.get("长2")+"";
           }catch (JSONException e){
               length2="0";
           }
            try{
                length2=jsonTemp.get("宽2")+"";
            }catch (JSONException e){
                width2="0";
            }

            System.out.println(jsonTemp);
            String materialNo=jsonTemp.get("品号").toString()+"";
            String materialName=(String) jsonTemp.get("原材料名称");
            String length=jsonTemp.get("长1")+"";
            //String length2=jsonTemp.get("长2")+"";
            String Type=jsonTemp.get("类型")+"";
            String width=jsonTemp.get("宽1")+"";
            //String width2=jsonTemp.get("宽2")+"";
            String specification=jsonTemp.get("规格")+"";
            String inventoryUnit=jsonTemp.get("库存单位")+"";
            int warehouseNo=Integer.parseInt(jsonTemp.get("仓库编号")+"");
            int count=Integer.parseInt(jsonTemp.get("数量").toString());
            double cost= Double.parseDouble(jsonTemp.get("成本").toString());
            int rowNo=Integer.parseInt(jsonTemp.get("行")+"");
            int columNo=Integer.parseInt(jsonTemp.get("列")+"");
            //int material_type = Integer.parseInt(materialType);

            //对每条数据处理addMaterialData
            //String sql = "insert into " +tableName+" (materialName,品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,uploadID) values(?,?,?,?,?,?,?,?,?,?,?,?)";
            int k = material_Service.addMaterialData(tableName,materialName,materialNo,length,length2,Type,width,width2,specification,inventoryUnit,warehouseNo,count,cost,rowNo,columNo,userId);
            if(k == -1){
                //插入失败
                return false;
            }
            //Upload_Data_Service.addData(tableName,proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,material_type,userid);
        }

        return true;
    }
    /*
     * 上传excel文件,produces = { "text/html;charset=UTF-8" }
     * */
    @RequestMapping(value = "/uploadMaterialExcel.do")
    public WebResponse uploadMaterial(MultipartFile uploadFile, String tableName, HttpSession session) {
        WebResponse response = new WebResponse();
        String userid = (String) session.getAttribute("userid");
        JSONArray array = new JSONArray();
        try {
            //UploadDataResult result = excelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName);
            UploadDataResult result = allExcelService.uploadExcelData(uploadFile.getInputStream(),userid,tableName);
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
