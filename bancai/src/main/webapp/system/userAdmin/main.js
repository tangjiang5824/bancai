Ext.define('system.userAdmin.main',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title:'用户管理',
	initComponent: function(){
		var itemsPerPage = 50;   // set the number of items you want per page
		var department = Ext.create('Ext.form.ComboBox',{
			fieldLabel : '组织名称',
			labelWidth : 80,
			witdth : 100,
			margin : '0 20 0 0',
			id:'organizationId',
			name : 'organizationId',
			emptyText : "--请选择--",
			displayField : 'name',
			valueField : 'id',
			editable : false,
			allQuery:'',// 默认为空
			forceSelection : true,// 输入值是否严格为待选列表中存在的值。如果输入不存在的值，会自动选择第一个最接近的值。
			triggerAction : 'all',
			onTriggerClick : function() {
				this.expand();
			},
			store:{
				fields : ['id', 'name'],
		        proxy : {
		            type : 'ajax',
		            url : 'organizationList.do',
		            reader : {
		                type : 'json'
		            }
		        },
		        listeners:{  
		        	   load : function(store, records, options ){     
			              store.insert(0,{"id": "a", "name": "不限制"}); // 只添加一行用这个比较方便
		            }  
		        },
		        autoLoad : true
			},
		        listeners:{
				'select' : function(combo, records, eOpts) {
//					alert(Ext.getCmp('organizationId').getValue());
					 userStore.load({
								params : {
									organizationId : Ext.getCmp('organizationId').getValue(),
									 roleId : Ext.getCmp('roleId').getValue()
								}
					 });
				}
			}
		});
		var roleName = Ext.create('Ext.form.ComboBox',{
			id : 'roleId',
			fieldLabel : '用户类型',
			labelWidth : 80,
			witdth : 100,
			margin : '0 20 0 0',
			name : 'roleId',
			emptyText : "--请选择--",
			displayField: 'name',
			valueField: 'id',
			editable : false,
			allQuery:'',// 默认为空
			forceSelection : true,// 输入值是否严格为待选列表中存在的值。如果输入不存在的值，会自动选择第一个最接近的值。
			triggerAction : 'all',
			onTriggerClick : function() {
				this.expand();
			},
			store: {
		            fields : ['id', 'name'],
		            proxy : {
		                type : 'ajax',
		                url : 'roleList.do',
		                reader : {
		                    type : 'json'
		                }
		            },
		            listeners:{  
			            load : function(store, records, options ){      
			                store.insert(0,{"id": "-1", "name": "不限制"}); // 只添加一行用这个比较方便
			            }  
			        },
		            autoLoad : true
		        },
		    listeners: {
		    		select: function(ombo, records, eOpts){
//		    			alert(Ext.getCmp('roleId').getValue())
		    			userStore.load({
								params : {
									organizationId : Ext.getCmp('organizationId').getValue(),
									roleId : Ext.getCmp('roleId').getValue()
								}
							});
		    		}
		    }
	});
		var userStore = Ext.create('Ext.data.Store',{
			 autoLoad: true,
				fields: ['loginName','oranizationName','name','tel','roleName','leadership'],
				pageSize: itemsPerPage, // items per page
				proxy:{	
					url: 'system/userAdmin/listUser.do',
					type: 'ajax',
					reader:{
						type : 'json',
						rootProperty: 'value',
						totalProperty: 'totalCount'
					},
				listeners : {
					
					beforeload : function(store, operation, eOpts) {
						
						store.getProxy().setExtraParams({
							
							 organizationId : Ext.getCmp('organizationId').getValue(),
							 roleId : Ext.getCmp('roleId').getValue()
						});
					}
					}
				}
		 });
		userStore.load({
		    params:{
		    		start: 0,
		        limit: itemsPerPage,
		        organizationId: '',
		        roleId: ''
		    }
		});
		var toobar = Ext.create('Ext.toolbar.Toolbar',{
			items:[{
				xtype : 'button',
				text : '添加',
				handler : function() {
					var add = Ext.create('system.userAdmin.add');
					var win  =Ext.create('Ext.window.Window',{
//						    layout : 'form',  
						    width : 420,  
						    closable : true,  
						    bodyStyle : 'padding:5 5 5 5',  
						    title: '添加用户',
						    id: 'addUser',
						    items:[add]
					})
					win.show();
				}
			}, {
				xtype : 'button',
				text : '修改',
				id : 'editUser',
				handler : function() {
					var select = Ext.getCmp('adminMain').getSelectionModel().getSelection();
				    if(select.length==0)
				    		Ext.Msg.alert('错误', '请选择要修改的数据');
				    else
				    		{
					    	var edit = Ext.create('system.userAdmin.edit',{
								loginName: select[0].get('loginName')
							});
						edit.show();
				    		}
				}},
			{
				text : '删除',
				handler : function() {
					var select = Ext.getCmp('adminMain').getSelectionModel().getSelection();
					if (select.length == 0)
						Ext.Msg.alert('错误', '请选择要删除的数据')
					else
						Ext.Msg.confirm('提示', '确认删除选中的数据吗？',function(choose){
							if(choose=='yes')
								Ext.Ajax.request({
									url:'system/userAdmin/deleteUser.do',
									params: {
										loginName: select[0].get('loginName')
									},
									success : function(response) {
										var obj=Ext.decode(response.responseText);
										if (obj) {
											Ext.MessageBox.alert("提示", "删除成功！");
											Ext.getCmp('adminMain').store.load();
										} else {
											Ext.MessageBox.alert("提示", "删除失败！");
										}
									},
									failure : function(response) {
										Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
									}
								});
						})
		
				}
			},{
				xtype : 'button',
				text : '重置密码',
				id : 'resetPassword',
				handler : function() {
					var select = Ext.getCmp('adminMain').getSelectionModel().getSelection();
				    if(select.length==0)
				    		Ext.Msg.alert('错误', '请选择要重置密码的用户');
				    else
				    {
				    	var win = Ext.create('system.userAdmin.resetPassword',{
							loginName: select[0].get('loginName')
						});
				    	win.show();
			    		}
				}},{
					xtype : 'button',
					text : '加密密码',
					id : 'reset',
					handler : function() {
						Ext.Ajax.request({
							url:'system/userAdmin/reset.do',
							params: {
							},
							success : function(response) {
								var obj=Ext.decode(response.responseText);
								if (obj) {
									Ext.MessageBox.alert("提示", "加密成功！");
									Ext.getCmp('adminMain').store.load();
								} else {
									Ext.MessageBox.alert("提示", "加密失败！");
								}
							},
							failure : function(response) {
								Ext.MessageBox.alert("提示", "加密失败！");
							}
						})}
					},department,roleName]
		})
		var grid = Ext.create('Ext.grid.Panel',{
			store: userStore,
			id: 'adminMain',
			columns: [
		        { text: '登录名',  dataIndex: 'loginName',flex:1},
		        { text: '组织名称', dataIndex: 'organizationName',flex:1},
		        { text: '姓名', dataIndex: 'name',flex:1 },	   
		        { text: '电话', dataIndex: 'tel',flex:1 },
		        { text: '用户类型', dataIndex: 'roleName',flex:1 },
		        { text: '主管领导', dataIndex: 'leadership',flex:1 }

		    ],
		    tbar: toobar,
		    dockedItems: [{
		        xtype: 'pagingtoolbar',
		        store: userStore,   // same store GridPanel is using
		        dock: 'bottom',
		        displayInfo: true,
		        displayMsg:'显示{0}-{1}条，共{2}条',  
		        emptyMsg:'无数据' 
		    }]
		});
		this.items = [grid];
		this.callParent();
	}
})