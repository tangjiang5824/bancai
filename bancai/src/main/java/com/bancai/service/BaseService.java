package com.bancai.service;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class BaseService {
	protected JdbcOperations jo;
	@Autowired
	public void setDataSource(DataSource dataSource) {
		jo = new JdbcTemplate(dataSource);
	}

}
