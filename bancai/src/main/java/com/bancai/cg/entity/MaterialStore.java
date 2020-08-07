package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "material_store")
public class MaterialStore {
    private Integer id;
    private Double countStore;
    private Double totalWeight;
    private Double totalArea;
    private String description;
    private Double countUse;
    private String warehouseName;
    private Set<MaterialLogdetail> materialLogdetails =new HashSet<>();

    @OneToMany(mappedBy = "materialStore")
    public Set<MaterialLogdetail> getMaterialLogdetails() {
        return materialLogdetails;
    }

    public void setMaterialLogdetails(Set<MaterialLogdetail> materialLogdetails) {
        this.materialLogdetails = materialLogdetails;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public Double getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(Double totalArea) {
        this.totalArea = totalArea;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getCountStore() {
        return countStore;
    }

    public void setCountStore(Double countStore) {
        this.countStore = countStore;
    }

    public Double getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(Double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



    private MaterialInfo materialInfo;

    @ManyToOne(targetEntity=MaterialInfo.class)
    @JoinColumn(name = "materialId",referencedColumnName = "id")
    public MaterialInfo getMaterialInfo() {
        return materialInfo;
    }

    public void setMaterialInfo(MaterialInfo materialInfo) {
        this.materialInfo = materialInfo;
    }

    public Double getCountUse() {
        return countUse;
    }

    public void setCountUse(Double countUse) {
        this.countUse = countUse;
    }


}
