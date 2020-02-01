Ext.define('tax.enterprise.form',{
	extend: 'Ext.form.Panel',
	defaultType : "textfield",
	initComponent: function(){
		this.code = Ext.create('Ext.form.field.Text',{
			fieldLabel : "纳税识别号<font color=red>*</font>",
			name : "code",
			editable :false
		});
		this.name = Ext.create('Ext.form.field.Text',{
			fieldLabel : "企业名称<font color=red>*</font>",
			name : "name"
		});
		this.repName = Ext.create('Ext.form.field.Text',{
			fieldLabel : "法定代表人姓名<font color=red>*</font>",
			name : "repName"
		});
		this.repCerType = Ext.create('Ext.form.ComboBox',{
			fieldLabel: '法定代表人证件类别<font color=red>*</font>',
			xtype: 'combo',
			store : ['身份证', '护照'],
			name: 'repCerType',
			displayField: 'repCerName',
			valueField: 'repCerID',
			editable: false
		});
		this.repCerNum = Ext.create('Ext.form.field.Text',{
			fieldLabel : "法定代表人证件号码<font color=red>*</font>",
			name : "repCerNum"
		});
		this.tel = Ext.create('Ext.form.field.Text',{
			fieldLabel : "联系电话",
			//name : "userNum"
			name: 'tel',
			msgTarget:'under',
			emptyText:'如：“023-67388821”或“152998783948”',
			
			validator: function(value){
				var re=/^1[0-9]{10}$/;
				var re1=/^0\d{2,3}-?\d{7,8}$/;
				if(value !== null && value !== undefined && value !== ''){
					
					if(!re.test(value)&&!re1.test(value)){
						return "号码输入有误";
					}else
						return true;
				}else
					return true;
				
			}
		});
		
		this.items = [this.code,this.name,this.repName,this.repCerType,this.repCerNum,this.tel];
		this.callParent(arguments);
	},
	setValues : function(obj) {
		this.code.setValue(obj.value[0].code);
		this.name.setValue(obj.value[0].name);
		this.repName.setValue(obj.value[0].repName);
		this.repCerType.setValue(obj.value[0].repCerType);
		this.repCerNum.setValue(obj.value[0].repCerNum);
		this.tel.setValue(obj.value[0].tel);
	}
});