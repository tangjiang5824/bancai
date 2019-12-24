package service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InsertService extends BaseService {
	private Logger log = Logger.getLogger(InsertService.class);
	
	@Transactional
	public void addData(int pinhao,String pinming,String guige,String kucundanwei,String cangkubianhao,int shuliang,double chengben,String cunfangweizhi)
	{
		jo.update("insert into oldpanelstore(品号, 品名,规格,库存单位,仓库编号,数量,成本,存放位置) values(?,?,?,?,?,?,?,?)",
				pinhao, pinming,guige,kucundanwei,cangkubianhao,shuliang,chengben,cunfangweizhi);
	}
}
