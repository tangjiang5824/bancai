Ext.define('system.userAdmin.form',{
	extend: 'Ext.form.Panel',
	defaultType : "textfield",
	layout: 'form',
	initComponent: function(){
		this.loginName = Ext.create('Ext.form.field.Text',{
			fieldLabel : "用户名<font color=red>(不可改)</font>",
			name : "loginName",
			editable :false
		});
		this.name = Ext.create('Ext.form.field.Text',{
			fieldLabel : "姓名",
			name : "name"
		});
		
		
		this.tel = Ext.create('Ext.form.field.Text',{
			fieldLabel : "电话",
			name : "tel",
			msgTarget:'under',
			validator: function(value){
				var re= /^((1[3584]\d{9}))$/;
				if(!re.test(value)){
					return "联系方式输入有误";
				}
				else
					return true;
			}
		});
		
		this.roleId = Ext.create('Ext.form.ComboBox',{
			fieldLabel: '用户类型',
			xtype: 'combo',
			//disabled : true,
			store : {
	             fields : ['id', 'name'],
	             proxy : {
	                 type : 'ajax',
	                 url : 'roleList.do',
	                 reader : {
	                     type : 'json'
	                 }
	             },
	             autoLoad : true
	         },
			name: 'roleId',
			displayField: 'name',
			valueField: 'id'
			//editable: false
		});
		this.organizationId = Ext.create('Ext.form.ComboBox',{
			fieldLabel: '组织名称',
			xtype: 'combo',
			//disabled : true,
			store : {
	             fields : ['id', 'name'],
	             proxy : {
	                 type : 'ajax',
	                 url : 'organizationList.do',
	                 reader : {
	                     type : 'json'
	                 }
	             },
	             autoLoad : true
	         },
	         name: 'organizationId',
			displayField: 'name',
			valueField: 'id'
			//editable: false
		});
		this.items = [this.loginName,this.name,this.tel,this.roleId,this.organizationId];
		this.callParent(arguments);
	},
	setValues : function(obj) {
		this.loginName.setValue(obj.value[0].loginName);
		this.name.setValue(obj.value[0].name);
		this.tel.setValue(obj.value[0].tel);
		
		this.roleId.setValue(obj.value[0].roleId);
		this.organizationId.setValue(obj.value[0].organizationId);
	}
});