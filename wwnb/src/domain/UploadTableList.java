package domain;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.ArrayList;





public class UploadTableList extends ArrayList<UploadTableRow>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UploadTableList(PreparedStatement st) throws SQLException {
		ResultSet rs = st.executeQuery();
		while(rs.next()){
			UploadTableRow row=new UploadTableRow();
			row.setTableName(rs.getString("tableName"));
			row.setId(rs.getInt("id"));
			this.add(row);
		}
	}

	public UploadTableList() {
		// TODO Auto-generated constructor stub
	}

	
}
