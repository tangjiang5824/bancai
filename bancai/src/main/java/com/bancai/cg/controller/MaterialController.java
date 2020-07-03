package com.bancai.cg.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;

import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.dao.*;
import com.bancai.cg.entity.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class MaterialController {

    //JPA dao
    @Autowired
    private materialinfodao materialinfodao;
    @Autowired
    private materialstoredao materialstoredao;
    @Autowired
    private materialLogdao materialLogdao;
    @Autowired
    private mateialLogdetaildao mateialLogdetaildao;
//    @Autowired
//    private storepositiondao storepositiondao;


    //向materialtype原材料类型表插入
    //
    @RequestMapping(value = "/material/insertIntoMaterialType.do")
    @Transactional
    public boolean insertToMaterialType(String s) throws JSONException {
        List<MaterialInfo> list =JSONArray.parseArray(s,MaterialInfo.class);
        for (int i = 0; i <list.size() ; i++) {
            materialinfodao.save(list.get(i));
        }
        return true;
    }

    @RequestMapping(value = "/material/findmaterialinfobycondition.do")
    @Transactional
    public String findMaterialInfo(String materialName,Integer width,String specification,Double unitWeight,String inventoryUnit,String page,String start,String limit){

        Specification<MaterialInfo> spec = new Specification<MaterialInfo>() {
            @Override
            public Predicate toPredicate(Root<MaterialInfo> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                 List<Predicate> condition=new ArrayList<>();
                if(materialName!=null&&materialName.trim().length()!=0)
                    condition.add(criteriaBuilder.equal(root.get("materialName").as(String.class),materialName));
                if(width!=null)
                    condition.add(criteriaBuilder.equal(root.get("width").as(Integer.class),width));
                if(unitWeight!=null)
                    condition.add(criteriaBuilder.equal(root.get("unitWeight").as(Double.class),unitWeight));
                if(specification!=null&&specification.trim().length()!=0)
                    condition.add(criteriaBuilder.equal(root.get("specification").as(String.class),specification));
                if(inventoryUnit!=null&&inventoryUnit.trim().length()!=0)
                    condition.add(criteriaBuilder.equal(root.get("inventoryUnit").as(String.class),inventoryUnit));
                return criteriaBuilder.and(condition.toArray(new Predicate[condition.size()]));
            }
        };

        Pageable pageable=PageRequest.of(Integer.parseInt(page)-1,Integer.parseInt(limit));
        Page<MaterialInfo> page1=materialinfodao.findAll(spec,pageable);
        List<MaterialInfo> list= page1.getContent();
        JSONArray array=new JSONArray(Arrays.asList(list));
        JSONObject object=new JSONObject();
        object.put("totalcount",page1.getTotalElements());
        object.put("material_info",array.get(0));
        //JSONArray.toJSONString(Arrays.asList(list));
        return object.toJSONString();
    }

    /*
     * 录入单个原材料数据
     * 入库
     *
     * */
    @RequestMapping(value="/material/addData.do")
    @Transactional
    public boolean addMaterialData(String s, String tableName,String operator, HttpSession session) throws Exception {

        JSONArray jsonArray =JSONArray.parseArray(s);
        String userId = (String)session.getAttribute("userid");
        MaterialLog log=new MaterialLog();
        //入库记录sql
        Date date=new Date();
        log.setUserId(Integer.parseInt(userId));
        log.setOperator(operator);
        log.setIsrollback(0);
        log.setTime((new Timestamp(date.getTime())));
        materialLogdao.save(log);
        for(int i=0;i< jsonArray.size();i++) {
            JSONObject jsonTemp=jsonArray.getJSONObject(i);
            MaterialStore store=new MaterialStore();
            MaterialLogdetail logdetail=new MaterialLogdetail();
            MaterialInfo material=null;
            String warehousename=null;
            Double totalweight=0.0;
            Double count=0.0;
            boolean flag=true;

            if(null!=jsonTemp.get("品号")&&!jsonTemp.get("品号").equals(""))
            {
                material=materialinfodao.findById(Integer.valueOf(jsonTemp.get("品号")+"")).orElse(null);
                store.setMaterialInfo(material);
            }
            if(null!=jsonTemp.get("仓库名称")&&!jsonTemp.get("仓库名称").equals(""))
            {
                warehousename=(jsonTemp.get("仓库名称")+"");
                store.setWarehouseName(warehousename);
            }

            if(null!=jsonTemp.get("数量")&&!jsonTemp.get("数量").equals(""))   {
                count=Double.parseDouble(jsonTemp.get("数量")+"");
                store.setCount(count);
                store.setCountUse(count);
            }

            if(null!=jsonTemp.get("总重")&&!jsonTemp.get("总重").equals("")) {
                totalweight=(Double.parseDouble(jsonTemp.get("总重")+""));
                store.setTotalWeight(totalweight);
            }

            Set<MaterialStore> materialStores = material.getMaterialStores();
            for(MaterialStore store1:materialStores){
                if(store1.getWarehouseName()==warehousename){
                    store1.setCount(store1.getCount()+count);
                    store1.setCountUse(store1.getCountUse()+count);
                    store1.setTotalWeight(store1.getTotalWeight()+totalweight);
                    materialstoredao.save(store1);
                    flag=false;
                    break;
                }
            }


            if(flag) materialstoredao.save(store);

            logdetail.setCount(store.getCount());
            logdetail.setMaterialInfo(material);
            logdetail.setMaterialLog(log);
            logdetail.setIsrollback(0);
            //插入log详细信息
            mateialLogdetaildao.save(logdetail);

        }
        return true;
    }


}
