Ext.define('unuseMaterial.unuseMaterial_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '废料仓库查询',
    initComponent: function(){
        var itemsPerPage = 50;

        //原材料类型，下拉框显示
        // var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
        //     fieldLabel : '原材料品名',
        //     labelWidth : 70,
        //     width : 260,
        //     id :  'materialName',
        //     name : 'materialName',
        //     matchFieldWidth: true,
        //     // allowBlank:false,
        //     emptyText : "--请选择--",
        //     displayField: 'materialName',
        //     valueField: 'id', //显示name
        //     editable : true,
        //     store: MaterialNameList,
        // });
        var toolbar_top = Ext.create("Ext.toolbar.Toolbar", {
            // dock : "top",
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>查询条件:</strong>',
                }
            ]
        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{

            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '原材料类型',
                //     id :'mType',
                //     width: 180,
                //     labelWidth: 70,
                //     name: 'mType',
                //     value:"",
                // },
          //      MaterialTypeList,
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 40',
                //     fieldLabel: '规格',
                //     id :'specification',
                //     width: 130,
                //     labelWidth: 30,
                //     name: 'specification',
                //     value:"",
                // },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                     fieldLabel: '废料名',
                    id :'wasteName',
                    width: 180,
                    labelWidth: 60,
                    name: 'wasteName',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '仓库名',
                    id :'warehouseName',
                    width: 180,
                    labelWidth: 60,
                    name: 'warehouseName',
                    value:"",
                },
                {
                    xtype : 'button',
                    text: '查询',
                    iconCls:'right-button',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        unusual_Query_Data_Store.load({
                            params : {
                                wasteName:Ext.getCmp('wasteName').getValue(),
                                warehouseName:Ext.getCmp('warehouseName').getValue(),
                            }
                        });
                    }
                }
                ]
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
                // }]
        });
        var unusual_Query_Data_Store = Ext.create('Ext.data.Store',{
            id: 'unusual_Query_Data_Store',
            autoLoad: true,  //初始自动加载
            fields: [],
            pageSize: itemsPerPage, // items per page,每页显示的记录条数
            proxy:{
                url : "waste/queryStore.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :"waste_store",
                        // startWidth:Ext.getCmp('startWidth').getValue(),
                        // endWidth:Ext.getCmp('endWidth').getValue(),

                        wasteName:Ext.getCmp('wasteName').getValue(),
                        // specification:Ext.getCmp('specification').getValue(),
                        warehouseName:Ext.getCmp('warehouseName').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            title: "废料仓库信息记录",
            store: unusual_Query_Data_Store,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {
                    dataIndex : 'wasteName',
                    name : '废料名',
                    text : '废料名',
                    //width : 110,
                    flex :1,
                },
                {
                    dataIndex : 'inventoryUnit',
                    text : '库存单位',
                    flex :.6,
                },
                {
                    dataIndex : 'countStore',
                    name : '数量',
                    text : '数量',
                    flex :1,
                },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1,

                },
                ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: unusual_Query_Data_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }]
            // listeners: {
            //     validateedit : function(editor, e) {
            //         var field=e.field
            //         var id=e.record.data.id
            //         if(id)
            //         Ext.Ajax.request({
            //             url:"data/EditCellById.do",  //EditDataById.do
            //             params:{
            //                 tableName:tableName,
            //                 field:field,
            //                 value:e.value,
            //                 id:id
            //             },
            //             success:function (response) {
            //                 //console.log(response.responseText);
            //             }
            //         })
            //         // console.log("value is "+e.value);
            //         // console.log(e.record.data["id"]);
            //
            //     }
            // }
        });

        // this.tbar = toobar;
        this.items = [grid];
        //设置panel多行tbar
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toobar]
        },
        ];
        this.callParent(arguments);
    }
})