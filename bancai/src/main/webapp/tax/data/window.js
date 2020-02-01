Ext.define('tax.data.window', {
	extend : 'Ext.form.Panel',
	minWidth : 1000,
	minHeight : 600,
	layout : 'fit',
	title : '',
	initComponent : function() {
		var me = this;
		var tableList = Ext.create('Ext.toolbar.Toolbar', {
		items : [ 
			{
			fieldLabel : "表名",
			name: 'tableName',
			xtype : 'textfield',	
			value:tableName,
			width:'30%',
			readonly:true,
			disabled:true
		},{
				fieldLabel : "所属期始",
				name: 'startTime',
				xtype : 'textfield',	
				value:startTime,
				width:'25%',
				readonly:true,
				disabled:true
			},
			{
				fieldLabel : "所属期止",
				name: 'deadline',
				xtype : 'textfield',	
				value:endTime,
				width:'25%',
				readonly:true,
				disabled:true
			},
			{
				text : '导出Excel',
				handler : function() {
					window.location.href = encodeURI('downloadExcelbyID.do?tableName=' + tableName+'&id='+me.id);
				}
			}
		]
	});
		var grid = Ext.create('Ext.grid.Panel', {
			store : me.store,
			//frame : true,
			columns : me.columns,
			autoScroll : true,
			tbar : tableList,
			viewConfig : {
				enableTextSelection : true
			},
			dockedItems : [ {
				xtype : 'toolbar',
				dock : 'bottom',
				items : [ {
					xtype : 'pagingtoolbar',
					store : me.store, // same store GridPanel is using
					dock : 'bottom',
					margin : '0 50 0 0',
					displayInfo : true,
					displayMsg : '显示{0}-{1}条，共{2}条',
					emptyMsg : '无数据',
					beforePageText : '第',
					afterPageText : '页，共{0}页'
				} ]
			} ]

		})
		this.items = [ grid ];
		this.callParent();
	}
})