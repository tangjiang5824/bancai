package com.bancai.commonMethod;

import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.MaterialLog;
import com.bancai.cg.entity.MaterialLogdetail;
import com.bancai.cg.entity.MaterialStore;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.yrd.service.OldpanelDataService;
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
import java.text.DecimalFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Service
public class AllExcelService extends BaseService {
	private Logger log = Logger.getLogger(AllExcelService.class);
	private static String isPureNumber = "[0-9]+";
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;
	@Autowired
	private InsertProjectService insertProjectService;
	@Autowired
	private OldpanelDataService oldpanel_Data_Service;

	//JPA dao
	@Autowired
	private com.bancai.cg.dao.materialinfodao materialinfodao;
	@Autowired
	private com.bancai.cg.dao.materialstoredao materialstoredao;
	@Autowired
	private com.bancai.cg.dao.materialLogdao materialLogdao;
	@Autowired
	private com.bancai.cg.dao.mateialLogdetaildao mateialLogdetaildao;

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
	 * 原材料上传数据
	 * 
	 * @param inputStream
	 * @param userid
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadExcelData(InputStream inputStream, String userid, String tablename, MaterialLog log) throws IOException {
		DataList dataList;
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		dataList = excel.readExcelContent();
//		//通过jackson实现深拷贝：序列化
//		ObjectMapper mapper=new ObjectMapper();
//		DataList dataList2 = mapper.readValue(mapper.writeValueAsString(dataList),DataList.class);
//		DataList id_List;
//		DataList typeList;

		//新增JPA时改动
		MaterialInfo material=null;
//		System.out.println(dataList);
			for (int i = 0; i < dataList.size(); i++) {
				String materialName = dataList.get(i).get("materialName") + "";
	//			String specification = dataList.get(i).get("specification") + "";
				MaterialStore store=new MaterialStore();
				List<MaterialInfo> materialList=materialinfodao.findByMaterialName(materialName);
				if(materialList.size()!=1) {
					result.setSuccess(false);
					result.setErrorCode(2);
					return result;
				}
				String warehouseName=null;
				if(null!=dataList.get(i).get("warehouseName")){
					warehouseName=dataList.get(i).get("warehouseName")+"";
					store.setWarehouseName(warehouseName);

				}
				material=materialList.get(0);
				store.setMaterialInfo(material);
				Double count=null;
				if(null!=dataList.get(i).get("count")){
					count=Double.parseDouble(dataList.get(i).get("count")+"");
					store.setCountStore(count);
					store.setCountUse(count);
				}

				Double totalWeight=null;
				if(null!=dataList.get(i).get("totalWeight")){
					totalWeight=Double.parseDouble(dataList.get(i).get("totalWeight")+"");
					store.setTotalWeight(totalWeight);
					if(count!=null){
						dataList.get(i).put("unitWeight",new DecimalFormat("0.00").format(totalWeight/count));
					}
				}
				String description=null;
				if(null!=dataList.get(i).get("description")){
					description=dataList.get(i).get("description")+"";
					store.setDescription(description);
				}
				boolean flag=true;
				//通过warehouseName和materialId看仓库里面是否存在
				MaterialLogdetail logdetail=new MaterialLogdetail();
				Set<MaterialStore> stores=material.getMaterialStores();
				for(MaterialStore store1:stores){
					if(store1.getWarehouseName().equals(warehouseName)){
						store1.setCountStore(store1.getCountStore()+count);
						store1.setCountUse(store1.getCountUse()+count);
						store1.setTotalWeight(store1.getTotalWeight()+totalWeight);
						materialstoredao.save(store1);
						logdetail.setMaterialStore(store1);
						flag=false;
						break;
					}
				}

				if(flag) materialstoredao.save(store);

				logdetail.setIsrollback(0);
				logdetail.setMaterialLog(log);
				logdetail.setMaterialInfo(material);
				logdetail.setCount(store.getCountStore());
				if (flag) logdetail.setMaterialStore(store);
				mateialLogdetaildao.save(logdetail);

			}
		result.dataList = dataList;
		result.success = true;
		return result;

	}
	/**
	 * 原材料上传数据(先上传解析返回后点确定后入库)
	 *
	 * @param inputStream
	 * @param
	 * @return
	 * @throws IOException
	 */
	@Transactional(rollbackFor = Exception.class)
	public UploadDataResult uploadExcelData(InputStream inputStream) throws IOException {
		DataList dataList;
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		dataList = excel.readExcelContent();
		DataList errorlist=new DataList();
		//新增JPA时改动
//		System.out.println(dataList);
		for (int i = 0; i < dataList.size(); i++) {
			int index=-1;
			String materialName = dataList.get(i).get("原材料名") + "";
			List<MaterialInfo> materialList=materialinfodao.findByMaterialName(materialName);
			if(materialList.size()!=1) {
				errorlist.add(dataList.get(i));
				index=errorlist.size()-1;
				if(materialList.size()>1){
					errorlist.get(index).put("错误原因","存在多个相同原材料名； ");
				}else {
					//materialList.size()<1
					if(materialName.equals("null")){
						errorlist.get(index).put("错误原因","原材料名为空； ");
					}else
					errorlist.get(index).put("错误原因","系统中不存在该原材料，请在原材料基础信息中进行添加； ");
				}
			}
			String warehouseName=dataList.get(i).get("仓库名称")+"";
			String sql="select * from storeposition where ";


		}
		result.dataList = dataList;
		result.success = true;
		return result;

	}
	/**
	 * 旧板上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadOldpanelExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String oldpanelName = (dataRow.get("品名") + "").trim().toUpperCase();
			if(oldpanelName.length()==0){
				it.remove();
				continue;
			} else if (oldpanelName.equals("合计")){
				it.remove();
				break;
			}
//			String classificationName = dataRow.get("分类") + "";
//			String inventoryUnit = dataRow.get("单位") + "";
			String count = dataRow.get("入库数量") + "";
			String warehouseName = dataRow.get("入库仓库") + "";
			DataRow row = new DataRow();
			row.put("oldpanelName",oldpanelName);
			row.put("warehouseName",warehouseName);
			row.put("count",count);
			dataList.add(row);
		}
		result.dataList = dataList;
		return result;
	}

	/**
	 * 旧板退料单上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadBackOldpanelExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		DataList errorList = new DataList();
		String sql_query = "select * from oldpanel_store_info_format_type_class_view where oldpanelName=?";
		String sql_queryWarehouse = "select * from storeposition where warehouseName=?";
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String oldpanelName = (dataRow.get("品名") + "").trim().toUpperCase();
			String count = (dataRow.get("退料数量") + "").trim();
			String backWarehouseName = (dataRow.get("退料仓库") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("收料仓库") + "").trim().toUpperCase();
			String remark = dataRow.get("备注") + "";
			if(oldpanelName.length()==0){
				it.remove();
				continue;
			} else if (oldpanelName.equals("合计")){
				it.remove();
				break;
			}
			DataList queryList = queryService.query(sql_query,oldpanelName);
			if(queryList.isEmpty()){
				errorList.add(dataRow);
			}else if(((count.split("\\.").length==1)&&(!count.matches(isPureNumber)))||
					((count.split("\\.").length==2)&&(
							(!count.split("\\.")[0].matches(isPureNumber))||(!count.split("\\.")[1].matches(isPureNumber))
					))||((count.split("\\.").length!=1)&&((count.split("\\.").length!=2)))){
				errorList.add(dataRow);
			}else if(queryService.query(sql_queryWarehouse,backWarehouseName).isEmpty()){
				errorList.add(dataRow);
			}else {
				DataRow queryRow = queryList.get(0);
				if(warehouseName.equals("NULL")||warehouseName.length()==0)
					warehouseName = queryRow.get("warehouseName").toString();
				if(queryService.query(sql_queryWarehouse,warehouseName).isEmpty())
					errorList.add(dataRow);
				if(!errorList.isEmpty())
					continue;
				String unitWeight = "";
				String unitArea = "";
				String totalWeight = "";
				String totalArea = "";
				String inventoryUnit = queryRow.get("inventoryUnit")+"";
				String storeId = queryRow.get("storeId")+"";
				if((queryRow.get("unitWeight")!=null)&&(queryRow.get("unitWeight").toString().length()!=0)){
					unitWeight = queryRow.get("unitWeight").toString();
					totalWeight = String.valueOf(Double.parseDouble(unitWeight)*Double.parseDouble(count));
				}
				if((queryRow.get("unitArea")!=null)&&(queryRow.get("unitArea").toString().length()!=0)){
					unitArea = queryRow.get("unitArea").toString();
					totalArea = String.valueOf(Double.parseDouble(unitArea)*Double.parseDouble(count));
				}
				DataRow row = new DataRow();
				row.put("name",oldpanelName);
				row.put("backWarehouseName",backWarehouseName);
				row.put("warehouseName",warehouseName);
				row.put("count",count);
				row.put("unitWeight",unitWeight);
				row.put("unitArea",unitArea);
				row.put("totalWeight",totalWeight);
				row.put("totalArea",totalArea);
				row.put("inventoryUnit",inventoryUnit);
				row.put("remark",remark);
				row.put("storeId",storeId);
				dataList.add(row);
			}
		}
		if(errorList.isEmpty()){
			result.dataList = dataList;
		}else {
			result.dataList = errorList;
			result.setSuccess(false);
			result.setErrorCode(200);
		}
		return result;
	}

	/**
	 * 原材料退料单上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadBackMaterialExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		DataList errorList = new DataList();
		String sql_query = "select * from material_store_info_format_type_class_view where materialName=?";
		String sql_queryWarehouse = "select * from storeposition where warehouseName=?";
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String materialName = (dataRow.get("品名") + "").trim().toUpperCase();
			String count = (dataRow.get("退料数量") + "").trim();
			String backWarehouseName = (dataRow.get("退料仓库") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("收料仓库") + "").trim().toUpperCase();
			String remark = dataRow.get("备注") + "";
			if(materialName.length()==0){
				it.remove();
				continue;
			} else if (materialName.equals("合计")){
				it.remove();
				break;
			}
			DataList queryList = queryService.query(sql_query,materialName);
			if(queryList.isEmpty()){
				errorList.add(dataRow);
			}else if(((count.split("\\.").length==1)&&(!count.matches(isPureNumber)))||
					((count.split("\\.").length==2)&&(
							(!count.split("\\.")[0].matches(isPureNumber))||(!count.split("\\.")[1].matches(isPureNumber))
					))||((count.split("\\.").length!=1)&&((count.split("\\.").length!=2)))){
				errorList.add(dataRow);
			}else if(queryService.query(sql_queryWarehouse,backWarehouseName).isEmpty()){
				errorList.add(dataRow);
			}else {
				DataRow queryRow = queryList.get(0);
				if(warehouseName.equals("NULL")||warehouseName.length()==0)
					warehouseName = queryRow.get("warehouseName").toString();
				if(queryService.query(sql_queryWarehouse,warehouseName).isEmpty())
					errorList.add(dataRow);
				if(!errorList.isEmpty())
					continue;
				String unitWeight = "";
				String unitArea = "";
				String totalWeight = "";
				String totalArea = "";
				String inventoryUnit = queryRow.get("inventoryUnit")+"";
				String storeId = queryRow.get("storeId")+"";
				if((queryRow.get("unitWeight")!=null)&&(queryRow.get("unitWeight").toString().length()!=0)){
					unitWeight = queryRow.get("unitWeight").toString();
					totalWeight = String.valueOf(Double.parseDouble(unitWeight)*Double.parseDouble(count));
				}
				if((queryRow.get("unitArea")!=null)&&(queryRow.get("unitArea").toString().length()!=0)){
					unitArea = queryRow.get("unitArea").toString();
					totalArea = String.valueOf(Double.parseDouble(unitArea)*Double.parseDouble(count));
				}
				DataRow row = new DataRow();
				row.put("name",materialName);
				row.put("backWarehouseName",backWarehouseName);
				row.put("warehouseName",warehouseName);
				row.put("count",count);
				row.put("unitWeight",unitWeight);
				row.put("unitArea",unitArea);
				row.put("totalWeight",totalWeight);
				row.put("totalArea",totalArea);
				row.put("inventoryUnit",inventoryUnit);
				row.put("remark",remark);
				row.put("storeId",storeId);
				dataList.add(row);
			}
		}
		if(errorList.isEmpty()){
			result.dataList = dataList;
		}else {
			result.dataList = errorList;
			result.setSuccess(false);
			result.setErrorCode(200);
		}
		return result;
	}

	@Transactional
	public String findclassificationIdByName(String classificationName){
		DataList dataList;
		String classificationId = "0";
		String sql = "select * from classification where classificationName=?";
		dataList = queryService.query(sql,classificationName);
		if(!dataList.isEmpty()){
			classificationId = String.valueOf(dataList.get(0).get("classificationId"));
		}
		return classificationId;
	}


	@Transactional
	boolean uploadData(DataList dataList,String userid,String tablename) {
		//int uploadId = insertUploadRecord(uploads, tableName, batchNo, startTime, endTime);
		saveData(dataList,userid,tablename);
		//updateEnterpriseInfo(tableName);
		return true;
	}

//	/**
//	 * 退库成品上传数据
//	 *
//	 * @param inputStream
//	 * @param userId
//	 * @return
//	 * @throws IOException
//	 */
//	@Transactional
//	public UploadDataResult uploadBackproductExcelData(InputStream inputStream,String userId,int backproductlogId) throws IOException {
//		DataList dataList = new DataList();
//		UploadDataResult result = new UploadDataResult();
//		Excel excel = new Excel(inputStream);
//		dataList = excel.readExcelContent();
//		System.out.println("Datalist to be upload==="+dataList);
//		Iterator it = dataList.iterator();
//		while (it.hasNext()){
//			com.bancai.domain.DataRow dataRow = (DataRow) it.next();
//			String productName = dataRow.get("品名") + "";
//			if(productName.equals("")){
//				it.remove();
//				continue;
//			} else if (productName.equals("合计")){
//				it.remove();
//				break;
//			}
//			String classificationName = dataRow.get("分类") + "";
//			String inventoryUnit = dataRow.get("库存单位") + "";
//			String count = dataRow.get("入库数量") + "";
//			String warehouseName = dataRow.get("入库仓库") + "";
//			String unitArea = dataRow.get("单面积/m2") + "";
//			String unitWeight = dataRow.get("单重/KG") + "";
//			String remark = dataRow.get("备注") + "";
//			String classificationId = findclassificationIdByName(classificationName);
//			if (classificationId.equals("0")) {
//				result.success = false;
//				result.setErrorCode(2);
//				return result;
//			}
//			int oldpanelId = y_Upload_Data_Service.oldpanelUpload(oldpanelName,warehouseName,count);
//			if (oldpanelId==0) {
//				result.success = false;
//				result.setErrorCode(2);
//				return result;
//			}
//			String sql_addLogDetail = "insert into oldpanel_logdetail (oldpanelId,count,oldpanellogId) values (?,?,?)";
//			boolean is_log_right = insertProjectService.insertIntoTableBySQL(sql_addLogDetail,String.valueOf(oldpanelId),
//					count,String.valueOf(oldpanellogId));
//			if (!is_log_right) {
//				result.success = false;
//				result.setErrorCode(2);
//				return result;
//			}
//		}
//		result.dataList = dataList;
//		return result;
//	}

}
