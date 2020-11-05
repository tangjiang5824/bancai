Ext.define('preprocess.preprocess_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '预加工半成品出入库记录查询',
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

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        var tableName_pre_records='preprocess_log_view';
        //var materialType="1";
        //操作类型：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '入库' },
                1: { value: '1', name: '出库' },
                2: { value: '2', name: '退库' },
                3: { value: '3', name: '撤销入库' },
                4: { value: '4', name: '撤销出库' },
                5: { value: '5', name: '撤销退库' },
                null: { value: 'null', name: '无' },
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
                },
                //下拉框搜索
                beforequery :function(e){
                    var combo = e.combo;
                    combo.collapse();//收起
                    var value = combo.getValue();
                    if (!e.forceAll) {//如果不是通过选择，而是文本框录入
                        combo.store.clearFilter();
                        combo.store.filterBy(function(record, id) {
                            var text = record.get(combo.displayField);
                            // 用自己的过滤规则,如写正则式
                            return (text.indexOf(value) != -1);
                        });
                        combo.onLoad();//不加第一次会显示不出来
                        combo.expand();
                        return false;
                    }
                    if(!value) {
                        //如果文本框没值，清除过滤器
                        combo.store.clearFilter();
                    }
                },
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
            name: 'preprocess_query_records_optionType',
            id: 'preprocess_query_records_optionType',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 160,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        //职员信息
        var workerListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=department_worker',
                reader : {
                    type : 'json',
                    rootProperty: 'department_worker',
                },
            },
            autoLoad : true
        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            dock: 'top',
            items: [
                {
                    fieldLabel : '操作员',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                // {
                //     xtype: 'textfield',
                //     margin : '0 20 0 5',
                //     fieldLabel: '操作员',
                //     id :'operator',
                //     width: 150,
                //     labelWidth: 50,
                //     name: 'operator',
                //     value:"",
                // },
                projectName,
                optionType,
                {
                    xtype:'tbtext',
                    text:'操作时间:',
                    margin : '0 0 0 20',
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    // fieldLabel : '开始时间',
                    width : 120,
                    // labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    // fieldLabel : '结束时间',
                    width : 120,
                    // labelWidth : 60,
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
                        preprocess_Query_Records_store.load({
                            params : {
                                operator : Ext.getCmp('operator').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                projectId:Ext.getCmp('projectName').getValue(),
                                type:Ext.getCmp('preprocess_query_records_optionType').getValue(),
                                tableName:tableName_pre_records,
                            }
                        });
                    }
                },
            ]
        });


        var preprocess_Query_Records_store = Ext.create('Ext.data.Store',{
            id: 'preprocess_Query_Records_store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/material_query_records.do",
                //url : 'material/findAllbyTableNameAndOnlyOneCondition.do?',//获取同类型的原材料
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    operator : Ext.getCmp('operator').getValue(),//获取用户名
                    endTime : Ext.getCmp('endTime').getValue(),
                    startTime:Ext.getCmp('startTime').getValue(),
                    projectId:Ext.getCmp('projectName').getValue(),
                    type:Ext.getCmp('preprocess_query_records_optionType').getValue(),
                    tableName:tableName_pre_records,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        operator : Ext.getCmp('operator').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectId:Ext.getCmp('projectName').getValue(),
                        type:Ext.getCmp('preprocess_query_records_optionType').getValue(),
                        tableName:tableName_pre_records,
                    });
                }
            }

        });

        var sampleData=[{
            materiallogId:'1',
            materialName:'Zeng',
            count:'2',
            specification:'ttt',
        }];
        var preprocess_Query_Records_store1=Ext.create('Ext.data.Store',{
            id: 'preprocess_Query_Records_store1',
            fields:['原材料名称','数量'],
            data:sampleData
        });


        //弹出框
        var preprocess_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'preprocess_Query_Records_specific_data_grid',
            store:preprocess_Query_Records_store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '产品名',
                    dataIndex: 'productName',
                    flex :1,
                    width:"80"
                },
                // {
                //     text: '长',
                //     dataIndex: 'length'
                // },{
                //     text: '类型',
                //     dataIndex: 'materialType'
                // },{
                //     text: '宽',
                //     dataIndex: 'width'
                // },
                {
                    // id:'outOrinNum',
                    text: '数量',
                    flex :1,
                    dataIndex: 'count'
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            //selType:'checkboxmodel',
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

        var preprocess_Query_Records_win_showmaterialData = Ext.create('Ext.window.Window', {
            // id:'preprocess_Query_Records_win_showmaterialData',
            title: '预加工半成品出入库详细信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            items:preprocess_Query_Records_specific_data_grid,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Records_Main',
            store: preprocess_Query_Records_store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                // { text: '原材料领料记录单编号', dataIndex: 'id', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '操作员',  dataIndex: 'workerName' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {   text: '操作类型',
                    dataIndex: 'type' ,
                    flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                { text: '操作时间',
                    dataIndex: 'time',
                    flex :1 ,
                    editor:{xtype : 'textfield', allowBlank : false},
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                { text: '项目名称', dataIndex: 'projectName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            tbar:toobar,
            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: preprocess_Query_Records_store,   // same store GridPanel is using
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
                    console.log("records----:",record);
                    var select = record.data;
                    var id = select.id;
                    //操作类型opType
                    var opType = select.type;
                    console.log(id);
                    console.log(opType)
                    var preprocesslogdetailList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','width','materialType','count'],
                        //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                        //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                        proxy : {
                            type : 'ajax',
                            // url: 'material/findMaterialLogdetails.do?materiallogId=' + id,
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=preprocess_logdetail_productName&columnName=preprocesslogId&columnValue='+id,//获取同类型的原材料
                            reader : {
                                type : 'json',
                                rootProperty: 'preprocess_logdetail_productName',
                            },
                        },
                        autoLoad : true
                    });
                    // 根据出入库0/1，决定弹出框表格列名
                    var col = preprocess_Query_Records_specific_data_grid.columns[1];
                    if(opType == 1){
                        col.setText("出库数量");
                    }
                    if(opType == 2){
                        col.setText("退库数量");
                    }
                    else{
                        col.setText("入库数量");
                    }

                    preprocess_Query_Records_specific_data_grid.setStore(preprocesslogdetailList);
                    console.log(preprocesslogdetailList);
                    preprocess_Query_Records_win_showmaterialData.show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})