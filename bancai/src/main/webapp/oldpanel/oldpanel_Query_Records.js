Ext.define('oldpanel.oldpanel_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板出入库记录查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel";
        //操作类型：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '入库' },
                1: { value: '1', name: '出库' },
                2: { value: '2', name: '退库' },
                3: { value: '3', name: '撤销入库' },
                4: { value: '4', name: '撤销出库' },
                5: { value: '5', name: '撤销退库' },
                6: { value: '6', name: '增加基础信息' },
                //
            }
        });
        var projectListStore = Ext.create('Ext.data.Store',{
            fields : [ "projectName","id"],
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
        var projectName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : '35%',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }

        });

        //出库or入库选择
        var optionTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"入库"},
                {"abbr":"1", "name":"出库"},
                {"abbr":"2", "name":"退库"},
                //...
            ]
        });

        var optionType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '操作类型',
            name: 'oldpanel_query_records_optionType',
            id: 'oldpanel_query_records_optionType',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 160,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            dock: 'top',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 20 0 20',
                    fieldLabel: '操作员',
                    id :'operator',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator',
                    value:"",
                },projectName,
                optionType,
                {
                    xtype : 'datefield',
                    margin : '0 20 0 20',
                    fieldLabel : '开始时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },{
                    xtype:'tbtext',
                    text:'至',
                    itemId:'move_left',
                },
                {
                    xtype : 'datefield',
                    margin : '0 20 0 20',
                    fieldLabel : '结束时间',
                    width : 180,
                    labelWidth : 60,
                    id : "endTime",
                    name : 'endTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },{
                    xtype : 'button',
                    text: '查询操作记录',
                    width: 100,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        oldpanel_Query_Records_Store.load({
                            params : {
                                operator : Ext.getCmp('operator').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                projectId:Ext.getCmp('projectName').getValue(),
                                optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),
                            }
                        });
                    }
                },
            ]
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
                    operator : Ext.getCmp('operator').getValue(),
                    endTime : Ext.getCmp('endTime').getValue(),
                    startTime:Ext.getCmp('startTime').getValue(),
                    projectId:Ext.getCmp('projectName').getValue(),
                    optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        operator : Ext.getCmp('operator').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectId:Ext.getCmp('projectName').getValue(),
                        optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),

                    });
                }

            }


        });

        //弹出框
        var oldpanel_specific_data_grid_query=Ext.create('Ext.grid.Panel',{
            id : 'oldpanel_specific_data_grid_query',
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
        var win_showoldpanelData_query = Ext.create('Ext.window.Window', {
            id:'win_showoldpanelData_query',
            title: '旧板出入库详细信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'close',
            items:oldpanel_specific_data_grid_query,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'oldpanel_Query_Records_Main',
            store: oldpanel_Query_Records_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {text: '操作员',  dataIndex: 'operator',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {text: '操作类型', dataIndex: 'type', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {text: '操作时间', dataIndex: 'time', flex :1 , editor:{xtype : 'textfield', allowBlank : false},
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                { text: '项目名称', dataIndex: 'projectName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
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
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=oldpanel_logdetail_oldpanelName&columnName=oldpanellogId&columnValue='+id,
                            reader : {
                                type : 'json',
                                rootProperty: 'oldpanel_logdetail_oldpanelName',
                            },
                        },
                        autoLoad : true
                    });
                    // 根据出入库0/1，决定弹出框表格列名
                    var col = oldpanel_specific_data_grid_query.columns[1];
                    if(opType == 1){
                        col.setText("出库数量");
                    }
                    if(opType == 2){
                        col.setText("退库数量");
                    }
                    else{
                        col.setText("入库数量");
                    }


                    oldpanel_specific_data_grid_query.setStore(oldpanellogdetailList);
                    console.log(oldpanellogdetailList);
                    Ext.getCmp('win_showoldpanelData_query').show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})