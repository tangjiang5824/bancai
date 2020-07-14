Ext.define('material.material_Basic_Info_Input', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '原材料基础信息录入',
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
            fieldLabel : '原材料分类',
            labelWidth : 80,
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


        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [

                {xtype: 'textfield', fieldLabel: '原材料品名', id: 'materialName', width: 300, labelWidth: 80,
                    //margin: '0 10 0 40',
                    name: 'materialName', value: ""},
                materialTypeList,
                {xtype: 'textfield', fieldLabel: '方向', id: 'orientation', width: 150, labelWidth: 40, margin: '0 10 0 40', name: 'orientation', value: ""},

            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: 'm值', id: 'mValue', width: 150, labelWidth: 30, margin: '0 10 0 40', name: 'mValue', value: ""},
                {xtype: 'textfield', fieldLabel: 'n值', id: 'nValue', width: 150, labelWidth: 30, margin: '0 10 0 40', name: 'nValue', value: ""},

                //     {xtype: 'textfield', fieldLabel: '备注', id: 'description', width: 220, labelWidth: 30, margin: '0 10 0 10',name: 'description', value: ""},
            //
            ]
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                //oldpanelTypeList,
                {xtype: 'textfield', fieldLabel: 'a值', id: 'aValue', width: 150, labelWidth: 30, margin: '0 10 0 40', name: 'aValue', value: ""},
                {xtype: 'textfield', fieldLabel: 'b值', id: 'bValue', width: 150, labelWidth: 30, margin: '0 10 0 40', name: 'bValue', value: ""},

            ]
        });
        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                //oldpanelTypeList,
                {xtype: 'textfield', fieldLabel: 'p值', id: 'pValue', width: 150, labelWidth: 30, margin: '0 10 0 40', name: 'pValue', value: ""},
                {xtype: 'textfield', fieldLabel: '库存单位', id: 'inventoryUnit', width: 180, labelWidth: 60,
                    margin: '0 10 0 10',
                    name: 'inventoryUnit', value: ""},
            ]
        });
        var toolbar4 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                // materialTypeList,
                {xtype: 'textfield', fieldLabel: '备注', id: 'description', width: 520, labelWidth: 40, margin: '0 10 0 40',name: 'description', value: ""},
                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var typeId = Ext.getCmp('typeId').getValue();
                        var materialName = Ext.getCmp('materialName').getValue();
                        var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        //var number = Ext.getCmp('number').getValue();
                        var unitWeight = Ext.getCmp('unitWeight').getValue();
                        var unitArea = Ext.getCmp('unitArea').getValue();
                        var aValue = Ext.getCmp('aValue').getValue();
                        var bValue = Ext.getCmp('bValue').getValue();
                        var mValue = Ext.getCmp('mValue').getValue();
                        var nValue = Ext.getCmp('nValue').getValue();
                        var pValue = Ext.getCmp('pValue').getValue();
                        var orientation = Ext.getCmp('orientation').getValue();
                        var description = Ext.getCmp('description').getValue();
                        //var warehouseName = Ext.getCmp('storePosition').getValue();
                        var data = [{
                            // 'unitWeight' : unitWeight,
                            'typeId':typeId,
                            // 'unitArea' : unitArea,
                            'description' : description,
                            'materialName' : materialName,
                            'inventoryUnit' : inventoryUnit,
                            'aValue':aValue,
                            'bValue':bValue,
                            'mValue':mValue,
                            'nValue':nValue,
                            'pValue':pValue,
                            'orientation':orientation,
                        }];
                        Ext.getCmp('addDataGrid').getStore().loadData(data, true);
                    }
                },
            ]
        });

        //确认添加按钮，
        var toolbarconfirm = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbarconfirm",
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [
                {
                    xtype: 'textfield',
                    margin: '0 20 0 0',
                    fieldLabel: ' 入库人',
                    id: 'operator',
                    width: 150,
                    labelWidth: 45,
                    name: 'operator',
                    value: "",
                },
                {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认添加',
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
                    console.log(s);
                    //获取数据
                    //获得当前操作时间
                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                    Ext.Ajax.request({
                        url : 'oldpanel/addInfo.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            s : "[" + s + "]",
                            //projectId : Ext.getCmp("projectName").getValue(),
                            //buildingId : Ext.getCmp("buildingName").getValue(),
                            //operator: Ext.getCmp('operator').getValue(),
                        },
                        success : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","添加成功" );
                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","添加失败" );
                        }
                    });

                }
            }]
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            store : {
                fields: [//'projectName','buildingName',
                    'materialName','typeId',
                    //'classificationId',
                    'inventoryUnit','unitArea',
                    'unitWeight','description','aValue','bValue','mValue','nValue','orientation']
            },

            columns : [


                {dataIndex : 'typeId', text : '类型', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'unitArea', text : '单面积', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'unitWeight', text : '单重', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                //{dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'description', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'aValue', text : 'a值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'bValue', text : 'b值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'mValue', text : 'm值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'nValue', text : 'n值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'orientation', text : '方向', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'pValue', text : 'p值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

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
        this.dockedItems = [ toolbar, toolbar1,toolbar2,toolbar3,toolbar4, grid, toolbarconfirm];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

