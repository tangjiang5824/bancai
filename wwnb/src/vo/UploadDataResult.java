package vo;

import java.util.ArrayList;
import java.util.List;

import domain.DataList;
import domain.DataRow;

public class UploadDataResult {
	public boolean success = true;
	public Integer errorCode;
	public Integer uploadId;
	private List<String> fields = new ArrayList<String>();
	public DataList data = new DataList();
	public DataList dataList;
	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Integer getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public Integer getUploadId() {
		return uploadId;
	}

	public void setUploadId(Integer uploadId) {
		this.uploadId = uploadId;
	}


	public void setFileds(String... strs) {
		for (String s : strs)
			fields.add(s);
	}

	/**
	 * 数据与fileds相对应
	 * 
	 * @param objs
	 */
	public void addData(Object... objs) {
		DataRow row = new DataRow();
		for (int i = 0; i < objs.length; i++) {
			row.put(fields.get(i), objs[i]);
		}
		data.add(row);
	}

	

	public DataList getData() {
		return data;
	}

	public void setData(DataList data) {
		this.data = data;
	}

	
}
