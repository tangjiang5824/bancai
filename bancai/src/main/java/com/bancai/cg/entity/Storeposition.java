package com.bancai.cg.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Storeposition {
    private int id;
    private Integer warehouseNo;
    private String warehouseName;
    private Integer rowNum;
    private Integer columnNum;
    private Set<MaterialStore> materialStores=new HashSet<>();

    @OneToMany(mappedBy = "storeposition")
    public Set<MaterialStore> getMaterialStores() {
        return materialStores;
    }

    public void setMaterialStores(Set<MaterialStore> materialStores) {
        this.materialStores = materialStores;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getWarehouseNo() {
        return warehouseNo;
    }

    public void setWarehouseNo(Integer warehouseNo) {
        this.warehouseNo = warehouseNo;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public Integer getColumnNum() {
        return columnNum;
    }

    public void setColumnNum(Integer columnNum) {
        this.columnNum = columnNum;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Storeposition that = (Storeposition) o;
        return id == that.id &&
                Objects.equals(warehouseNo, that.warehouseNo) &&
                Objects.equals(warehouseName, that.warehouseName) &&
                Objects.equals(rowNum, that.rowNum) &&
                Objects.equals(columnNum, that.columnNum);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, warehouseNo, warehouseName, rowNum, columnNum);
    }
}
