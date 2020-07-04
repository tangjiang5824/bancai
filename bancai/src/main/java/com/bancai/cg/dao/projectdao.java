package com.bancai.cg.dao;

import com.bancai.cg.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface projectdao extends JpaRepository<Project,Integer>, JpaSpecificationExecutor<Project> {
}
