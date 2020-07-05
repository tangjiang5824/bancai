package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "building")
public class Building {
    private Integer id;
    private String buildingNo;
    private String buildingName;
    private String buildingLeader;
    private Project project;
    private Set<MaterialLog> materialLogs =new HashSet<>();

    @OneToMany(mappedBy = "building")
    public Set<MaterialLog> getMaterialLogs() {
        return materialLogs;
    }

    public void setMaterialLogs(Set<MaterialLog> materialLogs) {
        this.materialLogs = materialLogs;
    }

    @ManyToOne(targetEntity = Project.class)
    @JoinColumn(name = "projectId",referencedColumnName = "id")
    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "buildingNo")
    public String getBuildingNo() {
        return buildingNo;
    }

    public void setBuildingNo(String buildingNo) {
        this.buildingNo = buildingNo;
    }

    @Basic
    @Column(name = "buildingName")
    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    @Basic
    @Column(name = "buildingLeader")
    public String getBuildingLeader() {
        return buildingLeader;
    }

    public void setBuildingLeader(String buildingLeader) {
        this.buildingLeader = buildingLeader;
    }


}
