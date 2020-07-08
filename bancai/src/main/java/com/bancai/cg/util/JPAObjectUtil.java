package com.bancai.cg.util;

import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.entity.MaterialInfo;
import com.bancai.cg.entity.NewpanelRules;
import com.bancai.cg.entity.Newpanelmateriallist;
import com.bancai.cg.entity.ProductInfo;

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
    public List<HashMap<MaterialInfo,Integer>> NewPanelMatch(ProductInfo productInfo,String classification_name,List<NewpanelRules> rules) throws ScriptException {
        List<HashMap<MaterialInfo,Integer>> list=new ArrayList<>();
        for(NewpanelRules rule:rules){
            if(!(CondtionSatisfy(rule.getCondition1(),productInfo)&&CondtionSatisfy(rule.getCondition2(),productInfo))) continue;
            int count=1;
            HashMap<MaterialInfo,Integer> map=new HashMap<>();
            if (classification_name.equals("墙板")||
                    classification_name.equals("其他平板")||
                    classification_name.equals("飞机板")||
                    classification_name.equals("支撑")||
                    classification_name.equals("直转角")||
                    classification_name.equals("窗企口")
            ){
                MaterialInfo material=new MaterialInfo();

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
                    if(productInfo.getmValue()!=null) match_rs = match.replace("m", productInfo.getmValue()+"");
                    if(productInfo.getnValue()!=null) match_rs = match.replace("n", productInfo.getnValue()+"");
                    count=((int)Math.ceil(Double.parseDouble(jse.eval(match_rs).toString())));
                }else if(rule.getCount()!=null){
                    count=(int)(double)rule.getCount();
                }

                if(rule.getUpWidth()!=null&&rule.getUpWidth().trim().length()!=0){
                    String s[]=rule.getUpWidth().trim().split(" ");
                    for (int i=0;i<s.length;i++){
                        if(material.getnValue()>Integer.parseInt(s[i])) continue;
                        material.setnValue(Integer.parseInt(s[i]));
                    }
                }
                material.setTypeId(rule.getMaterialTypeId());
                map.put(material,count);
                list.add(map);
            }else if(classification_name.equals("两转转角")||classification_name.equals("三转转角")||classification_name.equals("企口转角")){
                MaterialInfo material=new MaterialInfo();
                if(rule.getOrientation()!=null&&rule.getOrientation().trim().length()!=0){
                    material=getValue(rule,material,productInfo,"a");
                    material=getValue(rule,material,productInfo,"b");
                    if(rule.getOrientation().equals("a"));


                }



            }
            //a,b
            //upwidth
            //n,m,p
            //count



        }

        return list;
    }

    private MaterialInfo getValue(NewpanelRules rule, MaterialInfo material, ProductInfo productInfo,String type) throws ScriptException {
       if(type.equals("m")){
           if(rule.getmValue()!=null&&rule.getmValue().trim().length()!=0){
               String match=rule.getmValue();
               String match_rs=match;
               if(productInfo.getmValue()!=null) match_rs = match.replace("m", productInfo.getmValue()+"");
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
               if(productInfo.getnValue()!=null) match_rs = match.replace("n", productInfo.getnValue()+"");
               material.setnValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }else if(rule.getnNum()!=null){
               material.setnValue(rule.getnNum());
           }
       }else if(type.equals("a")){
           if(rule.getaValue()!=null&&rule.getaValue().trim().length()!=0){
               String match=rule.getaValue();
               String match_rs=match;
               if(productInfo.getaValue()!=null) match_rs = match.replace("a", productInfo.getaValue()+"");
               material.setaValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }
       }else if(type.equals("b")){
           if(rule.getbValue()!=null&&rule.getbValue().trim().length()!=0){
               String match=rule.getbValue();
               String match_rs=match;
               if(productInfo.getbValue()!=null) match_rs = match.replace("b", productInfo.getaValue()+"");
               material.setbValue(Integer.parseInt(jse.eval(match_rs).toString()));
           }
       }
        return  material;
    }


    public boolean CondtionSatisfy(String condition,ProductInfo productInfo){
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
}
