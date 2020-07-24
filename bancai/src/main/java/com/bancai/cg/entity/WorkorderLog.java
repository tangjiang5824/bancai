package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "work_order_log")
@Data
public class WorkorderLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer operator;
    private Integer projectId;
    private Integer isActive;
    private Date time;





   // private Integer ma

}
