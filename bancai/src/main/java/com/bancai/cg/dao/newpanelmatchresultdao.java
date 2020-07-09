package com.bancai.cg.dao;

import com.bancai.cg.entity.Newpanelmateriallist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface newpanelmatchresultdao extends JpaRepository<Newpanelmateriallist,Integer>, JpaSpecificationExecutor<Newpanelmateriallist> {
}
