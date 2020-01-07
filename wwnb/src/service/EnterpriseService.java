package service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import db.Condition;
import db.DB;
import vo.WebResponse;


@Service
public class EnterpriseService extends BaseService{
	private Logger log=Logger.getLogger(EnterpriseService.class);
	@Autowired
	private QueryService queryService;
	private Long getCount(Connection conn,String sql,Object...objs) throws SQLException
	{
		PreparedStatement psCount=conn.prepareStatement(sql);
		for(int i=0;i<objs.length;i++)
		{
			psCount.setObject(i+1, objs[i]);
		}
		
		psCount.execute();
		ResultSet rsCount=psCount.getResultSet();
		rsCount.next();
		Long count=rsCount.getLong(1);
		rsCount.close();
		psCount.close();
		return count;
	}
	/**
	 * 查找哪些表存在数据
	 * @param code 社会信用代码
	 * @param startTime 开始时间
	 * @param endTime 截止时间
	 * @param type	第三方还是金三
	 * @return
	 * @throws SQLException 
	 */
	public Map<String,List<String>>  findExistData(String code,String startTime,String endTime,int type) throws SQLException {
		
		Map<String,List<String>> tableColumns=new HashMap<String,List<String>>();
		if(startTime!=null&&startTime.length()==0) {
			startTime=null;
		}
		if(endTime!=null&&endTime.length()==0) {
			endTime=null;
		}
		Connection conn=null;
		try {
			conn=DB.getConnection();
			PreparedStatement st=conn.prepareStatement("select a.tableName as tableName, a.text as text from dataTableDefinition as a,dataTable as b where a.tableName=b.tableName and b.type=? and a.taxUnitCode=1");
			st.setInt(1, type);
			st.execute();
			ResultSet rs=st.getResultSet();
			while(rs.next())
			{
				
				String tableName=rs.getString("tableName");
				String column=rs.getString("text");
				String sql=null;
				Long count=0L;
				if(startTime!=null&&endTime!=null)
				{
					sql=String.format("select count(*) from [%s] as a,uploadRecords as b where a.uploadId=b.id and a.[%s]=? and b.startTime>=? and b.endTime<=? ", tableName,column); 
					count=getCount(conn,sql,code,startTime,endTime);
					
				}
				else if(startTime==null&&endTime!=null)
				{
					sql=String.format("select count(*) from [%s] as a,uploadRecords as b where a.uploadId=b.id and a.[%s]=? and b.endTime<=? ", tableName,column); 
					count=getCount(conn,sql,code,endTime);
				}else if(startTime!=null&&endTime==null)
				{
					sql=String.format("select count(*) from [%s] as a,uploadRecords as b where a.uploadId=b.id and a.[%s]=? and b.startTime>=?", tableName,column); 
					count=getCount(conn,sql,code,startTime);
				}else if(startTime==null&&endTime==null)
				{
					sql=String.format("select count(*) from [%s] as a,uploadRecords as b where a.uploadId=b.id and a.[%s]=?", tableName,column); 
					count=getCount(conn,sql,code);
				}
				if(count>0)
				{
					List<String> columns=tableColumns.get(tableName);
					if(columns==null)
					{
						columns=new ArrayList<String>();
					}
					columns.add(column);
					tableColumns.put(tableName, columns);
				}
			}
			rs.close();
			st.close();
		}catch(Exception e)
		{
			e.printStackTrace();
		}finally {
			conn.close();
		}
		return tableColumns;
	}
	public WebResponse getData(String code,String tableName,List<String> columns,String startTime,String endTime,Integer start,Integer limit)
	{
		Condition c=new Condition(columns.get(0),"=",code);
		for(int i=1;i<columns.size();i++)
		{
			c.or(new Condition(columns.get(i),"=",code));
		}
		Condition timeCondition=new Condition();
		if(startTime!=null&&startTime.trim().length()!=0)
		{
			timeCondition.and(new Condition("startTime",">=",startTime));
		} 
		if(endTime!=null&&endTime.trim().length()!=0)
		{
			timeCondition.and(new Condition("endTime","<=",endTime));
		}
		c.and(timeCondition);
		String selectSQL="select a.* from ["+tableName+"] as a,uploadRecords as b where a.uploadId=b.id";
		String whereClause=c.toString();
		if(whereClause.length()>0)
		{
			selectSQL+=" and "+whereClause;
		}
		return queryService.queryPage(start, limit, selectSQL, c.getParameters());
	}
	
	public static void main(String args[]) throws SQLException
	{
		EnterpriseService enterpriseService=new EnterpriseService();
		Map<String,List<String>> map=enterpriseService.findExistData("51222119590504002101", "", "",1);
		System.out.println(map);
		for(String tableName:map.keySet())
		{
			System.out.println(tableName);
			WebResponse response=enterpriseService.getData("91500101207914379T", tableName, map.get(tableName), "2017-01", "2017-12", 0, 25);
			System.out.println(response);
		}
		System.out.println(map);	}
}
