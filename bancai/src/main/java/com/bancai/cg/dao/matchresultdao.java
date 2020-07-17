package com.bancai.cg.dao;


import com.bancai.cg.entity.Match_result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface matchresultdao extends JpaRepository<Match_result,Integer>, JpaSpecificationExecutor<Match_result> {
}
