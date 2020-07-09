package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "product_classification")
public class ProductClassification {
    private Integer classificationId;
    private String classificationName;
    private Set<Producttype> producttypes;
    @OneToMany(mappedBy ="classification" )
    public Set<Producttype> getProducttypes() {
        return producttypes;
    }

    public void setProducttypes(Set<Producttype> producttypes) {
        this.producttypes = producttypes;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "classificationId", nullable = false)
    public Integer getClassificationId() {
        return classificationId;
    }

    public void setClassificationId(Integer classificationId) {
        this.classificationId = classificationId;
    }

    @Basic
    @Column(name = "classificationName", nullable = true, length = 255)
    public String getClassificationName() {
        return classificationName;
    }

    public void setClassificationName(String classificationName) {
        this.classificationName = classificationName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductClassification that = (ProductClassification) o;
        return classificationId == that.classificationId &&
                Objects.equals(classificationName, that.classificationName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(classificationId, classificationName);
    }
}
