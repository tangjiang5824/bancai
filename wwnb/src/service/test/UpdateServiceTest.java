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
import service.UpdateService;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { DataSourceConfig.class,  TransactionConfig.class,
		ServiceConfig.class })
public class UpdateServiceTest {
	@Autowired
	private UpdateService updateService;
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
		updateService.batchUpdate("insert into A values(1,1)","insert into A values(2,1)","update A set prince=100");
	}

}
