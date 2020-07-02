package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface materialLogdao extends JpaRepository<MaterialLog,Integer>, JpaSpecificationExecutor<MaterialLog> {
}
