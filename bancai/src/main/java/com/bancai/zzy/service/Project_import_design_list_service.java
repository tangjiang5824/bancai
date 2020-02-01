package com.bancai.zzy.service;

import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.service.QueryService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;

import java.io.IOException;
import java.io.InputStream;

@Service
public class Project_import_design_list_service extends BaseService{

    @Autowired
    private QueryService queryService;
    /*
     * 查询所有的building
     * */

    @Transactional
    public DataList findBuildingList(String projectName){
        String sql = "select * from building_project_view where projectName = '"+projectName+"'";
        DataList namelist = queryService.query(sql);
        return namelist;
    }
    @Transactional
    public DataList findBuildingId(String buildingName){
        String sql = "select id from building where buildingName = '"+buildingName+"'";
        DataList idlist = queryService.query(sql);
        return idlist;
    }
    /**
     * 上传数据
     *
     * @param inputStream
     * @param materialtype
     * @return
     * @throws IOException
     */
    @Transactional
    public UploadDataResult upload_Data(InputStream inputStream, String materialtype, String userid, String tablename) throws IOException {
        DataList dataList;
        UploadDataResult result = new UploadDataResult();
        Excel excel = new Excel(inputStream);

        dataList = excel.readExcelContent();

        // 插入数据
        //log.debug("materialtype= "+materialtype);
        boolean upload = uploadData(dataList,materialtype,userid,tablename);
        result.dataList = dataList;
        result.success = upload;
        return result;
    }
    @Transactional
    boolean uploadData(DataList dataList,String materialtype,String userid,String tablename) {
        //int uploadId = insertUploadRecord(uploads, tableName, batchNo, startTime, endTime);
        saveData( dataList,materialtype,userid,tablename);
        //updateEnterpriseInfo(tableName);
        return true;
    }
    private void saveData(DataList dataList,String materialtype,String userid,String tablename) {
        for (int i = 0; i < dataList.size(); i += 1) {
            //String sql = dataList.toInsertSQL(i, i + 1000, tableName, uploadId);//sql语句
            //String sql = dataList.toInsertSQL(i, i + 1000);//sql语句  insert into oldpanelstore (%s) values %s
            //DataRow proNum=
            //dr=dataList.get(i);
            String proNum =(String)dataList.get(i).get("品号");
            String length = (String) dataList.get(i).get("长");
            String type = (String) dataList.get(i).get("类型");
            String width = (String) dataList.get(i).get("宽");
            String scale=(String) dataList.get(i).get("规格");
            String respo=(String) dataList.get(i).get("库存单位");
            String respoNum=(String) dataList.get(i).get("仓库编号");
            String count=(String)dataList.get(i).get("数量");
            String cost= (String)dataList.get(i).get("数量"); //(float)jsonTemp.get("数量");
            String location=(String) dataList.get(i).get("存放位置");
            String sql = "insert into "+tablename+"(品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,materialtype,uploadId) values(?,?,?,?,?,?,?,?,?,?,?,?)";
            jo.update(sql, proNum,length,type,width,scale,respo,respoNum,count,cost,location,materialtype,userid);
        }
    }
}
