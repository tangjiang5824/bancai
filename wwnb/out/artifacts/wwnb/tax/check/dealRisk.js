Ext.define('tax.check.dealRisk',{
	extend: 'Ext.panel.Panel',
	region: 'center',
	layout : 'fit',
	title: '风险处理',
	id:'dealRiskPanel',
	initComponent: function(){
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
					var dealRiskGrid=Ext.getCmp('dealRiskGrid');
					if(dealRiskGrid!=null)
						me.remove(dealRiskGrid);
					var resultStore = Ext.create('Ext.data.Store', {
								id : "resultStore",
								fields:tablesFieldsAndColumns.getFields(newValue),
								proxy : {
									type : 'ajax',
									url : 'tax/check/listDealCheckResult.do',
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
					dealRiskGrid = Ext.create("Ext.grid.Panel", {
								autoScroll:true,
								selModel: selModel,
								viewConfig : {
									enableTextSelection : true
								},
								id : "dealRiskGrid",
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
					me.add(dealRiskGrid);
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
							var dealRiskGrid=Ext.getCmp("dealRiskGrid");
							if(dealRiskGrid!=null)
							{
								dealRiskGrid.getStore().load();
							}
						}
					}, {
						xtype : 'button',
						text : '结束处理',
						margin : '0 10 0 0',
						handler : function() {

							var dealRiskGrid = Ext.getCmp('dealRiskGrid');
							var select = dealRiskGrid.getSelectionModel().getSelection();
							var state = select[0].get("状态");
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要处理的记录')
							else {

								var idSet = new Array()
								for (var i = 0; i < select.length; i++) {
									idSet[i] = select[i].get("id");
								}

								Ext.Ajax.request({
											url : 'tax/chcek/endingDeal.do',
											params : {
												standard : Ext.getCmp('standard').getValue(),
												idSet : idSet,
												state : state
											},
											success : function(response) {
												Ext.getCmp('dealRiskGrid').store
														.load({
																	params : {
																		start : 0,
																		limit : 25
																	}
																});
												Ext.Msg.alert('消息', "该信息已处理完毕");
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