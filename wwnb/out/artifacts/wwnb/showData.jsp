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
<script src="extjs/ext-all.js"></script>
<script src="extjs/packages/ext-locale/build/ext-locale-zh_CN.js"></script>
<script src="extjs/json2.js"></script>
<script type="text/javascript">
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     //window.location.search 用以获取请求的参数，即url中"?"后面的部分
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)
        return  r?decodeURIComponent(r[2]):null; 
    return "";
} 
	var itemsPerPage=50;
	//var data=localStorage.getItem("taxData");
	var tableName=getQueryString("taxTableName");
	var startTime=getQueryString("startTime");
	var endTime=getQueryString("endTime");
	var id=getQueryString("taxTableId");
	//console.log(id)
	var win = Ext.create('Ext.panel.Panel',{
			layout: 'fit',
			region : 'center'
		});
	Ext.Ajax.request({
		async: false, //设置为同步请求
		url : 'system/dataTable/getColumnsAndFields.do',
		params : {
			tableName : tableName
		},
		success : function(response) {
			var columnsAndFields = Ext.decode(response.responseText);
			var columns = columnsAndFields.columns;
			var fields = columnsAndFields.fields;
			var store = Ext.create('Ext.data.Store',{
				pageSize: itemsPerPage, 
				fields: fields,
				proxy: {
			         type: 'ajax',
			         url: 'dataListByUploadId.do',
			         extraParams : {
			    	   		tableName: tableName,
			    	   		id: id
	           		},
			         reader: {
			             type: 'json',
			             rootProperty: 'value',
			             totalProperty: 'totalCount'
			         }
			     },
			     autoLoad: false
	});
		store.load({
			    params:{
			    		start: 0,
			        limit: itemsPerPage
			    }
			});
		var panel = Ext.create('tax.data.window',{
			store: store,
			columns: columns,
			tableName: tableName,
			id:id
		});
		 //var win=Ext.getCmp('showDataPanel')
		 win.add(panel);
		},
		failure: function(){
			}
		});
	Ext.onReady(function(){
		var main = Ext.create('Ext.container.Viewport',{
			layout : 'border',
			items : [ win ]
		});
		main.show(); 
	})
</script>
<title>万州区税收征管保障信息系统</title>
</head>
<body>

</body>
</html>