package domain;

import java.util.ArrayList;

public class DataMatchedResultSet {
	
	private ArrayList<UploadMatchedResult> matchSet;
	private ArrayList<UploadMatchedResult> similarSet;
	public DataMatchedResultSet() {
		matchSet=new ArrayList<UploadMatchedResult>();
		similarSet=new ArrayList<UploadMatchedResult>();
				
	}
	public ArrayList<UploadMatchedResult> getMatchSet() {
		return matchSet;
	}
	public void setMatchSet(ArrayList<UploadMatchedResult> matchSet) {
		this.matchSet = matchSet;
	}
	public ArrayList<UploadMatchedResult> getSimilarSet() {
		return similarSet;
	}
	public void setSimilarSet(ArrayList<UploadMatchedResult> similarSet) {
		this.similarSet = similarSet;
	}
}
