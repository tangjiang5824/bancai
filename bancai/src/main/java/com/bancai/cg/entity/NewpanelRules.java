package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "newpanel_rules")
public class NewpanelRules {
    private Integer id;
    private Integer productId;
    private Integer materialTypeId;
    private Double count;
    private String countValue;
    private Integer mNum;
    private String mValue;
    private Integer nNum;
    private String nValue;
    private String aValue;
    private String bValue;
    private String condition1;
    private String condition2;
    private String upWidth;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "productId", nullable = true)
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @Basic
    @Column(name = "materialTypeId", nullable = true)
    public Integer getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(Integer materialTypeId) {
        this.materialTypeId = materialTypeId;
    }

    @Basic
    @Column(name = "count", nullable = true, precision = 0)
    public Double getCount() {
        return count;
    }

    public void setCount(Double count) {
        this.count = count;
    }

    @Basic
    @Column(name = "countValue", nullable = true, length = 50)
    public String getCountValue() {
        return countValue;
    }

    public void setCountValue(String countValue) {
        this.countValue = countValue;
    }

    @Basic
    @Column(name = "mNum", nullable = true)
    public Integer getmNum() {
        return mNum;
    }

    public void setmNum(Integer mNum) {
        this.mNum = mNum;
    }

    @Basic
    @Column(name = "mValue", nullable = true, length = 50)
    public String getmValue() {
        return mValue;
    }

    public void setmValue(String mValue) {
        this.mValue = mValue;
    }

    @Basic
    @Column(name = "nNum", nullable = true)
    public Integer getnNum() {
        return nNum;
    }

    public void setnNum(Integer nNum) {
        this.nNum = nNum;
    }

    @Basic
    @Column(name = "nValue", nullable = true, length = 50)
    public String getnValue() {
        return nValue;
    }

    public void setnValue(String nValue) {
        this.nValue = nValue;
    }

    @Basic
    @Column(name = "aValue", nullable = true, length = 50)
    public String getaValue() {
        return aValue;
    }

    public void setaValue(String aValue) {
        this.aValue = aValue;
    }

    @Basic
    @Column(name = "bValue", nullable = true, length = 50)
    public String getbValue() {
        return bValue;
    }

    public void setbValue(String bValue) {
        this.bValue = bValue;
    }

    @Basic
    @Column(name = "condition1", nullable = true, length = 50)
    public String getCondition1() {
        return condition1;
    }

    public void setCondition1(String condition1) {
        this.condition1 = condition1;
    }

    @Basic
    @Column(name = "condition2", nullable = true, length = 50)
    public String getCondition2() {
        return condition2;
    }

    public void setCondition2(String condition2) {
        this.condition2 = condition2;
    }

    @Basic
    @Column(name = "upWidth", nullable = true, length = 255)
    public String getUpWidth() {
        return upWidth;
    }

    public void setUpWidth(String upWidth) {
        this.upWidth = upWidth;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NewpanelRules that = (NewpanelRules) o;
        return id == that.id &&
                Objects.equals(productId, that.productId) &&
                Objects.equals(materialTypeId, that.materialTypeId) &&
                Objects.equals(count, that.count) &&
                Objects.equals(countValue, that.countValue) &&
                Objects.equals(mNum, that.mNum) &&
                Objects.equals(mValue, that.mValue) &&
                Objects.equals(nNum, that.nNum) &&
                Objects.equals(nValue, that.nValue) &&
                Objects.equals(aValue, that.aValue) &&
                Objects.equals(bValue, that.bValue) &&
                Objects.equals(condition1, that.condition1) &&
                Objects.equals(condition2, that.condition2) &&
                Objects.equals(upWidth, that.upWidth);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productId, materialTypeId, count, countValue, mNum, mValue, nNum, nValue, aValue, bValue, condition1, condition2, upWidth);
    }
}
