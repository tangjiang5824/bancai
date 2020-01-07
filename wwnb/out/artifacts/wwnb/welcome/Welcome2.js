Ext.define("welcome.Welcome2", {
	extend : "welcome.BaseWelcome",
	items : [ {
		xtype : "panel",
		layout : 'table',
		layoutConfig : {
			columns : 2
		},
		height : 300,
		width : 1000,
		items : [ {
			xtype : "panel",
			title : "数据管理",
			rowspan : 2,
			height : 100,
			margin : '20px 20px 0 20px',
			bodyStyle : 'padding:20px;',
			items : [ {
				xtype : 'button',
				width : 200,
				text : '数据上传',

				style : false,
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('data.UploadData');
					p.add(cmp);
				}
			}, {
				xtype : 'button',
				width : 200,
				margin : '0 0 0 20px',
				text : '历史数据查询',

				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('org.data.uploadRecords');
					p.add(cmp);
				}
			} ]
		} ]
	} ]
});