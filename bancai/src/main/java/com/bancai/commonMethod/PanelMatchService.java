package com.bancai.commonMethod;


import com.bancai.cg.service.InsertProjectService;
import com.bancai.domain.DataRow;
import com.bancai.service.BaseService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import com.bancai.yrd.service.ProductDataService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.crypto.Data;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class PanelMatchService extends BaseService{
    private Logger log = Logger.getLogger(AnalyzeNameService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private ProductDataService productDataService;

    /**
     * 设计清单解析
     */
    @Transactional
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userid, String projectId, String buildingId,
                                             String buildingpositionId) throws IOException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
        Map<String, ArrayList<String>> map = new HashMap<>();
        for (int i = 0; i < dataList.size(); i++) {
            String productName = productNameCorrector(dataList.get(i).get("productName").toString());
            String position = dataList.get(i).get("position").toString();
            if(!queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                    ,projectId,buildingId,position).isEmpty()){
                result.setErrorCode(2);
                return result;
            }
            int productId = AnalyzeNameService.isInfoExist("product",productName);
            if(productId==0){
                Date date = new Date();
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String sql_addLog = "insert into product_log (type,userId,time) values(?,?,?)";
                int productlogId = insertProjectService.insertDataToTable(sql_addLog, "6", "0", simpleDateFormat.format(date));
                productId = productDataService.productAddNewInfo(productName, "", "",
                        "", "", "", "0");
                insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                        String.valueOf(productlogId), String.valueOf(productId));
            }
            productName = String.valueOf(productId)+"N"+productName;
            //productName形如 15N100 B 200  即  idNproductName
            if(map.containsKey(productName)){
                ArrayList<String> a = new ArrayList<>();
                a = map.get(productName);
                a.add(position);
                map.put(productName,a);
            }else {
                ArrayList<String> a = new ArrayList<>();
                a.add(position);
                map.put(productName,a);
            }
        }
        map = matchBackProduct(map,projectId,buildingId,buildingpositionId);
//            map = matchOldpanel(map);
//            map = matchPreprocess(map);
//            map = matchMaterial(map);

        return result;
    }
    /**
     * 退库成品匹配
     */
    @Transactional
    public Map<String,ArrayList<String>> matchBackProduct(Map<String,ArrayList<String>> map,
                                                          String projectId, String buildingId, String buildingpositionId){
        try{
            Iterator iterator = map.keySet().iterator();
            while (iterator.hasNext()) {
                String key = iterator.next().toString();
                ArrayList<String> value = map.get(key);
                String productId = key.split("N")[0];
                String productName = key.substring(productId.length()+1,key.length()-1);
                System.out.println("match="+productName+"==and==position="+value);
                String sql = "select * from backproduct_store where productId=? and countUse>0";
                DataList backproductList = queryService.query(sql,productId);
                if(!backproductList.isEmpty()){
                    for (int i = 0; i < backproductList.size(); i++) {
                        int countUse = Integer.parseInt(backproductList.get(i).get("countUse").toString());
                        while (countUse>0){
                            String sql_matchBackproduct = "";
                            countUse--;
                        }
                    }
                }
            }
        } catch (Exception e){
            return map;
        }
        DataList matchList = new DataList();
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
        return map;

    }
//    /**
//     * 旧板匹配
//     */
//    @Transactional
//    public Map<String,ArrayList<String>> matchOldpanel(Map<String,ArrayList<String>> map){
//        DataList matchList = new DataList();
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
//        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
//
//        return map;
//    }
//    /**
//     * 预加工半成品匹配
//     */
//    @Transactional
//    public Map<String,ArrayList<String>> matchPreprocess(Map<String,ArrayList<String>> map){
//        DataList matchList = new DataList();
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
//        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
//
//        return map;
//    }
//    /**
//     * 原材料新板匹配
//     */
//    @Transactional
//    public Map<String,ArrayList<String>> matchMaterial(Map<String,ArrayList<String>> map){
//        DataList matchList = new DataList();
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
//        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
//
//        return map;
//    }

    @Transactional
    public DataList insertDesignlist(String productTypeId, String productNameFormat) {
        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
        DataList list = queryService.query(sql, productTypeId, productNameFormat);
        return list;
    }

    @Transactional
    public DataList insertMatchResult(String productTypeId, String productNameFormat) {
        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
        DataList list = queryService.query(sql, productTypeId, productNameFormat);
        return list;
    }

    @Transactional
    public DataList findOldpanelMatchRules(String productTypeId, String productNameFormat) {
        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
        DataList list = queryService.query(sql, productTypeId, productNameFormat);
        return list;
    }

    /**
     * 产品品名修整
     */
    @Transactional
    public String productNameCorrector(String productName){
        boolean b = true;
        while(b){
            if(productName.substring(0,1).equals(" "))
                productName = productName.substring(0,1);
            else if(productName.substring(productName.length()-1).equals(" "))
                productName = productName.substring(productName.length()-1);
            else{
                productName = productName.toUpperCase();
                b = false;
            }
        }
        return productName;
    }




}
