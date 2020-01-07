Ext.define('system.userAdmin.resetPassword',{
	extend: 'Ext.window.Window',
	title:'重置密码',
	initComponent: function(){
		var me =this;
		var itemsPerPage = 30;
		var rePwdForm = Ext.create('system.userAdmin.rePwdForm',{
					url: 'system/userAdmin/resetPassword.do',
					buttons: [{
				        text: '更新',
				        handler: function() {
				            if(rePwdForm.isValid()){
				            	rePwdForm.submit({
					                    waitMsg: '正在更新...',
					                    success: function(form, action) {
					                        Ext.Msg.alert('消息', '更新成功！');
					                        me.close();
					                        Ext.getCmp('adminMain').store.load({
					                    		params:{
						    		    		    		start: 0,
						    		    		    		limit: itemsPerPage
					                    		}
					                     });
					                     },
					                     failure: function(form, action) {
					                         Ext.Msg.alert('消息', '更新失败！');
					                     }
					                });
				            }
				        }
				    }]
				})
		this.items = [rePwdForm];
		this.callParent(arguments);
		Ext.Ajax.request({
			url : "system/userAdmin/get.do",
			params : {
				loginName : me.loginName
			},
			success : function(response) {
				var obj=Ext.decode(response.responseText);
				//console.dir(obj.value[0].loginName);
				rePwdForm.setValues(obj);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
	}

})