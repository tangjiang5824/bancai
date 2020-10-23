package com.bancai.util.risk.easyexcel;


import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class MaterialRequisition {
    @ExcelProperty("创建时间")
    private Date datetime;
    @ExcelProperty("负责人")
    private String operator;
    @ExcelProperty("所属项目")
    private String projectName;
    @ExcelProperty("所属楼栋")
    private String buildingName;
    @ExcelProperty("所属位置")
    private String positionName;
    @ExcelProperty("领料单状态")
    private String statusName;
    @ExcelProperty("数字标题")
    private Double doubleData;
    @ExcelProperty("对应工单")
    private String workOrderDetailId;
    @ExcelProperty("由什么做成")
    private String madeBy;
    @ExcelProperty("产品名")
    private String productName;
    @ExcelProperty("领料数量")
    private String productNum;
    @ExcelProperty("是否完全匹配")
    private Boolean isCompleteMatch;

    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}