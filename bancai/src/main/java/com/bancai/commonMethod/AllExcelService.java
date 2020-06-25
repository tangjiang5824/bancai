package com.bancai.commonMethod;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.domain.DataList;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class AllExcelService extends BaseService {
	private Logger log = Logger.getLogger(AllExcelService.class);
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;
	@Autowired
	private InsertProjectService insertProjectService;

	private void saveData(DataList dataList,String userid,String tableName) {
		int userId = Integer.parseInt(userid);
		for (int i = 0; i < dataList.size(); i += 1000) {
			log.debug("保存第" + i + "条数据");

			//注意：toInsertSQL方法解析得到的Colum与数据库中的表的字段是对应的。
			String sql = dataList.toInsertSQL(i, i + 1000, tableName, userId);
			//String sql = dataList.toInsertSQL(i, i + 1000, tableName);
			jo.update(sql);
		}
	}


	/**
	 * 原材料上传数据，旧板上传数据
	 * 
	 * @param inputStream
	 * @param userid
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadExcelData(InputStream inputStream,String userid, String tablename,String main_key) throws IOException {
		DataList dataList;
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		dataList = excel.readExcelContent();
		//通过jackson实现深拷贝：序列化
		ObjectMapper mapper=new ObjectMapper();
		DataList dataList2 = mapper.readValue(mapper.writeValueAsString(dataList),DataList.class);
		DataList id_List;
		DataList typeList;
//		System.out.println(dataList);
		if (tablename.equals("material_store")) {
			for (int i = 0; i < dataList.size(); i++) {
				String materialName = dataList.get(i).get("materialName") + "";
				String sql_find_id = "select id from material_info where materialName =?";
				id_List = queryService.query(sql_find_id,materialName);
				String width="";
				String materialId="";
				//查出的materialId大于一个
				if(id_List.size()>1){
					result.setErrorCode(2);
					return result;
				}
				//通过原材料名没有查到数据，需要宽这个字段插入material_info表
				if(id_List.isEmpty()) {
					//宽有值，不需要进行解析
					if(null!=dataList.get(i).get("width")){
						width=dataList.get(i).get("width")+"";
					}else {
						//需要进行解析
						//解析规则待完善
						//解析成功给width赋值，
						// 需要修改datalist2里面的width，
						// 并返回新的materialId
						// 失败返回错误项
					}
				} else {
					materialId=id_List.get(0).get("id")+"";
				}
				//修改插入到数据库里面的datalist
				dataList2.get(i).remove("materialName");
				dataList2.get(i).remove("width");
				dataList2.get(i).remove("rowindex");
				dataList2.get(i).put("materialId",materialId);

				//后面为log记录
				String specification = dataList.get(i).get("specification")+"";
				String count =dataList.get(i).get("count")+"";
				String sql_log_detail = "insert into material_logdetail (materialName,count,specification,materiallogId) values (?,?,?,?)";
				boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_log_detail,materialName,count,specification,String.valueOf(main_key));
			}
		} else if (tablename.equals("oldpanel")) {
			for (int i = 0; i < dataList.size(); i++) {
				String oldpanelTypeName = dataList.get(i).get("oldpanelType") + "";
				String sql_trans = "select oldpanelType from oldpaneltype where oldpanelTypeName = ?";
				typeList = queryService.query(sql_trans,oldpanelTypeName.toUpperCase());
				if(typeList.isEmpty())
				{
					result.setErrorCode(2);
					return result;
				} else {
					String oldpanelType = typeList.get(0).get("oldpanelType") + "";
					dataList2.get(i).put("oldpanelType",oldpanelType);
					String countStore = dataList.get(i).get("countStore") + "";
					dataList2.get(i).put("countUse",countStore);
//					System.out.println(dataList2);
					String oldpanelName = dataList.get(i).get("oldpanelName") + "";
					String specification = dataList.get(i).get("specification")+"";
					String sql_log_detail = "insert into oldpanellogdetail (oldpanelName,count,specification,oldpanellogId) values (?,?,?,?)";
					boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_log_detail,oldpanelName,countStore,specification,String.valueOf(main_key));
				}
			}
		}
		// 插入数据
		//log.debug("materialtype= "+materialtype);
		boolean upload = uploadData(dataList2,userid,tablename);
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
