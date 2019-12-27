package config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import db.DB;

@Configuration
public class DataSourceConfig {
	@Bean
	public DataSource dataSource() {
		DriverManagerDataSource bean=new DriverManagerDataSource();
		bean.setUrl(DB.getConnectionUrl());
//		bean.setPassword("1qaz,2wsx.3edc/");
//		bean.setUsername("root");
		bean.setDriverClassName(DB.getDriver());
		return bean;
	}
}
