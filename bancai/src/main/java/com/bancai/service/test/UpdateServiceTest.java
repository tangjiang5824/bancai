package com.bancai.service.test;




import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.bancai.service.UpdateService;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = BancaiApplication.class)
public class UpdateServiceTest {
//	@Autowired
//	private UpdateService updateService;
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
	public void testBatchUpdate() {
//		List<Object[]> p=new ArrayList<Object[]>();
//		p.add(new Object[] {3,4});
//		p.add(new Object[] {4,5});
//		p.add(new Object[] {3,6});
//		updateService.batchUpdate("insert into A values(?,?)",p);
		//updateService.batchUpdate("insert into A values(1,1)","insert into A values(2,1)","update A set prince=100");
		String s="[{\"NOTEWELLNAME\":\"123\"},{\"NOTEWELLNAME\":\"121213\"}]";
		JSONArray array=new JSONArray(s);
		for(int i=0;i<array.length();i++){
			JSONObject object=array.getJSONObject(i);
			System.out.println(object.getString("NOTEWELLNAME"));
		}

	}


}
