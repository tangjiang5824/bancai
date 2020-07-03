package com.bancai.cg.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Project {
    private Integer id;
    private Date startTime;
    private Date endTime;
    private String projectName;
    private Date proEndTime;
    private String planLeader;
    private String produceLeader;
    private String purchaseLeader;
    private String financeLeader;
    private String storeLeader;
    private Set<Building> buildings =new HashSet<>();
    private Set<MaterialLog> materialLogs =new HashSet<>();

    @OneToMany(mappedBy = "project")
    public Set<MaterialLog> getMaterialLogs() {
        return materialLogs;
    }

    public void setMaterialLogs(Set<MaterialLog> materialLogs) {
        this.materialLogs = materialLogs;
    }

    @OneToMany(mappedBy = "project")
    public Set<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(Set<Building> buildings) {
        this.buildings = buildings;
    }

    @Id
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "startTime")
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Basic
    @Column(name = "endTime")
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Basic
    @Column(name = "projectName")
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    @Basic
    @Column(name = "proEndTime")
    public Date getProEndTime() {
        return proEndTime;
    }

    public void setProEndTime(Date proEndTime) {
        this.proEndTime = proEndTime;
    }

    @Basic
    @Column(name = "planLeader")
    public String getPlanLeader() {
        return planLeader;
    }

    public void setPlanLeader(String planLeader) {
        this.planLeader = planLeader;
    }

    @Basic
    @Column(name = "produceLeader")
    public String getProduceLeader() {
        return produceLeader;
    }

    public void setProduceLeader(String produceLeader) {
        this.produceLeader = produceLeader;
    }

    @Basic
    @Column(name = "purchaseLeader")
    public String getPurchaseLeader() {
        return purchaseLeader;
    }

    public void setPurchaseLeader(String purchaseLeader) {
        this.purchaseLeader = purchaseLeader;
    }

    @Basic
    @Column(name = "financeLeader")
    public String getFinanceLeader() {
        return financeLeader;
    }

    public void setFinanceLeader(String financeLeader) {
        this.financeLeader = financeLeader;
    }

    @Basic
    @Column(name = "storeLeader")
    public String getStoreLeader() {
        return storeLeader;
    }

    public void setStoreLeader(String storeLeader) {
        this.storeLeader = storeLeader;
    }


}
