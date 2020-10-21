package com.bancai.util.risk.easyexcel;


import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class WorkOrder {
    @ExcelProperty("工单编号")
    private String workorderlogId;
    @ExcelProperty("项目名")
    private String projectName;
    @ExcelProperty("楼栋名")
    private String buildingName;
    @ExcelProperty("位置名")
    private String positionName;
    @ExcelProperty("操作人员")
    private String workerName;
    @ExcelProperty("创建时间")
    private Date date;
    @ExcelProperty("审批状态")
    private String isActive;
    @ExcelProperty("产品名")
    private String productName;
    @ExcelProperty("是否已生成领料单")
    private String status;
    @ExcelProperty("数量")
    private Double count;
    @ExcelProperty("来源")
    private String productMadeBy;
    @ExcelProperty("匹配结果")
    private String productMatchResultName;
    @ExcelProperty("匹配结果数量")
    private Double productMatchResultNum;


    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}