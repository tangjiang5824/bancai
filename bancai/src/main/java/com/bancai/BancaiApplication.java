package com.bancai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import javax.sql.DataSource;

//@ServletComponentScan
@SpringBootApplication
public class BancaiApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BancaiApplication.class, args);
    }

    @Bean
    public DataSource dataSource() {
        BasicDataSource basicDataSource=new BasicDataSource();
        basicDataSource.setUrl("jdbc:mysql://116.62.24.156:3306/bancai?serverTimezone=UTC");
        basicDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        basicDataSource.setUsername("root");
        basicDataSource.setPassword("root");
        basicDataSource.setInitialSize(5);
        basicDataSource.setMaxTotal(30);
        return basicDataSource;
    }
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        return builder.sources(BancaiApplication.class);
    }


}
