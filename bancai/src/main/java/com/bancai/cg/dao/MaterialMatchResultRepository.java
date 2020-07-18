package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialMatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MaterialMatchResultRepository extends JpaRepository<MaterialMatchResult, Integer>, JpaSpecificationExecutor<MaterialMatchResult> {

}