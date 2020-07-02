package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.MaterialStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;


@Component
public interface materialstoredao extends JpaRepository<MaterialStore,Long>, JpaSpecificationExecutor<MaterialStore> {
}
