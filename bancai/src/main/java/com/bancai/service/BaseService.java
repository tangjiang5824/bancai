package com.bancai.service;

import javax.sql.DataSource;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseService {
	protected JdbcOperations jo;
	@Autowired
	public void setDataSource(@Qualifier("dataSource") DataSource dataSource) {
		jo = new JdbcTemplate(dataSource);
	}
	
}
