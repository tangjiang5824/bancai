package domain;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;

public class DataList extends ArrayList<DataRow> {

	private static final long serialVersionUID = 7369026371525705428L;
	public DataList() {

	}

	public DataList(PreparedStatement st) throws SQLException {
		ResultSet rs = st.executeQuery();
		ResultSetMetaData rsmd = rs.getMetaData();
		while (rs.next()) {
			DataRow row = new DataRow();
			for (int i = 1; i <= rsmd.getColumnCount(); i++)
				row.put(rsmd.getColumnName(i), rs.getObject(rsmd.getColumnName(i)));
				
			add(row);
		}
	}
	public DataList(PreparedStatement st, Integer start, Integer limit) throws SQLException {
		st.setMaxRows(start + limit);
		ResultSet rs = st.executeQuery();
		// 将游标移动到第一条记录
		rs.first();
		// 游标移动到要输出的第一条记录
		rs.relative(start - 1);
		ResultSetMetaData rsmd = rs.getMetaData();
		while (rs.next()) {
			DataRow row = new DataRow();
			for (int i = 1; i <= rsmd.getColumnCount(); i++) 
				row.put(rsmd.getColumnName(i), rs.getObject(rsmd.getColumnName(i)));
			add(row);
		}
	}
	public String toInsertSQL(int start,int end,String tableName,int uploadId)
	{
		String columns=getColumns();
		String values=getValues(start,end,uploadId);
		return String.format("insert into [%s] (%s uploadId) values %s", tableName,columns,values);
	}
	

	private String getValues(int start,int end,int uploadId) {
		String values="";
		for(int i=start;i<end&&i<this.size();i++)
		{
			DataRow row=this.get(i);
			String value="";
			for(Object v:row.values())
			{
				value+=String.format("'%s',", v.toString().replaceAll("'", "''"));
			}
			value=value+uploadId;
			values+=String.format("(%s),", value);
		}
		return values.substring(0,values.length()-1);
	}

	public String getColumns() {
		String columns="";
		DataRow row=this.get(0);
		for(String column:row.keySet())
		{
			columns+="["+column+"],";
		}
		return columns;
	}
	public static void main(String args[])
	{
		DataList list=new DataList();
		DataRow row=new DataRow();
		row.put("a1", 1);
		row.put("a2", 2);
		list.add(row);
		row=new DataRow();
		row.put("a1", 3);
		row.put("a2", 4);
		list.add(row);
		System.out.println(list.toInsertSQL(0,2,"A",20));
	}

}
