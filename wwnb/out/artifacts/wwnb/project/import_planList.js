Ext.define('project.import_planList', {
    extend : 'Ext.panel.Panel',
    id:'Upload_Data22',
    region : 'center',
    layout : "fit",
    title : '原材料入库',
    //requires : [ 'component.TableList', "component.YearList" ],
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
        var tableName="material";
        //var materialtype="1";

        //新增表项和保存的按钮

        var MaterialStore1 = Ext.create('Ext.data.Store',{
            id: 'MaterialStore1',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,

                        //materialType:materialType

                    });
                }

            }


        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain1',
            store: MaterialStore1,
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
                { text: '位置-行', dataIndex: 'rowNO',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '位置-列', dataIndex: 'columNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}
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

        var form1 = Ext.create("Ext.form.Panel", {
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
                                        // var projectId = Ext.getCmp("projectName").getValue();
                                        // var buildingId = Ext.getCmp("buildingName").getValue();

                                        form1.submit({
                                            url : 'oldpanel/uploadMatchExcel.do', //上传excel文件，并回显数据

                                            waitMsg : '正在上传...',
                                            params : {
                                                projectId:'71',//projectId
                                                buildingId:'1',//buildingId
                                            },
                                            success : function(form, action) {
                                                //上传成功
                                                var response = action.result;
                                                //回显
                                                console.log('1100000')
                                                console.log(action.result['value']);
                                                Ext.MessageBox.alert("提示", "上传成功!");
                                                //重新加载数据
                                                MaterialStore1.loadData(action.result['value']);

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
                                                        Ext.MessageBox.alert("错误", "上传出错");
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
                {tableName:"原材料信息表"},
                {tableName:"旧版信息表"},
                {tableName:"产品信息表"}
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
                form1
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
                        if(tableName=='原材料信息表'){
                            window.location.href = encodeURI('excel/原材料信息表.xls');
                        }else{
                            window.location.href = encodeURI('excel/旧版信息表.xls');
                            //window.location.href = encodeURI('data/downloadExcelTemplate.do?tableName=' + tableName);
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
                store: MaterialStore1,   // same store GridPanel is using    uploadMaterialRecordsStore
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

