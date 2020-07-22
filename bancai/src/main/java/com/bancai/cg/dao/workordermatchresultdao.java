package com.bancai.cg.dao;

import com.bancai.cg.entity.WorkorderMatchresult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface workordermatchresultdao extends JpaRepository<WorkorderMatchresult,Integer>, JpaSpecificationExecutor<WorkorderMatchresult> {
}
