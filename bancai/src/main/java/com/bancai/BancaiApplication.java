package com.bancai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;


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


