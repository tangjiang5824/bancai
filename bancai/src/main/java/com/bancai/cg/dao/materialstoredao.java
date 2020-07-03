package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.MaterialStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;



public interface materialstoredao extends JpaRepository<MaterialStore,Integer>, JpaSpecificationExecutor<MaterialStore> {
}
