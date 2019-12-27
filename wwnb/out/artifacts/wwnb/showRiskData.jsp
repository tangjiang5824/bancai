<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--[if IE]><![endif]-->
<!--[if IE 8 ]>    <html lang="zh" class="ie8"> 
 <link rel="stylesheet" type="text/css" href="show.css"> 

  <![endif]-->
<!--[if IE 9 ]>    <html lang="zh" class="ie9">    <![endif]-->>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css"
	href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script src="extjs/ext-all.js" type="text/javascript"></script>
<script src="extjs/packages/ext-locale/build/ext-locale-zh_CN.js"
	type="text/javascript"></script>
<script src="extjs/util.js"></script>
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

var itemsPerPage = 100;
var time=getQueryString("time");
log(time)
var main = Ext.create('Ext.panel.Panel',{
	region: 'center',
	layout:'fit',
	title: '校验结果'
});
Ext.onReady(function(){
	var tableFC=Ext.create("tax.check.TablesFieldsAndColumns");
	var standard = getQueryString("standard");
	var id=getQueryString("id");
	var store = Ext.create('Ext.data.Store',{
  	  	pageSize: itemsPerPage, 
  	  	fields: tableFC.getFields(standard),
  		proxy: {
  		        type: 'ajax',
  	  	         url: 'tax/check/listCheckResultByLogId.do',
  		         extraParams : {
    		        	    standard: standard,
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
		var grid = Ext.create('Ext.grid.Panel',{
			store: store,
			columns: tableFC.getColumns(standard),
			viewConfig : {
				enableTextSelection : true
			},
			title: standard,
			dockedItems:[{
				xtype : 'pagingtoolbar',
				store : store, // same store GridPanel
				dock : 'bottom',
				displayInfo : true,
				displayMsg : '显示{0}-{1}条，共{2}条',
				emptyMsg : '无数据',
				beforePageText : '第',
				afterPageText : '页，共{0}页'
			},{
				xtype : 'toolbar',
				dock : 'bottom',
				items : [ {
					text : '导出excel',
					handler : function() {
						/* var url='downloadExcelbyID.do?excelName=' + tableName + '&tablename=' + tableName + '&id=' + id;
						url=encodeURI(url);
						window.open(url,"_blank"); */
					}
				}]
			}]
			
		});
		main.add(grid);
          /* var panel = Ext.create('tax.data.view',{
          		store: store,
          		columns:  tableFC.getColumns(tableName),
          		standardName: standardName,
          		dealTime: time,
          	});
          	main.add(panel) */
	Ext.create('Ext.container.Viewport', {
		layout : 'border',
		items : [main]
	}).show();
})
</script>
<title>万州区税收征管保障信息系统</title>
</head>
<body>

</body>
</html>