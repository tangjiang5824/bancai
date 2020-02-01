Ext.define('tax.advancedQuery.grid',{
	extend: 'Ext.grid.Panel',  
	//columnLines: true,
//	preventHeader: true,
//	height: 500,
	selType: 'rowmodel',
	//height: 100%,
	minHeight: 500,
//	plugins: [
//		Ext.create('Ext.grid.plugin.CellEditing', {
//            clicksToEdit: 1
//        })
//	],
	plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    viewConfig : {
		enableTextSelection : true
	},
	initComponent: function(){
		var me = this;
		var searchStore = Ext.create('Ext.data.Store',{
			fields:['cName','compare','condition','columnType'],
			data:[{'cName':'','compare':'','condition': '','columnType': 1}]
		});
		var cNameStore = Ext.create('Ext.data.Store',{
			fields : ['text'],
				       proxy: {
				           type : 'ajax',
				           url: 'system/dataTable/get.do',
				           extraParams : {
					           tableName: me.tableName
					       },
					       reader : {
					           type : 'json',
					           rootProperty: 'value'
					       }
				       },
				       autoLoad: true
		})
		me.store = searchStore;
		var compare=Ext.create('Ext.form.ComboBox',{
//				id:'compareId'+me.id+''+me.getStore().getCount(),
				onTriggerClick : function() {
					var select = Ext.getCmp(me.id).getSelection();
					var columnType=select[0].get("columnType");
	        	  		var c1=[
	    	  			{"id":"=","name":"等于"},
	    	  			{"id":">", "name":"大于"},
	    	  			{"id":"<", "name":"小于"},
	    	  			{"id":">=", "name":"大于或等于"},
	    	  			{"id":"<=", "name":"小于或等于"}]
		    	  		var c2=[
		    	  			{"id":"=", "name":"等于"},
		    	  			{"id":"like", "name":"近似"}]
	        	  		if(columnType==0){
	        	  			compare.getStore().setData(c1)
	        	  		}else{
	        	  			compare.getStore().setData(c2);
	        	  		}
					this.expand();
				},
				store : {
		             fields : ['id', 'name'],
		             data : [
		                 {"id":"=", "name":"等于"},
		                 {"id":"like", "name":"近似"}
		                ]
		         },
			  displayField: 'name',
			  valueField: 'id',
			  editable: false,
	          allowBlank:false
		});
		me.columns = [{
				'text': '字段类型',
				'dataIndex': 'columnType',
				 width: 300,
				 name: 'columnType',
				 renderer : function(value) {
					 return value == 1 ? '文本' : '数字';
					},
				 editor: {
					 xtype: 'combo',
//					 id: 'columnTypeId'+me.id,
						store : {
				             fields : ['id', 'name'],
				             data : [
				                 {"id": 1, "name":"文本"},
				                 {"id": 0, "name":"数字"}
				                ]
				         },
					  displayField: 'name',
					  valueField: 'id',
					  editable: false,
			          allowBlank:false,
			          listeners:{
			        	  	change: function(com,newValue,oldValue){
			        	  		//var select = Ext.getCmp(me.id).getSelection();
//			        	  		var store=me.getStore();
//			        	  		log(me.id+''+me.getStore().getCount())
//			        	  		var index=store.indexOf(select[0])+1;
//			        	  		var c=Ext.getCmp('compareId'+me.id+''+index);
			        	  		//var columnType=me.getTabIndex();//Ext.getCmp('columnTypeId'+me.id);
//			        	  		log(me)
//			        	  		var c1=[
//			        	  			{"id":"=","name":"等于"},
//			        	  			{"id":">", "name":"大于"},
//			        	  			{"id":"<", "name":"小于"},
//			        	  			{"id":">=", "name":"大于或等于"},
//			        	  			{"id":"<=", "name":"小于或等于"}]
//			        	  		var c2=[
//			        	  			{"id":"=", "name":"等于"},
//			        	  			{"id":"like", "name":"近似"}]
//			        	  		log(newValue);
//			        	  		if(newValue==0){
//			        	  			var c = Ext.create('Ext.form.ComboBox',{
//				        	  			onTriggerClick : function() {
//				        					this.expand();
//				        				},
//				        				store : {
//				        		             fields : ['id', 'name'],
//				        		             data : c1
//				        		         },
//				        			  displayField: 'name',
//				        			  valueField: 'id',
//				        			  editable: false,
//				        	          allowBlank:false
//				        	  		});
//			        	  			Ext.getCmp('compare').setEditor(c);
////			        	  			compare.getStore().loadData(c1);
//			        	  		}else if(newValue==1){
//			        	  			var c = Ext.create('Ext.form.ComboBox',{
//				        	  			onTriggerClick : function() {
//				        					this.expand();
//				        				},
//				        				store : {
//				        		             fields : ['id', 'name'],
//				        		             data : c2
//				        		         },
//				        			  displayField: 'name',
//				        			  valueField: 'id',
//				        			  editable: false,
//				        	          allowBlank:false
//				        	  		});
//			        	  			Ext.getCmp('compare').setEditor(c);
////			        	  			compare.getStore().loadData(c2);
//			        	  		}
			        	  	}
			          }
			          
				 }
			},{
			   'text': '字段名',
			   'dataIndex':'cName',
			   width: 300,
			   name: 'cName',
			   editable: false,
			   editor: {//文本字段
				   xtype: 'combo',
				   store: cNameStore,
				   editable: false,
				   displayField: 'text',
				   valueField: 'text',
				   allowBlank:false,
				   onTriggerClick : function() {
						this.expand();
				   }
		        }
			   },
			   {
			     xtype: 'gridcolumn',
			     'text': '比较符',
			     'dataIndex':'compare',
			     name: 'compare',
			     id: 'compare',
			     width: 300,
			     renderer : function(value) {
			    	 		if(value=="="){
			    	 			return '等于';
			    	 		}else if(value==">"){
			    	 			return '大于';
			    	 		}else if(value=="<"){
			    	 			return '小于';
			    	 		}else if(value==">="){
			    	 			return '大于或等于';
			    	 		}else if(value=="<="){
			    	 			return '小于或等于';
			    	 		}else if(value=="like"){
			    	 			return '近似';
			    	 		}
						
					},
			     editor: compare
			   },
			   {
				   //xtype: '',
				   'text': '条件值',
				   'dataIndex':'condition',
				   width: 300,
				   editor: {
					   xtype: 'textfield'
					   
				   }
				   } 
			  ];
		me.dockedItems= [{
			 xtype: 'toolbar',
	         dock: 'top',
	         items: [{
	        	 	 xtype: 'button',
	             iconAlign: 'center',
	             margin: '0 20 0 0',
	             iconCls:'rukuicon ',
	             text: '添加查询条件',
	             handler:function(){  
//	            	 alert(me.tableName);
	            	 var data=[{               		
	            		 'cName': "",
	            		 'compare': '',
	            		 'condition': '',
	            		 'columnType': 1
	            		 }];
	            	 searchStore.loadData(data,true);
	            	
	                 }  
	         },{
	        	 	 xtype: 'button',
	             iconAlign: 'center',
	             iconCls:'rukuicon ',
	             text: '删除查询条件',
	             handler:function(){  
	            	 var select = me.getSelection();
	            	 if(select.length==0)
				    		Ext.Msg.alert('错误', '请选择要删除的记录')
				 else{
					 searchStore.removeAt(me.getStore().indexOf(select[0]))
				 }
	            	// store.loadData(data,true);
	            	
	                 }  
	         }]
		}];
		this.callParent(arguments);
	}
})