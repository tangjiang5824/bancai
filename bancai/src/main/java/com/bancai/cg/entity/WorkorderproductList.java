package com.bancai.cg.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

public class WorkorderproductList {
    private Integer designlistId;
    private HashMap<String,Double> map=new HashMap<>();

    public Integer getDesignlistId() {
        return designlistId;
    }

    public void setDesignlistId(Integer designlistId) {
        this.designlistId = designlistId;
    }

    public HashMap<String, Double> getMap() {
        return map;
    }

    public void setMap(HashMap<String, Double> map) {
        this.map = map;
    }

    public void addMap(String name,Double count){
        if(map!=null&&map.containsKey(name)) System.out.println("出错--------- 有重复name-----");;
        map.put(name,count);
    }





    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WorkorderproductList)) return false;
        WorkorderproductList that = (WorkorderproductList) o;
        return Objects.equals(map, that.map);
    }

    @Override
    public int hashCode() {
        return Objects.hash(map);
    }
}
