<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css"
	href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script src="extjs/ext-all.js"></script>
<script>
   
	var login = Ext.create('Ext.form.Panel',{
		defaultType: 'textfield',
		bodyPadding: 0,
		url: 'login.do',
		items:[
			{
				fieldLabel: '用户名',
				allowBlank: false,
				emptyText: '请输入用户名',
				blankText:'用户名不能为空',
				msgTarget:'under',
				name: 'loginName',
				id:'loginName',
			    /* validator: function(value){
					var success = true;
					Ext.Ajax.request({
						url: 'listUser.do',
						async: false,
						success: function(response){
							var text = response.responseText;
							var obj = Ext.JSON.decode(text);
							for(var i=0;i<obj.length;i++){
								if(obj[i].loginName==value){
									success = obj[i].organizationId;
								}  
							}
						}
					});
					
					
				},*/
				listeners : {
					specialkey : function(field, e) {
						if (e.getKey() == e.ENTER) {
							this.up('form').doLogin();
						}
					}
				},
			},
			{
				fieldLabel: '密码',
				allowBlank: false,
				emptyText: '请输入密码',
				inputType: 'password',
				blankText:'密码不能为空',
				msgTarget:'under',
				name: 'pwd',
				listeners : {
					specialkey : function(field, e) {
						if (e.getKey() == e.ENTER) {
							this.up('form').doLogin();
						}
					}
				}
			},
			{
				fieldLabel: '角色',
				name: 'role',
				value: "税务管理员",
                editable: false
			},
			{
				fieldLabel: '角色',
				emptyText: '税务管理员',
				name: 'roleId',
				value: 1,
				hidden:true,
                editable: false
			}
		],
		buttons:[
			{
				text: '登录',
				 handler: function(){
					 this.up('form').doLogin();
				 }
			} 
		],
		doLogin: function(){
			var loginName=Ext.getCmp('loginName').getValue();
			var success=null;
			
			
			var form = this.getForm();
			
			if (form.isValid()) {
                form.submit({
                    success: function(form, action) {
                       Ext.Msg.alert('消息', "登录成功");
                       window.location.href = "main.jsp";
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('消息', "登录失败，请检查用户名和密码");
                    }
                });
		}
		}
	}
			);
	Ext.onReady(function(){
		Ext.tip.QuickTipManager.init();
		//Ext.form.Field.prototype.msgTarget="side";
		 Ext.create('Ext.window.Window',{
		 	title: '万州区税收征管保障信息系统',
		 	layout: 'anchor',
		    defaults: {
		        anchor: '100%'
		    },
			closable: false,
			layout: 'fit',
			items: [login]	
		}).show();
	});
</script>
<title>万州区税收征管保障信息系统</title>
</head>
<body>

</body>
</html>