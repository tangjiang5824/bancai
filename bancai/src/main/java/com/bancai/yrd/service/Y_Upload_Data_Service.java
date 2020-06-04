package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;

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
    /**
     * 添加数据
     */
    @Transactional
    public void oldpanelAddData(String tableName,int oldpanelNo,String oldpanelName,double length,double length2,int oldpanelType,double width,
                                double width2,double width3,String inventoryUnit,String warehouseNo,int rowNo,int columNo,double number,double weight,int uploadId){
        log.debug("com.bancai.yrd.com.bancai.service.Y_Upload_Data_Service.oldpanelAddData");

        jo.update("insert into "+tableName+"(oldpanelNo,oldpanelName,length,length2,oldpanelType,width," +
                        "width2,width3,inventoryUnit,warehouseNo,rowNo,columNo,countUse,countStore,weight,uploadId) " +
                        "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                oldpanelNo,oldpanelName,length,length2,oldpanelType,width,
                width2,width3,inventoryUnit,warehouseNo,rowNo,columNo,number,number,weight,uploadId);
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

        dataList = excel.readExcelContent(1);

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

