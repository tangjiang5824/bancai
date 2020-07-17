package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "material_match_result")
public class MaterialMatchResult implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "designlistId")
    private Integer designlistId;

    @Column(name = "materialName")
    private String materialName;

    @Column(name = "materialId")
    private Integer materialId;

    @Column(name = "materialCount")
    private Double materialCount;

    /**
     * (1为旧板所需材料，3为新板所需材料)
     */
    @Column(name = "origin")
    private String origin;

    
}