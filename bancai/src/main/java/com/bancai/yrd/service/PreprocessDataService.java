package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.AnalyzeNameService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;

@Service
public class PreprocessDataService extends BaseService{
    private Logger log = Logger.getLogger(PreprocessDataService.class);
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private AnalyzeNameService AnalyzeNameService;
    @Autowired
    private InsertProjectService insertProjectService;

    /**
     * 添加数据,返回添加的产品id
     */
    @Transactional
    public int preprocessInbound(String productName, String warehouseName, String count) {
        String[] info = AnalyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("preprocessUpload===productId=" + productId);
        if (productId == 0) {
            return 0;
        }
        preprocessSaveData(info, warehouseName, count);
        return productId;
    }

    private void preprocessSaveData(String[] info, String warehouseName, String count){
        //id,unitWeight,unitArea
//        if(Double.parseDouble(info[1])!=0)
        info[1] = String.valueOf(Double.parseDouble(info[1])*Integer.parseInt(count));
//        if(Double.parseDouble(info[2])!=0)
        info[2] = String.valueOf(Double.parseDouble(info[2])*Integer.parseInt(count));
        String sql = "select * from preprocess_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            insertProjectService.insertDataToTable("insert into preprocess_store " +
                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,info[2], info[1]);
        } else {
            String sql2 = "update preprocess_store set countUse=countUse+"+count+
                    ",countStore=countStore+"+count+",totalArea=totalArea+"+ info[2] +
                    ",totalWeight=totalWeight+"+info[1]+
                    " where id="+queryList.get(0).get("id").toString();
            jo.update(sql2);
        }
    }


}
