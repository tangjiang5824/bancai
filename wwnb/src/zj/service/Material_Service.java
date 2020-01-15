package zj.service;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;


@Service
public class Material_Service extends BaseService {
	private Logger log = Logger.getLogger(Material_Service.class);


	@Transactional
	public int addMaterialData(String tableName,String materialName,int proNum,String Length,String Type,String Width,String scale,String respo,String respoNum,int count,double cost,String location,String userid){
		KeyHolder keyHolder = new GeneratedKeyHolder();
		//int i= jo.update(sql,userid,startTime,projectName,"1",keyHolder);
		String sql = "insert into "+ tableName+" (材料名,品号,长,类型,宽,规格,库存单位,仓库编号,数量,成本,存放位置,uploadId) values(?,?,?,?,?,?,?,?,?,?,?,?)";
		int j=jo.update(new PreparedStatementCreator(){
							@Override
							public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
								PreparedStatement ps = conn.prepareStatement(sql,new String[] { "id" });
								ps.setString(1, materialName);
								ps.setInt(2, proNum);
								ps.setString(3, Length);
								ps.setString(4, Type);
								ps.setString(5, Width);
								ps.setString(6, scale);
								ps.setString(7, respo);
								ps.setString(8, respoNum);
								ps.setInt(9, count);
								ps.setDouble(10, cost);
								ps.setString(11, location);
								ps.setString(12, userid);
								return ps;
							}
						},
				keyHolder);
		return keyHolder.getKey().intValue();
	}
}