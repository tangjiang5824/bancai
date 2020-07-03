package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Storeposition {
    private Integer id;
    private Integer warehouseNo;
    private String warehouseName;


    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getWarehouseNo() {
        return warehouseNo;
    }

    public void setWarehouseNo(Integer warehouseNo) {
        this.warehouseNo = warehouseNo;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }





}
