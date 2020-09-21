package com.bancai.cg.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "project")
public class Project {
    private Integer id;
    private Date startTime;
    private Date endTime;
    private String projectName;
    private Date proEndTime;
    private Date proStartTime;
    private Integer planLeaderId;
    private Integer produceLeaderId;
    private Integer purchaseLeaderId;
    private Integer financeLeaderId;
    private Integer storeLeaderId;
    private Integer uploadId;
    private Integer statusId;
    private Set<Building> buildings =new HashSet<>();
    private Set<MaterialLog> materialLogs =new HashSet<>();

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public Integer getUploadId() {
        return uploadId;
    }

    public void setUploadId(Integer uploadId) {
        this.uploadId = uploadId;
    }

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

    public Date getProStartTime() {
        return proStartTime;
    }

    public void setProStartTime(Date proStartTime) {
        this.proStartTime = proStartTime;
    }

    public Integer getPlanLeaderId() {
        return planLeaderId;
    }

    public void setPlanLeaderId(Integer planLeaderId) {
        this.planLeaderId = planLeaderId;
    }

    public Integer getProduceLeaderId() {
        return produceLeaderId;
    }

    public void setProduceLeaderId(Integer produceLeaderId) {
        this.produceLeaderId = produceLeaderId;
    }

    public Integer getPurchaseLeaderId() {
        return purchaseLeaderId;
    }

    public void setPurchaseLeaderId(Integer purchaseLeaderId) {
        this.purchaseLeaderId = purchaseLeaderId;
    }

    public Integer getFinanceLeaderId() {
        return financeLeaderId;
    }

    public void setFinanceLeaderId(Integer financeLeaderId) {
        this.financeLeaderId = financeLeaderId;
    }

    public Integer getStoreLeaderId() {
        return storeLeaderId;
    }

    public void setStoreLeaderId(Integer storeLeaderId) {
        this.storeLeaderId = storeLeaderId;
    }
}
