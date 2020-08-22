package com.bancai.commonMethod;

import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.MaterialLog;
import com.bancai.cg.entity.MaterialLogdetail;
import com.bancai.cg.entity.MaterialStore;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.TransferUtil;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.yrd.service.DesignlistService;
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
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Service
public class AllExcelService extends BaseService {
	private Logger log = Logger.getLogger(AllExcelService.class);
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;
	@Autowired
	private InsertProjectService insertProjectService;
	@Autowired
	private DesignlistService designlistService;
	@Autowired
	private AnalyzeNameService analyzeNameService;

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
		DataList retList=new DataList();
		//新增JPA时改动
//		System.out.println(dataList);
		for (int i = 0; i < dataList.size(); i++) {
			DataRow row=new DataRow();
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
			String sql="select * from storeposition where warehouseName=?";
			if(queryService.query(sql,warehouseName).size()==0){
				if(index!=-1){
					StringBuilder errorMsg=new StringBuilder(errorlist.get(index).get("错误原因")+"");
					if(warehouseName.equals("null")) errorMsg.append("仓库名为空； ");
					else errorMsg.append("未找到对应仓库; ");
					errorlist.get(index).put("错误原因",errorMsg.toString());
				}else {
					errorlist.add(dataList.get(i));
					index=errorlist.size()-1;
					if(warehouseName.equals("null")) errorlist.get(index).put("错误原因","仓库名为空； ");
					else errorlist.get(index).put("错误原因","未找到对应仓库; ");
				}
			}
			try{
				Double totalweight=0.0;
				if(dataList.get(i).get("总重")!=null){
					totalweight=Double.valueOf((dataList.get(i).get("总重")+"").trim());
				}
				Double count=1.0;
				if(dataList.get(i).get("数量")!=null)
					count=Double.valueOf((dataList.get(i).get("数量")+"").trim());
				double unitweight=totalweight/count;
				unitweight = TransferUtil.keep2tail(unitweight);
				//dataList.get(i).put("单重",unitweight);
				row.put("count",count+"");
				row.put("totalWeight",totalweight+"");
				row.put("单重",unitweight);
			}catch (Exception e){
				if(index!=-1){
					StringBuilder errorMsg=new StringBuilder(errorlist.get(index).get("错误原因")+"");
					errorMsg.append("数量或者总重输入出错;  ");
					errorlist.get(index).put("错误原因",errorMsg.toString());
				}else{
					errorlist.add(dataList.get(i));
					index=errorlist.size()-1;
					errorlist.get(index).put("错误原因","数量或者总重输入出错;  ");
				}
			}
			try{
				Double totalarea=0.0;
				if(dataList.get(i).get("总面积")!=null){
					totalarea=Double.valueOf((dataList.get(i).get("总面积")+"").trim());
				}
				Double count=1.0;
				if(dataList.get(i).get("数量")!=null)
					count=Double.valueOf((dataList.get(i).get("数量")+"").trim());
				double unitarea=totalarea/count;
				unitarea = TransferUtil.keep2tail(unitarea);
				//dataList.get(i).put("单重",unitweight);
				row.put("totalArea",totalarea+"");
				row.put("单面积",unitarea);
			}catch (Exception e){
				if(index!=-1){
					StringBuilder errorMsg=new StringBuilder(errorlist.get(index).get("错误原因")+"");
					errorMsg.append("数量或者总面积输入出错;  ");
					errorlist.get(index).put("错误原因",errorMsg.toString());
				}else{
					errorlist.add(dataList.get(i));
					index=errorlist.size()-1;
					errorlist.get(index).put("错误原因","数量或者总面积输入出错;  ");
				}
			}
			row.put("序号",dataList.get(i).get("序号") +"");
			row.put("materialName",dataList.get(i).get("原材料名") +"");
			row.put("warehouseName",dataList.get(i).get("仓库名称") +"");
			row.put("description",dataList.get(i).get("备注") +"");
			retList.add(row);

		}
		if(errorlist.size()==0) {
			result.dataList = retList;
			result.success = true;
		}else {
			result.dataList = errorlist;
			result.success = false;
		}
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
			String count = (dataRow.get("入库数量") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("入库仓库") + "").trim().toUpperCase();
			String remark = (dataRow.get("备注") + "").trim();
			DataRow row = new DataRow();
			row.put("oldpanelName",oldpanelName);
			row.put("warehouseName",warehouseName);
			row.put("count",count);
			row.put("remark",remark);
			dataList.add(row);
		}
		result.dataList = dataList;
		return result;
	}
	/**
	 * 预加工上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadPreprocessExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String productName = (dataRow.get("品名") + "").trim().toUpperCase();
			if(productName.length()==0){
				it.remove();
				continue;
			} else if (productName.equals("合计")){
				it.remove();
				break;
			}
//			String classificationName = dataRow.get("分类") + "";
//			String inventoryUnit = dataRow.get("单位") + "";
			String count = (dataRow.get("入库数量") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("入库仓库") + "").trim().toUpperCase();
			String remark = (dataRow.get("备注") + "").trim();
			DataRow row = new DataRow();
			row.put("productName",productName);
			row.put("warehouseName",warehouseName);
			row.put("count",count);
			row.put("remark",remark);
			dataList.add(row);
		}
		result.dataList = dataList;
		return result;
	}
	/**
	 * 退库成品上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadBackproductExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String productName = (dataRow.get("品名") + "").trim().toUpperCase();
			if(productName.length()==0){
				it.remove();
				continue;
			} else if (productName.equals("合计")){
				it.remove();
				break;
			}
//			String classificationName = dataRow.get("分类") + "";
//			String inventoryUnit = dataRow.get("单位") + "";
			String count = (dataRow.get("入库数量") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("入库仓库") + "").trim().toUpperCase();
			String remark = (dataRow.get("备注") + "").trim();
			DataRow row = new DataRow();
			row.put("productName",productName);
			row.put("warehouseName",warehouseName);
			row.put("count",count);
			row.put("remark",remark);
			dataList.add(row);
		}
		result.dataList = dataList;
		return result;
	}

	/**
	 * 退料单上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadBackExcelData(String typeName,String originName,String projectId,String buildingId, InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		DataList errorList = new DataList();
		String sql_queryInfo = "select * from "+originName+"_info where "+originName+"Name=?";
		String sql_queryWarehouse = "select * from storeposition where warehouseName=?";
		String sql_queryStore = "select * from "+typeName+"_store where "+originName+"Id=?";
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String name = (dataRow.get("品名") + "").trim().toUpperCase();
			String count = (dataRow.get("退料数量") + "").trim();
			String backWarehouseName = (dataRow.get("退料仓库") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("收料仓库") + "").trim().toUpperCase();
			String remark = dataRow.get("备注") + "";
			String position = (dataRow.get("编号") + "").trim().toUpperCase();
			if((name.length()==0)||(name.equals("NULL"))){
				if((!typeName.equals("backproduct"))||(position.length()==0)||(position.equals("NULL"))) {
					it.remove();
					continue;
				}else {
					DataList posList = designlistService.getDesignlistByPosition(projectId,buildingId,position);
					if(posList.isEmpty()){
						dataRow.put("errorType","编号有误或该项目楼栋中不存在此编号");
						errorList.add(dataRow);
						continue;
					}else {
						name = posList.get(0).get("productName").toString();
					}
				}
			} else if (name.equals("合计")){
				it.remove();
				break;
			}
			DataList infoList = queryService.query(sql_queryInfo,name);
			if(infoList.isEmpty()){
				dataRow.put("errorType","没有该品名的基础信息");
				errorList.add(dataRow);
				continue;
			}
			if(analyzeNameService.isStringNotNonnegativeNumber(count)){
				dataRow.put("errorType","数量错误");
				errorList.add(dataRow);
				continue;
			}
			if(queryService.query(sql_queryWarehouse,backWarehouseName).isEmpty()){
				dataRow.put("errorType","退料仓库有误");
				errorList.add(dataRow);
				continue;
			}
			DataRow infoRow = infoList.get(0);
			String infoId = infoRow.get("id").toString();
			DataList storeList = queryService.query(sql_queryStore,infoId);
			String storeId = "0";
			if((!storeList.isEmpty())&&(warehouseName.equals("NULL")||warehouseName.length()==0)){
				warehouseName = storeList.get(0).get("warehouseName").toString();
				storeId = storeList.get(0).get("id").toString();
			}
			else if(queryService.query(sql_queryWarehouse,warehouseName).isEmpty()){
				dataRow.put("errorType","收料仓库有误");
				errorList.add(dataRow);
				continue;
			}
			if(!errorList.isEmpty())
				continue;
			String unitWeight = "";
			String unitArea = "";
			String totalWeight = "";
			String totalArea = "";
			String inventoryUnit = infoRow.get("inventoryUnit")+"";
			if((infoRow.get("unitWeight")!=null)&&(infoRow.get("unitWeight").toString().length()!=0)){
				unitWeight = infoRow.get("unitWeight").toString();
				totalWeight = String.valueOf(TransferUtil.keep2tail(Double.parseDouble(unitWeight)*Double.parseDouble(count)));
			}
			if((infoRow.get("unitArea")!=null)&&(infoRow.get("unitArea").toString().length()!=0)){
				unitArea = infoRow.get("unitArea").toString();
				totalArea = String.valueOf(TransferUtil.keep2tail(Double.parseDouble(unitArea)*Double.parseDouble(count)));
			}
			DataRow row = new DataRow();
			row.put("name",name);
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
	 * 废料上传数据
	 *
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	@Transactional
	public UploadDataResult uploadWasteExcelData(InputStream inputStream) throws IOException {
		UploadDataResult result = new UploadDataResult();
		Excel excel = new Excel(inputStream);
		DataList excelList = excel.readExcelContent();
		Iterator it = excelList.iterator();
		DataList dataList = new DataList();
		while (it.hasNext()){
			DataRow dataRow = (DataRow) it.next();
			String wasteName = (dataRow.get("品名") + "").trim().toUpperCase();
			if(wasteName.length()==0){
				it.remove();
				continue;
			} else if (wasteName.equals("合计")){
				it.remove();
				break;
			}
			String inventoryUnit = (dataRow.get("单位") + "").trim().toUpperCase();
			String count = (dataRow.get("入库量") + "").trim().toUpperCase();
			String warehouseName = (dataRow.get("入库仓库") + "").trim().toUpperCase();
			String remark = dataRow.get("备注") + "";
			DataRow row = new DataRow();
			row.put("wasteName",wasteName);
			row.put("inventoryUnit",inventoryUnit);
			row.put("warehouseName",warehouseName);
			row.put("count",count);
			row.put("remark",remark);
			dataList.add(row);
		}
		result.dataList = dataList;
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
