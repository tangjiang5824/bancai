Ext.define('tax.enterprise.window',{
	extend: 'Ext.form.Panel',
	width: 1200,
	height: 700,
	layout: 'fit',
	title: '',
	initComponent: function(){
		var me = this;
		var gold = Ext.create('Ext.grid.Panel',{
			store: {
	            fields : [ 'tableName'],
	            proxy : {
	                type : 'ajax',
//	                url : 'tax/enterprise/getGoldTables.do',
//	                extraParams : {
//	                    taxId: me.taxId
//	                },
	                url : 'tax/enterprise/listTables.do',
	                extraParams : {
	                	 type: 1
	                },
	                reader : {
	                    type : 'json',
	                    	rootProperty: 'value'
	                }
	            },
	            autoLoad : true
	        },
	        viewConfig : {
				enableTextSelection : true
			},
	        frame: true,
			columns: [{text: '表名',dataIndex: 'tableName',width: 500},
					  {text: '查看',width: 200,align:"center",
							  renderer:function(value,cellmeta){
						            var returnStr = "<INPUT type='button' value='查看数据' style='width: 120px; height: 110px;'>";
						            return returnStr;
						          }
					  }],
			autoScroll : true,
			listeners: {
				cellClick: function(thisTab, td, cellIndex,record,tr,rowIndex,event,eventObj) {
					if(cellIndex==1){//设置按钮列
	        			var tableName=this.getStore().getAt(rowIndex).data.tableName
						var panel = Ext.create('tax.data.UpData',{
							taxId: me.taxId,
							tableName: tableName
						});
						var win = Ext.create('Ext.window.Window',{
							items: [panel],
							layout: 'fit'
						});
						win.show();
	            }
		        },
				'rowdblclick': function(grid,rowIndex){
					var select = grid.getSelectionModel().getSelection();
					var panel = Ext.create('tax.data.UpData',{
						taxId: me.taxId,
						tableName: select[0].get('tableName')
					});
					var win = Ext.create('Ext.window.Window',{
						items: [panel],
						layout: 'fit'
					});
					win.show();
				}
			}
		})
		var up = Ext.create('Ext.grid.Panel',{
			store: {
	            fields : [ 'tableName'],
	            proxy : {
	                type : 'ajax',
//	                url : 'tax/enterprise/getUpTables.do',
//	                extraParams : {
//	                    taxId: me.taxId
//	                },
	                url : 'tax/enterprise/listTables.do',
	                extraParams : {
	                	 type: 0
	                },
	                reader : {
	                    type : 'json',
	                    	rootProperty: 'value'
	                }
	            },
	            autoLoad : true
	        },
	        frame: true,
	        viewConfig : {
				enableTextSelection : true
			},
			columns: [{text: '表名',dataIndex: 'tableName',width: 500},
					  {text: '查看',width: 200,align:"center",
						  renderer:function(value,cellmeta){
					            var returnStr = "<INPUT type='button' value='查看数据' style='width: 120px; height: 110px;'>";
					            return returnStr;
					          }
				  }],
			autoScroll : true,
			listeners: {
				cellClick: function(thisTab, td, cellIndex,record,tr,rowIndex,event,eventObj) {
					if(cellIndex==1){//设置按钮列
	        				var tableName=this.getStore().getAt(rowIndex).data.tableName
						var panel = Ext.create('tax.data.UpData',{
							taxId: me.taxId,
							tableName: tableName
						});
						var win = Ext.create('Ext.window.Window',{
							items: [panel],
							layout: 'fit'
						});
						win.show();
	            }
		        },
				'rowdblclick': function(grid,rowIndex){
					var select = up.getSelectionModel().getSelection();
					var panel = Ext.create('tax.data.UpData',{
						taxId: me.taxId,
						tableName: select[0].get('tableName')
					});
					var win = Ext.create('Ext.window.Window',{
						items: [panel],
						layout: 'fit'
					});
					win.show();
				}
			}
		})
		var tab = Ext.create('Ext.tab.Panel', {
			layout:'border',
		    items: [
		        {
		        		layout: 'fit',
		            title: '金三数据',
		            items: [gold]
		        },
		        {
		        		layout: 'fit',
		            title: '上传数据',
		            items: [up]
		        }
		    ]
		});
		this.items = [tab];
		this.callParent();
	}
})