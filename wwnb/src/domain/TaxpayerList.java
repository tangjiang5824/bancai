package domain;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;


public class TaxpayerList extends ArrayList<TaxpayerRow>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public TaxpayerList(PreparedStatement st) throws SQLException {
		ResultSet rs = st.executeQuery();
		while(rs.next()){
			TaxpayerRow row=new TaxpayerRow();
			row.setCode(rs.getString("社会信用代码(纳税人识别号)"));
			row.setName(rs.getString("纳税人名称"));
			this.add(row);
		}
	}

	public TaxpayerList() {
		// TODO Auto-generated constructor stub
	}
}
