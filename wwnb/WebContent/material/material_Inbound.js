Ext.define('material.material_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '原材料入库',
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
        var tableName="material";
        //var materialtype="1";

        // var MaterialNameList =  Ext.create('Ext.data.Store', {
        //     fields: ['materialName'],
        //     data : [
        //         {materialName:"W"},
        //         {materialName:"BS"},
        //         {materialName:"BP"}
        //         //...
        //     ]
        // });
        // var MaterialTypeList = Ext.create('Ext.form.ComboBox', {
        //     fieldLabel : '原材料类型',
        //     labelWidth : 70,
        //     width : 230,
        //     name : 'table',
        //     emptyText : "--请选择--",
        //     store: MaterialNameList,
        //     queryMode: 'local',
        //     displayField: "materialName",
        //     valueField: "materialName",
        //     editable : false,
        // });


        var MaterialNameList = Ext.create('Ext.data.Store',{
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
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料类型',
            labelWidth : 70,
            width : 230,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'materialType',
            editable : false,
            store: MaterialNameList,
            listeners:{
                select: function(combo, record, index) {
                    //console.log(record[0].data.materialName);
                }
            }

        });


        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                MaterialTypeList,
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
            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [

                 {
                    xtype: 'textfield',
                    fieldLabel: '宽',
                    //labelSeparator: '',
                    id: 'width',
                    labelWidth: 20,
                    width: 180,
                    margin: '0 10 0 48',
                    name: 'width',
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
                    xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',

                    handler : function() {

                        //var tabName = Ext.getCmp('tabName').getValue();
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
                            url : 'addMaterial.do', //
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                tableName:tableName,
                                //materialType:materialtype,
                                s : "[" + s + "]",
                            },
                            success : function(response) {
                                Ext.MessageBox.alert("提示", "保存成功！");
                                me.close();
                            },
                            failure : function(response) {
                                Ext.MessageBox.alert("提示", "保存失败！");
                            }
                        });

                    }
                }

            ]
        });

        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        '材料名' : '',
                        '品号' : '',
                        '长' : '',
                        '类型' : '',
                        '宽' : '',
                        '规格' : '',
                        '库存' : '',
                        '库存单位' : '',
                        '仓库编号' : '',
                        '数量' : '',
                        '成本' : '',
                        '存放位置' : '',


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

					//var tabName = Ext.getCmp('tabName').getValue();
                    // console.log(cycleStart);
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
                        url : 'addMaterial.do', //
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            //materialType:materialtype,
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "保存成功！");
                            me.close();

                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "保存失败！");
                        }
                    });

                }
            }]
        });

        var grid1 = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            dockedItems : [toolbar],
            //tbar: toobar,

            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },

            selType : 'rowmodel'
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            store : {
                fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
//				fields : ['fieldName', 'fieldType', 'taxUnitCode',
//						'taxUnitName', 'isNull', 'fieldCheck', 'width']
            },

            columns : [{
                dataIndex: '材料名',
                text: '材料名',
                //width : 110,
                editor: {// 文本字段
                    xtype: 'textfield',
                    allowBlank: false,
                }
            },{
                dataIndex : '品号',
                name : '品号',
                text : '品号',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
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

            },{
                dataIndex : '规格',
                text : '规格',
                //width : 192,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                dataIndex : '库存单位',
                text : '库存单位',
                //width : 110,
                editor : {// 文本字段
                    id : 'isNullCmb',
                    xtype : 'textfield',
                    allowBlank : false

                }

            }, {
                dataIndex : '仓库编号',
                name : '仓库编号',
                text : '仓库编号',
                //width : 130,

                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
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
            toolbar1,

            grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

