package com.bancai.cg.util;

import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.entity.NewpanelRules;
import com.bancai.cg.entity.Newpanelmateriallist;
import com.bancai.cg.entity.ProductInfo;

import java.util.*;

public class JPAObjectUtil {
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
    public List<Newpanelmateriallist> NewPanelMatch(ProductInfo productInfo, List<NewpanelRules> rules){
        List<Newpanelmateriallist> list=new ArrayList<>();
        for(NewpanelRules rule:rules){
            if(!(CondtionSatisfy(rule.getCondition1(),productInfo)&&CondtionSatisfy(rule.getCondition2(),productInfo))) continue;
            



        }

        return list;
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
