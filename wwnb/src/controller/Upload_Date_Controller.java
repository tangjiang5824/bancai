package controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.omg.CORBA.PRIVATE_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import antlr.collections.List;
import service.Upload_Data_Service;



@RestController
public class Upload_Date_Controller {
	@Autowired
	private Upload_Data_Service Upload_Data_Service;
	
	@RequestMapping(value="/do_Update")
	public boolean addData(String s) {
		
		JSONArray jsonArray =new JSONArray(s);
		for(int i=0;i< jsonArray.length();i++) {
			JSONObject jsonTemp = jsonArray.getJSONObject(i);
			//获得第i条数据的各个属性值
	    	//int id=Integer.parseInt(jsonTemp.get("id"));
	    	System.out.println(jsonTemp.get("品号"));
	    	int proNum=Integer.parseInt(jsonTemp.get("品号").toString());
	    	String ProName=(String) jsonTemp.get("品名");
	    	String scale=(String) jsonTemp.get("规格");
	    	String respo=(String) jsonTemp.get("库存单位");
	    	String respoNum=(String) jsonTemp.get("仓库编号");
	    	int count=Integer.parseInt(jsonTemp.get("数量").toString());
	    	double cost= Double.parseDouble(jsonTemp.get("数量").toString()); //(float)jsonTemp.get("数量");
	    	String location=(String) jsonTemp.get("存放位置");
	    		    	
	    	//对每条数据处理
	    	Upload_Data_Service.addData(proNum,ProName,scale,respo,respoNum,count,cost,location);
			
		}
		
		
		
		
		return true;
		
	}

}
