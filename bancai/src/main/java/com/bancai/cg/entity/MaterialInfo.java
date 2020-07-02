package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "material_info")
public class MaterialInfo {
    private Long id;
    private String description;
    private String inventoryUnit;
    private String materialName;
    private String specification;
    private Integer width;
    private Double unitWeight;
    private Set<MaterialStore> materialStores =new HashSet<>();

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
