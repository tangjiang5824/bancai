package com.bancai.service.test;

import com.bancai.BancaiApplication;


import com.bancai.cg.dao.materialinfodao;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Repository;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = BancaiApplication.class)
public class QueryServiceTest {



	@Autowired
	private materialinfodao ud;

	@Test
	public void testSelect() {

		ud.findAll();

	}

}
