Ext.define('org.data.UploadZipFiles', {
	extend : 'Ext.form.Panel',
	region : 'center',
	autoScroll : true,
	title : '批量上传',
	id : 'upfilespanel',
	initComponent : function() {
		var me = this;

		var newFieldsCount = 0;

		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				xtype : 'form',
				id : 'upExcels',
				border : false,
				layout : 'column',
				columnWidth : 150,
				items : [ {
					xtype : 'monthfield',
					margin : '0 10 0 0',
					fieldLabel : '所属期起',
					width : 180,
					labelWidth : 60,
					name : 'startTime',
					id : 'checkresultbegintime',
					format : 'Y-m',
					value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -12), "Y-m")
				// maxValue: new Date() // limited to the
				// current date or prior
				}, {
					xtype : 'monthfield',
					fieldLabel : '所属期止',
					labelSeparator : '',
					labelWidth : 60,
					width : 180,
					margin : '0 10 0 10',
					name : 'endTime',
					id : 'checkresultdeadline',
					format : 'Y-m',
					value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, 0), "Y-m")
				// value: new Date() // defaults to today
				}, {

					xtype : 'button',
					text : '添加附件',
					margin : '0 10 0 0',
					handler : function() {
						var fileField = new Ext.form.File({
							name : "newFiles",
							width : 440,
							margin : '10 10 10 10',
							emptyText : '请选择文件',
							fieldLabel : '附件',
							buttonText : '选择文件',
							allowBlank : false
						})
						newFieldsCount++;
						if (newFieldsCount >= 2) {
							Ext.getCmp("upfilespanel").setAutoScroll(true);
						}
						me.add(fileField);
					}

				}, {
					xtype : 'button',
					text : '上传',
					margin : '0 10 0 0',
					// iconCls:'rukuicon ',
					// align: 'left',
					// margin: '0 100 0 0',
					handler : function() {
						var form = Ext.getCmp('upfilespanel').getForm();

						if (form.isValid()) {

							form.submit({
								url : 'org/data/uploadZipFiles.do',

								waitMsg : '正在上传...',
								success : function(form, action) {
									var msg = action.result.msg;
									Ext.Msg.alert('消息', "上传成功！");
								},
								failure : function(form, action) {
									var response = action.result;
									switch (response.errorCode) {
									case 0:
										Ext.MessageBox.alert("错误", "上传失败，请检查文件格式！若无法解决解决问题，请联系管理员！");
										Ext.MessageBox.alert("错误原因", response.msg);
										break;
									default:
										Ext.MessageBox.alert("错误", "服务器异常，请检查网络连接，或者联系管理员");

									}

								}
							});
						}
					}
				} ]
			} ]
		});
		this.items = [ toolbar ];
		this.callParent(arguments);

	}

})