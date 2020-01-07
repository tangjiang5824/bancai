package controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import service.QueryService;
import service.TaxMatchService;
import vo.WebResponse;
@RestController
public class TaxNumMatchController {
	static Logger log = Logger.getLogger(TaxNumMatchController.class); 
	@Autowired
	private TaxMatchService taxMatchService;
	@Autowired
	private QueryService queryService;
	
	
	@RequestMapping(value = "/tax/edit/getTableDatabyId.do") // 根据表名展示特定表中的数据
	public WebResponse getTableDatabyId(int start,int limit,String tableName,int id) {
		
		WebResponse response = new WebResponse();
		
		response = queryService.queryPage(start, limit, "select * from ["+ tableName+"] where id=(select uploadId from matchingInfo where id=?)", id);


		return response;
	}
	
	@RequestMapping(value = "/tax/edit/getEnterprisebyId.do") // 根据表名展示特定表中的数据
	public WebResponse getEnterprisebyId(int start,int limit,String code) {
		
		WebResponse response = new WebResponse();
		
		response = queryService.queryPage(start, limit, "select * from [企业信息] where [社会信用代码(纳税人识别号)]=?", code);


		return response;
	}
	
	@RequestMapping(value = "/tax/edit/getUnmatchDataList.do") // 根据表名展示特定表中的数据
	public WebResponse getUnmatchDataList(int start,int limit,String tableName) {
		
		WebResponse response = new WebResponse();
		if (tableName==null||tableName.length()<=0) {
			response=queryService.queryPage(start, limit, "select * from matchingInfo");
		}else {
			response = queryService.queryPage(start, limit, "select * from matchingInfo where tableName=?", tableName);
			}

		return response;
	}
	
	@RequestMapping(value = "/tax/edit/manualInputCode.do") // 根据上传者Id展示特定表中的数据
	public void manualInputCode(String tableName,String taxName,String taxCode,String name,String code,int id,int uploadId) {
		log.debug("开始手动输入");
		log.debug(tableName+taxName+taxCode+name+code+id+uploadId);
		taxMatchService.editDataAndDeleteMatchInfo(tableName,taxName,taxCode,name,code,id,uploadId);
		
	}
	
	@RequestMapping(value = "/tax/edit/autoInputCode.do") // 根据选择的模糊匹配结果更新数据表纳税
	public void autoInputCode(String tableName,String trueName,String oldName,String code,int id) {
		
		taxMatchService.autoInputMatchInfo(tableName,trueName,oldName,code,id);
		
	}
	

	
	@RequestMapping(value = "/tax/edit/getSimilarInfo.do") // 根据上传者Id展示特定表中的数据
	public WebResponse getSimilarInfo(int start,int limit,int id) {
		
		WebResponse response = new WebResponse();

		response = queryService.queryPage(start, limit, "select * from similarInfo where matchId=?", id);

		return response;
	}
}
