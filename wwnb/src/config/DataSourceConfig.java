package config;

import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jndi.JndiObjectFactoryBean;


@Configuration
public class DataSourceConfig {
	@Bean
	public DataSource dataSource() {
		BasicDataSource basicDataSource=new BasicDataSource();
		basicDataSource.setUrl("jdbc:mysql://116.62.24.156:3306/bancai");
		basicDataSource.setDriverClassName("com.mysql.jdbc.Driver");
		basicDataSource.setUsername("root");
		basicDataSource.setPassword("root");
		basicDataSource.setInitialSize(20);
		basicDataSource.setMaxTotal(30);
		return basicDataSource;
	}
}
  
//package config;
//
//import javax.sql.DataSource;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.jdbc.datasource.DriverManagerDataSource;
//
//import db.DB;
//
//@Configuration
//public class DataSourceConfig {
//	@Bean
//	public DataSource dataSource() {
//		DriverManagerDataSource bean=new DriverManagerDataSource();
//		bean.setUrl(DB.getConnectionUrl());
////		bean.setPassword("1qaz,2wsx.3edc/");
////		bean.setUsername("root");
//		bean.setDriverClassName(DB.getDriver());
//		return bean;
//	}
//}