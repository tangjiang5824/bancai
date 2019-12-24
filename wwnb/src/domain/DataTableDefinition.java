package domain;

import org.json.JSONObject;

public class DataTableDefinition {
	private String fieldName;
	private String oldFileldName;
	public String getOldFileldName() {
		return oldFileldName;
	}
	public void setOldFileldName(String oldFileldName) {
		this.oldFileldName = oldFileldName;
	}
	private String fieldType;
	private String taxUnitCode;
	private String taxUnitName;
	private String isNull;
	private String fieldCheck;
	private String width;

	public DataTableDefinition(JSONObject json) {
		this.taxUnitName=(String) json.get("TaxUnitName");
		this.fieldName=(String) json.get("fieldName");
		this.isNull=(String) json.get("isNull");
		this.fieldType=String.valueOf(json.get("fieldType"));
		this.taxUnitCode=(String) json.get("TaxUnitCode");
		this.fieldCheck=(String) json.get("fieldCheck");
		this.width=String.valueOf(json.get("width"));
		this.oldFileldName=(String) json.get("oldFieldName");
	}
	
	
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}
	public DataTableDefinition()
	{
		
	}
	public String getFieldName() {
		return fieldName;
	}
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}
	public String getFieldType() {
		return ("1".equals(fieldType)?"float":"varchar(3000)");
	}
	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}
	public String getTaxUnitCode() {
		return taxUnitCode;
	}
	public void setTaxUnitCode(String taxUnitCode) {
		this.taxUnitCode = taxUnitCode;
	}
	public String getTaxUnitName() {
		return taxUnitName;
	}
	public void setTaxUnitName(String taxUnitName) {
		this.taxUnitName = taxUnitName;
	}
	public String getIsNull() {
		return isNull;
	}
	public void setIsNull(String isNull) {
		this.isNull = isNull;
	}
	public String getFieldCheck() {
		return fieldCheck;
	}
	public void setFieldCheck(String fieldCheck) {
		this.fieldCheck = fieldCheck;
	}
	
}

