Ext.define('material.add_Mcatergory_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增原材料基础信息',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("material.add_Mcatergory_baseInfo");
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
        var tableName="materialtype";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增原材料',
                margin:'0 40 0 0',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'materialName':'',
                        'typeId':'',
                        'specification':'',
                        'aValue':'',
                        'bValue':'',
                        'nValue':'',
                        'mValue':'',
                        'pValue':'',
                        'orientation':'',
                        'inventoryUnit':'',
                        'description' : '',
                    }];
                    //Ext.getCmp('addMaterialBasicGrid')返回定义的对象
                    Ext.getCmp('addMaterialBasicGrid').getStore().loadData(data,
                        true);
                }
            }, {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '保存',
                margin:'0 40 0 0',
                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var select = Ext.getCmp('addMaterialBasicGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                    });
                    if(s.length>0){
                        Ext.Ajax.request({
                            url : 'material/insertIntoMaterialInfo.do', //HandleDataController
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                               // tableName:tableName,
                                // materialType:materialtype,
                                s : "[" + s + "]",
                                //userid: userid + ""
                            },
                            success : function(response) {
                                Ext.MessageBox.alert("提示", "录入成功！");
                                Ext.getCmp("addMaterialBasicGrid").getStore().removeAll();
                            },
                            failure : function(response) {
                                Ext.MessageBox.alert("提示", "录入失败！");
                            }
                        });
                    }
                }
            }, {
                xtype: 'button',
                iconAlign: 'center',
                iconCls: 'rukuicon ',
                text: '删除',
                handler: function () {
                    var sm = Ext.getCmp('addMaterialBasicGrid').getSelectionModel();
                    var Arr = sm.getSelection();
                    //类型id
                    if (Arr.length != 0) {
                        Ext.Msg.confirm("提示", "共选中" + Arr.length + "条数据，是否确认删除？", function (btn) {
                            if (btn == 'yes') {
                                //先删除后台再删除前台
                                //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                //Extjs 4.x 删除
                                Ext.getCmp('addMaterialBasicGrid').getStore().remove(Arr);
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
            // fieldLabel : '原材料分类',
            // labelWidth : 80,
            // width : 230,
            // margin: '0 10 0 40',
            id :  'typeId',
            name : 'typeId',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'typeName',
            forceSelection: true,
            valueField: 'id',
            editable : false,
            triggerAction: 'all',
            selectOnFocus:true,
            store: materialTypeListStore,
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addMaterialBasicGrid',
            tbar:toolbar2,
            // dockedItems : [toolbar2],
            store : {
                //fields: ['旧板名称', '长','类型','宽','数量','库存单位','仓库编号','存放位置','重量']
                fields: ['materialName','width','specification','unitWeight','inventoryUnit','description']
            },
            columns : [
                {
                    dataIndex : 'materialName',
                    name : '原材料名称',
                    text : '原材料名称',
                    //width : 110,
                    flex :1,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },

                {
                    dataIndex : 'typeId',
                    text : '原材料类型',
                    flex :.6,
                    allowBlank:false,
                    editor:materialTypeList,renderer:function(value, cellmeta, record){
                        var index = materialTypeListStore.find(materialTypeList.valueField,value);
                        var ehrRecord = materialTypeListStore.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('typeName');
                        }
                        return returnvalue;
                    }
                },
                {dataIndex : 'specification', text : '规格', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'aValue', text : 'a值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'bValue', text : 'b值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'nValue', text : 'n值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'mValue', text : 'm值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'pValue', text : 'p值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'orientation', text : '方向', flex :.6, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :.6, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'description', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {
                //     // name : '操作',
                //     text : '操作',
                //     renderer:function(value, cellmeta){
                //         return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
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


        // this.dockedItems = [ grid];//toolbar2,
        this.items = [ grid ];
        this.callParent(arguments);

    }

})

