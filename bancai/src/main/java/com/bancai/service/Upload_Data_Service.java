package com.bancai.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class Upload_Data_Service extends BaseService {
	private Logger log = Logger.getLogger(Upload_Data_Service.class);
	
	@Transactional
	public void addData(String tableName,int proNum,String Length,String Type,String Width,String scale,String respo,String respoNum,int count,double cost,String location,int materialType,String userid){
		
		
		jo.update("insert into "+ tableName+" (品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,materialtype,uploadId) values(?,?,?,?,?,?,?,?,?,?,?,?)",
				proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,materialType,userid);
		//return true;
	}
	@Transactional
	public void updateData(String sql){
		log.debug(sql);
		jo.update(sql);
	}
}