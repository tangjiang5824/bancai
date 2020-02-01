package com.bancai.service.test;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import com.bancai.BancaiApplication;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.bancai.service.ExcelService;
import com.bancai.util.Excel;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = BancaiApplication.class)
public class ExcelServiceTest {
	@Autowired
	private ExcelService excelService;
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
	public void testCreateExcelFromTable() {
		
		Excel excel=excelService.createExcelFromTable("土地信息查询", 574);
		try {
			excel.write(new FileOutputStream("土地信息查询.xls"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
