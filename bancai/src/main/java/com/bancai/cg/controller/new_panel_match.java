package com.bancai.cg.controller;

import com.bancai.cg.dao.*;
import com.bancai.cg.entity.*;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.JPAObjectUtil;
import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.db.mysqlcondition;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class new_panel_match {
    @Autowired
    private designlistdao designlistdao;
    @Autowired
    private productInfodao productInfodao;
    @Autowired
    private MaterialMatchRulesRepository materialMatchRulesRepository;
    @Autowired
    private MaterialMatchResultRepository materialMatchResultRepository;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private materialinfodao materialinfodao;
    @Autowired
    private materialstoredao materialstoredao;
    @Autowired
    private matchresultdao matchresultdao;
    @Autowired
    private EntityManagerFactory entityManagerFactory;


    private Logger log = Logger.getLogger(new_panel_match.class);

    @Transactional(rollbackFor = Exception.class)
    public  void match( int projectId, int buildingId, int buildingpositionId) throws ScriptException {
        Session session=getSession();
        List<Designlist> design_list =designlistdao.findAllByMadeByAndProjectIdAndBuildingIdAndBuildingpositionIdOrderByProductId(0,projectId,buildingId,buildingpositionId);
        int pre_productId=0;
        List<List<Object>> pre_match_results=new ArrayList<>();
        for (int i=0;i<design_list.size();i++){
            Designlist designlist=design_list.get(i);
            //如果出现没有找到产品原材料，则不插入产品的原材料；
            List<Match_result> isrollbacklist=new ArrayList<>();
            //发生改变的store
            List<MaterialStore> storeList=new ArrayList<>();
            boolean flag=true;
            //如果出现相同的productId 则无需匹配，直接返回上次的结果
            if(designlist.getProductId()==pre_productId){
                for (List<Object> list:pre_match_results){
                    MaterialInfo info=(MaterialInfo)list.get(0);
                    materialstoredao.flush();
                    List<MaterialStore> stores= materialstoredao.findAllByMaterialInfoAndCountUseGreaterThan(info,0.0);
                    Double de_count=Double.parseDouble(String.valueOf(list.get(1)));
                    if(!JPAObjectUtil.matchStoreByInfo(stores,de_count,isrollbacklist,designlist,info.getMaterialName(),storeList,session)){
                        log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId());
                        flag=false;
                        break;
                    }
                }
                if(flag) {
                    for(Match_result match_result:isrollbacklist){
                        matchresultdao.save(match_result);
                    }
                    for (MaterialStore store:storeList){
                        materialstoredao.save(store);
                    }
                    designlist.setMadeBy(4);
                    designlistdao.save(designlist);
                }
                continue;
            }
            pre_match_results=new ArrayList<>();
            ProductInfo productInfo = productInfodao.findById(designlist.getProductId()).orElse(null);
            List<MaterialMatchRules> rules=null;
            if(productInfo.getSuffix()!=null&&productInfo.getSuffix().trim().length()!=0){
                rules=materialMatchRulesRepository.findAllByProductformatIdAndSuffix(productInfo.getProductFormatId().getId(),productInfo.getSuffix());
            }else
             rules=materialMatchRulesRepository.findAllByProductformatId(productInfo.getProductFormatId().getId());
            String type=productInfo.getProductFormatId().getProducttype().getClassification().getClassificationName();
            List<List<Object>> list = JPAObjectUtil.NewPanelMatch(productInfo, type, rules);


            for (int j=0;j<list.size();j++){
                MaterialInfo info=(MaterialInfo) list.get(j).get(0);
                mysqlcondition condition=new mysqlcondition();
                if(info.getTypeId()!=null) condition.and(new mysqlcondition("typeId","=",info.getTypeId().getId()));
                if(info.getnValue()!=null&&info.getnValue()!=0) condition.and(new mysqlcondition("nValue","=",info.getnValue()));
                if(info.getmValue()!=null&&info.getmValue()!=0) condition.and(new mysqlcondition("mValue","=",info.getmValue()));
                if(info.getpValue()!=null&&info.getpValue()!=0) condition.and(new mysqlcondition("pValue","=",info.getpValue()));
                if(info.getaValue()!=null&&info.getaValue()!=0) condition.and(new mysqlcondition("aValue","=",info.getaValue()));
                if(info.getbValue()!=null&&info.getbValue()!=0) condition.and(new mysqlcondition("bValue","=",info.getbValue()));
                if(info.getOrientation()!=null) condition.and(new mysqlcondition("orientation","=",info.getOrientation()));
                DataList dataList=insertProjectService.findObjectId("material_info",condition);
                if(dataList.size()==0)  {
                    log.error("匹配中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
                    flag=false;
                    break;
                }
                info=materialinfodao.findById(Integer.parseInt(dataList.get(0).get("id")+"")).orElse(null);
                List<MaterialStore> stores= materialstoredao.findAllByMaterialInfoAndCountUseGreaterThan(info,0.0);
                Double de_count=Double.parseDouble(list.get(j).get(1).toString());
                List<Object> temp=new ArrayList<>();
                temp.add(info);
                temp.add(de_count);
                pre_match_results.add(temp);
//                int k=0;
//                while (de_count>0){
//                    if(stores==null||stores.get(k)==null){
//                        log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
//                        flag=false;
//                        break;
//                    }
//                    MaterialStore store=stores.get(k++);
//                    Match_result match_result = new Match_result();
//                    match_result.setDesignlistId(designlist.getId());
//                    match_result.setMatchId(store.getId());
//                    match_result.setName(dataList.get(0).get("materialName") + "");
//                    match_result.setIsCompleteMatch(1);
//                    if(store.getCountUse()>=de_count){
//                        match_result.setCount(de_count);
//                        // match_result.setMaterialName(dataList.get(0).get("materialName") + "");
//                        // match_result.setOrigin("3");
//                        store.setCountUse(store.getCountUse()-de_count);
//                        de_count=0.0;
//                    }else {
//                        match_result.setCount(store.getCountUse());
//                        de_count-=store.getCountUse();
//                        store.setCountUse(0.0);
//                    }
//                    isrollbacklist.add(match_result);
//                    materialstoredao.save(store);
//                }

                if(!JPAObjectUtil.matchStoreByInfo(stores,de_count,isrollbacklist,designlist,dataList.get(0).get("materialName") + "",storeList,session)){
                    log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
                    flag=false;
                    break;
                }

            }
            if(flag) {
                for(Match_result match_result:isrollbacklist){
                    matchresultdao.save(match_result);
                }
                for (MaterialStore store:storeList){
                    materialstoredao.save(store);
                }
                pre_productId=designlist.getProductId();
                designlist.setMadeBy(4);
                designlistdao.save(designlist);
            }


        }

    }


    @RequestMapping("/material/cg/test")
    public void test() throws ScriptException {
      // match();
    }


    public Session getSession() {
        return entityManagerFactory.unwrap(SessionFactory.class).openSession();
    }
}
