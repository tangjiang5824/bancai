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
			});
	
		var tableList = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '项目名',
			labelWidth : 60,
			width : '35%',
			id :  'projectName',
			name : 'projectName',
			matchFieldWidth: true,
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