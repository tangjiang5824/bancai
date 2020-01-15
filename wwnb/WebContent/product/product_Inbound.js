Ext.define('product.product_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '产品信息录入',
    requires : [ 'component.TableList', "component.YearList" ],
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("oldpanel.Old_Upload_Data");
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
        // var tableName="materialstore";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '添加表项',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        '产品名称' : '',
                        '长' : '',
                        '类型' : '',
                        '宽' : '',
                        '重量' : '',
                        '成本' : '',
                        '操作用户' : '',
                        '上传时间' : '',
                    }];
                    //Ext.getCmp('product_Inbound_addDataGrid')返回定义的对象
                    Ext.getCmp('product_Inbound_addDataGrid').getStore().loadData(data,
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
                    var select = Ext.getCmp('product_Inbound_addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                    });
                    //alert(s);//数组s存放表格中的数据，每条数据以json格式存放

                    Ext.Ajax.request({
                        url : 'oldpanel/addData.do', //HandleDataController
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            // tableName:tableName,
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
            id : 'product_Inbound_addDataGrid',
            dockedItems : [toolbar2],
            store : {
                fields: ['产品名称', '长', '类型', '宽' , '重量', '成本', '操作用户', '上传时间',]
//				fields : ['fieldName', 'fieldType', 'taxUnitCode',
//						'taxUnitName', 'isNull', 'fieldCheck', 'width']
            },
            columns : [{
                dataIndex : '产品名称',
                name : '产品名称',
                text : '产品名称',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                dataIndex : '长',
                name : '长',
                text : '长',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            }, {
                dataIndex : '类型',
                name : '类型',
                text : '类型',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '宽',
                name : '宽',
                text : '宽',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '重量',
                name : '重量',
                text : '重量',
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
                dataIndex : '操作用户',
                name : '操作用户',
                text : '操作用户',
                //width : 160,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },{
                dataIndex : '上传时间',
                name : '上传时间',
                text : '上传时间',
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
                                        var check=Ext.getCmp("check").getValue();

                                        form.submit({
                                            url : 'oldpanel/uploadExcel.do',
                                            waitMsg : '正在上传...',
                                            params : {
                                                // tableName:tableName,
                                                // materialtype:materialtype,
                                                // check:check
                                            },
                                            success : function(form, action) {
                                                var response = action.result;
                                                Ext.MessageBox.alert("提示", "上传成功!");
//												var toolbar2 = Ext.getCmp("toolbar2");
//												var toolbar3 = Ext.getCmp("toolbar3");
//												toolbar2.setVisible(false);
//												toolbar3.setVisible(false);
//												me.showDataGrid(tableName, response.uploadId);
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
            } ]
        });

        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            //id : "toolbar2",
            items : [form]
        });

        this.dockedItems = [ toolbar2,grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

