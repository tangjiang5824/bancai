package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "material_match_rules")
@Entity
@Data
public class MaterialMatchRules implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;
    private Integer productformatId;
    @ManyToOne(targetEntity = MaterialType.class)
    @JoinColumn(name = "materialTypeId",referencedColumnName = "id")
    private MaterialType materialTypeId;
    private Double count;
    private String countValue;
    private Integer mNum;
    private String mValue;
    private Integer nNum;
    private String nValue;
    private String aValue;
    private String bValue;
    private String pValue;
    private Integer pNum;
    private String condition1;
    private String condition2;
    private String upWidth;
    private String orientation;
    private String suffix;

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProductformatId() {
        return productformatId;
    }

    public void setProductformatId(Integer productformatId) {
        this.productformatId = productformatId;
    }

    public MaterialType getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(MaterialType materialTypeId) {
        this.materialTypeId = materialTypeId;
    }

    public Double getCount() {
        return count;
    }

    public void setCount(Double count) {
        this.count = count;
    }

    public String getCountValue() {
        return countValue;
    }

    public void setCountValue(String countValue) {
        this.countValue = countValue;
    }

    public Integer getmNum() {
        return mNum;
    }

    public void setmNum(Integer mNum) {
        this.mNum = mNum;
    }

    public String getmValue() {
        return mValue;
    }

    public void setmValue(String mValue) {
        this.mValue = mValue;
    }

    public Integer getnNum() {
        return nNum;
    }

    public void setnNum(Integer nNum) {
        this.nNum = nNum;
    }

    public String getnValue() {
        return nValue;
    }

    public void setnValue(String nValue) {
        this.nValue = nValue;
    }

    public String getaValue() {
        return aValue;
    }

    public void setaValue(String aValue) {
        this.aValue = aValue;
    }

    public String getbValue() {
        return bValue;
    }

    public void setbValue(String bValue) {
        this.bValue = bValue;
    }

    public String getpValue() {
        return pValue;
    }

    public void setpValue(String pValue) {
        this.pValue = pValue;
    }

    public Integer getpNum() {
        return pNum;
    }

    public void setpNum(Integer pNum) {
        this.pNum = pNum;
    }

    public String getCondition1() {
        return condition1;
    }

    public void setCondition1(String condition1) {
        this.condition1 = condition1;
    }

    public String getCondition2() {
        return condition2;
    }

    public void setCondition2(String condition2) {
        this.condition2 = condition2;
    }

    public String getUpWidth() {
        return upWidth;
    }

    public void setUpWidth(String upWidth) {
        this.upWidth = upWidth;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }
}