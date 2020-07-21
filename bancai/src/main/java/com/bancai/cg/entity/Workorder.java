package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "work_order")
@Data
public class Workorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer projectId;
    private Integer buildingId;
    private Integer operator;
    private Date time;
    private Integer productId;




   // private Integer ma

}
