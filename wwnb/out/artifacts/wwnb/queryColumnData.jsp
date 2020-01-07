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
<title>万州区税收征管保障信息系统</title>
<link rel="stylesheet" type="text/css"
    href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script src="extjs/ext-all.js"></script>
<script src="extjs/packages/ext-locale/build/ext-locale-zh_CN.js"></script>
<script src="extjs/json2.js"></script>
<script src="extjs/MonthField.js"></script>
<script>
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     //window.location.search 用以获取请求的参数，即url中"?"后面的部分
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)
        return  r?decodeURIComponent(r[2]):null; 
    return "";
} 
var columnName=getQueryString('columnName');
var compareName=getQueryString('compareName');
var conditionName=getQueryString('conditionName');
var columnType=getQueryString('columnType');
log(columnName)
log(compareName)
log(conditionName);
log(columnType);
var welcome = Ext.create("Ext.panel.Panel", {
		region : 'center',
		layout : 'fit',
		id : 'columnDataList',
		autoScroll : true
	});

var p = Ext.getCmp('columnDataList');//获取面板
var itemsPerPage=50;
Ext.Ajax.request({
	url : 'dataSearch/getTableNames.do',
	params : {
		 columnName: columnName,
		 compareName: compareName,
		 conditionName: conditionName,
		 columnType: columnType
	},
	success : function(response) {
		var res = Ext.decode(response.responseText);
		var tableNames = res.value;
		var i=1;
		if(tableNames.length==0){
			Ext.Msg.alert('提示',"无数据，请检查所选查询条件是否有效")
		}else{
			log(i++)
			log(tableNames);
			var menuStore = Ext.create('Ext.data.TreeStore', {
				proxy: {
					type: 'ajax',
			        url: 'queryColumnData/createTableTree.do',//'enterpriseRelated/createTableTree.do',
			        reader: {
			            type: 'json'
			        },
			        extraParams:{
			        	tableNames: tableNames
			        }
				},
				autoLoad : true
			});
			var menu = Ext.create('Ext.tree.Panel', {
				region : "west",
				collapsed: false ,
				collapsible: true,
				//title: enterpriseName,
				autoScroll: true,
				width : 350,
				rootVisible:false,
				store: menuStore,
				listeners: {
					selectionchange : function(me, selected, eOpts) {
						var data = selected[0].data;
						var p =Ext.getCmp('enterpriseData');
						window.location.href="#"+data.id;
					}
				}
			});
			var main=Ext.getCmp('queryColumnMain');
			main.add(menu);
			for(var i in tableNames){
				var tableName = tableNames[i];
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
							 autoLoad: false,
								fields: columnsAndFields.fields,
								pageSize: itemsPerPage, // items per page
								proxy:{	
									url: 'dataSearch/getData.do',
									type: 'ajax',
									reader:{
										type : 'json',
										rootProperty: 'value',
										totalProperty: 'totalCount'
									}
								},
								listeners : {
									beforeload : function(store, operation, eOpts) {
										store.getProxy().setExtraParams({
											 tableName:tableName,
											 columnName: columnName,
											 compareName: compareName,
											 conditionName: conditionName,
											 columnType: columnType
										});
									}
								}
						 });
						store.load({
						    params:{
						    	start: 0,
						        limit: itemsPerPage
						    }
						});
						var grid = Ext.create('Ext.grid.Panel',{
							store: store,
							title: tableName,
							id: tableName,
							columns: columns,
							viewConfig : {
								enableTextSelection : true
							},
							tbar : new Ext.Toolbar({
								items : [ {
									//id : 'downExcelButton',//注释解决butoon消失问题
									text : "导出Excel",
									handler : function() {
										//Ext.Msg.alert('提示消息框',this.ownerCt.ownerCt.title );
										log(tableName)
										log(columnName)
										log(compareName)
										log(conditionName)
										log(columnType)
										window.location.href = encodeURI('downExcelbyTableNameAndCondition.do?tableName=' + this.ownerCt.ownerCt.title+'&columnName='+columnName+'&compareName='+compareName+'&conditionName='+conditionName+'&columnType='+columnType);
									}
								}

								]
							}),
						    dockedItems: [{
						        xtype: 'pagingtoolbar',
						        store: store,   // same store GridPanel is using
						        dock: 'bottom',
						        displayInfo: true,
						        displayMsg:'显示{0}-{1}条，共{2}条',  
						        emptyMsg:'无数据' 
						    }]
						});
						p.add(grid);
					},
					failure : function(response) {
						Ext.MessageBox.alert("提示", "查询失败");
					}
				});
			}
		}
		
	},
	failure : function(response) {
		Ext.MessageBox.alert("提示", "查询失败");
	}
});

Ext.onReady(function() {
	var main = Ext.create('Ext.container.Viewport', {
		layout : 'border',
		id: 'queryColumnMain',
		items : [ welcome ]
	});
	main.show();
})
</script>

</head>
<body>
</body>
</html>