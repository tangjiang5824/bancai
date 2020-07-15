package com.bancai.cg.dao;

import com.bancai.cg.entity.ProductFormat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductFormatRepository extends JpaRepository<ProductFormat, Integer>, JpaSpecificationExecutor<ProductFormat> {

}