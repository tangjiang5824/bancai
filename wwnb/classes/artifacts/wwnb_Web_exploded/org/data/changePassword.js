Ext.define('org.data.changePassword', {
	extend : 'Ext.form.Panel',
	region : 'center',
	modal:true,
    layout : 'form',  
    width : 380,  
    bodyStyle : 'padding:5 5 5 5', 
    //layout 注释掉则位于右上角
    layout: {
        type:'vbox',
        padding:'5 5 5 5',
        pack:'center',//垂直居中
        align:'center'//水平居中
    },

	initComponent : function() {
		var me = this;	
		me.form=Ext.create('Ext.form.Panel',{
			title : '修改密码',
		    width : 380, 
		    buttonAlign:'center',
		    labelWidth:100,
		    labelAlign:"center",
		    align:"center",
		    frame:true,
		    draggable:true,
		    defaults:{align:"center"},
			items : [{
			xtype : 'textfield',
			fieldLabel : '当前密码',
			width : 300,
			id : 'oldPwd',
			name : 'oldPwd',
			inputType : 'password'
		}, {
			xtype : 'textfield',
			fieldLabel : '新密码',
			width : 300,
			id : 'newPwd',
			name : 'newPwd',
			inputType : 'password'
		}, {
			xtype : 'textfield',
			fieldLabel : '确认新密码',
			width : 300,
			id : 'reNewPwd',
			name : 'reNewPwd',
			inputType : 'password'
		}],
		buttons:[{
			xtype : 'button',
			text : '保存更改',
			handler : function() {
				var oldPwd = Ext.getCmp('oldPwd').getValue();
				var newPwd = Ext.getCmp('newPwd').getValue();
				var reNewPwd = Ext.getCmp('reNewPwd').getValue();
				if (newPwd == reNewPwd) {
					Ext.Ajax.request({
						url : 'changePassword.do',
						params : {
							oldPwd : oldPwd,
							newPwd : newPwd
						},
						success : function(response) {
							var obj = Ext.decode(response.responseText);
							if (obj) {
								Ext.MessageBox.alert('消息', '修改密成功，请重新登陆！',
										function() {
									Ext.Ajax.request({
        		            			url: 'getRoleId.do',        		   
        		            			success: function(response){
        		            				var respText = Ext.util.JSON.decode(response.responseText);
        		            				var roleId = 	respText.value;
        		            				if(roleId==0) window.location.href = 'system.jsp';
        		    						else if(roleId==1) window.location.href = 'index.jsp';
        		    						else if(roleId==2) window.location.href = 'organization.jsp';
        		            		    }
        		            		    
        		            		});
											//window.location.href = 'index.jsp';
										});
							} else {
								Ext.MessageBox.alert('消息', '修改失败，请检查密码！');
							}
						}
					})
				} else
					Ext.MessageBox.alert('消息', '两次输入的新密码不一致，请检查！');
			}
		}]
		})
		me.items=[me.form];
		this.callParent();

	}

})