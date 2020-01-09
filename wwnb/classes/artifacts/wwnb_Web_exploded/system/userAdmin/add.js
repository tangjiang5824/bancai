Ext.define('system.userAdmin.add',{
	extend: 'Ext.form.Panel',
	id: 'addUserForm',
	layout:'form',
	modal:true,
	url:'system/userAdmin/addUser.do',
	defaultType : "textfield",
	items : [
		{
		fieldLabel : "登录名<font color=red>(必填)</font>",
		id : "loginName",
		allowBlank: false,
		blankText:'用户名不能为空',
		msgTarget:'under',
		name: 'loginName',
		validator: function(value){
			var success = true;
			Ext.Ajax.request({
				url: 'listUser.do',
				async: false,
				success: function(response){
					var text = response.responseText;
					var obj = Ext.JSON.decode(text);
					for(var i=0;i<obj.length;i++){
						if(obj[i].loginName==value){
							success = false;
						}  
					}
				}
			});
			if(success==true)
				return success;
			else
				return "用户名已存在";
		}
		 
	}
		,{
		fieldLabel : "密码",
		name: 'pwd',
		emptyText : "000000"
	},{
		fieldLabel : "姓名<font color=red>(必填)</font>",
		name: 'name',
		allowBlank : false,
		blankText : '不能为空',
		msgTarget : 'under'
	},{
		fieldLabel : "电话<font color=red>(必填)</font>",
		name: 'tel',
		allowBlank : false,
		blankText:'',
		msgTarget : 'under',
		validator: function(value){
			var flag = true;
//			var re=/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
			var re= /^((1[3584]\d{9}))$/;

			if(!re.test(value)){
				flag = false
			  }
			if(flag==true)
				return true;
			else
				return "联系方式有误或为空";		
		}
	},{
		fieldLabel: '用户类型<font color=red>(必填)</font>',
		xtype: 'combo',
		allowBlank : false,
		blankText : '不能为空',
		msgTarget : 'under',
		store : {
             fields : ['id', 'bane'],
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
		id: 'roleList',
		displayField: 'name',
		valueField: 'id',
		editable: false,
		listeners:{
			'select' : function(combo, records, eOpts) {
				Ext.getCmp('orggId').getStore().setProxy({
		                 type : 'ajax',
		                 url : 'system/userAdmin/organizationList.do',
		                 extraParams: {
							 roleId : Ext.getCmp('roleList').getValue()
		                 },
		                 reader : {
		                     type : 'json'
		                 }
				})
			}
		}
	},{
		fieldLabel: '组织名称<font color=red>(必填)</font>',
		xtype: 'combo',
		allowBlank : false,
		blankText : '不能为空',
		msgTarget : 'under',
		id:'orggId',
		store : {
             fields : ['id', 'name'],
             proxy : {
                 type : 'ajax',
                url : 'system/userAdmin/organizationList.do',
                 extraParams: {
					 roleId : Ext.getCmp('roleId').getValue()
                 },
                 reader : {
                     type : 'json'
                 }
             },        
	            autoLoad : true
	        },
	    name: 'organizationId',
		displayField: 'name',
		valueField: 'id',
		editable: false
	}],
	buttonAlign : "center",
	buttons:[
		{
	        text: '提交',
	        handler: function() {
	            Ext.getCmp('addUserForm').doSubmit();
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
		var me = Ext.getCmp('addUserForm');
		var addForm = this.getForm();
		if(addForm.isValid()){
			addForm.submit({
                waitMsg: '正在保存...',
                success: function(form, action) {
                    Ext.Msg.alert('消息', '保存成功！');
                    Ext.getCmp('addUser').close();
                    Ext.getCmp('adminMain').store.load({
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