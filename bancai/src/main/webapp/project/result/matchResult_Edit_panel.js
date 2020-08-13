Ext.define('project.result.matchResult_Edit_panel', {
	extend : 'Ext.panel.Panel',
	// title : '修改产品匹配结果',
	modal : true,
//  layout : 'form',
// width : 380,
//	closeAction : 'close',
	height: 500,
	width: 650,
	// closable : true,
	bodyStyle : 'padding:5 5 5 5',
	initComponent : function() {
		var me = this;
		var itemsPerPage = 30;
		var tableName = 'query_match_result';
		var columnName = 'designlistId';
		var columnValue = me.designlistId;

		var designlistId = me.designlistId;//父页面传过来的参数

		var productName_show = me.productName_show;
		var	positionName_show = me.positionName_show;
		var	projectName_show = me.projectName_show;
		var	buildingName_show = me.buildingName_show;


		//原件类型：枚举类型
		Ext.define('material.model.typeName', {
			statics: { // 关键s
				1: { value: '1', name: '退库成品' },
				2: { value: '2', name: '预加工半产品' },
				3: { value: '3', name: '旧板' },
				4: { value: '4', name: '原材料' },
			}
		});

		var projectMatch_List = Ext.create('Ext.data.Store',{
			//id,materialName,length,width,materialType,number
			fields:['buildingNo','buildingName','buildingLeader'],
			proxy : {
				type : 'ajax',
				url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+columnName+'&columnValue='+columnValue,//获取同类型的原材料  +'&pickNum='+pickNum
				reader : {
					type : 'json',
					rootProperty: 'query_match_result',
				},
				// params:{
				//     materialName:materialName,
				//     // start: 0,
				//     // limit: itemsPerPage
				// }
			},
			autoLoad : true
		});

		//将projectId传给弹出框
		// Ext.getCmp("toolbar_pop").items.items[0].setText(projectId);
		// oneProject_match_grid.setStore(projectMatch_List);

		//部门信息
		var departmentListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				url : '/material/findAllBytableName.do?tableName=department_info',
				reader : {
					type : 'json',
					rootProperty: 'department_info',
				},
			},
			autoLoad : true
		});

		//退库成品
		var backListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				// url : '/material/findAllBytableName.do?tableName=backproduct_info_store_type',
				url:'store/findAllStoreInfo.do?typeName=backproduct',
				reader : {
					type : 'json',
					rootProperty: 'infoList',//rootProperty: 'backproduct_info_store_type',
				},
			},
			autoLoad : true
		});
		//预加工半成品
		var preprocessListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				// url : '/material/findAllBytableName.do?tableName=preprocess_info_store_type',
				url:'store/findAllStoreInfo.do?typeName=preprocess',
				reader : {
					type : 'json',
					rootProperty: 'infoList',//preprocess_info_store_type
				},
			},
			autoLoad : true
		});
		//旧板成品
		var oldListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				// url : '/material/findAllBytableName.do?tableName=oldpanel_info_store_type',
				url:'store/findAllStoreInfo.do?typeName=oldpanel',
				reader : {
					type : 'json',
					rootProperty: 'infoList',//rootProperty: 'oldpanel_info_store_type',
				},
			},
			autoLoad : true
		});
		//原材料
		var materialListStore = Ext.create('Ext.data.Store',{
			fields : [ 'typeName'],
			proxy : {
				type : 'ajax',
				// url : '/material/findAllBytableName.do?tableName=material_store_view',
				url:'store/findAllStoreInfo.do?typeName=material',
				reader : {
					type : 'json',
					rootProperty: 'infoList',//rootProperty: 'material_store_view',
				},
			},
			autoLoad : true
		});

		// var form = Ext.create('Ext.form.Panel', {
		// 	items : [ {
		// 		xtype : 'textfield',
		// 		id : 'workerName_p',
		// 		name : 'workerName_p',
		// 		fieldLabel : '职员名称',
		// 		disabled : true,
		// 		width:'95%',
		// 		editable : false
		// 	}, {
		// 		xtype : 'textfield',
		// 		name : 'tel_p',
		// 		id : 'tel_p',
		// 		width:'95%',
		// 		fieldLabel : '电话'
		// 	},
		// 		// departmentList,
		// 		{
		// 			fieldLabel : '部门名称',
		// 			xtype : 'combo',
		// 			name : 'departmentId',
		// 			id : 'departmentId',
		// 			// disabled : true,
		// 			width:'95%',
		// 			store : departmentListStore,
		// 			displayField : 'departmentName',
		// 			valueField : 'id',
		// 			editable : true,
		// 		}
		//
		// 	],
		// 	buttons : [ {
		// 		text : '更新',
		// 		handler : function() {
		// 			// console.log(me.roleId);
		// 			if (form.isValid()) {
		// 				var workerName = Ext.getCmp("workerName_p").getValue();
		// 				var tel = Ext.getCmp("tel_p").getValue();
		//
		// 				// console.log("--------------------Id:",Ext.getCmp("departmentId").value)
		// 				var departmentId = Ext.getCmp("departmentId").getValue();
		// 				form.submit({
		// 					url : 'department/addOrUpdateWorkerInfo.do',
		// 					waitMsg : '正在更新...',
		// 					params : {
		// 						id:me.userId,//新增id为字符串
		// 						// s : "[" + s + "]",
		// 						workerName:workerName,
		// 						tel:tel,
		// 						departmentId:departmentId
		// 					},
		// 					success : function(form, action) {
		// 						Ext.Msg.alert('消息', '更新成功！');
		// 						me.close();
		// 						Ext.getCmp('addWorkerGrid').store.load({
		// 							params : {
		// 								start : 0,
		// 								limit : itemsPerPage
		// 							}
		// 						});
		// 					},
		// 					failure : function(form, action) {
		// 						Ext.Msg.alert('消息', '更新失败！');
		// 					}
		// 				});
		// 			}
		// 		}
		// 	} ]
		// });

		//板材类型选择
		var storeTypeListStore = Ext.create('Ext.data.Store', {
			fields: ['abbr', 'name'],
			data : [
				{ "abbr": '0', "name": '退库成品' },
				{ "abbr": '1', "name": '预加工半成品' },
				{ "abbr": '2', "name": '旧板' },
				{ "abbr": '3', "name": '原材料' },
			]
		});

		// var storeTypeList = Ext.create('Ext.form.ComboBox', {
		// 	fieldLabel: '分组条件',
		// 	name: 'storeTypeList',
		// 	id: 'storeTypeList',
		// 	store: storeTypeListStore,
		// 	queryMode: 'local',
		// 	displayField: 'name',
		// 	valueField: 'abbr',
		// 	margin : '0 40 0 0',
		// 	width: 160,
		// 	labelWidth: 60,
		// 	renderTo: Ext.getBody(),
		// 	//决定分组依据
		// 	listeners:{
		// 		select:function (combo, record) {
		// 			//选中后
		// 			var select = record[0].data;
		//
		// 			console.log("------------00",select.name)
		// 			var typeId = select.abbr;
		// 			var typeName = select.name;
		// 			var store_tableName;
		// 			if (typeId == 0){
		// 				store_tableName = 'backproduct_store';
		// 			}else if(typeId == 1){
		// 				store_tableName = 'preprocess_store';
		// 			}else if(typeId == 2){
		// 				store_tableName = 'oldpanel_store';
		// 			}else if(typeId == 3){
		// 				store_tableName = 'material_store';
		// 			}
		// 			var tableListStore2 = Ext.create('Ext.data.Store',{
		// 				fields : [ 'buildingName'],
		// 				proxy : {
		// 					type : 'ajax',
		// 					//通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
		// 					url : '/material/findAllBytableName.do?tableName='+store_tableName,//根据项目id查询对应的楼栋名
		// 					reader : {
		// 						type : 'json',
		// 						rootProperty: store_tableName,
		// 					}
		// 				},
		// 				autoLoad : true,
		// 				listeners:{
		// 					load:function () {
		// 						Ext.getCmp('storeInfo').setValue("");
		// 					}
		// 				}
		// 			});
		// 			//buildingName,下拉框重新加载数据
		// 			storeInfo.setStore(tableListStore2);
		// 		}
		// 	}
		//
		// });

		// var storeInfo = Ext.create('Ext.form.ComboBox', {
		// 	fieldLabel: '材料名',
		// 	labelWidth: 45,
		// 	width: 300,
		// 	id: 'storeInfo',
		// 	name: 'storeInfo',
		// 	matchFieldWidth: false,
		// 	margin: '0 10 0 40',
		// 	emptyText: "--请选择楼栋名--",
		// 	displayField: 'buildingName',
		// 	valueField: 'id',//楼栋的id
		// 	editable: false,
		// 	autoLoad: true,
		// });


		//弹出框的表头
		var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar_pop',
			baseCls : 'my-panel-no-border',  //去掉边框
			items: [
				{
					xtype:'tbtext',
					text:'<strong>新增匹配材料:</strong>',
					// margin: '0 40 0 0',
					// width: 80,

				},
				// {
				// 	xtype : 'button',
				// 	iconAlign : 'center',
				// 	iconCls : 'rukuicon ',
				// 	text : '添加匹配材料',
				// 	handler : function() {
				// 		//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
				// 		var data = [{
				//
				// 			'材料名' : Ext.getCmp("back_store").getValue(),
				// 			'数量' : Ext.getCmp("back_count").getValue(),
				//
				// 		}];
				// 		//Ext.getCmp('addDataGrid')返回定义的对象
				// 		Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
				// 			true);
				//
				// 	}
				//
				// },
			]
		});
		var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar1',
			items: [
				{
					xtype:'tbtext',
					text:'退库成品:',
					margin: '0 40 0 0',
					width: 100,
				},
				{
					fieldLabel : '材料名',
					xtype : 'combo',
					name : 'back_store',
					id : 'back_store',
					// disabled : true,
					width:350,
					labelWidth : 45,
					store : backListStore,
					margin : '0 40 0 0',
					displayField : 'productName',
					valueField : 'id',
					editable : true,
					listeners: {
						select:function (combo, record) {
							//选中后
							var select = record[0].data;
							var id = select.id;//项目名对应的id
							console.log('select===================....',select);
							var count_Use = select.countUse;
							var storeId_back = select.storeId;
							Ext.getCmp('countUse_back').setValue(count_Use);
							Ext.getCmp('storeId_back').setValue(storeId_back);

						}
					}
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '现可用数量',
					id :'countUse_back',
					width: 180,
					labelWidth: 80,
					name: 'countUse_back',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '',
					id :'storeId_back',
					width: 180,
					labelWidth: 80,
					name: 'storeId_back',
					value:"",
					hidden:true,
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '数量',
					id :'back_count',
					width: 120,
					labelWidth: 35,
					name: 'back_count',
					value:"",
				},
				{
					xtype : 'button',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '添加',
					handler : function() {
						//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
						console.log("ssss---",Ext.getCmp("back_store").rawValue)
						var data = [{
							'name' : Ext.getCmp("back_store").rawValue,
							'count' : Ext.getCmp("back_count").getValue(),
							'type':'1',//材料类型
							'typeName':'backproduct',
							'id':'-1', //新增的matchresultId
							'storeId':Ext.getCmp("storeId_back").getValue(),
						}];
						//Ext.getCmp('addDataGrid')返回定义的对象
						Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
							true);
						//清除框里的数据
						Ext.getCmp('back_store').setValue('');
						Ext.getCmp('back_count').setValue('');

					}
				},
			]
		});

		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar2',
			items: [
				{
					xtype:'tbtext',
					text:'预加工半成品:',
					margin: '0 40 0 0',
					width: 100,
				},
				{
					fieldLabel : '材料名',
					xtype : 'combo',
					name : 'pre_store',
					id : 'pre_store',
					// disabled : true,
					width:350,
					labelWidth : 45,
					store : preprocessListStore,
					margin : '0 40 0 0',
					displayField : 'productName',
					valueField : 'id',
					editable : true,
					listeners: {
						select:function (combo, record) {
							//选中后
							var select = record[0].data;
							var id = select.id;//项目名对应的id
							console.log('select===================....',select);
							var count_Use = select.countUse;
							var storeId_pre = select.storeId;
							Ext.getCmp('storeId_pre').setValue(storeId_pre);
							Ext.getCmp('countUse_pre').setValue(count_Use);
						}
					}
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '现可用数量',
					id :'countUse_pre',
					width: 180,
					labelWidth: 80,
					name: 'countUse_pre',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '',
					id :'storeId_pre',
					width: 180,
					labelWidth: 80,
					name: 'storeId_pre',
					value:"",
					hidden:true,
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '数量',
					id :'pre_count',
					width: 120,
					labelWidth: 35,
					name: 'pre_count',
					value:"",
				},{
					xtype : 'button',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '添加',
					handler : function() {
						//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
						var data = [{
							'name' : Ext.getCmp("pre_store").rawValue,
							'count' : Ext.getCmp("pre_count").getValue(),
							'type':'2',
							'typeName':'preprocess',
							'id':'-1', //新增的matchresultId
							'storeId':Ext.getCmp("storeId_pre").getValue(),
						}];
						//Ext.getCmp('addDataGrid')返回定义的对象
						Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
							true);
						Ext.getCmp('pre_store').setValue('');
						Ext.getCmp('pre_count').setValue('');
					}
				},
			]
		});
		var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar3',
			items: [
				{
					xtype:'tbtext',
					text:'旧板:',
					margin: '0 40 0 0',
					width: 100,
				},
				{
					fieldLabel : '材料名',
					xtype : 'combo',
					name : 'old_store',
					id : 'old_store',
					// disabled : true,
					width:350,
					labelWidth : 45,
					store : oldListStore,
					margin : '0 40 0 0',
					displayField : 'oldpanelName',
					valueField : 'id',
					editable : true,
					listeners: {
						select:function (combo, record) {
							//选中后
							var select = record[0].data;
							var id = select.id;//项目名对应的id
							console.log('select===================....',select);
							var count_Use = select.countUse;
							var storeId_old = select.storeId;
							Ext.getCmp('storeId_old').setValue(storeId_old);
							Ext.getCmp('countUse_old').setValue(count_Use);
						}
					}
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '现可用数量',
					id :'countUse_old',
					width: 180,
					labelWidth: 80,
					name: 'countUse_old',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '',
					id :'storeId_old',
					width: 180,
					labelWidth: 80,
					name: 'storeId_old',
					value:"",
					hidden:true,
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '数量',
					id :'old_count',
					width: 120,
					labelWidth: 35,
					name: 'old_count',
					value:"",
				},{
					xtype : 'button',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '添加',
					handler : function() {
						//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
						var data = [{
							'name' : Ext.getCmp("old_store").rawValue,
							'count' : Ext.getCmp("old_count").getValue(),
							'type':'3',
							'typeName':'oldpanel',
							'id':'-1', //新增的matchresultId
							'storeId':Ext.getCmp("storeId_old").getValue(),
						}];
						//Ext.getCmp('addDataGrid')返回定义的对象
						Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
							true);
						Ext.getCmp('old_store').setValue('');
						Ext.getCmp('old_count').setValue('');

					}
				},
			]
		});
		var toolbar4 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar4',
			items: [
				{
					xtype:'tbtext',
					text:'原材料:',
					margin: '0 40 0 0',
					width: 100,
				},
				{
					fieldLabel : '材料名',
					xtype : 'combo',
					name : 'material_store',
					id : 'material_store',
					// disabled : true,
					width:350,
					labelWidth : 45,
					margin : '0 40 0 0',
					store : materialListStore,
					displayField : 'materialName',
					valueField : 'id',
					editable : true,
					listeners: {
						select:function (combo, record) {
							//选中后
							var select = record[0].data;
							var id = select.id;//项目名对应的id
							console.log('select===================....',select);
							var count_Use = select.countUse;
							var storeId_material = select.storeId;
							Ext.getCmp('storeId_material').setValue(storeId_material);
							Ext.getCmp('countUse_material').setValue(count_Use);
						}
					}
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '现可用数量',
					id :'countUse_material',
					width: 180,
					labelWidth: 80,
					name: 'countUse_material',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '',
					id :'storeId_material',
					width: 180,
					labelWidth: 80,
					name: 'storeId_material',
					value:"",
					hidden:true,
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '数量',
					id :'material_count',
					width: 120,
					labelWidth: 35,
					name: 'material_count',
					value:"",
				},{
					xtype : 'button',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '添加',
					handler : function() {
						//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
						var data = [{
							'name' : Ext.getCmp("material_store").rawValue,
							'count' : Ext.getCmp("material_count").getValue(),
							'type':'4',
							'typeName':'material',
							'id':'-1', //新增的matchresultId
							'storeId':Ext.getCmp("storeId_material").getValue(),
						}];
						//Ext.getCmp('addDataGrid')返回定义的对象
						Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
							true);
						//清除框里的数据
						Ext.getCmp('material_store').setValue('');
						Ext.getCmp('material_count').setValue('');

					}
				},
			]
		});

		//更新产品匹配信息
		var toolbar_4 = Ext.create('Ext.toolbar.Toolbar', {
			dock: "top",
			id: 'toolbar_4',
			items: [
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '产品名称',
					id :'productName_show',
					width: 300,
					labelWidth: 60,
					name: 'productName_show',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '位置',
					id :'positionName_show',
					width: 150,
					labelWidth: 35,
					name: 'positionName_show',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					margin : '0 40 0 0',
					fieldLabel: '所属项目',
					id :'project_show',
					width: 500,
					labelWidth: 60,
					name: 'project_show',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
				{
					xtype: 'textfield',
					// margin : '0 40 0 0',
					fieldLabel: '楼栋',
					id :'building_show',
					width: 200,
					labelWidth: 35,
					name: 'building_show',
					value:"",
					editable : false,//不可修改
					disabled : true,//隐藏显示
				},
			]
		});

		//更新产品匹配信息
		var toolbar_5 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id:'toolbar_5',
			items: [
				{
					xtype : 'button',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '更新信息',
					handler: function(){
						var select = Ext.getCmp('oneProject_match_grid').getStore()
							.getData();

						var s = new Array();
						select.each(function(rec) {
							s.push(JSON.stringify(rec.data));
						});

						console.log('s===================,,,',s);

						Ext.Ajax.request({
							url:"designlist/changeMatchResult.do",  //匹配结果修改
							params:{
								designlistId: designlistId,
								s: "[" + s + "]",

							},
							success:function (response) {
								console.log('response=====================??',response)

								var res = response.responseText;
								var jsonobj = JSON.parse(res);//将json字符串转换为对象
								console.log(jsonobj);
								console.log("success--------------",jsonobj.success);
								// console.log("errorList--------------",jsonobj['errorList']);
								var success = jsonobj.success;
								// var errorList = jsonobj.errorList;
								var errorCode = jsonobj.errorCode;
								// var errorCount = jsonobj.errorNum;
								if(success == false){
									if(errorCode == 1000){
										Ext.MessageBox.alert("提示", "匹配结果更新失败! 未知错误");
									}

								}else{
									Ext.MessageBox.alert("提示", "匹配结果更新成功!");
									Ext.getCmp('oneProject_match_grid').getStore().load();
								}
							},
							failure : function(response){
								Ext.MessageBox.alert("提示", "匹配结果更新失败!");
							}
						})

					}
				},

				//删除一条记录
				{
					xtype : 'button',
					margin: '0 10 0 35',
					iconAlign : 'center',
					iconCls : 'rukuicon ',
					text : '删 除',
					width:60,
					handler: function(){
						var sm = Ext.getCmp('oneProject_match_grid').getSelectionModel();
						var rec = sm.getSelection();

						console.log("删除数据-----------：",rec[0].data)
						console.log("删除：",rec[0].data.id)

						var s = new Array();

						s.push(JSON.stringify(rec[0].data));


						console.log("删除数据ss-----------：",s)

						//匹配结果id
						var matchResultId = rec[0].data.id;//matchResultId
						var count = rec[0].data.count;
						var matchId = rec[0].data.matchId;
						var madeBy = rec[0].data.materialMadeBy;//matchResultId

						if (rec.length != 0) {
							//删除新增的，还未添加到数据库中的数据.直接移除
							if(matchResultId == -1){
								Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
							}
							else{
								Ext.Msg.confirm("提示", "共选中" + rec.length + "条数据，是否确认删除？", function (btn) {
									if (btn == 'yes') {
										//先删除后台再删除前台
										//ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
										//Extjs 4.x 删除
										// Ext.getCmp('oneProject_match_grid').getStore().remove(Arr);
										Ext.Ajax.request({
											url:"designlist/deleteMatchResult.do",  //删除楼栋信息
											params:{
												// buildingId:buildingId,
												// matchResultId:matchResultId,
												// count:count,
												// matchId:matchId,
												// madeBy:madeBy,
												s: "[" + s + "]",
											},
											success:function (response) {
												console.log('response=====================??',response)

												var res = response.responseText;
												var jsonobj = JSON.parse(res);//将json字符串转换为对象
												console.log(jsonobj);
												console.log("success--------------",jsonobj.success);
												// console.log("errorList--------------",jsonobj['errorList']);
												var success = jsonobj.success;
												// var errorList = jsonobj.errorList;
												var errorCode = jsonobj.errorCode;
												// var errorCount = jsonobj.errorNum;
												if(success == false){
													if(errorCode == 1000){
														Ext.MessageBox.alert("提示", "删除失败！ 未知错误，请联系管理员！");
													}

												}else{
													//删除成功
													Ext.MessageBox.alert("提示", "删除成功!");
													Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
												}
											},
											failure : function(response){
												Ext.MessageBox.alert("提示", "删除失败!");
											}
										})

									} else {
										return;
									}
								});
							}

						} else {
							//Ext.Msg.confirm("提示", "无选中数据");
							Ext.Msg.alert("提示", "无选中数据");
						}

					}
				}
			]
		});


		//弹出表格，楼栋信息表
		var oneProject_match_grid=Ext.create('Ext.grid.Panel',{
			id : 'oneProject_match_grid',
			style:"text-align:center;",
			// store:me.projectMatch_List,//specificMaterialList，store1的数据固定projectMatch_List
			store:projectMatch_List,
			title:'产品匹配信息',
			// tbar:toolbar_5,
			dockedItems:[
				{
					xtype : 'toolbar',
					dock : 'top',
					items : [toolbar_4]
				},{
					xtype : 'toolbar',
					dock : 'top',
					items : [toolbar_5]
				},
			],
			columns:[
				{
					text: '材料名',
					dataIndex: 'name',
					flex :1,

				},{
					dataIndex : 'count',
					text : '数量',
					flex :1,
				},
				{
					dataIndex : 'materialMadeBy',
					text : '材料类型',
					flex :1,
					renderer: function (value) {
						return material.model.typeName[value].name; // key-value
					},
				},

				{
					dataIndex : 'type',
					text : 'type',
					flex :1,
					hidden:true,
				},
				{
					dataIndex : 'typeName',
					text : 'typeName',
					flex :1,
					hidden:true,
				},
				{
					dataIndex : 'id',
					text : 'matchResultId',
					flex :1,
					hidden:true,
				},
				{
					dataIndex : 'storeId',
					text : 'storeId',
					flex :1,
					hidden:true,
				},

				// {
				// 	xtype:'actioncolumn',
				// 	text : '删除操作',
				// 	width:100,
				// 	style:"text-align:center;",
				// 	items: [
				// 		//删除按钮
				// 		{
				// 			icon: 'extjs/imgs/delete.png',
				// 			tooltip: 'Delete',
				// 			style:"margin-right:20px;",
				// 			handler: function(grid, rowIndex, colIndex) {
				// 				var rec = grid.getStore().getAt(rowIndex);
				//
				// 				console.log("删除数据-----------：",rec.data)
				// 				console.log("删除：",rec.data.id)
				// 				//匹配结果id
				// 				var matchResultId = rec.data.id;//matchResultId
				// 				var count = rec.data.count;
				// 				var matchId = rec.data.matchId;
				// 				var madeBy = rec.data.materialMadeBy;//matchResultId
				// 				//弹框提醒
				// 				Ext.Msg.show({
				// 					title: '操作确认',
				// 					message: '将删除数据，选择“是”否确认？',
				// 					buttons: Ext.Msg.YESNO,
				// 					icon: Ext.Msg.QUESTION,
				// 					fn: function (btn) {
				// 						if (btn === 'yes') {
				// 							Ext.Ajax.request({
				// 								url:"designlist/deleteMatchResult.do",  //删除楼栋信息
				// 								params:{
				// 									// buildingId:buildingId,
				// 									matchResultId:matchResultId,
				// 									count:count,
				// 									matchId:matchId,
				// 									madeBy:madeBy,
				// 								},
				// 								success:function (response) {
				// 									Ext.MessageBox.alert("提示", "删除成功!");
				// 									Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
				// 								},
				// 								failure : function(response){
				// 									Ext.MessageBox.alert("提示", "删除失败!");
				// 								}
				// 							})
				// 						}
				// 					}
				// 				});
				// 			}
				// 		}]
				// }
			],
			flex:1,
			//selType:'checkboxmodel',
			plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
			    clicksToEdit : 2
			})],

			listeners: {
				//监听修改
				validateedit: function (editor, e) {
					var field=e.field
					var id=e.record.data.id
					var flag=false;
					if(id === "" || id ==null|| isNaN(id)){
						flag=true;
						id='0'
					}
					//项目id


					//修改的行数据
					var data = editor.context.newValues;
					//每个属性值
					var buildingNo = data.buildingNo;
					var buildingName = data.buildingName;
					var buildingLeader = data.buildingLeader;


					var s = new Array();
					//修改的一行数据
					s.push(JSON.stringify(data));
					// console.log("editor===",editor.context.newValues)  //

					Ext.Ajax.request({
						url:"project/addAndupdateBuiling.do",  //EditDataById.do
						params:{
							// tableName:table_name,
							projectId:project_Id,
							// field:field,
							// value:e.value,
							id:id,
							// s : "[" + s + "]",
							buildingNo:buildingNo,
							buildingName:buildingName,
							buildingLeader:buildingLeader
						},
						success:function (response) {
							Ext.MessageBox.alert("提示","修改成功" );
							if(flag){
								e.record.data.id=response.responseText;
							}
							//重新加载
							Ext.getCmp('oneProject_match_grid').getStore().load();
						},
						failure:function (response) {
							Ext.MessageBox.alert("提示","修改失败" );
						}
					})
				}
			}
		});

		//设置panel多行tbar
		this.dockedItems=[{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar_pop]
		},{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar1]
		},{
			xtype : 'toolbar',
			dock : 'top',
			style:'border-width:0 0 0 0;',
			items : [toolbar2]
		},{
			xtype : 'toolbar',
			dock : 'top',
			items : [toolbar3]
		},{
			xtype : 'toolbar',
			dock : 'top',
			style:'border-width:0 0 0 0;',
			items : [toolbar4]
		},
		];

		// this.tbar = toolbar_pop;
		this.items = [ oneProject_match_grid ];
		this.callParent(arguments);

		// Ext.getCmp('toolbar_4').items.items[0].setValue(productName_show);

		Ext.getCmp('productName_show').setValue(productName_show);
		Ext.getCmp('positionName_show').setValue(positionName_show);
		Ext.getCmp('project_show').setValue(projectName_show);
		Ext.getCmp('building_show').setValue(buildingName_show);


		// Ext.Ajax.request({
		// 	url : "system/userAdmin/get.do",
		// 	params : {
		// 		workerName : me.workerName
		// 	},
		// 	success : function(response) {
		// 		var obj = Ext.decode(response.responseText);
		// 		Ext.getCmp('loginName').setValue(obj.value[0].loginName);
		// 		Ext.getCmp('name').setValue(obj.value[0].name);
		// 		Ext.getCmp('tel').setValue(obj.value[0].tel);
		// 		Ext.getCmp('roleId').setValue(obj.value[0].roleId);
		// 		Ext.getCmp('organizationId').setValue(
		// 				obj.value[0].organizationId);
		// 	},
		// 	failure : function(response) {
		// 		Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
		// 	}
		// });
	}

})