Ext.define('system.organization.edit',{
	extend: 'Ext.window.Window',
	title: '修改组织',
//	  layout : 'form',  
	    width : 380,  
	    closeAction : 'close',  
	    closable : true,  
	    bodyStyle : 'padding:5 5 5 5',  
	    modal:true,
	initComponent: function(){
		var me =this;
		var itemsPerPage = 30;
		var form = Ext.create('system.organization.form',{
				url: 'system/organization/editOrganization.do',
				buttons: [{
			        text: '更新',
			        handler: function() {
			            if(form.isValid()){
			            		form.submit({
				                    waitMsg: '正在更新...',
				                    success: function(form, action) {
				                        Ext.Msg.alert('消息', '更新成功！');
				                        me.close();
				                     },
				                     failure: function(form, action) {
				                         Ext.Msg.alert('消息', '更新失败！');
				                     }
				                });
			            }
			        }
			    }]
		});
		this.items = [form];
		this.callParent(arguments);
		Ext.Ajax.request({
			url : "system/organization/get.do",
			params : {
				id : me.organizationId
			},
			success : function(response) {
				var obj=Ext.decode(response.responseText);
				//console.dir(obj.value[0].id);
				form.setValues(obj);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
	}
})
//		