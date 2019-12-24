package service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class Upload_Data_Service extends BaseService {
	private Logger log = Logger.getLogger(Upload_Data_Service.class);
	
	@Transactional
	public void addData(int proNum,String ProName,String scale,String respo,String respoNum,int count,double cost,String location,String userid){
		
		
		jo.update("insert into oldpanelstore(品号, 品名,规格,库存单位,仓库编号,数量,成本,存放位置,uploadID) values(?,?,?,?,?,?,?,?,?)",
				proNum,ProName,scale,respo,respoNum,count,cost,location,userid);
		//return true;
	}
}