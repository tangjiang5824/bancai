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
// 		var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
// 			dock : "top",
// 			items : [{
// 						xtype : 'button',
// 						iconAlign : 'center',
// 						iconCls : 'rukuicon ',
// 						text : '添加产品',
// 						handler : function() {
// 							//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
// 							var data = [{
// 										'产品编号' : '',
// 										'productName' : '',
// 										'产品安装位置' : '',
// 										'是否由旧板生产' : '',
// 									}];
// 							//Ext.getCmp('addDataGrid')返回定义的对象
// 							Ext.getCmp('addDataGrid').getStore().loadData(data,
// 									true);
// 						}
// 					}, {
// 						xtype : 'button',
// 						iconAlign : 'center',
// 						iconCls : 'rukuicon ',
// 						text : '保存',
//
// 						handler : function() {
// 							// 取出grid的字段名字段类型
// 							//var userid="<%=session.getAttribute('userid')%>";
// 							var select = Ext.getCmp('addDataGrid').getStore()
// 									.getData();
// 							var s = new Array();
// 							select.each(function(rec) {
// 										//delete rec.data.id;
// 										s.push(JSON.stringify(rec.data));
// 										//alert(JSON.stringify(rec.data));//获得表格中的数据
// 									});
// 							//alert(s);//数组s存放表格中的数据，每条数据以json格式存放
//
// 							Ext.Ajax.request({
// 								url : 'addData.do', //HandleDataController
// 								method:'POST',
// 								//submitEmptyText : false,
// 								params : {
// 									tableName:tableName,
// 									materialType:materialtype,
// 									s : "[" + s + "]",
// 									//userid: userid + ""
// //									tableName : tabName,
// //									organizationId : organizationId,
// //									tableType : tableType,
// //									uploadCycle : uploadCycle,
// //									cycleStart : cycleStart
//
// 								},
// 								success : function(response) {
// 									Ext.MessageBox.alert("提示", "保存成功！");
// 							     	me.close();
// //									var obj = Ext.decode(response.responseText);
// //									if (obj) {
// //
// //										Ext.MessageBox.alert("提示", "保存成功！");
// //										me.close();
// //
// //									} else {
// //										// 数据库约束，返回值有问题
// //										Ext.MessageBox.alert("提示", "保存失败！");
// //
// //									}
//
// 								},
// 								failure : function(response) {
// 									Ext.MessageBox.alert("提示", "保存失败！");
// 								}
// 							});
//
// 						}
// 					}]
// 		});
		var designlistStore = Ext.create('Ext.data.Store',{
			id: 'designlistStore',
			autoLoad: true,
			fields: [],
			//pageSize: itemsPerPage, // items per page
			data:[],
			editable:false,
		});
		var grid = Ext.create("Ext.grid.Panel", {
			id : 'addDataGrid',
			store : 'designlistStore',
			title:"清单明细",
			columns : [
				// {
				// 	dataIndex : '产品编号',
				// 	name : '产品编号',
				// 	text : '产品编号',
				// 	//width : 110,
				// 	editor : {// 文本字段
				// 		xtype : 'textfield',
				// 		allowBlank : false
				// 	}
				// },
				{
					dataIndex : 'productName',
					name : '产品名称',
					text : '产品名称',
					width : 200,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					},
					editable:false,
					// flex:0.2
				},
				// {
				// 	dataIndex : '产品安装位置',
				// 	text:'产品安装位置',
				// 	name:'产品安装位置',
				// 	//width : 110,
				// 	editor : {// 文本字段
				// 		xtype : 'textfield',
				// 		allowBlank : false,
				// 	}
				// },
				// {
				// 	dataIndex : '是否由旧板生产',
				// 	text:'是否由旧板生产',
				// 	name:'是否由旧板生产',
				// 	//width : 110,
				// 	editor : {// 文本字段
				// 		xtype : 'textfield',
				// 		allowBlank : false,
				// 	}
				// },
				{
					dataIndex : 'listName',
					name : '清单名称',
					text : '清单名称(位置)',
					width : 200,
					// flex:0.2
				},
				{
					dataIndex : 'count',
					name : '生产数量',
					text : '生产数量',
					width : 200,
					// flex:0.2
				},
			],
			viewConfig : {
				plugins : {
					ptype : "gridviewdragdrop",
					dragText : "可用鼠标拖拽进行上下排序"
				}
			},
			// plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
			// 			clicksToEdit : 3
			// 		})],
			selType : 'rowmodel',
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: designlistStore,   // same store GridPanel is using
				dock: 'bottom',
				displayInfo: true,
				displayMsg:'显示{0}-{1}条，共{2}条',
				emptyMsg:'无数据'
			}],


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

		//楼栋store


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
			labelWidth : 45,
			width : 550,//'35%'
			id :  'projectName',
			name : 'projectName',
			matchFieldWidth: true,
			emptyText : "--请选择项目名--",
			displayField: 'projectName',
			valueField: 'id',
			editable : false,
			store: tableListStore1,
			listeners: {

				//下拉框默认返回的第一个值
				render : function(combo) {//渲染
					combo.getStore().on("load", function(s, r, o) {
						combo.setValue(r[0].get('projectName'));//第一个值
					});

				},

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
							// params : {
							// 	tableName:tableName,
							// 	columnName:projectId,
							// 	columnValue:id,
							// },
							reader : {
								type : 'json',
								rootProperty: 'building',
							}
						},
						autoLoad : true,
						listeners:{
							load:function () {
								Ext.getCmp('buildingName').setValue("");
							}
						}
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
			labelWidth : 45,
			width : 300,
			id :  'buildingName',
			name : 'buildingName',
			matchFieldWidth: false,
			margin: '0 10 0 40',
			emptyText : "--请选择楼栋名--",
			displayField: 'buildingName',
			valueField: 'id',//楼栋的id
			editable : false,
			autoLoad: true,
			//store: tableListStore2,
			listeners: {
				load:function () {

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



		var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar1",
			items : [   tableList1,
						buildingName,

					]//exceluploadform
		});
		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar2",
			items : [
				{
					xtype: 'textfield',
					// margin: '0 10 0 0',
					fieldLabel: ' 位置分类',
					id: 'listName',
					width: 230,
					labelWidth: 60,
					name: 'listName',
					value: "",
				},{
					xtype: 'tbtext',
					//id: 'uploadFile',
					margin: '0 0 0 40',
					text:'选择文件:',
				},
				exceluploadform
			]//exceluploadform
		});

		// this.dockedItems = [toolbar2,grid];
		//多行toolbar
		this.dockedItems=[{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar1]
		},{
			xtype : 'toolbar',
			dock : 'top',
			style:'border-width:0 0 0 0;',
			items : [toolbar2]
		},
		];

		this.items = [grid]

		this.callParent(arguments);

	}

})

