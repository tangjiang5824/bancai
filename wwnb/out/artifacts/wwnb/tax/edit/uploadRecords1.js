Ext.define('tax.edit.uploadRecords1', {
	extend : 'Ext.panel.Panel',
	layout : "fit",
	initComponent : function() {
		var itemsPerPage = 50;
		var me = this;
		var tableList = Ext.create('Ext.form.ComboBox', {
					fieldLabel : '数据类型',
					labelWidth : 60,
					width : 400,
					name : 'tableName',
					matchFieldWidth : false,
					emptyText : "--请选择--",
					displayField : 'tableName',
					valueField : 'tableName',
					editable : false,
					onTriggerClick : function() {
						this.expand();
					},
					store : {
						fields : ['tableName'],
						proxy : {
							type : 'ajax',
							url : 'tableNameListById.do',
							extraParams : {
								organizationId : me.organizationId
							},
							reader : {
								type : 'json'
							}
						},
						autoLoad : true
					}
				});
		var firstDate = new Date();
		firstDate.setDate(1);
		var startTime = Ext.create('Ext.ux.form.MonthField', {
					xtype : 'monthfield',
					margin : '0 10 0 0',
					fieldLabel : '所属期始',
					width : 180,
					labelWidth : 60,
					name : 'startTime',
					format : 'Y-m',
					maxValue : new Date(),
					value : Ext.util.Format.date(Ext.Date.add(new Date(),
									Ext.Date.MONTH, -12), "Y-m")
				});
		var deadline = Ext.create('Ext.ux.form.MonthField', {
					xtype : 'monthfield',
					id : 'deadline',
					fieldLabel : '所属期止',
					labelWidth : 60,
					width : 180,
					margin : '0 20 0 0',
					name : 'deadline',
					format : 'Y-m',
					maxValue : new Date(),
					value : Ext.util.Format.date(Ext.Date.add(new Date(),
									Ext.Date.MONTH, 0), "Y-m")
				});
		var now = new Date();
		var allStore = Ext.create('Ext.data.Store', {
					pageSize : itemsPerPage,
					fields : ["uploads", "tableName", "uploadTime",
							"startTime", "endTime", "state"],
					proxy : {
						type : 'ajax',
						url : 'uploadRecordsListAll.do',
						extraParams : {
							organizationId : me.organizationId,
							startTime : Ext.Date.format(new Date(now
											.setMonth((now.getMonth() - 1))),
									'Y-m'),// Ext.Date.format(new
											// Date(),'Y-m-d'),
							deadline : Ext.Date.format(new Date(), 'Y-m')
						},
						reader : {
							type : 'json',
							rootProperty : 'value',
							totalProperty : 'totalCount'
						}
					},
					autoLoad : true
				});

		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			items : [tableList, startTime, deadline, {
				xtype : 'button',
				text : '查询',
				margin : '0 50 0 0',
				handler : function() {
					var dataStore = Ext.create('Ext.data.Store', {
								pageSize : itemsPerPage,
								fields : ["uploads", "tableName", "uploadTime",
										"startTime", "endTime", "state"],
								proxy : {
									type : 'ajax',
									isSynchronous : true,
									url : 'uploadRecordsList.do',
									extraParams : {
										tableName : tableList.getValue(),
										startTime : Ext.Date.format(startTime
														.getValue(), 'Y-m'),
										deadline : Ext.Date.format(deadline
														.getValue(), 'Y-m')
									},
									reader : {
										type : 'json',
										rootProperty : 'value',
										totalProperty : 'totalCount'
									}
								},
								autoLoad : true
							});
					var grid = Ext.create('Ext.grid.Panel', {
								store : dataStore,
								id : 'upGrid',
								viewConfig : {
									enableTextSelection : true
								},
								columns : [{
											dataIndex : 'uploads',
											text : '上传者',
											width : 100
										}, {
											dataIndex : 'tableName',
											text : '表名',
											width : 300
										}, {
											dataIndex : 'uploadTime',
											text : '上传时间',
											width : 100,
											renderer : function(v) {
												return Ext.util.Format.date(
														new Date(v),
														'Y-m-d H:i:s');
											}
										}, {
											dataIndex : 'startTime',
											text : '所属期始',
											width : 100
										}, {
											dataIndex : 'endTime',
											text : '所属期止',
											width : 100
										}, {
											dataIndex : 'state',
											text : '状态',
											width : 200,
											renderer : function(value) {
												if (value == 0)
													return "未保存";
												else if (value == 1)
													return "已保存";
												else if (value == 2)
													return "已匹配";
												else if (value == 3)
													return "已进行风险发现";
												else if (value == 4)
													return "上传成功但已删除";
												else if (value == 5)
													return "当期无数据";
											}
										}],
								dockedItems : [{
											xtype : 'pagingtoolbar',
											store : dataStore, // same store
																// GridPanel is
																// using
											dock : 'bottom',
											margin : '0 50 0 0',
											displayInfo : true,
											displayMsg : '显示{0}-{1}条，共{2}条',
											emptyMsg : '无数据',
											beforePageText : '第',
											afterPageText : '页，共{0}页'
										}],
								listeners: {
									itemdblclick: function(c, record, item, index){
										var select = me.items.get(0).getSelection();
										if (select.length == 0)
											Ext.Msg.alert('错误', '请选择要查看的记录')
										else {
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
								}
							});

					me.remove(0);
					me.add(grid);
				}
			}, {
				text : '查看详细信息',
				handler : function() {
					var select = me.items.get(0).getSelection();
					if (select.length == 0)
						Ext.Msg.alert('错误', '请选择要查看的记录')
					else {
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
			},  {
				text : '删除',
				handler : function() {
					var select = me.items.get(0).getSelection();
					if (select.length == 0)
						Ext.Msg.alert('错误', '请选择要删除的记录')
					else {
						Ext.Msg.show({
							title : '操作确认',
							message : '是否删除该上传记录',
							buttons : Ext.Msg.YESNO,
							icon : Ext.Msg.QUESTION,
							fn : function(btn) {
								if (btn === 'yes') {
									Ext.Ajax.request({
										async : false,
										url : 'deleteByUploadId.do',
										params : {
											tableName : select[0].get('tableName'),
											id : select[0].get("id"),
											state : select[0].get("state")

										},
										success : function(response) {
											var obj = Ext
													.decode(response.responseText);
											if (obj) {
												Ext.MessageBox.alert("提示", "删除成功！");
												allStore.load({
															params : {
																start : 0,
																limit : itemsPerPage
															}
														})
											} else {
												Ext.MessageBox.alert("提示", "删除失败！该字段存在数据。");
												allStore.load({
															params : {
																start : 0,
																limit : itemsPerPage
															}
														})
											}
										},
										failure : function(response) {
											Ext.MessageBox.alert("提示",
													"服务器异常，请检查网络连接，或者联系管理员");
										}
									})

								}
							}
						});
						
					}
				}
			}]
		});
		var allGrid = Ext.create('Ext.grid.Panel', {
					store : allStore,
					autoScroll : true,
					viewConfig : {
						enableTextSelection : true
					},
					columns : [{
								dataIndex : 'uploads',
								text : '上传者',
								width : 100
							}, {
								dataIndex : 'tableName',
								text : '表名',
								width : 300
							}, {
								dataIndex : 'uploadTime',
								text : '上传时间',
								width : 100,
								renderer : function(v) {
									return Ext.util.Format.date(new Date(v),
											'Y-m-d H:i:s');
								}
							}, {
								dataIndex : 'startTime',
								text : '所属期始',
								width : 100
							}, {
								dataIndex : 'endTime',
								text : '所属期止',
								width : 100
							}, {
								dataIndex : 'state',
								text : '状态',
								width : 200,
								renderer : function(value) {
									if (value == 0)
										return "未保存";
									else if (value == 1)
										return "已保存";
									else if (value == 2)
										return "已匹配";
									else if (value == 3)
										return "已进行风险发现";
									else if (value == 4)
										return "上传成功但已删除";
									else if (value == 5)
										return "当期无数据";
								}
							}],
					dockedItems : [{
								xtype : 'pagingtoolbar',
								store : allStore, // same store GridPanel is
													// using
								dock : 'bottom',
								height : 78,
								margin : '0 0 0 0',
								displayInfo : true,
								displayMsg : '显示{0}-{1}条，共{2}条',
								emptyMsg : '无数据',
								beforePageText : '第',
								afterPageText : '页，共{0}页'
							}],
							listeners: {
									itemdblclick: function(c, record, item, index){
										var select = me.items.get(0).getSelection();
										if (select.length == 0)
											Ext.Msg.alert('错误', '请选择要查看的记录')
										else {
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
								}
				})
		this.items = [allGrid];
		this.tbar = toolbar;
		this.callParent(arguments);
	}
})