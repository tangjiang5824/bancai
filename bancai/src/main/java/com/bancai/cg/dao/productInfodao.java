package com.bancai.cg.dao;

import com.bancai.cg.entity.ProductInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface productInfodao extends JpaRepository<ProductInfo,Integer>, JpaSpecificationExecutor<ProductInfo> {
}
