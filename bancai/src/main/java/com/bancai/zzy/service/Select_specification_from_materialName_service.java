package com.bancai.zzy.service;

import com.bancai.domain.DataList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.service.QueryService;

@Service
public class Select_specification_from_materialName_service extends BaseService{

    @Autowired
    private QueryService queryService;

    /*
     * 查询所有的materialbasicinfo
     * */

    @Transactional
    public DataList findMaterial_SpecificationList(String materialName){
        String sql = "select specification from material where materialName = '"+materialName+"'";
        DataList list = queryService.query(sql);
        return list;
    }


}
