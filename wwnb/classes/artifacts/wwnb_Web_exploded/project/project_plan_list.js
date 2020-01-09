Ext.define('project.project_plan_list',{
	extend: 'Ext.panel.Panel',
	layout:'fit',
	autoScroll: true,
	id:'checkdatapanel',
	initComponent: function(){
		var itemsPerPage = 50; 
		var me=this;
		var tableListStore = Ext.create('Ext.data.Store',{
			fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'project/findProjectList.do',

                reader : {
                    type : 'json',
					rootProperty: 'projectList',
                }
            },
            autoLoad : true
			
		});
		tableListStore.on("load", function(){
			//var name=tableListStore.getAt(0).get('projectName');
//			    alert(defaultYear);//得到第一条数据
			//tableList.setValue(defaultYear);
			// Ext.Ajax.request({
			// 	url: 'system/dataTable/getColumnsAndFields.do',
			// 	params:{
			// 		tableName:defaultYear
			// 	},
			// 	success:function(response)
			// 	{
			// 		var obj=Ext.decode(response.responseText);
			// 		var oldFields = JSON.stringify(obj.fields).replace('[','').replace(']','');
			// 		var oldColumns=JSON.stringify(obj.columns).replace('[','').replace(']','');
			// 		var newFilds='["所属期","批次",'+oldFields+']';
			// 		var newColumns='[{"text":"所属期始","dataIndex":"startTime",width: 100},{"text":"所属期止","dataIndex":"endTime",width: 100},{"text":"批号","dataIndex":"batchNo",width: 100},'+oldColumns+']'
			// 		console.log(Ext.decode(newFilds))
			// 		var columns=Ext.decode(newColumns)
			// 		var tmp1=columns[0];
			// 		columns[0]=columns[3];
			// 		var tmp2=columns[1];
			// 		columns[1]=tmp1;
			// 		tmp1=columns[2];
			// 		columns[2]=tmp2;
			// 		columns[3]=tmp1;
			// 		console.log(columns)
			// 		var tableDataStore = Ext.create('Ext.data.Store',{
			// 			pageSize: itemsPerPage,
			// 			fields: Ext.decode(newFilds),
			// 			proxy: {
			// 				type: 'ajax',
			// 				url: 'listTableData.do',
			// 				extraParams : {
			//
			// 					tableName: defaultYear,
			// 					begintime:  Ext.util.Format.date(Ext.getCmp('checkdatabegintime').getValue(), 'Y-m'),
			// 					deadline : Ext.util.Format.date(Ext.getCmp('checkdatadeadline').getValue(), 'Y-m')
			// 				},
			// 				reader: {
			// 					type: 'json',
			// 					rootProperty: 'value',
			// 					totalProperty: 'totalCount'
			// 				}
			// 			},
			// 			autoLoad: true
			// 		});
			// 		var oldgrid=Ext.getCmp('checkdataGrid');
			// 		if(oldgrid!=null)
			// 			me.remove(oldgrid);
			// 		var grid = Ext.create('Ext.grid.Panel',{
			// 			id: 'checkdataGrid',
			// 			store: tableDataStore,
			// 			viewConfig : {
			// 				enableTextSelection : true
			// 			},
			// 			//tbar: toobar,
			// 			columns: columns,//obj.columns,
			// 			dockedItems: [{
			// 				xtype: 'pagingtoolbar',
			// 				store: tableDataStore,   // same store GridPanel is using
			// 				dock: 'bottom',
			// 				displayInfo: true,
			// 				displayMsg:'显示{0}-{1}条，共{2}条',
			// 				emptyMsg:'无数据'
			// 			}]
			// 		});
			// 		me.add(grid);
			// 	},
			// 	failure: function(form, action) {
			// 		Ext.Msg.alert('消息', '查询失败');
			// 	}
			//
			// });
			});
	
		var tableList = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '项目名',
			labelWidth : 60,
			width : 400,
			id :  'projectName',
			name : 'projectName',
			matchFieldWidth: false,
			emptyText : "--请选择--",
			displayField: 'projectName',
			valueField: 'projectName',
			editable : false,
			store: tableListStore
		      
		}); 

		var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
			items:[
						tableList,
						{
							xtype: 'button',
							text: '查询',
							margin : '0 10 0 0',
							handler: function(){
								console.log(Ext.getCmp('projectName').getValue())
								uploadRecordsStore.load({
									params : {
										projectName:Ext.getCmp('projectName').getValue(),
									}
								});
									// Ext.Ajax.request({
									// 	url: 'project/showProject.do',
									// 	params:{
									// 		projectName:Ext.getCmp('projectName').getValue(),
									// 	},
									// });

//								}
							}
						}
				]
		});

		var uploadRecordsStore = Ext.create('Ext.data.Store',{
			id: 'uploadRecordsStore',
			autoLoad: true,
			fields: [],
			pageSize: itemsPerPage, // items per page
			proxy:{
				//url:"hisExcelList.do",
				url : "project/showProject.do",
				type: 'ajax',
				reader:{
					type : 'json',
					rootProperty: 'value',
					totalProperty: 'totalCount'
				},
				params:{
					start: 0,
					//limit: itemsPerPage
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					store.getProxy().setExtraParams({
						projectName:Ext.getCmp('projectName').getValue(),

					});
				}

			}


		});


		var grid = Ext.create('Ext.grid.Panel',{
			id: 'uploadRecordsMain',
			store: uploadRecordsStore,
			viewConfig : {
				enableTextSelection : true,
				editable:true
			},
			columns : [


				{ text: '产品名', dataIndex: 'productName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
				{ text: '长', dataIndex: '长', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
				{ text: '类型', dataIndex: '类型',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
				{ text: '宽', dataIndex: '宽', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
				{ text: '材料类型', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
				{ text: '数量', dataIndex: 'number', flex :1,editor:{xtype : 'textfield', allowBlank : false} },

			],
			//对单元格单击响应的插件
			// plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
			// 	clicksToEdit : 3
			// })],
			//tbar: toobar,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: uploadRecordsStore,   // same store GridPanel is using
				dock: 'bottom',
				displayInfo: true,
				displayMsg:'显示{0}-{1}条，共{2}条',
				emptyMsg:'无数据'
			}],
		});
		this.items = [grid];
		this.tbar=toolbar;
		this.callParent(arguments);
	

	}

})