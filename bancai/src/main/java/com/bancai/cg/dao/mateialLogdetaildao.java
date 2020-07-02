package com.bancai.cg.dao;

import com.bancai.cg.entity.MaterialLogdetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface mateialLogdetaildao extends JpaRepository<MaterialLogdetail,Integer>, JpaSpecificationExecutor<MaterialLogdetail> {
}
