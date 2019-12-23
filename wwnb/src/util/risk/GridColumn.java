package util.risk;

public class GridColumn {
	private String text;
	private String dataIndex;
	private Integer width;
	public GridColumn(String text, String dataIndex, Integer width) {
		super();
		this.text = text;
		this.dataIndex = dataIndex;
		this.width = width;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getDataIndex() {
		return dataIndex;
	}
	public void setDataIndex(String dataIndex) {
		this.dataIndex = dataIndex;
	}
	public Integer getWidth() {
		return width;
	}
	public void setWidth(Integer width) {
		this.width = width;
	}
	
}
