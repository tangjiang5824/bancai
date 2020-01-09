Ext.define('org.data.uploadRecords',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title: '历史数据查询',
	initComponent: function(){
		var itemsPerPage = 50; 
		var tableList = Ext.create('Ext.form.ComboBox',{
			id : 'tableName',
			fieldLabel : '数据类型',
			labelWidth : 60,
			width : 400,
			name : 'tableName',
			matchFieldWidth: false,
			emptyText : "--请选择--",
			displayField: 'tableName',
			valueField: 'tableName',
			editable : false,
			onTriggerClick : function() {
				this.expand();
			},
			store: {
		            fields : [ 'tableName'],
		            proxy : {
		                type : 'ajax',
		                url : 'tableList.do',
		                reader : {
		                    type : 'json'
		                }
		            },
		            autoLoad : true
		        },
		        listeners: {
		    		select: function(ombo, records, eOpts){
		    			uploadRecordsStore.load({
								params : {
									tableName : Ext.getCmp('tableName').getValue(),
								startTime:  Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
 							endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')

								}
							});
		    		}
		    }
		}); 

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
			items: [tableList,
    {
		
        xtype: 'monthfield',
        margin : '0 10 0 0',
        fieldLabel: '所属期起',
        id :'startTime',
        width: 180,
        labelWidth: 60,
        name: 'startTime',
        format: 'Y-m',
        value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-12),"Y-m"), 
        listeners: {
        	change: function(ombo, records, eOpts) {
				// alert(Ext.getCmp('startTime').getValue())
        		uploadRecordsStore.load({
					params : {
						startTime : Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
						endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')
					}
				});
			},
    		select: function(ombo, records, eOpts){
    			alert(Ext.getCmp('startTime').getValue())
    			uploadRecordsStore.load({
						params : {
							tableName : Ext.getCmp('tableName').getValue(),
						startTime:  Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
 							endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')
						}
					});
    		}
    }
    
}, {
        xtype: 'monthfield',
        fieldLabel: '所属期止',
        labelSeparator: '', 
        id :'endTime',
        labelWidth: 60,
        width: 180,
        margin : '0 10 0 0',
        name: 'endTime',
        format: 'Y-m',
        value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,0),"Y-m"), 
        	 listeners: {
        		 change: function(ombo, records, eOpts) {
						// alert(Ext.getCmp('startTime').getValue())
        			 uploadRecordsStore.load({
							params : {
								startTime : Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
								endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')
							}
						});
					},
         		select: function(ombo, records, eOpts){
//         			alert(Ext.getCmp('roleId').getValue())
         			uploadRecordsStore.load({
     						params : {
     							tableName : Ext.getCmp('tableName').getValue(),
								startTime:  Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m')

     						}
     					});
         		}
         }
    },{
        text: '查看详细信息',
        width: 140,
        margin: '0 0 0 15',
        handler: function(){
        	var select = grid.getSelectionModel().getSelection();
		if(select.length==0){
			Ext.Msg.alert('错误', '请选择要查看的记录')
		}
	    	else{
	    		
	    		var url='showData.jsp?taxTableName='
					+ select[0].get('tableName')
					+ "&taxTableId=" + select[0].get('id')
					+"&startTime="+select[0].get('startTime')
					+"&endTime="+select[0].get('endTime');
				url=encodeURI(url)
				window.open(url,
						'_blank');
	    	}
        }
    }]
		})
		var uploadRecordsStore = Ext.create('Ext.data.Store',{
			id: 'uploadRecordsStore',
			autoLoad: true,
			fields: ['id',  {name : 'uploadTime',
				type : 'date',
				mapping : 'uploadTime',
				dateFormat : 'time'}, 'startTime','endTime'],
			pageSize: itemsPerPage, // items per page
			proxy:{	
				//url:"hisExcelList.do",
				url : "org/data/historyExcelList.do",
				type: 'ajax',
				reader:{
					type : 'json',
					rootProperty: 'value',
					totalProperty: 'totalCount'
					},
					params:{
						start: 0,
			    		limit: itemsPerPage
					}
				},				
				listeners : {
					beforeload : function(store, operation, eOpts) {
						store.getProxy().setExtraParams({
							
							tableName : Ext.getCmp('tableName').getValue(),
							startTime:  Ext.util.Format.date(Ext.getCmp('startTime').getValue(), 'Y-m'),
 							endTime : Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m')

						});
					}
					
					}
				
				
		});
		
		

		var OneCombo = Ext.create('Ext.form.ComboBox', {
			store : {
	             fields : ['state', 'name'],
	             data : [

	                 {"state":"0", "name":"上传失败"},
	                 {"state":"1", "name":"上传成功"},
	                 {"state":"2", "name":"上传成功并已匹配"},
	                 {"state":"3", "name":"已进行风险发现"},
	                 {"state":"4", "name":"上传成功但已删除"},
	                 {"state":"5", "name":"当期无数据"}
	                ]
	         },
			displayField: 'name',
			valueField: 'state',

			editable: false
		});
		getOneDisplay = function(value, meta, record) {
		    var rowIndex = OneCombo.store.find("state", "" + value);
		    if (rowIndex < 0)
		    return '';
		    var record = OneCombo.store.getAt(rowIndex);
		    return record ? record.get('name') : '';
		}

		var grid = Ext.create('Ext.grid.Panel',{
				id: 'uploadRecordsMain',
				store: uploadRecordsStore,
				viewConfig : {
					enableTextSelection : true
				},
				columns : [  
					{ text: '编号',  dataIndex: 'id' ,flex :0.4},
			        { text: '表名', dataIndex: 'tableName', flex :2},
			        { text: '上传者', dataIndex: 'uploads',flex :1 },
			        { text: '上传时间', dataIndex: 'uploadTime', flex :1,
			        	sortable : true,renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			        },
			        { text: '所属期始', dataIndex: 'startTime', flex :1},
			        { text: '所属期止', dataIndex: 'endTime',flex :1 },
				    {
						
						dataIndex:'state',
						name:'state',
					    text: '状态',
					    flex :1,
					    editor : OneCombo,
					    renderer : getOneDisplay
					}
				],
			    tbar: toobar,
			    dockedItems: [{
			        xtype: 'pagingtoolbar',
			        store: uploadRecordsStore,   // same store GridPanel is using
			        dock: 'bottom',
			        displayInfo: true,
			        displayMsg:'显示{0}-{1}条，共{2}条',
			        emptyMsg:'无数据'
			    }],
			    listeners: {
			    		itemdblclick: function(me, record, item, index){
			    			var select = record.data;
			    			var id =select.id;
			    			var tableName=select.tableName;
			    			var url='showData.jsp?taxTableName='
								+ tableName
								+ "&taxTableId=" + id;
							url=encodeURI(url)
							window.open(url,
									'_blank');
			    		}
			    }
		});
		
		this.items = [grid];
		this.callParent(arguments);
	}
})