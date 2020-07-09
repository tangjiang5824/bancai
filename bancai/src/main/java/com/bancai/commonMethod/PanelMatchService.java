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
    private static String isPureNumber = "^-?[0-9]+";

    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private ProductDataService productDataService;



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
        String sql2 = "update designlist set madeBy="+madeBy+" where id="+designlistId;
        jo.update(sql2);
        return Integer.parseInt(designlistId);
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
                            int designlistId = updateDesignlist(projectId, buildingId, position, 1);
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
                            int designlistId = updateDesignlist(projectId, buildingId, position, 1);
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
                            int designlistId = updateDesignlist(projectId, buildingId, position, 2);
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
                            int designlistId = updateDesignlist(projectId, buildingId, position, 2);
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

            int num = value.size();
            DataRow productInfo = queryService.query("SELECT * FROM product_info LEFT JOIN " +
                    "product_format ON (product_info.productFormatId=product_format.id) WHERE product_info.id=?",productId).get(0);
            String productFormat = productInfo.get("productFormat").toString();
            String productFormatId = productInfo.get("productFormatId").toString();
            int mValue = Integer.parseInt(productInfo.get("mValue").toString());
            int nValue = Integer.parseInt(productInfo.get("nValue").toString());
            int pValue = Integer.parseInt(productInfo.get("pValue").toString());
            int aValue = Integer.parseInt(productInfo.get("aValue").toString());
            int bValue = Integer.parseInt(productInfo.get("bValue").toString());
            int mAngle = Integer.parseInt(productInfo.get("mAngle").toString());
            int nAngle = Integer.parseInt(productInfo.get("nAngle").toString());
            int pAngle = Integer.parseInt(productInfo.get("pAngle").toString());
            String suffix = productInfo.get("suffix").toString();
            DataList rulesList = new DataList();
            rulesList = queryService.query("select * from oldpanel_match_rules where productFormatId=? and isValid=1 order by priority asc",productFormatId);
            for (DataRow rulesRow : rulesList) {
                String[] pCon = new String[]{rulesRow.get("pCon1").toString(),rulesRow.get("pCon2").toString(),
                        rulesRow.get("pCon3").toString(),rulesRow.get("pCon4").toString()};
                if(!isProductFitCondition(productFormat,pCon,mValue,nValue,pValue,aValue,bValue,mAngle,nAngle,pAngle,suffix))
                    continue;
                String oldpanelFormatId = rulesRow.get("oldpanelFormatId").toString();
                String iscompleteMatch = rulesRow.get("iscompleteMatch").toString();
                DataList oldpanelList = new DataList();
                oldpanelList = queryService.query("SELECT oldpanel_info.mValue AS mValue,oldpanel_info.nValue AS nValue,oldpanel_info.pValue AS pValue," +
                        "oldpanel_info.aValue AS aValue,oldpanel_info.bValue AS bValue,oldpanel_info.mAngle AS mAngle,oldpanel_info.nAngle AS nAngle,oldpanel_info.pAngle AS pAngle," +
                        "oldpanel_info.suffix AS suffix," +
                        "oldpanel_format.oldpanelTypeId AS oldpanelTypeId,oldpanel_format.oldpanelFormat AS oldpanelFormat,oldpanel_store.id AS id,oldpanel_store.countUse AS countUse " +
                        "FROM oldpanel_store LEFT JOIN oldpanel_info ON (oldpanel_store.oldpanelId=oldpanel_info.id) " +
                        "LEFT JOIN oldpanel_format ON (oldpanel_info.oldpanelFormatId=oldpanel_format.id) " +
                        "WHERE oldpanel_store.countUse>0 AND oldpanel_info.oldpanelFormatId=?",oldpanelFormatId);
                for (DataRow oldpanelRow : oldpanelList) {
                    String[] oRan = new String[]{rulesRow.get("oRan1").toString(),rulesRow.get("oRan2").toString(),
                            rulesRow.get("oRan3").toString(),rulesRow.get("oRan4").toString()};
                    String oldpanelFormat = oldpanelRow.get("oldpanelFormat").toString();
                    int mValueO = Integer.parseInt(oldpanelRow.get("mValue").toString());
                    int nValueO = Integer.parseInt(oldpanelRow.get("nValue").toString());
                    int pValueO = Integer.parseInt(oldpanelRow.get("pValue").toString());
                    int aValueO = Integer.parseInt(oldpanelRow.get("aValue").toString());
                    int bValueO = Integer.parseInt(oldpanelRow.get("bValue").toString());
                    int mAngleO = Integer.parseInt(oldpanelRow.get("mAngle").toString());
                    int nAngleO = Integer.parseInt(oldpanelRow.get("nAngle").toString());
                    int pAngleO = Integer.parseInt(oldpanelRow.get("pAngle").toString());
                    String suffixO = oldpanelRow.get("suffix").toString();
                    if(!isOldpanelMatchRange(oldpanelFormat,oRan,mValueO,nValueO,pValueO,aValueO,bValueO,mAngleO,nAngleO,pAngleO,suffixO,
                            mValue,nValue,pValue,aValue,bValue))
                        continue;
                    //匹配
                    System.out.println(oldpanelRow.toString());
                    int storeId = Integer.parseInt(oldpanelRow.get("id").toString());
                    int countUse = Integer.parseInt(oldpanelRow.get("countUse").toString());
                    if (num > countUse) {
                        while (countUse > 0) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 3);
                            int resultId = insertOldpanelMatchResult(designlistId,storeId,iscompleteMatch);
                            value.remove(num - 1);
                            num--;
                            countUse--;
                        }
                        updateStoreCount("oldpanel",countUse,storeId);
                    } else {
                        while (num > 0) {
                            String position = value.get(num - 1);
                            int designlistId = updateDesignlist(projectId, buildingId, position, 3);
                            int resultId = insertOldpanelMatchResult(designlistId,storeId,iscompleteMatch);
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
        return map;
    }

    /**
     * 插入旧板匹配结果，返回id
     */
    @Transactional
    public int insertOldpanelMatchResult(int designlistId, int oldpanelId, String iscompleteMatch) {
        return insertProjectService.insertDataToTable("insert into oldpanel_match_result " +
                "(designlistId,oldpanelId,iscompleteMatch) values (?,?,?)"
                , String.valueOf(designlistId), String.valueOf(oldpanelId),iscompleteMatch);
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
    public boolean isOldpanelMatchRange(String oldpanelFormat, String[] oRan, int mValue,int nValue,int pValue,
                                        int aValue,int bValue,int mAngle,int nAngle,int pAngle,String suffix,
                                        int mValueP,int nValueP,int pValueP, int aValueP,int bValueP){
        for (int i = 0; i < oldpanelFormat.length(); i++) {
            switch (oldpanelFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    if(!isValueRangeFit(mValueP,mValue,oRan[i]))
                        return false;
                    break;
                case '3':
                    if(!isValueRangeFit(nValueP,nValue,oRan[i]))
                        return false;
                    break;
                case '4':
                case '9':
                    String aRan1 = oRan[i].split("%")[0];
                    String bRan1 = oRan[i].split("%")[1];
                    if((!isValueRangeFit(aValueP,aValue,aRan1))||(!isValueRangeFit(bValueP,bValue,bRan1)))
                        return false;
                    break;
                case '5':
                    String aRan2 = oRan[i].split("%")[1];
                    String bRan2 = oRan[i].split("%")[0];
                    if((!isValueRangeFit(aValueP,aValue,aRan2))||(!isValueRangeFit(bValueP,bValue,bRan2)))
                        return false;
                    break;
                case '6':
                    String mRan1 = oRan[i].split("%")[0];
                    String nRan1 = oRan[i].split("%")[1];
                    if((!isValueRangeAndAngleFit(mValueP,mValue,mAngle,mRan1))||(!isValueRangeAndAngleFit(nValueP,nValue,nAngle,nRan1)))
                        return false;
                    break;
                case '7':
                    if(!isSuffixFit(suffix,oRan[i]))
                        return false;
                    break;
                case '8':
                    String mRan = oRan[i].split("%")[0];
                    String nRan = oRan[i].split("%")[1];
                    String pRan = oRan[i].split("%")[2];
                    if((!isValueRangeAndAngleFit(mValueP,mValue,mAngle,mRan))||(!isValueRangeAndAngleFit(nValueP,nValue,nAngle,nRan))
                            ||(!isValueRangeAndAngleFit(pValueP,pValue,pAngle,pRan)))
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
        int angleCon = Integer.parseInt(sR[2]);
        return (valueO >= low) && (valueO <= high) && (angleO==angleCon);
    }

    @Transactional
    public boolean isProductFitCondition(String productFormat,String[] pCon,int mValue,int nValue,int pValue,
                                         int aValue,int bValue,int mAngle,int nAngle,int pAngle,String suffix) {
        //>200-<=400+>150%%>400-<300-=0+<200-=1+>100-=2%#LA!AA
        for (int i = 0; i < productFormat.length(); i++) {
            switch (productFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    if(!isMValueFit(mValue,pCon[i]))
                        return false;
                    break;
                case '3':
                    if(!isMValueFit(nValue,pCon[i]))
                        return false;
                    break;
                case '4':
                case '9':
                    if(!isABValueFit(aValue,bValue,pCon[i]))
                        return false;
                    break;
                case '5':
                    if(!isABValueFit(bValue,aValue,pCon[i]))
                        return false;
                    break;
                case '6':
                    if(!isMNValueFit(mValue,nValue,mAngle,nAngle,pCon[i]))
                        return false;
                    break;
                case '7':
                    if(!isSuffixFit(suffix,pCon[i]))
                        return false;
                    break;
                case '8':
                    if(!isMNPValueFit(mValue,nValue,pValue,mAngle,nAngle,pAngle,pCon[i]))
                        return false;
                    break;
            }
        }
        return true;
    }

    private boolean isMValueFit(int mValue, String con){
        if(!con.equals("")){
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
        if(!sCon[0].equals("")){
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
        if(!sCon[1].equals("")){
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
        if(!sCon[0].equals("")){
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
        if(!sCon[1].equals("")){
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
        if(!sCon[0].equals("")){
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
        if(!sCon[1].equals("")){
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
        if(!sCon[2].equals("")){
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
        if(!con.equals("")){
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
        if (!singleCon.substring(1, 2).matches(isPureNumber)) {//>=
            return value >= Integer.parseInt(singleCon.substring(1));
        } else {
            return value > Integer.parseInt(singleCon);
        }
    }

    private boolean isValueLessThanCon(int value, String singleCon){
        if (!singleCon.substring(1, 2).matches(isPureNumber)) {//>=
            return value <= Integer.parseInt(singleCon.substring(1));
        } else {
            return value < Integer.parseInt(singleCon);
        }
    }

    private boolean isValueEqualToCon(int value, String singleCon){
        return value == Integer.parseInt(singleCon);
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
