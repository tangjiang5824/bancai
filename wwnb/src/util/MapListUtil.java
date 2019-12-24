package util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
/**
 * 
 * @author constantine
 * 解析的json进行操作的的工具类
 *
 */
public class MapListUtil {
	public static List<Map<String, Object>> filter(List<Map<String, Object>> mapList){
		for (int i = 0; i < mapList.size(); i++) {
			Map<String, Object> obj = mapList.get(i);
			if(obj.get("")!=null)
				obj.remove("");
			if(obj.get(" ")!=null)
				obj.remove(" ");
			if(obj.get("id")!=null)
				obj.remove("id");
		}
		return mapList;
	}
	public static String [] getColumnNames(List<Map<String, Object>> mapList,int columnsCount) {
		Map<String, Object> object = mapList.get(0);
		String columnNames[] = new String[columnsCount];
		int columnIndex =0;
		for(Entry<String, Object> entry : object.entrySet())
		{
			columnNames[columnIndex++] = entry.getKey();
			if(columnIndex==columnsCount)
				break;
		}
		columnNames[columnsCount-1]="uploadId";
		return columnNames;
	}
	/**
	 * 生成保存上传时数据的SQL语句
	 * @param mapList
	 * @param sql1
	 * @param columnsCount
	 * @param session
	 * @return
	 */
	public static String getSql(List<Map<String, Object>> mapList,String sql1,int columnsCount,int uploadId) {
		StringBuffer sql = new StringBuffer(sql1);
		for (int i = 0; i < mapList.size(); i++) {
			Map<String, Object> obj = mapList.get(i);
			List<Object> columns = new ArrayList<>();
			int count = 1;//hashMap中的键值对个数
			for (Entry<String, Object> entry : obj.entrySet()) {
				Object value = entry.getValue();
				if(value==null)
					value="";
				columns.add(value);
				if((count++)==columnsCount) {
					columns.add(uploadId);
					break;
				}
			}
			for(int j = 0;j<columns.size();j++) {
				if(j==0)
					sql.append("('"+columns.get(j));
				else if(j!=0&&j!=columns.size()-1)
					sql.append("','"+columns.get(j));
				else if(j==columns.size()-1&&i!=mapList.size()-1)
					sql.append("',"+uploadId+"),");
				else if(j==columns.size()-1&&i==mapList.size()-1)
					sql.append("',"+uploadId+")");
			}
			
		}
		return sql.toString();
	}
	/**
	 * 生成查询的SQL语句
	 * @return
	 */
	public static String selectSql(List<Map<String, Object>> mapList,String tableName) {
			String str = "select * from ";
			StringBuffer sql = new StringBuffer(str);
			sql.append("["+tableName+"] where ");
			for(int i=0;i<mapList.size();i++) {
				Map<String, Object> obj = mapList.get(i);
				for(Entry<String, Object> entry : obj.entrySet()) {
					String value = entry.getValue().toString().trim();
					String key = entry.getKey();
					if(!key.equals("id")) {
						if(key.equals("cName")) {
							sql.append("["+value+"]");
						}
						if(key.equals("compare")) {
							sql.append(" "+value+" ");
						}
						if(key.equals("condition")) {
							String compare = obj.get("compare").toString();
							if(compare.equals("like")) {
								sql.append(" '%"+value+"%' ");
							}
							else
								sql.append(" '"+value+"' ");
						}
					}
					
				}
				if(i<mapList.size()-1)
					sql.append(" and ");
			}
		return sql.toString();
		
	}
}
