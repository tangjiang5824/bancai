package service;

import javax.sql.DataSource;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseService {
	protected JdbcOperations jo;
	@Autowired
	public void setDataSource(DataSource dataSource) {
		jo = new JdbcTemplate(dataSource);
	}
	
}
