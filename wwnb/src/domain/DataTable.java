package domain;



public class DataTable {
	private String tableName;
	private String oldTableName;
	private String organizationId;
	private String oldOrganizationId;
	public String getOldTableName() {
		return oldTableName;
	}
	public void setOldTableName(String oldTableName) {
		this.oldTableName = oldTableName;
	}
	public String getOldOrganizationId() {
		return oldOrganizationId;
	}
	public void setOldOrganizationId(String oldOrganizationId) {
		this.oldOrganizationId = oldOrganizationId;
	}
	private String tableType;
	private String cycleStart;
	private String uploadCycle;
	@Override
	public String toString() {
		return "DataTable [tableName=" + tableName + ", organizationId=" + organizationId + ", tableType=" + tableType
				+ ", cycleStart=" + cycleStart + ", uploadCycle=" + uploadCycle + ", getTableName()=" + getTableName()
				+ ", getOrganizationId()=" + getOrganizationId() + ", getTableType()=" + getTableType()
				+ ", getCycleStart()=" + getCycleStart() + ", getUploadCycle()=" + getUploadCycle() + "]";
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getOrganizationId() {
		return organizationId;
	}
	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
	public String getTableType() {
		return tableType;
	}
	public void setTableType(String tableType) {
		this.tableType = tableType;
	}
	public String getCycleStart() {
		return cycleStart;
	}
	public void setCycleStart(String cycleStart) {
		this.cycleStart = cycleStart;
	}
	public String getUploadCycle() {
		return uploadCycle;
	}
	public void setUploadCycle(String uploadCycle) {
		this.uploadCycle = uploadCycle;
	}
	public static void main(String[] args) {
	
      /*DataTable a=new DataTable();
      a.setTableName("Name");
      a.setOrganizationId("org");
      System.out.println(a);*/
	}

}
