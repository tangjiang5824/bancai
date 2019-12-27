Ext.define('tax.edit.remind',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title:'未上传组织名单',
	initComponent: function(){
		var itemsPerPage = 1000;   // 不分页
		var me=this;
		var userStore = Ext.create('Ext.data.Store',{
			pageSize:  itemsPerPage,
			autoLoad: true,
			 fields: ['tableName','name','tel','address','uploadCycle','cycleStart'],				
				proxy:{	
					url: 'tax/edit/noUpload.do',
					type: 'ajax',
					reader:{
						type : 'json',
						rootProperty: 'value',
						totalProperty: 'totalCount'
					}
				}
		 });
//		userStore.load({
//		    params:{
//		    		start:0,
//		    		limit:itemsPerPage,
//		    }
//		});
		var grid = Ext.create('Ext.grid.Panel',{
			store: userStore,
			id: 'adminMain',
			viewConfig : {
				enableTextSelection : true
			},
			columns: [
 		        { text: '表名', dataIndex: 'tableName',width: 400 },
 		        { text: '组织名称', dataIndex: 'name',width: 200 },
		        { text: '主管领导', dataIndex: 'leadership' ,width: 200},
		        { text: '联系人', dataIndex: 'contacts' ,width: 200},
		        { text: '联系电话', dataIndex: 'tel' ,width: 200},
		        { text: '上传周期', dataIndex: 'uploadCycle' ,width: 150,
		    		renderer : function(value) {
		        	if (value == 0)
						return "实时";
					else if (value == 1)
						return "月报";
					else if (value == 3)
						return "季报";
					else if (value == 6)
						return "半年报";
					else if (value == 12)
						return "年报";

				}}
		    ],
		    dockedItems: [{
		        xtype: 'pagingtoolbar',
		        store: userStore,   // same store GridPanel is using
		        dock: 'bottom',
		        displayInfo: true,
		        displayMsg:'共{2}条',  
		        emptyMsg:'无数据' 
		    }]
		});
		this.items = [grid];
		this.callParent();
	}
})