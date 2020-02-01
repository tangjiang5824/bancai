/**
 * 获取url后的参数
 * @param {} name
 * @return {String}
 */
function getQueryString(name)
 {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      //window.location.search 用以获取请求的参数，即url中"?"后面的部分
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)
         return  r?decodeURIComponent(r[2]):null; 
     return "";
 } 
 function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth()+1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    var currentdate = date.getFullYear() + seperator1 + month;
    return currentdate;
}
function getBeforeFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var currentdate = date.getFullYear() + seperator1 + "01";
    return currentdate;
}
 var itemsPerPage=50;
var enterpriseName=getQueryString("enName");//localStorage.getItem("enterpriseName");
log(enterpriseName)
var taxId=getQueryString("id");
var initStartTime=Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -12), "Y-m");//getBeforeFormatDate();//getQueryString("startTime");//getNowFormatDate();
log(taxId)
log("s: "+initStartTime);
var initEndTime=Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, 0), "Y-m");//getNowFormatDate();
log("end: "+initEndTime);
//	var menuStore = Ext.create('Ext.data.TreeStore', {
//		proxy: {
//			type: 'ajax',
//	        url: 'enterpriseRelated/createTableTree.do',//'enterpriseRelated/createTableTree.do',
//	        reader: {
//	            type: 'json'
//	        },
//	        extraParams : {
//				taxId: taxId,
//				startTime: initStartTime,
//				endTime: endTime
//	        		}
//			}
//		});
var menuStore = Ext.create('Ext.data.TreeStore', {
	proxy: {
		type: 'ajax',
        url: 'enterpriseRelated/createTableTree.do',//'enterpriseRelated/createTableTree.do',
        reader: {
            type: 'json'
        }
	},
	listeners : {
				beforeload : function(menuStore, operation, eOpts) {
					log("initStartTime")
					menuStore.getProxy().setExtraParams({
						taxId: taxId,
						startTime: initStartTime,
						endTime: initEndTime
					});
				}
		},
		autoLoad : false
});
menuStore.load();
var menu = Ext.create('Ext.tree.Panel', {
	region : "west",
	collapsed: false ,
	collapsible: true,
	title: enterpriseName,
	autoScroll: true,
	width : 350,
	rootVisible:false,
	store: menuStore,
	listeners: {
		selectionchange : function(me, selected, eOpts) {
			var data = selected[0].data;
			if(data.id=="tax.enterprise.local.info"){
				window.location.href="#地税企业信息展示";
			}else if(data.id=="tax.enterprise.nation.info"){
				window.location.href="#国税企业信息展示";
			}else{
				var p =Ext.getCmp('enterpriseData');
				//showAll(p)
				window.location.href="#"+data.id;
			}
		}
	}
});
/**
 * 加载企业相关的数据
 * @param {} taxId
 * @param {} enterpriseName
 */
var loadRelatedData=function(taxId,enterpriseName){
	var startTime=Ext.Date.format(Ext.getCmp('dataStartMonth').getValue(),'Y-m');
	var endTime=Ext.Date.format(Ext.getCmp('dataEndMonth').getValue(),'Y-m');//Ext.getCmp('dataEndMonth').getValue();
	var me=Ext.getCmp('enterpriseData');
	Ext.Ajax.request({
		 url:'tax/enterprise/tableNameListWithData.do',
		 params: {
		      taxId: taxId,
		      startTime: startTime,
		      endTime: endTime
		 },
		 success: function(response){
			 var text = Ext.util.JSON.decode(response.responseText);
			 var value=text.value;
			 var s;
			 for( var i in value){
				var tableMap='['+JSON.stringify(value[i])+']';
		     	for(var tableName in value[i]){
					 sendAjax(tableName,tableMap,taxId,me,startTime,endTime);
				} 
			 }
			 
		 },
		 failure: function(){
			 
		 }
	 }) 
}
/**
 * 清空'enterpriseData'面板中除企业信息外的内容
 */
var clear=function(){
	var panel=Ext.getCmp('enterpriseData');
	for(var i=1;i<panel.length;i++){
		panel.removeAt(i)
	}
}
var panel=Ext.create('Ext.panel.Panel',{
	id: 'enterpriseData',
	layout: 'fit',
	collapsed: false ,
	autoScroll: true,
	region:'center',
	title: '企业相关信息',
	tbar: [{
		xtype: 'monthfield',
        margin : '0 10 0 0',
        fieldLabel: '所属期始',
        width: 180,
        editable: false,
        id: 'dataStartMonth',
        labelWidth: 60,
        value :Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -12), "Y-m"),
        format: 'Y-m',
        listeners : {
			change : function(combo, newValue, oldValue, eOpts) {
				clear();
				loadRelatedData(taxId,enterpriseName);
				menuStore.load({
					params:{
							taxId: taxId,
							startTime: Ext.Date.format(Ext.getCmp('dataStartMonth').getValue(),'Y-m'),
							endTime: Ext.Date.format(Ext.getCmp('dataEndMonth').getValue(),'Y-m')
					}
						
				});
			}
		}
        
	},{
		xtype: 'monthfield',
        margin : '0 10 0 0',
        fieldLabel: '所属期止',
        width: 180,
        editable: false,
        id: 'dataEndMonth',
        labelWidth: 60,
        value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, 0), "Y-m"),
        format: 'Y-m',
        listeners : {
			change : function(combo, newValue, oldValue, eOpts) {
				clear();
				loadRelatedData(taxId,enterpriseName);
				menuStore.load({
					params:{
							taxId: taxId,
							startTime: Ext.Date.format(Ext.getCmp('dataStartMonth').getValue(),'Y-m'),
							endTime: Ext.Date.format(Ext.getCmp('dataEndMonth').getValue(),'Y-m')
					}
				})
			}
        }
	}]
});
function sendAjax(tableName,tableMap,taxId,me,startTime,endTime){
	Ext.Ajax.request({
		url:'system/dataTable/getColumnsAndFields.do',
		params:{
			tableName:tableName
		},
		success:function(response,options){
			var obj=Ext.decode(response.responseText);
			var fields=obj.fields;
			var columns=obj.columns;
			var store = Ext.create('Ext.data.Store',{
				fields : fields,
				async: false,
				pageSize: itemsPerPage,
				id: tableName,
	            proxy : {
	                type : 'ajax',
	                url : 'tax/enterprise/getEnterpriseRelatedData.do',
	                extraParams : {
	                		tableMap: tableMap,
						taxId: taxId,
						startTime: startTime,
						endTime: endTime,
						start:0,
				        limit: itemsPerPage
	                },
	                reader : {
	                    type : 'json',
	                    rootProperty: 'value',
						totalProperty: 'totalCount'
	                }
	            },
	            autoLoad : true
				
			});
			var grid = Ext.create('Ext.grid.Panel',{
				title: tableName,
				id: tableName,
				store: store,
				margin: '0 0 10 0',
				columns: columns,
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: store,   // same store GridPanel is using		
					dock: 'bottom',
					displayInfo: true,
					displayMsg:'显示{0}-{1}条，共{2}条',  
					emptyMsg:'无数据' 
				}]
			});
			me.add(grid); 
		},
		failure: function(){
		}
		});
} 
 
Ext.onReady(function(){
	 Ext.QuickTips.init();
	 var me=Ext.getCmp('enterpriseData');
	 log("taxId: "+taxId)
	 Ext.Ajax.request({
		 url:'tax/enterprise/getEnterprise.do',
		 params:{
			 taxIds: "[{'"+taxId+"':'"+taxId+"'}]"//'[{'+taxId+':'+taxId+'}]'
		 },
		 success: function(response){
			 var text = Ext.util.JSON.decode(response.responseText);
			 var value=text.value;
			 log(value);
			 /**
			  * 只存在value =1或2两种情况，为了方便写，故采用value.length!=1的写法来代表value.length=2
			  */
			 if(value.length==1){
			 	for(var i in value[0]){
			 		if(i=='local'){
			 			var enterprise=Ext.create('tax.enterprise.local.info');
			 	 		me.add(enterprise);
			 	 		for(var j in value[0][i]){
					  	   if(j!='CHECK1'&&j!='批号'&&j!='uploadId'&&j!='id'){
						 		Ext.getCmp(j+'_local').setValue(value[0][i][j]);
						   }
					 	}
					 	var nationPanel=Ext.create('Ext.panel.Panel',{
					 		title:'国税企业信息展示',
					 		id : '国税企业信息展示',
							html:'<h1>该企业在国税中没有登记信息</h1>',
							maxHeight: 100
						}) ;
						me.add(nationPanel);
			 		}else if(i=='nation'){
			 			var enterprise=Ext.create('tax.enterprise.nation.info');
			 	 		me.add(enterprise);
			 	 		for(var j in value[0][i]){
			 	 			log(j)
							 if(j!='社会信用代码'){
							 	Ext.getCmp(j+'_nation').setValue(value[0][i][j]);
							 }
						}
			 			var nationPanel=Ext.create('Ext.panel.Panel',{
					 		title:'地税企业信息展示',
					 		id : '地税企业信息展示',
							html:'<h1>该企业在地税中没有登记信息</h1>',
							maxHeight: 100
						}) ;
						me.add(nationPanel);
						
			 		}
			 		
			 	}
			 }
			 for(var length=0;length<value.length&&value.length!=1;length++){
			 	for(var i in value[length]){
			 		if(i=='local'){
			 			var enterprise=Ext.create('tax.enterprise.local.info');
			 	 		me.add(enterprise);
			 	 		for(var j in value[length][i]){
							 if(j!='CHECK1'&&j!='批号'&&j!='uploadId'&&j!='id'){
//							 	log(j)
							 	Ext.getCmp(j+'_local').setValue(value[length][i][j]);
						 	}
						}
			 		}else if(i=='nation'){
			 			var enterprise=Ext.create('tax.enterprise.nation.info');
			 	 		me.add(enterprise);
			 	 		for(var j in value[length][i]){
			 	 			log(j)
							 if(j!='社会信用代码'){
							 	Ext.getCmp(j+'_nation').setValue(value[length][i][j]);
							 }
						}
			 		
			 		}
					
			 }
			 }
		 },
		 failure: function(){
			 
		 }
	 })
	// enterprise.loadRecord(record);
	 //递归调用ajax请求
	  Ext.Ajax.request({
		 url:'tax/enterprise/tableNameListWithData.do',
		 params: {
		      taxId: taxId,
		      startTime: initStartTime,
		      endTime: initEndTime
		 },
		 success: function(response){
			 var text = Ext.util.JSON.decode(response.responseText);
			 var value=text.value;
			 var s;
			 for( var i in value){
				var tableMap='['+JSON.stringify(value[i])+']';
		     	for(var tableName in value[i]){   
					 sendAjax(tableName,tableMap,taxId,me,initStartTime,initEndTime);
				} 
			 }
			 
		 },
		 failure: function(){
			 
		 }
	 }) 
	Ext.create('Ext.container.Viewport', {
		layout : 'border',
		items : [ menu, panel ]
	}).show();
});