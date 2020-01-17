package yrd.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import commonMethod.NewCondition;
import commonMethod.QueryAllService;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.QueryService;
import util.Excel;
import vo.UploadDataResult;
import vo.WebResponse;

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
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);
        DataList dataList;
        dataList = excel.readExcelContent(1);
        HandleDesignList(dataList, projectId, buildingId);
//        boolean upload = oldpanelUpload(dataList,tableName,userid);
//        result.dataList = dataList;
//        result.success = upload;
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

    private DataList oldpanelMatchNameList(String productName){
        DataList oldpanelMatchList = new DataList();
        String oldpanelName;
        String str = "50B BS 700";
        String[] splited = productName.split("\\s+");
        String isPureNumber = "^[0-9]+(.[0-9]+)?$";
        String isPureWord = "^[A-Za-z]+$";
        int l = splited.length;
        if (splited[0].matches(isPureWord)){
            switch (splited[0]){
                case "EC":
                case "ECD":
                    oldpanelName = "EC "+splited[1];
                    break;
                case "EB":
                    oldpanelName = "EB "+splited[1];
                    break;
                case "MB":
                    oldpanelName = "MB "+splited[1];
                    break;
                case "SS":
                    oldpanelName = "SS";
                    break;
                default:
                    break;
            }
        }else if(splited[1].matches(isPureWord)){
            switch (splited[1]){
                case "":
            }
        }

        int a;
        for(String res : splited){
            if (res.matches(isPureNumber)){
                a = 1;
            }else{
                a = 0;
            }
            System.out.println(res+"==="+a);
        }
        return oldpanelMatchList;
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
        System.out.println(dataList.isEmpty());
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

    private void HandleDesignList(DataList dataList, int projectId, int buildingId){
        int status = 0;
        for (DataRow dataRow : dataList){//对于每一条板材数据
            ArrayList<String> productList = new ArrayList(dataRow.values());
            String productName = productList.get(0);
//            DataList list = queryService.query("select id from building where projectId =? and buildingName=?", projectId, buildingName);
//            String buildingId = String.valueOf(list.get(0).get("id"));
            String sql = "insert into designlist (projectId,buildingId,productName,status) values (?,?,?,?)";
            jo.update(sql,projectId,buildingId,productName,status);//插入designlist表
//            DataList list2 = oldpanelMatchNameList(productName);
//            if(list2.isEmpty()){
//                //没有匹配到
//            }else {
//                //匹配到
//            }
        }

    }



}
