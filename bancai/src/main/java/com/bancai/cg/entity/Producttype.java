package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "producttype")
public class Producttype {
    private Integer id;
    private String productTypeName;
    private String description;
    private Integer classificationId;

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

    @Basic
    @Column(name = "classificationId", nullable = true)
    public Integer getClassificationId() {
        return classificationId;
    }

    public void setClassificationId(Integer classificationId) {
        this.classificationId = classificationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Producttype that = (Producttype) o;
        return id == that.id &&
                Objects.equals(productTypeName, that.productTypeName) &&
                Objects.equals(description, that.description) &&
                Objects.equals(classificationId, that.classificationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productTypeName, description, classificationId);
    }
}
