Ext.define("welcome.Welcome1", {
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
			title : "数据上传",
			height : 100,
			// width:500,
			bodyStyle : 'padding:20px;',
			margin : '0 20px 0 20px',
			labelAlign : 'right',

			items : [ {
				xtype : 'button',
				width : 200,
				text : '未上传提醒',
				icon : "./extjs/packages/ext-theme-classic/build/resources/images/dd/drop-yes.gif",
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('tax.edit.remind');
					p.add(cmp);
				}
			} ]
		}, {
			xtype : "panel",
			title : "金三数据",
			height : 100,
			bodyStyle : 'padding:20px;',
			// width:500,
			margin : '0 20px 0 20px',
			items : [ {
				xtype : 'button',
				width : 200,
				icon : "./extjs/packages/ext-theme-classic/build/resources/images/dd/drop-yes.gif",
				text : '数据上传',
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('data.UploadData');
					p.add(cmp);
				}
			} ]
		}, {
			xtype : "panel",
			title : "数据查询",
			height : 100,// colspan:1,
			bodyStyle : 'padding:20px;',
			margin : '0 20px 0 20px',
			// width:500,
			items : [ {
				xtype : 'button',
				width : 200,
				icon : "./extjs/packages/ext-theme-classic/build/resources/images/dd/drop-yes.gif",
				text : '高级查询',
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('tax.advancedQuery.main');
					p.add(cmp);
				}
			} ]
		}, {
			xtype : "panel",
			title : "风险发现",
			height : 150,// colspan:1,
			bodyStyle : 'padding:20px;',
			margin : '0 20px 0 20px',
			// width:500,
			items : [ {
				xtype : 'button',
				width : 200,
				margin : '0 0 0 20px',
				icon : "./extjs/packages/ext-theme-classic/build/resources/images/dd/drop-yes.gif",
				text : '风险发现结果',
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('tax.check.resultView');
					p.add(cmp);
				}
			}, {
				xtype : 'button',
				icon : "./extjs/packages/ext-theme-classic/build/resources/images/dd/drop-yes.gif",
				width : 200,
				margin : '20px 0 0 20px',
				text : '手动风险发现',
				handler : function() {
					var p = Ext.getCmp('functionPanel');
					p.removeAll();
					cmp = Ext.create('tax.check.discover');
					p.add(cmp);
				}
			} ]
		} ]
	} ]

});