package yrd.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import commonMethod.NewCondition;
import commonMethod.QueryAllService;
import config.DataSourceConfig;
import domain.DataList;
import domain.DataRow;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.QueryService;
import util.Excel;
import vo.UploadDataResult;
import vo.WebResponse;

import javax.sql.DataSource;

@Service
public class OldpanelMatchService extends BaseService{
    private Logger log = Logger.getLogger(OldpanelMatchService.class);
    private HSSFWorkbook wb;
    @Autowired
    private QueryAllService queryService;

    /**
     * 上传旧板匹配数据
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    @Transactional
    public UploadDataResult oldpanelUploadMatchData(InputStream inputStream, int projectId, int buildingId) throws IOException {
        System.out.println("===oldpanelUploadMatchData");
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);
        DataList dataList;
        dataList = excel.readExcelContent(0);
        boolean upload = HandleDesignList(dataList, projectId, buildingId);
        result.dataList = dataList;
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

    private void oldpanelMatch(int projectId,int buildingId, String productName){//匹配，并插表
        String oldpanelName;
        String str = "50B BS 700";
        String[] splited = productName.split("\\s+");
        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
        String isPureWord = "^[A-Za-z]+$";
        int l = splited.length;
        DataList queryList = new DataList();
        String sql = "update designlist set status = ? where projectId = ? and buildingId = ?";
        String sql2 = "update oldpanel set countUse = ? where id = ?";
        String sql3 = "insert into oldpanellist (projectId,productName,oldpanelId,designlistId) values (?,?,?,?)";
        DataList queryList2 = new DataList();
        queryList2 = queryService.query("select * from designlist where projectId = ? and buildingId = ?",projectId,buildingId);
        int designlistId = Integer.parseInt(queryList2.get(0).get("id").toString());
        int status = 1;//更改扣板后designlist中status
        if (splited[0].matches(isPureWord)){
            String oldpanelTypeName = splited[0];
            String m;
            switch (oldpanelTypeName){
                case "ECD":
                    oldpanelTypeName = "EC";
                case "EC":
                case "EB":
                case "MB":
                    m = splited[1];
                    oldpanelName = oldpanelTypeName+" "+m;
                    queryList = queryService.query("SELECT * FROM oldpanel WHERE oldpanelType IN " +
                            "(SELECT oldpanelType FROM oldpaneltype WHERE oldpanelTypeName =? ) and width =?",oldpanelTypeName,m);
                    if(queryList.size()!=0){//有匹配到的旧板
                        for (int i = 0; i < queryList.size(); i++) {//遍历
                            double countUse = Double.parseDouble(queryList.get(i).get("countUse").toString());
                            if (countUse > 1){//可用数量大于1，扣旧板可用数量1，改变designlist中status为1，插oldpanellist表
                                countUse--;
                                jo.update(sql,status,projectId,buildingId);
                                int oldpanelId = Integer.parseInt(queryList.get(i).get("id").toString());
                                jo.update(sql2,countUse,oldpanelId);
                                jo.update(sql3,projectId,productName,oldpanelId,designlistId);
                                break;
                            }
                        }
                    }
                    break;
                case "SS":
                    oldpanelName = oldpanelTypeName;
                    break;
                default:
                    break;
            }
        }else if(splited[1].matches(isPureWord)){
            switch (splited[1]){
                case "":
            }
        }

    }
    @Test
    public void test(){
        String str = "SS";
        String[] splited = str.split("\\s+");
        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
        String isPureWord = "^[A-Za-z]+$";
        int a;
        System.out.println(splited.length);
        for(String res : splited){
            if (res.matches(isPureWord)){
                a = 1;
            }else{
                a = 0;
            }
            System.out.println(res+"==="+a);
        }
        DataList dataList = new DataList();
        System.out.println(!dataList.isEmpty());
        Double dou = 1.00001;
        dou--;
        System.out.println(dou);
        for (int i = 0; i < 5; i++) {
            if(i==2){
                System.out.println(i);
                break;
            }
            System.out.println(i);
        }
        System.out.println("=====");
        int k = 1;
        switch (k){
            case 0:
                System.out.println(0);
                break;
            case 1:
                System.out.println(1);
            case 2:
                System.out.println(2);
            case 3:
                System.out.println(3);
                System.out.println(k);
                break;
            default:
                System.out.println(7);
                break;
        }
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
    }

    @Transactional
    private boolean HandleDesignList(DataList dataList, int projectId, int buildingId) {
        int status = 0;
        for (DataRow dataRow : dataList) {//对于每一条板材数据
            ArrayList<String> productList = new ArrayList(dataRow.values());
            String productName = productList.get(0);
//            DataList list = queryService.query("select id from building where projectId =? and buildingName=?", projectId, buildingName);
//            String buildingId = String.valueOf(list.get(0).get("id"));
            String sql = "insert into designlist (projectId,buildingId,productName,status) values (?,?,?,?)";
//            int j = jo.update(sql, projectId, buildingId, productName, status);//插入designlist表
//            if (j == 0) {
//                return false;
//            }
            DataSourceConfig config = new DataSourceConfig();
            try {
                Connection connection= DataSourceUtils.getConnection(config.dataSource());
                connection.setAutoCommit(false);
                PreparedStatement pre= connection.prepareStatement(sql);
                pre.setObject(1,projectId);
                pre.setObject(2,buildingId);
                pre.setObject(3,productName);
                pre.setObject(4,status);
                int len= pre.executeUpdate();
                if(len==0){
                    connection.rollback();
                }
                else connection.commit();
            } catch (Exception e) {

            }
            oldpanelMatch(projectId, buildingId, productName);
        }
        return true;

    }

}
