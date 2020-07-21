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
    private Integer productId;
}
