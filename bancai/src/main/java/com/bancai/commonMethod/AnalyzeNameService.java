package com.bancai.commonMethod;


import com.bancai.service.BaseService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import com.bancai.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class AnalyzeNameService extends BaseService {
    private Logger log = Logger.getLogger(AnalyzeNameService.class);
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;

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
        String isPureNumber = "^-?[0-9]+";
        String isPureWord = "^[A-Za-z]+$";
        String[] sOName = oldpanelName.split("\\s+");
        DataList typeList = getTypeByOldpanelName(oldpanelName.split("-")[0]);
        if(typeList.size()==0)
            return null;
        String oldpanelTypeId = typeList.get(0).get("oldpanelType").toString();
        String classificationId = typeList.get(0).get("classificationId").toString();
        String oldpanelTypeName = typeList.get(0).get("oldpanelTypeName").toString();
        StringBuilder formatBuilder = new StringBuilder();
        String m = "0";
        String n = "0";
        String p = "0";
        String a = "0";
        String b = "0";
        int mAngle = 0;
        int nAngle = 0;
        int pAngle = 0;
        StringBuilder suffixBuilder = new StringBuilder();
        int conM = 0;
        for (int i = 0; i < 4; i++) {
            if(i>=(sOName.length-1)){
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
                            mAngle = 1;
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 2;
                        } else
                            mAngle = 0;
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 1;
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 2;
                        } else
                            nAngle = 0;
                        formatBuilder.append("6");
                        break;
                    case 2:
                        m = sOName[i].split("\\+")[0];
                        n = sOName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 1;
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 2;
                        } else
                            mAngle = 0;
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 1;
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 2;
                        } else
                            nAngle = 0;
                        p = sOName[i].split("\\+")[2];
                        if(p.contains("A")){
                            p = p.substring(0,p.length()-1);
                            pAngle = 1;
                        } else if(p.contains("B")){
                            p = p.substring(0,p.length()-1);
                            pAngle = 2;
                        } else
                            pAngle = 0;
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
        String suffix = suffixBuilder.toString() + "";
        if(!suffix.isEmpty())
            suffix = suffix.substring(0,suffix.length()-1);
        if((format.contains("3"))&&(n.equals(SetLengthAndWidth(m,n)[0]))){
            String temp = m + n;
            n = temp.substring(0, temp.length()-n.length());
            m = temp.substring(n.length());
            format = format.replace("3","l");
            format = format.replace("2","3");
            format = format.replace("l","2");
        }
        System.out.println("AnaResult======="+ Arrays.toString(new String[]{oldpanelName,format,oldpanelTypeId,classificationId,
                m,n,p,a,b, String.valueOf(mAngle),String.valueOf(nAngle),String.valueOf(pAngle),suffix,oldpanelTypeName}));
        return new String[]{format,oldpanelTypeId,classificationId,m,n,p,a,b,
                String.valueOf(mAngle),String.valueOf(nAngle),String.valueOf(pAngle),suffix,oldpanelTypeName};
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
        String isPureWord = "^[A-Za-z]+$";
        String oldpanelTypeName = "";
        String[] sOName = oldpanelName.split("\\s+");
        DataList list = new DataList();
        for (int i = 0; i < 4; i++) {
            if(sOName[i].substring(i,i+1).matches(isPureWord)){
                oldpanelTypeName = sOName[i];
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
        String isPureWord = "^[A-Za-z]+$";
        String productTypeName = "";
        String[] sPName = productName.split("\\s+");
        DataList list = new DataList();
        for (int i = 0; i < 4; i++) {
            if(sPName[i].substring(i,i+1).matches(isPureWord)){
                productTypeName = sPName[i];
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
    public int isFormatExist(String tablename, String productTypeId, String productFormat) {
        String sql = "select id from "+tablename+"_format where "+tablename+"TypeId=? and "+tablename+"Format=?";
        DataList dataList = queryService.query(sql,productTypeId,productFormat);
        if(dataList.isEmpty())
            return 0;
        return Integer.parseInt(dataList.get(0).get("id").toString());
    }

    /**
     * 根据类型（旧板、产品）和品名判断info是否存在，返回id或0
     */
    @Transactional
    public int isInfoExist(String tablename, String panelName) {
        String sql = "select id from "+tablename+"_info where "+tablename+"Name=?";
        DataList dataList = queryService.query(sql,panelName);
        if(dataList.isEmpty())
            return 0;
        return Integer.parseInt(dataList.get(0).get("id").toString());
    }
    /**
     * 根据类型（旧板、产品）和品名判断info是否存在，返回id,unitWeight,unitArea
     */
    @Transactional
    public String[] isInfoExistBackUnit(String tablename, String panelName) {
        String sql = "select * from "+tablename+"_info where "+tablename+"Name=?";
        DataList dataList = queryService.query(sql,panelName);
        if(dataList.isEmpty())
            return null;
        return new String[]{dataList.get(0).get("id").toString(),
                dataList.get(0).get("unitWeight").toString(),
                dataList.get(0).get("unitArea").toString()};
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
        String isPureNumber = "^-?[0-9]+";
        String isPureWord = "^[A-Za-z]+$";
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
        String m = "0";
        String n = "0";
        String p = "0";
        String a = "0";
        String b = "0";
        int mAngle = 0;
        int nAngle = 0;
        int pAngle = 0;
        StringBuilder suffixBuilder = new StringBuilder();
        int conM = 0;
        for (int i = 0; i < 4; i++) {
            if(i>=(sPName.length-1)){
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
                            mAngle = 1;
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 2;
                        } else
                            mAngle = 0;
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 1;
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 2;
                        } else
                            nAngle = 0;
                        formatBuilder.append("6");
                        break;
                    case 2:
                        m = sPName[i].split("\\+")[0];
                        n = sPName[i].split("\\+")[1];
                        if(m.contains("A")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 1;
                        } else if(p.contains("B")){
                            m = m.substring(0,m.length()-1);
                            mAngle = 2;
                        } else
                            mAngle = 0;
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 1;
                        } else if(n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            nAngle = 2;
                        } else
                            nAngle = 0;
                        p = sPName[i].split("\\+")[2];
                        if(p.contains("A")){
                            p = p.substring(0,p.length()-1);
                            pAngle = 1;
                        } else if(p.contains("B")){
                            p = p.substring(0,p.length()-1);
                            pAngle = 2;
                        } else
                            pAngle = 0;
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
        String suffix = suffixBuilder.toString() + "";
        if(!suffix.isEmpty())
            suffix = suffix.substring(0,suffix.length()-1);
        if((format.contains("3"))&&(n.equals(SetLengthAndWidth(m,n)[0]))){
            String temp = m + n;
            n = temp.substring(0, temp.length()-n.length());
            m = temp.substring(n.length());
            format = format.replace("3","l");
            format = format.replace("2","3");
            format = format.replace("l","2");
        }
        System.out.println("AnaResult======="+ Arrays.toString(new String[]{productName,format,productTypeId,classificationId,
                m,n,p,a,b, String.valueOf(mAngle),String.valueOf(nAngle),String.valueOf(pAngle),suffix,igSuffix,productTypeName}));
        return new String[]{format,productTypeId,classificationId,m,n,p,a,b,
                String.valueOf(mAngle),String.valueOf(nAngle),String.valueOf(pAngle),suffix,igSuffix,productTypeName};
    }



}
