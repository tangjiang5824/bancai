package com.bancai.commonMethod;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.service.BaseService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import com.bancai.yrd.service.ProductDataService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public UploadDataResult uploadDesignlist(InputStream inputStream, String userId, String projectId, String buildingId,
                                             String buildingpositionId) throws IOException {
        UploadDataResult result = new UploadDataResult();

        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent();
        Map<String, ArrayList<String>> map = new HashMap<>();
        for (DataRow dataRow : dataList) {
            String productName = dataRow.get("productName").toString().trim().toUpperCase();
            String position = dataRow.get("position").toString();
            if (!queryService.query("select * from designlist where projectId=? and buildingId=? and position=?"
                    , projectId, buildingId, position).isEmpty()) {
                result.setErrorCode(2);
                return result;
            }
            int productId = AnalyzeNameService.isInfoExist("product", productName);
            if (productId == 0) {
                if(AnalyzeNameService.getTypeByProductName(productName).size()==0){
                    result.setErrorCode(2);
                    return result;
                }
                Date date = new Date();
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String sql_addLog = "insert into product_log (type,userId,time) values(?,?,?)";
                productId = productDataService.productAddNewInfo(productName, "", "",
                        "", "", userId);
                if(productId==0){
                    result.setErrorCode(2);
                    return result;
                }
                int productlogId = insertProjectService.insertDataToTable(sql_addLog, "6", "0", simpleDateFormat.format(date));
                boolean isLogRight = insertProjectService.insertIntoTableBySQL("insert into product_logdetail (productlogId,productId) values (?,?)",
                        String.valueOf(productlogId), String.valueOf(productId));
                if(!isLogRight){
                    result.setErrorCode(2);
                    return result;
                }
            }
            productName = String.valueOf(productId) + "N" + productName;
            //productName形如 15N100 B 200  即  idNproductName
            if (map.containsKey(productName)) {
                ArrayList<String> a = new ArrayList<>();
                a = map.get(productName);
                a.add(position);
                map.put(productName, a);
            } else {
                ArrayList<String> a = new ArrayList<>();
                a.add(position);
                map.put(productName, a);
            }
        }
        map = matchBackProduct(map,projectId,buildingId,buildingpositionId);
        map = matchPreprocess(map,projectId,buildingId,buildingpositionId);
//            map = matchOldpanel(map);
//            map = matchMaterial(map);
        result.success = matchError(map,projectId,buildingId,buildingpositionId);
        return result;
    }

    /**
     * 插入设计清单，返回清单id
     */
    @Transactional
    public int insertDesignlist(String projectId, String buildingId, String buildingpositionId, String productId, String position,
                                int madeBy, int processStatus) {
        return insertProjectService.insertDataToTable("insert into designlist " +
                        "(projectId,buildingId,buildingpositionId,productId,position,madeBy,processStatus) values " +
                        "(?,?,?,?,?,?,?)", projectId, buildingId, buildingpositionId, productId, position,
                String.valueOf(madeBy), String.valueOf(processStatus));
    }

    /**
     * 退库成品匹配
     */
    @Transactional
    public Map<String,ArrayList<String>> matchBackProduct(Map<String,ArrayList<String>> map,
                                                          String projectId, String buildingId, String buildingpositionId){
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next().toString();
            ArrayList<String> value = map.get(key);
            String productId = key.split("N")[0];
            String productName = key.substring(productId.length()+1);
            System.out.println("Backmatch="+productName+"===productId="+productId+"===position="+value);
            //匹配列表
            DataList backproductList = queryService.query("select * from backproduct_store where productId=? and countUse>0"
                    ,productId);
            int num = value.size();
            if(!backproductList.isEmpty()) {
                for (DataRow dataRow : backproductList) {
                    int backproductId = Integer.parseInt(dataRow.get("id").toString());
                    int countUse = Integer.parseInt(dataRow.get("countUse").toString());
                    if (num > countUse) {
                        while (countUse > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 0, 0);
                            int resultId = insertBackProductMatchResult(designlistId,backproductId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("backproduct",countUse,backproductId);
//                        jo.update("update backproduct_store set countUse=" + countUse + " where id=" + backproductId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 0, 0);
                            int resultId = insertBackProductMatchResult(designlistId,backproductId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("backproduct",countUse,backproductId);
//                        jo.update("update backproduct_store set countUse=" + countUse + " where id=" + backproductId);
                        break;
                    }

                }
            }
            if(num==0)
                iterator.remove();
        }

//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
        return map;

    }

    /**
     * 插入退库成品匹配结果，返回id
     */
    @Transactional
    public int insertBackProductMatchResult(int designlistId, int backproductId) {
        return insertProjectService.insertDataToTable("insert into backproduct_match_result " +
                "(designlistId,backproductId) values (?,?)", String.valueOf(designlistId), String.valueOf(backproductId));
    }

    /**
     * 预加工半成品匹配
     */
    @Transactional
    public Map<String,ArrayList<String>> matchPreprocess(Map<String,ArrayList<String>> map,
                                                          String projectId, String buildingId, String buildingpositionId){
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next().toString();
            ArrayList<String> value = map.get(key);
            String productId = key.split("N")[0];
            String productName = key.substring(productId.length()+1);
            System.out.println("Prematch="+productName+"===productId="+productId+"===position="+value);
            //匹配列表
            DataList preprocessList = queryService.query("select * from preprocess_store where productId=? and countUse>0"
                    ,productId);
            int num = value.size();
            if(!preprocessList.isEmpty()) {
                for (DataRow dataRow : preprocessList) {
                    int preprocessId = Integer.parseInt(dataRow.get("id").toString());
                    int countUse = Integer.parseInt(dataRow.get("countUse").toString());
                    if (num > countUse) {
                        while (countUse > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 1, 0);
                            int resultId = insertPreprocessMatchResult(designlistId,preprocessId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("preprocess",countUse,preprocessId);
//                        jo.update("update preprocess_store set countUse=" + countUse + " where id=" + preprocessId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 1, 0);
                            int resultId = insertPreprocessMatchResult(designlistId,preprocessId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("preprocess",countUse,preprocessId);
//                        jo.update("update preprocess_store set countUse=" + countUse + " where id=" + preprocessId);
                        break;
                    }

                }
            }
            if(num==0)
                iterator.remove();
        }
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
        return map;

    }
    /**
     * 插入预加工半成品匹配结果，返回id
     */
    @Transactional
    public int insertPreprocessMatchResult(int designlistId, int preprocessId) {
        return insertProjectService.insertDataToTable("insert into preprocess_match_result " +
                "(designlistId,preprocessId) values (?,?)", String.valueOf(designlistId), String.valueOf(preprocessId));
    }
    /**
     * 旧板匹配
     */
    @Transactional
    public Map<String,ArrayList<String>> matchOldpanel(Map<String,ArrayList<String>> map,
                                                       String projectId, String buildingId, String buildingpositionId){
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next().toString();
            ArrayList<String> value = map.get(key);
            String productId = key.split("N")[0];
            String productName = key.substring(productId.length()+1);
            System.out.println("Oldmatch="+productName+"===productId="+productId+"===position="+value);
            //匹配列表
            DataList oldpanelList = queryService.query("select * from oldpanel_store where productId=? and countUse>0"
                    ,productId);
            int num = value.size();
            if(!oldpanelList.isEmpty()) {
                for (DataRow dataRow : oldpanelList) {
                    int preprocessId = Integer.parseInt(dataRow.get("id").toString());
                    int countUse = Integer.parseInt(dataRow.get("countUse").toString());
                    if (num > countUse) {
                        while (countUse > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 1, 0);
                            int resultId = insertPreprocessMatchResult(designlistId,preprocessId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("oldpanel",countUse,preprocessId);
//                        jo.update("update preprocess_store set countUse=" + countUse + " where id=" + preprocessId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = insertDesignlist(projectId, buildingId, buildingpositionId,
                                    productId, position, 1, 0);
                            int resultId = insertPreprocessMatchResult(designlistId,preprocessId);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("oldpanel",countUse,preprocessId);
//                        jo.update("update preprocess_store set countUse=" + countUse + " where id=" + preprocessId);
                        break;
                    }

                }
            }
            if(num==0)
                iterator.remove();
        }
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
        return map;
    }
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
    public boolean matchError(Map<String,ArrayList<String>> map, String projectId, String buildingId, String buildingpositionId){
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next().toString();
            ArrayList<String> value = map.get(key);
            String productId = key.split("N")[0];
            String productName = key.substring(productId.length() + 1, key.length());
            System.out.println("Errmatch==="+productName+"===productId="+productId+"===position="+value);
            while (value.size()>0){
                String position = value.get(value.size()-1);
                int designlistId = insertProjectService.insertDataToTable("insert into designlist " +
                        "(projectId,buildingId,buildingpositionId,productId,position,madeBy,processStatus) values " +
                        "(?,?,?,?,?,?,?)", projectId, buildingId, buildingpositionId, productId, position, "9", "0");
                value.remove(value.size()-1);
            }
        }
        return true;
    }




    @Transactional
    public DataList findOldpanelMatchRules(String productTypeId, String productNameFormat) {
        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
        DataList list = queryService.query(sql, productTypeId, productNameFormat);
        return list;
    }



    private void updateStoreCount(String storeName, int countUse, int id){
        jo.update("update "+storeName+"_store set countUse=" + countUse + " where id=" + id);
    }

    private DataList findMatchList(String storeName, String productId, String productName){
        DataList matchList = new DataList();
        switch (storeName){
            case "backproduct":
            case "preprocess":
                matchList = queryService.query("select * from "+storeName+"_store where productId=? and countUse>0"
                        ,productId);
                break;
            case "oldpanel":
                String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);

//        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
            case "material":
            default:
                break;
        }
        return matchList;
    }
    //select * from oldpanel_match_rules where productTypeId=1 and productNameFormat=201 order by priority asc;




}
