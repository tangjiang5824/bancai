Ext.define('tax.enterprise.main', {
	extend : 'Ext.panel.Panel',
	title : "企业信息",
	id:'enterprisePanel',
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var itemsPerPage = 50;
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			dock: 'top',
			items : [ {
				xtype : 'textfield',
				id : 'taxName',
				margin : '0 50 0 0',
				value : null
			}, {
				xtype : 'button',
				text : '搜索',
				margin : '0 50 0 0',
				handler : function() {
					//var taxName = Ext.getCmp('taxName').getValue();
					enterpriseStore.reload({
						params : {
							start : 0,
							limit : itemsPerPage
							//taxId : me.taxId,
							//taxName : taxName
						}
					});
				}
			} ]
		});
		var enterpriseStore = Ext.create('Ext.data.Store', {
			proxy : {
				type : 'ajax',
				url : 'tax/enterprise/listEnterprise.do',
				reader : {
					type : 'json',
					rootProperty : 'value',
					totalProperty : 'totalCount'
				},
				params : {
					start : 0,
					limit : itemsPerPage
				}
				
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					store.getProxy().setExtraParams({
						taxId : Ext.getCmp('taxName').getValue(),
						taxName: Ext.getCmp('taxName').getValue(),
						represent: Ext.getCmp('taxName').getValue(),
						op:"or"

					});
				}
				
				}
			//autoLoad : true
		});

		Ext.Ajax.request({
			url :  'system/dataTable/getColumnsAndFields.do',
			params : {
				tableName:'税务登记信息查询'
			},
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				
				enterpriseStore.setFields(obj.fields);
				var grid = Ext.create('Ext.grid.Panel', {
					columns : obj.columns,
					store : enterpriseStore,
					//tbar : toolbar,
					viewConfig : {
						enableTextSelection : true
					},
					dockedItems : [ // 添加搜索控件
					toolbar,
					{
						
							xtype : 'pagingtoolbar',
							dock: 'bottom',
							store : enterpriseStore, // same store GridPanel
							margin : '0 50 0 0',
							displayInfo : true,
							displayMsg : '显示{0}-{1}条，共{2}条',
							emptyMsg : '无数据',
							beforePageText : '第',
							afterPageText : '页，共{0}页'
						
					} ],
					listeners : {
						'rowdblclick' : function(grid, rowIndex) {
							var select = grid.getSelectionModel()
									.getSelection();
							var tab = Ext.create('tax.enterprise.window', {
								taxId : select[0].get('社会信用代码(纳税人识别号)')
							});
							var win = Ext.create('Ext.window.Window', {
								modal : true,
								items : [ tab ],
								taxId : ''
							});
							win.show()
						}
					}
				});
				me.add(grid)
				enterpriseStore.load({
					params : {
						start : 0,
						limit : itemsPerPage
						
					}
				});
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
		this.callParent()
	}
})