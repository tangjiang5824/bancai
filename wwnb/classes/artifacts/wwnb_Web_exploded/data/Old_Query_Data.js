Ext.define('data.Old_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板材库数据查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_info";
        var materialType="0"; //旧版
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '宽度下限',
                    id :'startWidth',
                    width: 180,
                    labelWidth: 60,
                    name: 'startWidth',
                    value:"",
                    // listeners: {
                    //     change: function(ombo, records, eOpts) {
                    //         // alert(Ext.getCmp('startTime').getValue())
                    //         uploadRecordsStore.load({
                    //             params : {
                    //                 startWidth : Ext.getCmp('startWidth').getValue(),
                    //                 endTWidth : Ext.getCmp('endWidth').getValue(),
                    //                 startLength:Ext.getCmp('startLength').getValue(),
                    //                 endLength:Ext.getCmp('endLength').getValue(),
                    //                 mType:Ext.getCmp('mType').getValue()
                    //             }
                    //         });
                    //     },
                    // }

                }, {
                    xtype: 'textfield',
                    fieldLabel: '宽度上限',
                    labelSeparator: '',
                    id :'endWidth',
                    labelWidth: 60,
                    width: 180,
                    margin : '0 10 0 0',
                    name: 'endWidth',
                    value:"",
                    // listeners: {
                    //     change: function(ombo, records, eOpts) {
                    //         // alert(Ext.getCmp('startTime').getValue())
                    //         uploadRecordsStore.load({
                    //             params : {
                    //                 startWidth : Ext.getCmp('startWidth').getValue(),
                    //                 endTWidth : Ext.getCmp('endWidth').getValue(),
                    //                 startLength:Ext.getCmp('startLength').getValue(),
                    //                 endLength:Ext.getCmp('endLength').getValue(),
                    //                 mType:Ext.getCmp('mType').getValue()
                    //             }
                    //         });
                    //     }
                    // }
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '长度下限',
                    id :'startLength',
                    width: 180,
                    labelWidth: 60,
                    name: 'startLength',
                    value:"",
                    // listeners: {
                    //     change: function(ombo, records, eOpts) {
                    //         // alert(Ext.getCmp('startTime').getValue())
                    //         uploadRecordsStore.load({
                    //             params : {
                    //                 startWidth : Ext.getCmp('startWidth').getValue(),
                    //                 endTWidth : Ext.getCmp('endWidth').getValue(),
                    //                 startLength:Ext.getCmp('startLength').getValue(),
                    //                 endLength:Ext.getCmp('endLength').getValue(),
                    //                 mType:Ext.getCmp('mType').getValue()
                    //             }
                    //         });
                    //     },
                    // }
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '长度上限',
                    id :'endLength',
                    width: 180,
                    labelWidth: 60,
                    name: 'endLength',
                    value:"",
                    // listeners: {
                    //     change: function(ombo, records, eOpts) {
                    //         // alert(Ext.getCmp('startTime').getValue())
                    //         uploadRecordsStore.load({
                    //             params : {
                    //                 startWidth : Ext.getCmp('startWidth').getValue(),
                    //                 endTWidth : Ext.getCmp('endWidth').getValue(),
                    //                 startLength:Ext.getCmp('startLength').getValue(),
                    //                 endLength:Ext.getCmp('endLength').getValue(),
                    //                 mType:Ext.getCmp('mType').getValue()
                    //             }
                    //         });
                    //     },
                    // }
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '板材类型',
                    id :'mType',
                    width: 180,
                    labelWidth: 60,
                    name: 'mType',
                    value:"",
                    // listeners: {
                    //     change: function(ombo, records, eOpts) {
                    //         // alert(Ext.getCmp('startTime').getValue())
                    //         uploadRecordsStore.load({
                    //             params : {
                    //                 startWidth : Ext.getCmp('startWidth').getValue(),
                    //                 endTWidth : Ext.getCmp('endWidth').getValue(),
                    //                 startLength:Ext.getCmp('startLength').getValue(),
                    //                 endLength:Ext.getCmp('endLength').getValue(),
                    //                 mType:Ext.getCmp('mType').getValue()
                    //             }
                    //         });
                    //     },
                    // }
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                startWidth : Ext.getCmp('startWidth').getValue(),
                                endTWidth : Ext.getCmp('endWidth').getValue(),
                                startLength:Ext.getCmp('startLength').getValue(),
                                endLength:Ext.getCmp('endLength').getValue(),
                                mType:Ext.getCmp('mType').getValue()
                            }
                        });
                    }
                },
                {
                    text: '删除',
                    width: 80,
                    margin: '0 0 0 15',
                    handler: function(){
                        //获得当前选择的行对象
                        var select = grid.getSelectionModel().getSelection();
                        //select[0].data.id:获得当前选中行的数据id
                        if(select.length==0){
                            Ext.Msg.alert('错误', '请选择要删除的记录')
                        }
                        else{
                            Ext.Ajax.request({
                                url:"deleteDataById.do",
                                params:{
                                    tableName:tableName,
                                    id:select[0].data.id
                                },
                                success:function (response) {
                                    Ext.MessageBox.alert("提示","删除成功！")
                                    grid.store.remove(grid.getSelectionModel().getSelection());//移除删除的记录
                                },
                                failure:function (reponse) {
                                    Ext.MessageBox.alert("提示","删除失败！")

                                }
                            })
                        }
                    }
                }]
        })
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "org/data/history_ExcelList.do",
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
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,
                        startWidth : Ext.getCmp('startWidth').getValue(),
                        endWidth : Ext.getCmp('endWidth').getValue(),
                        startLength:Ext.getCmp('startLength').getValue(),
                        endLength:Ext.getCmp('endLength').getValue(),
                        mType:Ext.getCmp('mType').getValue(),
                        materialType:materialType    //旧板材库

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '品号',  dataIndex: '品号' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '长', dataIndex: '长', flex :2 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '类型', dataIndex: '类型',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '宽', dataIndex: '宽', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '规格',  dataIndex: '规格' ,flex :0.4,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '库存单位', dataIndex: '库存单位', flex :2,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '仓库编号', dataIndex: '仓库编号',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '数量', dataIndex: '数量', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '成本', dataIndex: '成本', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '存放位置', dataIndex: '存放位置',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}
            ],
            //对单元格单击响应的插件
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                // itemdblclick: function(me, record, item, index){
                //     var select = record.data;
                //     var id =select.id;
                //     var tableName=select.tableName;
                //     var url='showData.jsp?taxTableName='
                //         + tableName
                //         + "&taxTableId=" + id;
                //     url=encodeURI(url)
                //     window.open(url,
                //         '_blank');
                // }

                //双击修改
                //监听单元格数据修改
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    //后台响应
                    Ext.Ajax.request({
                        url:"EditDataById.do",
                        method:'POST',
                        //传入的参数
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示", "修改成功！");
                            //console.log(response.responseText);
                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "修改失败！");
                        }
                    })

                }
                }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})