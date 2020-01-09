package zzy.service;

import domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.QueryService;
import service.Upload_Data_Service;

@Service
public class Project_import_design_list_service extends BaseService{

    @Autowired
    private QueryService queryService;
    /*
     * 查询所有的building
     * */

    @Transactional
    public DataList findBuildingList(String projectName){
        String sql = "select buildingName from building_project_view where projectName = bancai1311";//+projectName;
        DataList namelist = queryService.query(sql);
        return namelist;
    }

}
