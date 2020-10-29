package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "material_type")
public class MaterialType {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String typeName;
    @OneToMany(mappedBy = "materialTypeId")
    private Set<MaterialMatchRules> materialMatchRules=new HashSet<>();
    @OneToMany(mappedBy = "typeId")
    private Set<MaterialInfo> materialInfos=new HashSet<>();
    private Integer materialPrefix;

    public Integer getMaterialPrefix() {
        return materialPrefix;
    }

    public void setMaterialPrefix(Integer materialPrefix) {
        this.materialPrefix = materialPrefix;
    }

    public Set<MaterialMatchRules> getMaterialMatchRules() {
        return materialMatchRules;
    }

    public void setMaterialMatchRules(Set<MaterialMatchRules> materialMatchRules) {
        this.materialMatchRules = materialMatchRules;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaterialType that = (MaterialType) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(typeName, that.typeName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, typeName);
    }
}
