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
		url: 'testLogin.do',//TestUserController
		//组成部分
		items:[
			{
				fieldLabel: '用户名',
				allowBlank: false,
				emptyText: '请输入用户名',
				blankText:'用户名不能为空',
				msgTarget:'under',
				name: 'username',
				id:'username'
			},
			{
				fieldLabel: '密码',
				allowBlank: false,
				emptyText: '请输入密码',
				inputType: 'password',
				blankText:'密码不能为空',
				msgTarget:'under',
				name: 'password'
			},
			{
				fieldLabel: '用户类型',
				allowBlank: false,
				blankText:'请选择用户类型',
				msgTarget:'under',
				name: 'usertype',
				id:'usertype',
				xtype: "combobox",
                editable: false,
                emptyText: "--请选择--",
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'text'],
                    data: [[0, '系统管理员'], [1, '计划处'], [2, '财务处']]
                }),
                valueField: 'value',
                displayField: 'text'				
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
			var username=Ext.getCmp('username').getValue();
			var usertype=Ext.getCmp('usertype').getValue();
			var success=null;
			
			var form = this.getForm();
			
			if (form.isValid()) {
                form.submit({
                    success: function(form, action) {
                       Ext.Msg.alert('消息', "登录成功");
                       window.location.href = "upload_main.jsp";  //upload_main

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
		 Ext.create('Ext.window.Window',{
		 	title: '登录测试',
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

<title>登录测试页面</title>
</head>
<body>

</body>
</html>