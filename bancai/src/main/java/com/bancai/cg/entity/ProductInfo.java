package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "product_info")
public class ProductInfo {
    private Integer id;
    private String productName;
    private String inventoryUnit;
    private Double unitWeight;
    private Double unitArea;
    private String remark;
    private ProductFormat productFormatId;
    private Integer mValue;
    private Integer nValue;
    private Integer pValue;
    private Integer aValue;
    private Integer bValue;
    private Integer mAngle;
    private Integer nAngle;
    private Integer pAngle;
    private String suffix;
    private String ignoredSuffix;
    private Integer userId;

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
    @Column(name = "productName", nullable = true, length = 255)
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    @Basic
    @Column(name = "inventoryUnit", nullable = true, length = 255)
    public String getInventoryUnit() {
        return inventoryUnit;
    }

    public void setInventoryUnit(String inventoryUnit) {
        this.inventoryUnit = inventoryUnit;
    }

    @Basic
    @Column(name = "unitWeight", nullable = true, precision = 2)
    public Double getUnitWeight() {
        return unitWeight;
    }

    public void setUnitWeight(Double unitWeight) {
        this.unitWeight = unitWeight;
    }

    @Basic
    @Column(name = "unitArea", nullable = true, precision = 2)
    public Double getUnitArea() {
        return unitArea;
    }

    public void setUnitArea(Double unitArea) {
        this.unitArea = unitArea;
    }

    @Basic
    @Column(name = "remark", nullable = true, length = 255)
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }


    @ManyToOne(targetEntity = ProductFormat.class)
    @JoinColumn(name = "productFormatId",referencedColumnName = "id")
    public ProductFormat getProductFormatId() {
        return productFormatId;
    }

    public void setProductFormatId(ProductFormat productFormatId) {
        this.productFormatId = productFormatId;
    }


    @Basic
    @Column(name = "mValue", nullable = true)
    public Integer getmValue() {
        return mValue;
    }

    public void setmValue(Integer mValue) {
        this.mValue = mValue;
    }

    @Basic
    @Column(name = "nValue", nullable = true)
    public Integer getnValue() {
        return nValue;
    }

    public void setnValue(Integer nValue) {
        this.nValue = nValue;
    }

    @Basic
    @Column(name = "pValue", nullable = true)
    public Integer getpValue() {
        return pValue;
    }

    public void setpValue(Integer pValue) {
        this.pValue = pValue;
    }

    @Basic
    @Column(name = "aValue", nullable = true)
    public Integer getaValue() {
        return aValue;
    }

    public void setaValue(Integer aValue) {
        this.aValue = aValue;
    }

    @Basic
    @Column(name = "bValue", nullable = true)
    public Integer getbValue() {
        return bValue;
    }

    public void setbValue(Integer bValue) {
        this.bValue = bValue;
    }

    @Basic
    @Column(name = "mAngle", nullable = true)
    public Integer getmAngle() {
        return mAngle;
    }

    public void setmAngle(Integer mAngle) {
        this.mAngle = mAngle;
    }

    @Basic
    @Column(name = "nAngle", nullable = true)
    public Integer getnAngle() {
        return nAngle;
    }

    public void setnAngle(Integer nAngle) {
        this.nAngle = nAngle;
    }

    @Basic
    @Column(name = "pAngle", nullable = true)
    public Integer getpAngle() {
        return pAngle;
    }

    public void setpAngle(Integer pAngle) {
        this.pAngle = pAngle;
    }

    @Basic
    @Column(name = "suffix", nullable = true, length = 255)
    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    @Basic
    @Column(name = "ignoredSuffix", nullable = true, length = 255)
    public String getIgnoredSuffix() {
        return ignoredSuffix;
    }

    public void setIgnoredSuffix(String ignoredSuffix) {
        this.ignoredSuffix = ignoredSuffix;
    }

    @Basic
    @Column(name = "userId", nullable = true)
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductInfo that = (ProductInfo) o;
        return id == that.id &&
                Objects.equals(productName, that.productName) &&
                Objects.equals(inventoryUnit, that.inventoryUnit) &&
                Objects.equals(unitWeight, that.unitWeight) &&
                Objects.equals(unitArea, that.unitArea) &&
                Objects.equals(remark, that.remark) &&
                Objects.equals(productFormatId, that.productFormatId) &&
                Objects.equals(mValue, that.mValue) &&
                Objects.equals(nValue, that.nValue) &&
                Objects.equals(pValue, that.pValue) &&
                Objects.equals(aValue, that.aValue) &&
                Objects.equals(bValue, that.bValue) &&
                Objects.equals(mAngle, that.mAngle) &&
                Objects.equals(nAngle, that.nAngle) &&
                Objects.equals(pAngle, that.pAngle) &&
                Objects.equals(suffix, that.suffix) &&
                Objects.equals(ignoredSuffix, that.ignoredSuffix) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productName, inventoryUnit, unitWeight, unitArea, remark, productFormatId, mValue, nValue, pValue, aValue, bValue, mAngle, nAngle, pAngle, suffix, ignoredSuffix, userId);
    }
}
