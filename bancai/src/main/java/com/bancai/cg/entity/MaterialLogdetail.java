package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "material_logdetail")
public class MaterialLogdetail {
    private Integer id;
    private Double count;
    private Integer isrollback;
    private MaterialLog materialLog;
    private MaterialInfo materialInfo;
    private MaterialStore materialStore;
    private String description;


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @ManyToOne(targetEntity = MaterialStore.class)
    @JoinColumn(name = "materialstoreId",referencedColumnName = "id")
    public MaterialStore getMaterialStore() {
        return materialStore;
    }

    public void setMaterialStore(MaterialStore materialStore) {
        this.materialStore = materialStore;
    }

    @ManyToOne(targetEntity = MaterialInfo.class)
    @JoinColumn(name = "materialId" ,referencedColumnName = "id")
    public MaterialInfo getMaterialInfo() {
        return materialInfo;
    }

    public void setMaterialInfo(MaterialInfo materialInfo) {
        this.materialInfo = materialInfo;
    }

    @ManyToOne(targetEntity = MaterialLog.class)
    @JoinColumn(name = "materiallogId",referencedColumnName = "id")
    public MaterialLog getMaterialLog() {
        return materialLog;
    }

    public void setMaterialLog(MaterialLog materialLog) {
        this.materialLog = materialLog;
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




    public Integer getIsrollback() {
        return isrollback;
    }

    public void setIsrollback(Integer isrollback) {
        this.isrollback = isrollback;
    }


}
