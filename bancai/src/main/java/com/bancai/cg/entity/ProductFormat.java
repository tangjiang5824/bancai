package com.bancai.cg.entity;



import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Table(name = "product_format")
@Entity
public class ProductFormat implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;
    @OneToMany(mappedBy = "productFormatId")
    private Set<ProductInfo> productInfoSet=new HashSet<>();
    @ManyToOne(targetEntity = Producttype.class)
    @JoinColumn(name = "productTypeId",referencedColumnName = "id")
    private Producttype producttype;


    /**
     * 0无1类型2m3n4aXb5bXa6m+n7后缀8m+n+p9a+b
     */
    @Column(name = "productFormat")
    private Integer productFormat;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Set<ProductInfo> getProductInfoSet() {
        return productInfoSet;
    }

    public void setProductInfoSet(Set<ProductInfo> productInfoSet) {
        this.productInfoSet = productInfoSet;
    }

    public Producttype getProducttype() {
        return producttype;
    }

    public void setProducttype(Producttype producttype) {
        this.producttype = producttype;
    }

    public Integer getProductFormat() {
        return productFormat;
    }

    public void setProductFormat(Integer productFormat) {
        this.productFormat = productFormat;
    }
}