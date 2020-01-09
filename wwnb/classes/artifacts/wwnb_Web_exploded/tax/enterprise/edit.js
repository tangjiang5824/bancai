Ext.define('tax.enterprise.edit',{
	extend: 'Ext.window.Window',
	title:'修改用户',
	initComponent: function(){
		var me =this;
		var itemsPerPage = 30;
		var form = Ext.create('system.enterprise.form',{
					url: 'system/enterprise/editEnterprise.do',
					buttons: [{
				        text: '更新',
				        handler: function() {
				            if(form.isValid()){
				            		form.submit({
					                    waitMsg: '正在更新...',
					                    submitEmptyText: false,
					                    success: function(form, action) {
					                        Ext.Msg.alert('消息', '更新成功！');
					                        me.close();
					                        Ext.getCmp('enterpriseMain').store.load({
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
			url : "system/enterprise/get.do",
			params : {
				code : me.code
			},
			success : function(response) {
				var obj=Ext.decode(response.responseText);
				//console.dir(obj.value[0].code);
				form.setValues(obj);
			},
			failure : function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
			}
		});
	}

})