
package controller;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import db.Condition;
import domain.DataList;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import service.ExcelService;
import service.QueryService;
import service.RiskDiscoveryService;
import service.TableService;
import service.TaxMatchService;
import util.Excel;
import vo.NextBatch;
import vo.UploadDataResult;
import vo.WebResponse;

/**
 * 用来处理上传文件，查询文件等操作
 */
@RestController
public class DataUploadController {

	Logger log = Logger.getLogger(DataUploadController.class);

	@Autowired
	private ExcelService excelService;
	@Autowired
	private TableService tableService;
	@Autowired
	private QueryService queryService;
	/**
	 * 上传excel文件
	 * @param uploadFile
	 * @param tableName
	 * @param year
	 * @param batchNo
	 * @param startTime
	 * @param endTime
	 * @param check
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/data/uploadData.do",produces = { "text/html;charset=UTF-8" })
	public String uploadData(MultipartFile uploadFile, String tableName, Integer year, Integer batchNo, String startTime, String endTime,
			Boolean check, HttpSession session) {
		WebResponse response = new WebResponse();
		String uploads = (String) session.getAttribute("loginName");
		try {
			UploadDataResult result = excelService.uploadData(uploadFile.getInputStream(), uploads, tableName, year, batchNo, startTime, endTime, check);
			response.setSuccess(result.success);
			
			response.setErrorCode(result.errorCode);
			response.setValue(result.data);
			response.put("uploadId", result.uploadId);
			if(result.success)
			{
				if(tableName.equals("税务登记信息查询")||tableName.equals("税务登记信息查询(国税)"))
				{
					updateEnterpriseInfo();
				}
				matchAndRiskDiscovery(tableName, result.uploadId, result.dataList);
			}
		} catch (IOException e) {
			e.printStackTrace();
			response.setSuccess(false);
			response.setErrorCode(1000); //未知错误
			response.setMsg(e.getMessage());
		}
		JSONObject json=JSONObject.fromObject(response);
		return json.toString();
	}
	private void updateEnterpriseInfo() {
		Thread t=new Thread(){
			public void run()
			{
				log.debug("开始更新企业信息");
				excelService.updateEnterpriseInfo();
				log.debug("企业信息更新结束");
			}
		};
		t.start();
	}
	@Autowired
	private TaxMatchService taxMatchService;
	@Autowired
	private RiskDiscoveryService riskDiscoveryService;
	/**
	 * 自动匹配和风险发现
	 * @param tableName
	 * @param uploadId
	 * @param dataList
	 */
	private void matchAndRiskDiscovery(String tableName, int uploadId, DataList dataList) {
		int type = tableService.getTableType(tableName);
		Thread t = new Thread(() -> {
			try {
				log.debug("开始匹配税号");
				// 纳税识别号匹配
				if (type == 0) {// 第三方数据
					taxMatchService.upDataMatch(tableName, uploadId);
				} else {// 金三数据
					if (tableName.equals("税务登记信息查询")) {
						taxMatchService.gold3Match(dataList);
					}

				}
				log.debug("匹配税号结束");
				log.debug("自动风险发现开始");
				riskDiscoveryService.automaticDiscovery();
				log.debug("自动风险发现结束");
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
		t.start();
	}
	/**
	 * 当期无数据
	 * @param tableName
	 * @param year
	 * @param batchNo
	 * @param startTime
	 * @param endTime
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/data/setNoData.do")
	public boolean setNoData(String tableName, Integer year, Integer batchNo, String startTime, String endTime, HttpSession session) {
		String uploads = (String) session.getAttribute("loginName");

		// 当期无数据
		return excelService.setNoData(tableName, year, batchNo, startTime, endTime, uploads);
	}
	/**
	 * 得到上传批次
	 * @param tableName
	 * @param year
	 * @return
	 */
	@RequestMapping(value = "/data/getNextBatch.do")
	public NextBatch getNextBatch(String tableName, Integer year) {
		return excelService.getNextBatch(tableName, year);
	}

	/**
	 * 下载excel模版
	 * @param tableName
	 * @param response
	 * @return
	 * @throws SQLException
	 * @throws IOException
	 */
	@RequestMapping(value = "/data/downloadExcelTemplate.do")
	public WebResponse downloadExcelTemplate(String tableName, HttpServletResponse response,HttpServletRequest request) throws SQLException, IOException {// 获取问题列表
		// List<Suggestion> targetStockList =
		// suggestionService.getSuggestionList(map);

		log.debug("下载Excel文件名：" + tableName);
		DataList columnList = tableService.getColumnList(tableName);

		Excel excelFile = new Excel(tableName, columnList);

		// 通过Response把数据以Excel格式保存
		excelFile.download(request, response, tableName);

		return null;
	}

	/**
	 * 批量上传数据
	 * @param newFiles
	 * @param session
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/org/data/uploadZipFiles.do")
	public WebResponse uploadZipFiles(@RequestParam("newFiles") MultipartFile[] newFiles, HttpSession session, String startTime, String endTime)
			throws IOException {

		WebResponse response = new WebResponse();

		String uploads = (String) session.getAttribute("loginName");
		List<String> tableNames = new ArrayList<String>();
		List<InputStream> streams = new ArrayList<InputStream>();
		for (int i = 0; i < newFiles.length; i++) {
			MultipartFile file = newFiles[i];
			String tableName = file.getOriginalFilename();
			tableName = tableName.substring(0, tableName.indexOf(".zip"));
			tableNames.add(tableName);
			streams.add(file.getInputStream());
		}
		try {
			excelService.uploadZipFiles(tableNames, streams, uploads, startTime, endTime);
			if(tableNames.contains("税务登记信息查询"))
				updateEnterpriseInfo();
		}catch(Exception e)
		{
			e.printStackTrace();
			response.setSuccess(false);
			response.setErrorCode(0); //文件格式有问题
			response.setMsg(e.getMessage());
		}
		return response;
	}

	/**
	 * 根据上传者Id展示特定表中的数据
	 * @param start
	 * @param limit
	 * @param id
	 * @param tableName
	 * @return
	 */
	@RequestMapping(value = "/dataListByUploadId.do") // 
	public WebResponse dataListByUploadId(Integer start, Integer limit, Integer id, String tableName) {
		log.debug(tableName);
		Condition a = new Condition("uploadId", "=", id);
		WebResponse response=queryService.queryPage(start, limit, a, tableName );
		if(tableName.contains("统计局涉税信息表")) {
			DataList datalist=(DataList) response.get("value");
			String dl=(String) datalist.get(0).get("value");
			JSONArray myJsonArray = JSONArray.fromObject(dl);
			response.put("value", myJsonArray);
		}
		
		return response;
	}
	/**
	 *  根据上传者Id删除三方数据特定表中的数据
	 * @param id
	 * @param tableName
	 * @param state
	 * @return
	 */
	@RequestMapping(value = "/deleteByUploadId.do") 
	public boolean deleteByUploadId(Integer id, String tableName, int state) {
		log.debug(state);
		if(state==2||state==5)
		{
			excelService.deleteByUploadId(id,tableName);
			return true;
		}else
		{
			return false;
		}
	}
	/**
	 * 查询数据表的数据
	 * @param start
	 * @param limit
	 * @param tableName
	 * @param begintime
	 * @param deadline
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(value = "/listTableData.do")
	public WebResponse listTableData(Integer start, Integer limit, String tableName,
			String begintime, String deadline) throws ParseException {
		// 获取
		log.debug(tableName);
		String sql="select b.startTime,b.endTime ,b.batchNo,a.* from ["+tableName+"] as a inner join [uploadRecords] as b on a.uploadId=b.id and b.tableName=? and b.startTime>=? and b.endTime<=?";	
		return queryService.queryPage(start, limit,sql,tableName,begintime,deadline);

	}
}

