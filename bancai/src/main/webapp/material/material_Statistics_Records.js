Ext.define('material.material_Statistics_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料出入库记录统计',
    initComponent: function(){
        var itemsPerPage = 50;
        //var tableName="material";
        //var materialType="1";
        //操作类型：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '入库' },
                1: { value: '1', name: '出库' },
                2: { value: '2', name: '退库' },
                3: { value: '3', name: '撤销入库' },
                4: { value: '4', name: '撤销出库' },
                5: { value: '5', name: '撤销退库' },
            }
        });
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 20 0 10',
                    fieldLabel: '操作员',
                    id :'userName',
                    width: 160,
                    labelWidth: 50,
                    name: 'userName',
                    value:"",
                },
                // {
                //     xtype:'tbtext',
                //     text:'时间',
                //     // itemId:'move_left'
                // },
                {
                    xtype: 'datefield',
                    margin : '0 20 0 20',
                    fieldLabel: '时间',
                    //id :'startTime',
                    width: 180,
                    labelWidth: 40,
                    value:"",
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                },
                {
                    xtype:'tbtext',
                    text:'至 ',
                    itemId:'move_left',
                    margin : '0 20 0 0'
                },
                {
                    xtype: 'datefield',
                    margin : '0 10 0 0',
                    // fieldLabel: '结束时间',
                    //id :'endTime',
                    width: 140,
                    // labelWidth: 80,
                    value:"",
                    id : "endTime",
                    name : 'endTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                },
                {
                    xtype : 'button',
                    text: '入库统计',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        material_Statistics_Records_Store.load({
                            params : {
                                username : Ext.getCmp('userName').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                optionType:0 //入库为0
                            }
                        });
                    }
                },
                {
                    xtype : 'button',
                    text: '出库统计',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        material_Statistics_Records_Store.load({
                            params : {
                                username : Ext.getCmp('userName').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                optionType:1 //出库为1
                            }
                        });
                    }
                }
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
                url : "material/material_statistic_records.do",//"material/historyDataList.do", //原材料出入库统计
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    username : Ext.getCmp('userName').getValue(),
                    endTime : Ext.getCmp('endTime').getValue(),
                    startTime:Ext.getCmp('startTime').getValue(),
                    // optionType:1 //出库为1
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        username : Ext.getCmp('userName').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        // optionType:1 //出库为1

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
                { text: '操作人员',  dataIndex: 'username' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '操作时间',
                    dataIndex: 'time',
                    flex :1 ,
                    editor:{xtype : 'textfield', allowBlank : false},
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                // { text: '操作类型', dataIndex: 'time',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                {   text: '操作类型',
                    dataIndex: 'type',
                    flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                { text: '材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '操作数量', dataIndex: 'sumcount', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},

                // {
                //     header: "操作", dataIndex: 'Gender',
                //     renderer: function() {                      //此处为主要代码
                //         //var str = "<input type='button' value='查看' onclick='look()'>";
                //         //return str;
                //     }
                // },
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