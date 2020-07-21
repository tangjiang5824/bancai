package com.bancai.cg.dao;


import com.bancai.cg.entity.WorkorderLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface workorderlogdao extends JpaRepository<WorkorderLog,Integer>, JpaSpecificationExecutor<WorkorderLog> {
}
