package com.bancai.service.test;

import com.bancai.BancaiApplication;
import com.bancai.domain.DataList;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.bancai.db.Condition;
import com.bancai.service.QueryService;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = BancaiApplication.class)
public class QueryServiceTest {
	@Autowired
	private QueryService queryService;
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testSelect() {
//		class Emp{
//			private int id;
//			private int p;
//			public int getId() {
//				return id;
//			}
//			public void setEmpId(int id) {
//				this.id = id;
//			}
//			public int getP() {
//				return p;
//			}
//			public void setP(int p) {
//				this.p = p;
//			}
//			public Emp(int id, int p){
//				this.id = id ;
//				this.p = p ;
//			}
//		}
//		class MyComparator implements Comparator{
//
//			public int compare(Object o1,Object o2) {
//				Emp e1=(Emp)o1;
//				Emp e2=(Emp)o2;
//				if(e1.getP()<e2.getP())
//					return 1;
//				else
//					return 0;
//			}
//		}
//		DataList dataList11 = new DataList();
//		String productTypeId = "1";
//		dataList11 = queryService.query("select * from matchrules where productTypeId=?",productTypeId);
//		System.out.println(dataList11);
//		ArrayList pList = new ArrayList();
//		ArrayList ele = new ArrayList();
//		String id = "";
//		String p = "";
//		for (int i = 0; i < dataList11.size(); i++) {
//			id = dataList11.get(i).get("id")+"";
//			p = dataList11.get(i).get("priority")+"";
//			ele.add(id);
//			ele.add(p);
//			pList.add(ele);
//		}
		//DB.doQuery(0, 10, new Condition("name","=","1"), "[user]");
//		System.out.println(queryService.queryPage(1, 10, new Condition("name","=","1"), "[user]"));
	}

}
