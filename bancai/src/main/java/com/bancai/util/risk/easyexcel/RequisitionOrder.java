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
    private Date time;
    @ExcelProperty("负责人")
    private String workerName;

    @ExcelProperty("领料单状态")
    private String statusName;
    @ExcelProperty("审批状态")
    private String isActive;
    @ExcelProperty("对应工单号")
    private String workorderlogId;
    @ExcelProperty("领料类型（旧板/原材料）")
    private String madeBy;
    @ExcelProperty("材料名")
    private String productName;
    @ExcelProperty("领料数量")
    private String productNum;
    @ExcelProperty("是否完全匹配")
    private String isCompleteMatch;
    @ExcelProperty("仓库名")
    private String storeName;

    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}