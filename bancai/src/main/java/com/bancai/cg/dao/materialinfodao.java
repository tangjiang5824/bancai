package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface materialinfodao extends JpaRepository<MaterialInfo,Integer>, JpaSpecificationExecutor<MaterialInfo> {

}
