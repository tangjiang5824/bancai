package com.bancai.zj.service;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;


@Service
public class Material_Service extends BaseService {
	private Logger log = Logger.getLogger(Material_Service.class);


	@Transactional   //specification,inventoryUnit,warehouseNo
	public int addMaterialData(String tableName,String materialName,String materialNo,String length,String length2,String Type,String width,String width2,String specification,String inventoryUnit,int warehouseNo,int count,double cost,int row,int col,String userId){
		KeyHolder keyHolder = new GeneratedKeyHolder();
		//int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
		String sql = "insert into "+ tableName+" (materialName,materialNo,length,length2,materialType,width,width2,specification,inventoryUnit,warehouseNo,number,cost,rowNo,columNo,uploadId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		int j=jo.update(new PreparedStatementCreator(){
							@Override
							public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
								PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
								ps.setString(1, materialName);
								ps.setString(2, materialNo);
								ps.setString(3, length);
								ps.setString(4, length2);
								ps.setString(5, Type);
								ps.setString(6, width);
								ps.setString(7, width2);
								ps.setString(8, specification);
								ps.setString(9, inventoryUnit);
								ps.setInt(10, warehouseNo);
								ps.setInt(11, count);
								ps.setDouble(12, cost);
								ps.setInt(13, row);
								ps.setInt(14, col);
								//ps.setString(11, location);
								ps.setString(15, userId);
								return ps;
							}
						},
				keyHolder);
		return keyHolder.getKey().intValue();
	}
}