Ext.define('unuseMaterial.unuseMaterial_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料仓库查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_info";
        //var materialType="1";
        //查询数据库，返回原材料类型
        var MaterialNameList = Ext.create('Ext.data.Store',{
            fields : [ 'materialName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,
                reader : {
                    type : 'json',
                    rootProperty: 'material_info',
                },
                fields : ['id','materialName']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });

        //原材料类型，下拉框显示
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 260,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'id', //显示name
            editable : true,
            store: MaterialNameList,
        });
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
                MaterialTypeList,
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
                    xtype:'tbtext',
                    text:'库存数量:',
                    margin : '0 10 0 20',
                    itemId:'move_left',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'minCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'minCount',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    id :'maxCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'maxCount',
                    value:"",
                },

                {
                    xtype: 'textfield',
                    margin : '0 10 0 40',
                    fieldLabel: '仓库名称',
                    id :'warehouseName',
                    width: 160,
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
                        material_Query_Data_Store.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                // startWidth : Ext.getCmp('startWidth').getValue(),
                                // endTWidth : Ext.getCmp('endWidth').getValue(),
                                // materialName:Ext.getCmp('materialName').getValue(),//获取id  Ext.getCmp('materialName').rawValue
                                // materialName:Ext.getCmp('materialName').rawValue,//获取显示字段
                                materialName:Ext.getCmp('materialName').rawValue,//获取显示字段
                                // specification:Ext.getCmp('specification').getValue(),
                                totalCount_min:Ext.getCmp('minCount').getValue(),
                                totalCount_max:Ext.getCmp('maxCount').getValue(),
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
        var material_Query_Data_Store = Ext.create('Ext.data.Store',{
            id: 'material_Query_Data_Store',
            autoLoad: true,  //初始自动加载
            fields: [],
            pageSize: itemsPerPage, // items per page,每页显示的记录条数
            proxy:{
                url : "material/findStoreInfo.do",
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
                        tableName :"material_store_view",
                        // startWidth:Ext.getCmp('startWidth').getValue(),
                        // endWidth:Ext.getCmp('endWidth').getValue(),

                        materialName:Ext.getCmp('materialName').rawValue,
                        // specification:Ext.getCmp('specification').getValue(),
                        totalCount_min:Ext.getCmp('minCount').getValue(),
                        totalCount_max:Ext.getCmp('maxCount').getValue(),
                        warehouseName:Ext.getCmp('warehouseName').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            title: "原材料仓库信息记录",
            store: material_Query_Data_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {
                    dataIndex : 'materialName',
                    name : '品号',
                    text : '品号',
                    //width : 110,
                    flex :1,

                },
                {
                    dataIndex : 'typeId',
                    text : '原材料类型',
                    flex :.6,
                },
                {dataIndex : 'aValue', text : 'a值', flex :.6},
                {dataIndex : 'bValue', text : 'b值', flex :.6},
                {dataIndex : 'mValue', text : 'm值', flex :.6},
                {dataIndex : 'nValue', text : 'n值', flex :.6},
                {dataIndex : 'pValue', text : 'p值', flex :.6},
                {dataIndex : 'orientation', text : '方向', flex :.6},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :.6},
                {dataIndex : 'description', text : '备注', flex :1},
                {
                    dataIndex : 'unitWeight',
                    name : '单重',
                    text : '单重',
                    //width : 160,
                    flex :1,

                },{
                    dataIndex : 'totalWeight',
                    name : '总重',
                    text : '总重',
                    flex :1,
                },
                {
                    dataIndex : 'totalCount',
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
                store: material_Query_Data_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    if(id)
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