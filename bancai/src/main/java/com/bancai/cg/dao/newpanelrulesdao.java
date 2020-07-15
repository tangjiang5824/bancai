package com.bancai.cg.dao;

import com.bancai.cg.entity.NewpanelRules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface newpanelrulesdao extends JpaRepository<NewpanelRules,Integer>, JpaSpecificationExecutor<NewpanelRules> {
    public List<NewpanelRules> findAllByProductformatId(int productformatId);

   // public List<NewpanelRules> findAllBy
}
