Ext.define('tax.enterpriseQuery.main',{
	extend : 'Ext.panel.Panel',
	title : "一户式查询",
	layout : 'fit',
	initComponent: function(){
		var me = this;
		var itemsPerPage = 50;
		var columns=[
			{ "text": '序号', "xtype": 'rownumberer', "width": 60 }  ,
				{"text":"纳税人名称","dataIndex":"纳税人名称","width":200},
    			 {"text":"社会信用代码(纳税人识别号)","dataIndex":"社会信用代码(纳税人识别号)","width":200},
    			 {"text":"法定代表人（负责人、业主）姓名","dataIndex":"法定代表人（负责人、业主）姓名","width":300},
    			 {"text":"法定代表人（负责人、业主）身份证件号码","dataIndex":"法定代表人（负责人、业主）身份证件号码","width":300},
    		     {"text":"法定代表人（负责人、业主）身份证件种类","dataIndex":"法定代表人（负责人、业主）身份证件种类","width":300},
    			 {"text":"纳税人状态","dataIndex":"纳税人状态","width":200},
    			 {"text":"行业门类[地税]","dataIndex":"行业门类[地税]","width":200},
    			 {"text":"行业大类[地税]","dataIndex":"行业大类[地税]","width":300},
    			 {"text":"行业中类[地税]","dataIndex":"行业中类[地税]","width":300},
    			 {"text":"行业小类[地税]","dataIndex":"行业小类[地税]","width":300},
    		     {"text":"生产经营地址","dataIndex":"生产经营地址","width":200},
    		     {"text":"国地管户类型","dataIndex":"国地管户类型","width":200},
    		     {"text":"主管税务所（科、分局）","dataIndex":"主管税务所（科、分局）","width":250},
			 {"text":"一般纳税人标志","dataIndex":"一般纳税人标志","width":200},
		     {"text":"从业人数","dataIndex":"从业人数","width":200},
		     {"text":"国有投资比例[国税]","dataIndex":"国有投资比例[国税]","width":200}]
		var taxIdField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"税号",
			name: 'taxId',
			labelWidth: 70,
			margin: '0 25 0 0'
			//value: 10
		});
		var taxNameField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"纳税人名称",
			name: 'taxName',
			labelWidth: 80,
			margin: '0 25 0 0'
		});
		var representField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"法人代表",
			name: 'represent',
			labelWidth: 70,
			margin: '0 25 0 0'
		});
		var categoryField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"行业门类",
			name: 'category',
			labelWidth: 70,
			margin: '0 25 0 0'
		});
		var bigCategoryField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"行业大类",
			name: 'bigCategory',
			labelWidth: 70,
			margin: '0 25 0 0'
		});
		var midCategoryField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"行业中类",
			name: 'midCategory',
			labelWidth: 80,
			margin: '0 25 0 0'
		});
		var smallCategoryField = Ext.create('Ext.form.field.Text',{
			fieldLabel:"行业小类",
			name: 'smallCategory',
			labelWidth: 70,
			margin: '0 25 0 0'
		});
		var enterpriseStore = Ext.create('Ext.data.Store',{
			pageSize: itemsPerPage,
			fields: ["a","b" ],
			proxy : {
				type : 'ajax',
				url : 'tax/enterprise/listEnterprise.do',
				reader : {
					type : 'json',
					rootProperty : 'value',
					totalProperty : 'totalCount'
				}
//				params:{
//					taxId : taxIdField.getValue(),
//					taxName : taxNameField.getValue(),
//					represent: representField.getValue(),
//					category: categoryField.getValue()
//				},
				
			},
			listeners : {
				beforeload : function(enterpriseStore, operation, eOpts) {
					enterpriseStore.getProxy().setExtraParams({
						taxId : taxIdField.getValue(),
						taxName : taxNameField.getValue(),
						represent: representField.getValue(),
						category: categoryField.getValue(),
						bigCategory: bigCategoryField.getValue(),
						midCategory: midCategoryField.getValue(),
						smallCategory: smallCategoryField.getValue()
					});
				}
			},
			autoLoad : false
		});
		
		enterpriseStore.load({
			params:{
				start: 0,
				limit: itemsPerPage
			}
		})
		var toolbar = Ext.create('Ext.container.Container',{
			items: [{
				xtype:"toolbar",
				items:[taxIdField,taxNameField,representField,categoryField]
			},{
				xtype:"toolbar",
				items:[bigCategoryField,midCategoryField,smallCategoryField,
					{
					xtype: 'button',
					text: '查询',
					margin: '0 20 0 0',
					handler: function(){
						//console.log(123)
						enterpriseStore.load({
							params:{
								start: 0,
								limit: itemsPerPage
							}
						});
						pagingToolBar.doRefresh();
				}
				},{
					xtype: 'button',
					text: '重置',
					margin: '0 20 0 0',
					handler: function(){
						taxIdField.setValue("");
						taxNameField.setValue("");
						representField.setValue("");
						categoryField.setValue("");
						bigCategoryField.setValue("");
						midCategoryField.setValue("");
						smallCategoryField.setValue("");
						pagingToolBar.doRefresh();
					}
				},{
					xtype: 'button',
					text: '查看企业相关信息',
					handler: function(){
						var select = Ext.getCmp('enterpriseQueryGrid').getSelection();
						if(select.length==0)
						    	Ext.Msg.alert('请选择要查询的数据')
						else{
							var id=select[0].get('社会信用代码(纳税人识别号)');
							var enterpriseName=select[0].get('纳税人名称');
							var url='enterpriseRelatedData.jsp?id='+id+'&enName='+enterpriseName;
							url=encodeURI(url)
					    		window.open(url,"_blank");
						}
					}
		    	    }]
			}]
		});
		var pagingToolBar=Ext.create('Ext.toolbar.Paging',{
			store: enterpriseStore,   // same store GridPanel is using
			dock: 'bottom',
			displayInfo: true,
			displayMsg:'显示{0}-{1}条，共{2}条',  
			emptyMsg:'无数据'
		});
		var enterpriseQueryGrid=Ext.create('Ext.grid.Panel',{
			id: 'enterpriseQueryGrid',
			store: enterpriseStore,
			atuoScroll:true,
			columns: columns,
			viewConfig : {
				enableTextSelection : true
			},
			dockedItems:[pagingToolBar],
			listeners: {
	    		itemdblclick: function(me, record, item, index){
	    			var select = Ext.getCmp('enterpriseQueryGrid').getSelection();
					if(select.length==0)
					    	Ext.Msg.alert('请选择要查询的数据')
					else{
						var id=select[0].get('社会信用代码(纳税人识别号)');
						var enterpriseName=select[0].get('纳税人名称');
						var url='enterpriseRelatedData.jsp?id='+id+'&enName='+enterpriseName;
						url=encodeURI(url)
				    		window.open(url,"_blank");
					}
	    		}
	    }
//			dockedItems: [{
//				xtype: 'pagingtoolbar',
//				store: enterpriseStore,   // same store GridPanel is using
//				dock: 'bottom',
//				displayInfo: true,
//				displayMsg:'显示{0}-{1}条，共{2}条',  
//				emptyMsg:'无数据' 
//			}]
		})
		this.tbar=toolbar;
		this.items=[enterpriseQueryGrid]
		this.callParent();
		
	}
});