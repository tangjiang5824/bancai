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
                url : 'oldpanel/oldpanelType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typeList',
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
            displayField: 'oldpanelName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
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
                    fieldLabel: '长一',
                    id: 'length',
                    width: 100,
                    labelWidth: 40,
                    name: 'length',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '长二',
                    //labelSeparator: '',
                    id: 'length2',
                    labelWidth: 40,
                    width: 100,
                    margin: '0 10 0 85',
                    name: 'length2',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 85',
                    fieldLabel: '宽一',
                    id: 'width',
                    width: 100,
                    labelWidth: 40,
                    name: 'width',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '宽二',
                    //labelSeparator: '',
                    id: 'width2',
                    labelWidth: 40,
                    width: 100,
                    margin: '0 10 0 85',
                    name: 'width2',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '宽三',
                    //labelSeparator: '',
                    id: 'width3',
                    labelWidth: 40,
                    width: 100,
                    margin: '0 10 0 85',
                    name: 'width3',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '品号',
                    //labelSeparator: '',
                    id: 'oldpanelNo',
                    labelWidth: 40,
                    width: 160,
                    margin: '0 10 0 85',
                    name: 'oldpanelNo',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '旧板名称',
                    //labelSeparator: '',
                    id: 'oldpanelName',
                    labelWidth: 40,
                    width: 160,
                    margin: '0 10 0 85',
                    name: 'oldpanelName',
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
                    fieldLabel: '库存单位',
                    id: 'inventoryUnit',
                    width: 187,
                    labelWidth: 30,
                    name: 'inventoryUnit',
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
                    fieldLabel: '重量',
                    id: 'weight',
                    width: 220,
                    labelWidth: 60,
                    name: 'weight',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 50',
                    fieldLabel: '仓库编号',
                    id: 'warehouseNo',
                    width: 220,
                    labelWidth: 60,
                    name: 'warehouseNo',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 50',
                    fieldLabel: '存放位置',
                    id: 'position',
                    width: 220,
                    labelWidth: 60,
                    name: 'position',
                    value: "",
                },
                {
                    xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var oldpanelType = Ext.getCmp('oldpanelName').getValue();
                        var length = Ext.getCmp('length').getValue();
                        var length2 = Ext.getCmp('length2').getValue();
                        var width = Ext.getCmp('width').getValue();
                        var width2 = Ext.getCmp('width2').getValue();
                        var width3 = Ext.getCmp('width3').getValue();
                        var oldpanelNo = Ext.getCmp('oldpanelNo').getValue();
                        var oldpanelName = Ext.getCmp('oldpanelNo').getValue();
                        var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var number = Ext.getCmp('number').getValue();
                        var weight = Ext.getCmp('weight').getValue();
                        var warehouseNo = Ext.getCmp('warehouseNo').getValue();
                        var position = Ext.getCmp('position').getValue();
                        var data = [{
                            '旧板类型' : oldpanelType,
                            '长一' : length ,
                            '长二' : length2 ,
                            '宽一' : width,
                            '宽二' : width2,
                            '宽三' : width3,
                            '品号' : oldpanelNo,
                            '旧板名称' : oldpanelName,
                            '库存单位' : inventoryUnit,
                            '数量' : number,
                            '重量' : weight,
                            '仓库编号' : warehouseNo,
                            '存放位置' : position,
                        }];
                        //点击查询获得输入的数据


                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        Ext.getCmp('addDataGrid').getStore().loadData(data, true);
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
                        url : 'oldpanel/addData.do', //原材料入库
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
                fields: ['旧板类型','长一','长二','宽一','宽二','宽三','品号','旧板名称','库存单位','数量','重量','仓库编号','存放位置']
            },

            columns : [{
                dataIndex : '旧板类型',
                name : '旧板类型',
                text : '旧板类型',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '长一',
                name : '长一',
                text : '长一',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '长二',
                name : '长二',
                text : '长二',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '宽一',
                name : '宽一',
                text : '宽一',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '宽二',
                name : '宽二',
                text : '宽二',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '宽三',
                name : '宽三',
                text : '宽三',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }
            },{
                dataIndex : '品号',
                name : '品号',
                text : '品号',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '旧板名称',
                name : '旧板名称',
                text : '旧板名称',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '库存单位',
                name : '库存单位',
                text : '库存单位',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '数量',
                name : '数量',
                text : '数量',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '重量',
                name : '重量',
                text : '重量',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '仓库编号',
                name : '仓库编号',
                text : '仓库编号',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : '存放位置',
                name : '存放位置',
                text : '存放位置',
                //width : 110,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

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

