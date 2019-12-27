package controller;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import service.CheckResultService;
import service.UpdateService;
import vo.WebResponse;

@RestController
public class CheckResultController {

	private Logger log = Logger.getLogger(CheckResultController.class);
	@Autowired
	private CheckResultService checkResultService;
	@Autowired
	private UpdateService updateService;

	/**
	 * 获取校验结果
	 * 
	 * @param start
	 * @param limit
	 * @param tableName
	 *            风险校验结果表名
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value = "/tax/check/listCheckResult.do")
	public WebResponse listCheckResult(Integer start, Integer limit, String standard, String startTime, String endTime) {

		log.debug(startTime + "   " + endTime);
		return checkResultService.getUnDealCheckResult(start, limit, standard, startTime, endTime);
	}

	/**
	 * 根据风险日志id获取对应校验结果
	 * 
	 * @param start
	 * @param limit
	 * @param standard
	 *            风险标准
	 * @param id
	 *            风险发现日志id
	 * @return
	 */
	@RequestMapping(value = "/tax/check/listCheckResultByLogId.do")
	public WebResponse listCheckResultByLogId(Integer start, Integer limit, String standard, Integer id) {
		return checkResultService.getCheckResultByLogId(start, limit, standard, id);
	}

	/**
	 * 获取风险处理表（正在处理或已处理）
	 * 
	 * @param start
	 * @param limit
	 * @param tableName
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(value = "/tax/check/listDealCheckResult.do")
	public WebResponse listDealCheckResult(Integer start, Integer limit, String standard, String startTime, String endTime) {

		log.debug(startTime + "   " + endTime);
		return checkResultService.getDealCheckResult(start, limit, standard, startTime, endTime);

	}

	/**
	 * 结束处理
	 * 
	 * @param idSet选中的id
	 * @param tableName
	 * @param state
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/tax/chcek/endingDeal.do")
	public boolean endingDeal(String[] idSet, String state, HttpSession session) {
		String loginName = (String) session.getAttribute("loginName");
		Timestamp now = new Timestamp(System.currentTimeMillis());
		if (state.compareTo("已处理") != 0) {
			List<Object[]> parameterList = new ArrayList<Object[]>();
			for (int i = 0; i < idSet.length; i++) {
				parameterList.add(new Object[] { "已处理", loginName, now, idSet[i] });
			}

			updateService.batchUpdate("update checkResult set state=?,operator=?,operateTime=? where id=?", parameterList);
		}
		return true;
	}

	/**
	 * 开始处理
	 * 
	 * @param idSet
	 *            idSet选中的id
	 * @param tableName
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/tax/chcek/beginDeal.do")
	public boolean beginDeal(String[] idSet, String tableName, HttpSession session) {
		String loginName = (String) session.getAttribute("loginName");
		Timestamp now = new Timestamp(System.currentTimeMillis());
		List<Object[]> parameterList = new ArrayList<Object[]>();
		for (int i = 0; i < idSet.length; i++) {
			parameterList.add(new Object[] { "处理中", loginName, now, idSet[i] });
		}

		updateService.batchUpdate("update checkResult set state=?,operator=?,operateTime=? where id=?", parameterList);
		return true;
	}
}
