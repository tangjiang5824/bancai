Ext.define('system.organization.form',{
	extend: 'Ext.form.Panel',
	defaultType : "textfield",
	layout: 'form',
	initComponent: function(){
		this.organizationId = Ext.create('Ext.form.field.Text',{
			fieldLabel : "组织编号<font color=red>(不可改)</font>",
			name : "id",
			editable :false
		});		
		this.name = Ext.create('Ext.form.field.Text',{
			fieldLabel : "组织名称",
			name : "name"
		});
		this.tel = Ext.create('Ext.form.field.Text',{
			fieldLabel: '电话号码',
			name: 'tel',
			msgTarget:'under',
			validator: function(value){
				var re= /^((1[3584]\d{9}))$/;
				if(!re.test(value)){
					return "输入有误";
				}
				else
					return true;
			}
		});
		this.contacts = Ext.create('Ext.form.field.Text',{
			fieldLabel : "联系人",
			name : "contacts"
		});
		this.leadership = Ext.create('Ext.form.field.Text',{
			fieldLabel : "主管领导",
			name : "leadership"
		});
		
		this.items = [this.organizationId,this.name,this.tel,this.contacts,this.leadership];
		this.callParent(arguments);
	},
	setValues: function(obj){
		this.organizationId.setValue(obj.value[0].id);
		this.name.setValue(obj.value[0].name);
		this.tel.setValue(obj.value[0].tel);
		this.contacts.setValue(obj.value[0].contacts);
		this.leadership.setValue(obj.value[0].leadership);
		
	}
});
