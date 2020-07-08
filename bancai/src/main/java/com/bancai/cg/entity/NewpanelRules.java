package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "newpanel_rules")
public class NewpanelRules {
    private Integer id;
    private Integer productId;
    private MaterialType materialTypeId;
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
    private String orientation;

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    @Column(name = "productId", nullable = true)
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @ManyToOne(targetEntity = MaterialType.class)
    @JoinColumn(name = "materialTypeId",referencedColumnName = "id")
    public MaterialType getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(MaterialType materialTypeId) {
        this.materialTypeId = materialTypeId;
    }


    @Column(name = "count", nullable = true, precision = 0)
    public Double getCount() {
        return count;
    }

    public void setCount(Double count) {
        this.count = count;
    }

    @Column(name = "countValue", nullable = true, length = 50)
    public String getCountValue() {
        return countValue;
    }

    public void setCountValue(String countValue) {
        this.countValue = countValue;
    }


    @Column(name = "mNum", nullable = true)
    public Integer getmNum() {
        return mNum;
    }

    public void setmNum(Integer mNum) {
        this.mNum = mNum;
    }

    @Column(name = "mValue", nullable = true, length = 50)
    public String getmValue() {
        return mValue;
    }

    public void setmValue(String mValue) {
        this.mValue = mValue;
    }


    @Column(name = "nNum", nullable = true)
    public Integer getnNum() {
        return nNum;
    }

    public void setnNum(Integer nNum) {
        this.nNum = nNum;
    }


    @Column(name = "nValue", nullable = true, length = 50)
    public String getnValue() {
        return nValue;
    }

    public void setnValue(String nValue) {
        this.nValue = nValue;
    }


    @Column(name = "aValue", nullable = true, length = 50)
    public String getaValue() {
        return aValue;
    }

    public void setaValue(String aValue) {
        this.aValue = aValue;
    }


    @Column(name = "bValue", nullable = true, length = 50)
    public String getbValue() {
        return bValue;
    }

    public void setbValue(String bValue) {
        this.bValue = bValue;
    }


    @Column(name = "condition1", nullable = true, length = 50)
    public String getCondition1() {
        return condition1;
    }

    public void setCondition1(String condition1) {
        this.condition1 = condition1;
    }


    @Column(name = "condition2", nullable = true, length = 50)
    public String getCondition2() {
        return condition2;
    }

    public void setCondition2(String condition2) {
        this.condition2 = condition2;
    }


    @Column(name = "upWidth", nullable = true, length = 255)
    public String getUpWidth() {
        return upWidth;
    }

    public void setUpWidth(String upWidth) {
        this.upWidth = upWidth;
    }


}
