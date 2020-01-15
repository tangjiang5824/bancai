package zzy.controller;

import commonMethod.QueryAllService;
import db.mysqlcondition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.ProjectService;
import service.QueryService;
import service.UpdateService;
import vo.WebResponse;

import java.io.IOException;
import java.text.ParseException;

@RestController
public class SelectAllBasic_material_oldpanel_product_controller {

	@Autowired
	private QueryAllService queryAllService;

	/*
	 * 查询所有的oldpanelbasicinfo
	 * */
	@RequestMapping(value="/material/findOldpanel_oldpaneltypeList.do")
	public WebResponse findOldpanelbasicinfoList(Integer start, Integer limit) throws IOException {
		String tableName = "oldpanel_oldpaneltype";
		mysqlcondition c=new mysqlcondition();
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}
	/*
	 * 查询所有的productbasicinfo
	 * */
	@RequestMapping(value="/material/findProductbasicinfoList.do")
	public WebResponse findProductbasicinfoList(Integer start, Integer limit) throws IOException {
		String tableName = "productbasicinfo";
		mysqlcondition c=new mysqlcondition();
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

	/*
	 * 查询所有的materialbasicinfo
	 * */
	@RequestMapping(value = "/material/findMaterial_materialtypeList.do")
	public WebResponse findMaterialbasicinfoList(Integer start, Integer limit) throws ParseException {

		String tableName = "material_materialtype";

		mysqlcondition c=new mysqlcondition();
		WebResponse wr=queryAllService.queryDataPage(start, limit, c, tableName);
		return wr;
	}

}
