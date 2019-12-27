<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--[if IE]><![endif]-->
<!--[if IE 8 ]>    <html lang="zh" class="ie8"> 
 <link rel="stylesheet" type="text/css" href="show.css"> 

  <![endif]-->
<!--[if IE 9 ]>    <html lang="zh" class="ie9">    <![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css"
	href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script src="extjs/ext-all.js" type="text/javascript"></script>
<script src="extjs/packages/ext-locale/build/ext-locale-zh_CN.js"
	type="text/javascript"></script>
<script type="text/javascript">
	function getQueryString(name)//获取jsp之后的序列
	{
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		//window.location.search 用以获取请求的参数，即url中"?"后面的部分
		var result = window.location.search.substr(1).match(reg);
		if (result != null)
			return result ? decodeURIComponent(result[2]) : null;
		return "";
	}
var taxId = getQueryString("id")
var tableName = getQueryString("tableName");
var itemsPerPage=50;
var main = Ext.create('Ext.panel.Panel',{
	region: 'center',
	layout:'fit',
	title: '历史数据查询'
})
Ext.onReady(function(){
	Ext.create('Ext.container.Viewport', {
		layout : 'border',
		items : [main]
	}).show();
	Ext.Ajax.request({
		url : 'system/dataTable/getColumnsAndFields.do',
		params : {
			tableName : tableName,
		},
		success : function(response) {
			var obj = Ext.decode(response.responseText);
			var store = Ext.create('Ext.data.Store', {
				pageSize : itemsPerPage,
				fields : obj.fields,
				proxy : {
					type : 'ajax',
					url : 'dataListByUploadId.do',
					extraParams : {
						//				    	    	  	    	   		tableName: tableList.getValue(),
						tableName : tableName,
						id : taxId
					},
					reader : {
						type : 'json',
						rootProperty : 'value',
						totalProperty : 'totalCount'
					}
				},
				autoLoad : true
			});
			var panel = Ext.create('org.data.view', {
				store : store,
				columns : obj.columns,
				tablename : tableName,
				uploadId : taxId,
			});
			main.add(panel);
			/* var win = Ext.create('Ext.window.Window', {
				layout : 'fit',
				modal : true,
				items : [ panel ]
			})
			win.show(); */
		},
		failure : function(response) {
			Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
		}
	})
})	
</script>
<title>万州区税收征管保障信息系统</title>
</head>
<body>

</body>
</html>