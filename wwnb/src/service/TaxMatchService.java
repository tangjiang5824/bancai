package service;



import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import domain.DataList;
import domain.DataRow;

@Service
public class TaxMatchService extends BaseService {
	private  Logger log = Logger.getLogger(TaxMatchService.class);
	@Autowired
	private QueryService queryService;
	@Transactional
	public void autoMatch() {
		DataList matchingInfoList=queryService.query("select * from matchingInfo");
		log.debug("共有"+matchingInfoList.size()+"条待匹配字段");
		int i=0;
		for(DataRow matchingInfoRow:matchingInfoList) {
			i++;
			log.debug("正在处理第"+i+"条");
			String taxCode=(String) matchingInfoRow.get("taxCode");
			String taxName=(String) matchingInfoRow.get("taxName");
			int uploadId=(int) matchingInfoRow.get("uploadId");
			String tableName=(String)matchingInfoRow.get("tableName");
			String name=(String)matchingInfoRow.get("name");
			String code=gettaxCode(name);
			if(code!=null) {
				log.debug("检测到完全匹配的纳税人名称");
				update3rdDataTaxNum(tableName, name, code, taxCode, taxName, uploadId);
				delMatchingInfo(uploadId,name,taxName);
				
			}else {
				log.debug("未检测到相应纳税人名称，开始进行模糊匹配");
				DataList enterpriseInfoList=queryService.query("select [纳税人名称],[社会信用代码(纳税人识别号)]  from [企业信息]");
				for(DataRow enterpriseInfoRow:enterpriseInfoList) {
					float degree=getSimilarityDegree((String) enterpriseInfoRow.get("纳税人名称"),(String)matchingInfoRow.get("name"));
					if(degree>=0.85) {
						log.debug((String)enterpriseInfoRow.get("社会信用代码(纳税人识别号)"));
						DataList dl=queryService.query("select * from similarInfo where matchId=? and code=?",matchingInfoRow.get("id"),enterpriseInfoRow.get("社会信用代码(纳税人识别号)"));
						if(dl==null||dl.size()<=0) {
							addSimilarInfo(tableName,name,(String) enterpriseInfoRow.get("纳税人名称"),
									(String)enterpriseInfoRow.get("社会信用代码(纳税人识别号)"),(int)matchingInfoRow.get("id"));
						}
						
					}
				}
			}
		}
	}
	
	@Transactional
	public void editDataAndDeleteMatchInfo(String tableName,String taxName,String taxCode,String name,String code,int id,int uploadId) {
		
		update3rdDataTaxNum(tableName, name, code, taxCode, taxName, uploadId);
		delMatchingInfo(uploadId,name,taxName);
		
		
	}
	
	@Transactional
	public void autoInputMatchInfo(String tableName, String trueName, String oldName, String code, int id) {
		DataList matchInfoList=queryService.query("select * from matchingInfo where id=?", id);
		if(matchInfoList!=null&&matchInfoList.size()>0) {
			DataRow matchInfo=matchInfoList.get(0);
			String taxCode=(String) matchInfo.get("taxCode");
			String taxName=(String) matchInfo.get("taxName");
			int uploadId=(int) matchInfo.get("uploadId");
			update3rdDataTaxNum(tableName, oldName, code, taxCode, taxName, uploadId);
			delMatchingInfo(uploadId,oldName,taxName);
		}
			
	
	}

	private void delMatchingInfo(int uploadId,String name,String taxName) {
		jo.update("delete from matchingInfo where uploadId=? and taxName=? and name=?", uploadId,taxName,name);
	}

	private void update3rdDataTaxNum(String tableName, String oldName, String code, String taxCode, String taxName,
			int uploadId) {
		String sql="update ["+ tableName+"] set ["+taxCode+"]=? where ["+taxName+"]=? and id=?";
		log.debug(sql);
		jo.update(sql,code,oldName,uploadId);
	}
	
	
	
	
	//上传第三方数据时进行匹配
	@Transactional
	public void upDataMatch(String tableName,int uploadId) {
		
		//扫描新上传的数据，进行匹配，能完全匹配的填入数据表，否则记录在MatchingInfo中，且进行模糊匹配
		upDataScanAndHandle(tableName, uploadId);
		//更新上传记录中的状态为已匹配（state=2）
		jo.update("update uploadRecords set state=2 where id=?", uploadId);		
		
	}

	private void upDataScanAndHandle(String tableName, int uploadId) {
		Map<String, String> NameNumPair= getNameNumPair(tableName);
		 for (String taxCode : NameNumPair.keySet()) { 
			 	String taxName=NameNumPair.get(taxCode);
			 	//找出不能匹配的纳税人名称并添加到MatchingInfo中
				UnMatched(tableName, uploadId, taxCode, taxName);
			 	//找出能够匹配的纳税人名称并更新器纳税人识别号
				FullyMatched(tableName, uploadId, taxCode, taxName);
				
		}
	}

	private void UnMatched(String tableName, int uploadId, String taxCode, String taxName) {
		//从数据库中找到不能匹配的纳税人名称
		String sql=String.format("select id,[%s] as name FROM [%s] where [%s]='' and uploadId=%d and id not in"
				+ "(select b.id FROM [企业信息] as a left join [%s] as b on a.[纳税人名称]=b.[%s] "
				+ "where b.uploadId=%d and b.[%s]='' group by b.id HAVING COUNT(*)=1)", 
				taxName,tableName,taxCode,uploadId,tableName,taxName,uploadId,taxCode);
		DataList unmatchedList=queryService.query(sql);
		//将第三方数据中不能匹配的数据插入matchingInfo中
		DataList uploadRecord=queryService.query("select * from uploadRecords where id=?", uploadId);
		for(DataRow unmatchedRow:unmatchedList) {
			int id=(int) unmatchedRow.get("id");
			String startTime=(String) uploadRecord.get(0).get("startTime");
			String endTime=(String) uploadRecord.get(0).get("endTime");
			String name=(String) unmatchedRow.get("name");
			addMatchingInfo(tableName,startTime,endTime,id,name,taxCode,taxName);
		}
	}

	private void FullyMatched(String tableName, int uploadId, String taxCode, String taxName) {
		//从数据库中找到能够完全匹配的纳税人名称/纳税人识别号
		String sql=String.format("select b.id as id,a.纳税人名称 as name,a.[社会信用代码(纳税人识别号)] as code FROM [企业信息] as a left join [%s] as b "
				+ "on a.[纳税人名称]=b.[%s] where b.id in(select b.id FROM [企业信息] as a left join [%s] as b "
				+ "on a.[纳税人名称]=b.[%s] where b.uploadId=%d and b.[%s]='' "
				+ "group by b.id HAVING COUNT(*)=1)", tableName,taxName,tableName,taxName,uploadId,taxCode);
		DataList matchedList=queryService.query(sql);
		log.debug(matchedList);
		//将第三方数据中能够完全匹配的数据更新，插入纳税人识别号
		for(DataRow matchedRow:matchedList) {
			int id=(int) matchedRow.get("id");
			String name=(String) matchedRow.get("name");
			String code=(String) matchedRow.get("code");	
			updateUpData(tableName,id,name,code,taxCode,taxName);
		}
	}
	
	
	
	
	private void addSimilarInfo(String tableName,String oldName,String trueName,String code,int id) {
		
		//把相似的结果插入数据库
		String sql="insert into similarInfo values(?,?,?,?,?)";
		jo.update(sql,tableName,oldName,trueName,code,id);

		
	}
	//上传金三数据时进行匹配
	@Transactional
		public void gold3Match(DataList goldDataList) {
			for(Map<String, Object> goldData:goldDataList) {
				String name=(String) goldData.get("纳税人名称");
				DataList dataList=queryService.query("select * from matchingInfo where name=?", name);
				
				log.debug("共需要匹配数据"+dataList.size()+"条");
				int i=0;
				if(dataList!=null) {
					for(DataRow row:dataList) {
						if(log.isDebugEnabled())
						{
							log.debug("正在处理第"+i+"条");
							i++;
						}
						String tableName=(String) row.get("tableName");
						int uploadId= (int) row.get("uploadId");
						String code=(String) goldData.get("社会信用代码(纳税人识别号)");
						String taxCode=(String) row.get("taxCode");
						String taxName=(String) row.get("taxName");
						updateUpData(tableName,uploadId,name,code,taxCode,taxName);
						deleteMatchingInfo(tableName,uploadId,name,taxCode,taxName);
					}
					
				}
			}
		}
	
	private void deleteMatchingInfo(String tableName, int uploadId, String name,  String taxCode,
			String taxName) {
		String sql="delete from matchingInfo where taxName=? and taxCode=? and tableName=? and uploadId=? and name=?";
		jo.update(sql,taxName,taxCode,tableName,uploadId,name);
	
		
	}
	private int addMatchingInfo(String tableName, String startTime, String endTime, int uploadId, String name, String taxCode,
			String taxName) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jo.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
				String sql="insert into matchingInfo (taxName,taxCode,tableName,uploadId,name,startTime,endTime) values(?,?,?,?,?,?,?)";
				PreparedStatement ps =conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
				ps.setString(1, taxName);
				ps.setString(2, taxCode);
				ps.setString(3, tableName);
				ps.setInt(4, uploadId);
				ps.setString(5, name);
				ps.setString(6, startTime);
				ps.setString(7, endTime);
				return ps;
			}
			
		}, keyHolder);
		return keyHolder.getKey().intValue();
	}
	private void updateUpData(String tableName,int id,String name,String code, String taxCode, String taxName) {
		String sql=String.format("update [%s] set [%s]=? where [%s]=? and id=?", tableName,taxCode,taxName);
		jo.update(sql,code,name,id);

	}
	
	private String gettaxCode(String taxName) {
		DataList dataList=queryService.query("select * from [企业信息] where 纳税人名称=?", taxName);
	
		if(dataList!=null&&dataList.size()>0) {
			System.out.println(dataList);
			return dataList.get(0).get("社会信用代码(纳税人识别号)").toString();
		}else {
			return null;
		}
	}


	//得到一张表的纳税人名称/纳税人识别号表项名
	public  Map<String, String> getNameNumPair(String tableName){
		
		DataList taxCodeList=queryService.query("select * from dataTableDefinition where tableName=? and taxUnitCode=1", tableName);
		Map<String, String> map= new HashMap<String,String>();
		for(DataRow tableCodeName:taxCodeList) {
			String taxCode=(String) tableCodeName.get("text");
			String taxName=(String) tableCodeName.get("taxUnitName");
			if(taxName!=null&&taxCode!=null) {
				
				map.put(taxCode, taxName);
				
			}
		}	
		return map;
	}
	
	
	private  float getSimilarityDegree(String s1,String s2) {	
		if(s1==null||s2==null)
			return 0;
		String shorter = null;
		String longer=null;
		if(s1.length()>s2.length()) {
			shorter=s2;
			longer=s1;
		}else {
			shorter=s1;
			longer=s2;
		}
		float degree=0;
		int i=0,j=0,num=0,k=0;

			for(;i<shorter.length();i++) {
				for(;j<longer.length();j++) {
					if(shorter.charAt(i)==longer.charAt(j)){
						
						num++;
						k=j+1;
						break;
					}
				}
				j=k;
				if(j>=longer.length()) {
					break;
				}
				
			}
			degree=(float)num/shorter.length();
		
		return degree;
	}

}
