Ext.define('tax.edit.uploadRecords',{
	extend:'Ext.panel.Panel',
	region: 'center',
	layout:'fit',
	title:'上传记录',
	initComponent: function(){
		var itemsPerPage = 50;   // set the number of items you want per page
		var userStore = Ext.create('Ext.data.Store',{
			 autoLoad: true,
			 fields: ['tableName','name',{name : 'uploadTime',
					type : 'date',
					mapping : 'uploadTime',
					dateFormat : 'time'},'startTime','endTime','state'],				
				proxy:{	
					url: 'tax/edit/uploadRecords.do',
					type: 'ajax',
					reader:{
						type : 'json',
						rootProperty: 'value',
						totalProperty: 'totalCount'
					},
					params:{
			    		start: 0,
			    		limit: itemsPerPage
			    }
				}
		 });
		
		
		var OneCombo = Ext.create('Ext.form.ComboBox', {
			store : {
	             fields : ['state', 'name'],
	             data : [
	                 
	                 {"state":"0", "name":"上传失败"},
	                 {"state":"1", "name":"上传成功"},
	                 {"state":"2", "name":"上传成功并已匹配"},
	                 {"state":"3", "name":"已进行风险发现"},
	                 {"state":"4", "name":"上传成功但已删除"},
	                 {"state":"5", "name":"当期无数据"}
	                ]
	         },
			displayField: 'name',
			valueField:  'state',
			
			editable: false
		});
		getOneDisplay = function(value, meta, record) {
		    var rowIndex = OneCombo.store.find("state", "" + value);
		    if (rowIndex < 0)
		    return '';
		    var record = OneCombo.store.getAt(rowIndex);
		    return record ? record.get('name') : '';
		}
		var grid = Ext.create('Ext.grid.Panel',{
			store: userStore,
			id: 'adminMain',
			viewConfig : {
				enableTextSelection : true
			},
			columns: [
 		        { text: '表名', dataIndex: 'tableName',width: 200 },
 		        { text: ' 上传方', dataIndex: 'name',width: 200 },
 		       { text: '上传时间', dataIndex: 'uploadTime', width: 200,
		        	sortable : true,renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        },
		        { text: '所属期起', dataIndex: 'startTime' ,width: 200},
		        { text: '所属期止', dataIndex: 'endTime' ,width: 150},
		        {
					
					dataIndex:'state',
					name:'state',
				    text: '状态',
				    flex :1,
				    editor : OneCombo,
				    renderer : getOneDisplay
				}
		    ],
		    dockedItems: [{
		        xtype: 'pagingtoolbar',
		        store: userStore,   // same store GridPanel is using
		        dock: 'bottom',
		        displayInfo: true,
		        displayMsg:'共{2}条',  
		        emptyMsg:'无数据' 
		    }]
		});
		this.items = [grid];
		this.callParent();
	}
})