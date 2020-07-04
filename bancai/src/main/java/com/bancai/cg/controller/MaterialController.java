package com.bancai.cg.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;

import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.dao.*;
import com.bancai.cg.entity.*;

import com.bancai.domain.DataList;
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
    @Autowired
    private projectdao projectdao;
    @Autowired
    private buildingdao buildingdao;


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
        if(null!=userId)
        log.setUserId(Integer.parseInt(userId));
        log.setOperator(operator);
        log.setIsrollback(0);
        log.setType(0);
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

            if(null!=jsonTemp.get("materialId")&&!jsonTemp.get("materialId").equals(""))
            {
                material=materialinfodao.findById(Integer.valueOf(jsonTemp.get("materialId")+"")).orElse(null);
                store.setMaterialInfo(material);
            }
            if(null!=jsonTemp.get("warehouseName")&&!jsonTemp.get("warehouseName").equals(""))
            {
                warehousename=(jsonTemp.get("warehouseName")+"");
                store.setWarehouseName(warehousename);
            }

            if(null!=jsonTemp.get("count")&&!jsonTemp.get("count").equals(""))   {
                count=Double.parseDouble(jsonTemp.get("count")+"");
                store.setCount(count);
                store.setCountUse(count);
            }

            if(null!=jsonTemp.get("totalWeight")&&!jsonTemp.get("totalWeight").equals("")) {
                totalweight=(Double.parseDouble(jsonTemp.get("totalWeight")+""));
                store.setTotalWeight(totalweight);
            }

            Set<MaterialStore> materialStores = material.getMaterialStores();
            for(MaterialStore store1:materialStores){
                if(store1.getWarehouseName().equals(warehousename)){
                    store1.setCount(store1.getCount()+count);
                    store1.setCountUse(store1.getCountUse()+count);
                    store1.setTotalWeight(store1.getTotalWeight()+totalweight);
                    materialstoredao.save(store1);
                    logdetail.setMaterialStore(store1);
                    flag=false;
                    break;
                }
            }


            if(flag) materialstoredao.save(store);

            logdetail.setCount(store.getCount());
            logdetail.setMaterialInfo(material);
            logdetail.setMaterialLog(log);
            logdetail.setIsrollback(0);
            if (flag) logdetail.setMaterialStore(store);
            //插入log详细信息
            mateialLogdetaildao.save(logdetail);

        }
        return true;
    }

    //原材料仓库出库入库回滚
    //类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
    @RequestMapping(value = "/material/backMaterialstore.do")
    @Transactional
    public boolean backMaterialstore(Integer materiallogId,HttpSession session ,String operator,String type) throws Exception {
        MaterialLog log = materialLogdao.findById(materiallogId).orElse(null);
        MaterialLog log_bk=new MaterialLog();
        log_bk.setType(3);
        log_bk.setOperator(operator);
        log_bk.setIsrollback(1);
        log_bk.setTime(new Timestamp(new Date().getTime()));
        String userid = (String) session.getAttribute("userid");
        if(userid!=null)
        log_bk.setUserId(Integer.parseInt(userid));
        materialLogdao.save(log_bk);
        log.setIsrollback(1);
        materialLogdao.save(log);
        List<MaterialLogdetail> materiallogdetails = mateialLogdetaildao.findByMaterialLog(log);
        for(MaterialLogdetail detail:materiallogdetails){
            MaterialLogdetail newdetail=new MaterialLogdetail();
            MaterialStore materialStore = detail.getMaterialStore();
            materialStore.setCount(materialStore.getCount()-detail.getCount());
            materialStore.setCountUse(materialStore.getCountUse()-detail.getCount());
            materialstoredao.save(materialStore);
            newdetail.setIsrollback(1);
            newdetail.setMaterialStore(materialStore);
            newdetail.setCount(detail.getCount());
            newdetail.setMaterialLog(log_bk);
            newdetail.setMaterialInfo(detail.getMaterialInfo());
            mateialLogdetaildao.save(newdetail);
            detail.setIsrollback(1);
            mateialLogdetaildao.save(detail);
        }
        return true;
    }

    @RequestMapping("/material/backmaterial.do")
    @Transactional
    public boolean backMaterial(Integer materialId,Integer projectId,Integer buildingId,Double count,Double totalWeight,String operator,String warehouseName,HttpSession session){
            MaterialInfo material=materialinfodao.findById(materialId).orElse(null);
            Project project=projectdao.findById(projectId).orElse(null);
            Building building=buildingdao.findById(buildingId).orElse(null);
            MaterialLog log=new MaterialLog();
            String userid = (String) session.getAttribute("userid");
            if(userid!=null)
            log.setUserId(Integer.parseInt(userid));
            log.setTime(new Timestamp(new Date().getTime()));
            log.setIsrollback(1);
            log.setOperator(operator);
            //2 退库
            log.setType(2);
            log.setProject(project);
            log.setBuilding(building);
            materialLogdao.save(log);
            MaterialStore store=materialstoredao.findByMaterialInfoAndWarehouseName(material,warehouseName);
            MaterialLogdetail logdetail=new MaterialLogdetail();
            logdetail.setIsrollback(1);
            logdetail.setMaterialInfo(material);
            logdetail.setMaterialLog(log);
            logdetail.setCount(count);
            if(null!=store){
                store.setCount(store.getCount()+count);
                store.setCountUse(store.getCountUse()+count);
                store.setTotalWeight(store.getTotalWeight()+totalWeight);

            }else {
                store.setCountUse(count);
                store.setCount(count);
                store.setWarehouseName(warehouseName);
                store.setTotalWeight(totalWeight);
                store.setMaterialInfo(material);
            }
            materialstoredao.save(store);
            logdetail.setMaterialStore(store);
            mateialLogdetaildao.save(logdetail);

        return true;
    }


}
