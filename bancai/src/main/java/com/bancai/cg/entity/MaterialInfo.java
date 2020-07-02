package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "material_info")
public class MaterialInfo {
    private Integer materialid;
    private String description;
    private String inventoryUnit;
    private String materialName;
    private String specification;
    private Integer width;
    private Double unitWeight;
    private Set<MaterialStore> materialStores =new HashSet<>();
    private Set<MaterialLogdetail> materialLogdetails=new HashSet<>();

    @OneToMany(mappedBy = "materialInfo")
    public Set<MaterialLogdetail> getMaterialLogdetails() {
        return materialLogdetails;
    }

    public void setMaterialLogdetails(Set<MaterialLogdetail> materialLogdetails) {
        this.materialLogdetails = materialLogdetails;
    }
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id")
    public Integer getMaterialid() {
        return materialid;
    }

    public void setMaterialid(Integer materialid) {
        this.materialid = materialid;
    }





    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getInventoryUnit() {
        return inventoryUnit;
    }

    public void setInventoryUnit(String inventoryUnit) {
        this.inventoryUnit = inventoryUnit;
    }


    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }


    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }


    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Double getUnitWeight() {
        return unitWeight;
    }

    @OneToMany(mappedBy = "materialInfo")
    public Set<MaterialStore> getMaterialStores() {
        return materialStores;
    }

    public void setMaterialStores(Set<MaterialStore> materialStores) {
        this.materialStores = materialStores;
    }

    public void setUnitWeight(Double unitWeight) {
        this.unitWeight = unitWeight;
    }


}
