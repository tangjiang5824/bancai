package com.bancai.cg.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "material_type")
public class MaterialType {
    @Id
    private Integer id;
    private String typeName;
    @OneToMany(mappedBy = "typeId")
    private Set<MaterialInfo> materialInfos=new HashSet<>();

    public Set<MaterialInfo> getMaterialInfos() {
        return materialInfos;
    }

    public void setMaterialInfos(Set<MaterialInfo> materialInfos) {
        this.materialInfos = materialInfos;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }
}
