Ext.define('system.dataTable.addExcel', {
	extend : 'Ext.window.Window',
	title : '添加数据表',
	closable : true,
	id : 'addTable',
	width : 1000,
	// height: '100%',
	height : 500,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var toolbar1 = Ext.create("Ext.toolbar.Toolbar", {
			dock : 'top',
			items : [{
						xtype : 'textfield',
						name : 'tabName',
						dataIndex : 'tabName',
						id : 'tabName',
						fieldLabel : '表名',
						labelWidth : 50,
						msgTarget : 'side',
						width : 200,
						allowBlank : false,
						anchor : '98%',
						emptyText : '请填写表名',
						validator : function(value) {
							var success = true;
							Ext.Ajax.request({
										url : 'system/dataTable/existForAdd.do',
										async : false,
										params : {
											tableName : value
										},
										success : function(response) {
											var text = response.responseText;
											var obj = Ext.JSON.decode(text);
											success = obj;
										}
									});
							if (success == true)
								return success;
							else
								return "表名已存在";
						}

					}, {
						fieldLabel : '组织名称',
						name : 'orgId',
						id : 'orgId',
						labelWidth : 60,
						width : 160,
						xtype : 'combo',
						store : {
							fields : ['id', 'name'],
							proxy : {
								type : 'ajax',
								url : 'organizationList.do',
								reader : {
									type : 'json'
								}
							},
							autoLoad : true
						},
						displayField : 'name',
						valueField : 'id',
						editable : false
					}, {
						fieldLabel : '数据类型',
						name : 'tableType',
						id : 'tableType',
						labelWidth : 60,
						width : 170,
						xtype : 'combo',
						store : {
							fields : ['id', 'name'],
							data : [

							{
										"id" : "1",
										"name" : "金税三期数据"
									}, {
										"id" : "0",
										"name" : "组织部门数据"
									}

							],
							autoLoad : true

						},
						displayField : 'name',
						valueField : 'id',
						editable : false
					}, {

						name : 'uploadCycle',
						dataIndex : 'uploadCycle',
						id : 'uploadCycle',
						fieldLabel : '上传周期（月）',
						labelWidth : 100,
						width : 200,
						xtype : 'combo',
						store : {
							fields : ['id', 'name'],
							data : [

							{
										"id" : "1",
										"name" : "月报(1)"
									}, {
										"id" : "0",
										"name" : "实时(0)"
									}, {
										"id" : "3",
										"name" : "季报(3)"
									}, {
										"id" : "6",
										"name" : "半年报(6)"
									}, {
										"id" : "12",
										"name" : "年报(12)"
									}

							],
							autoLoad : true

						},
						displayField : 'name',
						valueField : 'id',
						editable : false
					}, {
						xtype : 'monthfield',
						name : 'cycleStart',
						dataIndex : 'cycleStart',
						id : 'cycleStart',
						margin : '0 10 0 0',
						fieldLabel : '周期开始时间',
						width : 200,
						hidden : true,
						labelWidth : 100,
						format : 'Y-m',
						maxValue : new Date(),
						value : '2017-12'
					}

			]

		});
		var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
			dock : "top",
			items : [{
						xtype : 'button',
						iconAlign : 'center',
						iconCls : 'rukuicon ',
						text : '添加表项',
						handler : function() {
							var data = [{
										'fieldName' : '',
										'fieldType' : '2',
										'TaxUnitCode' : '0',
										'TaxUnitName' : '',
										'isNull' : '1',
										'fieldCheck' : '0',
										'width' : '200'
									}];
							Ext.getCmp('addDataGrid').getStore().loadData(data,
									true);

						}

					}, {
						xtype : 'button',
						iconAlign : 'center',
						iconCls : 'rukuicon ',
						text : '删除表项',
						handler : function() {
							var select = Ext.getCmp('addDataGrid')
									.getSelectionModel().getSelection();

							// Ext.Msg.alert(select[0].id+'');
							if (select.length == 0)
								Ext.Msg.alert('错误', '请选择要删除的数据')
							else
								Ext.getCmp('addDataGrid').getStore()
										.removeAt(Ext.getCmp('addDataGrid')
												.getStore().indexOf(select[0]));

						}
					}, {
						xtype : 'button',
						iconAlign : 'center',
						iconCls : 'rukuicon ',
						text : '保存',

						handler : function() {

							var tabName = Ext.getCmp('tabName').getValue();
							var organizationId = Ext.getCmp('orgId').getValue();
							var tableType = Ext.getCmp('tableType').getValue();
							var uploadCycle = Ext.getCmp('uploadCycle')
									.getValue();
							var cycleStart = Ext.getCmp('cycleStart')
									.getValue();
							// console.log(cycleStart);
							// 取出grid的字段名字段类型
							var select = Ext.getCmp('addDataGrid').getStore()
									.getData();
							var s = new Array();
							select.each(function(rec) {
										delete rec.data.id;
										s.push(JSON.stringify(rec.data));
									});

							Ext.Ajax.request({
								url : 'system/dataTable/addTable.do',
								submitEmptyText : false,
								params : {
									s : "[" + s + "]",
									tableName : tabName,
									organizationId : organizationId,
									tableType : tableType,
									uploadCycle : uploadCycle,
									cycleStart : cycleStart

								},
								success : function(response) {
									var obj = Ext.decode(response.responseText);
									if (obj) {

										Ext.MessageBox.alert("提示", "保存成功！");
										me.close();

									} else {
										// 数据库约束，返回值有问题
										Ext.MessageBox.alert("提示", "保存失败！");

									}

								},
								failure : function(response) {
									Ext.MessageBox.alert("提示", "新建数据表失败！");
								}
							});

						}
					}]
		});
		var grid = Ext.create("Ext.grid.Panel", {
					id : 'addDataGrid',
					dockedItems : [toolbar1, toolbar2],
					store : {
						fields : ['fieldName', 'fieldType', 'taxUnitCode',
								'taxUnitName', 'isNull', 'fieldCheck', 'width']
					},
					columns : [{
								dataIndex : 'fieldName',
								name : 'fieldName',
								text : '字段名',
								width : 160,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								dataIndex : 'fieldType',
								name : 'fieldType',
								text : '字段类型',
								width : 110,
								renderer : function(value) {
									if (value == 1)
										return "数字型";
									else if (value == 2)
										return "字符串";

								},
								editor : {// 文本字段
									xtype : 'combo',
									store : {
										fields : ['id', 'name'],
										data : [

										{
													"id" : "1",
													"name" : "数字型"
												}, {
													"id" : "2",
													"name" : "字符串"
												}]
									},
									displayField : 'name',
									valueField : 'id',

									editable : false,
									allowBlank : false
								}
							}, {
								dataIndex : 'taxUnitCode',
								text : '纳税人识别号',
								width : 110,
								renderer : function(value) {
									return value == 1 ? '是' : '否';
								},
								editor : {// 文本字段
									xtype : 'combo',

									store : {
										fields : ['id', 'name'],
										data : [{
													"id" : "1",
													"name" : "是"
												}, {
													"id" : "0",
													"name" : "否"
												}

										]
									},
									displayField : 'name',
									valueField : 'id',
									editable : false,
									allowBlank : false,
									value : '0'

								}

							}, {
								dataIndex : 'taxUnitName',
								text : '对应纳税公司名称',
								width : 192,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								dataIndex : 'isNull',
								text : '字段为空',
								width : 110,
								renderer : function(value) {
									return value == 1 ? '是' : '否';
								},
								editor : {// 文本字段
									id : 'isNullCmb',
									xtype : 'combo',
									store : {
										fields : ['id', 'name'],
										data : [{
													"id" : "1",
													"name" : "是"
												}, {
													"id" : "0",
													"name" : "否"
												}]

									},
									displayField : 'name',
									valueField : 'id',
									editable : false,
									allowBlank : false

								}

							}, {
								dataIndex : 'fieldCheck',
								name : 'fieldCheck',
								text : '选择字段校验规则',
								width : 130,
								renderer : function(value) {
									if (value == 4)
										return "银行卡";

									else if (value == 2)
										return "电话";
									else if (value == 3)
										return "身份证";
								},
								editor : {// 文本字段
									xtype : 'combo',
									store : {
										fields : ['id', 'name'],
										data : [

										{
													"id" : "2",
													"name" : "电话"
												}, {
													"id" : "3",
													"name" : "身份证"
												}, {
													"id" : "4",
													"name" : "银行卡"
												}]
									},
									displayField : 'name',
									valueField : 'id',
									editable : false,
									allowBlank : false
								}
							}, {
								dataIndex : 'width',
								name : 'width',
								text : '宽度',
								width : 160,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}],
					viewConfig : {
						plugins : {
							ptype : "gridviewdragdrop",
							dragText : "可用鼠标拖拽进行上下排序"
						}
					},
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit : 1
							})],
					selType : 'rowmodel'
				});
		this.items = [grid];
		this.callParent(arguments);
	}

})