package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.MaterialStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import java.util.List;


public interface materialstoredao extends JpaRepository<MaterialStore,Integer>, JpaSpecificationExecutor<MaterialStore> {
    public MaterialStore findByMaterialInfoAndWarehouseName(MaterialInfo materialInfo,String warehouseName);

    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public List<MaterialStore> findAllByMaterialInfoAndCountUseGreaterThan(MaterialInfo info,Double i);
}
