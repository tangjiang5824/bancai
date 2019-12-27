package controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.sf.json.JSONArray;
import service.QueryService;
import vo.WebResponse;

@RestController
public class AdvancedQueryController {
	Logger log = Logger.getLogger(AdvancedQueryController.class);
	@Autowired
	private QueryService queryService;
	/**
	 * 高级查询，按照表名和条件
	 * @param tableName
	 * @param condition
	 * @param start
	 * @param limit
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/query/advancedQuery/list.do")
	public WebResponse advancedQueryList(String tableName,String condition,Integer start,Integer limit) {
		JSONArray jArray = JSONArray.fromObject(condition);
		List<Map<String, Object>> mapList=new ArrayList<Map<String, Object>>(jArray);
//		System.out.println(start+" "+limit);
		return queryService.advanceQuery(tableName, mapList, start, limit);
	}

}
