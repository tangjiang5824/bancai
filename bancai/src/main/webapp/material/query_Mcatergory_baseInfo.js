Ext.define('material.query_Mcatergory_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查看原材料类型',
    renderTo:Ext.getBody(),
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_info";

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            // clicksToMoveEditor: 1,
            // autoCancel: false,
            saveBtnText: '保存',
            cancelBtnText: '取消',
        });

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
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    // tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        materialName:Ext.getCmp('materialName').getValue(),//获取显示字段
                        typeId:Ext.getCmp('typeId').getValue(),
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

        var materialTypeListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=material_type',
                reader : {
                    type : 'json',
                    rootProperty: 'material_type',
                },
            },
            autoLoad : true
        });
        var materialTypeList=Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料类型',
            labelWidth : 70,
            width : 230,
            margin: '0 10 0 40',
            id :  'typeId',
            name : 'typeId',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'typeName',
            valueField: 'id',
            editable : false,
            store: materialTypeListStore,
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            // border:false,
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '原材料名称',
                    id :'materialName',
                    width: 180,
                    labelWidth: 70,
                    name: 'materialName',
                    value:"",
                    labelStyle:"font-size:'12px';"
                },
                materialTypeList,
                {
                    xtype : 'button',
                    text: '查询',
                    // iconCls:'right-button',
                    width: 60,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        //
                        materialInfo_Store.load({
                            params : {
                                materialName:Ext.getCmp('materialName').getValue(),//获取显示字段
                                typeId:Ext.getCmp('typeId').getValue(),
                            }
                        });
                    }
                },
                {
                    xtype : 'button',
                    text: '修改',
                    // iconCls:'right-button',
                    width: 60,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                       //打开行编辑器
                        var rowEditing = Ext.getCmp('query_MbaseInfo').editingPlugin;
                        var grid = Ext.getCmp('query_MbaseInfo');
                        var data = grid.getSelectionModel().getSelection();
                        if (data.length == 0) {
                            alert('请选择一行');
                        } else {
                            rowEditing.startEdit(data[0], 0);

                        }
                    }
                },
                {
                    xtype : 'button',
                    text: '删除',
                    // iconCls:'right-button',
                    width: 60,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        var sm = Ext.getCmp('query_MbaseInfo').getSelectionModel();
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
                                            Ext.getCmp('query_MbaseInfo').getStore().remove(Arr);
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

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'query_MbaseInfo',
            height:400,
            width:600,
            title: "原材料基础信息",
            store: materialInfo_Store,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                // { text: '原材料品名',  dataIndex: 'materialName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '原材料名称',  dataIndex: 'materialName' ,flex :1,editor : {xtype : 'textfield'}},
                { text: '原材料品号',  dataIndex: 'partNo' ,flex :1,editor : {xtype : 'textfield'}},
                {
                    dataIndex : 'typeName',
                    text : '原材料类型',
                    flex :.6,
                },
                {dataIndex : 'aValue', text : 'a值', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'bValue', text : 'b值', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'mValue', text : 'm值', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'nValue', text : 'n值', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'pValue', text : 'p值', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'orientation', text : '方向', flex :.6, editor : {xtype : 'textfield'}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :.6, editor : {xtype : 'textfield',}},
                {dataIndex : 'description', text : '备注', flex :1, editor : {xtype : 'textfield',}},
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
                //                                 // url:"data/EditCellById.do",  //EditDataById.do
                //                                 params:{
                //                                     tableName:tableName,
                //                                     id:typeId
                //                                 },
                //                                 success:function (response) {
                //                                     Ext.MessageBox.alert("提示", "删除成功!");
                //                                     Ext.getCmp('query_MbaseInfo').getStore().remove(rec);
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
                // }
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

            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 1
            // })],

            plugins : [rowEditing], //行编辑

            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field=e.field
                    var id=e.record.data.id //记录Id
                    var flag=false;
                    if(id === "" || id ==null|| isNaN(id)){
                        flag=true;
                        id='0'
                    }

                    //修改的行数据
                    var data = editor.context.newValues;
                    //每个属性值
                    var materialName = data.materialName;
                    var partNo = data.partNo;
                    var aValue = data.aValue;
                    var bValue = data.bValue;
                    var mValue = data.mValue;
                    var nValue = data.nValue;
                    var pValue = data.pValue;
                    var orientation = data.orientation;
                    var description = data.description;


                    var s = new Array();
                    //修改的一行数据
                    s.push(JSON.stringify(data));
                    // console.log("editor===",editor.context.newValues)  //

                    Ext.Ajax.request({
                        url:"material/updateMaterialInfo.do",  //修改基础信息
                        params:{
                            id:id,
                            materialName:materialName,
                            partNo:partNo,
                            aValue:aValue,
                            bValue:bValue,
                            mValue:mValue,
                            nValue:nValue,
                            pValue:pValue,
                            orientation:orientation,
                            description:description,
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            if(flag){
                                e.record.data.id=response.responseText;
                            }
                            //重新加载
                            Ext.getCmp('query_MbaseInfo').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
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