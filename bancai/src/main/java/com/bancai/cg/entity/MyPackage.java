package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "package")
public class MyPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String packageName;
    private double packageWeight;
    private int projectId;
    private int buildingId;
    private int buildingpositionId;
    private String packageNo;
}
