package com.bancai.commonMethod;


import com.bancai.service.BaseService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import com.bancai.service.TableService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class AnalyzeNameService extends BaseService {
    private Logger log = Logger.getLogger(AnalyzeNameService.class);
    private static String isPureWord = "^[A-Za-z]+$";
    private static String isNumber = "^[-]?[0-9]+([.][0-9]+)?$";
    private static String isNonnegativeNumber = "^[0-9]+([.][0-9]+)?$";
    private static String isPureNumber = "[0-9]+";
    private static String isPositiveInteger = "^[1-9][0-9]*$";
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;

    @Transactional
    public String getTime(){
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return simpleDateFormat.format(date);
    }
    @Transactional
    public boolean isNotFitRollbackTime(String time) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = simpleDateFormat.parse(time);
        Date now = simpleDateFormat.parse(getTime());
        long cha = now.getTime() - date.getTime();
        return cha * 1.0 / (1000 * 60 * 60) >1;
    }
    @Transactional
    public boolean isStringNotNonnegativeNumber(String str){ return !str.matches(isNonnegativeNumber); }
    @Transactional
    public boolean isStringNotNumber(String str){ return !str.matches(isNumber); }
    @Transactional
    public boolean isStringNotPureNumber(String str){ return !str.matches(isPureNumber); }
    @Transactional
    public boolean isStringNotPureWord(String str){ return !str.matches(isPureWord); }
    @Transactional
    public boolean isStringNotPositiveInteger(String str){ return !str.matches(isPositiveInteger); }
    @Transactional
    public void updateIsrollbackToOneById(String tableName,String id){ jo.update("update "+tableName+" set isrollback=1 where id=\""+id+"\""); }
    @Transactional
    public DataList checkCountALessThanCountBInJsonArray(JSONArray jsonArray,String countA,String countB){
        System.out.println("[===checkCount===]");
        DataList errorList = new DataList();
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonTemp = jsonArray.getJSONObject(i);
            String counta = (jsonTemp.get(countA)+"").trim();
            String countb = jsonTemp.get(countB)+"";
            if((counta.equals("null"))||(counta.length()==0)){
                DataRow errorRow = new DataRow();
                errorRow.put("id",jsonTemp.get("id").toString());
                errorRow.put("errorType","数量未输入");
                errorList.add(errorRow);
            }else if(isStringNotNonnegativeNumber(counta)){
                DataRow errorRow = new DataRow();
                errorRow.put("id",jsonTemp.get("id").toString());
                errorRow.put("errorType","数量错误输入");
                errorList.add(errorRow);
            }else if(Double.parseDouble(counta)>Double.parseDouble(countb)){
                DataRow errorRow = new DataRow();
                errorRow.put("id",jsonTemp.get("id").toString());
                errorRow.put("errorType","数量超出范围");
                errorList.add(errorRow);
            }
        }
        System.out.println("[===result:errorNum===]"+errorList.size());
        return errorList;
    }
    @Transactional
    public DataRow canRollback(String tableName,String id){
        DataList queryList = queryService.query("select * from "+tableName+" where id=?",id);
        DataRow row = new DataRow();
        if((!queryList.isEmpty())&&((queryList.get(0).get("isrollback")+"").equals("0")))
            row = queryList.get(0);
        return row;
    }
    @Transactional
    public DataList addErrorRowToErrorList(DataList errorList, String id, String errorType,HashMap<String,String> map){
        DataRow errorRow = new DataRow();
        errorRow.put("id",id);
        errorRow.put("errorType",errorType);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()){
            String key = iterator.next().toString();
            String value = map.get(key);
            errorRow.put(key,value);
        }
        errorList.add(errorRow);
        return errorList;
    }
    @Transactional
    public String oldpanelPartNoGenerator(String typeId,String infoId,String classificationId){
        StringBuilder typeIdBuilder = new StringBuilder(typeId);
        StringBuilder infoIdBuilder = new StringBuilder(infoId);
        while(typeIdBuilder.length()<2){
            typeIdBuilder.insert(0, "0");
        }
        while(infoIdBuilder.length()<4){
            infoIdBuilder.insert(0, "0");
        }
        return "217080"+classificationId+typeIdBuilder.toString()+infoIdBuilder.toString();
    }
    @Transactional
    public String productPartNoNewGenerator(String typeId,String infoId,String classificationId){
        StringBuilder typeIdBuilder = new StringBuilder(typeId);
        StringBuilder infoIdBuilder = new StringBuilder(infoId);
        while(typeIdBuilder.length()<2){
            typeIdBuilder.insert(0, "0");
        }
        while(infoIdBuilder.length()<4){
            infoIdBuilder.insert(0, "0");
        }
        return "215080"+classificationId+typeIdBuilder.toString()+infoIdBuilder.toString();
    }
    @Transactional
    public String productPartNoOldGenerator(String typeId,String infoId,String classificationId){
        StringBuilder typeIdBuilder = new StringBuilder(typeId);
        StringBuilder infoIdBuilder = new StringBuilder(infoId);
        while(typeIdBuilder.length()<2){
            typeIdBuilder.insert(0, "0");
        }
        while(infoIdBuilder.length()<4){
            infoIdBuilder.insert(0, "0");
        }
        return "218080"+classificationId+typeIdBuilder.toString()+infoIdBuilder.toString();
    }
    /**
     * 根据旧板类型名获取类型ID
     */
    @Transactional
    public String getOldpanelType(String oldpanelTypeName){
        DataList list = queryService.query("select * from oldpaneltype where oldpanelTypeName=?", oldpanelTypeName);
        if(list.size()==0)
            return "0";
        return list.get(0).get("oldpanelType").toString();
    }
    /**
     * 旧板品名解析。输入旧板品名，返回String[]{format,oldpanelType,m,n,a,b,mnAngle,suffix,oldpanelTypeName};
     */
    @Transactional
    public String[] analyzeOldpanelName(String oldpanelName){
        oldpanelName = oldpanelName.trim().toUpperCase();
        System.out.println("analyzeOldpanelName==="+oldpanelName);
        String[] sOName = oldpanelName.split("\\s+");
        DataList typeList = getTypeByOldpanelName(oldpanelName.split("-")[0]);
        if(typeList.size()==0)
            return null;
        String oldpanelTypeId = typeList.get(0).get("id").toString();
        String classificationId = typeList.get(0).get("classificationId").toString();
        String oldpanelTypeName = typeList.get(0).get("oldpanelTypeName").toString();
        StringBuilder formatBuilder = new StringBuilder();
        String m = null;
        String n = null;
        String p = null;
        String a = null;
        String b = null;
        String mAngle = "0";
        String nAngle = "0";
        String pAngle = "0";
        StringBuilder suffixBuilder = new StringBuilder();
        int conM = 0;
        for (int i = 0; i < 4; i++) {
            if(i>=(sOName.length)){
                formatBuilder.append("0");
            } else if(sOName[i].equals(oldpanelTypeName)){
                formatBuilder.append("1");
            } else if(sOName[i].matches(isPureNumber)){
                if(conM==0){
                    m = sOName[i];
                    formatBuilder.append("2");
                    conM=1;
                } else if(conM==1){
                    n = sOName[i];
                    formatBuilder.append("3");
                    conM=2;
                } else {
                    suffixBuilder.append(sOName[i]);
                    suffixBuilder.append(" ");
                    formatBuilder.append("7");
                }
            } else if (sOName[i].contains("*")) {
                b = SetLengthAndWidth(sOName[i].split("\\*")[0],sOName[i].split("\\*")[1])[0];
                a = SetLengthAndWidth(sOName[i].split("\\*")[0],sOName[i].split("\\*")[1])[1];
                if(a.equals(sOName[i].split("\\*")[0]))
                    formatBuilder.append("4");
                else
                    formatBuilder.append("5");
            } else if (sOName[i].contains("+")) {
                switch (getFormatWithPlus("oldpanel",oldpanelTypeId)){
                    case 1:
                        m = sOName[i].split("\\+")[0];
                        n = sOName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "1";
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "2";
                        } else
                            mAngle = "0";
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "1";
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "2";
                        } else
                            nAngle = "0";
                        formatBuilder.append("6");
                        break;
                    case 2:
                        m = sOName[i].split("\\+")[0];
                        n = sOName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "1";
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "2";
                        } else
                            mAngle = "0";
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "1";
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "2";
                        } else
                            nAngle = "0";
                        p = sOName[i].split("\\+")[2];
                        if(p.contains("A")){
                            p = p.substring(0,p.length()-1);
                            pAngle = "1";
                        } else if(p.contains("B")){
                            p = p.substring(0,p.length()-1);
                            pAngle = "2";
                        } else
                            pAngle = "0";
                        formatBuilder.append("8");
                        break;
                    case 3:
                        a = sOName[i].split("\\+")[0];
                        b = sOName[i].split("\\+")[1];
                        formatBuilder.append("9");
                        break;
                    case 0:
                        return null;
                }
            } else {
                suffixBuilder.append(sOName[i]);
                suffixBuilder.append(" ");
                formatBuilder.append("7");
            }

        }
        String format = formatBuilder.toString() + "";
        String suffix = (suffixBuilder.toString() + "").trim();
        if((format.contains("3"))&&(n.equals(SetLengthAndWidth(m,n)[0]))){
            String temp = m + n;
            n = temp.substring(0, temp.length()-n.length());
            m = temp.substring(n.length());
            format = format.replace("3","l");
            format = format.replace("2","3");
            format = format.replace("l","2");
        }
        System.out.println("AnaResult======="+ Arrays.toString(new String[]{oldpanelName,format,oldpanelTypeId,classificationId,
                m,n,p,a,b,mAngle,nAngle,pAngle,suffix,oldpanelTypeName}));
        return new String[]{format,oldpanelTypeId,classificationId,m,n,p,a,b,
               mAngle,nAngle,pAngle,suffix,oldpanelTypeName};
    }


    private String[] SetLengthAndWidth(String m, String n){
        int a = Integer.parseInt(m);
        int b = Integer.parseInt(n);
        int max = Math.max(a,b);
        int min = Math.min(a,b);
        return new String[]{String.valueOf(max),String.valueOf(min)};
    }

    /**
     * 根据旧板品名获取type表内容
     */
    @Transactional
    public DataList getTypeByOldpanelName(String oldpanelName){
        String oldpanelTypeName = "";
        String[] sOName = oldpanelName.split("\\s+");
        DataList list = new DataList();
        for (String s : sOName) {
            if (s.substring(0, 1).matches(isPureWord)) {
                oldpanelTypeName = s;
                break;
            }
        }
        if(oldpanelTypeName.equals(""))
            return list;
        list = queryService.query("select * from oldpaneltype where oldpanelTypeName=?",oldpanelTypeName);
        return list;
    }
    /**
     * 根据产品品名获取type表内容
     */
    @Transactional
    public DataList getTypeByProductName(String productName){
        String productTypeName = "";
        String[] sPName = productName.split("\\s+");
        DataList list = new DataList();
        for (String s : sPName) {
            if (s.substring(0, 1).matches(isPureWord)) {
                productTypeName = s;
                break;
            }
        }
        if(productTypeName.equals(""))
            return list;
        list = queryService.query("select * from producttype where productTypeName=?",productTypeName);
        return list;
    }
    /**
     * 根据类型（旧板、产品）和品名判断format是否存在，返回id或0
     */
    @Transactional
    public int isFormatExist(String tablename, String typeId, String format) {
        String sql = "select id from "+tablename+"_format where "+tablename+"TypeId=? and "+tablename+"Format=?";
        DataList dataList = queryService.query(sql,typeId,format);
        if(dataList.isEmpty())
            return 0;
        return Integer.parseInt(dataList.get(0).get("id").toString());
    }

    /**
     * 根据类型（旧板、产品）和品名判断info是否存在，返回id或0
     */
    @Transactional
    public int isInfoExist(String tableName, String panelName) {
        String sql = "select id from "+tableName+"_info where "+tableName+"Name=?";
        DataList dataList = queryService.query(sql,panelName);
        if(dataList.isEmpty())
            return 0;
        return Integer.parseInt(dataList.get(0).get("id").toString());
    }
    /**
     * 根据类型（旧板、产品）和品名判断info是否存在，返回id,unitWeight,unitArea
     */
    @Transactional
    public String[] isInfoExistBackUnit(String tableName, String panelName) {
        String sql = "select * from "+tableName+"_info where "+tableName+"Name=?";
        DataList dataList = queryService.query(sql,panelName);
        if(dataList.isEmpty())
            return null;
        String id = dataList.get(0).get("id").toString();
        String unitWeight = null;
        String unitArea = null;
        if((dataList.get(0).get("unitWeight")!=null)&&(dataList.get(0).get("unitWeight").toString().length()!=0))
            unitWeight = dataList.get(0).get("unitWeight").toString();
        if((dataList.get(0).get("unitArea")!=null)&&(dataList.get(0).get("unitArea").toString().length()!=0))
            unitArea = dataList.get(0).get("unitArea").toString();
        return new String[]{id,unitWeight,unitArea};
    }

    @Transactional
    public boolean isWarehouseNameNotExist(String warehouseName){
        return queryService.query("select * from storeposition where warehouseName=?",warehouseName).isEmpty();
    }
    /**
     * 根据产品类型名获取类型ID
     */
    @Transactional
    public String getProductType(String productTypeName){
        DataList list = queryService.query("select * from producttype where productTypeName=?", productTypeName);
        if(list.size()==0)
            return "0";
        return list.get(0).get("id").toString();
    }
    /**
     * 根据（产品，旧板）类型id查询含+的格式为m+n或m+n+p或a+b。1,2,3。0为不存在
     */
    @Transactional
    public int getFormatWithPlus(String name, String panelTypeId){
        DataList list = queryService.query("select * from "+name+"_format where "+name+"TypeId=?", panelTypeId);
        if(list.size()!=0) {
            for (DataRow dataRow : list) {
                String format = dataRow.get(name+"Format").toString();
                if (format.contains("6"))
                    return 1;
                else if (format.contains("8"))
                    return 2;
                else if (format.contains("9"))
                    return 3;
            }
        }
        return 0;
    }

    /**
     * 清单产品品名解析。
     */
    @Transactional
    public String[] analyzeProductName(String productName){
        productName = productName.trim().toUpperCase();
        System.out.println("analyzeProductName==="+productName);
        String[] sPName = productName.split("-")[0].split("\\s+");
        String igSuffix;
        if(productName.split("-").length>1)
            igSuffix = productName.substring(productName.split("-")[0].length()+1);
        else
            igSuffix = "";
        DataList typeList = getTypeByProductName(productName.split("-")[0]);
        if(typeList.size()==0)
            return null;
        String productTypeId = typeList.get(0).get("id").toString();
        String classificationId = typeList.get(0).get("classificationId").toString();
        String productTypeName = typeList.get(0).get("productTypeName").toString();
        StringBuilder formatBuilder = new StringBuilder();
        String m = null;
        String n = null;
        String p = null;
        String a = null;
        String b = null;
        String mAngle = "0";
        String nAngle = "0";
        String pAngle = "0";
        StringBuilder suffixBuilder = new StringBuilder();
        int conM = 0;
        for (int i = 0; i < 4; i++) {
            if(i>=(sPName.length)){
                formatBuilder.append("0");
            } else if(sPName[i].equals(productTypeName)){
                formatBuilder.append("1");
            } else if(sPName[i].matches(isPureNumber)){
                if(conM==0){
                    m = sPName[i];
                    formatBuilder.append("2");
                    conM=1;
                } else if(conM==1){
                    n = sPName[i];
                    formatBuilder.append("3");
                    conM=2;
                } else {
                    suffixBuilder.append(sPName[i]);
                    suffixBuilder.append(" ");
                    formatBuilder.append("7");
                }
            } else if (sPName[i].contains("X")) {
                b = SetLengthAndWidth(sPName[i].split("X")[0],sPName[i].split("X")[1])[0];
                a = SetLengthAndWidth(sPName[i].split("X")[0],sPName[i].split("X")[1])[1];
                if(a.equals(sPName[i].split("X")[0]))
                    formatBuilder.append("4");
                else
                    formatBuilder.append("5");
            } else if (sPName[i].contains("+")) {
                switch (getFormatWithPlus("product",productTypeId)){
                    case 1:
                        m = sPName[i].split("\\+")[0];
                        n = sPName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "1";
                        } else if(m.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "2";
                        } else
                            mAngle = "0";
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "1";
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "2";
                        } else
                            nAngle = "0";
                        formatBuilder.append("6");
                        break;
                    case 2:
                        m = sPName[i].split("\\+")[0];
                        n = sPName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "1";
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = "2";
                        } else
                            mAngle = "0";
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "1";
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = "2";
                        } else
                            nAngle = "0";
                        p = sPName[i].split("\\+")[2];
                        if(p.contains("A")){
                            p = p.substring(0,p.length()-1);
                            pAngle = "1";
                        } else if(p.contains("B")){
                            p = p.substring(0,p.length()-1);
                            pAngle = "2";
                        } else
                            pAngle = "0";
                        formatBuilder.append("8");
                        break;
                    case 3:
                        a = sPName[i].split("\\+")[0];
                        b = sPName[i].split("\\+")[1];
                        formatBuilder.append("9");
                        break;
                    case 0:
                        return null;
                }
            } else {
                suffixBuilder.append(sPName[i]);
                suffixBuilder.append(" ");
                formatBuilder.append("7");
            }

        }
        String format = formatBuilder.toString() + "";
        String suffix = (suffixBuilder.toString() + "").trim();
        if((format.contains("3"))&&(n.equals(SetLengthAndWidth(m,n)[0]))){
            String temp = m + n;
            n = temp.substring(0, temp.length()-n.length());
            m = temp.substring(n.length());
            format = format.replace("3","l");
            format = format.replace("2","3");
            format = format.replace("l","2");
        }
        System.out.println("AnaResult======="+ Arrays.toString(new String[]{productName,format,productTypeId,classificationId,
                m,n,p,a,b, mAngle,nAngle,pAngle,suffix,igSuffix,productTypeName}));
        return new String[]{format,productTypeId,classificationId,m,n,p,a,b,
                mAngle,nAngle,pAngle,suffix,igSuffix,productTypeName};
    }



}
