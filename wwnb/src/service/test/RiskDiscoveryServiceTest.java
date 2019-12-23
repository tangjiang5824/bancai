package service.test;

import static org.junit.Assert.*;

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
import service.RiskDiscoveryService;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { DataSourceConfig.class,  TransactionConfig.class,
		ServiceConfig.class })
public class RiskDiscoveryServiceTest {
	@Autowired
	private RiskDiscoveryService riskDiscoveryService;
	
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
	public void testAutomaticDiscovery() {
		riskDiscoveryService.automaticDiscovery();
	}

	@Test
	public void testManualDiscovery() {
		//System.out.println(riskDiscoveryService.manualDiscovery("区房管局涉税信息表一（新建商品房销售信息）", "2017-01", "2017-02"));

	}

}
