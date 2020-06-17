Ext.define('project.management.editProject',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目信息修改',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="project_username_statusName";
        //var materialType="1";
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '原材料类型',
                    id :'mType',
                    width: 180,
                    labelWidth: 70,
                    name: 'mType',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '宽度下限',
                    id :'startWidth',
                    width: 180,
                    labelWidth: 60,
                    name: 'startWidth',
                    value:"",
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
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        Query_Project_Store.load({
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
                // {
                //     text: '删除',
                //     width: 80,
                //     margin: '0 0 0 15',
                //     handler: function(){
                //         var select = grid.getSelectionModel().getSelection();
                //         if(select.length==0){
                //             Ext.Msg.alert('错误', '请选择要删除的记录')
                //         }
                //         else{
                //             Ext.Ajax.request({
                //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
                //                 params:{
                //                     tableName:tableName,
                //                     id:select[0].data.id
                //                 },
                //                 success:function (response) {
                //                     Ext.MessageBox.alert("提示","删除成功！")
                //                     grid.store.remove(grid.getSelectionModel().getSelection());
                //                 },
                //                 failure:function (reponse) {
                //                     Ext.MessageBox.alert("提示","删除失败！")
                //
                //                 }
                //             })
                //         }
                //     }
                // }
                ]
        })
        var Query_Project_Store = Ext.create('Ext.data.Store',{
            id: 'Query_Project_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/findAllBytableName.do?tableName="+tableName,
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: tableName,
                    //totalProperty: 'totalCount'
                },
                params:{
                    //start: 0,
                    //limit: itemsPerPage
                    //后面需要添加
                    //tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({


                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'Query_Project_Main',
            store: Query_Project_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '项目名称', dataIndex: 'projectName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '开始时间',  dataIndex: 'startTime' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '结束时间', dataIndex: 'endTime', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '预计结束时间', dataIndex: 'proEndTime', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '计划处负责人', dataIndex: 'planLeader',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '生产处负责人', dataIndex: 'produceLeader', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '采购处负责人', dataIndex: 'purchaseLeader', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '财务部负责人', dataIndex: 'financeLeader', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '仓储负责人', dataIndex: 'storeLeader', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '项目状态',  dataIndex: 'statusName' ,flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传人', dataIndex: 'username', flex :1,editor:{xtype : 'textfield', allowBlank : false}},

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            //tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: Query_Project_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            //console.log(response.responseText);
                        }
                    })
                    // console.log("value is "+e.value);
                    // console.log(e.record.data["id"]);

                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})