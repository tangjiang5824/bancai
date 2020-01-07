Ext.define('tax.columnQuery.Main', {
			extend : 'Ext.panel.Panel',
			title : '按字段名查询',
			initComponent : function() {
				var column = Ext.create('Ext.form.ComboBox', {
							fieldLabel : '字段名称',
							labelWidth : 60,
							width : 280,
							margin : '0 10 0 0',
							id : 'columnName',
							matchFieldWidth : false,
							emptyText : "请输入你想查询的内容",
							displayField : 'text',
							valueField : 'text',
							editable : true,
							queryMode : 'local',
							onTriggerClick : function() {
								this.expand();
							},
							store : {
								fields : ['text'],
								proxy : {
									type : 'ajax',
									url : 'dataSearch/getAllColumnsName.do',
									reader : {
										type : 'json'
									}
								},
								autoLoad : true

							}
						});
				var condition = Ext.create('Ext.form.ComboBox', {
							fieldLabel : '比较符',
							labelWidth : 60,
							width : 180,
							margin : '0 10 0 0',
							id : 'compareName',
							matchFieldWidth : false,
							emptyText : "--请选择--",
							displayField : 'name',
							valueField : 'id',
							editable : false,
							onTriggerClick : function() {
								this.expand();
							},
							store : {
								fields : ['id', 'name'],
								data : [{
											"id" : "=",
											"name" : "等于"
										}, {
											"id" : "like",
											"name" : "近似"
										}]
							}

						});
				var columnType = Ext.create('Ext.form.ComboBox',{
					        fieldLabel : '数据类型',
							labelWidth : 60,
							width : 130,
							margin : '0 10 0 10',
							id : 'columnType',
							matchFieldWidth : false,
							displayField : 'name',
							valueField : 'id',
							value: 1,
							editable : false,
							onTriggerClick : function() {
								this.expand();
							},
							store: {
								fields: ["id","name"],
								data:[{
									"id" : 1,
									"name" : "文本"
								}, {
									"id" : 0,
									"name" : "数字"
								}]
							},
							listeners : {
								select : function(combo, records, eOpts) {
									var c1=[{
											"id": "=",
											"name": "等于"
											},{
												"id" : ">",
												"name" : "大于"
											}, {
												"id" : "<",
												"name" : "小于"
											}, {
												"id" : ">=",
												"name" : "大于或等于"
											}, {
												"id" : "<=",
												"name" : "小于或等于"
										 }];
									var c2=[{
											  "id": "=",
											   "name": "等于"
											},{
												"id" : "like",
												"name" : "近似"
											}]
									if(columnType.getValue()==0){
										condition.getStore().setData(c1);
									}else{
										condition.getStore().setData(c2);
									}
								}
							}
				});
				var toolbar = Ext.create('Ext.toolbar.Toolbar', {
							items : [columnType,column, condition, {
										fieldLabel : "条件值",
										labelWidth : 60,
										width : 250,
										margin : '0 20 0 10',
										xtype : 'textfield',
										id : 'conditionName'
									},{
										xtype: 'button',
										text:'查询',
										handler: function(){
											var columnName=Ext.getCmp('columnName').getValue();
											var compareName=Ext.getCmp('compareName').getValue();
											var columnType=Ext.getCmp('columnType').getValue();
											var conditionName=Ext.getCmp('conditionName').getValue();
											if(columnName==null||compareName==null||conditionName=="")
												Ext.Msg.alert('提示','请选择相应的条件以及输入所要查询的信息！');
											else{
												var url='queryColumnData.jsp?columnName='+columnName+'&columnType='+columnType+'&compareName='+compareName+'&conditionName='+conditionName;
												url=encodeURI(url)
												window.open(url,'_blank')
											}
										}
									}]
						})
				this.items = [toolbar];
				this.callParent();
			}

		})