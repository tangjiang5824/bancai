package com.bancai.cg.util;

import com.alibaba.fastjson.JSONObject;

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
}
