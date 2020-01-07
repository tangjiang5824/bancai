package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import domain.DataList;
import domain.DataRow;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;
import vo.WebResponse;
@Service
public class CheckResultService extends BaseService {
	@Autowired
	private QueryService queryService;
	public WebResponse getUnDealCheckResult(Integer start, Integer limit, String standard, String startTime, String endTime)
	{
		WebResponse response=queryService.queryPage(start, limit, "select * from checkResult where standard=? and startTime>=? and endTime<=? and state=?",standard,startTime,endTime,"未处理");
		extractValue(response);
		return response;
	}
	public WebResponse getDealCheckResult(Integer start, Integer limit, String standard, String startTime, String endTime)
	{
		WebResponse response=queryService.queryPage(start, limit, "select * from checkResult where standard=? and startTime>=? and endTime<=? and state<>?",standard,startTime,endTime,"未处理");
		extractValue(response);
		return response;
	}
	private void extractValue(WebResponse response) {
		DataList list=(DataList) response.get("value");
		for(DataRow row:list)
		{
			String value=(String) row.get("value");
			JSONObject json=JSONObject.fromObject(value);
			for(Object key:json.keySet())
			{
				if(json.get(key) instanceof JSONNull)
				{
					row.put(key.toString(), null);
				}else {
					row.put(key.toString(), json.get(key));
				}
			}
			row.remove("value");
		}
	}
	public WebResponse getCheckResultByLogId(Integer start, Integer limit, String standard,Integer id)
	{
		WebResponse response=queryService.queryPage(start, limit,
					"select * from checkResult where standard=? and checkTime=(select [time] from [riskDiscoveryLog] where id=?)", standard, id);
		extractValue(response);
		return response;
	}
}
