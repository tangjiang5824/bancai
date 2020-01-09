package yrd.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.BaseService;
import service.Upload_Data_Service;

@Service
public class Y_Upload_Data_Service extends BaseService {
    private Logger log = Logger.getLogger(Upload_Data_Service.class);

    @Transactional
    public void oldpanelAddData(String tableName,String oldpanelName,int length,String type,int width,
                                int number,String respo,String respoNum,String location,double weight,int userid){
        log.debug("yrd.service.Y_Upload_Data_Service.oldpanelAddData");

        jo.update("insert into "+tableName+"(oldpanelName,长,类型,宽,可用数量,库存数量,库存单位,仓库编号,存放位置,重量,uploadId) values(?,?,?,?,?,?,?,?,?,?,?)",
                oldpanelName,length,type,width,number,number,respo,respoNum,location,weight,userid);
        //return true;
    }


}
