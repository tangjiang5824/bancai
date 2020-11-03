Ext.define('unuseMaterial.unuseMaterial_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '废料出入库记录查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";

        var tableName_material_records = 'material_log';
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

        Ext.define('rollback.model.State', {
            statics: { // 关键
                0: { value: '0', name: '-' },
                1: { value: '1', name: '已撤销' },
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
            width : 550,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
            listeners:{
                //下拉框默认返回的第一个值
                // render : function(combo) {//渲染
                //     combo.getStore().on("load", function(s, r, o) {
                //         // combo.setValue(r[0].get('projectName'));//第一个值
                //     });
                // },
                select:function (combo, record) {
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
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
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

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 0 0 40',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
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

        //出入库
        var optionType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '操作类型',
            name: 'optionType',
            id: 'optionType',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 30 0 0',
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

        var toolbar_top = Ext.create('Ext.toolbar.Toolbar',{
            dock: 'top',
            items: [
                projectName,
                buildingName,
            ]
        });
        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock: 'top',
            items: [
                {
                    fieldLabel : '操作员',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                // projectName,
                // buildingName,
                optionType,
                {
                    xtype:'tbtext',
                    text:'操作时间:',
                    margin : '0 30 0 0',
                },
                {
                    xtype : 'datefield',
                    margin : '0 30 0 0',
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
                    margin : '0 30 0 0',
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
                    // margin: '0 30 0 15',
                    layout: 'right',
                    handler: function(){
                        waste_Query_Records_Store.load({
                            params : {
                                operator : Ext.getCmp('operator').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                projectId:Ext.getCmp('projectName').getValue(),
                                buildingId:Ext.getCmp('buildingName').getValue(),
                                type:Ext.getCmp('optionType').getValue(),
                                // tableName:tableName_material_records,
                            }
                        });
                    }
                },
            ]
        });

        var waste_Query_Records_Store = Ext.create('Ext.data.Store',{
            id: 'waste_Query_Records_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "waste/queryLog.do",
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
                    buildingId:Ext.getCmp('buildingName').getValue(),
                    type:Ext.getCmp('optionType').getValue(),
                    // tableName:tableName_material_records,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        operator : Ext.getCmp('operator').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectId:Ext.getCmp('projectName').getValue(),
                        buildingId:Ext.getCmp('buildingName').getValue(),
                        type:Ext.getCmp('optionType').getValue(),
                        // tableName:tableName_material_records,
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
        var waste_Query_Records_Store1=Ext.create('Ext.data.Store',{
            id: 'waste_Query_Records_Store1',
            fields:['原材料名称','数量'],
            data:sampleData
        });


        //弹出框
        var waste_Records_specific_grid=Ext.create('Ext.grid.Panel',{
            id : 'waste_Records_specific_grid',
            store:waste_Query_Records_Store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '废料名',
                    dataIndex: 'wasteName',
                    flex :1,
                    width:"80"
                },{
                    text: '库存单位',
                    dataIndex: 'inventoryUnit'
                },
                {
                    // id:'outOrinNum',
                    text: '数量',
                    flex :1,
                    dataIndex: 'count'
                },
                {
                    text: '仓库',
                    dataIndex: 'warehouseName'
                },{
                    text: '备注',
                    dataIndex: 'remark'
                },{
                    text: '是否撤销',
                    dataIndex: 'isrollback'
                },

                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
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

        var waste_Records_win = Ext.create('Ext.window.Window', {
            // id:'waste_Records_win',
            title: '废料出入库详细信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            items:waste_Records_specific_grid,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Records_Main',
            store: waste_Query_Records_Store,
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
                { text: '项目名称', dataIndex: 'projectName', flex :1 },
                { text: '楼栋名称', dataIndex: 'buildingName', flex :1 },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
            },
            // tbar:toobar,
            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: waste_Query_Records_Store,   // same store GridPanel is using
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
                    var wasteLogId = select.wasteLogId
                    //操作类型opType
                    var opType = select.type;
                    console.log(id);
                    console.log(opType)
                    var materiallogdetailList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','width','materialType','count'],
                        //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                        proxy : {
                            type : 'ajax',
                            url: 'waste/queryLogDetail.do?wastelogId=' + wasteLogId,
                            // url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=material_logdetail&columnName=materiallogId&columnValue='+id,//获取同类型的原材料
                            reader : {
                                type : 'json',
                                rootProperty: 'value',
                            },
                        },
                        autoLoad : true
                    });
                    // 根据出入库0/1，决定弹出框表格列名
                    var col = waste_Records_specific_grid.columns[1];
                    if(opType == 1){
                        col.setText("出库数量");
                    }
                    if(opType == 2){
                        col.setText("退库数量");
                    }
                    else{
                        col.setText("入库数量");
                    }
                    waste_Records_specific_grid.setStore(materiallogdetailList);
                    console.log(materiallogdetailList);
                    waste_Records_win.show();
                }
            }
        });
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar]
            },
        ];

        this.items = [grid];
        this.callParent(arguments);
    }
})