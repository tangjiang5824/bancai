Ext.define('tax.data.UpData',{
	extend: 'Ext.form.Panel',
	width: 1200,
	height: 700,
	layout: 'fit',
	title: '',
	initComponent: function(){
		itemsPerPage = 50;
		var me = this;
		var upStore = Ext.create('Ext.data.Store', {
			proxy : {
				type : 'ajax',
				url : 'tax/enterprise/getUpData.do',
				reader : {
					type : 'json',
					rootProperty : 'value',
					totalProperty : 'totalCount'
				}
			},
			autoLoad : true
		});
		Ext.Ajax.request({
			url: 'tax/enterprise/getUpData.do',
			params: {
				start : 0,
				limit : 1,
				taxId: me.taxId,
				tableName: me.tableName
			},
			success: function(response) {
				var obj = Ext.decode(response.responseText);
				var data = obj.value;
				var columns = obj.columns;
				var fields = new Array();
				var i = 0;
				for ( var key in data[0]) {
					fields[i] = key;
					i++;
				}
				upStore.setFields(fields);
				var grid = Ext.create('Ext.grid.Panel', {
					columns : columns,
					store : upStore,
					tbar: toolbar,
					viewConfig : {
						enableTextSelection : true
					},
					dockedItems : [ {
						xtype : 'toolbar',
						dock : 'bottom',
						items : [ {
							xtype : 'pagingtoolbar',
							store : upStore, // same store GridPanel is using
							margin : '0 50 0 0',
							displayInfo : true,
							displayMsg : '显示{0}-{1}条，共{2}条',
							emptyMsg : '无数据',
							beforePageText : '第',
							afterPageText : '页，共{0}页'
						} ]
					} ]
				});
				me.add(grid);
				upStore.load({
					params : {
						start : 0,
						limit : itemsPerPage,
						taxId: me.taxId,
						tableName: me.tableName
					}
				});
			},
			failure: function(response) {
				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");

			}
		});
		this.callParent();
	}
})