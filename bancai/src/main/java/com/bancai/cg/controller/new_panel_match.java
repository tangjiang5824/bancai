package com.bancai.cg.controller;

import com.bancai.cg.dao.*;
import com.bancai.cg.entity.*;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.JPAObjectUtil;
import com.bancai.domain.DataList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bancai.db.mysqlcondition;

import javax.script.ScriptException;
import java.util.List;

@RestController
public class new_panel_match {
    @Autowired
    private designlistdao designlistdao;
    @Autowired
    private productInfodao productInfodao;
    @Autowired
    private newpanelrulesdao newpanelrulesdao;
    @Autowired
    private InsertProjectService insertProjectService;
    @Autowired
    private materialinfodao materialinfodao;
    @Autowired
    private newpanelmatchresultdao newpanelmatchresultdao;

    private Logger log = Logger.getLogger(new_panel_match.class);

    @Transactional
    public void match() throws ScriptException {
        List<Designlist> design_list =designlistdao.findAllByMadeBy(0);
        for (int i=0;i<design_list.size();i++){
            Designlist designlist=design_list.get(i);
            ProductInfo productInfo = productInfodao.findById(designlist.getProductId()).orElse(null);
            List<NewpanelRules> rules=newpanelrulesdao.findAllByProductId(productInfo.getId());
            String type=productInfo.getProductType().getClassification().getClassificationName();
            List<List<Object>> list = JPAObjectUtil.NewPanelMatch(productInfo, type, rules);
            for (int j=0;j<list.size();j++){
                MaterialInfo info=(MaterialInfo) list.get(j).get(0);
                mysqlcondition condition=new mysqlcondition();
                if(info.getTypeId()!=null) condition.and(new mysqlcondition("typeId","=",info.getTypeId().getId()));
                if(info.getnValue()!=null) condition.and(new mysqlcondition("nValue","=",info.getnValue()));
                if(info.getmValue()!=null) condition.and(new mysqlcondition("mValue","=",info.getmValue()));
                if(info.getpValue()!=null) condition.and(new mysqlcondition("pValue","=",info.getpValue()));
                if(info.getaValue()!=null) condition.and(new mysqlcondition("aValue","=",info.getaValue()));
                if(info.getbValue()!=null) condition.and(new mysqlcondition("bValue","=",info.getbValue()));
                if(info.getOrientation()!=null) condition.and(new mysqlcondition("orientation","=",info.getOrientation()));
                DataList dataList=insertProjectService.findObjectId("material_info",condition);
                if(dataList.size()==0) {
                    log.error("没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());

                }
                //info=materialinfodao.findById(Integer.parseInt(dataList.get(0).get("id")+"")).orElse(null);
                Newpanelmateriallist newpanelmateriallist=new Newpanelmateriallist();
                newpanelmateriallist.setDesignlistId(designlist.getId());
                newpanelmateriallist.setMaterialId(Integer.parseInt(dataList.get(0).get("id")+""));
                newpanelmateriallist.setMaterialCount(Double.parseDouble(list.get(j).get(1).toString()));
                newpanelmateriallist.setMaterialName(dataList.get(0).get("materialName")+"");
                newpanelmatchresultdao.save(newpanelmateriallist);
            }
        }

    }


    @RequestMapping("/material/cg/test")
    public void test() throws ScriptException {
        match();
    }
}
