package com.bancai.cg.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.bancai.cg.dao.materialinfodao;
import com.bancai.cg.entity.MaterialInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MaterialController {

    //JPA dao
    @Autowired
    private com.bancai.cg.dao.materialinfodao materialinfodao;


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
}
