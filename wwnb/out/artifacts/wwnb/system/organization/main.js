Ext.define('system.organization.main',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title: '组织管理',
	initComponent: function(){
		var itemsPerPage = 50; 
		var toobar = Ext.create('Ext.toolbar.Toolbar',{
			items: [{
		    		xtype : 'button',
				text : '添加',
				handler: function(){
					var win = Ext.create('system.organization.add');
					win.show();
				}
			},{
	    		xtype : 'button',
			text : '修改',
			handler: function(){
				var select = Ext.getCmp('organizationMain').getSelectionModel().getSelection();
				if (select.length == 0)
					Ext.Msg.alert('提示', '请选择要修改的数据')
				else
					{   var win = Ext.create('system.organization.edit',{
						organizationId: select[0].get('id'),
						listeners : {
							close : function(panel, eOpts) {
								organizationStore.load({
									params : {
										start : 0,
										limit : itemsPerPage
									}
								});
							}
						}
					});
						win.show();
					}
			}
    },
    {
    		xtype : 'button',
		text : '删除',
		handler: function(){
			var select = Ext.getCmp('organizationMain').getSelectionModel().getSelection();
			if (select.length == 0)
				Ext.Msg.alert('错误', '请选择要删除的数据')
			else
				Ext.Msg.confirm('提示', '确认删除选中的数据吗？',function(choose){
					if(choose=='yes')
						Ext.Ajax.request({
							url:'system/organization/deleteOrganization.do',
							params: {
								id: select[0].get('id')
							},
							success : function(response) {
								var obj=Ext.decode(response.responseText);
								if (obj) {
									Ext.MessageBox.alert("提示", "删除成功！");
									organizationStore.load({
									    params:{
									        start:0,
									        limit: itemsPerPage
									    }
									});
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
    }]
		})
		var organizationStore = Ext.create('Ext.data.Store',{
			id: 'organizationStore',
			autoLoad: true,
			fields: ['id','name','tel','contacts','leadership'],
			pageSize: itemsPerPage, // items per page
			proxy:{	
				url: 'system/organization/listOrganization.do',
				type: 'ajax',
				reader:{
					type : 'json',
					rootProperty: 'value',
					totalProperty: 'totalCount'
					}
				}
		});
		organizationStore.load({
		    params:{
		        start:0,
		        limit: itemsPerPage
		    }
		});
		
		var grid = Ext.create('Ext.grid.Panel',{
							id : 'organizationMain',
				store: organizationStore,
				columns: [
			        { text: '组织代码',  dataIndex: 'id',flex:1},
			        { text: '组织名称', dataIndex: 'name',flex:1},
			        { text: '电话号码', dataIndex: 'tel',flex:1},
			        { text: '联系人', dataIndex: 'contacts',flex:1},
			        { text: '主管领导', dataIndex: 'leadership',flex:1}
			       
			    ],
			    tbar: toobar,
			    dockedItems: [{
			        xtype: 'pagingtoolbar',
			        store: organizationStore,   // same store GridPanel is using
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