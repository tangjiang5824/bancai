package com.bancai.cg.entity;

import javax.persistence.*;


@Entity
@Table(name = "material_store")
public class MaterialStore {
    private Long id;
    private Integer count;
    private String warehouseName;
    private String totalWeight;
    private String description;
    private Integer rowNo;
    private Integer columNo;
    private Double countUse;

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

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
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

    public Integer getRowNo() {
        return rowNo;
    }

    public void setRowNo(Integer rowNo) {
        this.rowNo = rowNo;
    }

    public Integer getColumNo() {
        return columNo;
    }

    public void setColumNo(Integer columNo) {
        this.columNo = columNo;
    }


    private MaterialInfo materialInfo;

    @ManyToOne(targetEntity=MaterialInfo.class)
    @JoinColumn(name = "materialid",referencedColumnName = "id")
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
