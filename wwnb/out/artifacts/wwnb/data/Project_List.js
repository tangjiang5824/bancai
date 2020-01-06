Ext.define('project.Project_List',{
    extend: 'Ext.panel.Panel',
    layout:'fit',
    autoScroll: true,
    id:'checkdatapanel',
    initComponent: function(){
        var itemsPerPage = 50;
        var me=this;
        var tableListStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'project/findProjectList.do',

                reader : {
                    type : 'json',
                    rootProperty: 'projectList',
                }
            },
            autoLoad : true

        });
        tableListStore.on("load", function(){
            //var name=tableListStore.getAt(0).get('projectName');
//			    alert(defaultYear);//得到第一条数据
            //tableList.setValue(defaultYear);
            // Ext.Ajax.request({
            // 	url: 'system/dataTable/getColumnsAndFields.do',
            // 	params:{
            // 		tableName:defaultYear
            // 	},
            // 	success:function(response)
            // 	{
            // 		var obj=Ext.decode(response.responseText);
            // 		var oldFields = JSON.stringify(obj.fields).replace('[','').replace(']','');
            // 		var oldColumns=JSON.stringify(obj.columns).replace('[','').replace(']','');
            // 		var newFilds='["所属期","批次",'+oldFields+']';
            // 		var newColumns='[{"text":"所属期始","dataIndex":"startTime",width: 100},{"text":"所属期止","dataIndex":"endTime",width: 100},{"text":"批号","dataIndex":"batchNo",width: 100},'+oldColumns+']'
            // 		console.log(Ext.decode(newFilds))
            // 		var columns=Ext.decode(newColumns)
            // 		var tmp1=columns[0];
            // 		columns[0]=columns[3];
            // 		var tmp2=columns[1];
            // 		columns[1]=tmp1;
            // 		tmp1=columns[2];
            // 		columns[2]=tmp2;
            // 		columns[3]=tmp1;
            // 		console.log(columns)
            // 		var tableDataStore = Ext.create('Ext.data.Store',{
            // 			pageSize: itemsPerPage,
            // 			fields: Ext.decode(newFilds),
            // 			proxy: {
            // 				type: 'ajax',
            // 				url: 'listTableData.do',
            // 				extraParams : {
            //
            // 					tableName: defaultYear,
            // 					begintime:  Ext.util.Format.date(Ext.getCmp('checkdatabegintime').getValue(), 'Y-m'),
            // 					deadline : Ext.util.Format.date(Ext.getCmp('checkdatadeadline').getValue(), 'Y-m')
            // 				},
            // 				reader: {
            // 					type: 'json',
            // 					rootProperty: 'value',
            // 					totalProperty: 'totalCount'
            // 				}
            // 			},
            // 			autoLoad: true
            // 		});
            // 		var oldgrid=Ext.getCmp('checkdataGrid');
            // 		if(oldgrid!=null)
            // 			me.remove(oldgrid);
            // 		var grid = Ext.create('Ext.grid.Panel',{
            // 			id: 'checkdataGrid',
            // 			store: tableDataStore,
            // 			viewConfig : {
            // 				enableTextSelection : true
            // 			},
            // 			//tbar: toobar,
            // 			columns: columns,//obj.columns,
            // 			dockedItems: [{
            // 				xtype: 'pagingtoolbar',
            // 				store: tableDataStore,   // same store GridPanel is using
            // 				dock: 'bottom',
            // 				displayInfo: true,
            // 				displayMsg:'显示{0}-{1}条，共{2}条',
            // 				emptyMsg:'无数据'
            // 			}]
            // 		});
            // 		me.add(grid);
            // 	},
            // 	failure: function(form, action) {
            // 		Ext.Msg.alert('消息', '查询失败');
            // 	}
            //
            // });
        });

        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '数据类型',
            labelWidth : 60,
            width : 400,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'projectName',
            editable : false,
            store: tableListStore

        });

        var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
            items:[
                tableList,
                {
                    xtype: 'button',
                    text: '查询',
                    margin : '0 10 0 0',
                    handler: function(){
                        console.log(Ext.getCmp('projectName').getValue())
                        Ext.Ajax.request({
                            url: 'project/showProject.do',
                            params:{
                                projectName:Ext.getCmp('projectName').getValue(),
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
                }
            ]
        });
        this.tbar=toolbar;
        this.callParent(arguments);


    }

})