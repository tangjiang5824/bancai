Ext.define('tax.check.resultView', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : 'fit',
	title : '校验结果查询',
	id : 'checkresultpanel',
	initComponent : function() {
		var itemsPerPage = 50;
		var me = this;
		var tablesFieldsAndColumns = Ext
				.create("tax.check.TablesFieldsAndColumns");
		var standards = tablesFieldsAndColumns.getStandards();
		var tableList = Ext.create('Ext.form.ComboBox', {
			// id : 'tableName',
			fieldLabel : '校验标准',
			labelWidth : 60,
			width : 350,
			name : 'standard',
			id : 'standard',
			emptyText : "--请选择--",
			displayField : 'standard',
			valueField : 'standard',
			editable : false,
			onTriggerClick : function() {
				this.expand();
			},
			store : {
				fields : ["standard"],
				data : standards
			},
			listeners : {
				change : function(comb, newValue, oldValue, eOpts) {
					var resultGrid=Ext.getCmp('resultGrid');
					if(resultGrid!=null)
						me.remove(resultGrid);
					var resultStore = Ext.create('Ext.data.Store', {
								id : "resultStore",
								fields:tablesFieldsAndColumns.getFields(newValue),
								proxy : {
									type : 'ajax',
									url : 'tax/check/listCheckResult.do',
									reader : {
										type : 'json',
										rootProperty : 'value',
										totalProperty : 'totalCount'
									}
								},
								autoLoad : true,
								listeners : {
									beforeload : function(store, operation,
											eOpts) {
										store.getProxy().setExtraParams({
											standard : Ext.getCmp("standard")
													.getValue(),
											startTime : Ext.util.Format.date(
													Ext.getCmp("startTime")
															.getValue(), 'Y-m'),
											endTime : Ext.util.Format.date(Ext
															.getCmp("endTime")
															.getValue(), 'Y-m')
										});
									}
								}

							});
					var selModel = Ext.create('Ext.selection.CheckboxModel');
					resultGrid = Ext.create("Ext.grid.Panel", {
								autoScroll:true,
								id : "resultGrid",
								viewConfig : {
									enableTextSelection : true
								},
								selModel: selModel,
								store : resultStore,
								columns:tablesFieldsAndColumns.getColumns(newValue),
								dockedItems : [{
											xtype : 'pagingtoolbar',
											store : resultStore,
											dock : 'bottom',
											displayInfo : true,
											displayMsg : '显示{0}-{1}条，共{2}条',
											emptyMsg : '无数据'
										}]
							});
					me.add(resultGrid);
				}
			}
		});

		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
					items : [tableList, {
						xtype : 'monthfield',
						margin : '0 10 0 0',
						fieldLabel : '所属期起',
						width : 180,
						labelWidth : 60,
						name : 'startTime',
						id : 'startTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, -12), "Y-m")
					}, {
						xtype : 'monthfield',
						fieldLabel : '所属期止',
						labelSeparator : '',
						labelWidth : 60,
						width : 180,
						margin : '0 10 0 10',
						name : 'endTime',
						id : 'endTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, 0), "Y-m")
					}, {
						xtype : 'button',
						text : '查询',
						margin : '0 10 0 0',
						handler : function() {
							var resultGrid=Ext.getCmp("resultGrid");
							if(resultGrid!=null)
							{
								resultGrid.getStore().load();
							}
						}
					}, {
						xtype : 'button',
						text : '开始处理',
						margin : '0 10 0 0',
						handler : function() {

							var resultGrid = Ext.getCmp('resultGrid');
							var select = resultGrid.getSelectionModel()
									.getSelection();
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要处理的记录')
							else {

								var idSet = new Array()
								for (var i = 0; i < select.length; i++) {
									idSet[i] = select[i].get("id");
								}

								Ext.Ajax.request({
											url : 'tax/chcek/beginDeal.do',
											params : {
												standard : Ext
														.getCmp('standard')
														.getValue(),
												idSet : idSet
											},
											success : function(response) {
												Ext.getCmp('resultGrid').store
														.load({
																	params : {
																		start : 0,
																		limit : 25
																	}
																});
												Ext.Msg.alert('消息', "该信息已开始处理");
											},
											failure : function(response) {
												Ext.MessageBox
														.alert("提示",
																"服务器异常，请检查网络连接，或者联系管理员");
											}
										})

							}
						}
					}]
				});
		this.tbar = toolbar;
		this.callParent(arguments);

	}

})