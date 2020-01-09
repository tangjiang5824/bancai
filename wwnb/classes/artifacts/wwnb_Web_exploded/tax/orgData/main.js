Ext.define('tax.orgData.main',{
	extend: 'Ext.panel.Panel',
	layout:'fit',
	autoScroll: true,
	id:'checkdatapanel',
	initComponent: function(){
		var itemsPerPage = 50; 
		var me=this;
		var tableListStore = Ext.create('Ext.data.Store',{
			fields : [ 'tableName'],
            proxy : {
                type : 'ajax',
                url : 'tableNameListById.do',
                extraParams : {
                    organizationId: me.organizationId
                },
                reader : {
                    type : 'json'
                }
            },
            autoLoad : true
			
		});
		tableListStore.on("load", function(){
			var defaultYear=tableListStore.getAt(0).get('tableName');
//			    alert(defaultYear);//得到第一条数据
			tableList.setValue(defaultYear);
			Ext.Ajax.request({
				url: 'system/dataTable/getColumnsAndFields.do',
				params:{
					tableName:defaultYear
				},
				success:function(response)
				{
					var obj=Ext.decode(response.responseText);
					var oldFields = JSON.stringify(obj.fields).replace('[','').replace(']','');
					var oldColumns=JSON.stringify(obj.columns).replace('[','').replace(']','');
					var newFilds='["所属期","批次",'+oldFields+']';
					var newColumns='[{"text":"所属期始","dataIndex":"startTime",width: 100},{"text":"所属期止","dataIndex":"endTime",width: 100},{"text":"批号","dataIndex":"batchNo",width: 100},'+oldColumns+']'
					console.log(Ext.decode(newFilds))
					var columns=Ext.decode(newColumns)
					var tmp1=columns[0];
					columns[0]=columns[3];
					var tmp2=columns[1];
					columns[1]=tmp1;
					tmp1=columns[2];
					columns[2]=tmp2;
					columns[3]=tmp1;
					console.log(columns)
					var tableDataStore = Ext.create('Ext.data.Store',{
						pageSize: itemsPerPage,
						fields: Ext.decode(newFilds),
						proxy: {
							type: 'ajax',
							url: 'listTableData.do',
							extraParams : {

								tableName: defaultYear,
								begintime:  Ext.util.Format.date(Ext.getCmp('checkdatabegintime').getValue(), 'Y-m'),
								deadline : Ext.util.Format.date(Ext.getCmp('checkdatadeadline').getValue(), 'Y-m')
							},
							reader: {
								type: 'json',
								rootProperty: 'value',
								totalProperty: 'totalCount'
							}
						},
						autoLoad: true
					});
					var oldgrid=Ext.getCmp('checkdataGrid');
					if(oldgrid!=null)
						me.remove(oldgrid);
					var grid = Ext.create('Ext.grid.Panel',{
						id: 'checkdataGrid',
						store: tableDataStore,
						viewConfig : {
							enableTextSelection : true
						},
						//tbar: toobar,
						columns: columns,//obj.columns,
						dockedItems: [{
							xtype: 'pagingtoolbar',
							store: tableDataStore,   // same store GridPanel is using
							dock: 'bottom',
							displayInfo: true,
							displayMsg:'显示{0}-{1}条，共{2}条',  
							emptyMsg:'无数据' 
						}]
					});
					me.add(grid);
				},
				failure: function(form, action) {
					Ext.Msg.alert('消息', '查询失败');
				}

			});
			});
	
		var tableList = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '数据类型',
			labelWidth : 60,
			width : 400,
			id :  'tableName',
			name : 'tableName',
			matchFieldWidth: false,
			emptyText : "--请选择--",
			displayField: 'tableName',
			valueField: 'tableName',
			editable : false,
			/*onTriggerClick : function() {
				this.expand();
			},*/
			store: tableListStore
		      
		}); 

		var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
			items:[
						tableList,
						{
							xtype: 'monthfield',
							margin : '0 10 0 0',
							fieldLabel: '所属期始',
							width: 180,
							labelWidth: 60,
							name: 'begintime',
							id: 'checkdatabegintime',
							format: 'Y-m',
							value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-12),"Y-m")  
							//maxValue: new Date()  // limited to the current date or prior
						}, {
							xtype: 'monthfield',
							fieldLabel: '所属期止',
							labelWidth: 60,
							width: 180,
							margin : '0 10 0 0',
							name: 'deadline',
							id: 'checkdatadeadline',
							format: 'Y-m',
							value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,0),"Y-m")  
							//value: new Date()  // defaults to today
						},
						{
							xtype: 'button',
							text: '查询',
							margin : '0 10 0 0',
							handler: function(){
									Ext.Ajax.request({
										url: 'system/dataTable/getColumnsAndFields.do',
										params:{
											tableName:tableList.getValue()
										},
										success:function(response)
										{
											var obj=Ext.decode(response.responseText);
											var oldFields = JSON.stringify(obj.fields).replace('[','').replace(']','');
											var oldColumns=JSON.stringify(obj.columns).replace('[','').replace(']','');
											var newFields='["所属期","批次",'+oldFields+']';
											var newColumns='[{"text":"所属期始","dataIndex":"startTime",width: 100},{"text":"所属期止","dataIndex":"endTime",width: 100},{"text":"批号","dataIndex":"batchNo",width: 100},'+oldColumns+']'
											console.log(Ext.decode(newFields))
											var columns=Ext.decode(newColumns)
											var tmp1=columns[0];
											columns[0]=columns[3];
											var tmp2=columns[1];
											columns[1]=tmp1;
											tmp1=columns[2];
											columns[2]=tmp2;
											columns[3]=tmp1;
											console.log(columns)
											var tableDataStore = Ext.create('Ext.data.Store',{
												pageSize: itemsPerPage,
												fields: Ext.decode(newFields),
												proxy: {
													type: 'ajax',
													url: 'listTableData.do',
													extraParams : {
														tableName: tableList.getValue(),
														begintime:  Ext.util.Format.date(Ext.getCmp('checkdatabegintime').getValue(), 'Y-m'),
														deadline : Ext.util.Format.date(Ext.getCmp('checkdatadeadline').getValue(), 'Y-m')
													},
													reader: {
														type: 'json',
														rootProperty: 'value',
														totalProperty: 'totalCount'
													}
												},
												autoLoad: true
											});
											var oldgrid=Ext.getCmp('checkdataGrid');
											if(oldgrid!=null)
												me.remove(oldgrid);
											var grid = Ext.create('Ext.grid.Panel',{
												id: 'checkdataGrid',
												store: tableDataStore,
												viewConfig : {
													enableTextSelection : true
												},
												//tbar: toobar,
												columns: columns,
												dockedItems: [{
													xtype: 'pagingtoolbar',
													store: tableDataStore,   // same store GridPanel is using
													dock: 'bottom',
													displayInfo: true,
													displayMsg:'显示{0}-{1}条，共{2}条',  
													emptyMsg:'无数据' 
												}]
											});
											me.add(grid);
										},
										failure: function(form, action) {
											Ext.Msg.alert('消息', '查询失败');
										}
					
									});
									
//								}
							}
						},{
							id : 'downExcelButton',
							text : "导出Excel",
							handler : function() {
								var ww=Ext.getCmp('tableName').getValue();
                                var gedt=Ext.util.Format.date(Ext.getCmp('checkdatabegintime').getValue(), 'Y-m');
                                var gedd=Ext.util.Format.date(Ext.getCmp('checkdatadeadline').getValue(), 'Y-m');
//								window.location.href = encodeURI('downloadExcelbyTime.do?tableName=' +tt+'&begintime='+ww+'&deadline='+ee);
								window.location.href = encodeURI('downloadExcelbyTime.do?tableName=' +ww+'&begintime='+gedt+'&deadline='+gedd);

							}
						}
				]
		});
		this.tbar=toolbar;
		this.callParent(arguments);
	

	}

})