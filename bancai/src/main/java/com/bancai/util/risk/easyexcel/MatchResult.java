package com.bancai.util.risk.easyexcel;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;


@Data
public class MatchResult {
    @ExcelProperty("项目名称")
    private String projectName;
    @ExcelProperty("楼栋名称")
    private String buildingName;
    @ExcelProperty("清单名称")
    private String buildingpositionName;
    @ExcelProperty("产品名")
    private String productName;
//    @ExcelProperty("单位")
//    private String productInventoryUnit;
//    @ExcelProperty("单面积/m2")
//    private Double productUnitArea;
//    @ExcelProperty("单重/KG")
//    private Double productUnitWeight;
//    @ExcelProperty("生产数量")
//    private Double productCount;
//    @ExcelProperty("生产面积/m2")
//    private Double productTotalArea;
//    @ExcelProperty("总重/KG")
//    private Double productTotalWeight;
    @ExcelProperty("匹配结果来源")
    private String productMadeBy;
    @ExcelProperty("匹配结果名")
    private String name;
//    @ExcelProperty("匹配旧板单位")
//    private String oldpanelInventoryUnit;
    @ExcelProperty("匹配结果数量")
    private String count;
//    @ExcelProperty("匹配旧板面积/m2")
//    private Double oldpanelTotalArea;
//    @ExcelProperty("匹配旧板重量/KG")
//    private Double oldpanelTotalWeight;
//    @ExcelProperty("旧板仓库名称")
//    private String warehouseName;
    @ExcelProperty("匹配程度")
    private String isCompleteMatch;




    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}
