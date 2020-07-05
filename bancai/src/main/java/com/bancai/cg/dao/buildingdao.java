package com.bancai.cg.dao;

import com.bancai.cg.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface buildingdao extends JpaRepository<Building,Integer>, JpaSpecificationExecutor<Building> {
}
