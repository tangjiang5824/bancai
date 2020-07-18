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
public class BackproductDataService extends BaseService{
    private Logger log = Logger.getLogger(BackproductDataService.class);
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
    public int[] backProduct(String productName, String warehouseName, String count) {
        String[] info = AnalyzeNameService.isInfoExistBackUnit("product", productName);
        //id,unitWeight,unitArea
        int productId = Integer.parseInt(info[0]);
        System.out.println("backproductUpload===productId=" + productId);
        if (productId == 0) {
            return new int[]{0,0};
        }
        int backproductstoreId = backproductSaveData(info, warehouseName, count);
        return new int[]{productId,backproductstoreId};
    }

    private int backproductSaveData(String[] info, String warehouseName, String countNum){
        //id,unitWeight,unitArea
        int con = 0;
        String count = String.valueOf(Double.parseDouble(countNum));
        if((info[1]!=null)&&(!info[1].equals("")))
            info[1] = String.valueOf(Double.parseDouble(info[1])*Double.parseDouble(count));
        else {
            info[1] = null;
            con += 1;
        }
        if((info[2]!=null)&&(!info[2].equals("")))
            info[2] = String.valueOf(Double.parseDouble(info[2])*Double.parseDouble(count));
        else {
            info[2]=null;
            con += 10;
        }
        String sql = "select * from backproduct_store where productId=? and warehouseName=?";
        DataList queryList = queryService.query(sql,info[0],warehouseName);
        if(queryList.isEmpty()){
            return insertProjectService.insertDataToTable("insert into backproduct_store " +
                            "(productId,countUse,countStore,warehouseName,totalArea,totalWeight) values (?,?,?,?,?,?)",
                    info[0],count,count,warehouseName,info[2], info[1]);
        } else {
            String sql2 = "update backproduct_store set countUse=countUse+" + count + ",countStore=countStore+" + count;

            switch (con) {
                case 0:
                    sql2 = sql2 + ",totalArea=totalArea+" + info[2] + ",totalWeight=totalWeight+" + info[1];
                    break;
                case 1:
                    sql2 = sql2 + ",totalArea=totalArea+" + info[2];
                    break;
                case 10:
                    sql2 = sql2 + ",totalWeight=totalWeight+" + info[1];
                    break;
                case 11:
                default:
                    break;
            }
            sql2 = sql2 + " where id=" + queryList.get(0).get("id").toString();
            jo.update(sql2);
            return Integer.parseInt(queryList.get(0).get("id").toString());
        }
    }

}
