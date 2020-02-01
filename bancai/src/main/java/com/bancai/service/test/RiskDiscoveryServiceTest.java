package com.bancai.service.test;

import com.bancai.BancaiApplication;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.bancai.service.RiskDiscoveryService;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = BancaiApplication.class)
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
