Ext.define('material.add_Mtype_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增原材料类型基础信息',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("material.add_Mcatergory_baseInfo");
        p.add(cmp);
    },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        var itemsPerPage = 50;
        //定义表名
        var tableName="material_type";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                margin:'0 40 0 0',
                text : '新增类型',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'typeName':'',
                        'materialPrefix':''
                    }];
                    //Ext.getCmp('addTypeGrid')返回定义的对象
                    Ext.getCmp('addTypeGrid').getStore().loadData(data,
                        true);
                }
            },
//                 {
//                 xtype : 'button',
//                 iconAlign : 'center',
//                 iconCls : 'rukuicon ',
//                 margin:'0 40 0 0',
//                 text : '保存',
//                 handler : function() {
//                     // 取出grid的字段名字段类型
//                     //var userid="<%=session.getAttribute('userid')%>";
//                     var select = Ext.getCmp('addTypeGrid').getStore()
//                         .getData();
//                     var s = new Array();
//                     select.each(function(rec) {
//                         //delete rec.data.id;
//                         s.push(JSON.stringify(rec.data));
//                         //alert(JSON.stringify(rec.data));//获得表格中的数据
//                     });
//                     //alert(s);//数组s存放表格中的数据，每条数据以json格式存放
//                     Ext.Ajax.request({
//                         url : 'material/insertIntoMaterialType.do', //HandleDataController
//                         method:'POST',
//                         //submitEmptyText : false,
//                         params : {
//                             tableName:tableName,
//                             // materialType:materialtype,
//                             s : "[" + s + "]",
//                         },
//                         success : function(response) {
//                             Ext.MessageBox.alert("提示", "录入成功！");
//                             // me.close();
// //									var obj = Ext.decode(response.responseText);
// //									if (obj) {
// //										Ext.MessageBox.alert("提示", "保存成功！");
// //										me.close();
// //									} else {
// //										// 数据库约束，返回值有问题
// //										Ext.MessageBox.alert("提示", "保存失败！");
// //									}
//                         },
//                         failure : function(response) {
//                             Ext.MessageBox.alert("提示", "录入失败！");
//                         }
//                     });
//                 }
//             },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    handler: function() {
                        var sm = Ext.getCmp('addTypeGrid').getSelectionModel();
                        var Arr = sm.getSelection();
                        //类型id
                        console.log('------',Arr)
                        var typeId = Arr[0].data.id;
                        var value = Arr[0].data.typeName;

                        if (Arr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + Arr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除

                                    Ext.Ajax.request({
                                        url:"data/EditCellById.do",  //EditDataById.do
                                        params:{
                                            type:'delete',
                                            tableName:tableName,
                                            field:'typeName',
                                            value:value,
                                            id:typeId
                                        },
                                        success:function (response) {
                                            Ext.MessageBox.alert("提示", "删除成功!");
                                            Ext.getCmp('addTypeGrid').getStore().remove(Arr);
                                        },
                                        failure : function(response){
                                            Ext.MessageBox.alert("提示", "删除失败!");
                                        }
                                    })
                                } else {
                                    return;
                                }
                            });
                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }
                    }
                }
            ]
        });

        var MtypeStore = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:[],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableNameWithLimit.do?tableName='+tableName,//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage
                }
            },
            autoLoad : true
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addTypeGrid',
            // dockedItems : [toolbar2],
            tbar:toolbar2,
            store : MtypeStore,
            columns : [
                {
                    // header: '序号',
                    xtype: 'rownumberer',
                    width: 60,
                    align: 'center',
                    sortable: false,
                },
                {dataIndex : 'typeName', text : '原材料类型', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'materialPrefix', text : '品号前缀', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                // {
                //     xtype:'actioncolumn',
                //     text : '删除操作',
                //     width:100,
                //     style:"text-align:center;",
                //     items: [
                //         //删除按钮
                //         {
                //             icon: 'extjs/imgs/delete.png',
                //             tooltip: 'Delete',
                //             style:"margin-right:20px;",
                //             handler: function(grid, rowIndex, colIndex) {
                //                 var rec = grid.getStore().getAt(rowIndex);
                //                 console.log("删除--------：",rec.data.typeName)
                //                 console.log("删除--------：",rec.data.id)
                //                 //类型id
                //                 var typeId = rec.data.id;
                //                 //弹框提醒
                //                 Ext.Msg.show({
                //                     title: '操作确认',
                //                     message: '将删除数据，选择“是”否确认？',
                //                     buttons: Ext.Msg.YESNO,
                //                     icon: Ext.Msg.QUESTION,
                //                     fn: function (btn) {
                //                         if (btn === 'yes') {
                //                             Ext.Ajax.request({
                //                                 url:"data/EditCellById.do",  //EditDataById.do
                //                                 params:{
                //                                     type:'delete',
                //                                     tableName:tableName,
                //                                     field:'typeName',
                //                                     value:rec.data.typeName,
                //                                     id:typeId
                //                                 },
                //                                 success:function (response) {
                //                                     Ext.MessageBox.alert("提示", "删除成功!");
                //                                     Ext.getCmp('addTypeGrid').getStore().remove(rec);
                //                                 },
                //                                 failure : function(response){
                //                                     Ext.MessageBox.alert("提示", "删除失败!");
                //                                 }
                //                             })
                //                         }
                //                     }
                //                 });
                //                 // alert("Terminate " + rec.get('firstname'));
                //             }
                //         }]
                //
                // }
                 ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // selType : 'rowmodel',
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: MtypeStore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var id=e.record.data.id
                    //修改的字段
                    var field=e.field;
                    //修改的值
                    var newV = e.value;
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            type:'edit',
                            tableName:tableName,
                            field:field,
                            value:newV,
                            id:id
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            //重新加载
                            Ext.getCmp('addTypeGrid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
            }
        });

        // this.dockedItems = [ grid];//toolbar2,
        this.items = [ grid ];
        this.callParent(arguments);

    }

})

