Ext.define('product.add_Pcatergory_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增产品类型',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("product.add_Pcatergory_baseInfo");
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
        // var tableName="productbasicinfo";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增产品类型',
                handler : function() {
                    var data = [{
                        'productTypeName':'',
                        'description' : ''
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
                        url : 'material/insertIntoProductbasicinfo.do', //HandleDataController
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
            id : 'addDataGrid',
            dockedItems : [toolbar2],
            store : {
                fields: ['productTypeName','description']
            },
            columns : [{
                dataIndex : 'productTypeName',
                name : '产品名称',
                text : '产品名称',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
                {
                dataIndex : 'description',
                name : '描述',
                text : '描述',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,
                }

            }],
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

        this.dockedItems = [grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

