Ext.define('tax.check.discover',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout : 'fit',
	id:"discoveryPanel",
	title: '手动风险发现',
	initComponent : function() {
		var itemsPerPage = 50;
		var me = this;
		var tablesFieldsAndColumns = Ext
				.create("tax.check.TablesFieldsAndColumns");
		var standards = tablesFieldsAndColumns.getStandards();
		var tableList = Ext.create('Ext.form.ComboBox', {
			// id : 'tableName',
			fieldLabel : '校验标准',
			labelWidth : 60,
			width : 350,
			name : 'standard',
			id : 'standard',
			emptyText : "--请选择--",
			displayField : 'standard',
			valueField : 'standard',
			editable : false,
			onTriggerClick : function() {
				this.expand();
			},
			store : {
				fields : ["standard"],
				data : standards
			},
			listeners : {
				change : function(comb, newValue, oldValue, eOpts) {
					var discoveryGrid=Ext.getCmp('discoveryGrid');
					if(discoveryGrid!=null)
						me.remove(discoveryGrid);
					var standard=newValue;
					var resultStore = Ext.create('Ext.data.Store', {
								id : "resultStore",
								fields:tablesFieldsAndColumns.getFields(standard),
								proxy : {
									type : 'ajax',
									url : 'tax/check/manualRiskDiscovery.do',
									reader : {
										type : 'json',
										rootProperty : 'value',
										totalProperty : 'totalCount'
									}
								},
								autoLoad : true,
								listeners : {
									beforeload : function(store, operation,
											eOpts) {
										store.getProxy().setExtraParams({
											standard : tableList.getValue(),
		    	    						startTime: Ext.Date.format(Ext.getCmp('startTime').getValue(),'Y-m'),
		    	    						endTime : Ext.Date.format(Ext.getCmp('endTime').getValue(),'Y-m')
										});
									}
								}

							});
					var columns=tablesFieldsAndColumns.getManualResultColumns(standard);
					//var newcolumns=tablesFieldsAndColumns.getManualResult(columns);
					log(columns+"discover");
					discoveryGrid = Ext.create("Ext.grid.Panel", {
								autoScroll:true,
								viewConfig : {
									enableTextSelection : true
								},
								id : "discoveryGrid",
								store : resultStore,
								columns:columns,
								dockedItems : [{
											xtype : 'pagingtoolbar',
											store : resultStore,
											dock : 'bottom',
											displayInfo : true,
											displayMsg : '显示{0}-{1}条，共{2}条',
											emptyMsg : '无数据'
										}]

							});
					
					me.add(discoveryGrid);
				}
			}
		});

		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
					items : [tableList, {
						xtype : 'monthfield',
						margin : '0 10 0 0',
						fieldLabel : '所属期起',
						width : 180,
						labelWidth : 60,
						name : 'startTime',
						id : 'startTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, -12), "Y-m")
					}, {
						xtype : 'monthfield',
						fieldLabel : '所属期止',
						labelSeparator : '',
						labelWidth : 60,
						width : 180,
						margin : '0 10 0 10',
						name : 'endTime',
						id : 'endTime',
						format : 'Y-m',
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, 0), "Y-m")
					}, {
						xtype : 'button',
						text : '校验',
						margin : '0 10 0 0',
						handler : function() {
							var discoveryGrid=Ext.getCmp("discoveryGrid");
							if(discoveryGrid!=null)
							{
								discoveryGrid.getStore().load();
							}
						}
					}]
				});
		this.tbar = toolbar;
		this.callParent(arguments);

	}

})