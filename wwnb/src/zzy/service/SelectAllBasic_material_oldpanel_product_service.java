package zzy.service;

import domain.DataList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.QueryService;
import util.Excel;
import vo.UploadDataResult;

import java.io.IOException;
import java.io.InputStream;

@Service
public class SelectAllBasic_material_oldpanel_product_service extends BaseService{

    @Autowired
    private QueryService queryService;

    /*
     * 查询所有的materialbasicinfo
     * */

    @Transactional
    public DataList findMaterialbasicinfoList(String tablename){
        String sql = "select * from materialbasicinfo where 1=1";//projectName = '"+tablename+"'";
        DataList list = queryService.query(sql);
        return list;
    }
    /*
     * 查询所有的oldpanelbasicinfo
     * */

    @Transactional
    public DataList findOldpanelbasicinfoList(String tablename){
        String sql = "select * from oldpanelbasicinfo where 1=1";//projectName = '"+tablename+"'";
        DataList list = queryService.query(sql);
        return list;
    }
    /*
     * 查询所有的productbasicinfo
     * */

    @Transactional
    public DataList findProductbasicinfoList(String tablename){
        String sql = "select * from productbasicinfo where 1=1";//projectName = '"+tablename+"'";
        DataList list = queryService.query(sql);
        return list;
    }


}
