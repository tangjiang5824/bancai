package com.bancai.service.test;

import com.bancai.BancaiApplication;
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
		//DB.doQuery(0, 10, new Condition("name","=","1"), "[user]");
		System.out.println(queryService.queryPage(1, 10, new Condition("name","=","1"), "[user]"));
	}

}
