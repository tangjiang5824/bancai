package service.test;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import config.DataSourceConfig;
import config.ServiceConfig;
import config.TransactionConfig;
import db.Condition;
import service.QueryService;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { DataSourceConfig.class,  TransactionConfig.class,
		ServiceConfig.class })
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
