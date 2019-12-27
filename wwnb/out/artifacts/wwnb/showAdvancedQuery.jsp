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
<script src="extjs/json2.js" type="text/javascript"></script>
<script type="text/javascript">
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		//window.location.search 用以获取请求的参数，即url中"?"后面的部分
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return r ? decodeURIComponent(r[2]) : null;
		return "";
	}
	var welcome = Ext.create("Ext.panel.Panel", {
		region : 'center',
		layout : 'accordion',
		id : 'dataList',
		autoScroll : true
	});
	var conditions = Ext.decode(getQueryString("sql"));//Ext.decode(localStorage.getItem("advancedQueryData"));
	var p = Ext.getCmp('dataList');//获取面板
	var itemsPerPage = 50;
	for (var i = 0; i < conditions.length; i++) {
		Ext.Ajax.request({
			async : false, //设置为同步请求
			url : 'system/dataTable/getColumnsAndFields.do',
			params : {
				tableName : conditions[i].tableName
			},
			success : function(response) {
				var tableName = conditions[i].tableName;
				var condition = JSON.stringify(conditions[i].condition);
				log("1111111111"+condition)
				var columnsAndFields = Ext.decode(response.responseText);
				var store = Ext.create('Ext.data.Store', {
					autoLoad : false,
					fields : columnsAndFields.fields,
					pageSize : itemsPerPage, // items per page
					proxy : {
						url : 'query/advancedQuery/list.do',
						type : 'ajax',
						reader : {
							type : 'json',
							rootProperty : 'value',
							totalProperty : 'totalCount'
						}
					},
					listeners : {
						beforeload : function(store, operation, eOpts) {
							store.getProxy().setExtraParams({
								tableName : tableName,
								condition : condition
							});
						}
					}
				});
				store.load({
					params : {
						start : 0,
						limit : itemsPerPage
					}
				});
				var grid = Ext.create('Ext.grid.Panel', {
					store : store,
					title : tableName,
					viewConfig : {
						enableTextSelection : true
					},
					tbar : new Ext.Toolbar({
						items : [ {
							id : 'downExcelButton',
							text : "导出Excel",
							handler : function() {
								window.location.href = encodeURI('downExcelbyCondition.do?tableName=' + tableName+'&condition='+condition);
							}
						}

						]
					}),
					columns : columnsAndFields.columns,
					dockedItems : [ {
						xtype : 'pagingtoolbar',
						store : store, // same store GridPanel is using
						dock : 'bottom',
						displayInfo : true,
						displayMsg : '显示{0}-{1}条，共{2}条',
						emptyMsg : '无数据'
					} ]
				});
				p.add(grid);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "查询失败");
			}
		});
	}
	Ext.onReady(function() {
		var main = Ext.create('Ext.container.Viewport', {
			layout : 'border',
			items : [ welcome ]
		});
		main.show();
	})
</script>
<title>万州区税收征管保障信息系统</title>
</head>
<body>

</body>
</html>