package com.bancai;

//import org.apache.commons.dbcp2.BasicDataSource;



import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.jpa.vendor.HibernateJpaSessionFactoryBean;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

//@ServletComponentScan
//@SpringBootApplication
@SpringBootApplication
public class BancaiApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BancaiApplication.class, args);
    }

//    @Bean
//    public DataSource dataSource() {
//        BasicDataSource basicDataSource=new BasicDataSource();
//        basicDataSource.setUrl("jdbc:mysql://47.105.55.200:3306/bancai?serverTimezone=UTC&characterEncoding=utf8");
//        basicDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
//        basicDataSource.setUsername("root");
//        basicDataSource.setPassword("123456");
//        basicDataSource.setInitialSize(5);
//        basicDataSource.setMaxTotal(30);
//        return basicDataSource;
//    }


    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        return builder.sources(BancaiApplication.class);
    }


}


