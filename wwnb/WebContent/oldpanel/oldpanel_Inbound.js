Ext.define('oldpanel.oldpanel_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '旧板入库',
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
        var tableName="oldpanel";
        //var materialtype="1";

        var oldPanelNameList = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'material/materialType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typetList',
                }
            },
            autoLoad : true
        });
        var oldpanelTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType',
            name : 'oldpanelType',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'materialType',
            editable : false,
            store: oldPanelNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });


        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                oldpanelTypeList,
                {
                    xtype: 'textfield',
                    margin: '0 10 0 85',
                    fieldLabel: '长',
                    id: 'length',
                    width: 180,
                    labelWidth: 20,
                    name: 'length',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '宽',
                    //labelSeparator: '',
                    id: 'width',
                    labelWidth: 20,
                    width: 180,
                    margin: '0 10 0 85',
                    name: 'width',
                    value: "",
                },
            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [

                {
                    xtype: 'textfield',
                    margin: '0 10 0 40',
                    fieldLabel: '成本',
                    id: 'cost',
                    width: 187,
                    labelWidth: 30,
                    name: 'cost',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 70',
                    fieldLabel: '数量',
                    id: 'number',
                    width: 187,
                    labelWidth: 30,
                    name: 'number',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 50',
                    fieldLabel: '存放位置',
                    id: 'location',
                    width: 220,
                    labelWidth: 60,
                    name: 'location',
                    value: "",
                },
                {
                    xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var materialType = Ext.getCmp('materialName').getValue();
                        var length = Ext.getCmp('length').getValue();
                        var width = Ext.getCmp('width').getValue();
                        var cost = Ext.getCmp('cost').getValue();
                        var number = Ext.getCmp('number').getValue();
                        var location = Ext.getCmp('location').getValue();
                        var data = [{
                            '类型' : materialType,
                            '长' : length,
                            '宽' : width,
                            '数量' : number,
                            '成本' : cost,
                            '存放位置' : location,
                        }];
                        //点击查询获得输入的数据


                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        Ext.getCmp('addDataGrid').getStore().loadData(data,
                            true);
                    }
                }

            ]
        });

        //确认入库按钮，
        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar3",
            //style:{float:'center',},
            //margin-right: '2px',
            //padding: '0 0 0 750',
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '创建',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {

                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                    });

                    //获取数据
                    //获得当前操作时间
                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                    Ext.Ajax.request({
                        url : 'addMaterial.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            //materialType:materialtype,
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","入库成功" );
                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","入库失败" );
                        }
                    });

                }
            }]
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            store : {
                // fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
                fields: ['长',"类型","宽",'数量','成本','存放位置']
            },

            columns : [
            //     {
            //     dataIndex: '材料名',
            //     text: '材料名',
            //     //width : 110,
            //     editor: {// 文本字段
            //         xtype: 'textfield',
            //         allowBlank: false,
            //     }
            // },{
            //     dataIndex : '品号',
            //     name : '品号',
            //     text : '品号',
            //     //width : 110,
            //     editor : {// 文本字段
            //         xtype : 'textfield',
            //         allowBlank : false
            //     }
            // },
                {
                dataIndex : '长',
                text : '长',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            }, {
                dataIndex : '类型',
                text : '类型',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '宽',
                text : '宽',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },
            //     {
            //     dataIndex : '规格',
            //     text : '规格',
            //     //width : 192,
            //     editor : {
            //         xtype : 'textfield',
            //         allowBlank : false
            //     }
            // }, {
            //     dataIndex : '库存单位',
            //     text : '库存单位',
            //     //width : 110,
            //     editor : {// 文本字段
            //         id : 'isNullCmb',
            //         xtype : 'textfield',
            //         allowBlank : false
            //
            //     }
            //
            // }, {
            //     dataIndex : '仓库编号',
            //     name : '仓库编号',
            //     text : '仓库编号',
            //     //width : 130,
            //
            //     editor : {// 文本字段
            //         xtype : 'textfield',
            //         allowBlank : false
            //     }
            // },
                {
                dataIndex : '数量',
                name : '数量',
                text : '数量',
                //width : 160,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }

            },{
                dataIndex : '成本',
                name : '成本',
                text : '成本',
                //width : 160,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },{
                dataIndex : '存放位置',
                name : '存放位置',
                text : '存放位置',
                //width : 160,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }
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
            selType : 'rowmodel'
        });
        this.dockedItems = [toolbar,
            //toobar,
            toolbar1, grid,toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

