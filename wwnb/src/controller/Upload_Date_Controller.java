package controller;

import javax.servlet.http.HttpSession;

import domain.DataList;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.omg.CORBA.PRIVATE_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import antlr.collections.List;
import service.QueryService;
import service.Upload_Data_Service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@ResponseBody
@Controller
public class Upload_Date_Controller {
	private Logger log = Logger.getLogger(Upload_Date_Controller.class);
	@Autowired
	private Upload_Data_Service Upload_Data_Service;
	@Autowired
	private QueryService queryService;
	
	@RequestMapping(value="/do_Update.do")
	public boolean addData(String s,String tableName,String materialType,HttpSession session) {
		
		JSONArray jsonArray =new JSONArray(s);
		String userid = (String)session.getAttribute("userid");
		for(int i=0;i< jsonArray.length();i++) {
			JSONObject jsonTemp = jsonArray.getJSONObject(i);
			//获得第i条数据的各个属性值
	    	//int id=Integer.parseInt(jsonTemp.get("id"));
	    	System.out.println(jsonTemp.get("品号"));
	    	int proNum=Integer.parseInt(jsonTemp.get("品号").toString());
	    	String Length=(String) jsonTemp.get("长");
			String Type=(String) jsonTemp.get("类型");
			String Width=(String) jsonTemp.get("宽");
	    	String scale=(String) jsonTemp.get("规格");
	    	String respo=(String) jsonTemp.get("库存单位");
	    	String respoNum=(String) jsonTemp.get("仓库编号");
	    	int count=Integer.parseInt(jsonTemp.get("数量").toString());
	    	double cost= Double.parseDouble(jsonTemp.get("数量").toString()); //(float)jsonTemp.get("数量");
	    	String location=(String) jsonTemp.get("存放位置");
	    	int material_type = Integer.parseInt(materialType);
	    	//对每条数据处理
	    	Upload_Data_Service.addData(tableName,proNum,Length,Type,Width,scale,respo,respoNum,count,cost,location,material_type,userid);
		}
		return true;
	}
	@RequestMapping(value="/generateproduct.do")
	public boolean add_project(String s,HttpSession session,String projectName,String startTime) {
		JSONArray jsonArray = new JSONArray(s);
		//生成project计划表
		String sql1="insert into project (userId,startTime,projectName,statusId) values(?,?,?,?) ";
		String userid = (String) session.getAttribute("userid");
		//插入到project表的同时返回projectId
		String projectId =Upload_Data_Service.insertDataToProject(sql1,userid,startTime,projectName)+"";

		for (int i = 0; i < jsonArray.length(); i++) {
			ArrayList arrayList=new ArrayList();
			JSONObject jsonTemp = jsonArray.getJSONObject(i);
			//获得第i条数据的各个属性值
			String Length = (String) jsonTemp.get("长");
			String Type = (String) jsonTemp.get("类型");
			String Width = (String) jsonTemp.get("宽");
			String count = jsonTemp.get("数量")+"";
			int number= Integer.parseInt(count);
			int changstart=Integer.parseInt(Length);
			int changend=changstart+100;
			int kuanstart= Integer.parseInt(Width);
			int kuanend=kuanstart+100;
			//查询product表里面是否有相应的产品
			DataList list = queryService.query(
					"select * from product where 长=? and 类型=? and 宽=?",
					Length, Type, Width);
			if(list.size()!=1)
			{
				log.error("查询产品表product不为一个结果！ 结果为"+list.size());
				return false;
			}
			String productId=list.get(0).get("id")+"";

			String sql2="insert into planlist (projectId,productId,number) values(?,?,?)";
			//插入到planlist表的同时返回planlistid
			String planlistId=Upload_Data_Service.insertDataToPlanlist(sql2,projectId,productId,count)+"";
			while (number!=0){
				//通过product的长、类型、宽模糊查询material_info视图数量大于0，materialtype=0或1的值

				//只返回新旧版项
				DataList material_info_head=queryService.query("select * from material_info where 类型=? and 长>=? and 长<=? and 宽>=? and 宽<=? and (materialtype=1 or materialtype=0) and 数量>0 order by materialtype",Type,changstart,changend,kuanstart,kuanend);

				for (int i1 = 0; i1 < material_info_head.size(); i1++) {
					if("0".equals(material_info_head.get(i1).get("materialType")+"")) {
						DataList rule_list = queryService.query(
								"select * from rule_union where productId=? and materialType=? and 规格='旧板' UNION select * from rule_union where productId=? and materialType=? and 规格<>'旧板'",
								productId, "0",productId, "0"
						);
						int do_num =0;
						for (int i2 = 0; i2 < rule_list.size(); i2++) {
							if("旧板".equals(rule_list.get(i2).get("规格"))) {
								Map<String,String> map = new HashMap<>();
								int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "");
								int have_num = Integer.parseInt(material_info_head.get(i1).get("数量") + "");
								int need_num_per=Integer.parseInt(rule_list.get(i2).get("number") + "");
								if(have_num<(number*need_num_per)) {  //拥有的件数少于要做的件数
									 res = have_num - (have_num / need_num_per) * need_num_per;//做完后剩余数量
									do_num = (have_num - res) / need_num_per;           //做的件数
								}else {
									res =have_num-(number*need_num_per);
									do_num = number;
								}
								map.put("name","旧版扣减");
								map.put("doNum",do_num+"");
								map.put("扣减数量",do_num*need_num_per+"");
								map.put("materialId",material_info_head.get(i1).get("materialId")+"");
								map.put("原本数量",material_info_head.get(i1).get("数量") + "");
								map.put("剩余数量",res+"");
								arrayList.add(map);
							}else{
								Map<String,String> map = new HashMap<>();
								int need_num=Integer.parseInt(rule_list.get(i2).get("number") + "")*do_num;
								//int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "")-need_num;  读不到原材料已有的数量，改用materialId直接扣减
								map.put("name",rule_list.get(i2).get("规格")+"");
								map.put("materialId",rule_list.get(i2).get("materialId")+"");
								map.put("扣减数量",need_num+"");
								arrayList.add(map);
							}

						}
						number=number-do_num;
						if(0==number)  break;
					}

				}
				if (0==number) break;

				for (int i1 = 0; i1 < material_info_head.size(); i1++) {
					if("1".equals(material_info_head.get(i1).get("materialType")+"")) {
						DataList rule_list = queryService.query(
								"select * from rule_union where productId=? and materialType=? and 规格='原材料' UNION select * from rule_union where productId=? and materialType=? and 规格<>'原材料'",
								productId, "1",productId, "1"
						);
						for (int i2 = 0; i2 < rule_list.size(); i2++) {
							if("原材料".equals(rule_list.get(i2).get("规格"))) {
								Map<String,String> map = new HashMap<>();
								//int have_num = Integer.parseInt(material_info_head.get(i1).get("数量") + "");
								int need_num_per=Integer.parseInt(rule_list.get(i2).get("number") + "");
								int all_need=number*need_num_per;//总共需要做的件数
								map.put("name","原材料扣减");
								map.put("doNum",number+"");
								map.put("materialId",material_info_head.get(i1).get("materialId")+"");
								map.put("扣减数量",all_need+"");
								arrayList.add(map);
							}else{
								Map<String,String> map = new HashMap<>();
								int need_num=Integer.parseInt(rule_list.get(i2).get("number") + "")*number;
								//int res=Integer.parseInt(material_info_head.get(i1).get("数量") + "")-need_num;  读不到原材料已有的数量，改用materialId直接扣减
								map.put("name",rule_list.get(i2).get("规格")+"");
								map.put("materialId",rule_list.get(i2).get("materialId")+"");
								map.put("扣减数量",need_num+"");
								arrayList.add(map);
							}

						}
						number=0;
						break;

					}

				}
			}

			for (int i1 = 0; i1 < arrayList.size(); i1++) {
				String sql3= "insert into projectlist (projectId,planProductId,materialStoreId,number) values (?,?,?,?)";
				HashMap<String,String> tmp= (HashMap<String, String>) arrayList.get(i1);
				String Num =tmp.get("扣减数量");
				String materialId=tmp.get("materialId");
				//返回全部表项
				DataList material_info_list =queryService.query(
						"select * from material_info where materialId=? and 数量>0 order by materialtype",materialId
				);
				String materialStoreId=material_info_list.get(0).get("id")+"";
				String projectListId =Upload_Data_Service.insertDataToProjectlist(sql3,projectId,productId,materialStoreId,Num)+"";

			}


		}
		return true;
	}
}
