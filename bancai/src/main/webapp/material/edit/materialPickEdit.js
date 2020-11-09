Ext.define('material.edit.materialPickEdit', {
	extend : 'Ext.window.Window',
	title : '修改原材料匹配',
	modal : true,
//  layout : 'form',
width : 380,
//	closeAction : 'close',
	closable : true,
	bodyStyle : 'padding:5 5 5 5',
	initComponent : function() {
		var me = this;
		var itemsPerPage = 30;
		var tableName_M="material_info_store_type";

		//查询数据库，返回原材料类型
		var MaterialStoreList = Ext.create('Ext.data.Store',{
			fields : [ 'materialName'],
			proxy : {
				type : 'ajax',
				url : 'material/findAllBytableName.do?tableName='+tableName_M,
				reader : {
					type : 'json',
					rootProperty: 'material_info_store_type',
				},
				fields : ['id','materialName']
			},
			autoLoad : true
		});

		//原材料类型，下拉框显示
		var input_materialName = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '原材料品名',
			// labelWidth : 70,
			// width : 260,
			width:'95%',
			id :  'input_materialName',
			name : 'input_materialName',
			matchFieldWidth: true,
			allowBlank:false,
			// emptyText : "--请选择--",
			displayField: 'materialName',
			valueField: 'id', //显示name
			editable : true,
			store: MaterialStoreList,
			listeners:{
				select: function(combo, record, index) {
					console.log("hellon  wwww");
					var select = record[0].data;
					var id = select.id;//项目名对应的id
					console.log(select);
					//确定后面的属性值
					var materialStoreId = select.storeId;

					var sc = Ext.getCmp('pickingcreate_Grid').getSelectionModel().getSelection();
					// var sc = Ext.getCmp('pro_picking_MaterialGrid').getSelectionModel().getSelection();

					sc[0].set('storeId',materialStoreId);
					//改变warehouseName,storecount
					Ext.getCmp('warehouseName_p').setValue(select.warehouseName);
					Ext.getCmp('countStore_p').setValue(select.countStore);
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

			}
		});

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

		var form = Ext.create('Ext.form.Panel', {
			items : [
			// 	{
			// 	xtype : 'textfield',
			// 	id : 'workerName_p',
			// 	name : 'workerName_p',
			// 	fieldLabel : '职员名称',
			// 	disabled : true,
			// 	width:'95%',
			// 	editable : false
			// },
				// departmentList,
				input_materialName,
				// {
				// 	xtype : 'textfield',
				// 	name : 'partNo_p',
				// 	id : 'partNo_p',
				// 	width:'95%',
				// 	fieldLabel : '品号'
				// },
				{
					xtype : 'textfield',
					name : 'warehouseName_p',
					id : 'warehouseName_p',
					width:'95%',
					fieldLabel : '仓库名',
					disabled : true,
					editable : false
				},
				{
					xtype : 'textfield',
					name : 'countStore_p',
					id : 'countStore_p',
					width:'95%',
					fieldLabel : '库存数量',
					disabled : true,
					editable : false
				},
				 {
					xtype : 'textfield',
					name : 'count_p',
					id : 'count_p',
					width:'95%',
					fieldLabel : '待领数量'
				},

			],
			buttons : [ {
				text : '更新',
				handler : function() {
					// console.log(me.roleId);
					if (form.isValid()) {
						// var materialName = Ext.getCmp("input_materialName").getValue();
						var materialName = Ext.getCmp("input_materialName").rawValue
						var count = Ext.getCmp("count_p").getValue();
						var countStore = Ext.getCmp("countStore_p").getValue();
						var warehouseName = Ext.getCmp("warehouseName_p").getValue();


						var sc = Ext.getCmp("pickingcreate_Grid").getSelectionModel().getSelection()[0];

						// var sc = Ext.getCmp("pro_picking_MaterialGrid").getSelectionModel().getSelection()[0];
						sc.set('name',materialName);
						sc.set('count',count);
						sc.set('countStore',countStore);
						sc.set('warehouseName',warehouseName);
						// sc.set('partNo',partNo);

						//保存关闭弹窗
						me.close();

						// form.submit({
						// 	url : '',
						// 	waitMsg : '正在更新...',
						// 	params : {
						// 		id:me.userId,//新增id为字符串
						// 		// s : "[" + s + "]",
						// 		materialName:materialName,
						// 		count:count,
						// 	},
						// 	success : function(form, action) {
						// 		Ext.Msg.alert('消息', '更新成功！');
						// 		me.close();
						// 		// Ext.getCmp('addWorkerGrid').store.load({
						// 		// 	params : {
						// 		// 		start : 0,
						// 		// 		limit : itemsPerPage
						// 		// 	}
						// 		// });
						// 	},
						// 	failure : function(form, action) {
						// 		Ext.Msg.alert('消息', '更新失败！');
						// 	}
						// });
					}
				}
			} ]
		})

		this.items = [ form ];
		this.callParent(arguments);

		//获取父页面的值
		Ext.getCmp('input_materialName').setValue(me.materialId);//id
		Ext.getCmp('input_materialName').setRawValue(me.materialName);//值
		// Ext.getCmp('partNo_p').setValue(me.partNo);
		Ext.getCmp('warehouseName_p').setValue(me.warehouseName);
		Ext.getCmp('countStore_p').setValue(me.countStore);
		Ext.getCmp('count_p').setValue(me.count);

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