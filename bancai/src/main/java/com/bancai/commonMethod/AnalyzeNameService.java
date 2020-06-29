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
        System.out.println("analyzeOldpanelName==="+oldpanelName);
        String isPureNumber = "^-?[0-9]+";
        String isPureWord = "^[A-Za-z]+$";
        String[] sOName = oldpanelName.split("\\s+");
        String oldpanelType = "0";
        StringBuilder formatBuilder = new StringBuilder();
        String m = "0";
        String n = "0";
        String a = "0";
        String b = "0";
        String mnAngle = "";
        StringBuilder suffixBuilder = new StringBuilder();
        String oldpanelTypeName = "";
        int conM = 0;
        int conT = 0;
        for (int i = 0; i < 4; i++) {
            try {
//                System.out.println("ana====="+sOName[i]);
                if (sOName[i].matches(isPureNumber)){
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
                } else if (sOName[i].substring(0,1).matches(isPureWord)){
                    if(conT==0) {
                        oldpanelTypeName = sOName[i];
                        oldpanelType = getOldpanelType(sOName[i]);
                        formatBuilder.append("1");
                        conT = 1;
                    }
                    else {
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
                    m = sOName[i].split("\\+")[0];
                    n = sOName[i].split("\\+")[1];
                    if(m.contains("A")){
                        m = m.substring(0,m.length()-1);
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "11";
                        } else if (n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "12";
                        } else {
                            mnAngle = "10";
                        }
                    } else if(m.contains("B")){
                        m = m.substring(0,m.length()-1);
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "21";
                        } else if (n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "22";
                        } else {
                            mnAngle = "20";
                        }
                    } else {
                        if(n.contains("A")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "01";
                        } else if (n.contains("B")){
                            n = n.substring(0,n.length()-1);
                            mnAngle = "02";
                        } else {
                            mnAngle = "00";
                        }
                    }
                    formatBuilder.append("6");
                } else {
                    suffixBuilder.append(sOName[i]);
                    suffixBuilder.append(" ");
                    formatBuilder.append("7");
                }
            } catch (Exception e){
                formatBuilder.append("0");
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
        System.out.println("AnaResult======="+ Arrays.toString(new String[]{oldpanelName,format,oldpanelType,m,n,a,b,mnAngle,suffix,oldpanelTypeName}));
        return new String[]{format,oldpanelType,m,n,a,b,mnAngle,suffix,oldpanelTypeName};
    }


    private String[] SetLengthAndWidth(String m, String n){
        int a = Integer.parseInt(m);
        int b = Integer.parseInt(n);
        int max = Math.max(a,b);
        int min = Math.min(a,b);
        return new String[]{String.valueOf(max),String.valueOf(min)};
    }

    /**
     * 判断旧板格式是否存在
     */
    @Transactional
    public boolean isOldpanelFormatExist(String format, String oldpanelType, String suffix, String oldpanelTypeName){
        StringBuilder formatInfoBuilder = new StringBuilder();
        String[] sSuffix = suffix.split("\\s+");
        int n = 0;
        for (int i = 0; i < 4; i++) {
            if(format.substring(i,i+1).equals("7")){
                formatInfoBuilder.append(sSuffix[n]);
                n++;
            } else if(format.substring(i,i+1).equals("1")){
                formatInfoBuilder.append(oldpanelTypeName);
            }
            formatInfoBuilder.append("%");
        }
        String formatInfo = formatInfoBuilder.toString().substring(0,formatInfoBuilder.toString().length()-1);
        return !queryService.query("select * from oldpanel_info where oldpanelFormat=? and oldpanelType=? and formatInfo=?",
                format, oldpanelType, formatInfo).isEmpty();
    }

}
