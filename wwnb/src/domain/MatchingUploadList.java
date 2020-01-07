package domain;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class MatchingUploadList extends ArrayList<MatchingUploadRow>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MatchingUploadList(PreparedStatement st) throws SQLException {
		ResultSet rs = st.executeQuery();
		while(rs.next()){
			MatchingUploadRow row=new MatchingUploadRow();
			//row.setTableName(rs.getString("tableName"));
			//row.setId(rs.getInt("序号"));
			row.setCompanyName(rs.getString("纳税人名称"));
			row.setCompanyCode(rs.getString("纳税人识别号"));
			this.add(row);
		}
	}

	public MatchingUploadList() {
		// TODO Auto-generated constructor stub
	}
}
