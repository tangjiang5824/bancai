package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "newpanelmateriallist")
public class Newpanelmateriallist {
    private Integer id;
    private Integer designlistId;
    private String materialName;
    private Double materialCount;

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
    @Column(name = "materialName", nullable = true, length = 255)
    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    @Basic
    @Column(name = "materialCount", nullable = true, precision = 0)
    public Double getMaterialCount() {
        return materialCount;
    }

    public void setMaterialCount(Double materialCount) {
        this.materialCount = materialCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Newpanelmateriallist that = (Newpanelmateriallist) o;
        return id == that.id &&
                Objects.equals(designlistId, that.designlistId) &&
                Objects.equals(materialName, that.materialName) &&
                Objects.equals(materialCount, that.materialCount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, designlistId, materialName, materialCount);
    }
}
