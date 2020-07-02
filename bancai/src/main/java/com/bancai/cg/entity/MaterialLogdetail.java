package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "material_logdetail")
public class MaterialLogdetail {
    private int id;
    private Integer count;
    private Integer isrollback;
    private MaterialLog materialLog;
    private MaterialInfo materialInfo;

    @ManyToOne(targetEntity = MaterialInfo.class)
    @JoinColumn(name = "materialId" ,referencedColumnName = "id")
    public MaterialInfo getMaterialInfo() {
        return materialInfo;
    }

    public void setMaterialInfo(MaterialInfo materialInfo) {
        this.materialInfo = materialInfo;
    }

    @ManyToOne(targetEntity = MaterialLog.class)
    @JoinColumn(name = "materiallogid",referencedColumnName = "id")
    public MaterialLog getMaterialLog() {
        return materialLog;
    }

    public void setMaterialLog(MaterialLog materialLog) {
        this.materialLog = materialLog;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }




    public Integer getIsrollback() {
        return isrollback;
    }

    public void setIsrollback(Integer isrollback) {
        this.isrollback = isrollback;
    }


}
