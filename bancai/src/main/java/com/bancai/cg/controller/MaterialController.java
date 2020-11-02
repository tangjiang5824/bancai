package com.bancai.cg.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.dao.*;
import com.bancai.cg.entity.*;
import com.bancai.cg.service.InsertProjectService;
import com.bancai.cg.util.JPAObjectUtil;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.db.mysqlcondition;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.bancai.vo.WebResponse;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpSession;
import java.io.Serializable;
import java.sql.Timestamp;
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
    @Autowired
    private materialTypedao materialTypedao;
    @Autowired
    private MaterialMatchRulesRepository materialMatchRulesRepository;
    @Autowired
    private QueryAllService queryAllService;
    @Autowired
    private InsertProjectService insertProjectService;


    //向materialtype原材料类型表插入
    //
    @RequestMapping(value = "/material/insertIntoMaterialType.do")
    @Transactional
    public boolean insertToMaterialType(String s) throws JSONException {
        List<MaterialInfo_trans> list =JSONArray.parseArray(s,MaterialInfo_trans.class);
        for (int i = 0; i <list.size() ; i++) {
            MaterialInfo_trans info_trans=list.get(i);
            MaterialInfo info=new MaterialInfo();
            info.setOrientation(info_trans.getOrientation());
            info.setnValue(info_trans.getNValue());
            info.setmValue(info_trans.getMValue());
            info.setpValue(info_trans.getPValue());
            info.setaValue(info_trans.getAValue());
            info.setbValue(info_trans.getBValue());
            info.setInventoryUnit(info_trans.getInventoryUnit());
            info.setMaterialName(info_trans.getMaterialName());
            info.setUnitWeight(info_trans.getUnitWeight());
            info.setTypeId(materialTypedao.findById(info_trans.getTypeId()).orElse(null));
            materialinfodao.save(info);
            Integer prefix=info.getTypeId().getMaterialPrefix();
            Integer type=info.getTypeId().getId();
            Integer id=info.getMaterialid();
            String partNo=getPartNo(prefix,type,id);
            info.setPartNo(partNo);
            materialinfodao.save(info);
        }
        return true;
    }
    //3+2+4
    private static String getPartNo(Integer prefix, Integer type, Integer id) {
        String type1= String.valueOf(type+100);
        String type2=type1.substring(type1.length()-2);
        String id1= String.valueOf(id+10000);
        String id2=id1.substring(id1.length()-4);
        String partNo=prefix+type2+id2;
        return partNo;
    }

    //public boolean



    @RequestMapping(value = "/material/findmaterialinfobycondition.do")
    @Transactional
    public WebResponse findMaterialInfo(String materialName, Integer typeId, Double unitWeight, String inventoryUnit, Integer start, Integer limit){

//        Specification<MaterialInfo> spec = new Specification<MaterialInfo>() {
//            @Override
//            public Predicate toPredicate(Root<MaterialInfo> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
//                 List<Predicate> condition=new ArrayList<>();
//                if(materialName!=null&&materialName.trim().length()!=0)
//                    condition.add(criteriaBuilder.equal(root.get("materialName").as(String.class),materialName));
////                if(width!=null)
////                    condition.add(criteriaBuilder.equal(root.get("width").as(Integer.class),width));
//                if(typeId!=null){
//                    condition.add(criteriaBuilder.equal(root.join("typeId").get("id"),typeId));
//                }
//                if(unitWeight!=null)
//                    condition.add(criteriaBuilder.equal(root.get("unitWeight").as(Double.class),unitWeight));
//
//                if(inventoryUnit!=null&&inventoryUnit.trim().length()!=0)
//                    condition.add(criteriaBuilder.equal(root.get("inventoryUnit").as(String.class),inventoryUnit));
//                return criteriaBuilder.and(condition.toArray(new Predicate[condition.size()]));
//            }
//        };
//
//        Pageable pageable=PageRequest.of(Integer.parseInt(page)-1,Integer.parseInt(limit));
//        Page<MaterialInfo> page1=materialinfodao.findAll(spec,pageable);
//        List<MaterialInfo> list= page1.getContent();
//    //    JSONArray array=new JSONArray(Arrays.asList(list));
//        List<Map> rlist=new ArrayList<>();
//        for (int i=0;i<list.size();i++){
//            Map<String,Object> map=JSONObject.parseObject(JSONObject.toJSONString(list.get(i)), HashMap.class);
//            map.put("typeName",list.get(i).getTypeId().getTypeName());
//            rlist.add(map);
//        }
//        JSONObject object=new JSONObject();
//        object.put("totalCount",list.size());
//        object.put("material_info",rlist);
//        return object.toJSONString();
        mysqlcondition c=new mysqlcondition();
        if (null!=materialName&&materialName.length()!=0) {
            c.and(new mysqlcondition("materialName", "=", materialName));
        }
        if (typeId!=null) {
            c.and(new mysqlcondition("typeId", "=", typeId));
        }
        if (null!=inventoryUnit&&inventoryUnit.length()!=0) {
            c.and(new mysqlcondition("inventoryUnit", "=", inventoryUnit));
        }
        return queryAllService.queryDataPage(start, limit, c, "material_info_view");
    }

    /*
     * 录入原材料数据
     * 入库
     *
     * */
    @RequestMapping(value="/material/addData.do",method = {RequestMethod.POST,RequestMethod.GET})
    @Transactional
    @ApiOperation("增加原材料信息")
    public WebResponse addMaterialData(String s,@ApiParam("入库人") Integer operator, HttpSession session) throws Exception {
        WebResponse response=new WebResponse();
        JSONArray jsonArray =JSONArray.parseArray(s);
        if(jsonArray.size()==0){
            response.setErrorCode(100);
            response.setSuccess(false);
            response.setMsg("未输入原材料入库数据！");
            return response;
        }
        if(operator==null){
            response.setErrorCode(200);
            response.setSuccess(false);
            response.setMsg("请选择入库人！");
            return response;
        }
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
            String description=null;
            Double totalArea=0.0;
            Double totalweight=0.0;
            Double count=0.0;
            boolean flag=true;

            if(null!=jsonTemp.get("materialId")&&!jsonTemp.get("materialId").equals(""))
            {
                material=materialinfodao.findById(Integer.valueOf(jsonTemp.get("materialId")+"")).orElse(null);
            }
            if(material==null){
                if(null!=jsonTemp.get("materialName")&&!jsonTemp.get("materialName").equals("")) {
                    List<MaterialInfo> materialInfos=materialinfodao.findByMaterialName(jsonTemp.get("materialName")+"");
                    material=materialInfos.get(0);
                }
            }
            store.setMaterialInfo(material);
            if(null!=jsonTemp.get("warehouseName")&&!jsonTemp.get("warehouseName").equals(""))
            {
                warehousename=(jsonTemp.get("warehouseName")+"");
                store.setWarehouseName(warehousename);
            }

            if(null!=jsonTemp.get("count")&&!jsonTemp.get("count").equals(""))   {
                count=Double.parseDouble(jsonTemp.get("count")+"");
                store.setCountStore(count);
                store.setCountUse(count);
            }

            if(null!=jsonTemp.get("totalWeight")&&!jsonTemp.get("totalWeight").equals("")) {
                totalweight=(Double.parseDouble(jsonTemp.get("totalWeight")+""));
                store.setTotalWeight(totalweight);
            }
            if(null!=jsonTemp.get("totalArea")&&!jsonTemp.get("totalArea").equals("")) {
                totalArea=(Double.parseDouble(jsonTemp.get("totalArea")+""));
                store.setTotalArea(totalArea);
            }

            if(null!=jsonTemp.get("description")&&!jsonTemp.get("description").equals("")) {
                description=jsonTemp.get("description")+"";
                //store.setDescription(description);
                logdetail.setDescription(description);
            }

            Set<MaterialStore> materialStores = material.getMaterialStores();
            for(MaterialStore store1:materialStores){
                if(null!=store1.getWarehouseName()&&store1.getWarehouseName().equals(warehousename)){
                    store1.setCountStore(store1.getCountStore()+count);
                    store1.setCountUse(store1.getCountUse()+count);
                    store1.setTotalWeight(store1.getTotalWeight()+totalweight);
                    materialstoredao.save(store1);
                    logdetail.setMaterialStore(store1);
                    flag=false;
                    break;
                }
            }


            if(flag) materialstoredao.save(store);

            logdetail.setCount(store.getCountStore());
            logdetail.setMaterialInfo(material);
            logdetail.setMaterialLog(log);
            logdetail.setIsrollback(0);
            if (flag) logdetail.setMaterialStore(store);
            //插入log详细信息
            mateialLogdetaildao.save(logdetail);

        }
        return response;
    }

    //原材料仓库出库入库回滚
    //类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
    @RequestMapping(value = "/material/backMaterialstore.do")
    @Transactional
    public boolean backMaterialstore(Integer materiallogId,HttpSession session ,Integer operator,String type) throws Exception {
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
            materialStore.setCountStore(materialStore.getCountStore()-detail.getCount());
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
    public boolean backMaterial(Integer materialId,Integer projectId,Integer buildingId,Double count,Double totalWeight,Integer operator,String warehouseName,HttpSession session){
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
                store.setCountStore(store.getCountStore()+count);
                store.setCountUse(store.getCountUse()+count);
                store.setTotalWeight(store.getTotalWeight()+totalWeight);

            }else {
                store=new MaterialStore();
                store.setCountUse(count);
                store.setCountStore(count);
                store.setWarehouseName(warehouseName);
                store.setTotalWeight(totalWeight);
                store.setMaterialInfo(material);
            }
            materialstoredao.save(store);
            logdetail.setMaterialStore(store);
            mateialLogdetaildao.save(logdetail);

        return true;
    }


    @RequestMapping("/material/findMaterialLogdetails.do")
    @Transactional
    public  String findMaterialLogdetials(Integer materiallogId){
        List<MaterialLogdetail> logdetails= mateialLogdetaildao.findByMaterialLog(materialLogdao.findById(materiallogId).orElse(null));
        List<Map> list=new ArrayList<>();
        for (int i=0;i<logdetails.size();i++){
            String materialName = logdetails.get(i).getMaterialInfo().getMaterialName();
            Map<String,Object> map=JSONObject.parseObject(JSONObject.toJSONString(logdetails.get(i)),HashMap.class);
            map.put("materialName",materialName);
            list.add(map);
        }
        JSONObject object=new JSONObject();
        object.put("totalcount",logdetails.size());
        object.put("material_logdetail",list);
        return object.toJSONString();
    }


    @RequestMapping("/project/addAndupdateBuiling.do")
    @Transactional
    public boolean addAndupdateBuiling(Integer projectId,Integer id,String buildingNo,String buildingName,String buildingLeader){
        Project project=projectdao.findById(projectId).orElse(null);
        Building building=new Building();
        if(buildingNo!=null&&buildingNo.trim().length()!=0)
        building.setBuildingNo(buildingNo);
        if(buildingName!=null&&buildingName.trim().length()!=0)
            building.setBuildingName(buildingName);
        if(buildingLeader!=null&&buildingLeader.trim().length()!=0)
            building.setBuildingLeader(buildingLeader);
        if(id!=null&&id>0)
            building.setId(id);
        building.setProject(project);
        buildingdao.save(building);
        return true;
    }

    @RequestMapping("/project/match/newPanel.do")
    public boolean addNewPanelRule(Integer productformatId,Integer materialtypeId,String count, String m,String n, String a,String b, String p, String condition1, String condition2, String upWidth, String orientation,String suffix){
        MaterialMatchRules rule=new MaterialMatchRules();
        if(count.trim().length()==0) {
            count="1.0";
        }else {
            JPAObjectUtil.removeSpace(count);
        }
        if(m.trim().length()==0) {
            m=null;
        }else {
            JPAObjectUtil.removeSpace(m);
        }
        if(n.trim().length()==0) {
            n=null;
        }else {
            JPAObjectUtil.removeSpace(n);
        }
        if(p.trim().length()==0){
            p=null;
        }else {
            JPAObjectUtil.removeSpace(p);
        }
        if(a.trim().length()==0){
            a=null;
        }else {
            JPAObjectUtil.removeSpace(a);
        }
        if(b.trim().length()==0){
            b=null;
        }else {
            JPAObjectUtil.removeSpace(b);
        }
        if(condition1.trim().length()==0) {
            condition1=null;
        }else {
            JPAObjectUtil.removeSpace(condition1);
           condition1=condition1.replace("，",",");
        }
        if(condition2.trim().length()==0){
            condition2=null;
        }else {
            JPAObjectUtil.removeSpace(condition2);
            condition2=condition2.replace("，",",");
        }
        if(upWidth.trim().length()==0) {
            upWidth=null;
        }else {
            JPAObjectUtil.removeSpace(upWidth);
            upWidth=upWidth.replace("，",",");
        }
        if(orientation.trim().length()==0) {
            orientation=null;
        }else {
            JPAObjectUtil.removeSpace(orientation);
        }
        rule.setProductformatId(productformatId);
        rule.setMaterialTypeId(materialTypedao.findById(materialtypeId).orElse(null));
        try {
            rule.setCount(Double.parseDouble(count));
        }catch (Exception e){
            rule.setCountValue(count);
        }
        try {
            rule.setmNum(Integer.parseInt(m));
        }catch (Exception e){
            rule.setmValue(m);
        }
        try {
            rule.setnNum(Integer.parseInt(n));
        }catch (Exception e){
            rule.setnValue(n);
        }
        try {
            rule.setpNum(Integer.parseInt(p));
        }catch (Exception e){
            rule.setpValue(p);
        }
        rule.setaValue(a);
        rule.setbValue(b);
        rule.setCondition1(condition1);
        rule.setCondition2(condition2);
        rule.setUpWidth(upWidth);
        rule.setOrientation(orientation);
        if(suffix!=null&&suffix.trim().length()!=0)  rule.setSuffix(suffix);
        materialMatchRulesRepository.save(rule);
        return  true;
    }

    @RequestMapping("/material/requisition.do")
    public String findMaterialStore(Integer requisitionOrderId,Integer buildingId,Integer buildingpositionId){
        mysqlcondition c=new mysqlcondition();
        if (null!=requisitionOrderId) {
            c.and(new mysqlcondition("requisitionOrderId", "=", requisitionOrderId));
        }
        if (buildingId!=null) {
            c.and(new mysqlcondition("buildingId", "=", buildingId));
        }
        if (null!=buildingpositionId) {
            c.and(new mysqlcondition("buildingpositionId", "=", buildingpositionId));
        }
        DataList dataList=insertProjectService.findObjectId("requisition_order_detail_view",c);
        ArrayList<HashMap<String,String>> response=new ArrayList<>();
        for(DataRow row:dataList){
            Integer materialId=Integer.valueOf(row.get("infoId")+"");
            Double count=Double.valueOf(row.get("countRec")+"");
            MaterialInfo info=materialinfodao.findById(materialId).orElse(null);
            MaterialType type=info.getTypeId();
     //       List<Integer> list=new ArrayList<>();
           //匹配长度m,计算总长度和库存
            // 1、 U  2、 60F封边 3、BS  4、EB 5、 EC 6、 DP 7、企口
            if(type.getId()==1||type.getId()==16||type.getId()==17||type.getId()==10||type.getId()==12||type.getId()==13||type.getId()==15){
                mysqlcondition c1=new mysqlcondition();
                if (null!=info.getTypeId()) {
                    c1.and(new mysqlcondition("typeId", "=", info.getTypeId().getId()));
                }
                if (null!=info.getnValue()) {
                    c1.and(new mysqlcondition("nValue", "=", info.getnValue()));
                }
                if (null!=info.getpValue()) {
                    c1.and(new mysqlcondition("pValue", "=", info.getpValue()));
                }
                if (null!=info.getaValue()) {
                    c1.and(new mysqlcondition("aValue", "=", info.getaValue()));
                }
                if (null!=info.getbValue()) {
                    c1.and(new mysqlcondition("bValue", "=", info.getbValue()));
                }
                if (null!=info.getOrientation()) {
                    c1.and(new mysqlcondition("orientation", "=", info.getOrientation()));
                }
                DataList materialinfos=insertProjectService.findObjectId("material_info",c1);
                StringBuffer ids=new StringBuffer();
                for(DataRow row1:materialinfos){
                    ids.append(","+row1.get("id"));
                }
                String id="("+ids.substring(1).toString()+")";
                String sql="select *  from material_store_view where materialId in "+id+" and countStore>0 order by mValue";
                DataList storeList=insertProjectService.query(sql);
                //计算总共需要m大小
                Double deCount=info.getmValue()*count;
                int index=0;
                while (deCount>0&&index<storeList.size()){
                    DataRow dataRow=storeList.get(index);
                    Double storeCount=Double.valueOf(dataRow.get("countStore")+"");
                    Double mValue=Double.valueOf(dataRow.get("mValue")+"");
                    HashMap<String,String> map=new HashMap<>();
                    map.put("storeId",dataRow.get("storeId")+"");
                    map.put("materialId",dataRow.get("materialId")+"");
                    map.put("materialName",dataRow.get("materialName")+"");
                    map.put("partNo",dataRow.get("partNo")+"");
                    map.put("countStore",dataRow.get("countStore")+"");
                    map.put("warehouseName",dataRow.get("warehouseName")+"");
                    if(deCount<=storeCount*mValue){
                        map.put("count",Math.ceil(deCount/mValue)+"");
                        deCount=0.0;
                    }else {
                        map.put("count",storeCount+"");
                        deCount-=storeCount*mValue;
                    }
                    response.add(map);
                    index++;
                }
                if(index>=storeList.size()||deCount>0) System.out.println("没有足够的库存");
            }else {
                //完全匹配，扣除个数
                String sql = "select * from material_store_view where materialId=" + info.getMaterialid() + " and countStore>0";
                DataList storeList = insertProjectService.query(sql);
                Double deCount = count;
                int index = 0;
                while (deCount > 0 && index < storeList.size()) {
                    DataRow dataRow = storeList.get(index);
                    Double storeCount = Double.valueOf(dataRow.get("countStore") + "");
                    Double mValue = Double.valueOf(dataRow.get("mValue") + "");
                    HashMap<String, String> map = new HashMap<>();
                    map.put("storeId", dataRow.get("storeId") + "");
                    map.put("materialId", dataRow.get("materialId") + "");
                    map.put("materialName", dataRow.get("materialName") + "");
                    map.put("partNo", dataRow.get("partNo") + "");
                    map.put("countStore", dataRow.get("countStore") + "");
                    map.put("warehouseName", dataRow.get("warehouseName") + "");
                    if (deCount <= storeCount) {
                        map.put("count", deCount + "");
                        deCount = 0.0;
                    } else {
                        map.put("count", storeCount + "");
                        deCount -= storeCount;
                    }
                    response.add(map);
                    index++;
                }
                if (index >= storeList.size() || deCount > 0) System.out.println("没有足够的库存");
            }
        }
        JSONObject object=new JSONObject();
        object.put("totalcount",response.size());
        object.put("response",response);
        return object.toJSONString();
    }

}
