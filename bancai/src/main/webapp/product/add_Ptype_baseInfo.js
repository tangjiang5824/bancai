Ext.define('product.add_Ptype_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增产品类型',
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
        //定义表名
        var tableName="producttype";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增类型',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'typeName':'',
                    }];
                    //Ext.getCmp('addTypeGrid')返回定义的对象
                    Ext.getCmp('addTypeGrid').getStore().loadData(data,
                        true);
                }
            },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    margin: '0 0 0 40',
                    handler : function() {
                        //Ext.getCmp('addTypeGrid')返回定义的对象
                        var sm = Ext.getCmp('addTypeGrid').getSelectionModel();
                        var rec = sm.getSelection();

                        console.log("删除数据-----------：",rec[0].data)
                        console.log("删除：",rec[0].data.id);
                        var id = rec[0].data.id;

                        //弹框提醒
                        Ext.Msg.show({
                            title: '操作确认',
                            message: '将删除数据，选择“是”否确认？',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url:"product/deleteTYpe.do",  //EditDataById.do
                                        params:{
                                            id:id,
                                        },
                                        success:function (response) {
                                            Ext.MessageBox.alert("提示", "删除成功!");
                                            Ext.getCmp('addTypeGrid').getStore().remove(rec);
                                        },
                                        failure : function(response){
                                            Ext.MessageBox.alert("提示", "删除失败!");
                                        }
                                    })
                                }
                            }
                        });
                    }
                },
//                 {
//                 xtype : 'button',
//                 iconAlign : 'center',
//                 iconCls : 'rukuicon ',
//                 text : '保存',
//
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
//
//                     Ext.Ajax.request({
//                         url : 'material/insertIntoMaterialType.do', //HandleDataController
//                         method:'POST',
//                         //submitEmptyText : false,
//                         params : {
//                             tableName:tableName,
//                             // materialType:materialtype,
//                             s : "[" + s + "]",
//                             //userid: userid + ""
// //									tableName : tabName,
// //									organizationId : organizationId,
// //									tableType : tableType,
// //									uploadCycle : uploadCycle,
// //									cycleStart : cycleStart
//
//                         },
//                         success : function(response) {
//                             Ext.MessageBox.alert("提示", "录入成功！");
//
//                             // me.close();
// //									var obj = Ext.decode(response.responseText);
// //									if (obj) {
// //
// //										Ext.MessageBox.alert("提示", "保存成功！");
// //										me.close();
// //
// //									} else {
// //										// 数据库约束，返回值有问题
// //										Ext.MessageBox.alert("提示", "保存失败！");
// //
// //									}
//
//                         },
//                         failure : function(response) {
//                             Ext.MessageBox.alert("提示", "录入失败！");
//                         }
//                     });
//
//                 }
//             }
            ]
        });

        var MtypeStore = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:[],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'producttype',
                },
                // params: {
                //     tableName:'material_type'
                // }
            },
            autoLoad : true
        });
        var classificationListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=product_classification',
                reader : {
                    type : 'json',
                    rootProperty: 'product_classification',
                },
            },
            autoLoad : true
        });
        var classificationList=Ext.create('Ext.form.ComboBox',{
            // fieldLabel : '原材料分类',
            // labelWidth : 80,
            // width : 230,
            // margin: '0 10 0 40',
            id :  'classificationId',
            name : 'classificationId',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'classificationName',
            forceSelection: true,
            valueField: 'classificationId',
            editable : false,
            triggerAction: 'all',
            selectOnFocus:true,
            store: classificationListStore,
        });
        var grid = Ext.create("Ext.grid.Panel", {
            title:'产品类型',
            id : 'addTypeGrid',
            // dockedItems : [toolbar2],
            store : MtypeStore,
            columns : [
                //序号
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                {
                    dataIndex : 'productTypeName',
                    name : '产品类型名称',
                    text : '产品类型名称',
                    //width : 110,
                    flex:1,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },{
                    dataIndex : 'description',
                    name : '描述',
                    text : '描述',
                    flex:1.5,
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false
                    }
                },{
                    dataIndex : 'classificationId',
                    name : '分类',
                    text : '分类',
                    flex :0.6,
                    //width : 110,
                    editor:classificationList,renderer:function(value, cellmeta, record){
                        var index = classificationListStore.find(classificationList.valueField,value);
                        var ehrRecord = classificationListStore.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('classificationName');
                        }
                        return returnvalue;
                    }
                },
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
                clicksToEdit : 1
            })],
            selType : 'checkboxmodel',//'rowmodel'
            // selType : 'rowmodel',
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
        //dockedItems : [toolbar2],
        this.dockedItems=[
            {
                xtype : 'toolbar',
                dock : 'top',
                items : [toolbar2]
            },
        ];

        this.items = [ grid];//toolbar2,
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

