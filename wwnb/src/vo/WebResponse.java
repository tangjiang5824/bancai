package vo;

import java.util.HashMap;
import java.util.List;

public class WebResponse extends HashMap<String,Object> {
	private static final long serialVersionUID = 1L;
	public WebResponse() {
		this.setSuccess(true);
	}
	public void setSuccess(boolean success) {
		this.put("success", success);
	}
	public void setMsg(String msg) {
		this.put("msg", msg);
	}
	public void setValue(Object value) {
		this.put("value", value);
	}
	public void setColumns(Object columns) {
		this.put("columns", columns);
	}
	public void setFields(List<String> fields) {
		this.put("fields", fields);
	}
	public void setErrorCode(Integer e)
	{
		this.put("errorCode", e);
	}
}
