package com.bancai.cg.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;

import com.bancai.cg.entity.MaterialInfo;

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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
public class MaterialController {

    //JPA dao
    @Autowired
    private com.bancai.cg.dao.materialinfodao materialinfodao;


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

        return JSONArray.toJSONString(Arrays.asList(list));
    }


}
