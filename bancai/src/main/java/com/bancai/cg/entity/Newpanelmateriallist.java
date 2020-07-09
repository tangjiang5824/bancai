package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "newpanelmateriallist")
public class Newpanelmateriallist {
    private Integer id;
    private Integer designlistId;
    private Integer materialId;
    private Double materialCount;
    private String materialName;

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "designlistId", nullable = true)
    public Integer getDesignlistId() {
        return designlistId;
    }

    public void setDesignlistId(Integer designlistId) {
        this.designlistId = designlistId;
    }

    @Basic
    @Column(name = "materialId", nullable = true, length = 11)
    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    @Basic
    @Column(name = "materialCount", nullable = true, precision = 0)
    public Double getMaterialCount() {
        return materialCount;
    }

    public void setMaterialCount(Double materialCount) {
        this.materialCount = materialCount;
    }

}
