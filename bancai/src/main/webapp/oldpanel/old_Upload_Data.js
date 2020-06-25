Ext.define('oldpanel.old_Upload_Data', {
    extend : 'Ext.panel.Panel',
    id:'old_Upload_Data',
    region : 'center',
    layout : "fit",
    title : '旧板批量入库',
    // requires : [ 'component.TableList', "component.YearList" ],
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("data.UploadDataTest");
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
        var tableName="oldpanel";
        //var oldpaneltype="1";

        //新增表项和保存的按钮

        var oldpanelStore = Ext.create('Ext.data.Store',{
            id: 'oldpanelStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,

                        //oldpanelType:oldpanelType

                    });
                }

            }


        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: oldpanelStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                // {dataIndex : 'oldpanelType', text : '旧板类型', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                // {dataIndex : 'length', text : '长一', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'length2', text : '长二', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                // {dataIndex : 'width', text : '宽一', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'width2', text : '宽二', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                // {dataIndex : 'width3', text : '宽三', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                // {dataIndex : 'oldpanelNo', text : '品号', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'specification', text : '规格', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'countStore', text : '数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'weight', text : '重量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'warehouseNo', text : '仓库编号', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'rowNo', text : '行', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'columNo', text : '列', flex :1, editor : {xtype : 'textfield', allowBlank : false,}}
                {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'classificationName', text : '分类', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'countUse', text : '可用数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'countStore', text : '库存数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'unitArea', text : '单面积', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'unitWeight', text : '单重', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'totalArea', text : '总面积', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'totalWeight', text : '总重', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'length', text : '长', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'width', text : '宽', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: MaterialStore,   // same store GridPanel is using    uploadMaterialRecordsStore
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }],
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

        var form = Ext.create("Ext.form.Panel", {
            border : false,
            items : [ {
                xtype : 'filefield',
                width : 400,
                margin: '1 0 0 0',
                buttonText : '上传数据文件',
                name : 'uploadFile',
                //id : 'uploadFile',
                listeners : {
                    change : function(file, value, eOpts) {
                        if (value.indexOf('.xls',value.length-4)==-1) {
                            Ext.Msg.alert('错误', '文件格式错误，请重新选择xls格式的文件！')
                        } else {
                            Ext.Msg.show({
                                title : '操作确认',
                                message : '将上传数据，选择“是”否确认？',
                                buttons : Ext.Msg.YESNO,
                                icon : Ext.Msg.QUESTION,
                                fn : function(btn) {
                                    if (btn === 'yes') {
                                        //var check=Ext.getCmp("check").getValue();

                                        form.submit({
                                            url : 'uploadOldpanelExcel.do', //上传excel文件，并回显数据
                                            waitMsg : '正在上传...',
                                            params : {
                                                tableName:tableName,
                                                //materialtype:materialtype,
                                                //check:check
                                            },
                                            success : function(form, action) {
                                                //上传成功
                                                var response = action.result;
                                                //回显
                                                console.log('1100000')
                                                console.log(action.result['value']);
                                                Ext.MessageBox.alert("提示", "上传成功!");
                                                //重新加载数据
                                                oldpanelStore.loadData(action.result['value']);

                                            },
                                            failure : function(form, action) {
                                                var response = action.result;
                                                switch (response.errorCode) {
                                                    case 0:
                                                        Ext.MessageBox.alert("错误", "上传批次或者所属期错误，重新生成上传批次和所属期!");
                                                        break;
                                                    case 1:
                                                        Ext.MessageBox.alert("错误", "上传文件中的批次与生成的上传批次不同，请检查上传文件!");
                                                        me.showMsgGrid([ "name", "input", "expected" ], response.value, [ {
                                                            text : "错误字段",
                                                            dataIndex : "name",
                                                            width : 100
                                                        }, {
                                                            text : "上传文件中的值",
                                                            dataIndex : "input",
                                                            width : 200
                                                        }, {
                                                            text : "期望值",
                                                            dataIndex : "expected",
                                                            width : 100
                                                        } ]);
                                                        break;
                                                    case 2:
                                                        Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
                                                        me.showMsgGrid([ "name", "value" ], response.value, [ {
                                                            text : "错误描述",
                                                            dataIndex : "name",
                                                            width : 250
                                                        }, {
                                                            text : "错误字段",
                                                            dataIndex : "value",
                                                            width : 400
                                                        } ]);
                                                        break;
                                                    case 3:
                                                        Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
                                                        me.showMsgGrid([ "row", "col", "value", "type" ], response.value, [ {
                                                            text : "出错行",
                                                            dataIndex : "row",
                                                            width : 100
                                                        }, {
                                                            text : "出错列",
                                                            dataIndex : "col",
                                                            width : 250
                                                        }, {
                                                            text : "出错值",
                                                            dataIndex : "value",
                                                            width : 250
                                                        }, {
                                                            text : "期望类型",
                                                            dataIndex : "type",
                                                            width : 250
                                                        } ]);
                                                        break;
                                                    case 1000:
                                                        Ext.MessageBox.alert("错误", "上传文件出现未知错误，请检查上传文件格式！<br>若无法解决问题，请联系管理员！");
                                                        Ext.MessageBox.alert("错误原因", response.msg);
                                                        break;
                                                    default:
                                                        Ext.MessageBox.alert("错误", "服务器异常，请检查网络连接，或者联系管理员");
                                                }

                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }

            ]
        });


        var tableNameList =  Ext.create('Ext.data.Store', {
            fields: ['tableName'],
            data : [
                {tableName:"旧板信息表"},
                //{tableName:"原材料信息表"},
                //{tableName:"产品信息表"}
                //...
            ]
        });
        var tableList = Ext.create('Ext.form.ComboBox', {
            fieldLabel : '数据表类型',
            labelWidth : 70,
            width : 400,
            name : 'table',
            emptyText : "--请选择--",
            store: tableNameList,
            queryMode: 'local',
            displayField: "tableName",
            valueField: "tableName",
            editable : false,
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [
                form
            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items : [ tableList,{
                xtype : 'button',
                text : '下载模板',
                handler : function() {
                    var tableName = tableList.getValue();
                    if (tableName != null) {
                        if(tableName=='旧板信息表'){
                            window.location.href = encodeURI('excel/旧板信息表.xls');
                        }else{
                            Ext.Msg.alert('消息', '下载失败！');
                        }
                    } else {
                        Ext.Msg.alert('消息', '请选择数据类型！');
                    }
                }
            },
                // {
                //     text: '当前时间：'+Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                //     layout:'left'
                // }
            ]
        });

        this.dockedItems = [toolbar1,toolbar,grid,
            {
                xtype: 'pagingtoolbar',
                store: oldpanelStore,   // same store GridPanel is using    uploadMaterialRecordsStore
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }
        ];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

