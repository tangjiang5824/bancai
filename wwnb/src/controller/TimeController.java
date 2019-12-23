package controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import service.RiskDiscoveryService;
import service.TaxMatchService;


@RestController
public class TimeController {
	Logger log = Logger.getLogger(TimeController.class); 
	@Autowired
	private TaxMatchService taxMatchService;
	@Autowired
    private RiskDiscoveryService riskDiscoveryService;
	/**
	 * 自动匹配和风险发现
	 * cron的格式Seconds Minutes Hours DayofMonth Month DayofWeek
	 * 表示每天1:00:00 执行  @Scheduled(cron="0 0 16 * * ? ") 
	 */
	@Scheduled(cron="0 0 1 * * ? ") 
	public void matchAndRiskDiscovery() { 
		log.debug("开始匹配：");
		/*MatchingUploadList testSet=TaxpayerNumMatch.getMatchingUploadSet();
		log.debug("获得需要上传的匹配数据"+testSet.size()+"条");
		if(testSet.size()>0) {
			TaxpayerList allSet=TaxpayerNumMatch.getAllTaxpayerSet();
			log.debug("获取纳税单位信息"+allSet.size()+"条");
			DataMatchedResultSet set=TaxpayerNumMatch.getResultSet(allSet,testSet);
			log.debug("获取完全匹配的纳税信息数"+set.getMatchSet().size()+"条");
			TaxpayerNumMatch.handleResultSetbyDB(set);
		}	*/
		taxMatchService.autoMatch();
		log.debug("匹配结束");
		log.debug("自动风险发现开始");
		riskDiscoveryService.automaticDiscovery();
		log.debug("自动风险发现结束");
	}
	/**
	 * 
	 * 无实际意义，仅仅为了得到一条.do而已
	 */
	@RequestMapping(value="/timeout.do")
	public void timeout(){
		
	}
	
	public static void main(String[] args) {  

		
	} 
	
}
