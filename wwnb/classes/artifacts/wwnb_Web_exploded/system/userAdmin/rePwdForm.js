Ext.define('system.userAdmin.rePwdForm',{
	extend: 'Ext.form.Panel',
	defaultType : "textfield",
	initComponent: function(){
		this.loginName = Ext.create('Ext.form.field.Text',{
			fieldLabel : "用户名(不可改)",
			name : "loginName",
			editable :false
		});
		this.pwd = Ext.create('Ext.form.field.Text',{
			fieldLabel : "新密码",
			name : "pwd"
		});
		
		this.items = [this.loginName,this.pwd];
		this.callParent(arguments);
	},
	setValues : function(obj) {
		this.loginName.setValue(obj.value[0].loginName);
//		this.pwd.setValue(obj.value[0].pwd);
	}
});