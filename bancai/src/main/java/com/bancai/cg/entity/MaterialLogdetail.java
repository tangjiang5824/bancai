package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "material_logdetail")
public class MaterialLogdetail {
    private int id;
    private Integer count;
    private Integer materiallogId;
    private Integer materialId;
    private Integer isrollback;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getMateriallogId() {
        return materiallogId;
    }

    public void setMateriallogId(Integer materiallogId) {
        this.materiallogId = materiallogId;
    }

    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public Integer getIsrollback() {
        return isrollback;
    }

    public void setIsrollback(Integer isrollback) {
        this.isrollback = isrollback;
    }


}
