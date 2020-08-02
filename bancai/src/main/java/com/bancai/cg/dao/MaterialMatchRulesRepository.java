package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialMatchRules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MaterialMatchRulesRepository extends JpaRepository<MaterialMatchRules, Integer>, JpaSpecificationExecutor<MaterialMatchRules> {
    public List<MaterialMatchRules> findAllByProductformatId(int productformatId);
    public List<MaterialMatchRules> findAllByProductformatIdAndSuffix(int productformatId,String suffix);
}