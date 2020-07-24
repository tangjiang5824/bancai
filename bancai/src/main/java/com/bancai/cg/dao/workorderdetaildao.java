package com.bancai.cg.dao;

import com.bancai.cg.entity.WorkorderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface workorderdetaildao extends JpaRepository<WorkorderDetail,Integer>, JpaSpecificationExecutor<WorkorderDetail> {
    public List<WorkorderDetail> findAllByWorkorderlogId(int workorderlogId);
}
