Ext.define('oldpanel.oldpanel_Basic_Info',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板基础信息录入',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel";
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
        //出库or入库选择
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
            renderTo: Ext.getBody()
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
            renderTo: Ext.getBody()
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
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody()
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
            renderTo: Ext.getBody()
        });
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            dock: 'top',
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
                {xtype : 'button',
                    //margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var format1 = Ext.getCmp('oldpanel_basic_info_format1').getValue();
                        var format1_info = Ext.getCmp('format1_info').getValue();//getValue();
                        var format2 = Ext.getCmp('oldpanel_basic_info_format2').getValue();
                        var format2_info = Ext.getCmp('format2_info').getValue();
                        var format3 = Ext.getCmp('oldpanel_basic_info_format3').getValue();
                        var format3_info = Ext.getCmp('format3_info').getValue();
                        var format4 = Ext.getCmp('oldpanel_basic_info_format4').getValue();
                        var format4_info = Ext.getCmp('format4_info').getValue();
                        var data = [{
                            //'oldpanelTypeName' : oldpanelTypeName,
                            'format1' : format1,
                            'format1_info' : format1_info,
                            'format2' : format2,
                            'format2_info' : format2_info,
                            'format3' : format3,
                            'format3_info' : format3_info,
                            'format4' : format4,
                            'format4_info' : format4_info,
                        }];
                        //点击查询获得输入的数据
                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        Ext.getCmp('oldpanel_Query_Records_specific_data_grid').getStore().loadData(data, true);
                    }
                }
            ],
        });
        var oldpanel_Query_Records_Store = Ext.create('Ext.data.Store',{
            id: 'oldpanel_Query_Records_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "oldpanel/oldpanel_query_records.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    // username : Ext.getCmp('userName').getValue(),
                    // endTime : Ext.getCmp('endTime').getValue(),
                    // startTime:Ext.getCmp('startTime').getValue(),
                    // projectId:Ext.getCmp('projectName').getValue(),
                    // optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        // username : Ext.getCmp('userName').getValue(),
                        // endTime : Ext.getCmp('endTime').getValue(),
                        // startTime:Ext.getCmp('startTime').getValue(),
                        // projectId:Ext.getCmp('projectName').getValue(),
                        // optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),

                    });
                }

            }


        });

        //弹出框
        var oldpanel_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'oldpanel_Query_Records_specific_data_grid',
            dock: 'bottom',
            columns:[
                {text: '旧板名称', dataIndex: 'oldpanelName', flex :1, width:"80"},
                {text: '数量', flex :1, dataIndex: 'count'}
            ],
            flex:1,
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field = e.field
                    var id = e.record.data.id
                },
            }
        });
        var oldpanel_Query_Records_win_showoldpanelData = Ext.create('Ext.window.Window', {
            id:'oldpanel_Query_Records_win_showoldpanelData',
            title: '旧板出入库详细信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'close',
            items:oldpanel_Query_Records_specific_data_grid,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'oldpanel_Query_Records_Main',
            store: oldpanel_Query_Records_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                // {text: '操作员',  dataIndex: 'username',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                // {text: '操作类型', dataIndex: 'type', flex :1,
                //     //枚举，1：出库，0：入库
                //     renderer: function (value) {
                //         return Soims.model.application.ApplicationState[value].name; // key-value
                //     },
                //     editor:{xtype : 'textfield', allowBlank : false}
                // },
                // {text: '操作时间', dataIndex: 'time', flex :1 , editor:{xtype : 'textfield', allowBlank : false},
                //     renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                // },
                // { text: '项目名称', dataIndex: 'projectName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                {text: '字段1',  dataIndex: 'oldpanel_basic_info_format1',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {text: '字段2',  dataIndex: 'oldpanel_basic_info_format2',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {text: '字段3',  dataIndex: 'oldpanel_basic_info_format3',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {text: '字段4',  dataIndex: 'oldpanel_basic_info_format4',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar:toobar,
            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: oldpanel_Query_Records_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                //监听修改
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index){
                    var select = record.data;
                    var id = select.id;
                    //操作类型opType
                    var opType = select.type;
                    console.log(id);
                    console.log(opType)
                    var oldpanellogdetailList = Ext.create('Ext.data.Store',{
                        fields:['oldpanelName','length','width','oldpanelType','count'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=oldpanellogdetail&columnName=oldpanellogId&columnValue='+id,
                            reader : {
                                type : 'json',
                                rootProperty: 'oldpanellogdetail',
                            },
                        },
                        autoLoad : true
                    });
                    // 根据出入库0/1，决定弹出框表格列名
                    var col = oldpanel_Query_Records_specific_data_grid.columns[1];
                    if(opType == 1){
                        col.setText("出库数量");
                    }
                    if(opType == 2){
                        col.setText("退库数量");
                    }
                    else{
                        col.setText("入库数量");
                    }


                    oldpanel_Query_Records_specific_data_grid.setStore(oldpanellogdetailList);
                    console.log(oldpanellogdetailList);
                    Ext.getCmp('oldpanel_Query_Records_win_showoldpanelData').show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})