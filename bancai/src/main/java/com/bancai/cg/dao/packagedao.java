package com.bancai.cg.dao;

import com.bancai.cg.entity.MyPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface packagedao extends JpaRepository<MyPackage,Integer>, JpaSpecificationExecutor<MyPackage> {
}