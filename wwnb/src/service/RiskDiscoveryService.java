package service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.sf.json.JSONObject;
@Service
public class RiskDiscoveryService extends BaseService {
	private Logger log = Logger.getLogger(RiskDiscoveryService.class);
	/**
	 * 自动风险发现
	 */
	@Transactional
	public  void automaticDiscovery()
	{
//		for(String name:StandardFactory.getStandardList())
//		{
//			Standard s=StandardFactory.create(name);
//			s.automatic(jo);
//		}
		Timestamp now=new Timestamp(System.currentTimeMillis());
		List<Map<String,Object>> risks=jo.queryForList("select * from risk");
		for(Map<String,Object> risk:risks)
		{
			String viewA = (String) risk.get("viewA");
			String viewB = (String) risk.get("viewB");
			String viewAMaxEndTime = jo.queryForObject("select max(v.endTime) as maxEndTime from (" + viewA + ") as v", String.class);
			log.debug("viewAMaxEndTime=" + viewAMaxEndTime);
			if (viewAMaxEndTime == null)
				continue;// 没有数据
			String viewBMaxEndTime = jo.queryForObject("select max(v.endTime) as maxEndTime from (" + viewB + ") as v", String.class);
			log.debug("viewBMaxEndTime=" + viewBMaxEndTime);
			if (viewBMaxEndTime == null || viewAMaxEndTime.compareTo(viewBMaxEndTime) > 0) {
				// 没有金三数据
				jo.update("insert into riskDiscoveryLog(time,standard,note,type) values(?,?,?,?)", now, risk.get("standard"),
						"缺少对应日期的金三数据：" + risk.get("ta") + "中的最大日期" + viewAMaxEndTime + "大于" + risk.get("tb") + "（金三数据）的最大日期", "错误");
				continue;
			} else {
				String selectSql = (String) risk.get("selectSql");
				//String insertSql = risk.getInsertSql(now);
				log.debug(selectSql);
				//log.debug(insertSql);
				int n1 = jo.queryForObject("select count(*) from (" + selectSql + ") as v", Integer.class);
				jo.update("insert into riskDiscoveryLog(time,standard,note,type) values(?,?,?,?)", now, risk.get("standard"), "检测到" + (n1) + "条风险", "风险");
				List<Map<String,Object>> list=jo.queryForList(selectSql);
				for(Map<String,Object> row:list)
				{
					JSONObject json=JSONObject.fromObject(row);
					jo.update("insert into checkResult([standard],[id_A],[id_B],[startTime],[endTime],[checkTime],[note],[state],[value]) values(?,?,?,?,?,?,?,?,?)",
							risk.get("standard"),row.get("id_A"),row.get("id_B"),row.get("startTime"),row.get("endTime"),now,risk.get("note"),"未处理",json.toString());
					log.debug(json);
				}
				// 用insert into 直接插入
				//jo.update(insertSql);
				// jo.update("update " + viewA + " set state=3 where state=2");
				if (log.isDebugEnabled()) {
					log.debug("风险发现成功！共发现风险" + (n1) + "条");
				}
			}
		}
	}
	/**
	 * 手动风险发现
	 * @param name
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public  List<Map<String, Object>> manualDiscovery(String standard,String startTime, String endTime)
	{
		List<Map<String,Object>> risks=jo.queryForList("select * from risk where standard=?",standard);
		Map<String,Object> risk=risks.get(0);
		String viewB = (String) risk.get("viewB");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		// 手动发现
		String viewBMaxEndTime = jo.queryForObject("select max(v.endTime) as maxEndTime from (" + viewB + ") as v", String.class);
		log.debug("viewBMaxEndTime=" + viewBMaxEndTime);
		if (viewBMaxEndTime == null || endTime.compareTo(viewBMaxEndTime) > 0) {
			// 没有金三数据
		} else {

			String selectSql = (String) risk.get("selectSql");
			selectSql=selectSql.replace("and ta.id not in (select id_a from checkResult)", ""); //不过滤已经发现的风险
			String sql = "select * from (" + selectSql + ") as v where v.startTime>=? and v.endTime<=?";
			log.debug(sql);
			List<Map<String, Object>> list1 = jo.queryForList(sql, startTime, endTime);

			for (Map<String, Object> row : list1) {
				list.add(row);
			}

		}
		return list;
	}
	
	
	
}
