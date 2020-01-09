Ext.define('tax.edit.unmatchData', {
	extend : 'Ext.panel.Panel',
	title : '未匹配数据处理',
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
				fields : [ 'tableName' ],
				proxy : {
					type : 'ajax',
					url : 'uptableName.do',
					reader : {
						type : 'json'
					}
				},
				autoLoad : true
			},
			listeners: {
				select: function(ombo, records, eOpts){
					dataStore.reload();
				}
			}
		});
		var dataStore = Ext.create('Ext.data.Store', {
			pageSize : itemsPerPage,
			fields : [ "tableName", "taxName", "name", "uploadId" ,"id","taxCode"],
			proxy : {
				type : 'ajax',
				url : 'tax/edit/getUnmatchDataList.do',
				extraParams : {
					tableName : tableList.getValue()
				},
				reader : {
					type : 'json',
					rootProperty : 'value',
					totalProperty : 'totalCount'
				}

			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					store.getProxy().setExtraParams({

						tableName : tableList.getValue()


					});
				}

			},
			autoLoad : true
		});

		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			items : [
				tableList,
				{
					xtype : 'button',
					text : '手动输入纳税识别号',
					margin : '0 40 0 0',
					handler : function() {
						var select = Ext.getCmp('matchInfo').getSelectionModel().getSelection();
						if (select.length == 0)
							Ext.Msg.alert('提示', '请选择要修改的数据')
							else
							{   var win = Ext.create('tax.edit.manualInput',{
								id: select[0].get('id'),
								tableName: select[0].get('tableName'),
								taxName: select[0].get('taxName'),
								name: select[0].get('name'),
								uploadId: select[0].get('uploadId'),
								taxCode: select[0].get('taxCode'),
								listeners : {
									close : function(panel, eOpts) {
										var current = dataStore.currentPage;
										log("current"+current),
										dataStore.reload({
											
										});
									}
								}
							});
							win.show();
							}
					}
				},
				{
					text : '查看模糊匹配结果',
					margin : '0 40 0 0',
					handler : function() {

						var select = me.items.get(0).getSelection();
						// console.log(select);
						if (select.length == 0)
							Ext.Msg.alert('错误', '请选择要查看的记录')
							else {

								var store = Ext.create('Ext.data.Store', {
									pageSize : itemsPerPage,
									fields : [ "tableName", "oldName", "trueName", "matchId","code"],
									proxy : {
										type : 'ajax',
										url : 'tax/edit/getSimilarInfo.do',
										reader : {
											type : 'json',
											rootProperty : 'value',
											totalProperty : 'totalCount'
										}

									},
									listeners : {
										beforeload : function(store, operation, eOpts) {
											log(store);
											store.getProxy().setExtraParams({

												id : select[0].get('id')


											});
										}

									},
									autoLoad : true
								});


								var toolbar = Ext.create('Ext.toolbar.Toolbar', {
									items : [

										{
											xtype : 'button',
											text : '选择该项作为正确匹配结果',
											margin : '0 20 0 0',
											handler : function() {

												var select = Ext.getCmp('autoInputMatch').getSelectionModel().getSelection();
												if (select.length == 0)
													Ext.Msg.alert('提示', '请选择数据')
													else
													{
														var taxName =this;
														Ext.Ajax.request({
															url: 'tax/edit/autoInputCode.do',
															params: {
																id:select[0].get('matchId'),																
																tableName:select[0].get('tableName'),
																trueName:select[0].get('trueName'),
																oldName:select[0].get('oldName'),
																code:select[0].get('code')

															},
															success: function(response){
																win.close();
																var current = dataStore.currentPage;
																console.log("current"+current),
																dataStore.reload({

																});
																Ext.MessageBox.alert("提示", "数据已更新");
															},
															failure : function(response) {
																Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
															}
														})
													}
											}
										}, {
											text : '查看详细信息',
											margin : '0 10 0 10',
											handler : function() {
												var select = Ext.getCmp('autoInputMatch').getSelectionModel().getSelection();
												if (select.length == 0)
													Ext.Msg.alert('提示', '请选择数据')
													else
													{							
														var url="showSimilarMatchInfo.jsp?tableName="+encodeURI(select[0].get('tableName'))
															+"&code="+encodeURI(select[0].get('code'))+"&matchId="+encodeURI(select[0].get('matchId'));
														window.open(url, "_blank");
													}

											}
										}
										]
								});
								var panel = Ext.create('Ext.grid.Panel',{
									id:'autoInputMatch',
									store: store,
									autoScroll : true,
									viewConfig : {
										enableTextSelection : true
									},
									columns: [ {
										dataIndex : 'tableName',
										text : '所在表名',
										width : 300
									}, {
										dataIndex : 'oldName',
										text : '待确定纳税人名称',
										width : 300
									}, {
										dataIndex : 'trueName',
										text : '模糊匹配结果',
										width : 300
									} ,{
										dataIndex : 'code',
										text : '模糊匹配识别号',
										width : 300
									} 
									, {dataIndex: 'matchId',text: 'matchId',width: 50,hidden : true}
									],
									dockedItems : [ {
										xtype : 'pagingtoolbar',
										store : store, // same store GridPanel is using
										dock : 'bottom',
										height : 78,
										margin : '0 0 0 0',
										displayInfo : true,
										displayMsg : '显示{0}-{1}条，共{2}条',
										emptyMsg : '无数据',
										beforePageText : '第',
										afterPageText : '页，共{0}页'
									} ]
									
								});
								var win = Ext.create('Ext.window.Window',{
									
									layout: 'fit',
									modal: true,
									width:1000,
									height:500,
									items:[panel],
									tbar : toolbar
									
								})
								win.show();





							}
					}
				} ]
		});
		var allGrid = Ext.create('Ext.grid.Panel', {
			id:'matchInfo',
			store : dataStore,
			autoScroll : true,
			viewConfig : {
				enableTextSelection : true
			},
			columns : [ {
				dataIndex : 'startTime',
				text : '所属期始',
				width : 120
			}, {
				dataIndex : 'endTime',
				text : '所属期止',
				width : 120
			}, {
				dataIndex : 'tableName',
				text : '所在表名',
				width : 300
			}, {
				dataIndex : 'taxName',
				text : '所在列名',
				width : 300
			}, {
				dataIndex : 'name',
				text : '纳税人名称',
				width : 300
			} 
			, {dataIndex: 'id',text: 'id',width: 50,hidden : true},
			{dataIndex: 'uploadId',text: 'uploadId',width: 50,hidden : true},
			{dataIndex: 'taxCode',text: 'taxCode',width: 50,hidden : true}
			],
			dockedItems : [ {
				xtype : 'pagingtoolbar',
				store : dataStore, // same store GridPanel is using
				dock : 'bottom',
				height : 78,
				margin : '0 0 0 0',
				displayInfo : true,
				displayMsg : '显示{0}-{1}条，共{2}条',
				emptyMsg : '无数据',
				beforePageText : '第',
				afterPageText : '页，共{0}页'
			} ],
			listeners:{
				itemdblclick: function(m, record, item, index){


					var select = me.items.get(0).getSelection();
					// console.log(select);
					if (select.length == 0)
						Ext.Msg.alert('错误', '请选择要查看的记录')
						else {

							var store = Ext.create('Ext.data.Store', {
								pageSize : itemsPerPage,
								fields : [ "tableName", "oldName", "trueName", "matchId","code"],
								proxy : {
									type : 'ajax',
									url : 'tax/edit/getSimilarInfo.do',
									reader : {
										type : 'json',
										rootProperty : 'value',
										totalProperty : 'totalCount'
									}

								},
								listeners : {
									beforeload : function(store, operation, eOpts) {
										log(store);
										store.getProxy().setExtraParams({

											id : select[0].get('id')


										});
									}

								},
								autoLoad : true
							});


							var toolbar = Ext.create('Ext.toolbar.Toolbar', {
								items : [

									{
										xtype : 'button',
										text : '选择该项作为正确匹配结果',
										margin : '0 20 0 0',
										handler : function() {

											var select = Ext.getCmp('autoInputMatch').getSelectionModel().getSelection();
											if (select.length == 0)
												Ext.Msg.alert('提示', '请选择数据')
												else
												{
													var taxName =this;
													Ext.Ajax.request({
														url: 'tax/edit/autoInputCode.do',
														params: {
															id:select[0].get('matchId'),																
															tableName:select[0].get('tableName'),
															trueName:select[0].get('trueName'),
															oldName:select[0].get('oldName'),
															code:select[0].get('code'),

														},
														success: function(response){
															win.close();
															var current = dataStore.currentPage;
															console.log("current"+current),
															dataStore.reload({

															});
															Ext.MessageBox.alert("提示", "数据已更新");
														},
														failure : function(response) {
															Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
														}
													})
												}
										}
									}, {
										text : '查看详细信息',
										margin : '0 10 0 10',
										handler : function() {
											var select = Ext.getCmp('autoInputMatch').getSelectionModel().getSelection();
											if (select.length == 0)
												Ext.Msg.alert('提示', '请选择数据')
												else
												{							
													var url="showSimilarMatchInfo.jsp?tableName="+encodeURI(select[0].get('tableName'))
														+"&code="+encodeURI(select[0].get('code'))+"&matchId="+encodeURI(select[0].get('matchId'));
													window.open(url, "_blank");
												}

										}
									}
									]
							});
							var panel = Ext.create('Ext.grid.Panel',{
								id:'autoInputMatch',
								store: store,
								autoScroll : true,
								viewConfig : {
									enableTextSelection : true
								},
								columns: [ {
									dataIndex : 'tableName',
									text : '所在表名',
									width : 300
								}, {
									dataIndex : 'oldName',
									text : '待确定纳税人名称',
									width : 300
								}, {
									dataIndex : 'trueName',
									text : '模糊匹配结果',
									width : 300
								} ,{
									dataIndex : 'code',
									text : '模糊匹配识别号',
									width : 300
								} 
								, {dataIndex: 'matchId',text: 'matchId',width: 50,hidden : true},
								],
								dockedItems : [ {
									xtype : 'pagingtoolbar',
									store : store, // same store GridPanel is using
									dock : 'bottom',
									height : 78,
									margin : '0 0 0 0',
									displayInfo : true,
									displayMsg : '显示{0}-{1}条，共{2}条',
									emptyMsg : '无数据',
									beforePageText : '第',
									afterPageText : '页，共{0}页'
								} ]
								
							});
							var win = Ext.create('Ext.window.Window',{
								
								layout: 'fit',
								modal: true,
								width:1000,
								height:500,
								items:[panel],
								tbar : toolbar
								
							})
							win.show();





						}
				
				}
			}
		})
		this.items = [ allGrid ];
		this.tbar = toolbar;
		this.callParent(arguments);
	}
})