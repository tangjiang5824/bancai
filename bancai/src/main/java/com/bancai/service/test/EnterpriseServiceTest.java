package com.bancai.service.test;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.bancai.BancaiApplication;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;




import com.bancai.service.EnterpriseService;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = BancaiApplication.class)
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
