Ext.define('system.dataTable.main', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : 'fit',
	title : '数据表管理',
	initComponent : function() {
		var itemsPerPage = 50; // set the number of items you want per page
		var department = Ext.create('Ext.form.ComboBox', {
					fieldLabel : '组织名称',
					labelWidth : 80,
					witdth : 100,
					margin : '0 20 0 0',
					id : 'organizationId',
					name : 'organizationId',
					emptyText : "--请选择--",
					displayField : 'name',
					valueField : 'id',
					editable : false,
					store : {
						fields : ['id', 'name'],
						proxy : {
							type : 'ajax',
							url : 'organizationList.do',
							reader : {
								type : 'json'
							}
						},
						 listeners:{  
		        	   load : function(store, records, options ){     
			              store.insert(0,{"id": "a", "name": "不限制"}); // 只添加一行用这个比较方便
		            }  
		        },
						autoLoad : true
					},
					forceSelection : true,
					triggerAction : 'all',
					selectOnFocus : true,
					listeners : {
						'select' : function(combo, records, eOpts) {
							userStore.load({
										params : {
											organizationId : Ext
													.getCmp('organizationId')
													.getValue()

										}
									});
						}
					}

				});

		var userStore = Ext.create('Ext.data.Store', {
					autoLoad : true,
					fields : ['name'],
					pageSize : itemsPerPage, // items per page
					proxy : {
						url : 'system/dataTable/listTable.do',
						type : 'ajax',
						reader : {
							type : 'json',
							rootProperty : 'value',
							totalProperty : 'totalCount'
						},
						listeners : {
							beforeload : function(store, operation, eOpts) {
								store.getProxy().setExtraParams({
									organizationId : Ext
											.getCmp('organizationId')
											.getValue()

								});
							}
						}
					}
				});

		userStore.load({
			params : {
				start : 0,
				limit : itemsPerPage

			}
				/*
				 * callback: function(records, operation, success) {
				 * console.log(userStore.getCount()); for(var i=0;i<userStore.getCount();i++){
				 * var recored = userStore.getAt(i);
				 * if(recored.get("uploadCycle")==0)
				 * {recored.set("uploadCycle","实时");}//; record.commit();}
				 * if(recored.get("uploadCycle")==1)
				 * {recored.set("uploadCycle","月报")}//; record.commit();}
				 * if(recored.get("uploadCycle")==3)
				 * {recored.set("uploadCycle","季报")}//; record.commit();}
				 * if(recored.get("uploadCycle")==6)
				 * {recored.set("uploadCycle","半年报")}//; record.commit();}
				 * if(recored.get("uploadCycle")==12)
				 * {recored.set("uploadCycle","年报")}//; record.commit();}
				 * 
				 * //record.commit(); }
				 * //console.log(userStore.getAt(0).get('uploadCycle'));//.data.uploadCycle);
				 *  }
				 */
			});

		var toobar = Ext.create('Ext.toolbar.Toolbar', {
			items : [{
						xtype : 'button',
						text : '添加',
						handler : function() {
							var win = Ext.create('system.dataTable.addExcel',
									{})
							win.show();
						}
					}, {
						xtype : 'button',
						text : '修改',
						id : 'editTable',
						handler : function() {
							var select = Ext.getCmp('adminMain')
									.getSelectionModel().getSelection();
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要修改的数据');
							else {
								var edit = Ext.create(
										'system.dataTable.editExcel', {
											tableName : select[0]
													.get('tableName')
										});
								edit.show();
							}
						}
					}, {
						text : '删除',
						handler : function() {
							var select = Ext.getCmp('adminMain')
									.getSelectionModel().getSelection();
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要删除的数据')
							else
								Ext.Msg.confirm('提示', '确认删除选中的数据吗？', function(
										choose) {
									if (choose == 'yes')
										Ext.Ajax.request({
											url : 'system/dataTable/deleteTable.do',
											params : {
												tableName : select[0]
														.get('tableName')
											},
											success : function(response) {
												var obj = Ext
														.decode(response.responseText);
												// console.log(">>>>>>>>>"+obj);
												if (obj) {
													Ext.MessageBox.alert("提示",
															"删除成功！");
													Ext.getCmp('adminMain').store
															.load();
												} else {
													// 数据库约束，返回值有问题
													Ext.MessageBox.alert("提示",
															"删除失败！");
													Ext.getCmp('adminMain').store
															.load();
												}
											},
											failure : function(response) {
												Ext.MessageBox
														.alert("提示",
																"服务器异常，请检查网络连接，或者联系管理员");
											}
										});
								})

						}
					}, department]
		})
		
		var grid = Ext.create('Ext.grid.Panel', {
					store : userStore,
					id : 'adminMain',
					autoScroll : Boolean,
					columns : [{
								text : '表名',
								dataIndex : 'tableName',							
								flex:2
							}, {
								text : '组织名称',
								dataIndex : 'name',
								flex:1
							}, {
								text : '上传周期（月）',
								dataIndex : 'uploadCycle',
								flex:1,
								renderer : function(value) {
									if (value == 0)
										return "实时(0)";
									else if (value == 1)
										return "月报(1)";
									else if (value == 3)
										return "季报(3)";
									else if (value == 6)
										return "半年报(6)";
									else if (value == 12)
										return "年报(12)";

								}
							}
//							, {
//								text : '周期开始时间',
//								dataIndex : 'cycleStart',
//								width : 200
//							}
							],
					tbar : toobar,
					dockedItems : [{
								xtype : 'pagingtoolbar',
								store : userStore, // same store GridPanel is
								// using
								dock : 'bottom',
								displayInfo : true,
								displayMsg : '显示{0}-{1}条，共{2}条',
								emptyMsg : '无数据'
							}]
				});

		this.items = [grid];
		this.callParent();
	}
})