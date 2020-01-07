Ext.define('org.edit.edit', {
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
		var form = Ext.create('Ext.form.Panel', {
			
			items : [ {
				xtype : 'textfield',
				id : 'loginName',
				name : 'loginName',
				fieldLabel : '登录名',
				disabled : true,
				width:'95%',
				editable : false
			}, {
				xtype : 'textfield',
				name : 'name',
				id : 'name',
				width:'95%',
				fieldLabel : '姓名'
			}, {
				xtype : 'textfield',
				name : 'tel',
				id : 'tel',
				width:'95%',
				fieldLabel : '电话'
			}, {
				fieldLabel : '用户类型',
				xtype : 'combo',
				name : 'roleId',
				id : 'roleId',
				disabled : true,
				width:'95%',
				store : {
					fields : [ 'id', 'name' ],
					proxy : {
						type : 'ajax',
						url : 'roleList.do',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true
				},
				name : 'roleId',
				displayField : 'name',
				valueField : 'id'

			}, {
				fieldLabel : '组织名称',
				xtype : 'combo',
				id : 'organizationId',
				name : 'organizationId',
				disabled : true,
				width:'95%',
				store : {
					fields : [ 'id', 'name' ],
					proxy : {
						type : 'ajax',
						url : 'organizationList.do',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true
				},
				name : 'organizationId',
				displayField : 'name',
				valueField : 'id'
			} ],
			buttons : [ {
				text : '更新',
				handler : function() {
					// console.log(me.roleId);
					if (form.isValid()) {
						var loginName = Ext.getCmp("loginName").getValue();
						var name = Ext.getCmp("name").getValue();			
						var tel = Ext.getCmp("tel").getValue();
						var roleId = Ext.getCmp("roleId").getValue();
						var organizationId = Ext.getCmp("organizationId")
								.getValue();
						form.submit({
							url : 'system/userAdmin/editUser.do',
							waitMsg : '正在更新...',
							params : {
								loginName : loginName,
								name : name,
								tel : tel,
								roleId : roleId,
								organizationId : organizationId
							},
							success : function(form, action) {
								Ext.Msg.alert('消息', '更新成功！');
								me.close();
								Ext.getCmp('adminMain').store.load({
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
		Ext.Ajax.request({
			url : "system/userAdmin/get.do",
			params : {
				loginName : me.loginName
			},
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				Ext.getCmp('loginName').setValue(obj.value[0].loginName);
				Ext.getCmp('name').setValue(obj.value[0].name);
				Ext.getCmp('tel').setValue(obj.value[0].tel);
				Ext.getCmp('roleId').setValue(obj.value[0].roleId);
				Ext.getCmp('organizationId').setValue(
						obj.value[0].organizationId);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
	}

})