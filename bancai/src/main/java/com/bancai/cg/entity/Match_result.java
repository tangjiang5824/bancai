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
    private Integer madeBy;
    private Integer matchId;
    private Double count;
    private Integer isCompleteMatch;
    private Integer workorderId;
    private Integer storesrequisition;

    public Match_result() {
    }
    public Match_result(Match_result match_result){
        this.name=match_result.name;
        this.madeBy=match_result.madeBy;
        this.matchId=match_result.matchId;
        this.count=match_result.count;
        this.isCompleteMatch=match_result.isCompleteMatch;
    }
}
