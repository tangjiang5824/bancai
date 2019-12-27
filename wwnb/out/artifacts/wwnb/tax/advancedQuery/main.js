Ext.define('tax.advancedQuery.main', {
	extend : 'Ext.panel.Panel',
	layout : "center",
	title : '高级查询',
	initComponent : function() {
		var me = this;
		var organization = Ext.create('Ext.form.ComboBox', {
			fieldLabel : '组织名称',
			labelWidth : 60,
			width : 180,
			margin : '0 10 0 0',
			name : 'organizationId',
			matchFieldWidth : false,
			emptyText : "--请选择--",
			displayField : 'name',
			valueField : 'id',
			editable : false,
			onTriggerClick : function() {
				this.expand();
			},
			store : {
				fields : [ 'id', 'name' ],
				proxy : {
					type : 'ajax',
					url : 'organizationList.do',
					reader : {
						type : 'json'
					}
				},
				autoLoad : true

			},
			listeners : {
				'select' : function(combo, records, eOpts) {
					tableNameStore.removeAll();
					Ext.getCmp('advancedQueryTable').reset();
					tableNameStore.load({
						params : {
							organizationId : organization.getValue()
						}
					})
				}
			}

		});
		var tableNameStore = Ext.create('Ext.data.Store', {
			fields : [ 'tableName' ],
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : 'tableNameListById.do',
				reader : {
					type : 'json'
				}
			}
		})
		var tableName = Ext.create('Ext.form.ComboBox', {
			fieldLabel : '数据类型',
			id : 'advancedQueryTable',
			labelWidth : 60,
			width : 400,
			name : 'tableName',
			matchFieldWidth : false,
			emptyText : "--请选择--",
			displayField : 'tableName',
			valueField : 'tableName',
			editable : false,
			onTriggerClick : function() {
				this.expand();
			},
			store : tableNameStore
		});
		var accordion = Ext.create('Ext.form.Panel', {
			// layout: 'fit',
			minHeight : 1000,
			frame : true,// 渲染面板
			autoScroll : true,
			items : [ {
				hidden : true
			} ],
			defaults : {
				bodyStyle : 'padding:15px'
			},
			layout : {
				type : 'accordion',// 类型为折叠
				titleCollapse : true,// 点击title条 就触发折叠/扩展
				animate : true,
				activeOnTop : false
			// 是否扩展面板总是显示在最顶端
			}
		})
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ organization, tableName, {
				text : '自定义查询条件',
				margin : '0 10 0 10',
				handler : function() {
					// var p =Ext.getCmp('functionPanel');
					var id = accordion.items.length;
					if (organization.getValue() == null || tableName.getValue() == null)
						Ext.Msg.alert('提示', '组织名称或数据类型未选中');
					else {
						var grid = Ext.create('tax.advancedQuery.grid', {
							tableName : tableName.getValue(),
							closable : true,
							title : tableName.getValue(),
							// expand: true,
							collapsible : true,
							id : id,
							height : 150
						});
						accordion.add(grid);
					}

				}

			}, {
				text : '查看结果',
				margin : '0 10 0 10',
				handler : function() {
					var id = accordion.items.length;
					var sql = "[";
					for (var i = 1; i < id; i++) {

						var s = new Array();
						var store = Ext.getCmp(i);
						var data = store.getStore().getData();
						data.each(function(rec) {
							s.push(JSON.stringify(rec.data));
						});
						if (i < id - 1)
							sql += '{"tableName":"' + store.title + '","condition":[' + s + ']},';
						else {
							sql += '{"tableName":"' + store.title + '","condition":[' + s + ']}]';
						}
					}
					log(sql)
					var url="showAdvancedQuery.jsp?sql="+encodeURI(sql);
					window.open(url, "_blank");
				}
			}]
		});
		this.items = [ accordion ];
		this.tbar=toolbar;
		this.callParent(arguments);
	}
});