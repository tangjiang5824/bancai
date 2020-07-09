package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "producttype")
public class Producttype {
    private Integer id;
    private String productTypeName;
    private String description;
    private ProductClassification classification;
    private Set<ProductInfo> productInfoSet;

    @OneToMany(mappedBy = "productType")
    public Set<ProductInfo> getProductInfoSet() {
        return productInfoSet;
    }

    public void setProductInfoSet(Set<ProductInfo> productInfoSet) {
        this.productInfoSet = productInfoSet;
    }

    @ManyToOne(targetEntity = ProductClassification.class)
    @JoinColumn(name = "classificationId",referencedColumnName = "classificationId")
    public ProductClassification getClassification() {
        return classification;
    }

    public void setClassification(ProductClassification classification) {
        this.classification = classification;
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

    @Basic
    @Column(name = "productTypeName", nullable = true, length = 255)
    public String getProductTypeName() {
        return productTypeName;
    }

    public void setProductTypeName(String productTypeName) {
        this.productTypeName = productTypeName;
    }

    @Basic
    @Column(name = "description", nullable = true, length = 255)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
