package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

import com.bancai.cg.service.InsertProjectService;
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
import org.json.JSONException;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;

@Service
public class OldpanelMatchService extends BaseService{
    private Logger log = Logger.getLogger(OldpanelMatchService.class);
    private HSSFWorkbook wb;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;

    /**
     * 上传旧板匹配数据
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    @Transactional
    public UploadDataResult oldpanelUploadMatchData(InputStream inputStream, String projectId, String buildingId) throws IOException {
        System.out.println("===oldpanelUploadMatchData");
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);
        DataList dataList = excel.readExcelContent(0);
        boolean upload = HandleDesignList(dataList, projectId, buildingId);
        DataList list=new DataList();
        for(int i=0;i<dataList.size();i++){
            DataRow row=new DataRow();
            Iterator it=dataList.get(i).entrySet().iterator();
            while (it.hasNext()){
                Map.Entry entry= (Map.Entry) it.next();
                row.put("productName",entry.getValue());
            }
            list.add(row);
        }
        result.dataList = list;
        result.success = upload;
        return result;

//        wb = new HSSFWorkbook(inputStream);
//        int sheetNum = wb.getNumberOfSheets();
//        for (int n = 0; n < sheetNum; n++) {
//            HSSFSheet sheet = wb.getSheetAt(n);
//            HSSFRow row = sheet.getRow(1);
//            HSSFCell cell = row.getCell(0);
//            String buildingNum = cell.getStringCellValue();//该表格对应的楼栋名称
//            int rowNum = sheet.getLastRowNum();
//            // 正文内容应该从第二行开始,第一行为表头的标题
//            for (int rowHere = 1; rowHere <= rowNum; rowHere++) {
//                row = sheet.getRow(rowHere);
//                cell = row.getCell(0);
//                String panelName = cell.getStringCellValue();
//                InsertDesignlist(projectId, panelName);
//                DataList oldpanelMatchList = oldpanelMatchName(panelName);
//                for(int columnHere = 1; columnHere <= oldpanelMatchList.size(); columnHere++){
////                    row.createCell(columnHere).setCellValue(oldpanelMatchList.get(columnHere-1).get(id));
//                }
//            }

//        }
    }

    @Transactional
     boolean HandleDesignList(DataList dataList, String projectId, String buildingId){
        String status = "0";
        for (DataRow dataRow : dataList) {//对于每一条板材数据
            ArrayList<String> productList = new ArrayList(dataRow.values());
            String productName = productList.get(0);
//            DataList list = queryService.query("select id from building where projectId =? and buildingName=?", projectId, buildingName);
//            String buildingId = String.valueOf(list.get(0).get("id"));
            String sql = "insert into designlist (projectId,buildingId,productName,status) values (?,?,?,?)";
//            int j = 0;
//            j = jo.update(sql, projectId, buildingId, productName, status);//插入designlist表
//            if(j==0){
//                return false;
//            }
//            DataSourceConfig com.bancai.config = new DataSourceConfig();
//            try {
//                Connection connection= DataSourceUtils.getConnection(com.bancai.config.dataSource());
//                connection.setAutoCommit(false);
//                PreparedStatement pre= connection.prepareStatement(sql);
//                pre.setObject(1,projectId);
//                pre.setObject(2,buildingId);
//                pre.setObject(3,productName);
//                pre.setObject(4,status);
//                int len= pre.executeUpdate();
//                if(len==0){
//                    connection.rollback();
//                }
//                else connection.commit();
//            } catch (Exception e) {
//
//            }
            int designlistid = insertProjectService.insertDataToTable(sql,projectId,buildingId,productName,status);
            String designlistId = String.valueOf(designlistid);
            oldpanelMatch(projectId, productName, designlistId);

        }
        return true;

    }

    private void oldpanelMatch(String projectId, String productName, String designlistId){//匹配，并插表
        String oldpanelName;
        String str = "50B BS 700";
        String[] splited = productName.split("\\s+");
        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
        String isPureWord = "^[A-Za-z]+$";
        int l = splited.length;
        DataList queryList = new DataList();
        String oldpanelTypeName = "";
        Boolean MatchResult = false;//匹配结果，false为未匹配到旧板
        if (splited[0].matches(isPureWord)){
            String panelTypeName = splited[0];
            System.out.println("===="+panelTypeName);
            String m;
            switch (panelTypeName){
                case "ECD":
                    oldpanelTypeName = "EC";
                    m = splited[1];
                    queryList = queryService.query("select * from oldpanel where oldpanelType in " +
                            "(select oldpanelType from oldpaneltype where oldpanelTypeName=? ) " +
                            "and width=?",oldpanelTypeName,m);
                    HandleMatchQueryList(queryList,projectId,productName,designlistId);
                    break;
                case "EC":
                case "EB":
                case "MB":
                    oldpanelTypeName = panelTypeName;
                    m = splited[1];
                    queryList = queryService.query("select * from oldpanel where oldpanelType in " +
                            "(select oldpanelType from oldpaneltype where oldpanelTypeName=? ) " +
                            "and width=?",oldpanelTypeName,m);
                    HandleMatchQueryList(queryList,projectId,productName,designlistId);
                    break;
                case "SS":
                    oldpanelTypeName = panelTypeName;
                    queryList = queryService.query("select * from oldpanel where oldpanelType in " +
                                    "(select oldpanelType from oldpaneltype where oldpanelTypeName=? )"
                            ,oldpanelTypeName);
                    HandleMatchQueryList(queryList,projectId,productName,designlistId);
                    break;
                default:
                    break;
            }
        }else if(splited[1].matches(isPureWord)){
            String panelTypeName = splited[1];
            double length,width=0;
            switch (panelTypeName){
                case "K":
                    oldpanelTypeName = panelTypeName;
                    length = Double.parseDouble(SetLengthAndWidth(splited[0],splited[2])[0]);
                    width = Double.parseDouble(SetLengthAndWidth(splited[0],splited[2])[1]);
                    queryList = queryService.query("select * from oldpanel WHERE oldpanelType in " +
                            "(select oldpanelType from oldpaneltype where oldpanelTypeName=? ) " +
                            "and length=? and width=?",oldpanelTypeName,length,width);
                    HandleMatchQueryList(queryList,projectId,productName,designlistId);
                    break;
                case "SP":
                    if((productName.equals("400 SP 1100"))||(productName.equals("1100 SP 400"))){
                        oldpanelTypeName = panelTypeName;
                        length = 1100;
                        width = 400;
                        queryList = queryService.query("select * from oldpanel WHERE oldpanelType in " +
                                "(select oldpanelType from oldpaneltype where oldpanelTypeName=? ) " +
                                "and length=? and width=?",oldpanelTypeName,length,width);
                        HandleMatchQueryList(queryList,projectId,productName,designlistId);
                        break;
                    }else {}
                case "B":
                case "BSB":
                    oldpanelTypeName = "U";
                    length = Double.parseDouble(SetLengthAndWidth(IgnoreSlashx(splited[0],splited[2]))[0]);
                    width = Double.parseDouble(SetLengthAndWidth(IgnoreSlashx(splited[0],splited[2]))[1]);
                    if(length>400&&width>400) {


                    }else if(length>800){

                    }else {

                    }
                default:
                    break;

            }
        }

    }


    private boolean HandleMatchQueryList(DataList queryList,String projectId,String productName,String designlistId){
        System.out.println("HandleMatchQueryList===designlistId="+designlistId);
        String sql = "update designlist set status = ? where id = ?";
        String sql2 = "update oldpanel set countUse = ? where id = ?";
        String sql3 = "insert into oldpanellist (projectId,productName,oldpanelId,designlistId) values (?,?,?,?)";
        String status = "1";//更改扣板后designlist中status
        if(queryList.size()!=0){//有匹配到的旧板
            for (int i = 0; i < queryList.size(); i++) {//遍历
                double countUse = Double.parseDouble(queryList.get(i).get("countUse").toString());
                if (countUse > 1){//可用数量大于1，扣旧板可用数量1，改变designlist中status为1，插oldpanellist表
                    countUse--;
                    jo.update(sql,status,designlistId);
                    int oldpanelId = Integer.parseInt(queryList.get(i).get("id").toString());
                    jo.update(sql2,countUse,oldpanelId);
                    jo.update(sql3,projectId,productName,oldpanelId,designlistId);
                    return true;
                }
            }
        }
        return false;
    }

    private String[] SetLengthAndWidth(String m, String n){
        int a = Integer.parseInt(m);
        int b = Integer.parseInt(n);
        int max = Math.max(a,b);
        int min = Math.min(a,b);
        return new String[]{String.valueOf(max),String.valueOf(min)};
    }

    private String[] SetLengthAndWidth(String[] strab){
        int a = Integer.parseInt(strab[0]);
        int b = Integer.parseInt(strab[1]);
        int max = Math.max(a,b);
        int min = Math.min(a,b);
        return new String[]{String.valueOf(max),String.valueOf(min)};
    }

    private String[] IgnoreSlashx(String a, String b){
        String stra = a;
        String strb = b;
        String[] splita = a.split("/");
        stra = splita[0];
        String[] splitb = b.split("/");
        strb = splitb[0];
        return new String[]{stra,strb};
    }

    private String IgnoreSuffix(String a){
        return a.split("-")[0];
    }

    @Transactional
    boolean ResOldpanelName(String oldpanelName){
        String[] splited = oldpanelName.split("\\s+");
        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
        String isPureWord = "^[A-Za-z]+$";
        String typeName = "";
        String m = "";
        String n = "";
        String a = "";
        String b = "";
        String angle = "";
        String mAngle = "";
        String nAngle = "";
        String mnAngle = "";
        String res = "";//类型0，m1，n2，a*b3，b*a4，m+n5，后缀6
        String er = "";
        try {
            if (splited[0].matches(isPureWord)) {
                typeName = splited[0];
                switch (typeName) {
                    case "EC":
                    case "EB":
                    case "MB":
                        m = splited[1];
                        if(!m.matches(isPureNumber)){
                            er = "m不是纯数字";
                            break;
                        }
                        res = "01";
                        break;
                    case "SS":
                        res = "0";
                        break;
                    default:
                        break;
                }
            } else if(splited[1].matches(isPureWord)){
                typeName = splited[1];
                switch (typeName) {
                    case "WP":
                    case "W":
                    case "U":
                    case "SPT":
                    case "BS":
                    case "WS":
                    case "K":
                    case "BP":
                    case "BPP":
                    case "BPPP":
                        m = SetLengthAndWidth(splited[0],splited[2])[0];
                        n = SetLengthAndWidth(splited[0],splited[2])[1];
                        if((!m.matches(isPureNumber))||(!n.matches(isPureNumber))){
                            er = "m或n不是纯数字";
                            break;
                        }
                        if(n.equals(splited[0])){//n在前
                            res = "102";
                        } else {//m在前
                            res = "201";
                        }
                        break;
                    case "LSR":
                    case "LSA":
                    case "IC":
                    case "ICA"://a<=b
                        b = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[0];
                        a = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[1];
                        m = splited[2];
                        if((!a.matches(isPureNumber))||(!b.matches(isPureNumber))||(!m.matches(isPureNumber))){
                            er = "a或b或m不是纯数字";
                            break;
                        }
                        if(a.equals(splited[0].split("\\*")[0])){//a*b
                            res = "301";
                        } else {//b*a
                            res = "401";
                        }
                        break;
                    case "SN":
                        b = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[0];
                        a = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[1];
                        m = splited[2];
                        if((!a.matches(isPureNumber))||(!b.matches(isPureNumber))||(!m.matches(isPureNumber))){
                            er = "a或b或m不是纯数字";
                            break;
                        }
                        try {
                            angle = splited[3];
                            if(!angle.equals("AA")){
                                er = "SN板后不是AA角";
                                break;
                            } else {
                                if(a.equals(splited[0].split("\\*")[0])){//a*b
                                    res = "3016";
                                } else {//b*a
                                    res = "4016";
                                }
                            }
                        } catch (Exception e){
                            if(a.equals(splited[0].split("\\*")[0])){//a*b
                                res = "301";
                            } else {//b*a
                                res = "401";
                            }
                        }
                        break;
                    case "CC":
                    case "CE":
                        b = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[0];
                        a = SetLengthAndWidth(splited[0].split("\\*")[0],splited[0].split("\\*")[1])[1];
                        m = splited[2].split("\\+")[0];
                        n = splited[2].split("\\+")[1];
                        if((!a.matches(isPureNumber))||(!b.matches(isPureNumber))){
                            er = "a或b不是纯数字";
                            break;
                        }
                        if(m.contains("A")){

                        } else if(m.contains("B")){

                        } else if(m.matches(isPureNumber)){

                        } else {
                            er = "m值异常";
                        }
                        if(n.contains("A")){

                        } else if(n.contains("B")){

                        } else if(n.matches(isPureNumber)){

                        } else {
                            er = "n值异常";
                        }
                        break;
                    default:
                        er = "无法识别的品名";
                        break;
                }
            } else if(splited[0]=="200"){

            } else {
                er = "品名错误";
            }
        } catch (Exception e){
            return false;
        }

        return true;
    }
//    @Test
//    private void test(){
        //=======================
//        double a =17.23;
//        double b =12.888;
//        double c = Math.max(a,b);
//        double d = Math.min(a,b);
//        String[] cd = {String.valueOf(c),String.valueOf(d)};
//        System.out.println(cd);
//        double f =Double.parseDouble(cd[0]);
//        double g =Double.parseDouble(cd[1]);
//        System.out.println(f);
//        System.out.println(g);
        //==========================
//        String str = "SS";
//        String[] splited = str.split("\\s+");
//        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
//        String isPureWord = "^[A-Za-z]+$";
//        int a;
//        System.out.println(splited.length);
//        for(String res : splited){
//            if (res.matches(isPureWord)){
//                a = 1;
//            }else{
//                a = 0;
//            }
//            System.out.println(res+"==="+a);
//        }
        //============================
//        String str2 = "123";
//        String[] splited = str2.split("/");
//        System.out.println(splited.length);
//        System.out.println(splited[0]);
//        System.out.println(splited[1]);
        //==========================
//        DataList dataList = new DataList();
//        System.out.println(!dataList.isEmpty());
        //========================
//        Double dou = 1.00001;
//        dou--;
//        System.out.println(dou);
//        for (int i = 0; i < 5; i++) {
//            if(i==2){
//                System.out.println(i);
//                break;
//            }
//            System.out.println(i);
//        }
//        //========================
//        int k = 1;
//        switch (k){
//            case 0:
//                System.out.println(0);
//                break;
//            case 1:
//                System.out.println(1);
//                if(false){
//                    break;
//                }else {}
//            case 2:
//                System.out.println(2);
//            case 3:
//                System.out.println(3);
//                System.out.println(k);
//                break;
//            default:
//                System.out.println(7);
//                break;
//        }
        //=====================
//        for (int i = 0; i < 5; i++) {
//            DataRow dataRow = new DataRow();
//            dataRow.put("1","AA"+i);
//            dataList.add(dataRow);
//        }
//        for (DataRow dataRow : dataList){
//            ArrayList<String> panelList = new ArrayList(dataRow.values());
//            ArrayList<String> panelList1 = new ArrayList(dataRow.keySet());
//            String attt = panelList.get(0);
//            System.out.println(panelList+"==="+panelList1);
//            System.out.println(attt);
//        }
//    }


}

