Ext.define('system.userAdmin.edit',{
	extend: 'Ext.window.Window',
	title:'修改用户',
//	 layout : 'form',  
	    width : 380,  
	    closeAction : 'close',  
	    closable : true,  
	    bodyStyle : 'padding:5 5 5 5',  
	    modal:true,
	   initComponent: function(){
		var me =this;
		var itemsPerPage = 30;
		var form = Ext.create('system.userAdmin.form',{
					url: 'system/userAdmin/editUser.do',
					buttons: [{
				        text: '更新',
				        handler: function() {
				            if(form.isValid()){
				            		form.submit({
					                    waitMsg: '正在更新...',
					                    success: function(form, action) {
					                    	//console.log(me.loginName);
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
		this.items = [form];
		this.callParent(arguments);
		Ext.Ajax.request({
			url : "system/userAdmin/get.do",
			params : {
				loginName : me.loginName
			},
			success : function(response) {
				var obj=Ext.decode(response.responseText);
				form.setValues(obj);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
	}

})