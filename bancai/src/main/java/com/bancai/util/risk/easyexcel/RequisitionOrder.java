package com.bancai.util.risk.easyexcel;


import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class RequisitionOrder {
    @ExcelProperty("所属项目")
    private String projectName;
    @ExcelProperty("所属楼栋")
    private String buildingName;
    @ExcelProperty("所属位置")
    private String positionName;
    @ExcelProperty("创建时间")
    private String time;
    @ExcelProperty("负责人")
    private String workerName;
//    @ExcelProperty("领料单状态")
//    private String statusName;
//    @ExcelProperty("审批状态")
//    private String isActive;
    @ExcelProperty("对应工单号")
    private String workorderlogId;
    @ExcelProperty("领料单号")
    private String requisitionOrderId;

//    @ExcelProperty("领料类型（旧板/原材料）")
//    private String madeBy;
    @ExcelProperty("领取材料名")
    private String name;
    @ExcelProperty("总数量")
    private String countAll;
    @ExcelProperty("已领数量")
    private String countRec;
//    @ExcelProperty("是否完全匹配")
//    private String isCompleteMatch;
    @ExcelProperty("仓库名")
    private String warehouseName;

    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}