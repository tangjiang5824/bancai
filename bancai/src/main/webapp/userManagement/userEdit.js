Ext.define('userManagement.userEdit', {
	extend : 'Ext.window.Window',
	title : '修改用户',
	modal : true,
//  layout : 'form',
width : 380,
//	closeAction : 'close',
	closable : true,
	bodyStyle : 'padding:5 5 5 5',
	initComponent : function() {
		var me = this;
		var itemsPerPage = 30;
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
			items : [ {
				xtype : 'textfield',
				id : 'workerName_p',
				name : 'workerName_p',
				fieldLabel : '职员名称',
				disabled : true,
				width:'95%',
				editable : false
			}, {
				xtype : 'textfield',
				name : 'tel_p',
				id : 'tel_p',
				width:'95%',
				fieldLabel : '电话'
			},
				// departmentList,
				{
					fieldLabel : '部门名称',
					xtype : 'combo',
					name : 'departmentId',
					id : 'departmentId',
					// disabled : true,
					width:'95%',
					store : departmentListStore,
					displayField : 'departmentName',
					valueField : 'id',
					editable : true,
				}

			],
			buttons : [ {
				text : '更新',
				handler : function() {
					// console.log(me.roleId);
					if (form.isValid()) {
						var workerName = Ext.getCmp("workerName_p").getValue();
						var tel = Ext.getCmp("tel_p").getValue();

						// console.log("--------------------Id:",Ext.getCmp("departmentId").value)
						var departmentId = Ext.getCmp("departmentId").getValue();
						form.submit({
							url : 'department/addOrUpdateWorkerInfo.do',
							waitMsg : '正在更新...',
							params : {
								id:me.userId,//新增id为字符串
								// s : "[" + s + "]",
								workerName:workerName,
								tel:tel,
								departmentId:departmentId
							},
							success : function(form, action) {
								Ext.Msg.alert('消息', '更新成功！');
								me.close();
								Ext.getCmp('addWorkerGrid').store.load({
									params : {
										start : 0,
										limit : itemsPerPage
									}
								});
							},
							failure : function(form, action) {
								Ext.Msg.alert('消息', '更新失败！');
							}
						});
					}
				}
			} ]
		})

		this.items = [ form ];
		this.callParent(arguments);

		//获取负页面的值
		Ext.getCmp('workerName_p').setValue(me.workerName);
		Ext.getCmp('tel_p').setValue(me.tel);
		Ext.getCmp('departmentId').setValue(me.departmentId);//id
		Ext.getCmp('departmentId').setRawValue(me.departmentName);//值

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