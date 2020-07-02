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
    @Autowired
    private storepositiondao storepositiondao;


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
            MaterialInfo material=null;
            //if(null!=jsonTemp.get("序号")) row_index=jsonTemp.get("序号")+"";
            if(org.json.JSONObject.NULL!=jsonTemp.get("品号")&&!jsonTemp.get("品号").equals(""))
            {
                material=materialinfodao.findById(Integer.valueOf(jsonTemp.get("品号")+"")).orElse(null);
                store.setMaterialInfo(material);
            }
          //  if(org.json.JSONObject.NULL!=jsonTemp.get("品名")&&!jsonTemp.get("品名").equals(""))  materialName=jsonTemp.get("品名")+"";
          //  if(org.json.JSONObject.NULL!=jsonTemp.get("规格")&&!jsonTemp.get("规格").equals(""))   specification=jsonTemp.get("规格")+"";
          //  if(org.json.JSONObject.NULL!=jsonTemp.get("库存单位")&&!jsonTemp.get("库存单位").equals(""))    inventoryUnit=jsonTemp.get("库存单位")+"";
            if(org.json.JSONObject.NULL!=jsonTemp.get("数量")&&!jsonTemp.get("数量").equals(""))   {
                store.setCount(Double.parseDouble(jsonTemp.get("数量")+""));
                store.setCountUse(Double.parseDouble(jsonTemp.get("数量")+""));
            }
            if((jsonTemp.get("行")!= org.json.JSONObject.NULL&&!jsonTemp.get("行").equals(""))) store.setRowNum(Integer.valueOf(jsonTemp.get("行")+""));
            if(jsonTemp.get("列")!= org.json.JSONObject.NULL&&!jsonTemp.get("列").equals(""))   store.setColumnNum(Integer.valueOf(jsonTemp.get("列")+""));
            if(org.json.JSONObject.NULL!=jsonTemp.get("仓库名称")&&!jsonTemp.get("仓库名称").equals(""))    store.setWarehouseName(jsonTemp.get("仓库名称")+"");
            if(org.json.JSONObject.NULL!=jsonTemp.get("总重")&&!jsonTemp.get("总重").equals("")) store.setTotalWeight(Double.parseDouble(jsonTemp.get("总重")+""));
           // if(org.json.JSONObject.NULL!=jsonTemp.get("横截面")&&!jsonTemp.get("横截面").equals(""))  width=jsonTemp.get("横截面")+"";


            materialstoredao.save(store);


            MaterialLogdetail logdetail=new MaterialLogdetail();
            logdetail.setCount(store.getCount());
            logdetail.setMaterialInfo(material);
            logdetail.setMaterialStore(store);
            logdetail.setMaterialLog(log);
            logdetail.setIsrollback(0);
            //插入log详细信息
            mateialLogdetaildao.save(logdetail);

        }
        return true;
    }


}
