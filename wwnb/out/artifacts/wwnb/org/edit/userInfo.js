Ext.define('org.edit.userInfo',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title:'修改用户信息',
	initComponent: function(){
		var itemsPerPage = 50;   // set the number of items you want per page
		var userStore = Ext.create('Ext.data.Store',{
			 autoLoad: true,
				fields: ['loginName','oranizationName','name','tel','roleName','leadership'],
				pageSize: itemsPerPage, // items per page
				proxy:{	
					url: 'org/edit/user.do',
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
				text : '修改',
				id : 'editUser',
				handler : function() {
					var select = Ext.getCmp('adminMain').getSelectionModel().getSelection();
				    if(select.length==0)
				    		Ext.Msg.alert('错误', '请选择要修改的数据');
				    else
				    		{
					    	var edit = Ext.create('org.edit.edit',{
								loginName: select[0].get('loginName')
							});
						edit.show();
				    		}
				}}]
		})
		var grid = Ext.create('Ext.grid.Panel',{
			store: userStore,
			id: 'adminMain',
			viewConfig : {
				enableTextSelection : true
			},
			columns: [
		        { text: '登录名',  dataIndex: 'loginName' ,flex:1},
		        { text: '组织名称', dataIndex: 'organizationName',flex:1 },
		        { text: '姓名', dataIndex: 'name' ,flex:1},		  
		        { text: '电话', dataIndex: 'tel' ,flex:1},
		        { text: '用户类型', dataIndex: 'roleName',flex:1 },		    
		        { text: '主管领导', dataIndex: 'leadership' ,flex:1}
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