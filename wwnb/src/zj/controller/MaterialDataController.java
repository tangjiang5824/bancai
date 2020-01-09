package zj.controller;

import controller.DataHistoryController;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.Excel_Service;
import service.QueryService;
import zj.service.Material_Service;

import javax.servlet.http.HttpSession;

@RestController
public class MaterialDataController {

    @Autowired
    private QueryService queryService;
    @Autowired
    private Material_Service material_Service;
    @Autowired
    private Excel_Service excel_Service;

    Logger log=Logger.getLogger(DataHistoryController.class);

    /*
    * 录入单个原材料数据
    *
    * */
    @RequestMapping(value="/addMaterial.do")
    public boolean addMaterialData(String s, String tableName, HttpSession session) {

        System.out.println("++++++++++++++++++++++++++++++++++++++++");

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

}
