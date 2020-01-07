package service.test;

import static org.junit.Assert.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

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
import service.EnterpriseService;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { DataSourceConfig.class,  TransactionConfig.class,
		ServiceConfig.class })
public class EnterpriseServiceTest {
	@Autowired
	private EnterpriseService enterpriseService;
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
	public void testFindExistData() throws SQLException {
		Map<String,List<String>> map=enterpriseService.findExistData("91500101MA5UNY5707", null, null,0);
		System.out.println(map);
		map=enterpriseService.findExistData("91500101MA5UNY5707", null, null,1);
		System.out.println(map);
	}

}
