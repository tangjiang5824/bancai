package com.bancai.config;

import com.google.common.base.Function;
import com.google.common.base.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Optional;


@Configuration
@EnableSwagger2
public class swagApiConfig {
    @Bean
    public Docket creatDocket(){
        return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo)
                .select()
                .apis(basePackage("com.bancai.cg.controller;com.bancai.yrd.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    ApiInfo apiInfo=new ApiInfoBuilder().title("新久融板材API").version("v1.0").build();

    /**
     * @author jinhaoxun
     * @description 重写basePackage方法，使能够实现多包访问
     * @param basePackage 所有包路径
     * @return Predicate<RequestHandler>
     */
    public static Predicate<RequestHandler> basePackage(final String basePackage) {
        return input -> declaringClass(input).map(handlerPackage(basePackage)::apply).orElse(true);
    }

    /**
     * @author jinhaoxun
     * @description 重写basePackage方法，使能够实现多包访问
     * @param basePackage 所有包路径
     * @return Function<Class<?>, Boolean>
     */
    private static Function<Class<?>, Boolean> handlerPackage(final String basePackage)     {
        return input -> {
            // 循环判断匹配
            for (String strPackage : basePackage.split(";")) {
                assert input != null;
                boolean isMatch = input.getPackage().getName().startsWith(strPackage);
                if (isMatch) {
                    return true;
                }
            }
            return false;
        };
    }

    /**
     * @author jinhaoxun
     * @description 重写basePackage方法，使能够实现多包访问
     * @param input
     * @return Optional<? extends Class<?>>
     */
    private static Optional<Class<?>> declaringClass(RequestHandler input) {
        return Optional.ofNullable(input.declaringClass());
    }
}
