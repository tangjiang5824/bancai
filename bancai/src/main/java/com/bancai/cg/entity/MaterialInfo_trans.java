package com.bancai.cg.entity;

import lombok.Data;

@Data
public class MaterialInfo_trans {
    private Integer materialid;
    private String inventoryUnit;
    private String materialName;
    private Integer nValue;
    private Integer mValue;
    private Integer pValue;
    private Integer aValue;
    private Integer bValue;
    private String orientation;
    private Double unitWeight;
    private Integer typeId;
}
