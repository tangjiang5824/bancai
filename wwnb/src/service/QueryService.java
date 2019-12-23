package service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import db.Condition;
import domain.DataList;
import domain.DataRow;
import vo.WebResponse;

@Service
public class QueryService extends BaseService {
	private Logger log=Logger.getLogger(QueryService.class);
	/**
	 * 高级查询，按照表名和条件
	 * @param tableName
	 * @param conditions
	 * @param start
	 * @param limit
	 * @return
	 */
	public WebResponse advanceQuery(String tableName,List<Map<String, Object>> conditions,Integer start,Integer limit)
	{
		Condition c=new Condition();
		for(Map<String, Object> map:conditions)
		{
			
			String cName=map.get("cName").toString();
			String compare=map.get("compare").toString();
			String cond=map.get("condition").toString().trim();
			boolean columnType= ((int)map.get("columnType"))==1?true:false;
			if(cName.equals("")||compare.equals("")) {
				continue;
			}
			if(compare.equals("like"))
				cond="%"+cond+"%";
			c.and(new Condition(cName,compare,cond,columnType));
		}
		log.debug(c.toString());
		return queryPage(start, limit, c, tableName);
	}
	/**
	 * 按照selectSQL和条件分页查询，selectSQL不能有where子句
	 * @param start
	 * @param limit
	 * @param selectSQL
	 * @param c
	 * @return
	 */
	public WebResponse queryPage(Integer start,Integer limit,String selectSQL,Condition c)
	{
		String whereClause=c.toString();
		if(whereClause.length()>0)
		{
			selectSQL+="where "+whereClause;
			return queryPage(start,limit,selectSQL,c.getParameters());
		}else
		{
			return queryPage(start,limit,selectSQL);
		}
	}
	/**
	 * 按照selectSQL分页查询
	 * @param start
	 * @param limit
	 * @param selectSQL
	 * @param objs
	 * @return
	 */
	public WebResponse queryPage(Integer start,Integer limit,String selectSQL,Object...objs)
	{
		WebResponse response=new WebResponse();
		String countSQL="select count(*) as num "+selectSQL.substring(selectSQL.indexOf("from"));
		log.debug(selectSQL);
		log.debug(countSQL);
		DataList list=query(selectSQL,start,limit,objs);
		DataList countlist=query(countSQL,objs);
		response.put("value", list);
		response.put("totalCount", countlist.get(0).get("num"));
		return response;
	}
	/**
	 * 按照条件和表名分页查询
	 * @param start
	 * @param limit
	 * @param c
	 * @param tableName
	 * @return
	 */
	public WebResponse queryPage(Integer start,Integer limit,Condition c,String tableName)
	{
		log.debug(c.toString()+"   "+c.getParameters());
		String whereClause=c.toString();
		if(whereClause.length()>0)
			return queryPage(start,limit,"select * from ["+tableName+"] where "+whereClause,c.getParameters());
		else
			return queryPage(start,limit,"select * from ["+tableName+"]");
	}

	/**
	 * 按sql查询DataList
	 * @param sql
	 * @param args
	 * @return
	 */
	public DataList query(String sql, Object... args) {
		return jo.query(new PreparedStatementCreator() {

			@Override
			public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
				PreparedStatement ps=conn.prepareStatement(sql);
				for(int i=1;i<=args.length;i++)
				{
					ps.setObject(i, args[i-1]);
				}
				log.debug(sql);
				return ps;
			}
			
		}, new ResultSetExtractor<DataList>() {

			@Override
			public DataList extractData(ResultSet rs) throws SQLException, DataAccessException {
				DataList list=new DataList();
				/*if(rs.first() != false) {
					rs.first();*/
					ResultSetMetaData rsmd = rs.getMetaData();
					while (rs.next()) {
						DataRow row = new DataRow();
						for (int i = 1; i <= rsmd.getColumnCount(); i++)
							row.put(rsmd.getColumnName(i), rs.getObject(rsmd.getColumnName(i)));
						list.add(row);
					}
				/*}
				else {
					ResultSetMetaData rsmd = rs.getMetaData();
						DataRow row = new DataRow();
						for (int i = 1; i <= rsmd.getColumnCount(); i++)
							row.put(rsmd.getColumnName(i), "");
						list.add(row);
				}*/
				return list;
			}
			
		});
	}
	/**
	 * 按照sql查询DataList，限制start和limit
	 * @param sql
	 * @param start
	 * @param limit
	 * @param args
	 * @return
	 */
	public DataList query(String sql, Integer start, Integer limit, Object... args) {
		return jo.query(new PreparedStatementCreator() {

			@Override
			public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
				PreparedStatement ps=conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
				for(int i=1;i<=args.length;i++)
				{
					ps.setObject(i, args[i-1]);
				}
				if(limit!=-1)
					ps.setMaxRows(start + limit);
				return ps;
			}
			
		}, new ResultSetExtractor<DataList>() {

			@Override
			public DataList extractData(ResultSet rs) throws SQLException, DataAccessException {
				DataList list=new DataList();
				// 将游标移动到第一条记录
//				log.debug(rs.first()==true);
				if(rs.first() != false) {
					rs.first();
					// 游标移动到要输出的第一条记录
					rs.relative(start - 1);
					ResultSetMetaData rsmd = rs.getMetaData();
					while (rs.next()) {
						DataRow row = new DataRow();
						for (int i = 1; i <= rsmd.getColumnCount(); i++)
							row.put(rsmd.getColumnName(i), rs.getObject(rsmd.getColumnName(i)));
						list.add(row);
					}
				}
				else {
//					ResultSetMetaData rsmd = rs.getMetaData();
//						DataRow row = new DataRow();
//						for (int i = 1; i <= rsmd.getColumnCount(); i++)
//							row.put(rsmd.getColumnName(i), null);
//						list.add(row);
				}
				return list;
			}
			
		});
	}
	/**
	 * 按照sql做count，sql必须是select count
	 * @param sql
	 * @param objs
	 * @return
	 */
	public Integer getCount(String sql,Object...objs)
	{
		return jo.queryForObject(sql, Integer.class,objs);
	}
	public <T> T queryForObject(String sql,Class<T> clz,Object ...objs)
	{
		return jo.queryForObject(sql, clz,objs);
	}
	
}
