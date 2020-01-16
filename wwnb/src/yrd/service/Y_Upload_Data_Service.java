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
public class Y_Upload_Data_Service extends BaseService {
    private Logger log = Logger.getLogger(Y_Upload_Data_Service.class);
    private HSSFWorkbook wb;
    @Autowired
    private QueryAllService queryService;
    /**
     * 添加数据
     */
    @Transactional
    public void oldpanelAddData(String tableName,int oldpanelNo,String oldpanelName,double length,double length2,String oldpanelType,double width,
                                double width2,double width3,String inventoryUnit,String warehouseNo,String position,double number,double weight,int uploadId){
        log.debug("yrd.service.Y_Upload_Data_Service.oldpanelAddData");

        jo.update("insert into "+tableName+"(oldpanelNo,oldpanelName,length,length2,oldpanelType,width," +
                        "width2,width3,inventoryUnit,warehouseNo,position,countUse,countStore,weight,uploadId) " +
                        "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                oldpanelNo,oldpanelName,length,length2,oldpanelType,width,
                width2,width3,inventoryUnit,warehouseNo,position,number,number,weight,uploadId);
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
    public UploadDataResult oldpanelUploadData(InputStream inputStream, String tableName, int userid) throws IOException {
        DataList dataList;
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);

        dataList = excel.readExcelContent();

        boolean upload = oldpanelUpload(dataList,tableName,userid);
        result.dataList = dataList;
        result.success = upload;
        return result;
    }

    @Transactional
    boolean oldpanelUpload(DataList dataList, String tableName, int userid) {
        oldpanelSaveData(dataList,tableName,userid);
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

    private void oldpanelSaveData(DataList dataList, String tableName, int userid) {
        for (DataRow dataRow : dataList) {
            String oldpanelNo = (String) dataRow.get("oldpanelNo");
            String oldpanelName = (String) dataRow.get("oldpanelName");
            String length = (String) dataRow.get("length");
            String length2 = (String) dataRow.get("length2");
            String oldpanelTypeName = (String) dataRow.get("oldpanelType");
            String width = (String) dataRow.get("width");
            String width2 = (String) dataRow.get("width2");
            String width3 = (String) dataRow.get("width3");
            String inventoryUnit = (String) dataRow.get("inventoryUnit");
            String warehouseNo = (String) dataRow.get("warehouseNo");
            String position = (String) dataRow.get("position");
            String number = (String) dataRow.get("number");
            String weight = (String) dataRow.get("weight");

            DataList list = queryService.query("select oldpanelType from oldpanelType where oldpanelTypeName=?", oldpanelTypeName);
            int oldpanelType = Integer.parseInt(String.valueOf(list.get(0).get("oldpanelType")));

            String sql = "insert into " + tableName + "(oldpanelNo,oldpanelName,length,length2,oldpanelType,width," +
                    "width2,width3,inventoryUnit,warehouseNo,position,countUse,countStore,weight,uploadId) " +
                    "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            jo.update(sql, oldpanelNo, oldpanelName, length, length2, oldpanelType, width,
                    width2, width3, inventoryUnit, warehouseNo, position, number, number, weight, userid);
        }
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

