package com.bancai.cg.dao;

import com.bancai.cg.entity.Designlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface designlistdao extends JpaRepository<Designlist,Integer>, JpaSpecificationExecutor<Designlist> {
    public List<Designlist> findAllByMadeByAndProjectIdAndBuildingIdAndBuildingpositionIdOrderByProductId(int madeBy,int projectId,int buildingId,int buildingpositionId);
}
