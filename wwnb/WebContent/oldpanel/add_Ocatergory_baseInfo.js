Ext.define('oldpanel.add_Ocatergory_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增新的旧版类型',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("oldpanel.add_Ocatergory_baseInfo");
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
        var tableName="oldpaneltype";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增种类',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'name' : '',
                        //'长' : '',
                        'oldpanelTypeName' : '',
                        // '宽' : '',
                        // '数量' : '',
                        // '库存单位' : '',
                        // '仓库编号' : '',
                        // '存放位置' : '',
                        // '重量' : '',
                    }];
                    //Ext.getCmp('addDataGrid')返回定义的对象
                    Ext.getCmp('addDataGrid').getStore().loadData(data,
                        true);

                }

            }, {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '保存',

                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var select = Ext.getCmp('addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                    });
                    //alert(s);//数组s存放表格中的数据，每条数据以json格式存放

                    Ext.Ajax.request({
                        url : '？？？？？', //HandleDataController
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            // materialType:materialtype,
                            s : "[" + s + "]",
                            //userid: userid + ""
//									tableName : tabName,
//									organizationId : organizationId,
//									tableType : tableType,
//									uploadCycle : uploadCycle,
//									cycleStart : cycleStart

                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "保存成功！");
                            me.close();
//									var obj = Ext.decode(response.responseText);
//									if (obj) {
//
//										Ext.MessageBox.alert("提示", "保存成功！");
//										me.close();
//
//									} else {
//										// 数据库约束，返回值有问题
//										Ext.MessageBox.alert("提示", "保存失败！");
//
//									}

                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "保存失败！");
                        }
                    });

                }
            }]
        });
        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            dockedItems : [toolbar2],
            store : {
                //fields: ['旧板名称', '长','类型','宽','数量','库存单位','仓库编号','存放位置','重量']
                fields: ['name', 'oldpanelTypeName']
            },
            columns : [{
                dataIndex : 'name',
                name : '旧版名称',
                text : '旧版名称',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
                //     {
                //     dataIndex : '长',
                //     name : '长',
                //     text : '长',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //     }
                // },
                {
                    dataIndex : 'oldpanelTypeName',
                    name : '旧版类型',
                    text : '旧版类型',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                //     {
                //     dataIndex : '宽',
                //     name : '宽',
                //     text : '宽',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //
                //     }
                //
                // },{
                //     dataIndex : '数量',
                //     name : '数量',
                //     text : '数量',
                //     //width : 192,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
                // }, {
                //     dataIndex : '库存单位',
                //     name : '库存单位',
                //     text : '库存单位',
                //     //width : 110,
                //     editor : {// 文本字段
                //         // id : 'isNullCmb',
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
                // }, {
                //     dataIndex : '存放位置',
                //     name : '存放位置',
                //     text : '存放位置',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
                // },{
                //     dataIndex : '重量',
                //     name : '重量',
                //     text : '重量',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
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
            selType : 'rowmodel'
        });

        this.dockedItems = [ grid];//toolbar2,
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

