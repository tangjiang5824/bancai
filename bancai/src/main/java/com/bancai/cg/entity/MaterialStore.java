package com.bancai.cg.entity;

import javax.persistence.*;


@Entity
@Table(name = "material_store")
public class MaterialStore {
    private Long id;
    private Integer count;
    private String totalWeight;
    private String description;
    private Double countUse;
    private Storeposition storeposition;

    @ManyToOne(targetEntity = Storeposition.class)
    @JoinColumn(name = "storeposition",referencedColumnName = "id")
    public Storeposition getStoreposition() {
        return storeposition;
    }

    public void setStoreposition(Storeposition storeposition) {
        this.storeposition = storeposition;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }


    public String getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(String totalWeight) {
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
