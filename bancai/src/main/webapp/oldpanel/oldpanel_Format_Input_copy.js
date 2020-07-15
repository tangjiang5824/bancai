Ext.define('oldpanel.oldpanel_Format_Input', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '旧板基础信息录入',
    // reloadPage : function() {
    //     var p = Ext.getCmp('functionPanel');
    //     p.removeAll();
    //     cmp = Ext.create("data.UploadDataTest");
    //     p.add(cmp);
    // },
    // clearGrid : function() {
    //     var msgGrid = Ext.getCmp("msgGrid");
    //     if (msgGrid != null || msgGrid != undefined)
    //         this.remove(msgGrid);
    // },

    initComponent : function() {
        var me = this;
        //var materialtype="1";
        //字段格式：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '无' },
                1: { value: '1', name: '类型' },
                2: { value: '2', name: 'm' },
                3: { value: '3', name: 'n' },
                4: { value: '4', name: 'a*b' },
                5: { value: '5', name: 'b*a' },
                6: { value: '6', name: 'm+n' },
                7: { value: '7', name: '后缀' },
                //
            }
        });
        var oldPanelNameList1 = Ext.create('Ext.data.Store',{
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
        var oldpanelTypeList1 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType1',
            name : 'oldpanelType1',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            //Hidden:true,
            store: oldPanelNameList1,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList1.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var oldPanelNameList2 = Ext.create('Ext.data.Store',{
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
        var oldpanelTypeList2 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType2',
            name : 'oldpanelType2',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList2,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList1.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var oldPanelNameList3 = Ext.create('Ext.data.Store',{
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
        var oldpanelTypeList3 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType3',
            name : 'oldpanelType3',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList3,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList1.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var oldPanelNameList4 = Ext.create('Ext.data.Store',{
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
        var oldpanelTypeList4 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType4',
            name : 'oldpanelType4',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList4,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList1.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var format1store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format1 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择1',
            name: 'oldpanel_basic_info_format1',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format1',
            store: format1store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            //margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                // render:function() {
                //     Ext.getCmp('oldpanel_basic_info_format1').setValue("无");
                //     //oldpanel_basic_info_format1.setValue(0)
                // },

                select: function(combo, record, index) {
                    //console.log(Ext.getCmp('oldpanel_basic_info_format1').rawValue)//选择的值
                    var CMB1 = Ext.getCmp('oldpanelType1');
                    var CMB2 = Ext.getCmp('oldpanelType2');
                    var CMB3 = Ext.getCmp('oldpanelType3');
                    var CMB4 = Ext.getCmp('oldpanelType4');
                    var F1 = Ext.getCmp('oldpanel_basic_info_format1').rawValue;
                    var FI1 = Ext.getCmp('format1_info');
                    var F2 = Ext.getCmp('oldpanel_basic_info_format2').rawValue;
                    var FI2 = Ext.getCmp('format2_info');
                    var F3 = Ext.getCmp('oldpanel_basic_info_format3').rawValue;
                    var FI3 = Ext.getCmp('format3_info');
                    var F4 = Ext.getCmp('oldpanel_basic_info_format4').rawValue;
                    var FI4 = Ext.getCmp('format4_info');
                    if(F1=='无'||F1=='m'||F1=='n'||F1=='a*b'||F1=='b*a'||F1=='m+n'){
                        //该类型为1000X200类型
                        FI1.setHidden(false);
                        FI1.disable(true);
                        CMB1.setHidden(true);
                    }
                    if(F1=='类型')
                    {
                        FI1.setHidden(true);
                        FI1.disable(true);
                        CMB1.setHidden(false);
                    }
                    if(F1=='后缀')
                    {
                        FI1.setHidden(false);
                        FI1.enable(true);
                        CMB1.setHidden(true);
                    }
                }
            }
        });
        // format1.on('beforerender',function(){
        //     this.value='0';
        // })
        var format2store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format2 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择2',
            name: 'oldpanel_basic_info_format2',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format2',
            store: format2store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                select: function(combo, record, index) {
                    //console.log(Ext.getCmp('oldpanel_basic_info_format1').rawValue)//选择的值
                    var F1 = Ext.getCmp('oldpanel_basic_info_format1').rawValue;
                    var FI1 = Ext.getCmp('format1_info');
                    var F2 = Ext.getCmp('oldpanel_basic_info_format2').rawValue;
                    var FI2 = Ext.getCmp('format2_info');
                    var F3 = Ext.getCmp('oldpanel_basic_info_format3').rawValue;
                    var FI3 = Ext.getCmp('format3_info');
                    var F4 = Ext.getCmp('oldpanel_basic_info_format4').rawValue;
                    var FI4 = Ext.getCmp('format4_info');
                    if(F2=='无'||F2=='m'||F2=='n'||F2=='a*b'||F2=='b*a'||F2=='m+n'){
                        //该类型为1000X200类型
                        FI1.setHidden(false);
                        FI1.disable(true);
                        CMB1.setHidden(true);
                    }
                    if(F2=='类型')
                    {
                        FI1.setHidden(true);
                        FI1.disable(true);
                        CMB1.setHidden(false);
                    }
                    if(F2=='后缀')
                    {
                        FI1.setHidden(false);
                        FI1.enable(true);
                        CMB1.setHidden(true);
                    }
                }
            }
        });
        var format3store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format3 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择3',
            name: 'oldpanel_basic_info_format3',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format3',
            store: format3store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            //margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                select: function(combo, record, index) {
                    //console.log(Ext.getCmp('oldpanel_basic_info_format1').rawValue)//选择的值
                    var F1 = Ext.getCmp('oldpanel_basic_info_format1').rawValue;
                    var FI1 = Ext.getCmp('format1_info');
                    var F2 = Ext.getCmp('oldpanel_basic_info_format2').rawValue;
                    var FI2 = Ext.getCmp('format2_info');
                    var F3 = Ext.getCmp('oldpanel_basic_info_format3').rawValue;
                    var FI3 = Ext.getCmp('format3_info');
                    var F4 = Ext.getCmp('oldpanel_basic_info_format4').rawValue;
                    var FI4 = Ext.getCmp('format4_info');
                    if(F3=='无'||F3=='m'||F3=='n'||F3=='a*b'||F3=='b*a'||F3=='m+n'){
                        //该类型为1000X200类型
                        FI1.setHidden(false);
                        FI1.disable(true);
                        CMB1.setHidden(true);
                    }
                    if(F3=='类型')
                    {
                        FI1.setHidden(true);
                        FI1.disable(true);
                        CMB1.setHidden(false);
                    }
                    if(F3=='后缀')
                    {
                        FI1.setHidden(false);
                        FI1.enable(true);
                        CMB1.setHidden(true);
                    }
                }
            }
        });
        var format4store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format4 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择4',
            name: 'oldpanel_basic_info_format4',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format4',
            store: format4store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                select: function(combo, record, index) {
                    //console.log(Ext.getCmp('oldpanel_basic_info_format1').rawValue)//选择的值
                    var F1 = Ext.getCmp('oldpanel_basic_info_format1').rawValue;
                    var FI1 = Ext.getCmp('format1_info');
                    var F2 = Ext.getCmp('oldpanel_basic_info_format2').rawValue;
                    var FI2 = Ext.getCmp('format2_info');
                    var F3 = Ext.getCmp('oldpanel_basic_info_format3').rawValue;
                    var FI3 = Ext.getCmp('format3_info');
                    var F4 = Ext.getCmp('oldpanel_basic_info_format4').rawValue;
                    var FI4 = Ext.getCmp('format4_info');
                    if(F4=='无'||F4=='m'||F4=='n'||F4=='a*b'||F4=='b*a'||F4=='m+n'){
                        //该类型为1000X200类型
                        FI1.setHidden(false);
                        FI1.disable(true);
                        CMB1.setHidden(true);
                    }
                    if(F4=='类型')
                    {
                        FI1.setHidden(true);
                        FI1.disable(true);
                        CMB1.setHidden(false);
                    }
                    if(F4=='后缀')
                    {
                        FI1.setHidden(false);
                        FI1.enable(true);
                        CMB1.setHidden(true);
                    }
                }
            }
        });
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                format1,
                {
                    xtype: 'textfield',
                    //margin : '0 20 0 20',
                    fieldLabel: '内容',
                    id :'format1_info',
                    width: 100,
                    labelWidth: 30,
                    name: 'format1_info',
                    value:"",
                },
                oldpanelTypeList1,
                format2,
                {
                    xtype: 'textfield',
                    //margin : '0 20 0 20',
                    fieldLabel: '内容',
                    id :'format2_info',
                    width: 100,
                    labelWidth: 30,
                    name: 'format2_info',
                    value:"",
                },
                oldpanelTypeList2,
            ]
        });
        //添加按钮所在toolbar
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                format3,
                {
                    xtype: 'textfield',
                    //margin : '0 20 0 20',
                    fieldLabel: '内容',
                    id :'format3_info',
                    width: 100,
                    labelWidth: 30,
                    name: 'format3_info',
                    value:"",
                },
                oldpanelTypeList3,
                format4,
                {
                    xtype: 'textfield',
                    //margin : '0 20 0 20',
                    fieldLabel: '内容',
                    id :'format4_info',
                    width: 100,
                    labelWidth: 30,
                    name: 'format4_info',
                    value:"",
                },
                oldpanelTypeList4,
                {xtype : 'button',
                    //margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        // var oldpanelTypeName = Ext.getCmp('oldpanelType').rawValue;//getValue();
                        // var oldpanelType = Ext.getCmp('oldpanelType').getValue();
                        // var oldpanelName = Ext.getCmp('oldpanelName').getValue();
                        // var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        // var number = Ext.getCmp('number').getValue();
                        // var unitWeight = Ext.getCmp('unitWeight').getValue();
                        // var totalWeight = Ext.getCmp('totalWeight').getValue();
                        // var unitArea = Ext.getCmp('unitArea').getValue();
                        // var totalArea = Ext.getCmp('totalArea').getValue();
                        // var remark = Ext.getCmp('remark').getValue();
                        // var warehouseName = Ext.getCmp('storePosition').getValue();
                        var format1 = Ext.getCmp('oldpanel_basic_info_format1').getValue()//rawValue;
                        var format1_info = Ext.getCmp('format1_info').getValue();//getValue();
                        var format2 = Ext.getCmp('oldpanel_basic_info_format2').getValue();
                        var format2_info = Ext.getCmp('format2_info').getValue();
                        var format3 = Ext.getCmp('oldpanel_basic_info_format3').getValue();
                        var format3_info = Ext.getCmp('format3_info').getValue();
                        var format4 = Ext.getCmp('oldpanel_basic_info_format4').getValue();
                        var format4_info = Ext.getCmp('format4_info').getValue();
                        var data = [{
                            'format1' : format1,
                            'format1_info' : format1_info,
                            'format2' : format2,
                            'format2_info' : format2_info,
                            'format3' : format3,
                            'format3_info' : format3_info,
                            'format4' : format4,
                            'format4_info' : format4_info,
                            //'oldpanelTypeName' : oldpanelTypeName,
                            // 'oldpanelType' : oldpanelType,
                            // 'unitWeight' : unitWeight,
                            // 'totalWeight' : totalWeight,
                            // 'unitArea' : unitArea,
                            // 'totalArea' : totalArea,
                            // 'remark' : remark,
                            // 'warehouseName' : warehouseName,
                            // 'oldpanelName' : oldpanelName,
                            // 'inventoryUnit' : inventoryUnit,
                            // 'number' : number,
                            // 'length' : length ,
                            // 'length2' : length2 ,
                            // 'width' : width,
                            // 'width2' : width2,
                            // 'width3' : width3,
                            // 'oldpanelNo' : oldpanelNo,

                            //'specification' : specification,

                            // 'weight' : weight,
                            // 'warehouseNo' : warehouseNo,
                            // 'row':row,
                            // 'col':col,
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
                text : '确认录入',
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
                        url : 'oldpanel/addOldpanelBasicInfo.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
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
                fields: ['format1','format1_info','format2','format2_info','format3','format3_info',
                    'format4','format4_info',]
            },

            columns : [
                //{dataIndex : 'format1', text : '字段1', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {text: '字段1', dataIndex: 'format1', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'format1_info', text : '字段1内容', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                //{dataIndex : 'format2', text : '字段2', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {text: '字段2', dataIndex: 'format2', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'format2_info', text : '字段2内容', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                //{dataIndex : 'format3', text : '字段3', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {text: '字段3', dataIndex: 'format3', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'format3_info', text : '字段3内容', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                //{dataIndex : 'format4', text : '字段4', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {text: '字段4', dataIndex: 'format4', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'format4_info', text : '字段4内容', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

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
            //toolbar1,
            toolbar2, grid, toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);
    },
})


