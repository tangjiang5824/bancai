package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Set;


@Entity
@Table(name = "material_store")
public class MaterialStore {
    private Integer id;
    private Double count;
    private Double totalWeight;
    private String description;
    private Double countUse;
    private String warehouseName;
    private Integer rowNum;
    private  Integer columnNum;
    private Set<MaterialLogdetail> materialLogdetails;

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

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public Integer getColumnNum() {
        return columnNum;
    }

    public void setColumnNum(Integer columnNum) {
        this.columnNum = columnNum;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getCount() {
        return count;
    }

    public void setCount(Double count) {
        this.count = count;
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
