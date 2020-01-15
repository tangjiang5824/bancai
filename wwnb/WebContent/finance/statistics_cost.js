Ext.define('finance.statistics_cost',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料出入库记录统计',
    initComponent: function(){
        var itemsPerPage = 50;
        //var tableName="material";
        //var materialType="1";
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '入库人员',
                    //id :'userId',
                    width: 160,
                    labelWidth: 60,
                    name: 'userId',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '项目名称',
                    //id :'projectName',
                    width: 250,
                    labelWidth: 60,
                    name: 'projectName',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '开始时间',
                    //id :'startTime',
                    width: 180,
                    labelWidth: 80,
                    name: 'startTime',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '结束时间',
                    //id :'endTime',
                    width: 180,
                    labelWidth: 80,
                    name: 'endTime',
                    value:"",
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        material_Statistics_Records_Store.load({
                            params : {
                                // userId : Ext.getCmp('userId').getValue(),
                                // endTime : Ext.getCmp('endTime').getValue(),
                                // startTime:Ext.getCmp('startTime').getValue(),
                                // projectName:Ext.getCmp('projectName').getValue(),
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
        var material_Statistics_Records_Store = Ext.create('Ext.data.Store',{
            id: 'material_Statistics_Records_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url : "",//"material/historyDataList.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    // start: 0,
                    // limit: itemsPerPage
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        // tableName :tableName,
                        // userId:Ext.getCmp('userId').getValue(),
                        // endTime:Ext.getCmp('endTime').getValue(),
                        // startTime:Ext.getCmp('startTime').getValue(),
                        // projectName:Ext.getCmp('projectName').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            //id: 'material_Statistics_Records_Main',
            store: material_Statistics_Records_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '材料单编号', dataIndex: '材料单编号', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传人',  dataIndex: '上传人' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传时间', dataIndex: '上传时间', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '项目名称', dataIndex: '项目名称',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                {
                    header: "操作", dataIndex: 'Gender',
                    renderer: function() {                      //此处为主要代码
                        //var str = "<input type='button' value='查看' onclick='look()'>";
                        //return str;
                    }
                },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: material_Statistics_Records_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    //var id=e.record.data.id
                    Ext.Ajax.request({
                        //url:"",//"data/EditCellById.do",  //EditDataById.do
                        params:{
                            // tableName:tableName,
                            // field:field,
                            // value:e.value,
                            // id:id
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