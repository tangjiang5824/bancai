Ext.define('oldpanel.oldpanel_Back_copy', {
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
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
            }
        });
        var projectNameListStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
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
        var classificationListStore = Ext.create('Ext.data.Store',{
            fields : [ 'classificationName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=classification',
                reader : {
                    type : 'json',
                    rootProperty: 'classification',
                },
            },
            autoLoad : true
        });
        var classificationList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '分类',
            labelWidth : 70,
            width : 230,
            id :  'classification',
            name : 'classification',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'classificationName',
            valueField: 'classificationId',
            editable : false,
            store: classificationListStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(classificationList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var projectNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            width : '35%',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectNameListStore,
            listeners: {

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });

                },

                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : true,
                        listeners:{
                            load:function () {
                                Ext.getCmp('buildingName').setValue("");
                            }
                        }
                    });

                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);

                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedProjectName.do',
                    // 	params:{
                    // 		projectName:Ext.getCmp('projectName').getValue()
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })
                }
            }

        });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 60,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
            listeners: {
                load:function () {


                    // // projectName:Ext.getCmp('projectName').getValue();
                    // // buildingName:Ext.getCmp('buildingName').getValue();
                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedBuildingName.do',
                    // 	params:{
                    // 		//projectName:Ext.getCmp('projectName').getValue(),
                    // 		buildingName:Ext.getCmp('buildingName').getValue(),
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })

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
                projectNameList,buildingName,
            ]
        });


        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                //oldpanelTypeList,
                {xtype: 'textfield', fieldLabel: '旧板品名', id: 'oldpanelName', width: 190, labelWidth: 60,
                    //margin: '0 10 0 40',
                    name: 'oldpanelNo', value: ""},
                classificationList,

                {xtype: 'textfield', fieldLabel: '库存单位', id: 'inventoryUnit', width: 220, labelWidth: 60,
                    //margin: '0 10 0 40',
                    name: 'inventoryUnit', value: ""},
                // {xtype: 'textfield', fieldLabel: '仓库名称', id: 'warehouseName', width: 220, labelWidth: 60,
                //     //margin: '0 10 0 40',
                //     name: 'warehouseName', value: ""},

            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                // {xtype: 'textfield', fieldLabel: '长一', id: 'length', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'length', value: ""},
                // {xtype: 'textfield', fieldLabel: '长二', id: 'length2', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'length2', value: ""},
                // {xtype: 'textfield', fieldLabel: '宽一', id: 'width', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width', value: ""},
                // {xtype: 'textfield', fieldLabel: '宽二', id: 'width2', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width2', value: ""},
                // {xtype: 'textfield', fieldLabel: '宽三', id: 'width3', width: 150, labelWidth: 30, margin: '0 10 0 85', name: 'width3', value: ""},
                {xtype: 'textfield', fieldLabel: '单面积', id: 'unitArea', width: 220, labelWidth: 50,  name: 'unitArea', value: ""},
                {xtype: 'textfield', fieldLabel: '单重', id: 'unitWeight', width: 220, labelWidth: 30, /*margin: '0 10 0 40',*/ name: 'unitWeight', value: ""},
                //{xtype: 'textfield', fieldLabel: '总面积', id: 'totalArea', width: 220, labelWidth: 50,  name: 'totalArea', value: ""},
                //{xtype: 'textfield', fieldLabel: '总重', id: 'totalWeight', width: 220, labelWidth: 30, name: 'totalWeight', value: ""},
                {xtype: 'textfield', fieldLabel: '备注', id: 'remark', width: 220, labelWidth: 30, name: 'remark', value: ""},
            ]
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                storePosition,
                {xtype: 'textfield', fieldLabel: '入库数量', id: 'number', width: 190, labelWidth: 30,  name: 'number', value: ""},
                {
                    xtype: 'textfield',
                    margin: '0 0 0 40',
                    fieldLabel: ' 入库人',
                    id: 'operator',
                    width: 150,
                    labelWidth: 45,
                    name: 'operator',
                    value: "",
                },
                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var classificationName = Ext.getCmp('classification').getValue();
                        var oldpanelName = Ext.getCmp('oldpanelName').getValue();
                        var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var number = Ext.getCmp('number').getValue();
                        var unitWeight = Ext.getCmp('unitWeight').getValue();
                        var unitArea = Ext.getCmp('unitArea').getValue();
                        var remark = Ext.getCmp('remark').getValue();
                        var warehouseName = Ext.getCmp('storePosition').getValue();
                        var data = [{
                            //'projectName':projectName,
                            //'buildingName':buildingName,
                            'unitWeight' : unitWeight,
                            'classificationName':classificationName,
                            'unitArea' : unitArea,
                            'warehouseName':warehouseName,
                            'remark' : remark,
                            'oldpanelName' : oldpanelName,
                            'inventoryUnit' : inventoryUnit,
                            'number' : number,
                        }];
                        Ext.getCmp('addDataGrid').getStore().loadData(data, true);
                    }
                }
            ]
        });

        //确认入库按钮，
        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar3",
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
                            projectId : Ext.getCmp("projectName").getValue(),
                            buildingId : Ext.getCmp("buildingName").getValue(),
                            operator: Ext.getCmp('operator').getValue(),
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
                fields: [//'projectName','buildingName',
                    'oldpanelName','classificationName','inventoryUnit','unitArea',
                    'unitWeight',//'totalArea','totalWeight'，'length', 'width',
                    'number','weight','warehouseName','remark','number']
            },

            columns : [

                {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {text: '分类', dataIndex: 'classificationName', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'unitArea', text : '单面积', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'unitWeight', text : '单重', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'number', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

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

