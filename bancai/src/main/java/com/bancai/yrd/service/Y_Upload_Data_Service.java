package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.vo.WebResponse;

@Service
public class Y_Upload_Data_Service extends BaseService {
    private Logger log = Logger.getLogger(Y_Upload_Data_Service.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;

    /**
     * 添加新的旧板format，返回新增的format id
     */
    @Transactional
    public int oldpanelAddNewFormat(String oldpanelTypeId, String oldpanelFormat) {
        if(AnalyzeNameService.isFormatExist("oldpanel",oldpanelTypeId,oldpanelFormat)!=0)
            return 0;
        return oldpanelSaveFormat(oldpanelTypeId, oldpanelFormat);
    }
    private int oldpanelSaveFormat(String oldpanelTypeId, String oldpanelFormat){
        return insertProjectService.insertDataToTable("insert into oldpanel_format (oldpanelTypeId,oldpanelFormat) values (?,?)"
                , oldpanelTypeId, oldpanelFormat);
    }
    /**
     * 添加新的旧板info，返回新增的info id
     */
    @Transactional
    public int oldpanelAddNewInfo(String oldpanelName, String inventoryUnit, String unitWeight,
                                  String unitArea, String remark, String userId) {
        if(AnalyzeNameService.isInfoExist("oldpanel",oldpanelName)!=0)
            return 0;
        return oldpanelSaveInfo(oldpanelName, inventoryUnit, unitWeight, unitArea, remark, userId);
    }
    /**
     * 添加数据,返回添加的旧板info id
     */
    @Transactional
    public int[] oldpanelUpload(String oldpanelName, String warehouseName, String count) {
        String[] info = AnalyzeNameService.isInfoExistBackUnit("oldpanel",oldpanelName);
        //id,unitWeight,unitArea
        int oldpanelId = Integer.parseInt(info[0]);
        System.out.println("oldpanelUpload===oldpanelId="+oldpanelId);
        if(oldpanelId==0){
            return new int[]{0, 0};
        }
        int oldpanelstoreId = oldpanelSaveData(info,warehouseName,count);
        return new int[]{oldpanelId, oldpanelstoreId};

//        String[] analyzeOldpanelName = AnalyzeNameService.analyzeOldpanelName(oldpanelName);
//        if(!AnalyzeNameService.isOldpanelFormatExist(analyzeOldpanelName[0],analyzeOldpanelName[1],analyzeOldpanelName[7],analyzeOldpanelName[8]))
//            return 0;
//        return String.valueOf(oldpanelSaveData(analyzeOldpanelName,oldpanelName,classificationId,inventoryUnit, number,
//                warehouseName, unitArea, unitWeight, remark, uploadId));
    }

    private int oldpanelSaveInfo(String oldpanelName, String inventoryUnit, String unitWeight0,
                                 String unitArea0, String remark, String userId){
        double unitArea = Double.parseDouble(unitArea0);
        double unitWeight = Double.parseDouble(unitWeight0);
        String[] analyzeOldpanelName = AnalyzeNameService.analyzeOldpanelName(oldpanelName);
        if(analyzeOldpanelName==null)
            return 0;
        DataList formatList = queryService.query("select * from oldpanel_format where oldpanelTypeId=? and oldpanelFormat=?",
                analyzeOldpanelName[1],analyzeOldpanelName[0]);
        if(formatList.size()==0)
            return 0;
        String productFormatId = formatList.get(0).get("id").toString();
        //返回String[]{format,oldpanelTypeId,classificationId,m,n,p,a,b,mAngle,nAngle,pAngle,suffix,oldpanelTypeName};
        String sql = "insert into oldpanel_info (oldpanelName,classificationId,inventoryUnit,unitWeight,unitArea,remark," +
                "oldpanelFormatId,oldpanelType,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix,userId) " +
                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String[] t = {oldpanelName,analyzeOldpanelName[2],inventoryUnit,
                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
                productFormatId,analyzeOldpanelName[1],analyzeOldpanelName[3],
                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],
                analyzeOldpanelName[8],analyzeOldpanelName[9],analyzeOldpanelName[10],analyzeOldpanelName[11],userId};
        System.out.println("SaveInfo======="+Arrays.toString(t));
        return insertProjectService.insertDataToTable(sql,oldpanelName,analyzeOldpanelName[2],inventoryUnit,
                String.valueOf(unitWeight),String.valueOf(unitArea),remark,
                productFormatId,analyzeOldpanelName[1],analyzeOldpanelName[3],
                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7],
                analyzeOldpanelName[8],analyzeOldpanelName[9],analyzeOldpanelName[10],analyzeOldpanelName[11],userId);
    }

    private int oldpanelSaveData(String[] info, String warehouseName, String count){
        //id,unitWeight,unitArea
        String sql = "select * from oldpanel_store where oldpanelId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            return insertProjectService.insertDataToTable("insert into oldpanel_store " +
                    "(oldpanelId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,String.valueOf(Double.parseDouble(info[2])*Integer.parseInt(count)),
                    String.valueOf(Double.parseDouble(info[1])*Integer.parseInt(count)));
        } else {
            String oldpanelstoreId = queryList.get(0).get("id").toString();
            String sql2 = "update oldpanel_store set countUse=countUse+"+count+
                    ",countStore=countStore+"+count+",totalArea=totalArea+"+
                    String.valueOf(Double.parseDouble(info[2]) * Integer.parseInt(count)) +
                    ",totalWeight=totalWeight+"+String.valueOf(Double.parseDouble(info[1])*Integer.parseInt(count))+
                    " where id="+oldpanelstoreId;
            jo.update(sql2);
            return Integer.parseInt(oldpanelstoreId);
        }
    }
//    private int oldpanelSaveData(String[] analyzeOldpanelName, String oldpanelName, String classificationId, String inventoryUnit,
//                                  String number, String warehouseName, String unitArea0, String unitWeight0, String remark, String uploadId) {
//        double unitArea = Double.parseDouble(unitArea0);
//        double unitWeight = Double.parseDouble(unitWeight0);
//        double num = Double.parseDouble(number);
//        double totalArea = unitArea*num;
//        double totalWeight = unitWeight*num;
//        String sql2 = "insert into oldpanel_store (oldpanelName,classificationId,inventoryUnit,countUse,countStore,warehouseName," +
//                "unitArea,unitWeight,remark,uploadId,totalArea,totalWeight,format,oldpanelType,length,width,aValue,bValue,mnAngle,suffix) " +
//                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//        String[] t = {oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]};
//        System.out.println("Save======="+Arrays.toString(t));
//        return insertProjectService.insertDataToTable(sql2,oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]);
//        jo.update(sql2,oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
//                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
//                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
//                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]);
//    }
    /**
     * queryPage替换指定属性值为对应另一属性值
     *
     * @param
     * @return
     */
    @Transactional
    public WebResponse ChangeQueryPageFromAToB(WebResponse re, String tableName, String ChangeFrom, String ChangeTo){
        DataList dataList=(DataList)re.get("value");

        for (DataRow dataRow : dataList) {
            int type=Integer.parseInt( dataRow.get(ChangeFrom)+"");
            DataList list = queryService.query("select "+ChangeTo+" from "+tableName+" where "+ChangeFrom+"=?", type);
            String typeName = String.valueOf(list.get(0).get(ChangeTo));
            dataRow.put(ChangeFrom,typeName);
        }

        re.setValue(dataList);
        return re;
    }
    /*
     * 查询所有的旧板类型
     * */
    @Transactional
    public DataList findOldpanelTypeList(){
        return queryService.query("select * from oldpaneltype order by id ASC");

    }
    /*
     * 根据类型id查询所有的旧板格式
     * */
    @Transactional
    public DataList findOldpanelFormatList(String oldpanelTypeId){
        return queryService.query("select * from oldpanel_format where oldpanelTypeId=? order by id ASC",oldpanelTypeId);

    }

}

