package yrd.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import util.Excel;
import vo.UploadDataResult;

@Service
public class Y_Upload_Data_Service extends BaseService {
    private Logger log = Logger.getLogger(Y_Upload_Data_Service.class);
    private HSSFWorkbook wb;
    /**
     * 添加数据
     */
    @Transactional
    public void oldpanel_Add_Data(String tableName,String oldpanelName,String length,String type,String width,
                                int number,String respo,String respoNum,String location,double weight,int userid){
        log.debug("yrd.service.Y_Upload_Data_Service.oldpanel_Add_Data");

        jo.update("insert into "+tableName+"(oldpanelName,长,类型,宽,可用数量,库存数量,库存单位,仓库编号,存放位置,重量,uploadId) values(?,?,?,?,?,?,?,?,?,?,?)",
                oldpanelName,length,type,width,number,number,respo,respoNum,location,weight,userid);
        //return true;
    }

    /**
     * 上传数据
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    @Transactional
    public UploadDataResult oldpanel_Upload_Data(InputStream inputStream, String tableName, int userid) throws IOException {
        DataList dataList;
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);

        dataList = excel.readExcelContent();

        boolean upload = oldpanel_Upload(dataList,tableName,userid);
        result.dataList = dataList;
        result.success = upload;
        return result;
    }

    @Transactional
    boolean oldpanel_Upload(DataList dataList, String tableName, int userid) {
        oldpanel_Save_Data(dataList,tableName,userid);
        //updateEnterpriseInfo(tableName);
        return true;
    }
    /**
     * 上传旧板匹配数据
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    @Transactional
    public UploadDataResult oldpanelUploadMatchData(InputStream inputStream) throws IOException {
        UploadDataResult result = new UploadDataResult();
        wb = new HSSFWorkbook(inputStream);
        int sheetNum = wb.getNumberOfSheets();
        for (int n = 0; n < sheetNum; n++) {
            HSSFSheet sheet = wb.getSheetAt(n);
            HSSFRow row = sheet.getRow(1);
            HSSFCell cell1 = row.getCell(0);
            String buildingNum = cell1.getStringCellValue();//该表格对应的楼栋名称
            int rowNum = sheet.getLastRowNum();
            int rowResultNum = 1;
            // 正文内容应该从第二行开始,第一行为表头的标题
            for (int i = 1; i <= rowNum; i++) {
                row = sheet.getRow(i);
                cell1 = row.getCell(0);
                HSSFRow rowResult = sheet.getRow(rowResultNum);
                HSSFCell cell2 = rowResult.getCell(1);
                String panelName = cell1.getStringCellValue();
                oldpanelMatchName(cell2, panelName);
                rowResultNum ++;
            }

        }
        result.success = true;
        return result;
    }

    private void oldpanelMatchName(HSSFCell cell, String panelName){
        String str = "500 BS 700";
        String[] splited = str.split("\\s+");
        String reg = "^[0-9]+(.[0-9]+)?$";
        int a;
        for(String res : splited){
            if (res.matches(reg)){
                a = 1;
            }else{
                a = 0;
            }
            System.out.println(res+"==="+a);
        }
    }

    private void oldpanel_Save_Data(DataList dataList, String tableName, int userid) {
        for (int i = 0; i < dataList.size(); i += 1) {
            String oldpanelName =(String)dataList.get(i).get("旧板名称");
            String length = (String) dataList.get(i).get("长");
            String type = (String) dataList.get(i).get("类型");
            String width = (String) dataList.get(i).get("宽");
            String number = (String) dataList.get(i).get("数量");
            String respo = (String) dataList.get(i).get("库存单位");
            String respoNum = (String) dataList.get(i).get("仓库编号");
            String location = (String) dataList.get(i).get("存放位置");
            String weight = (String) dataList.get(i).get("重量");
            String sql = "insert into "+tableName+"(oldpanelName,长,类型,宽,可用数量,库存数量,库存单位,仓库编号,存放位置,重量,uploadId) values(?,?,?,?,?,?,?,?,?,?,?)";
            jo.update(sql,oldpanelName,length,type,width,number,number,respo,respoNum,location,weight,userid);
        }
    }

}

