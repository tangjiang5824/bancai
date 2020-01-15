package zzy.service;

import domain.DataList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.QueryService;

@Service
public class Select_specification_from_materialName_service extends BaseService{

    @Autowired
    private QueryService queryService;

    /*
     * 查询所有的materialbasicinfo
     * */

    @Transactional
    public DataList findMaterialbasicinfo_SpecificationList(String materialName){
        String sql = "select specification from materialbasicinfo where materialName = '"+materialName+"'";
        DataList list = queryService.query(sql);
        return list;
    }


}
