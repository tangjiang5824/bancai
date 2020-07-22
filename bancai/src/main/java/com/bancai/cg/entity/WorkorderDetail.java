package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "work_order_detail")
@Data
public class WorkorderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer projectId;
    private Integer buildingId;
    private Integer buildingpositionId;
    private Integer productId;
    private Integer productMadeBy;
    private Integer workorderlogId;
    private Double count;
    private Integer status;
}
