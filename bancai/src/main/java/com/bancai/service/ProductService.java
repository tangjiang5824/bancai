package com.bancai.service;

import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService extends BaseService{

    private Logger log = Logger.getLogger(Upload_Data_Service.class);
    @Autowired
    private QueryService queryService;

    @Transactional
    public DataList findProductIdByName(String Length, String Type, String Width){

        DataList dataList = queryService.query(
                "select * from product where 长=? and 类型=? and 宽=?",
                Length, Type, Width);
        return dataList;
    }
}
