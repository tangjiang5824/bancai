package com.bancai.cg.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "match_result")
public class Match_result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer designlistId;
//    private Integer projectId;
//    private Integer buildingId;
    private String name;
    private Integer matchId;
    private Double count;
    private Integer isCompleteMatch;
}
