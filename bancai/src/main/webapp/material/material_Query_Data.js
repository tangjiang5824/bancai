Ext.define('material.material_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料数据查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";
        //查询数据库，返回原材料类型
        var MaterialNameList = Ext.create('Ext.data.Store',{
            fields : [ 'materialName'],
            proxy : {
                type : 'ajax',
                url : 'material/materialType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typeList',
                }
            },
            autoLoad : true
        });

        //原材料类型，下拉框显示
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料类型',
            labelWidth : 70,
            width : 230,
            id :  'materialType',
            name : 'materialType',
            matchFieldWidth: false,
            emptyText : "------请选择------",
            displayField: 'materialTypeName',
            valueField: 'materialType',
            editable : false,
            store: MaterialNameList
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
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '宽度下限',
                    id :'startWidth',
                    width: 180,
                    labelWidth: 60,
                    name: 'startWidth',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'至',
                    // itemId:'move_left',
                    // handler:function(){
                    //     var records=grid2.getSelectionModel().getSelection();
                    //     MaterialList2.remove(records);
                    //     MaterialList.add(records);
                    // }
                },
                {
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
                },{
                    xtype:'tbtext',
                    text:'至',
                    itemId:'move_left',
                    // handler:function(){
                    //     var records=grid2.getSelectionModel().getSelection();
                    //     MaterialList2.remove(records);
                    //     MaterialList.add(records);
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
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        material_Query_Data_Store.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                startWidth : Ext.getCmp('startWidth').getValue(),
                                endTWidth : Ext.getCmp('endWidth').getValue(),
                                startLength:Ext.getCmp('startLength').getValue(),
                                endLength:Ext.getCmp('endLength').getValue(),
                                materialType:Ext.getCmp('materialType').getValue()
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
        })
        var material_Query_Data_Store = Ext.create('Ext.data.Store',{
            id: 'material_Query_Data_Store',
            autoLoad: true,  //初始自动加载
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/historyDataList.do",
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
                        startWidth:Ext.getCmp('startWidth').getValue(),
                        endWidth:Ext.getCmp('endWidth').getValue(),
                        startLength:Ext.getCmp('startLength').getValue(),
                        endLength:Ext.getCmp('endLength').getValue(),
                        materialType:Ext.getCmp('materialType').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            store: material_Query_Data_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '品号',  dataIndex: 'materialNo' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '长1', dataIndex: 'length', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '长2', dataIndex: 'length2', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '类型', dataIndex: 'materialType',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '宽1', dataIndex: 'width', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '宽2', dataIndex: 'width2', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '数量', dataIndex: 'number', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '成本', dataIndex: 'cost', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '规格',  dataIndex: 'specification' ,flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '库存单位', dataIndex: 'inventoryUnit', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '仓库编号', dataIndex: 'warehouseNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '位置-行', dataIndex: 'rowNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '位置-列', dataIndex: 'columNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar: toobar,
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