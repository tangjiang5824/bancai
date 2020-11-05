Ext.define('project.project_create_backlist', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : "fit",
	title : '项目退料单',
	initComponent : function() {
		var me = this;
		//定义表名
		var tableName="materialstore";
		var materialtype="0";

		var record_start_bottom = 0;
		var record_start_pop = 0;

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
						var data = [{
							'name' : '',
							'count' : '',
							'backWarehouseName':'',
							'warehouseName' : '',
							'inventoryUnit' : '',
							'unitArea':'',
							'unitWeight' : '',
							'totalArea' : '',
							'totalWeight':'',
							'remark':'',
						}];

						Ext.getCmp('backlist_DataGrid').getStore().loadData(data, true);
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
						var sm = Ext.getCmp('backlist_DataGrid').getSelectionModel();
						var productArr = sm.getSelection();
						if (productArr.length != 0) {
							Ext.Msg.confirm("提示", "共选中" + productArr.length + "条数据，是否确认删除？", function (btn) {
								if (btn == 'yes') {
									//先删除后台再删除前台
									//ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
									//Extjs 4.x 删除
									Ext.getCmp('backlist_DataGrid').getStore().remove(productArr);
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

		var backlistStore = Ext.create('Ext.data.Store',{
			id: 'backlistStore',
			autoLoad: true,
			fields: ['productName','position'],
			//pageSize: itemsPerPage, // items per page
			data:[],
			editable:false,
		});
		var grid = Ext.create("Ext.grid.Panel", {
			id : 'backlist_DataGrid',
			store : 'backlistStore',
			title:"退料材料信息",
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
					dataIndex : 'name',
					name : '品名',
					text : '品名',
					width : 200,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					},
					editable:false,
					// flex:0.2
				},
				{
					dataIndex : 'count',
					text:'退料数量',
					name:'退料数量',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'backWarehouseName',
					text:'退料仓库',
					name:'退料仓库',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'warehouseName',
					text:'收料仓库',
					name:'收料仓库',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'inventoryUnit',
					text:'单位',
					name:'单位',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'unitArea',
					text:'单面积',
					name:'单面积',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'unitWeight',
					text:'单重',
					name:'单重',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'totalArea',
					text:'总面积',
					name:'总面积',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'totalWeight',
					text:'总重',
					name:'总重',
					//width : 110,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
				},
				{
					dataIndex : 'remark',
					name : '备注',
					text : '备注',
					width : 200,
					editor : {// 文本字段
						xtype : 'textfield',
						allowBlank : false,
					}
					// flex:0.2
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
			selType : 'rowmodel',
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: backlistStore,   // same store GridPanel is using
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
			fields: [],
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
					dataIndex : '序号',
					text : '序号',
					width : "80",
					flex:1
					// renderer:function(value,metadata,record,rowIndex){
					// 	return　record_start_pop　+　1　+　rowIndex;
					// }
				},
				{
					text: '品名',
					dataIndex: '品名',
					flex :1,
					width:"80"
				},
				{
					text: '退料数量',
					dataIndex: '退料数量',
					flex :1,
					width:"80"
				},
				{
					text: '退料仓库',
					dataIndex: '退料仓库',
					flex :1,
					width:"80"
				},
				{
					text: '收料仓库',
					dataIndex: '收料仓库',
					flex :1,
					width:"80"
				},
				{
					text: '备注',
					dataIndex: '备注',
					flex :1,
					// dataIndex: 'errorCode',
					// renderer: function (value) {
					// 	return designlist.errorcode.type[value].name; // key-value
					// },
				}
				//fields:['oldpanelId','oldpanelName','count'],specification

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
			modal :true,
			items:specific_errorlist_outbound,
		});

		var optionTypeList = Ext.create('Ext.data.Store', {
			fields: ['abbr', 'name'],
			data : [
				{"abbr":"1", "name":"成品退库"},
				{"abbr":"2", "name":"预加工半成品库"},
				{"abbr":"3", "name":"旧版库"},
				{"abbr":"4", "name":"原材料库"}
				//...
			]
		});
		var optionType = Ext.create('Ext.form.ComboBox', {
			fieldLabel: '退料类型',
			name: 'back_optionType',
			id: 'back_optionType',
			store: optionTypeList,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'abbr',
			margin : '0 0 0 40',
			width: 160,
			labelWidth: 60,
			renderTo: Ext.getBody()
		});

		var exceluploadform = Ext.create("Ext.form.Panel", {
			border : false,
			items : [
				// {
				// 	xtype: 'textfield',
				// 	fieldLabel: '退库类型',
				// 	id: 'back_type',
				// 	margin: '0 30 0 0',
				// 	width: 390,
				// 	labelWidth: 60,
				// 	name: 'back_type',
				// 	value: ""
				//
				// },
				{
				xtype : 'filefield',
				width : 450,
				labelWidth:45,
				fieldLabel: '',
				margin: '1 0 0 0',
				buttonText : 'Excel文件上传退料信息',
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
										// var positionId = Ext.getCmp("positionName").getValue();
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
										var type=Ext.getCmp('back_optionType').getValue();

										//上传数据
										exceluploadform.submit({
											//excel上传的接口
											//url : 'project/Upload_Design_List_Excel.do？projectId='+projectId+'&buildingId='+buildingId,//上传excel文件，同时传入项目的id和楼栋的id
											url : 'backStore/uploadExcel.do',//projectId=' + projectId +'&buildingId=' + buildingId+'&positionId=' + positionId,//',//?projectId=\'+projectId+\'&buildingId=\'+buildingId上传excel文件，同时传入项目的id和楼栋的id
											waitMsg : '正在上传...',
											params : {
												type:type,
												projectId:projectId,
												buildingId:buildingId
												// buildingpositionId:positionId,
											},
											success : function(exceluploadform,response, action) {
												Ext.MessageBox.alert("提示", "上传成功!");
												//重新加载数据
												backlistStore.loadData(response.result['value']);
											},
											failure : function(exceluploadform, response) {
												var ob = response.result;
												if(ob.errorCode==100||ob.errorCode==300){
													Ext.MessageBox.alert("错误", ob.msg);
												}else if(ob.errorCode==1000){
													Ext.MessageBox.alert("错误", "上传失败！");
												}else if(ob.errorCode==200){
													Ext.Msg.show({
														title: '提示',
														message: '上传失败，存在不合法材料记录！\n是否查看具体错误数据',
														buttons: Ext.Msg.YESNO,
														icon: Ext.Msg.QUESTION,
														fn: function (btn) {
															if (btn === 'yes') {
																//点击确认，显示重复的数据
																errorlistStore.loadData(ob.value);
																win_errorInfo_outbound.show();
															}
														}
													});

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
			fieldLabel : '项目名称',
			labelWidth : 60,
			width : 570,//'35%'
			// margin:'0 0 0 20',
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

		var buildingName = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '楼栋名',
			labelWidth : 45,
			width : 300,
			id :  'buildingName',
			name : 'buildingName',
			matchFieldWidth: false,
			margin: '0 0 0 40',
			emptyText : "--请选择楼栋名--",
			displayField: 'buildingName',
			valueField: 'id',//楼栋的id
			editable : false,
			autoLoad: true,
			//store: tableListStore2,
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
						// buildingPositionList,
						//退库类型
						optionType,

					]//exceluploadform
		});
		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar2",
			items : [
				{
					xtype:'tbtext',
					text:'<strong>批量上传:</strong>',
					margin: '0 40 0 0',
				},

				exceluploadform,
			]//exceluploadform
		});

		//职员信息
		var workerListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				url : '/material/findAllBytableName.do?tableName=department_worker',
				reader : {
					type : 'json',
					rootProperty: 'department_worker',
				},
			},
			autoLoad : true
		});

		var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar3",
			items : [
				{
					xtype: 'textfield',
					fieldLabel: '退料原因',
					id: 'back_reason',
					margin: '0 30 0 0',
					width: 390,
					labelWidth: 60,
					name: 'back_reason',
					value: ""
				},
				//退库人
				{
					fieldLabel : '退料人',
					xtype : 'combo',
					name : 'back_operator',
					id : 'back_operator',
					// disabled : true,
					// width:'95%',
					margin: '0 40 0 0',
					width: 150,
					labelWidth: 45,
					store : workerListStore,
					displayField : 'workerName',
					valueField : 'id',
					editable : true,
				},
				//退库日期
				// {
				// 	xtype: 'datefield',
				// 	margin : '0 30 0 0',
				// 	fieldLabel: '退库日期',
				// 	id :'backTime',
				// 	width: 200,
				// 	labelWidth: 60,
				// 	name: 'backTime',
				// 	format : 'Y-m-d',
				// 	editable : false,
				// 	// value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
				// 	value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
				// },
				{
					xtype : 'button',
					text: '创建退料单',
					width: 80,
					margin: '0 0 0 0',
					layout: 'right',
					handler: function(){
						var select = Ext.getCmp('backlist_DataGrid').getStore()
							.getData();
						var s = new Array();
						select.each(function(rec) {
							s.push(JSON.stringify(rec.data));
						});

						var projectId = Ext.getCmp("projectName").getValue();
						var buildingId = Ext.getCmp("buildingName").getValue();
						// var positionId = Ext.getCmp("positionName").getValue();
						//其他信息
						var back_reason = Ext.getCmp("back_reason").getValue();
						var back_operator = Ext.getCmp("back_operator").getValue();
						// var backTime = Ext.getCmp("backTime").getValue();
						// var back_type = Ext.getCmp("back_type").getValue();

						//获取数据
						Ext.Ajax.request({
							url : 'backStore/createReturnOrder.do', //创建退库单
							method:'POST',
							//submitEmptyText : false,
							params : {
								s : "[" + s + "]",//存储选择领料的数量
								projectId:projectId,
								buildingId:buildingId,
								// buildingpositionId:positionId,
								description:back_reason,
								operator:back_operator,
								type:Ext.getCmp('back_optionType').getValue()
								//backTime:backTime,
								//type:back_type,
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
									if(errorCode==1000){
										Ext.MessageBox.alert("提示","未知错误！请联系管理员" );
									}else {
										Ext.MessageBox.alert("提示",jsonobj.msg);
									}

								}else{
									Ext.MessageBox.alert("提示","创建退料单成功！" );
									//刷新
									Ext.getCmp('backlist_DataGrid').getStore().remove();

								}
								//var message =Ext.decode(response.responseText).showmessage;
								//刷新页面
							},
							failure : function(response) {
								Ext.MessageBox.hide();
								//var message =Ext.decode(response.responseText).showmessage;
								Ext.MessageBox.alert("提示","创建退料单失败！" );
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
				items : [toolbar_one]
			},
			{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar2]
		},{
			xtype : 'toolbar',
			dock : 'top',
			style:'border-width:0 0 0 0;',
			items : [toolbar1]
		},
		{
			xtype : 'toolbar',
			dock : 'top',
			style:'border-width:0 0 0 0;',
			items : [toolbar3]
		},
		];

		this.items = [grid]

		this.callParent(arguments);

	}

})

