package vo;

public class NextBatch {
	public Integer batchNo;
	public Integer uploadCycle;
	public String startTime;
	public String endTime;
	public Integer getBatchNo() {
		return batchNo;
	}
	public void setBatchNo(Integer batchNo) {
		this.batchNo = batchNo;
	}
	public Integer getUploadCycle() {
		return uploadCycle;
	}
	public void setUploadCycle(Integer uploadCycle) {
		this.uploadCycle = uploadCycle;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
