package com.bancai.cg.dao;

import com.bancai.cg.entity.Storeposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface storepositiondao extends JpaRepository<Storeposition,Integer>, JpaSpecificationExecutor<Storeposition> {
}
