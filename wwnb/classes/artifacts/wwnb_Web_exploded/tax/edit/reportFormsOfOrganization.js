Ext.define('tax.edit.reportFormsOfOrganization',{
	extend:'Ext.panel.Panel',
	layout:'fit',
	title:'单位上传情况统计（分报表）',	
	initComponent: function(){
		var itemsPerPage = 25;   // set the number of items you want per page
		var toobar = Ext.create('Ext.toolbar.Toolbar',{
			items: [ 
				       {
				        xtype: 'monthfield',
				        margin : '0 10 0 0',
				        fieldLabel: '所属期起',
				        id :'startTime',
				        width: 180,
				        labelWidth: 60,
				        name: 'startTime',
				        format: 'Y-m',
						value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-7),"Y-m"),
//				        listeners: {
//				        	 change: function(ombo, records, eOpts) {
//				        		 	userStore.load();
//								}
//				    }
				    
				}, {
				        xtype: 'monthfield',
				        fieldLabel: '所属期止',
				        id :'endTime',
				        labelWidth: 60,
				        width: 180,
				        margin : '0 10 0 0',
				        name: 'endTime',
				        format: 'Y-m',

				        value: new Date(),  // defaults to today
//				        	 listeners: {
//				        		 change: function(ombo, records, eOpts) {
//				        			 userStore.load();
//									}
//				         }
				    }
				,{
					xtype : 'button',
					text : '查询',
					margin : '0 10 0 0',
					handler : function() {
						var adminMain=Ext.getCmp("adminMain1");
						if(adminMain!=null)
						{
							adminMain.getStore().load();
						}
					}
				}]
		});
		var userStore = Ext.create('Ext.data.Store',{
//			 autoLoad: true,

			 fields: ['name','onTimeNum','advancedCount','delayNum','noUploadNum','uploadCount','recordCount'],				
				proxy:{	
					url: 'tax/edit/listReport1.do',
					type: 'ajax',
					reader:{
						type : 'json'
						//rootProperty: 'value',
						//totalProperty: 'totalCount'
					}
				},
				listeners : {
					beforeload : function(store, operation, eOpts) {
						store.getProxy().setExtraParams({
							startTime:  Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
 							endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')

						});
					}
					
					}
		 });
		var grid = Ext.create('Ext.grid.Panel',{
			store: userStore,
			id: 'adminMain1',
		    tbar: toobar,
//		    features: [{
//		        ftype: 'summary'
//		    }],
		    columns: [
 		        { text: '组织名称', dataIndex: 'organization',width: 200 },
		        { text: '提前上传数', dataIndex: 'advancedCount' ,width: 150},
 		        { text: '按时上传数',dataIndex: 'onTimeNum',width: 150 },
		        { text: '延迟上传数', dataIndex: 'delayNum' ,width: 150},
 		        { text: '未上传数',dataIndex: 'noUploadNum',width: 150 },
		        { text: '上传次数',dataIndex: 'uploadCount' ,width: 150},
		        { text: '上传条数',dataIndex: 'recordCount' ,width: 150}
		    ]

		});
		this.items = [grid];
		this.callParent();
	}
})