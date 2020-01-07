Ext.define('system.organization.add', {
	extend : 'Ext.window.Window',
	title : '添加组织',
//	  layout : 'form',  
	    width : 400,  
	    closeAction : 'close',  
	    closable : true,  
	    bodyStyle : 'padding:5 5 5 5',  
	    modal:true,
	initComponent : function() {
		var me = this;
		var form = Ext.create('Ext.form.Panel', {
			layout : 'form',
			defaultType : "textfield",
			url : 'system/organization/addOrganization.do',
			items : [ {
				fieldLabel : '组织编号<font color=red>(必填)</font>',
				name : 'id',
				allowBlank : false,
				blankText :  '不能为空',
				msgTarget : 'under',
				regex: /^[A-Za-z0-9]+$/,  //由数字和26个英文字母组成的字符串
				regexText:"组织编号只能由字母和数字组成！",
				validator : function(value) {
					var success = true;
					Ext.Ajax.request({
						url : 'organizationList.do',
						async : false,
						success : function(response) {
							var text = response.responseText;
							var obj = Ext.JSON.decode(text);
							for (var i = 0; i < obj.length; i++) {
								if (obj[i].id == value) {
									success = false;
								}
							}
						}
					});
					if (success == true)
						return success;
					else
						return "组织代码已存在";
				}
			}, {
				fieldLabel : '组织名称<font color=red>(必填)</font>',
				name : 'name',
				allowBlank : false,
				blankText : '不能为空',
				msgTarget : 'under',
				validator : function(value) {
					var success = true;
					Ext.Ajax.request({
						url : 'organizationList.do',
						async : false,
						success : function(response) {
							var text = response.responseText;
							var obj = Ext.JSON.decode(text);
							for (var i = 0; i < obj.length; i++) {
								if (obj[i].name == value) {
									success = false;
								}
							}
						}
					});
					if (success == true)
						return success;
					else
						return "组织名称已存在";
				}
			}, {
				fieldLabel : '电话号码<font color=red>(必填)</font>',
				name : 'tel',
				msgTarget : 'under',
				validator : function(value) {
					var re = /^((1[3584]\d{9}))$/;
					if (!re.test(value)) {
						return "输入有误或为空";
					} else
						return true;
				}
			}, {
				fieldLabel : '联系人',
				name : 'contacts'
			}, {
				fieldLabel : '主管领导',
				name : 'leadership'
			}],
			buttons : [ {
				text : '添加',
				
				handler : function() {
					//console.log(form);
					var itemsPerPage = 30;
					if (form.isValid()) {
						form.submit({
							waitMsg : '正在更新...',
							success : function(form, action) {
								Ext.Msg.alert('消息', '更新成功！');
								me.close();
								Ext.getCmp('organizationMain').store.load({
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
	}
})