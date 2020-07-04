package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialLog;
import com.bancai.cg.entity.MaterialLogdetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface mateialLogdetaildao extends JpaRepository<MaterialLogdetail,Integer>, JpaSpecificationExecutor<MaterialLogdetail> {

    public List<MaterialLogdetail> findByMaterialLog (MaterialLog log);
}
