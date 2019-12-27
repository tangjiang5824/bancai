package vo;

public class FormResponse {
	private Boolean success;
	private String msg;
	private Object value;
	private Object columns;
	private int totalCount;
	public int getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
	public Object getColumns() {
		return columns;
	}
	public void setColumns(Object columns) {
		this.columns = columns;
	}
	public FormResponse(){
		this.success=true;
	}
	public Boolean getSuccess() {
		return success;
	}
	public void setSuccess(Boolean success) {
		this.success = success;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getMsg() {
		return msg;
	}
	
}
