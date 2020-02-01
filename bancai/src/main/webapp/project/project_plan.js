
Ext.define('project.project_plan', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : "fit",
	title : '项目立项',
	requires : [ 'component.TableList', "component.YearList" ],
	reloadPage : function() {
		var p = Ext.getCmp('functionPanel');
		p.removeAll();
		cmp = Ext.create("data.UploadDataTest");
		p.add(cmp);
	},
	clearGrid : function() {
		var msgGrid = Ext.getCmp("msgGrid");
		if (msgGrid != null || msgGrid != undefined)
			this.remove(msgGrid);
	},

	initComponent : function() {
		var me = this;
		//定义表名,计划清单
		var tableName="planList";
		//var materialtype="0";


        //卡点名称
		// var nameStore = new Ext.data.Store({
		// 	proxy: new Ext.data.HttpProxy({
		// 		url: jt.webContextRoot+'productionOfEvidence/findZhanDianName.action' }),
		// 	reader: new Ext.data.JsonReader(
		// 		{ nameList: "" },        //后台获得的数据，传给前台的数据集合
		// 		["zhandianName"]         //json字符串的key
		// 	)
		// });
		// nameStore.load();
        // //下拉框
		// var zhandianName= new Ext.form.ComboBox({
		// 	fieldLabel: "站点名称",
		// 	name: 'zhandianName',
		// 	id: 'zhandianName',
		// 	displayField: 'zhandianName',   //显示的字段
		// 	triggerAction: 'all',
		// 	store: nameStore,
		// 	mode: 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		// 	editable: false,
		// 	anchor: '100%',
		// });


		var toobar = Ext.create('Ext.toolbar.Toolbar',{
			items: [
				{
					xtype: 'textfield',
					margin : '0 10 0 0',
					fieldLabel: '项目名',
					id :'projectName',
					width: 180,
					labelWidth: 60,
					name: 'projectName',
					value:"",

				},
				{
					xtype : 'monthfield',
					margin : '0 10 0 0',
					fieldLabel : '开始时间',
					width : 180,
					labelWidth : 60,
					id : "starttime",
					name : 'starttime',
					//align: 'right',
					format : 'Y-m',
					editable : false,
					value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
				},]
		});
		var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
			dock : "top",
			items : [{
				xtype : 'button',
				iconAlign : 'center',
				iconCls : 'rukuicon ',
				text : '添加表项',
				handler : function() {
					//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
					var data = [{

						'长' : '',
						'类型' : '',
						'宽' : '',
						'数量' : '',

					}];
					//Ext.getCmp('addDataGrid')返回定义的对象
					Ext.getCmp('addDataGrid').getStore().loadData(data,
						true);

				}

			},{
				xtype : 'button',
				iconAlign : 'center',
				iconCls : 'rukuicon ',
				text : '添加字段名',
				// handler : function() {
				// 	//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
				// 	var data = [{
				// 		'品号' : '',
				// 		'长' : '',
				// 		'类型' : '',
				// 		'宽' : '',
				// 	}];
				// 	//Ext.getCmp('addDataGrid')返回定义的对象
				// 	Ext.getCmp('addDataGrid').getStore().loadData(data,
				// 		true);
				//
				// }

			},
			// 	{
			// 	xtype : 'button',
			// 	iconAlign : 'center',
			// 	iconCls : 'rukuicon ',
			// 	text : '保存',
			//
			// 	handler : function() {
			// 		// 取出grid的字段名字段类型
			// 		//var userid="<%=session.getAttribute('userid')%>";
			// 		var select = Ext.getCmp('addDataGrid').getStore()
			// 			.getData();
			// 		var s = new Array();
			// 		select.each(function(rec) {
			// 			//delete rec.data.id;
			// 			s.push(JSON.stringify(rec.data));
			// 			//alert(JSON.stringify(rec.data));//获得表格中的数据
			// 		});
			// 		//alert(s);//数组s存放表格中的数据，每条数据以json格式存放
			//
			// 		Ext.Ajax.request({
			// 			url : 'addData.do', //HandleDataController
			// 			method:'POST',
			// 			//submitEmptyText : false,
			// 			params : {
			// 				tableName:tableName,
			// 				materialType:materialtype,
			// 				s : "[" + s + "]",
			// 			},
			// 			success : function(response) {
			// 				Ext.MessageBox.alert("提示", "保存成功！");
			// 				me.close();
			//
			// 			},
			// 			failure : function(response) {
			// 				Ext.MessageBox.alert("提示", "保存失败！");
			// 			}
			// 		});
			//
			// 	}
			// }
			]
		});
		var grid = Ext.create("Ext.grid.Panel", {
			id : 'addDataGrid',
			dockedItems : [toolbar2],
			store : {
				fields: ['长',"类型","宽",'数量']
//				fields : ['fieldName', 'fieldType', 'taxUnitCode',
//						'taxUnitName', 'isNull', 'fieldCheck', 'width']
			},
			columns : [ {
				dataIndex : '长',
				text : '长',
				width : 150,
				editor : {// 文本字段
					xtype : 'textfield',
					allowBlank : false,

				}

			}, {
				dataIndex : '类型',
				text : '类型',
				width : 150,
				editor : {// 文本字段
					xtype : 'textfield',
					allowBlank : false,

				}

			},{
				dataIndex : '宽',
				text : '宽',
				width : 150,
				editor : {// 文本字段
					xtype : 'textfield',
					allowBlank : false,
				}
			},
			{
				dataIndex : '数量',
				text : '数量',
				width : 150,
				editor : {// 文本字段
					xtype : 'textfield',
					allowBlank : false,
				}
			}
			],
			viewConfig : {
				plugins : {
					ptype : "gridviewdragdrop",
					dragText : "可用鼠标拖拽进行上下排序"
				}
			},
			plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			})],
			selType : 'rowmodel',
		});

		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			id : "toolbar2",
			items : [  {
				xtype: 'displayfield',
				margin : '0 10 0 0',
				fieldLabel: '计划清单',
				id :'planList',
				//labelWidth: 60,
			}]
		});

		var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "bottom",
			id : "toolbar3",
			//style:{float:'center',},
			//margin-right: '2px',
			//padding: '0 0 0 750',
			style:{
				//marginLeft: '900px'
				layout: 'right'
			},
			items : [{
				xtype : 'button',
				iconAlign : 'center',
				iconCls : 'rukuicon ',
				text : '创建',
				region:'center',
				bodyStyle: 'background:#fff;',
				handler : function() {
					// 取出grid的字段名字段类型
					//var userid="<%=session.getAttribute('userid')%>";
					var select = Ext.getCmp('addDataGrid').getStore()
						.getData();
					var s = new Array();
					select.each(function(rec) {
						//delete rec.data.id;
						s.push(JSON.stringify(rec.data));
					});

					//获取时间
					var sTime=Ext.Date.format(Ext.getCmp('starttime').getValue(), 'Y-m-d H:i:s');
					Ext.Ajax.request({
						url : 'generateproduct.do', //createProject.do
						method:'POST',
						//submitEmptyText : false,

						params : {
							//tableName:tableName,
							//materialType:materialtype,
							startTime:sTime,
							projectName:Ext.getCmp('projectName').getValue(),
							s : "[" + s + "]",
						},
						success : function(response) {
							Ext.MessageBox.alert("提示", "创建成功！");
							me.close();
						},
						failure : function(response) {
							Ext.MessageBox.alert("提示", "创建失败，重新输入产品类型！");
						}
					});

				}
			}]
		});

		this.dockedItems = [toobar,toolbar2,grid,toolbar3];
		//this.items = [ me.grid ];
		this.callParent(arguments);

	}

})

