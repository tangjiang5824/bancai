package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface materialTypedao extends JpaRepository<MaterialType,Integer>, JpaSpecificationExecutor<MaterialType> {
}
