package com.bancai.cg.util;

import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.entity.*;
import org.hibernate.Session;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.*;

public class JPAObjectUtil {
    static ScriptEngine jse = new ScriptEngineManager().getEngineByName("JavaScript");
    public static <T> String transListForString(List<T> list,String tableName){
        List<Map> rslist=new ArrayList<>();
        for(int i=0;i<list.size();i++){
            Map<String,Object> map= JSONObject.parseObject(JSONObject.toJSONString(list.get(i)), HashMap.class);
            rslist.add(map);
        }
        JSONObject object=new JSONObject();
        object.put("totalCount",list.size());
        object.put(tableName,rslist);
        return object.toJSONString();
    }
    public static List<List<Object>> NewPanelMatch(ProductInfo productInfo,String classification_name,List<MaterialMatchRules> rules) throws ScriptException {
        List<List<Object>> list=new ArrayList<>();
        for(MaterialMatchRules rule:rules){
            boolean flag=false;
            if(rule.getCondition1()!=null){
                String[] c1=rule.getCondition1().split(",");
                for(int i=0;i<c1.length;i++){
                    if(!CondtionSatisfy(c1[i],productInfo)){
                        flag=true;
                        break;
                    }
                }
                if(flag) continue;
            }
           if(rule.getCondition2()!=null){
               String[] c2=rule.getCondition2().split(",");
               for(int i=0;i<c2.length;i++){
                   if(!CondtionSatisfy(c2[i],productInfo)) {
                       flag=true;
                       break;
                   }
               }
               if(flag) continue;
           }

            //if(!(CondtionSatisfy(rule.getCondition1(),productInfo)&&CondtionSatisfy(rule.getCondition2(),productInfo))) continue;
            int count=1;
            List<Object> arrayList =new ArrayList<>();
            MaterialInfo material=new MaterialInfo();
            material.setTypeId(rule.getMaterialTypeId());
            if (classification_name.equals("墙板")||
                    classification_name.equals("其他平板")||
                    classification_name.equals("飞机板")||
                    classification_name.equals("支撑")||
                    classification_name.equals("直转角")||
                    classification_name.equals("窗企口")
            ){
                //计算原材料m的值 公式中含有m或n
                material=getValue(rule,material,productInfo,"m");
                //计算原材料n的值，公式中含有m或n
                material=getValue(rule,material,productInfo,"n");
                //计算原材料a的值，公式中含有a
                material=getValue(rule,material,productInfo,"a");
                //计算原材料b的值，公式中含有b
                material=getValue(rule,material,productInfo,"b");
                //计算原材料count的值，公式中含有m或n
                if(rule.getCountValue()!=null&&rule.getCountValue().trim().length()!=0){
                    String match=rule.getCountValue();
                    String match_rs=match;
                    if(productInfo.getmValue()!=null) match_rs = match_rs.replace("m", productInfo.getmValue()+"");
                    if(productInfo.getnValue()!=null) match_rs = match_rs.replace("n", productInfo.getnValue()+"");
                    count=((int)Math.ceil(Double.parseDouble(jse.eval(match_rs).toString())));
                }else if(rule.getCount()!=null){
                    count=(int)(double)rule.getCount();
                }

                if(rule.getUpWidth()!=null&&rule.getUpWidth().trim().length()!=0){
                    String s[]=rule.getUpWidth().trim().split(",");
                    for (int i=0;i<s.length;i++){
                        if(material.getnValue()>Integer.parseInt(s[i])) continue;
                        material.setnValue(Integer.parseInt(s[i]));
                        break;
                    }
                }
                arrayList.add(material);
                arrayList.add(count);
                list.add(arrayList);
            }else if(classification_name.equals("两转转角")||classification_name.equals("三转转角")||classification_name.equals("企口转角")){
                if(rule.getOrientation()!=null&&rule.getOrientation().trim().length()!=0){
                    material.setOrientation(rule.getOrientation());
                    material=getValue(rule,material,productInfo,"a");
                    material=getValue(rule,material,productInfo,"b");
                    if(rule.getOrientation().equals("m")){
                        int angle_value=0;
                        if(productInfo.getmAngle()!=null){
                            if(productInfo.getmAngle()==1) angle_value=60;
                            else if(productInfo.getmAngle()==2) angle_value=10;
                        }
                        if(rule.getmValue()!=null&&rule.getmValue().trim().length()!=0){
                            String match=rule.getmValue();
                            String match_rs=match;
                            if(productInfo.getmValue()!=null) match_rs = match_rs.replace("m", productInfo.getmValue()+"");
                            if(productInfo.getaValue()!=null) match_rs = match_rs.replace("a", productInfo.getaValue()+"");
                            material.setmValue(Integer.parseInt(jse.eval(match_rs).toString())+angle_value);
                        }else if(rule.getmNum()!=null){
                            material.setmValue(rule.getmNum()+angle_value);
                        }
                    }else if(rule.getOrientation().equals("n")){
                        int angle_value=0;
                        if(productInfo.getnAngle()!=null){
                            if(productInfo.getnAngle()==1) angle_value=60;
                            else if(productInfo.getnAngle()==2) angle_value=10;
                        }
                        if(rule.getnValue()!=null&&rule.getnValue().trim().length()!=0){
                            String match=rule.getnValue();
                            String match_rs=match;
                            if(productInfo.getnValue()!=null) match_rs = match_rs.replace("n", productInfo.getnValue()+"");
                            if(productInfo.getaValue()!=null) match_rs = match_rs.replace("a", productInfo.getaValue()+"");
                            material.setnValue(Integer.parseInt(jse.eval(match_rs).toString())+angle_value);
                        }else if(rule.getnNum()!=null){
                            material.setnValue(rule.getnNum()+angle_value);
                        }
                    }else if(rule.getOrientation().equals("p")){
                        int angle_value=0;
                        if(productInfo.getpAngle()!=null){
                            if(productInfo.getpAngle()==1) angle_value=60;
                            else if(productInfo.getpAngle()==2) angle_value=10;
                        }
                        if(rule.getpValue()!=null&&rule.getpValue().trim().length()!=0){
                            String match=rule.getpValue();
                            String match_rs=match;
                            if(productInfo.getpValue()!=null) match_rs = match_rs.replace("p", productInfo.getpValue()+"");
                            if(productInfo.getaValue()!=null) match_rs = match_rs.replace("a", productInfo.getaValue()+"");
                            material.setpValue(Integer.parseInt(jse.eval(match_rs).toString())+angle_value);
                        }else if(rule.getpNum()!=null){
                            material.setpValue(rule.getpNum()+angle_value);
                        }
                    }

                }else {
                    //含方向产品中的普通原材料
                    material=getValue(rule,material,productInfo,"m");
                    //计算原材料n的值，公式中含有m或n
                    material=getValue(rule,material,productInfo,"n");
                    //计算原材料a的值，公式中含有a
                    material=getValue(rule,material,productInfo,"a");
                    //计算原材料b的值，公式中含有b
                    material=getValue(rule,material,productInfo,"b");
                }
                //数量 分析匹配规则后暂定只和a，b有关
                if(rule.getCountValue()!=null&&rule.getCountValue().trim().length()!=0){
                    String match=rule.getCountValue();
                    String match_rs=match;
                    if(productInfo.getaValue()!=null) match_rs = match_rs.replace("a", productInfo.getaValue()+"");
                    if(productInfo.getbValue()!=null) match_rs = match_rs.replace("b", productInfo.getbValue()+"");
                    count=((int)Math.ceil(Double.parseDouble(jse.eval(match_rs).toString())));
                }else if(rule.getCount()!=null){
                    count=(int)(double)rule.getCount();
                }

                arrayList.add(material);
                arrayList.add(count);
                list.add(arrayList);
            }else {

            }
            //a,b
            //upwidth
            //n,m,p
            //count



        }

        return list;
    }

    private static MaterialInfo getValue(MaterialMatchRules rule, MaterialInfo material, ProductInfo productInfo,String type) throws ScriptException {
       if(type.equals("m")){
           if(rule.getmValue()!=null&&rule.getmValue().trim().length()!=0){
               String match=rule.getmValue();
               String match_rs=match;
               if(productInfo.getmValue()!=null) match_rs = match_rs.replace("m", productInfo.getmValue()+"");
               //   if(productInfo.getnValue()!=null) match_rs = match.replace("n", productInfo.getnValue()+"");
               material.setmValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }else if(rule.getmNum()!=null){
               material.setmValue(rule.getmNum());
           }
       }else if(type.equals("n")){
           if(rule.getnValue()!=null&&rule.getnValue().trim().length()!=0){
               String match=rule.getnValue();
               String match_rs=match;
               //    if(productInfo.getmValue()!=null) match_rs = match.replace("m", productInfo.getmValue()+"");
               if(productInfo.getnValue()!=null) match_rs = match_rs.replace("n", productInfo.getnValue()+"");
               material.setnValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }else if(rule.getnNum()!=null){
               material.setnValue(rule.getnNum());
           }
       }else if(type.equals("a")){
           if(rule.getaValue()!=null&&rule.getaValue().trim().length()!=0){
               String match=rule.getaValue();
               String match_rs=match;
               if(productInfo.getaValue()!=null) match_rs = match_rs.replace("a", productInfo.getaValue()+"");
               material.setaValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }
       }else if(type.equals("b")){
           if(rule.getbValue()!=null&&rule.getbValue().trim().length()!=0){
               String match=rule.getbValue();
               String match_rs=match;
               if(productInfo.getbValue()!=null) match_rs = match_rs.replace("b", productInfo.getaValue()+"");
               material.setbValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }
       }
        return  material;
    }


    public static boolean CondtionSatisfy(String condition,ProductInfo productInfo){
        //condition 最高位 1：n， 2：m，3：p，4：a，5：b
        //condition 第二位 1:=, 2:>, 3:>=, 4:<, 5:<=
        if(condition==null||condition.trim().length()==0) return true;
            int c=0;
            switch (condition.charAt(0)){
                case 'n':{c=productInfo.getnValue();break;}
                case 'm':{c=productInfo.getmValue();break;}
                case 'p':{c=productInfo.getpValue();break;}
                case 'a':{c=productInfo.getaValue();break;}
                case 'b':{c=productInfo.getbValue();}
            }
            int v;
            boolean flag;
            if(condition.charAt(2)>='0'&&condition.charAt(2)<='9'){
                v=Integer.valueOf(condition.substring(2,condition.length()));
                flag=true;
            }else {
                v=Integer.valueOf(condition.substring(3,condition.length()));
                flag=false;
            }
            switch (condition.charAt(1)){
                case '=':{
                    if(c!=v) return false;
                    break;
                }
                case '>':{
                    if (flag){
                        if(c<=v) return  false;
                        break;
                    }else {
                        if(c<v) return  false;
                        break;
                    }
                }
                case '<':{
                    if (flag){
                        if(c>=v) return  false;
                        break;
                    }else {
                        if(c>v) return  false;
                        break;
                    }
                }
            }
        return true;
    }


    public static String removeSpace(String s){
        s=s.replace(" ","");
        return s;
    }


    public static boolean matchStoreByInfo(List<MaterialStore> stores, Double de_count, List<Match_result> isrollbacklist, Designlist designlist, String materialName, List<MaterialStore> list, Session session){
        int k=0;
        while (de_count>0){
            if(stores==null||k>=stores.size()){
                //log.error("仓库中 没有找到对应的原材料id 设计清单id"+designlist.getId()+"  产品id "+productInfo.getId());
                return false;
            }
            MaterialStore store=stores.get(k++);
            Match_result match_result = new Match_result();
            match_result.setDesignlistId(designlist.getId());
            match_result.setMatchId(store.getId());
            match_result.setName(materialName);
            match_result.setMadeBy(4);
            match_result.setIsCompleteMatch(1);
            if(store.getCountUse()>=de_count){
                match_result.setCount(de_count);
                // match_result.setMaterialName(dataList.get(0).get("materialName") + "");
                // match_result.setOrigin("3");
                store.setCountUse(store.getCountUse()-de_count);
                session.evict(store);
                de_count=0.0;
            }else {
                match_result.setCount(store.getCountUse());
                de_count-=store.getCountUse();
                store.setCountUse(0.0);
                session.evict(store);
            }
            isrollbacklist.add(match_result);

            list.add(store);
          //  materialstoredao.save(store);
        }
        return true;
    }
    public static String getPartNo(Integer prefix, Integer type, Integer id) {
        String type1= String.valueOf(type+100);
        String type2=type1.substring(type1.length()-2);
        String id1= String.valueOf(id+10000);
        String id2=id1.substring(id1.length()-4);
        String partNo=prefix+type2+id2;
        return partNo;
    }
}
