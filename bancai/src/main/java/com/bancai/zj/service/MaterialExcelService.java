package com.bancai.zj.service;

import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bancai.service.BaseService;
import com.bancai.service.QueryService;
import com.bancai.service.TableService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;

@Service
public class MaterialExcelService extends BaseService {
	private Logger log = Logger.getLogger(MaterialExcelService.class);
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;

	private void saveData(DataList dataList,String userid,String tableName) {
		for (int i = 0; i < dataList.size(); i += 1) {
			//String sql = dataList.toInsertSQL(i, i + 1000, tableName, uploadId);//sql语句
			//String sql = dataList.toInsertSQL(i, i + 1000);//sql语句  insert into oldpanelstore (%s) values %s
			//DataRow proNum=
			//dr=dataList.get(i);
			String materialName=(String) dataList.get(i).get("材料名");
			String proNum =(String)dataList.get(i).get("品号");
			String length = (String) dataList.get(i).get("长");
			String type = (String) dataList.get(i).get("类型");
			String width = (String) dataList.get(i).get("宽");
			String scale = (String) dataList.get(i).get("规格");
			String respo = (String) dataList.get(i).get("库存单位");
			String respoNum = (String) dataList.get(i).get("仓库编号");
			String count = (String)dataList.get(i).get("数量");
			String cost = (String)dataList.get(i).get("数量"); //(float)jsonTemp.get("数量");
			String location = (String) dataList.get(i).get("存放位置");

			String sql = "insert into "+ tableName+" (materialName,品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,uploadID) values(?,?,?,?,?,?,?,?,?,?,?,?)";
			jo.update(sql, materialName,proNum,length,type,width,scale,respo,respoNum,count,cost,location,userid);
		}
	}


	/**
	 * 上传数据
	 * 
	 * @param inputStream
	 * @param userid
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadExcelData(InputStream inputStream,String userid, String tablename) throws IOException {
		DataList dataList;
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		dataList = excel.readExcelContent();

		// 插入数据
		//log.debug("materialtype= "+materialtype);
		boolean upload = uploadData(dataList,userid,tablename);
		result.dataList = dataList;
		result.success = upload;
		return result;

	}

	@Transactional
	boolean uploadData(DataList dataList,String userid,String tablename) {
		//int uploadId = insertUploadRecord(uploads, tableName, batchNo, startTime, endTime);
		saveData(dataList,userid,tablename);
		//updateEnterpriseInfo(tableName);
		return true;
	}

}
