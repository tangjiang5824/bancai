package com.bancai.cg.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "material_log")
public class MaterialLog {
    private Integer id;
    //类型：0入库，1出库，2退库， 3撤销入库，4撤销出库，5撤销退库
    private Integer type;
    //上传id
    private Integer userId;
    private Timestamp time;
    private Integer operator;
    //0可以回滚，1已回滚
    private Integer isrollback;
    private Building building;
    private Project project;

    @ManyToOne(targetEntity = Project.class)
    @JoinColumn(name = "projectId",referencedColumnName = "id")
    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @ManyToOne(targetEntity = Building.class)
    @JoinColumn(name = "buildingId",referencedColumnName = "id")
    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }
    @OneToMany(mappedBy = "materialLog")
    public Set<MaterialLogdetail> getMaterialLogdetails() {
        return materialLogdetails;
    }

    public void setMaterialLogdetails(Set<MaterialLogdetail> materialLogdetails) {
        this.materialLogdetails = materialLogdetails;
    }


    private Set<MaterialLogdetail> materialLogdetails =new HashSet<>();


    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }


    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public Integer getOperator() {
        return operator;
    }

    public void setOperator(Integer operator) {
        this.operator = operator;
    }

    public Integer getIsrollback() {
        return isrollback;
    }

    public void setIsrollback(Integer isrollback) {
        this.isrollback = isrollback;
    }


}
