Ext.define('material.query_Mcatergory_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查看原材料类型',
    renderTo:Ext.getBody(),
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_info";

        //原材料基础信息数据
        var materialInfo_Store = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/findmaterialinfobycondition.do", //查询接口
                type: 'ajax',
                method:'POST',
                reader:{
                    type : 'json',
                    rootProperty: 'materialtype',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        //materialCatergory:Ext.getCmp('materialCatergory').getValue(),
                        tableName:tableName,
                    });
                }
            }

        });

        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            // dock : "top",
            border:false,
            items : [
                    {
                        xtype: 'tbtext',
                        text: '<strong>查询条件:</strong>',
                    }
                ]
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            // border:false,
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '原材料品名',
                    id :'materialName',
                    width: 180,
                    labelWidth: 70,
                    name: 'materialName',
                    value:"",
                    labelStyle:"font-size:'12px';"
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 40',
                    fieldLabel: '宽',
                    id :'width',
                    width: 130,
                    labelWidth: 20,
                    name: 'width',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 40',
                    fieldLabel: '规格',
                    id :'specification',
                    width: 130,
                    labelWidth: 30,
                    name: 'specification',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 40',
                    fieldLabel: '单重',
                    id :'unitWeight',
                    width: 130,
                    labelWidth: 30,
                    name: 'unitWeight',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 40',
                    fieldLabel: '库存单位',
                    id :'inventoryUnit',
                    width: 130,
                    labelWidth: 60,
                    name: 'inventoryUnit',
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
                        //
                        materialInfo_Store.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                // startWidth : Ext.getCmp('startWidth').getValue(),
                                // endTWidth : Ext.getCmp('endWidth').getValue(),
                                // materialName:Ext.getCmp('materialName').getValue(),//获取id  Ext.getCmp('materialName').rawValue
                                materialName:Ext.getCmp('materialName').getValue(),//获取显示字段
                                specification:Ext.getCmp('specification').getValue(),
                                width:Ext.getCmp('width').getValue(),
                                unitWeight:Ext.getCmp('unitWeight').getValue(),
                                inventoryUnit:Ext.getCmp('inventoryUnit').getValue(),
                            }
                        });
                    }
                }
            ]

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            height:400,
            width:600,
            title: "原材料基础信息",
            store: materialInfo_Store,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                // { text: '原材料品名',  dataIndex: 'materialName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '原材料品名',  dataIndex: 'materialName' ,flex :1},
                { text: '宽',  dataIndex: 'width' ,flex :1},
                { text: '规格',  dataIndex: 'specification' ,flex :1,},
                { text: '单重',  dataIndex: 'unitWeight' ,flex :1},
                { text: '库存单位',  dataIndex: 'inventoryUnit' ,flex :1},
                { text: '描述',  dataIndex: 'description' ,flex :1},


            ],

            // tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: materialInfo_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],

            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],

            listeners: {

                //监听修改事件
                // validateedit: function(editor, e){//监听点击表格
                //     //获得当前行的id
                //     var cellId = e.record.id;
                //     var cellField = e.field;
                //     var cellValue = e.value//当前值
                //     Ext.Ajax.request({
                //         url : 'data/EditCellById.do',
                //         method:'POST',
                //         //submitEmptyText : false,
                //         params : {
                //             tableName:tableName,
                //             id:cellId,
                //             field:cellField,
                //             value:cellValue
                //         },
                //         success : function(response) {
                //             Ext.MessageBox.alert("提示", "修改成功！");
                //         },
                //         failure : function(response) {
                //             Ext.MessageBox.alert("提示", "修改失败！");
                //         }
                //     });
                // },
            }
        });

        // this.tbar = toobar;
        this.items = [grid];
        //设置panel多行tbar
        this.dockedItems=[{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar2]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    style:'border-width:0 0 0 0;',
                    items : [toolbar]
                },
        ];
        this.callParent(arguments);
    }
})