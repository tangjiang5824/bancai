Ext.define('oldpanel.oldpanel_Back', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '旧板退库',
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
        //var materialtype="1";
        var projectListStore = Ext.create('Ext.data.Store',{
            fields : ['id'],
            proxy : {
                type : 'ajax',
                url : 'project/findProjectList.do',
                reader : {
                    type : 'json',
                    rootProperty: 'projectList',
                }
            },
            autoLoad : true
        });
        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名称',
            labelWidth : 70,
            width : '35%',
            id :  'id',
            name : 'id',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }
        });

        //仓库编号
        var storeNameList = Ext.create('Ext.data.Store',{
            fields : [ 'warehouseName'],
            proxy : {
                type : 'ajax',
                url : 'material/findStore.do', //查询所有的仓库编号
                reader : {
                    type : 'json',
                    rootProperty: 'StoreName',
                }
            },
            autoLoad : true
        });
        var storePosition = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '仓库名',
            labelWidth : 50,
            width : 200,
            margin: '0 10 0 20',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'warehouseNo',
            editable : false,
            store: storeNameList,
            listeners:{
                select: function(combo, record, index) {
                    var type = oldpanelTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //选中后
                    var select = record[0].data;
                    var warehouseNo = select.warehouseNo;
                    console.log(warehouseNo)

                    //重新加载行选项
                    var locationNameList_row = Ext.create('Ext.data.Store',{
                        id:'locationNameList_row',
                        fields : ['rowNum'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
                            reader : {
                                type : 'json',
                                rootProperty: 'rowNum',
                            }
                        },
                        autoLoad : true
                    });
                    speificLocation_row.setStore(locationNameList_row);

                    //重新加载列选项
                    var locationNameList_col = Ext.create('Ext.data.Store',{
                        id:'locationNameList_col',
                        fields : [ 'columnNum'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
                            reader : {
                                type : 'json',
                                rootProperty: 'columnNum',
                            }
                        },
                        autoLoad : true
                    });
                    speificLocation_col.setStore(locationNameList_col);

                }
            }
        });
        //仓库存放位置--行
        var speificLocation_row = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '行',
            labelWidth : 20,
            width : 80,
            margin: '0 10 0 10',
            id :  'speificLocation_row',
            name : 'speificLocation_row',
            matchFieldWidth: false,
            //emptyText : "--请选择--",
            displayField: 'rowNum',
            valueField: 'rowNum',
            editable : false,
            //store: locationNameList_row,
            listeners:{
                select: function(combo, record, index) {
                    var type = oldpanelTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }
        });
        //仓库存放位置--列
        var speificLocation_col = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '列',
            labelWidth : 20,
            width : 80,
            id :  'speificLocation_col',
            name : 'speificLocation_col',
            matchFieldWidth: false,
            //emptyText : "--请选择--",
            displayField: 'columnNum',
            valueField: 'columnNum',
            editable : false,
            //store: locationNameList_col,
            listeners:{
                select: function(combo, record, index) {
                    var type = oldpanelTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }
        });

        var oldPanelNameList = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelName'],
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
            displayField: 'oldpanelTypeName',
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

        var toolbar0 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                projectList,oldpanelTypeList,
            ]
        });


        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: '品号', id: 'oldpanelNo', width: 190, labelWidth: 30, margin: '0 10 0 85', name: 'oldpanelNo', value: ""},
                {xtype: 'textfield', fieldLabel: '旧板名称', id: 'oldpanelName', width: 220, labelWidth: 60, margin: '0 10 0 85', name: 'oldpanelName', value: ""},
                {xtype: 'textfield', fieldLabel: '库存单位', id: 'inventoryUnit', width: 220, labelWidth: 60, margin: '0 10 0 40', name: 'inventoryUnit', value: ""},
                {xtype: 'textfield', fieldLabel: '规格', id: 'specification', width: 220, labelWidth: 60, margin: '0 10 0 40', name: 'specification', value: ""},
            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: '长一', id: 'length', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'length', value: ""},
                {xtype: 'textfield', fieldLabel: '长二', id: 'length2', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'length2', value: ""},
                {xtype: 'textfield', fieldLabel: '宽一', id: 'width', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width', value: ""},
                {xtype: 'textfield', fieldLabel: '宽二', id: 'width2', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width2', value: ""},
                {xtype: 'textfield', fieldLabel: '宽三', id: 'width3', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width3', value: ""},
            ]
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: '数量', id: 'number', width: 190, labelWidth: 30, margin: '0 10 0 70', name: 'number', value: ""},
                {xtype: 'textfield', fieldLabel: '重量', id: 'weight', width: 190, labelWidth: 30, margin: '0 10 0 50', name: 'weight', value: ""},
                //{xtype: 'textfield', fieldLabel: '仓库编号', id: 'warehouseNo', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'warehouseNo', value: ""},
                //{xtype: 'textfield', fieldLabel: '存放位置', id: 'position', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'position', value: ""},
                storePosition,{
                    xtype:'tbtext',
                    text:'存放位置:',
                    margin: '0 0 0 20',
                    //id: 'number',
                    width: 60,
                    //labelWidth: 30,
                    //name: 'number',
                    //value: "",
                },
                speificLocation_row,
                speificLocation_col,
                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var projectId = Ext.getCmp('id').getValue();
                        var oldpanelTypeName = Ext.getCmp('oldpanelType').rawValue;//getValue();
                        var oldpanelType = Ext.getCmp('oldpanelType').getValue();
                        var length = Ext.getCmp('length').getValue();
                        var length2 = Ext.getCmp('length2').getValue();
                        var width = Ext.getCmp('width').getValue();
                        var width2 = Ext.getCmp('width2').getValue();
                        var width3 = Ext.getCmp('width3').getValue();
                        var oldpanelNo = Ext.getCmp('oldpanelNo').getValue();
                        var oldpanelName = Ext.getCmp('oldpanelName').getValue();
                        var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var specification = Ext.getCmp('specification').getValue();
                        var number = Ext.getCmp('number').getValue();
                        var weight = Ext.getCmp('weight').getValue();
                        var warehouseNo = Ext.getCmp('storePosition').getValue();
                        //var warehouseNo = Ext.getCmp('warehouseNo').getValue();
                        //var position = Ext.getCmp('position').getValue();
                        var row = Ext.getCmp('speificLocation_row').getValue();
                        var col = Ext.getCmp('speificLocation_col').getValue();
                        var data = [{
                            'projectId' : projectId,
                            'oldpanelTypeName' : oldpanelTypeName,
                            'oldpanelType' : oldpanelType,
                            'length' : length ,
                            'length2' : length2 ,
                            'width' : width,
                            'width2' : width2,
                            'width3' : width3,
                            'oldpanelNo' : oldpanelNo,
                            'oldpanelName' : oldpanelName,
                            'inventoryUnit' : inventoryUnit,
                            'specification' : specification,
                            'number' : number,
                            'weight' : weight,
                            'warehouseNo' : warehouseNo,
                            'row':row,
                            'col':col,
                            //'position' : position,
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
                text : '确认退库',
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
                        url : 'oldpanel/addData.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","退库成功" );
                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","退库失败" );
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
                fields: ['projectId','oldpanelTypeName','length','length2','width','width2','width3','oldpanelNo',
                    'oldpanelName','inventoryUnit', 'specification', 'number','weight','warehouseNo','location']
            },

            columns : [
                {dataIndex : 'projectId', text : '项目编号', hidden:true, flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'oldpanelTypeName', text : '旧板类型', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'length', text : '长一', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'length2', text : '长二', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                {dataIndex : 'width', text : '宽一', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'width2', text : '宽二', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                {dataIndex : 'width3', text : '宽三', flex :1, editor : {xtype : 'textfield', allowBlank : true,}},
                {dataIndex : 'oldpanelNo', text : '品号', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'specification', text : '规格', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'number', text : '数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'weight', text : '重量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'warehouseNo', text : '仓库编号', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'row', text : '行', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'col', text : '列', flex :1, editor : {xtype : 'textfield', allowBlank : false,}}
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
        this.dockedItems = [toolbar0, toolbar, toolbar1, toolbar2, grid, toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

