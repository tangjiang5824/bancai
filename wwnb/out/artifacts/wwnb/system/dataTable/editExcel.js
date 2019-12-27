Ext.define('system.dataTable.editExcel', {
	extend : 'Ext.window.Window',
	title : '修改数据表',
	width : 1000,
	height : 500,
	autoScroll : true,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
					dock: 'top',
					items : [{
								xtype : 'textfield',
								name : 'tName',
								id : 'tName',
								fieldLabel : '表名',
								labelWidth : 50,
								msgTarget : 'side',
								width : 200,
								editable : true
							}, { // 旧的表名
								xtype : 'textfield',
								name : 'oldTName',
								id : 'oldTName',
								hidden : true
							}, { // 旧的组织代码
								xtype : 'textfield',
								name : 'oldOID',
								id : 'oldOID',
								hidden : true
							}, {
								fieldLabel : '组织名称',
								name : 'oId',
								id : 'oId',
								xtype : 'combo',
								labelWidth : 60,
								width : 160,
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
												"id" : 1,
												"name" : "金税三期数据"
											}, {
												"id" : 0,
												"name" : "组织部门数据"
											}],
									autoLoad : true

								},
								displayField : 'name',
								valueField : 'id',
								editable : false
							}, {
								name : 'uploadCycle',
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
										},{
											"id" : "12",
											"name" : "年报(12)"
										}],
									autoLoad : true

								},
								displayField : 'name',
								valueField : 'id',
								editable : false
							}, {
								xtype : 'monthfield',
								name : 'cycleStart',
								id : 'cycleStart',
								fieldLabel : '周期开始时间',
								width : 200,
								labelWidth : 100,
								hidden:true,
								format : 'Y-m',
								maxValue : new Date(),
								value : Ext.util.Format.date(Ext.Date.add(
												new Date(), Ext.Date.MONTH, 0),
										"Y-m")
							}]

				})
		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock: 'top',
			items : [{
				xtype : 'button',
				text : '添加表项',
				handler : function() {
					var data = [{
								'dataId' : '-1',
								'fieldName' : '',
								'oldFieldName' : '',
								'fieldType' : '2',
								'oldFieldType' : '',
								'TaxUnitCode' : '0',
								'oldTaxUnitCode' : '',
								'TaxUnitName' : '',
								'oldTaxUnitName' : '',
								'isNull' : '0',
								'oldIsNull' : '',
								'fieldCheck' : '0',
								'width':'200'
							}];
					Ext.getCmp('editDataGrid').getStore().loadData(data, true);;

				}

			}, {
				xtype : 'button',
				text : '删除表项',
				handler : function() {
					var record = Ext.getCmp('editDataGrid').getSelectionModel()
							.getLastSelected();
					var tabName = Ext.getCmp('tName').getValue();
					var select = Ext.getCmp('editDataGrid').getSelectionModel()
							.getSelection();
					// Ext.Msg.alert(select[0].id+'');
					if (select.length == 0)
						Ext.Msg.alert('错误', '请选择要删除的数据')
					else if (record.get('dataId') == -1)
						// console.log(">>"+record.get('dataId'));
						Ext.getCmp('editDataGrid').getStore().removeAt(Ext
								.getCmp('editDataGrid').getStore()
								.indexOf(select[0]));
					else if (record.get('dataId') > 0) {
						// console.log("text"+record.get('fieldName'));
						Ext.Ajax.request({
							//url : 'system/dataTable/dropColumn.do',
							url : 'system/dataTable/haveData.do',
							submitEmptyText : false,
							params : {
								fieldName : record.get('fieldName'),
								tableName : tabName
							},
								
							 success : function(response) {
								 
								 var obj=Ext.decode(response.responseText);
								 console.log(obj);
								 if(obj) {
									 Ext.MessageBox.alert("提示", "不允许删除存在数据的字段");
									/* Ext.Msg.confirm('提示', '确认删除存在数据的字段吗？', function(
								 
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
											});*/}
								else { 
									Ext.Ajax.request({
										url : 'system/dataTable/dropColumn.do',
										submitEmptyText : false,
										params : {
											fieldName : record.get('fieldName'),
											tableName : tabName
										} });
									Ext.MessageBox.alert("提示", "删除成功");
										Ext.getCmp('editDataGrid').getStore().removeAt(Ext
												.getCmp('editDataGrid').getStore()
												.indexOf(select[0]));
										} },
							failure : function(response) {
								Ext.MessageBox.alert("提示","字段删除失败，请检查"); }
								 
							});
						

					}

				}
			}, {
				xtype : 'button',
				text : '更新',
				handler : function() {

					var tabName = Ext.getCmp('tName').getValue();
					var oldTableName = Ext.getCmp('oldTName').getValue();
					var organizationId = Ext.getCmp('oId').getValue();
					var oldOrganizationId = Ext.getCmp('oldOID').getValue();
					var tableType = Ext.getCmp('tableType').getValue();
					var uploadCycle = Ext.getCmp('uploadCycle').getValue();
					var cycleStart = Ext.getCmp('cycleStart').getValue();

					// 取出grid的字段名字段类型
					var select = Ext.getCmp('editDataGrid').getStore()
							.getData();

					var s = new Array();
					select.each(function(rec) {
						console.log(rec);
								delete rec.data.id;
								s.push(JSON.stringify(rec.data));
							});

					Ext.Ajax.request({
						url : 'system/dataTable/editTable.do',
						submitEmptyText : false,
						params : {
							s : "[" + s + "]",
							tableName : tabName,
							organizationId : organizationId,
							oldTableName : oldTableName,
							oldOrganizationId : oldOrganizationId,
							tableType : tableType,
							uploadCycle : uploadCycle,
							cycleStart : cycleStart
						},
						success : function(response) {
							var obj = Ext.decode(response.responseText);
							if (obj) {
								Ext.MessageBox.alert("提示", "修改成功！");
								me.close();

							} else {

								Ext.MessageBox.alert("提示", "修改失败！");

							}

						},
						failure : function(response) {
							Ext.MessageBox.alert("提示", "修改失败！");
						}
					});
				}
			}]

		});
		var grid = Ext.create('Ext.grid.Panel', {
					id : 'editDataGrid',
					dockedItems:[toolbar1,toolbar2],
					store : {
						fields : ['dataId', 'fieldName', 'oldFieldName',
								'fieldType', 'oldFieldType', 'TaxUnitCode',
								'oldTaxUnitCode', ' TaxUnitName',
								' oldTaxUnitName', 'isNull', 'oldIsNull',
								'fieldCheck','width']

					},
					columns : [{
								xtype : 'gridcolumn',
								dataIndex : 'dataId',
								name : 'dataId',
								text : 'dataId',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							},

							{
								xtype : 'gridcolumn',
								dataIndex : 'fieldName',
								name : 'fieldName',
								text : '字段名',
								width : 160,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {// 原字段名
								xtype : 'gridcolumn',
								dataIndex : 'oldFieldName',
								name : 'oldFieldName',
								text : '原字段名',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								xtype : 'gridcolumn',
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
										data : [{
													"id" : 1,
													"name" : "数字型"
												}, {
													"id" : 2,
													"name" : "字符串"
												}]
									},
									displayField : 'name',
									valueField : 'id',
									editable : false,
									allowBlank : false
								}
							}, {// 原字段类型
								xtype : 'gridcolumn',
								dataIndex : 'oldFieldType',
								name : 'oldFieldType',
								text : '原字段类型',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {// 原纳税人识别号
								xtype : 'gridcolumn',
								dataIndex : 'oldTaxUnitCode',
								name : 'oldTaxUnitCode',
								text : '原纳税人识别号',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								xtype : 'gridcolumn',
								dataIndex : 'TaxUnitCode',
								name : 'TaxUnitCode',
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
												}]
									},
									displayField : 'name',
									valueField : 'id',
									editable : false,
									allowBlank : false

								}

							}, {// 原纳税公司名称
								xtype : 'gridcolumn',
								dataIndex : 'oldTaxUnitName',
								name : 'oldTaxUnitName',
								text : '原纳税人识别号',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								xtype : 'gridcolumn',
								dataIndex : 'TaxUnitName',
								name : 'TaxUnitName',
								text : '对应纳税公司名称',

								width : 192,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {// 原字段是否为空
								xtype : 'gridcolumn',
								dataIndex : 'oldIsNull',
								name : 'oldIsNull',
								text : '原字段为空',
								width : 200,
								hidden : true,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}, {
								xtype : 'gridcolumn',
								dataIndex : 'isNull',
								name : 'isNull',
								text : '字段为空',
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
									allowBlank : false
								}
							}, {
								xtype : 'gridcolumn',
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
									else if (value == 0)
										return "无";
								},
								editor : {// 文本字段
									xtype : 'combo',
									store : {
										fields : ['id', 'name'],
										data : [{
													"id" : "0",
													"name" : "无"
												}, {
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
							},{
								dataIndex : 'width',
								name : 'width',
								text : '宽度',
								width : 100,
								editor : {
									xtype : 'textfield',
									allowBlank : false
								}
							}
							],
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
		this.items=[grid];
		this.callParent(arguments);
	},
	setValues : function(obj) {
		var jsonobj = eval(obj);
		var dataId = new Array();
		var fieldNa = new Array();
		var fieldTy = new Array();
		var taxUnitCo = new Array();
		var taxUnitNa = new Array();
		var isNull = new Array();
		var fieldCheck = new Array();
		var width=new Array();
		var tableType = null;
		var myobj = jsonobj.value;
		for (var i = 0; i < myobj.length; i++) {
			// dataTableDefinition数据id
			dataId[i] = myobj[i].id;
			// 字段名
			fieldNa[i] = myobj[i].text;
			// 字段校验规则
			// fieldCheck[i]=myobj[i].check;
			// 字段类型
			// fieldNa[i]=myobj[i].typet;
			switch (myobj[i].type) {
				case "int" :
					fieldTy[i] = "4";
					break;
				case "float" :
					fieldTy[i] = "1";
					break;
				case "varchar(3000)" :
					fieldTy[i] = "2";
					break;
				case "dateTime" :
					fieldTy[i] = "3";
					break;
				case "varchar(200)" :
					fieldTy[i] = "5";
					break;
				case "varchar(255)" :
					fieldTy[i] = "2";
					break;
			}

			// 纳税人识别号
			taxUnitNa[i] = myobj[i].taxUnitName;
			width[i]=myobj[i].width;

			var a = true, b = false;

			// 纳税公司名称
			// taxUnitCo[i]=myobj[i].taxUnitCode;
			switch (myobj[i].taxUnitCode) {
				case a :
					taxUnitCo[i] = "1";
					break;
				case b :
					taxUnitCo[i] = "0";
					break;
			}

			// 是否允许该字段为空
			switch (myobj[i].isNull) {
				case a :
					isNull[i] = "1";
					break;
				case b :
					isNull[i] = "0";
					break;
				default :
					isNull[i] = '1';
					break;
			}
			// 检查字段
			switch (myobj[i].check) {
				case 0 :
					fieldCheck[i] = "0";
					break;
				case 2 :
					fieldCheck[i] = "2";
					break;
				case null :
					fieldCheck[i] = "0";
					break;
				case 3 :
					fieldCheck[i] = "3";
					break;
				case 4 :
					fieldCheck[i] = "4";
					break;
				default :
					isNull[i] = "0";
					break;
			}

			if (fieldNa[i] != 'uploadId') {
				var data = [{
							'dataId' : dataId[i],
							'fieldName' : fieldNa[i],
							'oldFieldName' : fieldNa[i],
							'fieldType' : fieldTy[i],
							'oldFieldType' : fieldTy[i],
							'TaxUnitCode' : taxUnitCo[i],
							'oldTaxUnitCode' : taxUnitCo[i],
							'TaxUnitName' : taxUnitNa[i],
							'oldTaxUnitName' : taxUnitNa[i],
							'isNull' : isNull[i],
							'oldIsNull' : isNull[i],
							'fieldCheck' : fieldCheck[i],
				'width':width[i]
						}];

				Ext.getCmp('editDataGrid').getStore().loadData(data, true);
			}
		}

		Ext.getCmp('tName').setValue(obj.value[0].tableName);
		Ext.getCmp('oId').setValue(obj.value[0].organizationId);
		Ext.getCmp('oldTName').setValue(obj.value[0].tableName);
		Ext.getCmp('oldOID').setValue(obj.value[0].organizationId);
		Ext.getCmp('tableType').setValue(obj.value[0].Expr2);
		switch(obj.value[0].uploadCycle){
		case 0:Ext.getCmp('uploadCycle').setValue('实时(0)');break;
		case 1:Ext.getCmp('uploadCycle').setValue('月报(1)');break;
		case 3:Ext.getCmp('uploadCycle').setValue('季报(3)');break;
		case 6:Ext.getCmp('uploadCycle').setValue('半年报(6)');break;
		case 12:Ext.getCmp('uploadCycle').setValue('年报(12)');break;
		}
		Ext.getCmp('cycleStart').setValue(obj.value[0].cycleStart);

	},
	listeners : {
		afterRender : function() {
			var me = this;
			Ext.Ajax.request({
						url : "system/dataTable/get.do",
						params : {
							tableName : me.tableName
						},
						success : function(response) {
							var obj = Ext.decode(response.responseText);
							// console.dir(obj.value[0].tableName);
							// console.dir(obj.value[0].tableName);
							me.setValues(obj);

						},
						failure : function(response) {
							Ext.MessageBox.alert("提示", "获取所有表失败！");
						}
					});
		}
	}
})