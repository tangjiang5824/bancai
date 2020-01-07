Ext.define('tax.enterprise.add',{
	extend: 'Ext.form.Panel',
	layout:'form',
	id:'addEnterpriseForm',
	url:'system/enterprise/addEnterprise.do',
	defaultType : "textfield",
	items : [{
		fieldLabel : "纳税识别号<font color=red>*</font>",
		id : "enterpriseCode",
		msgTarget:'under',
		name: 'code',
		
		validationEvent : 'blur',
		validator: function(value){
			
			Ext.Ajax.request({
				
				url : "system/enterprise/check.do",
				params : {
					code : value
				},
				method : 'post',
				success : function(response, options) {
					var obj=Ext.decode(response.responseText);
					
					if(obj.value==0){
						Ext.getCmp('enterpriseCode').markInvalid('纳税识别码已被使用');
					}
				},
				failure : function(response) {
					Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
				}
			});
			return true;
			
		}
		
	},{
		fieldLabel : "企业名称<font color=red>*</font>",
		//name : "pwd"
		name: 'name'
	},{
		fieldLabel : "法定代表人姓名<font color=red>*</font>",
		//name : "userName"
		name: 'repName'
	},{
		fieldLabel: '法定代表人证件类型<font color=red>*</font>',
		xtype: 'combo',
		store : ['身份证', '护照'],
		name: 'repCerType',		
		editable: false
	},{
		fieldLabel : "法定代表人证件号<font color=red>*</font>",
		//name : "userName"
		name: 'repCerNum'
	},{
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
	}],
	buttonAlign : "center",
	buttons:[
		{
	        text: '提交',
	        handler: function() {
	            Ext.getCmp('addEnterpriseForm').doSubmit();
	        }
	    },
		{
				text : "重置",
				handler : function(){
				this.up().up().reset();
		}
		}
	],
	doSubmit: function(){
		var itemsPerPage = 30;
		var me = Ext.getCmp('addEnterpriseForm');
		var addForm = this.getForm();
		if(addForm.isValid()){
			addForm.submit({
                waitMsg: '正在保存...',
                submitEmptyText: false,
                success: function(form, action) {
                    Ext.Msg.alert('消息', '保存成功！');
                    Ext.getCmp('addEnterprise').close();
                    Ext.getCmp('enterpriseMain').store.load({
                    		params:{
		    		    		    start: 0,
		    			        limit: itemsPerPage
                    		}
    			    });
                 },
                 failure: function(form, action) {
                     Ext.Msg.alert('消息', '保存失败！');
                 }
            });
        }
		else
			Ext.Msg.alert("提示","请检查输入格式")
	}
	
});