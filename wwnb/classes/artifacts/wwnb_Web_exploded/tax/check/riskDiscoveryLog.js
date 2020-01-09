Ext.define('tax.check.riskDiscoveryLog', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : 'fit',
	title : '查看风险发现日志',
	initComponent : function() {
		var itemsPerPage = 100; // set the number of items you want per page
		var toobar = Ext.create('Ext.toolbar.Toolbar', {
					items : [{
						xtype : 'monthfield',
						margin : '0 10 0 0',
						fieldLabel : '执行时间起',
						id : 'startTime',
						width : 180,
						labelWidth : 80,
						name : 'startTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, -12), "Y-m"),
						listeners : {
							change : function(ombo, records, eOpts) {
								// alert(Ext.getCmp('startTime').getValue())
								logStore.load({
											params : {
												startTime : Ext.util.Format
														.date(
																Ext
																		.getCmp('startTime')
																		.getValue(),
																'Y-m'),
												endTime : Ext.util.Format.date(
														Ext.getCmp('endTime')
																.getValue(),
														'Y-m')
											}
										});
							},
							select : function(ombo, records, eOpts) {
								// alert(Ext.getCmp('startTime').getValue())
								logStore.load({
											params : {
												startTime : Ext.util.Format
														.date(
																Ext
																		.getCmp('startTime')
																		.getValue(),
																'Y-m'),
												endTime : Ext.util.Format.date(
														Ext.getCmp('endTime')
																.getValue(),
														'Y-m')
											}
										});
							}
						}
					}, {
						xtype : 'monthfield',
						fieldLabel : '执行时间止',
						id : 'endTime',
						labelWidth : 80,
						width : 180,
						margin : '0 10 0 0',
						name : 'endTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, 1), "Y-m"),
						listeners : {
							change : function(ombo, records, eOpts) {
								// alert(Ext.getCmp('startTime').getValue())
								logStore.load({
											params : {
												startTime : Ext.util.Format
														.date(
																Ext
																		.getCmp('startTime')
																		.getValue(),
																'Y-m'),
												endTime : Ext.util.Format.date(
														Ext.getCmp('endTime')
																.getValue(),
														'Y-m')
											}
										});
							},
							select : function(ombo, records, eOpts) {
								logStore.load({
											params : {
												startTime : Ext.util.Format
														.date(
																Ext
																		.getCmp('startTime')
																		.getValue(),
																'Y-m'),
												endTime : Ext.util.Format.date(
														Ext.getCmp('endTime')
																.getValue(),
														'Y-m')

											}
										});
							}
						}
					}, {
						text : '查看风险发现结果',
						handler : function() {
							var select = grid.getSelectionModel()
									.getSelection();
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要查看的日志')
							else {
								var riskType = select[0].get("type");
								if (riskType == '错误')
									Ext.Msg.alert('提示', '无数据')
								else {
									var standard = select[0]
											.get("standard");
									var id = select[0].get("id");
									var dealTime = Ext.util.Format.date(new Date(select[0].get("time")),'Y-m-d H:m:s');
									var url = "showRiskData.jsp?standard="
											+ standard + "&time="
											+ dealTime + "&id=" + id;
									url = encodeURI(url);
									window.open(url, "_blank");
								}

							}

						}
					}]
				});
		var logStore = Ext.create('Ext.data.Store', {
			autoLoad : true,
			fields : ['time', 'standard', 'note', 'type'],
			proxy : {
				url : 'tax/check/riskDiscoveryLog.do',
				type : 'ajax',
				reader : {
					type : 'json',
					rootProperty : 'value',
					totalProperty : 'totalCount'
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					store.getProxy().setExtraParams({
						startTime : Ext.util.Format.date(Ext
										.getCmp('startTime').getValue(), 'Y-m'),
						endTime : Ext.util.Format.date(Ext.getCmp('endTime')
										.getValue(), 'Y-m')
					});
				}

			}
		});
		logStore.load({
					params : {
						start : 0,
						limit : itemsPerPage
					}
				});
		var grid = Ext.create('Ext.grid.Panel', {
					store : logStore,
					// id: 'adminMain',
					tbar : toobar,
					viewConfig : {
						enableTextSelection : true
					},
					columns : [{
								text : '时间',
								dataIndex : 'time',
								width : 250,
								sortable : true,
								renderer : function(v) {
									var d = new Date();
									d.setTime(v);
									log(Ext.util.Format.date(d, 'Y-m-d H:i:s'));
									return Ext.util.Format.date(d,
											'Y-m-d H:i:s');
								}
							}, {
								text : '校验标准',
								dataIndex : 'standard',
								width : 250
							}, {
								text : '说明',
								dataIndex : 'note',
								width : 250
							}, {
								text : '风险类型',
								dataIndex : 'type',
								width : 250
							}],
					dockedItems : [{
								xtype : 'pagingtoolbar',
								store : logStore, // same store GridPanel is
													// using
								dock : 'bottom',
								displayInfo : true,
								displayMsg : '显示{0}-{1}条，共{2}条',
								emptyMsg : '无数据'
							}],
						listeners:{
							itemdblclick: function(c, record, item, index){
								var select = grid.getSelectionModel()
								.getSelection();
								if (select.length == 0)
									Ext.Msg.alert('错误', '请选择要查看的日志')
								else {
									var riskType = select[0].get("type");
									if (riskType == '错误')
										Ext.Msg.alert('提示', '无数据')
									else {
										var standard = select[0]
												.get("standard");
										var id = select[0].get("id");
										var dealTime = Ext.util.Format.date(new Date(select[0].get("time")),'Y-m-d H:m:s');
										var url = "showRiskData.jsp?standard="
												+ standard + "&time="
												+ dealTime + "&id=" + id;
										url = encodeURI(url);
										window.open(url, "_blank");
							}

						}
								}
							}
				});
		this.items = [grid];
		this.callParent(arguments);
	}
})