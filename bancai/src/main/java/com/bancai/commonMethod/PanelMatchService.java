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
    private AnalyzeNameService analyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private ProductDataService productDataService;

    /**
     * 找到设计清单中等待匹配的产品，返回map
     */
    @Transactional
    public Map<String,ArrayList<String>>findMatchMap(String projectId, String buildingId, String buildingpositionId){
        String sql = "select * from designlist where projectId=? and buildingId=? and buildingpositionId=? and madeBy=0";
        DataList findMatchList = queryService.query(sql,projectId,buildingId,buildingpositionId);
        Map<String,ArrayList<String>> map = new HashMap<>();
        if(findMatchList.isEmpty())
            return map;
        for (DataRow dataRow : findMatchList) {
            String position = dataRow.get("position").toString();
            String productId = dataRow.get("productId").toString();
            if (map.containsKey(productId)) {
                ArrayList<String> a = new ArrayList<>();
                a = map.get(productId);
                a.add(position);
                map.put(productId, a);
            } else {
                ArrayList<String> a = new ArrayList<>();
                a.add(position);
                map.put(productId, a);
            }
        }
        return map;
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
     * 更新设计清单madeBy，返回清单id
     */
    @Transactional
    public int updateDesignlist(String projectId, String buildingId, String position, int madeBy) {
        String sql = "select * from designlist where projectId=? and buildingId=? and position=?";
        DataList queryList = queryService.query(sql,projectId,buildingId,position);
        if(queryList.size()!=1)
            return 0;
        String designlistId = queryList.get(0).get("id").toString();
        String sql2 = "update designlist set madeBy=\""+madeBy+"\" where id=\""+designlistId+"\"";
        jo.update(sql2);
        return Integer.parseInt(designlistId);
    }

    /**
     * 插入匹配结果，返回id
     */
    @Transactional
    public int insertMatchResult(int designlistId, int matchId, String isCompleteMatch,String matchName,int madeBy) {
        return insertProjectService.insertDataToTable("insert into match_result " +
                "(designlistId,matchId,count,isCompleteMatch,name,madeBy) values (?,?,?,?,?,?)",
                String.valueOf(designlistId), String.valueOf(matchId),"1.0",isCompleteMatch,matchName,String.valueOf(madeBy));
    }

    /**
     * 退库成品匹配
     */
    @Transactional
    public void matchBackProduct(String projectId, String buildingId, String buildingpositionId){
        Map<String,ArrayList<String>> map = findMatchMap(projectId,buildingId,buildingpositionId);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String productId = iterator.next().toString();
            ArrayList<String> value = map.get(productId);
//            String productName = key.substring(productId.length()+1);
            System.out.println("Backmatch=productId="+productId+"===position="+value);
            //匹配列表
            DataList backproductList = queryService.query("SELECT backproduct_store.id AS id,backproduct_store.productId AS productId," +
                    "backproduct_store.countUse AS countUse,product_info.productName AS productName" +
                    " FROM backproduct_store LEFT JOIN product_info ON (backproduct_store.productId=product_info.id) " +
                    "WHERE backproduct_store.countUse>=1 AND backproduct_store.productId=?",productId);
            int num = value.size();
            if(!backproductList.isEmpty()) {
                for (DataRow dataRow : backproductList) {
                    int backproductId = Integer.parseInt(dataRow.get("id").toString());
                    double countUse = Double.parseDouble(dataRow.get("countUse").toString());
                    String matchName = dataRow.get("productName").toString();
                    if (num > countUse) {
                        while (countUse >= 1) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 1);
                            int resultId = insertMatchResult(designlistId,backproductId,"1",matchName,1);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("backproduct",countUse,backproductId);
//                        jo.update("update backproduct_store set countUse=" + countUse + " where id=" + backproductId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 1);
                            int resultId = insertMatchResult(designlistId,backproductId,"1",matchName,1);
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

    }

//    /**
//     * 插入退库成品匹配结果，返回id
//     */
//    @Transactional
//    public int insertBackProductMatchResult(int designlistId, int backproductId) {
//        return insertProjectService.insertDataToTable("insert into backproduct_match_result " +
//                "(designlistId,backproductId) values (?,?)", String.valueOf(designlistId), String.valueOf(backproductId));
//    }

    /**
     * 预加工半成品匹配
     */
    @Transactional
    public void matchPreprocess(String projectId, String buildingId, String buildingpositionId){
        Map<String,ArrayList<String>> map = findMatchMap(projectId,buildingId,buildingpositionId);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String productId = iterator.next().toString();
            ArrayList<String> value = map.get(productId);
//            String productId = key.split("N")[0];
//            String productName = key.substring(productId.length()+1);
            System.out.println("Prematch===productId="+productId+"===position="+value);
            //匹配列表
            DataList preprocessList = queryService.query("SELECT preprocess_store.id AS id,preprocess_store.productId AS productId," +
                            "preprocess_store.countUse AS countUse,product_info.productName AS productName" +
                            " FROM preprocess_store LEFT JOIN product_info ON (preprocess_store.productId=product_info.id) " +
                            "WHERE preprocess_store.countUse>=1 AND preprocess_store.productId=?",productId);
            int num = value.size();
            if(!preprocessList.isEmpty()) {
                for (DataRow dataRow : preprocessList) {
                    int preprocessId = Integer.parseInt(dataRow.get("id").toString());
                    double countUse = Double.parseDouble(dataRow.get("countUse").toString());
                    String matchName = dataRow.get("productName").toString();
                    if (num > countUse) {
                        while (countUse >= 1) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 2);
                            int resultId = insertMatchResult(designlistId,preprocessId,"1",matchName,2);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("preprocess",countUse,preprocessId);
//                        jo.update("update preprocess_store set countUse=" + countUse + " where id=" + preprocessId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 2);
                            int resultId = insertMatchResult(designlistId,preprocessId,"1",matchName,2);
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

    }
//    /**
//     * 插入预加工半成品匹配结果，返回id
//     */
//    @Transactional
//    public int insertPreprocessMatchResult(int designlistId, int preprocessId) {
//        return insertProjectService.insertDataToTable("insert into preprocess_match_result " +
//                "(designlistId,preprocessId) values (?,?)", String.valueOf(designlistId), String.valueOf(preprocessId));
//    }
    /**
     * 旧板匹配
     */
    @Transactional
    public void matchOldpanel(String projectId, String buildingId, String buildingpositionId){
        Map<String,ArrayList<String>> map = findMatchMap(projectId,buildingId,buildingpositionId);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String productId = iterator.next().toString();
            ArrayList<String> value = map.get(productId);
//            String productId = key.split("N")[0];
//            String productName = key.substring(productId.length()+1);
            System.out.println("Oldmatch===productId="+productId+"===position="+value);

            int num = value.size();
            DataRow productInfo = queryService.query("SELECT * FROM product_info LEFT JOIN " +
                    "product_format ON (product_info.productFormatId=product_format.id) WHERE product_info.id=?",productId).get(0);
            String productFormat = productInfo.get("productFormat").toString();
            String productFormatId = productInfo.get("productFormatId").toString();
//            int mValue = Integer.parseInt(productInfo.get("mValue").toString());
//            int nValue = Integer.parseInt(productInfo.get("nValue").toString());
//            int pValue = Integer.parseInt(productInfo.get("pValue").toString());
//            int aValue = Integer.parseInt(productInfo.get("aValue").toString());
//            int bValue = Integer.parseInt(productInfo.get("bValue").toString());
//            int mAngle = Integer.parseInt(productInfo.get("mAngle").toString());
//            int nAngle = Integer.parseInt(productInfo.get("nAngle").toString());
//            int pAngle = Integer.parseInt(productInfo.get("pAngle").toString());
//            String suffix = productInfo.get("suffix").toString();
            DataList rulesList = new DataList();
            rulesList = queryService.query("select * from oldpanel_match_rules where productFormatId=? and isValid=1 order by priority asc",productFormatId);
            for (DataRow rulesRow : rulesList) {
//                String[] pCon = new String[]{rulesRow.get("pCon1").toString(),rulesRow.get("pCon2").toString(),
//                        rulesRow.get("pCon3").toString(),rulesRow.get("pCon4").toString()};
                if(!isProductFitRule(productFormat,rulesRow,productInfo))
                    continue;
                String oldpanelFormatId = rulesRow.get("oldpanelFormatId").toString();
                String oldpanelFormat = queryService.query("select * from oldpanel_format where id=?",oldpanelFormatId).get(0).get("oldpanelFormat").toString();
                String isCompleteMatch = rulesRow.get("isCompleteMatch").toString();
                String queryOldpanelFitRule = "SELECT oldpanel_info.oldpanelName AS oldpanelName,oldpanel_info.mValue AS mValue,oldpanel_info.nValue AS nValue,oldpanel_info.pValue AS pValue," +
                        "oldpanel_info.aValue AS aValue,oldpanel_info.bValue AS bValue,oldpanel_info.mAngle AS mAngle,oldpanel_info.nAngle AS nAngle,oldpanel_info.pAngle AS pAngle," +
                        "oldpanel_info.suffix AS suffix,oldpanel_store.id AS id,oldpanel_store.countUse AS countUse " +
                        "FROM oldpanel_store LEFT JOIN oldpanel_info ON (oldpanel_store.oldpanelId=oldpanel_info.id) " +
                        "WHERE oldpanel_store.countUse>0 AND oldpanel_info.oldpanelFormatId=?";
                queryOldpanelFitRule = oldpanelFitRuleSQL(queryOldpanelFitRule,rulesRow,productInfo,oldpanelFormat);
                System.out.println(queryOldpanelFitRule);
                DataList oldpanelList = new DataList();
//                oldpanelList = queryService.query("SELECT oldpanel_info.oldpanelName AS oldpanelName,oldpanel_info.mValue AS mValue,oldpanel_info.nValue AS nValue,oldpanel_info.pValue AS pValue," +
//                        "oldpanel_info.aValue AS aValue,oldpanel_info.bValue AS bValue,oldpanel_info.mAngle AS mAngle,oldpanel_info.nAngle AS nAngle,oldpanel_info.pAngle AS pAngle," +
//                        "oldpanel_info.suffix AS suffix," +
//                        "oldpanel_format.oldpanelTypeId AS oldpanelTypeId,oldpanel_format.oldpanelFormat AS oldpanelFormat,oldpanel_store.id AS id,oldpanel_store.countUse AS countUse " +
//                        "FROM oldpanel_store LEFT JOIN oldpanel_info ON (oldpanel_store.oldpanelId=oldpanel_info.id) " +
//                        "LEFT JOIN oldpanel_format ON (oldpanel_info.oldpanelFormatId=oldpanel_format.id) " +
//                        "WHERE oldpanel_store.countUse>0 AND oldpanel_info.oldpanelFormatId=?",oldpanelFormatId);
                oldpanelList = queryService.query(queryOldpanelFitRule,oldpanelFormatId);
                if(oldpanelList.isEmpty())
                    continue;
                for (DataRow oldpanelRow : oldpanelList) {
//                    String[] oRan = new String[]{rulesRow.get("oRan1").toString(),rulesRow.get("oRan2").toString(),
//                            rulesRow.get("oRan3").toString(),rulesRow.get("oRan4").toString()};
//                    String oldpanelFormat = oldpanelRow.get("oldpanelFormat").toString();
//                    int mValueO = Integer.parseInt(oldpanelRow.get("mValue").toString());
//                    int nValueO = Integer.parseInt(oldpanelRow.get("nValue").toString());
//                    int pValueO = Integer.parseInt(oldpanelRow.get("pValue").toString());
//                    int aValueO = Integer.parseInt(oldpanelRow.get("aValue").toString());
//                    int bValueO = Integer.parseInt(oldpanelRow.get("bValue").toString());
//                    int mAngleO = Integer.parseInt(oldpanelRow.get("mAngle").toString());
//                    int nAngleO = Integer.parseInt(oldpanelRow.get("nAngle").toString());
//                    int pAngleO = Integer.parseInt(oldpanelRow.get("pAngle").toString());
//                    String suffixO = oldpanelRow.get("suffix").toString();
//                    if(!isOldpanelMatchRange(oldpanelFormat,rulesRow,oldpanelRow,productInfo))
//                        continue;
                    //匹配
                    System.out.println(oldpanelRow.toString());
                    int storeId = Integer.parseInt(oldpanelRow.get("id").toString());
                    double countUse = Double.parseDouble(oldpanelRow.get("countUse").toString());
                    String matchName = oldpanelRow.get("oldpanelName").toString();
                    if (num > countUse) {
                        while (countUse >= 1) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 3);
                            int resultId = insertMatchResult(designlistId,storeId,isCompleteMatch,matchName,3);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("oldpanel",countUse,storeId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 3);
                            int resultId = insertMatchResult(designlistId,storeId,isCompleteMatch,matchName,3);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("oldpanel",countUse,storeId);
                        break;
                    }
                }
                if(num==0){
                    iterator.remove();
                    break;
                }
            }
        }
//        String[] analyzeProductName = AnalyzeNameService.analyzeProductName(productName);
        //String[]{format,productType,m,n,a,b,mnAngle,suffix,igSuffix,productTypeName}
    }

//    /**
//     * 插入旧板匹配结果，返回id
//     */
//    @Transactional
//    public int insertOldpanelMatchResult(int designlistId, int oldpanelId, String iscompleteMatch) {
//        return insertProjectService.insertDataToTable("insert into oldpanel_match_result " +
//                "(designlistId,oldpanelId,iscompleteMatch) values (?,?,?)"
//                , String.valueOf(designlistId), String.valueOf(oldpanelId),iscompleteMatch);
//    }



    @Transactional
    public boolean matchError(String projectId, String buildingId, String buildingpositionId){
        String sql = "update designlist set madeBy=9 where madeBy=0 and projectId=\""+projectId+
                "\" and buildingId=\""+buildingId+"\" and buildingpositionId=\""+buildingpositionId+"\"";
        jo.update(sql);
        return true;
    }

    @Transactional
    public String oldpanelFitRuleSQL(String queryOldpanelFitRule, DataRow rulesRow, DataRow productInfo,String oldpanelFormat){
        int value;
        String con = "";
        StringBuilder queryOldpanelFitRuleBuilder = new StringBuilder(queryOldpanelFitRule);
        for (int i = 0; i < oldpanelFormat.length(); i++) {
            switch (oldpanelFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    if((rulesRow.get("mConO")!=null)&&(rulesRow.get("mConO").toString().length()!=0)){
                        con = rulesRow.get("mConO").toString();
                        value = Integer.parseInt(productInfo.get("mValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.mValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.mValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    break;
                case '3':
                    if((rulesRow.get("nConO")!=null)&&(rulesRow.get("nConO").toString().length()!=0)){
                        con = rulesRow.get("nConO").toString();
                        value = Integer.parseInt(productInfo.get("nValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.nValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.nValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    break;
                case '4':
                case '5':
                case '9':
                    if((rulesRow.get("aConO")!=null)&&(rulesRow.get("aConO").toString().length()!=0)){
                        con = rulesRow.get("aConO").toString();
                        value = Integer.parseInt(productInfo.get("aValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.aValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.aValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    if((rulesRow.get("bConO")!=null)&&(rulesRow.get("bConO").toString().length()!=0)){
                        con = rulesRow.get("bConO").toString();
                        value = Integer.parseInt(productInfo.get("bValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.bValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.bValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    break;
                case '8':
                    if((rulesRow.get("pConO")!=null)&&(rulesRow.get("pConO").toString().length()!=0)){
                        con = rulesRow.get("pConO").toString();
                        value = Integer.parseInt(productInfo.get("pValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.pValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.pValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    con = rulesRow.get("pAngleO").toString();
                    queryOldpanelFitRuleBuilder.append(" AND pAngle=").append(con);
                case '6':
                    if((rulesRow.get("mConO")!=null)&&(rulesRow.get("mConO").toString().length()!=0)){
                        con = rulesRow.get("mConO").toString();
                        value = Integer.parseInt(productInfo.get("mValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.mValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.mValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    con = rulesRow.get("mAngleO").toString();
                    queryOldpanelFitRuleBuilder.append(" AND mAngle=").append(con);
                    if((rulesRow.get("nConO")!=null)&&(rulesRow.get("nConO").toString().length()!=0)){
                        con = rulesRow.get("nConO").toString();
                        value = Integer.parseInt(productInfo.get("nValue").toString());
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.nValue>=").append(value + Integer.parseInt(con.split("&")[0])).append(" AND oldpanel_info.nValue<=").append(value + Integer.parseInt(con.split("&")[1]));
                    }
                    con = rulesRow.get("nAngleO").toString();
                    queryOldpanelFitRuleBuilder.append(" AND nAngle=").append(con);
                    break;
                case '7':
                    if((rulesRow.get("suffixO")!=null)&&(rulesRow.get("suffixO").toString().length()!=0)){
                        con = rulesRow.get("suffixO").toString();
                        queryOldpanelFitRuleBuilder.append(" AND oldpanel_info.suffix=\"").append(con).append("\"");
                    }
                    break;
            }
        }
        queryOldpanelFitRule = queryOldpanelFitRuleBuilder.toString();
        return queryOldpanelFitRule;
    }

    @Transactional
    public boolean isProductFitRule(String productFormat, DataRow rulesRow, DataRow productInfo){
        for (int i = 0; i < productFormat.length(); i++) {
            int aValueP;
            int bValueP;
            int mValueP;
            int nValueP;
            int pValueP;
            int mAngleP;
            int nAngleP;
            int pAngleP;
            String suffixP = "";
            switch (productFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    if(!isValueFit(mValueP,rulesRow.get("mConP").toString()))
                        return false;
                    break;
                case '3':
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    if(!isValueFit(nValueP,rulesRow.get("nConP").toString()))
                        return false;
                    break;
                case '4':
                case '5':
                case '9':
                    aValueP = Integer.parseInt(productInfo.get("aValue").toString());
                    bValueP = Integer.parseInt(productInfo.get("bValue").toString());
                    if((!isValueFit(aValueP,rulesRow.get("aConP").toString()))||(!isValueFit(bValueP,rulesRow.get("bConP").toString())))
                        return false;
                    break;
                case '6':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    mAngleP = Integer.parseInt(productInfo.get("mAngle").toString());
                    nAngleP = Integer.parseInt(productInfo.get("nAngle").toString());
                    if((!isValueFit(mValueP,rulesRow.get("mConP").toString()))||(!isValueFit(nValueP,rulesRow.get("nConP").toString()))
                            ||(!isAngleFit(mAngleP,rulesRow.get("mAngleP").toString()))||(!isAngleFit(nAngleP,rulesRow.get("nAngleP").toString())))
                        return false;
                    break;
                case '7':
                    if(productInfo.get("suffix")!=null)
                        suffixP = productInfo.get("suffix").toString();
                    if(!isSuffixFit(suffixP,rulesRow.get("suffixP").toString()))
                        return false;
                    break;
                case '8':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    pValueP = Integer.parseInt(productInfo.get("pValue").toString());
                    mAngleP = Integer.parseInt(productInfo.get("mAngle").toString());
                    nAngleP = Integer.parseInt(productInfo.get("nAngle").toString());
                    pAngleP = Integer.parseInt(productInfo.get("pAngle").toString());
                    if((!isValueFit(mValueP,rulesRow.get("mConP").toString()))||(!isValueFit(nValueP,rulesRow.get("nConP").toString()))
                            ||(!isValueFit(pValueP,rulesRow.get("pConP").toString()))||(!isAngleFit(pAngleP,rulesRow.get("pAngleP").toString()))
                            ||(!isAngleFit(mAngleP,rulesRow.get("mAngleP").toString()))||(!isAngleFit(nAngleP,rulesRow.get("nAngleP").toString())))
                        return false;
                    break;
            }
        }
        return true;
    }

    @Transactional
    public boolean isOldpanelMatchRange(String oldpanelFormat, String[] oRan, DataRow oldpanelRow, DataRow productInfo){
        // int mValue,int nValue,int pValue,
        //                                        int aValue,int bValue,int mAngle,int nAngle,int pAngle,String suffix,
        //                                        int mValueP,int nValueP,int pValueP, int aValueP,int bValueP
        for (int i = 0; i < oldpanelFormat.length(); i++) {
            int aValueP;
            int bValueP;
            int mValueP;
            int nValueP;
            int pValueP;
            int aValueO;
            int bValueO;
            int mValueO;
            int nValueO;
            int pValueO;
            int mAngleO;
            int nAngleO;
            int pAngleO;
            String suffixO = "";
            switch (oldpanelFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    mValueO = Integer.parseInt(oldpanelRow.get("mValue").toString());
                    if(!isValueRangeFit(mValueP,mValueO,oRan[i]))
                        return false;
                    break;
                case '3':
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    nValueO = Integer.parseInt(oldpanelRow.get("nValue").toString());
                    if(!isValueRangeFit(nValueP,nValueO,oRan[i]))
                        return false;
                    break;
                case '4':
                case '9':
                    String aRan1 = oRan[i].split("%")[0];
                    String bRan1 = oRan[i].split("%")[1];
                    aValueP = Integer.parseInt(productInfo.get("aValue").toString());
                    bValueP = Integer.parseInt(productInfo.get("bValue").toString());
                    aValueO = Integer.parseInt(oldpanelRow.get("aValue").toString());
                    bValueO = Integer.parseInt(oldpanelRow.get("bValue").toString());
                    if((!isValueRangeFit(aValueP,aValueO,aRan1))||(!isValueRangeFit(bValueP,bValueO,bRan1)))
                        return false;
                    break;
                case '5':
                    String aRan2 = oRan[i].split("%")[1];
                    String bRan2 = oRan[i].split("%")[0];
                    aValueP = Integer.parseInt(productInfo.get("aValue").toString());
                    bValueP = Integer.parseInt(productInfo.get("bValue").toString());
                    aValueO = Integer.parseInt(oldpanelRow.get("aValue").toString());
                    bValueO = Integer.parseInt(oldpanelRow.get("bValue").toString());
                    if((!isValueRangeFit(aValueP,aValueO,aRan2))||(!isValueRangeFit(bValueP,bValueO,bRan2)))
                        return false;
                    break;
                case '6':
                    String mRan1 = oRan[i].split("%")[0];
                    String nRan1 = oRan[i].split("%")[1];
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    mValueO = Integer.parseInt(oldpanelRow.get("mValue").toString());
                    nValueO = Integer.parseInt(oldpanelRow.get("nValue").toString());
                    mAngleO = Integer.parseInt(oldpanelRow.get("mAngle").toString());
                    nAngleO = Integer.parseInt(oldpanelRow.get("nAngle").toString());
                    if((!isValueRangeAndAngleFit(mValueP,mValueO,mAngleO,mRan1))||(!isValueRangeAndAngleFit(nValueP,nValueO,nAngleO,nRan1)))
                        return false;
                    break;
                case '7':
                    if(productInfo.get("suffix")!=null)
                        suffixO = oldpanelRow.get("suffix").toString();
                    if(!isSuffixFit(suffixO,oRan[i]))
                        return false;
                    break;
                case '8':
                    String mRan = oRan[i].split("%")[0];
                    String nRan = oRan[i].split("%")[1];
                    String pRan = oRan[i].split("%")[2];
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    pValueP = Integer.parseInt(productInfo.get("pValue").toString());
                    mValueO = Integer.parseInt(oldpanelRow.get("mValue").toString());
                    nValueO = Integer.parseInt(oldpanelRow.get("nValue").toString());
                    pValueO = Integer.parseInt(oldpanelRow.get("pValue").toString());
                    mAngleO = Integer.parseInt(oldpanelRow.get("mAngle").toString());
                    nAngleO = Integer.parseInt(oldpanelRow.get("nAngle").toString());
                    pAngleO = Integer.parseInt(oldpanelRow.get("pAngle").toString());
                    if((!isValueRangeAndAngleFit(mValueP,mValueO,mAngleO,mRan))||(!isValueRangeAndAngleFit(nValueP,nValueO,nAngleO,nRan))
                            ||(!isValueRangeAndAngleFit(pValueP,pValueO,pAngleO,pRan)))
                        return false;
                    break;
            }
        }
        return true;
    }

    private boolean isValueRangeFit(int valueP, int valueO, String ran){
        String[] sR = ran.split("&");
        int low = Integer.parseInt(sR[0]) + valueP;
        int high = Integer.parseInt(sR[1]) + valueP;
        return (valueO >= low) && (valueO <= high);
    }

    private boolean isValueRangeAndAngleFit(int valueP, int valueO, int angleO, String ran){
        String[] sR = ran.split("&");
        int low = Integer.parseInt(sR[0]) + valueP;
        int high = Integer.parseInt(sR[1]) + valueP;
        if(sR.length<3)
            return (valueO >= low) && (valueO <= high);
        int angleCon = Integer.parseInt(sR[2]);
        return (valueO >= low) && (valueO <= high) && (angleO==angleCon);
    }

    @Transactional
    public boolean isProductFitCondition(String productFormat,String[] pCon,DataRow productInfo) {
        //>200-<=400+>150%%>400-<300-=0+<200-=1+>100-=2%#LA!AA
        for (int i = 0; i < productFormat.length(); i++) {
            int aValueP;
            int bValueP;
            int mValueP;
            int nValueP;
            int pValueP;
            int mAngleP;
            int nAngleP;
            int pAngleP;
            String suffixP = "";
            switch (productFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    if(!isMValueFit(mValueP,pCon[i]))
                        return false;
                    break;
                case '3':
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    if(!isMValueFit(nValueP,pCon[i]))
                        return false;
                    break;
                case '4':
                case '9':
                    aValueP = Integer.parseInt(productInfo.get("aValue").toString());
                    bValueP = Integer.parseInt(productInfo.get("bValue").toString());
                    if(!isABValueFit(aValueP,bValueP,pCon[i]))
                        return false;
                    break;
                case '5':
                    aValueP = Integer.parseInt(productInfo.get("aValue").toString());
                    bValueP = Integer.parseInt(productInfo.get("bValue").toString());
                    if(!isABValueFit(bValueP,aValueP,pCon[i]))
                        return false;
                    break;
                case '6':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    mAngleP = Integer.parseInt(productInfo.get("mAngle").toString());
                    nAngleP = Integer.parseInt(productInfo.get("nAngle").toString());
                    if(!isMNValueFit(mValueP,nValueP,mAngleP,nAngleP,pCon[i]))
                        return false;
                    break;
                case '7':
                    if(productInfo.get("suffix")!=null)
                        suffixP = productInfo.get("suffix").toString();
                    if(!isSuffixFit(suffixP,pCon[i]))
                        return false;
                    break;
                case '8':
                    mValueP = Integer.parseInt(productInfo.get("mValue").toString());
                    nValueP = Integer.parseInt(productInfo.get("nValue").toString());
                    pValueP = Integer.parseInt(productInfo.get("pValue").toString());
                    mAngleP = Integer.parseInt(productInfo.get("mAngle").toString());
                    nAngleP = Integer.parseInt(productInfo.get("nAngle").toString());
                    pAngleP = Integer.parseInt(productInfo.get("pAngle").toString());
                    if(!isMNPValueFit(mValueP,nValueP,pValueP,mAngleP,nAngleP,pAngleP,pCon[i]))
                        return false;
                    break;
            }
        }
        return true;
    }

    private boolean isValueFit(int value, String con){
        if((con!=null)&&(!con.equals(""))){
            String[] smC = con.split("&");
            for (String s : smC) {
                char conm = s.charAt(0);//>,<,=
                switch (conm) {
                    case '>':
                        if (!isValueGreaterThanCon(value,s.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(value,s.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(value,s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }

    private boolean isAngleFit(int angle, String con){
        if((con!=null)&&(!con.equals("")))
            return angle==Integer.parseInt(con);
        return true;
    }


    private boolean isMValueFit(int mValue, String con){
        if((con!=null)&&(!con.equals(""))){
            String[] smC = con.split("&");
            for (String s : smC) {
                char conm = s.charAt(0);//>,<,=
                switch (conm) {
                    case '>':
                        if (!isValueGreaterThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(mValue,s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }

    private boolean isABValueFit(int aValue,int bValue, String con){
        String[] sCon = con.split("%");
        if((sCon[0]!=null)&&(!sCon[0].equals(""))){
            String[] saC = sCon[0].split("&");
            for (String s : saC) {
                char cona = s.charAt(0);//>,<,=
                switch (cona) {
                    case '>':
                        if (!isValueGreaterThanCon(aValue,s.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(aValue,s.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(aValue,s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        if((sCon[1]!=null)&&(!sCon[1].equals(""))){
            String[] sbC = sCon[1].split("&");
            for (String ss : sbC) {
                char conb = ss.charAt(0);//>,<,=
                switch (conb) {
                    case '>':
                        if (!isValueGreaterThanCon(bValue,ss.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(bValue,ss.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(bValue,ss.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }
    private boolean isMNValueFit(int mValue,int nValue,int mAngle,int nAngle, String con){
        String[] sCon = con.split("%");
        if((sCon[0]!=null)&&(!sCon[0].equals(""))){
            String[] smC = sCon[0].split("&");
            for (String s : smC) {
                char conm = s.charAt(0);//>,<,=
                switch (conm) {
                    case '>':
                        if (!isValueGreaterThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '#':
                        if(!isValueEqualToCon(mAngle,s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        if((sCon[1]!=null)&&(!sCon[1].equals(""))){
            String[] snC = sCon[1].split("&");
            for (String ss : snC) {
                char conn = ss.charAt(0);//>,<,=
                switch (conn) {
                    case '>':
                        if (!isValueGreaterThanCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '#':
                        if(!isValueEqualToCon(nAngle,ss.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }

    private boolean isMNPValueFit(int mValue,int nValue,int pValue,int mAngle,int nAngle,int pAngle, String con){
        String[] sCon = con.split("%");
        if((sCon[0]!=null)&&(!sCon[0].equals(""))){
            String[] smC = sCon[0].split("&");
            for (String s : smC) {
                char conm = s.charAt(0);//>,<,=
                switch (conm) {
                    case '>':
                        if (!isValueGreaterThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(mValue,s.substring(1)))
                            return false;
                        break;
                    case '#':
                        if(!isValueEqualToCon(mAngle,s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        if((sCon[1]!=null)&&(!sCon[1].equals(""))){
            String[] snC = sCon[1].split("&");
            for (String ss : snC) {
                char conn = ss.charAt(0);//>,<,=
                switch (conn) {
                    case '>':
                        if (!isValueGreaterThanCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(nValue,ss.substring(1)))
                            return false;
                        break;
                    case '#':
                        if(!isValueEqualToCon(nAngle,ss.substring(1)))
                            return false;
                        break;
                }
            }
        }
        if((sCon[2]!=null)&&(!sCon[2].equals(""))){
            String[] spC = sCon[2].split("&");
            for (String sss : spC) {
                char conp = sss.charAt(0);//>,<,=
                switch (conp) {
                    case '>':
                        if (!isValueGreaterThanCon(pValue,sss.substring(1)))
                            return false;
                        break;
                    case '<':
                        if (!isValueLessThanCon(pValue,sss.substring(1)))
                            return false;
                        break;
                    case '=':
                        if (!isValueEqualToCon(pValue,sss.substring(1)))
                            return false;
                        break;
                    case '#':
                        if(!isValueEqualToCon(pAngle,sss.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }

    private boolean isSuffixFit(String suffix, String con){
        if((con!=null)&&(!con.equals(""))){
            String[] sxC = con.split("&");
            for (String s : sxC) {
                char conm = s.charAt(0);//>,<,=
                switch (conm) {
                    case '#':
                        if (!suffix.contains(s.substring(1)))
                            return false;
                        break;
                    case '!':
                        if (suffix.contains(s.substring(1)))
                            return false;
                        break;
                }
            }
        }
        return true;
    }

    private boolean isValueGreaterThanCon(int value, String singleCon){
        if (analyzeNameService.isStringNotPureNumber(singleCon.substring(0,1))) {//>=
            return value >= Integer.parseInt(singleCon.substring(1));
        } else {
            return value > Integer.parseInt(singleCon);
        }
    }

    private boolean isValueLessThanCon(int value, String singleCon){
        if (analyzeNameService.isStringNotPureNumber(singleCon.substring(0,1))) {//>=
            return value <= Integer.parseInt(singleCon.substring(1));
        } else {
            return value < Integer.parseInt(singleCon);
        }
    }

    private boolean isValueEqualToCon(int value, String singleCon){
        return value == Integer.parseInt(singleCon);
    }

    private void updateStoreCount(String storeName, double countUse, int id){
        jo.update("update "+storeName+"_store set countUse=\"" + countUse + "\" where id=\"" + id+"\"");
    }




}
