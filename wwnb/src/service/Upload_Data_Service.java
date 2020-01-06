package service;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mysql.jdbc.Statement;
import db.DB;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class Upload_Data_Service extends BaseService {
	private Logger log = Logger.getLogger(Upload_Data_Service.class);
	
	@Transactional
	public void addData(String tableName,int proNum,String Length,String Type,String Width,String scale,String respo,String respoNum,int count,double cost,String location,int materialType,String userid){
		
		
		jo.update("insert into "+ tableName+" (品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,materialtype,uploadID) values(?,?,?,?,?,?,?,?,?,?,?,?)",
				proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,materialType,userid);
		//return true;
	}
	@Transactional
	public void updateData(String sql){
		log.debug(sql);
		jo.update(sql);
	}

	@Transactional
	//插入数据到project
	public int insertDataToProject(String sql,String userid,String startTime,String projectName){
		log.debug(sql);
		KeyHolder keyHolder = new GeneratedKeyHolder();
		//int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
		int j=jo.update(new PreparedStatementCreator(){
							@Override
							public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
								PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
								ps.setString(1, userid);
								ps.setString(2, startTime);
								ps.setString(3, projectName);
								ps.setString(4, "1");
								return ps;
							}
						},
				keyHolder);
		return keyHolder.getKey().intValue();
	}

	@Transactional
	//插入数据到planlist
	public int insertDataToPlanlist(String sql,String projectId,String productId,String number){
		log.debug(sql);
		KeyHolder keyHolder = new GeneratedKeyHolder();
		//int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
		int j=jo.update(new PreparedStatementCreator(){
							@Override
							public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
								PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
								ps.setString(1, projectId);
								ps.setString(2, productId);
								ps.setString(3, number);
								return ps;
							}
						},
				keyHolder);
		return keyHolder.getKey().intValue();
	}
	@Transactional
	//插入数据到projectlist
	public int insertDataToProjectlist(String sql,String projectId,String productId,String materialStoreId,String Num){
		log.debug(sql);
		KeyHolder keyHolder = new GeneratedKeyHolder();
		//int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
		int j=jo.update(new PreparedStatementCreator(){
							@Override
							public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
								PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
								ps.setString(1, projectId);
								ps.setString(2, productId);
								ps.setString(3, materialStoreId);
								ps.setString(4, Num);
								return ps;
							}
						},
				keyHolder);
		return keyHolder.getKey().intValue();
	}


}