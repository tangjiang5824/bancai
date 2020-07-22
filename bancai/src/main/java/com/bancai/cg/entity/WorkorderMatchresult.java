package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "work_order_detail_list")
public class WorkorderMatchresult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer detailId;
    private Integer matchResultId;
}
