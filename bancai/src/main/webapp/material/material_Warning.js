Ext.define('material.material_Warning',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料预警',
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
                {
                    xtype: 'textfield',
                    margin : '0 0 0 0',
                    fieldLabel: '阈值',
                    id :'threshold',
                    width: 160,
                    labelWidth: 60,
                    name: 'threshold',
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
                            // params : {
                            //     //proNum : Ext.getCmp('proNum').getValue(),
                            //     // startWidth : Ext.getCmp('startWidth').getValue(),
                            //     // endTWidth : Ext.getCmp('endWidth').getValue(),
                            //     // materialName:Ext.getCmp('materialName').getValue(),//获取id  Ext.getCmp('materialName').rawValue
                            //     // materialName:Ext.getCmp('materialName').rawValue,//获取显示字段
                            //     tableName :"material_store_view",
                            //     threshold : "threshold"
                            // }
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
                url : "material/findStoreThresholdInfo.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    tableName :"material_store_view",
                    threshold : "threshold"
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :"material_store_view",
                        // startWidth:Ext.getCmp('startWidth').getValue(),
                        // endWidth:Ext.getCmp('endWidth').getValue(),

                        threshold:Ext.getCmp('threshold').getValue(),//获取显示字段
                        // specification:Ext.getCmp('specification').getValue(),
                        // countStore_min:Ext.getCmp('countStore_min').getValue(),
                        // countStore_max:Ext.getCmp('countStore_max').getValue(),
                        // countUse_min:Ext.getCmp('countUse_min').getValue(),
                        // countUse_max:Ext.getCmp('countUse_max').getValue(),
                        // warehouseName:Ext.getCmp('warehouseName').getValue(),
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
                    name : '原材料名',
                    text : '原材料名',
                    //width : 110,
                    flex :1,

                },
                {
                    dataIndex : 'typeName',
                    text : '原材料类型',
                    flex :.6,
                },
                {
                    dataIndex : 'countStore',
                    name : '库存数量',
                    text : '库存数量',
                    flex :1,
                },
                // {
                //     dataIndex : 'countUse',
                //     name : '可用数量',
                //     text : '可用数量',
                //     flex :1,
                // },
                {dataIndex : 'aValue', text : 'a值', flex :.6},
                {dataIndex : 'bValue', text : 'b值', flex :.6},
                {dataIndex : 'mValue', text : 'm值', flex :.6},
                {dataIndex : 'nValue', text : 'n值', flex :.6},
                {dataIndex : 'pValue', text : 'p值', flex :.6},
                {dataIndex : 'orientation', text : '方向', flex :.6},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :.6},
                {
                    dataIndex : 'unitWeight',
                    name : '单重',
                    text : '单重',
                    //width : 160,
                    flex :1,

                },
                {
                    dataIndex : 'unitArea',
                    name : '单面积',
                    text : '单面积',
                    //width : 160,
                    flex :1,

                },
                {
                    dataIndex : 'totalWeight',
                    name : '总重',
                    text : '总重',
                    flex :1,
                },
                {
                    dataIndex : 'totalArea',
                    name : '总面积',
                    text : '总面积',
                    flex :1,
                },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1,

                }
                // {dataIndex : 'description', text : '备注', flex :1}
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

// Ext.define('material.material_Warning',{
//     extend:'Ext.panel.Panel',
//     region: 'center',
//     layout:'fit',
//     title: '原材料预警',
//
//     reloadPage : function() {
//         var p = Ext.getCmp('functionPanel');
//         p.removeAll();
//         cmp = Ext.create("data.UploadDataTest");
//         p.add(cmp);
//     },
//     clearGrid : function() {
//         var msgGrid = Ext.getCmp("msgGrid");
//         if (msgGrid != null || msgGrid != undefined)
//             this.remove(msgGrid);
//     },
//
//     initComponent : function() {
//         var me = this;
//         var tableName="material";
//         //var materialtype="1";
//
//         var MaterialNameList = Ext.create('Ext.data.Store',{
//             fields : [ 'materialName'],
//             proxy : {
//                 type : 'ajax',
//                 url : 'material/materialType.do',
//                 reader : {
//                     type : 'json',
//                     rootProperty: 'typeList',
//                 }
//             },
//             autoLoad : true
//         });
//         var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
//             fieldLabel : '原材料类型',
//             labelWidth : 70,
//             width : 230,
//             id :  'materialName',
//             name : 'materialName',
//             matchFieldWidth: false,
//             emptyText : "--请选择--",
//             displayField: '原材料名称',
//             valueField: '原材料类型',
//             editable : false,
//             store: MaterialNameList,
//             listeners:{
//                 select: function(combo, record, index) {
//
//                     console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
//                     //console.log(record[0].data.materialName);
//                 }
//             }
//
//         });
//
//
//         var toolbar = Ext.create('Ext.toolbar.Toolbar', {
//             dock : "top",
//             items: [
//                 MaterialTypeList,
//                 {
//                     xtype: 'textfield',
//                     margin: '0 10 0 85',
//                     fieldLabel: '长',
//                     id: 'length',
//                     width: 180,
//                     labelWidth: 20,
//                     name: 'length',
//                     value: "",
//                 },
//                 {
//                     xtype: 'textfield',
//                     fieldLabel: '宽',
//                     //labelSeparator: '',
//                     id: 'width',
//                     labelWidth: 20,
//                     width: 180,
//                     margin: '0 10 0 85',
//                     name: 'width',
//                     value: "",
//                 },
//                 {
//                     xtype: 'textfield',
//                     margin: '0 10 0 50',
//                     fieldLabel: '库存单位',
//                     id: 'stockUnit',
//                     width: 220,
//                     labelWidth: 60,
//                     name: 'stockUnit',
//                     value: "",
//                 },
//             ]
//         });
//         var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
//             dock : "top",
//             items: [
//
//                 {
//                     xtype: 'textfield',
//                     margin: '0 10 0 40',
//                     fieldLabel: '成本',
//                     id: 'cost',
//                     width: 187,
//                     labelWidth: 30,
//                     name: 'cost',
//                     value: "",
//                 },
//                 {
//                     xtype: 'textfield',
//                     margin: '0 10 0 70',
//                     fieldLabel: '数量',
//                     id: 'number',
//                     width: 187,
//                     labelWidth: 30,
//                     name: 'number',
//                     value: "",
//                 },
//                 {
//                     xtype: 'textfield',
//                     fieldLabel: '仓库编号',
//                     //labelSeparator: '',
//                     id: 'warehouse',
//                     labelWidth: 60,
//                     width: 220,
//                     margin: '0 10 0 47',
//                     name: 'warehouse',
//                     value: "",
//                 },
//                 {
//                     xtype: 'textfield',
//                     margin: '0 10 0 50',
//                     fieldLabel: '存放位置',
//                     id: 'location',
//                     width: 220,
//                     labelWidth: 60,
//                     name: 'location',
//                     value: "",
//                 },
//                 {
//                     xtype : 'button',
//                     margin: '0 10 0 70',
//                     iconAlign : 'center',
//                     iconCls : 'rukuicon ',
//                     text : '添加',
//                     handler: function(){
//                         var materialType = Ext.getCmp('materialName').getValue();
//                         var length = Ext.getCmp('length').getValue();
//                         var width = Ext.getCmp('width').getValue();
//                         var cost = Ext.getCmp('cost').getValue();
//                         var number = Ext.getCmp('number').getValue();
//                         var location = Ext.getCmp('location').getValue();
//                         var warehouse = Ext.getCmp('warehouse').getValue();
//                         var stockUnit = Ext.getCmp('stockUnit').getValue();
//                         var data = [{
//                             '类型' : materialType,
//                             '长' : length,
//                             '宽' : width,
//                             '数量' : number,
//                             '成本' : cost,
//                             '存放位置' : location,
//                             '品号' : '',
//                             '库存单位' : stockUnit,
//                             '仓库编号' : warehouse,
//                             '规格' : '',
//                             '原材料名称' : '',
//                         }];
//                         //点击查询获得输入的数据
//
//
//                         // console.log(Ext.getCmp('length').getValue());
//                         // console.log(Ext.getCmp('cost').getValue());
//                         Ext.getCmp('material_Warning_addDataGrid').getStore().loadData(data,
//                             true);
//                     }
//                 }
//
//             ]
//         });
//
//         //确认入库按钮，
//         var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
//             dock : "bottom",
//             id : "toolbar3",
//             //style:{float:'center',},
//             //margin-right: '2px',
//             //padding: '0 0 0 750',
//             style:{
//                 //marginLeft: '900px'
//                 layout: 'right'
//             },
//             items : [{
//                 xtype : 'button',
//                 iconAlign : 'center',
//                 iconCls : 'rukuicon ',
//                 text : '确认入库',
//                 region:'center',
//                 bodyStyle: 'background:#fff;',
//                 handler : function() {
//
//                     // 取出grid的字段名字段类型
//                     var select = Ext.getCmp('material_Warning_addDataGrid').getStore()
//                         .getData();
//                     var s = new Array();
//                     select.each(function(rec) {
//                         s.push(JSON.stringify(rec.data));
//                         // s.push('品号','');
//                         //alert(JSON.stringify(rec.data));//获得表格中的数据
//                         //s.push();
//                     });
//
//                     console.log(s);
//
//                     //获取数据
//                     //获得当前操作时间
//                     //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
//                     Ext.Ajax.request({
//                         url : 'addMaterial.do', //原材料入库
//                         method:'POST',
//                         //submitEmptyText : false,
//                         params : {
//                             tableName:tableName,
//                             //materialType:materialtype,
//                             s : "[" + s + "]",
//                         },
//                         success : function(response) {
//                             //var message =Ext.decode(response.responseText).showmessage;
//                             Ext.MessageBox.alert("提示","入库成功" );
//                         },
//                         failure : function(response) {
//                             //var message =Ext.decode(response.responseText).showmessage;
//                             Ext.MessageBox.alert("提示","入库失败" );
//                         }
//                     });
//
//                 }
//             }]
//         });
//
//
//
//         var material_Warning_grid = Ext.create("Ext.grid.Panel", {
//             id : 'material_Warning_addDataGrid',
//             //dockedItems : [toolbar2],
//             store : {
//                 fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
//                 //fields: ['长',"类型","宽",'数量','成本','存放位置','品号','规格','库存单位','仓库编号']
//             },
//
//             columns : [
//                 {
//                     dataIndex: '原材料名称',
//                     text: '材料名',
//                     //width : 110,
//                     editor: {// 文本字段
//                         xtype: 'textfield',
//                         allowBlank: false,
//                     }
//                 },{
//                     dataIndex : '品号',
//                     name : '品号',
//                     text : '品号',
//                     //width : 110,
//                     editor : {// 文本字段
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//                 },
//                 {
//                     dataIndex : '长',
//                     text : '长',
//                     //width : 110,
//                     editor : {// 文本字段
//                         xtype : 'textfield',
//                         allowBlank : false,
//
//                     }
//
//                 }, {
//                     dataIndex : '类型',
//                     text : '类型',
//                     //width : 110,
//                     editor : {// 文本字段
//                         xtype : 'textfield',
//                         allowBlank : false,
//
//                     }
//
//                 },{
//                     dataIndex : '宽',
//                     text : '宽',
//                     //width : 110,
//                     editor : {// 文本字段
//                         xtype : 'textfield',
//                         allowBlank : false,
//
//                     }
//
//                 },
//                 {
//                     dataIndex : '规格',
//                     text : '规格',
//                     //width : 192,
//                     editor : {
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//                 }, {
//                     dataIndex : '库存单位',
//                     text : '库存单位',
//                     //width : 110,
//                     editor : {// 文本字段
//                         id : 'isNullCmb',
//                         xtype : 'textfield',
//                         allowBlank : false
//
//                     }
//
//                 }, {
//                     dataIndex : '仓库编号',
//                     name : '仓库编号',
//                     text : '仓库编号',
//                     //width : 130,
//
//                     editor : {// 文本字段
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//                 },
//                 {
//                     dataIndex : '数量',
//                     name : '数量',
//                     text : '数量',
//                     //width : 160,
//                     editor : {
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//
//                 },{
//                     dataIndex : '成本',
//                     name : '成本',
//                     text : '成本',
//                     //width : 160,
//                     editor : {
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//                 },{
//                     dataIndex : '存放位置',
//                     name : '存放位置',
//                     text : '存放位置',
//                     //width : 160,
//                     editor : {
//                         xtype : 'textfield',
//                         allowBlank : false
//                     }
//                 }
//             ],
//             viewConfig : {
//                 plugins : {
//                     ptype : "gridviewdragdrop",
//                     dragText : "可用鼠标拖拽进行上下排序"
//                 }
//             },
//             plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
//                 clicksToEdit : 1
//             })],
//             selType : 'rowmodel'
//         });
//         this.dockedItems = [toolbar,
//             //toobar,
//             toolbar1, material_Warning_grid,toolbar3];
//         //this.items = [ me.grid ];
//         this.callParent(arguments);
//
//     }
//
// })
//
