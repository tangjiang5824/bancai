Ext.define('tax.edit.manualInput', {
	extend : 'Ext.window.Window',
	title : '手动录入纳税识别号',
	width : 500,
	height : 200,
	layout : 'form',
	initComponent : function() {
		var me = this;
		var form = Ext.create('Ext.form.Panel', {

			items : [{
						xtype : 'textfield',
						fieldLabel : "纳税人名称",
						name : 'name',
						margin : '20 50 20 50',
						readOnly : true,
						value : me.name
					}, {
						xtype : 'textfield',
						id : 'code',
						name : 'code',
						fieldLabel : "纳税人识别号",
						margin : '30 50 0 50'
					}],

			buttons : [{
				text : '确定',
				handler : function() {
					Ext.Ajax.request({
						url : 'tax/edit/manualInputCode.do',
						params : {
							id : me.id,
							tableName : me.tableName,
							taxName : me.taxName,
							uploadId : me.uploadId,
							taxCode : me.taxCode,
							name:me.name,
							code : Ext.getCmp('code').getValue()

						},
						success : function(response) {
							Ext.Msg.alert('消息', '更新成功！');
							me.close();
						},
						failure : function(response) {
							Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
						}
					})

				}
			}]
		});
		this.items = [form];
		this.callParent(arguments);
	}
})