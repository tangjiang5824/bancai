package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "designlist")
public class Designlist {
    private Integer id;
    private Integer projectId;
    private Integer buildingId;
    private Integer buildingpositionId;
    private Integer productId;
    private String position;
    private Integer matchStatus;
    private Integer madeBy;
    private Integer processStatus;
    private Integer workorderLogId;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "projectId", nullable = true)
    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    @Basic
    @Column(name = "buildingId", nullable = true)
    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    @Basic
    @Column(name = "buildingpositionId", nullable = true)
    public Integer getBuildingpositionId() {
        return buildingpositionId;
    }

    public void setBuildingpositionId(Integer buildingpositionId) {
        this.buildingpositionId = buildingpositionId;
    }

    @Basic
    @Column(name = "productId", nullable = true)
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @Basic
    @Column(name = "position", nullable = true, length = 255)
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    @Basic
    @Column(name = "matchStatus", nullable = true)
    public Integer getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(Integer matchStatus) {
        this.matchStatus = matchStatus;
    }

    @Basic
    @Column(name = "madeBy", nullable = true)
    public Integer getMadeBy() {
        return madeBy;
    }

    public void setMadeBy(Integer madeBy) {
        this.madeBy = madeBy;
    }

    @Basic
    @Column(name = "processStatus", nullable = true)
    public Integer getProcessStatus() {
        return processStatus;
    }

    public void setProcessStatus(Integer processStatus) {
        this.processStatus = processStatus;
    }

    public Integer getWorkorderLogId() {
        return workorderLogId;
    }

    public void setWorkorderLogId(Integer workorderLogId) {
        this.workorderLogId = workorderLogId;
    }
}
