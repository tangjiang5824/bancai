Ext.define('oldpanel.oldpanel_Format_Input', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '添加旧板格式',
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
        var record_start = 0;
        var projectId = "-1";
        var buildingId = "-1";
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
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
            valueField: 'warehouseName',
            editable : false,
            store: storeNameList,
        });

        var oldpanelTypeListStore = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelTypeName'],
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
            valueField: 'id',
            editable : false,
            store: oldpanelTypeListStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

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
        var format1 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择1',
            name: 'oldpanel_basic_info_format1',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format1',
            store: format1store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
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
        });
        var format3 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择3',
            name: 'oldpanel_basic_info_format3',//'oldpanel_query_records_optionType',
            id: 'oldpanel_basic_info_format3',
            store: format3store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
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
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                oldpanelTypeList,
                format1,
                format2,
                format3,
                format4,
                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        console.log("123zzy123"+Ext.getCmp('oldpanelType').getValue());
                        var oldpanelTypeName = Ext.getCmp('oldpanelType').rawValue;
                        var oldpanelTypeId = Ext.getCmp('oldpanelType').getValue();
                        var format1Name = Ext.getCmp('oldpanel_basic_info_format1').rawValue;
                        var format2Name = Ext.getCmp('oldpanel_basic_info_format2').rawValue;
                        var format3Name = Ext.getCmp('oldpanel_basic_info_format3').rawValue;
                        var format4Name = Ext.getCmp('oldpanel_basic_info_format4').rawValue;
                        var format1 = Ext.getCmp('oldpanel_basic_info_format1').getValue();
                        var format2 = Ext.getCmp('oldpanel_basic_info_format2').getValue();
                        var format3 = Ext.getCmp('oldpanel_basic_info_format3').getValue();
                        var format4 = Ext.getCmp('oldpanel_basic_info_format4').getValue();
                        var data = [{
                            'oldpanelTypeName' : oldpanelTypeName,
                            'oldpanelTypeId' : oldpanelTypeId,
                            'format1' : format1,
                            'format2' : format2,
                            'format3' : format3,
                            'format4' : format4,
                            'format1Name' : format1Name,
                            'format2Name' : format2Name,
                            'format3Name' : format3Name,
                            'format4Name' : format4Name,

                        }];
                        //点击查询获得输入的数据
                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        //若品名未填则添加失败
                        if (oldpanelTypeId != '') {
                            Ext.getCmp('addold_format_DataGrid').getStore().loadData(data, true);
                            //清除框里的数据
                            // Ext.getCmp('oldpanelName').setValue('');
                            // //Ext.getCmp('classification').setValue('');
                            // //Ext.getCmp('inventoryUnit').setValue('');
                            // //Ext.getCmp('unitWeight').setValue('');
                            // //Ext.getCmp('unitArea').setValue('');
                            // Ext.getCmp('count').setValue('');
                            // Ext.getCmp('storePosition').setValue('');
                            // //Ext.getCmp('remark').setValue('');
                            // Ext.getCmp('operator').setValue('');
                        }else{
                            Ext.MessageBox.alert("警告","品名、入库数量不能为空",function(r) {
                                //    r = cancel||ok
                            });
                        }
                    }
                },
                {xtype : 'button',
                    margin: '0 0 0 40',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    handler: function(){
                        var sm = Ext.getCmp('addold_format_DataGrid').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据

                                    //Extjs 4.x 删除
                                    Ext.getCmp('addold_format_DataGrid').getStore().remove(oldpanelArr);
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

        //确认添加按钮，
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
            items : [
                // {
                //     xtype: 'textfield',
                //     margin: '0 20 0 0',
                //     fieldLabel: ' 入库人',
                //     id: 'operator',
                //     width: 150,
                //     labelWidth: 45,
                //     name: 'operator',
                //     value: "",
                // },
                {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认添加',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {

                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('addold_format_DataGrid').getStore()
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
                        url : 'oldpanel/addFormat.do', //旧板格式添加
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            s : "[" + s + "]",
                            // projectId : projectId,
                            // buildingId : buildingId,
                            // operator: Ext.getCmp('operator').getValue(),
                        },
                        success : function(response) {
                            console.log("12312312312321",response.responseText);
                            if(response.responseText.includes("false"))
                            {
                                Ext.MessageBox.alert("提示","添加失败" );
                            }
                            //var message =Ext.decode(response.responseText).showmessage;
                            else{
                                Ext.MessageBox.alert("提示","添加成功" );
                                //刷新页面
                                Ext.getCmp('addold_format_DataGrid').getStore().removeAll();
                                Ext.getCmp('oldpanel_basic_info_format1').setValue('');
                                Ext.getCmp('oldpanel_basic_info_format2').setValue('');
                                Ext.getCmp('oldpanel_basic_info_format3').setValue('');
                                Ext.getCmp('oldpanel_basic_info_format4').setValue('');
                                Ext.getCmp('oldpanelType').setValue('');
                            }

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
            id : 'addold_format_DataGrid',
            //dockedItems : [toolbar2],
            store : {
                // fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
                fields: ['oldpanelName','warehouseName','count']
            },

            columns : [
                // {
                //     // dataIndex : '序号',
                //     name : '序号',
                //     text : '序号',
                //     width : 60,
                //     value:'99',
                //     renderer:function(value,metadata,record,rowIndex){
                //         return　record_start　+　1　+　rowIndex;
                //     }
                // },
                //{dataIndex : 'oldpanelTypeId', text : '旧板类型Id', flex :1,},
                {dataIndex : 'oldpanelTypeName', text : '旧板类型', flex :1,},
                {dataIndex : 'format1Name', text : '旧板格式1', flex :1,},
                {dataIndex : 'format2Name', text : '旧板格式2', flex :1,},
                {dataIndex : 'format3Name', text : '旧板格式3', flex :1,},
                {dataIndex : 'format4Name', text : '旧板格式4', flex :1,},
                {
                    name : '操作',
                    text : '操作',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
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
            selType : 'checkboxmodel'//'rowmodel'
        });

        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar2]
        },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar3]
            },
        ];

        // this.dockedItems = [
        //     //toolbar,
        //     //toobar,toolbar1,
        //     toolbar2, grid, toolbar3];
        this.items = [ grid ];
        this.callParent(arguments);

    }

})

