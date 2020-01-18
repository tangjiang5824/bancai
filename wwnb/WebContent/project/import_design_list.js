Ext.define('project.import_design_list', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : "fit",
	title : '旧板材库数据上传',
	//requires : [ 'component.TableList', "component.YearList" ],
	// reloadPage : function() {
	// 	var p = Ext.getCmp('functionPanel');
	// 	p.removeAll();
	// 	cmp = Ext.create("data.UploadDataTest");
	// 	p.add(cmp);
	// },
	// clearGrid : function() {
	// 	var msgGrid = Ext.getCmp("msgGrid");
	// 	if (msgGrid != null || msgGrid != undefined)
	// 		this.remove(msgGrid);
	// },
	// showDataGrid : function(tableName, uploadId) {
	// 	var me = this;
	// 	var itemsPerPage = 50;
	// 	this.clearGrid();
	// 	Ext.Ajax.request({
	// 		url : "system/dataTable/getColumnsAndFields.do",
	// 		params : {
	// 			tableName : tableName
	// 		},
	// 		success : function(response) {
	// 			var obj = Ext.decode(response.responseText);
	// 			var store = Ext.create('Ext.data.Store', {
	// 				pageSize : itemsPerPage,
	// 				fields : obj.fields,
	// 				proxy : {
	// 					type : 'ajax',
	// 					url : 'dataListByUploadId.do',
	// 					extraParams : {
	// 						tableName : tableName,
	// 						id : uploadId
	// 					},
	// 					reader : {
	// 						type : 'json',
	// 						rootProperty : 'value',
	// 						totalProperty : 'totalCount'
	// 					}
	// 				},
	// 				autoLoad : true
	// 			});
	// 			var grid = Ext.create('Ext.grid.Panel', {
	// 				title : '最新上传数据',
	// 				autoScroll : true,
	// 				viewConfig : {
	// 					enableTextSelection : true
	// 				},
	// 				id : "msgGrid",
	// 				store : store,
	// 				columns : obj.columns,
	// 				dockedItems : [ {
	// 					xtype : 'pagingtoolbar',
	// 					store : store,
	// 					dock : 'bottom',
	// 					displayInfo : true,
	// 					displayMsg : '显示{0}-{1}条，共{2}条',
	// 					emptyMsg : '无数据',
	// 					beforePageText : '第',
	// 					afterPageText : '页，共{0}页'
	// 				} ]
	// 			});
	// 			me.add(grid);
	// 		}
	// 	});
	// },
	initComponent : function() {
		var me = this;
		//定义表名
		var tableName="materialstore";
		var materialtype="0";
		var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
			dock : "top",
			items : [{
						xtype : 'button',
						iconAlign : 'center',
						iconCls : 'rukuicon ',
						text : '添加表项',
						handler : function() {
							//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
							var data = [{										
										'产品编号' : '',
										'产品名称' : '',
										'产品安装位置' : '',
										'是否由旧板生产' : '',
									}];
							//Ext.getCmp('addDataGrid')返回定义的对象
							Ext.getCmp('addDataGrid').getStore().loadData(data,
									true);
						}
					}, {
						xtype : 'button',
						iconAlign : 'center',
						iconCls : 'rukuicon ',
						text : '保存',

						handler : function() {
							// 取出grid的字段名字段类型
							//var userid="<%=session.getAttribute('userid')%>";
							var select = Ext.getCmp('addDataGrid').getStore()
									.getData();
							var s = new Array();
							select.each(function(rec) {
										//delete rec.data.id;
										s.push(JSON.stringify(rec.data));
										//alert(JSON.stringify(rec.data));//获得表格中的数据
									});
							//alert(s);//数组s存放表格中的数据，每条数据以json格式存放

							Ext.Ajax.request({
								url : 'addData.do', //HandleDataController
								method:'POST',
								//submitEmptyText : false,
								params : {
									tableName:tableName,
									materialType:materialtype,
									s : "[" + s + "]",
									//userid: userid + ""
//									tableName : tabName,
//									organizationId : organizationId,
//									tableType : tableType,
//									uploadCycle : uploadCycle,
//									cycleStart : cycleStart

								},
								success : function(response) {
									Ext.MessageBox.alert("提示", "保存成功！");
							     	me.close();
//									var obj = Ext.decode(response.responseText);
//									if (obj) {
//
//										Ext.MessageBox.alert("提示", "保存成功！");
//										me.close();
//
//									} else {
//										// 数据库约束，返回值有问题
//										Ext.MessageBox.alert("提示", "保存失败！");
//
//									}

								},
								failure : function(response) {
									Ext.MessageBox.alert("提示", "保存失败！");
								}
							});

						}
					}]
		});
		var grid = Ext.create("Ext.grid.Panel", {
			id : 'addDataGrid',
			dockedItems : [toolbar2],
			store : {
				id: 'designlistStore',
				fields: ['产品编号', '产品名称','产品安装位置','是否由旧板生产']
//				fields : ['fieldName', 'fieldType', 'taxUnitCode',
//						'taxUnitName', 'isNull', 'fieldCheck', 'width']
			},
			columns : [
				{
					dataIndex : '产品编号',
					name : '产品编号',
					text : '产品编号',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false
					}
				},
				{
					dataIndex : '产品名称',
					name : '产品名称',
					text : '产品名称',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : '产品安装位置',
					text:'产品安装位置',
					name:'产品安装位置',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : '是否由旧板生产',
					text:'是否由旧板生产',
					name:'是否由旧板生产',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
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

		var form = Ext.create("Ext.form.Panel", {
			border : false,
			items : [ {
				xtype : 'filefield',
				width : 400,
				margin: '1 0 0 0',
				buttonText : '上传数据文件',
				name : 'uploadFile',
				//id : 'uploadFile',
				listeners : {
					change : function(file, value, eOpts) {
						if (value.indexOf('.xls',value.length-4)==-1) {
							Ext.Msg.alert('错误', '文件格式错误，请重新选择xls格式的文件！')
						} else {
							Ext.Msg.show({
								title : '操作确认',
								message : '将上传数据，选择“是”否确认？',
								buttons : Ext.Msg.YESNO,
								icon : Ext.Msg.QUESTION,
								fn : function(btn) {
									if (btn === 'yes') {
										//var check=Ext.getCmp("check").getValue();
										var projectId = Ext.getCmp("projectName").getValue();
										var buildingId = Ext.getCmp("buildingName").getValue();

										form.submit({
											//url : 'uploadMaterialExcel.do', //上传excel文件，并回显数据
											//url : 'oldpanel/uploadMatchExcel.do?projectId=' + projectId +'&buildingId=' + buildingId,
											url : 'oldpanel/uploadMatchExcel.do',
											waitMsg : '正在上传...',
											params : {
												projectId:'71',//projectId
												buildingId:'1',//buildingId
											},
											success : function(form, action) {
												//上传成功
												var response = action.result;
												//回显
												console.log('1100000')
												Ext.MessageBox.alert("提示", "上传成功!");
												//重新加载数据
												//MaterialStore.loadData(action.result['value']);

											},
											failure : function(form, action) {
												var response = action.result;
												Ext.MessageBox.alert("错误", "上传失败！！！");

											}
										});
									}
								}
							});
						}
					}
				}
			}

			]
		});



		var exceluploadform = Ext.create("Ext.form.Panel", {
			border : false,
			items : [ {
				xtype : 'filefield',
				width : 400,
				margin: '1 0 0 0',
				buttonText : 'Excel文件上传楼栋信息',
				name : 'uploadFile',
				//id : 'uploadFile',
				listeners : {

					change : function(file, value, eOpts) {
						if (value.indexOf('.xls',value.length-4)==-1) {
							Ext.Msg.alert('错误', '文件格式错误，请重新选择xls格式的文件！')

						} else {
							Ext.Msg.show({
								title : '操作确认',
								message : '将上传数据，选择“是”否确认？',
								buttons : Ext.Msg.YESNO,
								icon : Ext.Msg.QUESTION,
								fn : function(btn) {
									if (btn === 'yes') {
										//var check=Ext.getCmp("check").getValue();
										var projectId = Ext.getCmp("projectName").getValue();
										var buildingId = Ext.getCmp("buildingName").getValue();
										console.log(projectId)

										exceluploadform.submit({
											//excel上传的接口
											//url : 'project/Upload_Design_List_Excel.do？projectId='+projectId+'&buildingId='+buildingId,//上传excel文件，同时传入项目的id和楼栋的id
											url : 'oldpanel/uploadMatchExcel.do?projectId=' + projectId +'&buildingId=' + buildingId,//',//?projectId=\'+projectId+\'&buildingId=\'+buildingId上传excel文件，同时传入项目的id和楼栋的id
											waitMsg : '正在上传...',
											// params : {
											// 	projectId:projectId,
											// 	buildingId:buildingId
											// },
											success : function(exceluploadform, action) {
												var response = action.result;
												Ext.MessageBox.alert("提示", "上传成功!");
//												var toolbar2 = Ext.getCmp("toolbar2");
//												var toolbar3 = Ext.getCmp("toolbar3");
//												toolbar2.setVisible(false);
//												toolbar3.setVisible(false);
//												me.showDataGrid(tableName, response.uploadId);
												//上传成功
												//回显
												console.log(action.result['value']);
												Ext.MessageBox.alert("提示", "上传成功!");
												//重新加载数据
												designlistStore.loadData(action.result['value']);
											},
											failure : function(exceluploadform, action) {
												var response = action.result;
												switch (response.errorCode) {
												case 0:
													Ext.MessageBox.alert("错误", "上传批次或者所属期错误，重新生成上传批次和所属期!");
													break;
												case 1:
													Ext.MessageBox.alert("错误", "上传文件中的批次与生成的上传批次不同，请检查上传文件!");
													me.showMsgGrid([ "name", "input", "expected" ], response.value, [ {
														text : "错误字段",
														dataIndex : "name",
														width : 100
													}, {
														text : "上传文件中的值",
														dataIndex : "input",
														width : 200
													}, {
														text : "期望值",
														dataIndex : "expected",
														width : 100
													} ]);
													break;
												case 2:
													Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
													me.showMsgGrid([ "name", "value" ], response.value, [ {
														text : "错误描述",
														dataIndex : "name",
														width : 250
													}, {
														text : "错误字段",
														dataIndex : "value",
														width : 400
													} ]);
													break;
												case 3:
													Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
													me.showMsgGrid([ "row", "col", "value", "type" ], response.value, [ {
														text : "出错行",
														dataIndex : "row",
														width : 100
													}, {
														text : "出错列",
														dataIndex : "col",
														width : 250
													}, {
														text : "出错值",
														dataIndex : "value",
														width : 250
													}, {
														text : "期望类型",
														dataIndex : "type",
														width : 250
													} ]);
													break;
												case 1000:
													Ext.MessageBox.alert("错误", "上传文件出现未知错误，请检查上传文件格式！<br>若无法解决问题，请联系管理员！");
													Ext.MessageBox.alert("错误原因", response.msg);
													break;
												default:
													Ext.MessageBox.alert("错误", "上传失败");
												}

											}
										});
									}
								}
							});
						}
					}
				}
			} ]
		});



		var tableListStore1 = Ext.create('Ext.data.Store',{
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

		var tableList1 = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '项目名',
			labelWidth : 60,
			width : 300,
			id :  'projectName',
			name : 'projectName',
			matchFieldWidth: false,
			emptyText : "--请选择--",
			displayField: 'projectName',
			valueField: 'id',
			editable : false,
			store: tableListStore1,
			listeners: {
				select:function (combo, record) {
					projectName:Ext.getCmp('projectName').getValue();
					//选中后
					var select = record[0].data;
					var id = select.id;//项目名对应的id
					console.log(id)

					//重新加载行选项
					//表名
					var tableName = 'building';
					//属性名
					var projectId = 'projectId';

					var tableListStore2 = Ext.create('Ext.data.Store',{
						fields : [ 'buildingName'],
						proxy : {
							type : 'ajax',
							//通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
							url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
							//url : 'project/findBuildingList.do?projectId='+id,//根据项目id查询对应的楼栋名
							// params : {
							// 	projectName:Ext.getCmp('projectName').getValue(),
							// 	//buildingName:Ext.getCmp('buildingName').getValue(),
							// },
							reader : {
								type : 'json',
								rootProperty: 'building',
							}
						},
						autoLoad : false
					});
					//buildingName,下拉框重新加载数据
					buildingName.setStore(tableListStore2);

					// Ext.Ajax.request({
					// 	url:'project/getSelectedProjectName.do',
					// 	params:{
					// 		projectName:Ext.getCmp('projectName').getValue()
					// 	},
					// 	success:function (response,config) {
					// 		//alert("combox1把数据传到后台成功");
					// 	},
					// 	failure:function (form, action) {
					// 		//alert("combox1把数据传到后台成功");
					// 	}
					// })
				}
			}

		});


		// var tableListStore2 = Ext.create('Ext.data.Store',{
		// 	fields : [ 'buildingName'],
		// 	proxy : {
		// 		type : 'ajax',
		// 		url : 'project/findBuildingList.do',
		// 		params : {
		// 			projectName:Ext.getCmp('projectName').getValue(),
		// 			//buildingName:Ext.getCmp('buildingName').getValue(),
		// 		},
		// 		reader : {
		// 			type : 'json',
		// 			rootProperty: 'buildingList',
		// 		}
		// 	},
		// 	autoLoad : true
		// });

		var buildingName = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '楼栋名',
			labelWidth : 60,
			width : 300,
			id :  'buildingName',
			name : 'buildingName',
			matchFieldWidth: false,
			emptyText : "--请选择--",
			displayField: 'buildingName',
			valueField: 'id',//楼栋的id
			editable : false,
			//store: tableListStore2,
			listeners: {
				select:function () {

					// // projectName:Ext.getCmp('projectName').getValue();
					// // buildingName:Ext.getCmp('buildingName').getValue();
					// Ext.Ajax.request({
					// 	url:'project/getSelectedBuildingName.do',
					// 	params:{
					// 		//projectName:Ext.getCmp('projectName').getValue(),
					// 		buildingName:Ext.getCmp('buildingName').getValue(),
					// 	},
					// 	success:function (response,config) {
					// 		//alert("combox1把数据传到后台成功");
					// 	},
					// 	failure:function (form, action) {
					// 		//alert("combox1把数据传到后台成功");
					// 	}
					// })

				}
			}
		});



		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar2",
			items : [tableList1,buildingName,form]///////////exceluploadform
		});

		this.dockedItems = [
		// 	{
	    //     xtype: 'toolbar',
	    //     dock: 'top',
	    //     items: [{
	    //         text: '当前时间：'+Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
	    //         layout:'left'
		//      },
		//      ]
		// },
		toolbar2,grid];

		this.callParent(arguments);

	}

})

