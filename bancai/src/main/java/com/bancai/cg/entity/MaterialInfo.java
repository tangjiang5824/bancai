package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "material_info")
public class MaterialInfo {
    private Integer materialid;
    private String inventoryUnit;
    private String materialName;
    private Integer nValue;
    private Integer mValue;
    private Integer pValue;
    private Integer aValue;
    private Integer bValue;
    private String orientation;
    private Double unitWeight;
    private MaterialType typeId;
    private Set<MaterialStore> materialStores =new HashSet<>();
    private Set<MaterialLogdetail> materialLogdetails =new HashSet<>();
    private String partNo;
    private String specification;

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }

    public String getPartNo() {
        return partNo;
    }

    public void setPartNo(String partNo) {
        this.partNo = partNo;
    }

    @ManyToOne(targetEntity = MaterialType.class)
    @JoinColumn(name = "typeId",referencedColumnName = "id")
    public MaterialType getTypeId() {
        return typeId;
    }

    public void setTypeId(MaterialType typeId) {
        this.typeId = typeId;
    }

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

    public Integer getpValue() {
        return pValue;
    }

    public void setpValue(Integer pValue) {
        this.pValue = pValue;
    }

    public Integer getnValue() {
        return nValue;
    }

    public void setnValue(Integer nValue) {
        this.nValue = nValue;
    }

    public Integer getmValue() {
        return mValue;
    }

    public void setmValue(Integer mValue) {
        this.mValue = mValue;
    }

    public Integer getaValue() {
        return aValue;
    }

    public void setaValue(Integer aValue) {
        this.aValue = aValue;
    }

    public Integer getbValue() {
        return bValue;
    }

    public void setbValue(Integer bValue) {
        this.bValue = bValue;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
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
