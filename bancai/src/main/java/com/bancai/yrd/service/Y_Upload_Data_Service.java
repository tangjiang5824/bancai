package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

@Service
public class Y_Upload_Data_Service extends BaseService {
    private Logger log = Logger.getLogger(Y_Upload_Data_Service.class);
    private HSSFWorkbook wb;
    @Autowired
    private QueryAllService queryService;

    @Transactional
    public UploadDataResult uploadOldData(String oldpanelName, String classificationId, String inventoryUnit, String number,
                                          String warehouseNo, String unitArea, String unitWeight, String remark, String uploadId){
        UploadDataResult result = new UploadDataResult();
        String res = "";//类型1，m2，n3，a*b4，b*a5，m+n6，后缀7
        String er = "";
        String[] analyzeOldpanelName = analyzeOldpanelName(oldpanelName);
//        boolean upload = oldpanelUpload();
//                if(typeList.isEmpty()) {
//                    result.setErrorCode(2);
//                    return result;
//                } else {
//        boolean upload = uploadData(dataList2,userid,tablename);
//        result.dataList = dataList;
//        result.success = upload;
        return result;

    }
    /**
     * 根据品名获取类型
     */
    @Transactional
    public String getOldpanelType(String oldpanelTypeName){
        DataList list = queryService.query("select * from oldpaneltype where oldpanelTypeName=?", oldpanelTypeName);
        if(list.size()==0)
            return "0";
        return list.get(0).get("oldpanelType").toString();
    }
    /**
     * 旧板品名解析
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
        System.out.println("AnaResult======="+Arrays.toString(new String[]{oldpanelName,format,oldpanelType,m,n,a,b,mnAngle,suffix,oldpanelTypeName}));
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
     * 添加数据
     */
    @Transactional
    public boolean oldpanelUpload(String oldpanelName, String classificationId, String inventoryUnit,
                           String number, String warehouseName, String unitArea, String unitWeight, String remark, String uploadId) {
        String[] analyzeOldpanelName = analyzeOldpanelName(oldpanelName);
        if(!isOldpanelFormatExist(analyzeOldpanelName[0],analyzeOldpanelName[1],analyzeOldpanelName[7],analyzeOldpanelName[8]))
            return false;
        oldpanelSaveData(analyzeOldpanelName,oldpanelName,classificationId,inventoryUnit, number,
                warehouseName, unitArea, unitWeight, remark, uploadId);
        return true;
    }

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

    private void oldpanelSaveData(String[] analyzeOldpanelName, String oldpanelName, String classificationId, String inventoryUnit,
                                  String number, String warehouseName, String unitArea0, String unitWeight0, String remark, String uploadId) {
        double unitArea = Double.parseDouble(unitArea0);
        double unitWeight = Double.parseDouble(unitWeight0);
        double num = Double.parseDouble(number);
        double totalArea = unitArea*num;
        double totalWeight = unitWeight*num;
        String sql2 = "insert into oldpanel_store (oldpanelName,classificationId,inventoryUnit,countUse,countStore,warehouseName," +
                "unitArea,unitWeight,remark,uploadId,totalArea,totalWeight,format,oldpanelType,length,width,aValue,bValue,mnAngle,suffix) " +
                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String[] t = {oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]};
        System.out.println("Save======="+Arrays.toString(t));
        jo.update(sql2,oldpanelName,classificationId,inventoryUnit,String.valueOf(num),String.valueOf(num),warehouseName,
                String.valueOf(unitArea),String.valueOf(unitWeight),remark,uploadId,String.valueOf(totalArea),String.valueOf(totalWeight),
                analyzeOldpanelName[0],analyzeOldpanelName[1], analyzeOldpanelName[2], analyzeOldpanelName[3],
                analyzeOldpanelName[4],analyzeOldpanelName[5],analyzeOldpanelName[6],analyzeOldpanelName[7]);
    }
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


}

