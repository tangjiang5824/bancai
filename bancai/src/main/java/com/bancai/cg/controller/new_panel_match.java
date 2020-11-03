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
import java.util.Optional;

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
    private materialTypedao materialTypedao;
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
        List<Match_result> pre_match_results=new ArrayList<>();
        for (int i=0;i<design_list.size();i++){
            Designlist designlist=design_list.get(i);
            //如果出现没有找到产品原材料，则不插入产品的原材料；

            //发生改变的store
            List<MaterialStore> storeList=new ArrayList<>();
            boolean flag=true;
            //如果出现相同的productId 则无需匹配，直接返回上次的结果
            if(designlist.getProductId()==pre_productId){
                for (Match_result result:pre_match_results) {
//                    MaterialInfo info=(MaterialInfo)list.get(0);
//                    materialstoredao.flush();
//                    List<MaterialStore> stores= materialstoredao.findAllByMaterialInfoAndCountUseGreaterThan(info,0.0);
//                    Double de_count=Double.parseDouble(String.valueOf(list.get(1)));
//                    if(!JPAObjectUtil.matchStoreByInfo(stores,de_count,isrollbacklist,designlist,info.getMaterialName(),storeList,session)){
//                        log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId());
//                        flag=false;
//                        break;
//                    }
//                }
                    Match_result match_result = new Match_result(result);
                    match_result.setDesignlistId(designlist.getId());
                    matchresultdao.save(match_result);
                    //匹配仓库中存在对应原材料
//                if(flag) {
//                    //插入match_result
//                    for(Match_result match_result:isrollbacklist){
//                        matchresultdao.save(match_result);
//                }
//                    //进行仓库数量扣减
//                    for (MaterialStore store:storeList){
//                        materialstoredao.save(store);
//                    }
//                    //修改designlist
//
//                }
                }
                    designlist.setMadeBy(4);
                    designlistdao.save(designlist);
                continue;
            }
            List<Match_result> isrollbacklist=new ArrayList<>();
            pre_match_results=new ArrayList<>();
            ProductInfo productInfo = productInfodao.findById(designlist.getProductId()).orElse(null);
            List<MaterialMatchRules> rules=null;
            if(productInfo.getSuffix()!=null&&productInfo.getSuffix().trim().length()!=0){
                rules=materialMatchRulesRepository.findAllByProductformatIdAndSuffix(productInfo.getProductFormatId().getId(),productInfo.getSuffix());
            }else
             rules=materialMatchRulesRepository.findAllByProductformatId(productInfo.getProductFormatId().getId());
            String type=productInfo.getProductFormatId().getProducttype().getClassification().getClassificationName();
            //通过规则进行匹配 需要放入工单
            List<List<Object>> list = JPAObjectUtil.NewPanelMatch(productInfo, type, rules);

            for (int j=0;j<list.size();j++){
                MaterialInfo info=(MaterialInfo) list.get(j).get(0);
                mysqlcondition condition=new mysqlcondition();
                Integer typeId=info.getTypeId().getId();
                if(info.getTypeId()==null) break;
                condition.and(new mysqlcondition("typeId","=",typeId));
                MaterialType materialType = materialTypedao.findById(typeId).orElse(null);
                Integer materialPrefix=materialType.getMaterialPrefix();

                if(info.getnValue()!=null&&info.getnValue()!=0) condition.and(new mysqlcondition("nValue","=",info.getnValue()));
                if(info.getmValue()!=null&&info.getmValue()!=0) condition.and(new mysqlcondition("mValue","=",info.getmValue()));
                if(info.getpValue()!=null&&info.getpValue()!=0) condition.and(new mysqlcondition("pValue","=",info.getpValue()));
                if(info.getaValue()!=null&&info.getaValue()!=0) condition.and(new mysqlcondition("aValue","=",info.getaValue()));
                if(info.getbValue()!=null&&info.getbValue()!=0) condition.and(new mysqlcondition("bValue","=",info.getbValue()));
                if(info.getOrientation()!=null) condition.and(new mysqlcondition("orientation","=",info.getOrientation()));
                DataList dataList=insertProjectService.findObjectId("material_info",condition);
                if(dataList.size()==0)  {
                    // log.error("匹配中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
                    MaterialInfo inf=new MaterialInfo();
                    inf.setTypeId(materialType);
                    inf.setnValue(info.getnValue());
                    inf.setmValue(info.getmValue());
                    inf.setpValue(info.getpValue());
                    inf.setaValue(info.getaValue());
                    inf.setbValue(info.getbValue());
                    inf.setOrientation(info.getOrientation());
                    String materialName=null;
                    String specification=null;
                    switch (materialPrefix){
                        //U板
                        case 301: materialName=info.getnValue()+" U铝膜板";
                        specification=info.getmValue()+"mm";
                        break;
                        case 302: materialName=info.getaValue()+"*"+info.getbValue()+" IC";
                        specification=info.getmValue()+"mm";
                        break;
                        default: materialName=info.getTypeId().getTypeName();
                    }
                    inf.setMaterialName(materialName);
                    inf.setSpecification(specification);
                    materialinfodao.save(inf);
                    inf.setPartNo(JPAObjectUtil.getPartNo(materialPrefix,typeId,inf.getMaterialid()));
                    info=inf;

                }else
                info=materialinfodao.findById(Integer.parseInt(dataList.get(0).get("id")+"")).orElse(null);
                /*------------------------------------
                上面通过匹配规则找到了materialinfo
                --------------------------------------
                 */

                Double de_count=Double.parseDouble(list.get(j).get(1).toString());
//                List<Object> temp=new ArrayList<>();
//                temp.add(info);
//                temp.add(de_count);
//                pre_match_results.add(temp);

                //材料匹配 直接插入materialinfo信息
                Match_result match_result=new Match_result();
                match_result.setDesignlistId(designlist.getId());
                match_result.setMatchId(info.getMaterialid());
                match_result.setName(dataList.get(0).get("materialName") + "");
                match_result.setMadeBy(4);
                match_result.setIsCompleteMatch(0);
                match_result.setCount(de_count);

                Match_result match_result_temp=new Match_result(match_result);
                pre_match_results.add(match_result_temp);
                isrollbacklist.add(match_result);
                //仓库匹配
//                List<MaterialStore> stores= materialstoredao.findAllByMaterialInfoAndCountUseGreaterThan(info,0.0);
//                if(!JPAObjectUtil.matchStoreByInfo(stores,de_count,isrollbacklist,designlist,dataList.get(0).get("materialName") + "",storeList,session)){
//                    log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
//                    flag=false;
//                    break;
//                }

            }
            if(flag) {
                for(Match_result match_result:isrollbacklist){
                    matchresultdao.save(match_result);
                }
//                for (MaterialStore store:storeList){
//                    materialstoredao.save(store);
//                }
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
