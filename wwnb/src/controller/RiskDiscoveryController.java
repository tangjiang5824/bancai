package controller;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import domain.DataList;
import service.QueryService;
import service.RiskDiscoveryService;
import util.risk.RiskBuilder;
import vo.WebResponse;

@RestController
public class RiskDiscoveryController {
    Logger log = Logger.getLogger(RiskDiscoveryController.class);
    @Autowired
    private RiskDiscoveryService riskDiscoveryService;
    @Autowired
    private QueryService queryService;
    /**
     * 手动风险发现
     * @param name
     * @param startTime
     * @param endTime
     * @return
     */
    @RequestMapping(value="/tax/check/manualRiskDiscovery.do")
	public WebResponse manualRiskDiscovery(String standard,String startTime, String endTime) 
	{
		WebResponse response = new WebResponse();
		log.debug(standard);
		log.debug(startTime);
		log.debug(endTime);		
		response.put("value", riskDiscoveryService.manualDiscovery(standard, startTime, endTime));
		return response;
	}
    /**
     * 查看风险发现记录
     * @param start
     * @param limit
     * @param startTime
     * @param endTime
     * @return
     */
	@RequestMapping(value = "/tax/check/riskDiscoveryLog.do")
	public WebResponse getRiskDiscoveryLog(Integer start, Integer limit, String startTime, String endTime,HttpSession session) {
		log.debug(startTime + " " + endTime);
		String organizationId=(String) session.getAttribute("organizationId");
		return queryService.queryPage(start, limit, "select a.* from riskDiscoveryLog as a,risk as b where a.standard=b.standard and b.organizationId=? and convert(varchar, a.time, 23) >=? and convert(varchar, a.time, 23)<=?", organizationId,startTime,endTime);
	};
	
	@RequestMapping(value = "/tax/check/getStandards.do",produces = { "application/json; charset=UTF-8" })
	public  DataList getStandards(HttpSession session) {
		String organizationId=(String) session.getAttribute("organizationId");
		return queryService.query("select standard from risk where organizationId=? order by [order]",organizationId);
	}
	
	@RequestMapping(value = "/tax/check/getColumns.do",produces = { "application/json; charset=UTF-8" })
	public  String getColumns(String standard)
	{
		return queryService.queryForObject("select columns from risk where standard=?",String.class,standard);
	}
	@RequestMapping(value = "/tax/check/getFields.do",produces = { "application/json; charset=UTF-8" })
	public String getFields(String standard)
	{
		return queryService.queryForObject("select fields from risk where standard=?",String.class,standard);
	}
	@RequestMapping(value="/tax/check/riskBuilder.do")
	public WebResponse riskBuilder(RiskBuilder builder) {
		builder.build();
		WebResponse response=new WebResponse();
		return response;
	}
	
}
