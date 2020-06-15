Ext.define('project.import_design_list', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : "fit",
	title : '导入设计清单',
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
						text : '添加产品',
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
												Ext.MessageBox.alert("错误", "上传失败!");
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
			items : [tableList1,buildingName,{
				xtype: 'tbtext',
				//id: 'uploadFile',
				text:'选择文件:',
			},
				exceluploadform]//exceluploadform
		});

		this.dockedItems = [toolbar2,grid];

		this.callParent(arguments);

	}

})

