package com.bancai.yrd.controller;

import com.bancai.commonMethod.NewCondition;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.service.TableService;
import com.bancai.vo.WebResponse;
import com.bancai.yrd.service.OldpanelDataService;

@RestController
public class LogDataController {

    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private OldpanelDataService oldpanel_Data_Service;

    Logger log=Logger.getLogger(LogDataController.class);

    /**
     * 根据tableName查Log表
     * @param start,limit,uploadUser,projectName,startTime,endTime,tableName
     */
    @RequestMapping(value="/log/findItemLog.do")
    public WebResponse materialFindLog(Integer start, Integer limit, String uploadUser, String projectName,
                                          String startTime, String endTime, String tableName){
        log.debug("search["+tableName+"]uploadUser:"+uploadUser+"==projectName:"+projectName+"==startTime:"+startTime+"==endTime:"+endTime);

        //根据输入的数据查询
        //DataList dataList = testAddService.findList(proName);
        //查询字段不为空
        if((uploadUser !=null)||(projectName !=null)||(startTime !=null)||(endTime !=null)){
            NewCondition c=new NewCondition();
            if (uploadUser.length() != 0) {
                DataList userList = queryService.query("select id from user where username=?", uploadUser);
                String userId = String.valueOf(userList.get(0).get("id"));
                if (userId == null){
                    userId = "";
                }
                c.and(new NewCondition("userId", "=", userId));
            }
            if (projectName.length() != 0){
                DataList projectList = queryService.query("select id from project where projectName=?", projectName);
                String projectId = String.valueOf(projectList.get(0).get("id"));
                if (projectId == null){
                    projectId = "";
                }
                c.and(new NewCondition("projectId", "=", projectId));
            }
            if(startTime.length() != 0){
                c.and(new NewCondition("time", ">=", startTime));
            }
            if (endTime.length() != 0){
                c.and(new NewCondition("time", "<=", endTime));
            }
            //调用函数，查询满足条件的所有数据
            return queryService.queryPage(start, limit, c, tableName);
        }
        return queryService.queryPage(start,limit,"select * from " + tableName);
    }

}
