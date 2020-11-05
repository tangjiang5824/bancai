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

		var record_start_bottom = 0;
		var record_start_pop = 0;

		Ext.Ajax.timeout=9000000;//设置超时时间

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
// 							//Ext.getCmp('addlistDataGrid')返回定义的对象
// 							Ext.getCmp('addlistDataGrid').getStore().loadData(data,
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
// 							var select = Ext.getCmp('addlistDataGrid').getStore()
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
		//单条录入和添加记录按钮
		var toolbar_one = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			items: [
				{
					xtype:'tbtext',
					text:'<strong>单条录入:</strong>',
					margin: '0 40 0 0',
				},
				{   xtype : 'button',
					margin: '0 40 0 0',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '添加记录',
					handler: function(){
						// var productName = Ext.getCmp('productName').getValue();
						// var count = Ext.getCmp('count').getValue();
						// var warehouseName = Ext.getCmp('storePosition').rawValue;
						var data = [{
							'品名' : '',
							'位置编号' : '',
							'图号':'',
						}];

						Ext.getCmp('addlistDataGrid').getStore().loadData(data, true);
					}
				},
				//删除行数据
				{
					xtype : 'button',
					margin: '0 0 0 0',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '删除',
					handler: function(){
						var sm = Ext.getCmp('addlistDataGrid').getSelectionModel();
						var productArr = sm.getSelection();
						if (productArr.length != 0) {
							Ext.Msg.confirm("提示", "共选中" + productArr.length + "条数据，是否确认删除？", function (btn) {
								if (btn == 'yes') {
									//先删除后台再删除前台
									//ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
									//Extjs 4.x 删除
									Ext.getCmp('addlistDataGrid').getStore().remove(productArr);
								} else {
									return;
								}
							});
						} else {
							//Ext.Msg.confirm("提示", "无选中数据");
							Ext.Msg.alert("提示", "无选中数据");
						}
					}
				}

			]
		});
		//错误类型：枚举类型
		Ext.define('designlist.errorcode.type', {
			statics: { // 关键
				100: { value: '100', name: '位置重复' },
				200: { value: '200', name: '品名不合法' },
				null: { value: 'null', name: '无' },
			}
		});

		var designlistStore = Ext.create('Ext.data.Store',{
			id: 'designlistStore',
			autoLoad: true,
			fields: ['productName','position'],
			//pageSize: itemsPerPage, // items per page
			data:[],
			editable:false,
		});
		var grid = Ext.create("Ext.grid.Panel", {
			id : 'addlistDataGrid',
			store : designlistStore,
			title:"清单明细",
			columns : [
				{
					// dataIndex : '序号',
					name : '序号',
					text : '序号',
					width : 60,
					value:'99',
					renderer:function(value,metadata,record,rowIndex){
						return　record_start_bottom　+　1　+　rowIndex;
					}
				},
				{
					dataIndex : '品名',
					name : '产品名称',
					text : '产品名称',
					width : 200,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					},
					editable:true,
					// flex:0.2
				},

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
					dataIndex : '位置编号',
					name : '位置编号',
					text : '位置编号',
					width : 200,
					// flex:0.2
					editor : {
						xtype : 'textfield',
						allowBlank : false,
					},
				},
				{
					dataIndex : '图号',
					text:'图号',
					name:'图号',
					editor : {
						xtype : 'textfield',
						allowBlank : false,
					},
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
			plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			})],
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: designlistStore,   // same store GridPanel is using
				dock: 'bottom',
				displayInfo: true,
				displayMsg:'显示{0}-{1}条，共{2}条',
				emptyMsg:'无数据'
			}],
		});

		//错误提示，弹出框
		var errorlistStore = Ext.create('Ext.data.Store',{
			id: 'errorlistStore',
			autoLoad: true,
			fields: ['productName','position'],
			//pageSize: itemsPerPage, // items per page
			data:[],
			editable:false,
		});

		//弹出框，出入库详细记录
		var specific_errorlist_outbound=Ext.create('Ext.grid.Panel',{
			id : 'specific_errorlist_outbound',
			// tbar: toolbar_pop,
			store:errorlistStore,//oldpanellogdetailList，store1的数据固定
			dock: 'bottom',
			columns:[
				{
					// dataIndex : '序号',
					name : '序号',
					text : '序号',
					width : 60,
					value:'99',
					renderer:function(value,metadata,record,rowIndex){
						return　record_start_pop　+　1　+　rowIndex;
					}
				},
				{
					text: '品名',
					dataIndex: 'productName',
					// dataIndex: '品名',
					flex :1,
					width:"80"
				},
				{
					text: '位置',
					dataIndex: 'position',
					// dataIndex: '位置',
					flex :1,
					width:"80"
				},
				{
					text: '图号',
					dataIndex: 'figureNum',
					// dataIndex: '图号',
					flex :1,
					width:"80"
				},
				{
					text: '错误原因',
					flex :1,
					dataIndex: 'errorType',
					// dataIndex: 'errorCode',
					// renderer: function (value) {
					// 	return designlist.errorcode.type[value].name; // key-value
					// },
				}


			],
			flex:1,
			//selType:'checkboxmodel',
			plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 2
			})],
		});

		var win_errorInfo_outbound = Ext.create('Ext.window.Window', {
			// id:'win_errorInfo_outbound',
			title: '错误详情',
			height: 500,
			width: 750,
			layout: 'fit',
			closable : true,
			draggable:true,
			closeAction : 'hidden',
			// tbar:toolbar_pop1,
			items:specific_errorlist_outbound,
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
										var positionId = Ext.getCmp("positionName").getValue();
										console.log("projectId=============",projectId)

										//显示上传进度
										Ext.MessageBox.show(
											{
												title:'请稍候',
												msg:'上传数据中......',
												progressText:'',    //进度条文本
												width:300,
												progress:true,
												closable:false
											}
										);
										//控制进度条速度
										var f=function(v){
											return function(){
												if(v==12)
												{
													Ext.MessageBox.hide();
												}
												else
												{
													var i=v/11;
													Ext.MessageBox.updateProgress(i,Math.round(100*i)+"% 完成");
												}
											}
										}
										for(var i=1;i<13;i++)
										{
											setTimeout(f(i),i*500);//从点击时就开始计时，所以500*i表示每500ms就执行一次
										}

										//上传数据
										exceluploadform.submit({
											//excel上传的接口
											//url : 'project/Upload_Design_List_Excel.do？projectId='+projectId+'&buildingId='+buildingId,//上传excel文件，同时传入项目的id和楼栋的id
											url : 'designlist/uploadExcel.do?',//projectId=' + projectId +'&buildingId=' + buildingId+'&positionId=' + positionId,//',//?projectId=\'+projectId+\'&buildingId=\'+buildingId上传excel文件，同时传入项目的id和楼栋的id
											waitMsg : '正在上传...',
											params : {
												projectId:projectId,
												buildingId:buildingId,
												buildingpositionId:positionId,
											},
											success : function(exceluploadform,response, action) {
												var response1 = action;
												console.log("response=========================>",response)
												Ext.MessageBox.alert("提示", "上传成功!");
												//上传成功
												//回显
												console.log(response.result['value']);
												console.log("response1=========================>")
												Ext.MessageBox.alert("提示", "上传成功!");
												//重新加载数据
												designlistStore.loadData(response.result['value']);
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
			queryMode: 'local',
			id :  'projectName',
			name : 'projectName',
			matchFieldWidth: true,
			emptyText : "--请选择项目名--",
			displayField: 'projectName',
			valueField: 'id',
			editable : true,
			store: tableListStore1,
			typeAhead: true,
			triggerAction: 'all',
			selectOnFocus:true,
			listeners: {
				change : function(combo, record, eOpts) {
					if(this.callback) {
						if(combo.lastSelection && combo.lastSelection.length>0) {
							this.callback(combo.lastSelection[0]);
						}
					}
				},
				//下拉框搜索
				beforequery :function(e){
					var combo = e.combo;
					combo.collapse();//收起
					var value = combo.getValue();
					if (!e.forceAll) {//如果不是通过选择，而是文本框录入
						combo.store.clearFilter();
						combo.store.filterBy(function(record, id) {
							var text = record.get(combo.displayField);
							// 用自己的过滤规则,如写正则式
							return (text.indexOf(value) != -1);
						});
						combo.onLoad();//不加第一次会显示不出来
						combo.expand();
						return false;
					}
					if(!value) {
						//如果文本框没值，清除过滤器
						combo.store.clearFilter();
					}
				},

				//下拉框默认返回的第一个值
				render : function(combo) {//渲染
					combo.getStore().on("load", function(s, r, o) {
						combo.setValue(r[0].get('projectName'));//第一个值
					});
				},

				select:function (combo, record) {
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

		var buildingPositionStore = Ext.create('Ext.data.Store',{
			fields : [ 'buildingPosition'],
			proxy : {
				type : 'ajax',
				url : 'material/findAllBytableName.do?tableName=building_position',

				reader : {
					type : 'json',
					rootProperty: 'building_position',
				}
			},
			autoLoad : true
		});


		var buildingPositionList = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '位置',
			labelWidth : 60,
			width : 200,
			margin: '0 10 0 40',
			id :  'positionName',
			name : 'positionName',
			matchFieldWidth: true,
			// emptyText : "--请选择项目--",
			displayField: 'positionName',
			valueField: 'id',
			// typeAhead : true,
			editable : true,
			store: buildingPositionStore,
			// listeners: {
			//
			//     //下拉框默认返回的第一个值
			//     render: function (combo) {//渲染
			//         combo.getStore().on("load", function (s, r, o) {
			//             combo.setValue(r[0].get('projectName'));//第一个值
			//         });
			//     }
			// }

		});

		var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar1",
			items : [   tableList1,
						buildingName,
						buildingPositionList,

					]//exceluploadform
		});

		//防止按钮重复点击，发送多次请求，post_flag
		var post_flag = false;

		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar2",
			items : [
				// {
				// 	xtype: 'tbtext',
				// 	//id: 'uploadFile',
				// 	margin: '0 0 0 40',
				// 	text:'选择文件:',
				// },
				{
					xtype:'tbtext',
					text:'<strong>批量上传:</strong>',
					margin: '0 40 0 0',
				},
				exceluploadform,
				{
					xtype : 'button',
					text: '确认匹配',
					width: 100,
					margin: '0 0 0 40',
					layout: 'right',
					handler: function(){
						if(post_flag){
							return;
						}
						post_flag = true;

						// self.saveOrderBtnCanUse = true;//按钮不能点击
						// setTimeout(() => {
						// 	//防止重复点击发送请求
						// 	self.saveOrderBtnCanUse = false;//按钮不可以点击
						// }, 90000);
						// // 正常代码再执行

						var select = Ext.getCmp('addlistDataGrid').getStore()
							.getData();
						var s = new Array();
						select.each(function(rec) {
							s.push(JSON.stringify(rec.data));
						});

						var projectId = Ext.getCmp("projectName").getValue();
						var buildingId = Ext.getCmp("buildingName").getValue();
						var positionId = Ext.getCmp("positionName").getValue();


						//显示匹配进度
						// Ext.MessageBox.show(
						// 	{
						// 		title:'请稍候',
						// 		msg:'产品匹配中，请耐心等待...',
						// 		progressText:'',    //进度条文本
						// 		width:300,
						// 		progress:true,
						// 		closable:false
						// 	}
						// );

						console.log("s--------------",s)
						//获取数据
						// Ext.Ajax.timeout=900000;//设置超时时间
						Ext.Ajax.request({
							url : 'designlist/uploadData.do', //上传匹配数据
							method:'POST',
							//submitEmptyText : false,
							timeout:90000000,//超时时间
							params : {
								s : "[" + s + "]",//存储选择领料的数量
								projectId:projectId,
								buildingId:buildingId,
								buildingpositionId:positionId,
							},
							success : function(response) {
								var res = response.responseText;
								var jsonobj = JSON.parse(res);//将json字符串转换为对象
								console.log(jsonobj);
								console.log("success--------------",jsonobj.success);
								console.log("errorList--------------",jsonobj['errorList']);
								var success = jsonobj.success;
								var errorList = jsonobj.errorList;
								var errorCode = jsonobj.errorCode;
								var errorCount = jsonobj.errorCount;
								if(success == false){
									if(errorCode == 150){
										//位置重复或品名不合法

										//关闭进度条
										Ext.MessageBox.hide();
										// Ext.MessageBox.alert("提示","匹配失败，产品位置重复或品名不合法！请重新导入" );
										Ext.Msg.show({
											title: '提示',
											message: '匹配失败，产品位置重复或品名不合法！\n是否查看具体错误数据',
											buttons: Ext.Msg.YESNO,
											icon: Ext.Msg.QUESTION,
											fn: function (btn) {
												if (btn === 'yes') {
													//点击确认，显示重复的数据
													errorlistStore.loadData(errorList);
													win_errorInfo_outbound.show();

													post_flag =false;
												}
											}
										});
									}
									else if(errorCode == 300){
										Ext.MessageBox.hide();
										Ext.MessageBox.alert("提示","产品匹配失败！请重新导入" );

										post_flag =false;
									}
									else if(errorCode == 1000){
										Ext.MessageBox.hide();
										Ext.MessageBox.alert("提示","匹配失败，未知错误！请重新导入" );

										post_flag =false;
									}
								}else{
									Ext.MessageBox.hide();
									Ext.MessageBox.alert("提示","匹配成功" );
									//刷新页面
									Ext.getCmp('addlistDataGrid').getStore().removeAll();

									post_flag =false;
								}
								//var message =Ext.decode(response.responseText).showmessage;

							},
							failure : function(response) {

								post_flag =false;//防止发送多次请求
								// Ext.MessageBox.hide();
								//var message =Ext.decode(response.responseText).showmessage;
								Ext.MessageBox.alert("提示","匹配失败" );
							}
						});
				}
				}
			]//exceluploadform
		});

		//多行toolbar
		this.dockedItems=[

			{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar1]
		},
			{
				xtype : 'toolbar',
				dock : 'top',
				items : [toolbar_one]
			},
			{
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

