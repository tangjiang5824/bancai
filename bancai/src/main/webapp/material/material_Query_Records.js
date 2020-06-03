Ext.define('material.material_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料出入库记录查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";
        //操作类型：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                1: { value: '1', name: '出库' },
                0: { value: '0', name: '入库' }
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
            width : 180,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: false,
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

        //出库or入库选择
        var optionTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"1", "name":"入库"},
                {"abbr":"0", "name":"出库"},
                //...
            ]
        });

        var optionType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '操作类型',
            name: 'material_query_records_optionType',
            id: 'material_query_records_optionType',
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
                    id :'userName',
                    width: 150,
                    labelWidth: 50,
                    name: 'userName',
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
                    // handler:function(){
                    //     var records=grid2.getSelectionModel().getSelection();
                    //     MaterialList2.remove(records);
                    //     MaterialList.add(records);
                    // }
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
                        material_Query_Records_Store.load({
                            params : {
                                username : Ext.getCmp('userName').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startTime:Ext.getCmp('startTime').getValue(),
                                projectId:Ext.getCmp('projectName').getValue(),
                                optionType:Ext.getCmp('material_query_records_optionType').getValue(),
                            }
                        });
                    }
                },
            ]
        });

        var material_Query_Records_Store = Ext.create('Ext.data.Store',{
            id: 'material_Query_Records_Store',
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
                    username : Ext.getCmp('userName').getValue(),//获取用户名
                    endTime : Ext.getCmp('endTime').getValue(),
                    startTime:Ext.getCmp('startTime').getValue(),
                    projectId:Ext.getCmp('projectName').getValue(),
                    optionType:Ext.getCmp('material_query_records_optionType').getValue(),
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        username : Ext.getCmp('userName').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectId:Ext.getCmp('projectName').getValue(),
                        optionType:Ext.getCmp('material_query_records_optionType').getValue(),

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
        var material_Query_Records_store1=Ext.create('Ext.data.Store',{
            id: 'material_Query_Records_store1',
            fields:['原材料名称','数量'],
            data:sampleData
        });


        //弹出框
        var material_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'material_Query_Records_specific_data_grid',
            store:material_Query_Records_store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '原材料名',
                    dataIndex: 'materialName',
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
                    dataIndex: 'number'
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
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

        var material_Query_Records_win_showmaterialData = Ext.create('Ext.window.Window', {
            id:'material_Query_Records_win_showmaterialData',
            title: '原材料出入库详细信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'close',
            items:material_Query_Records_specific_data_grid,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Records_Main',
            store: material_Query_Records_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                // { text: '原材料领料记录单编号', dataIndex: 'id', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '操作员',  dataIndex: 'username' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                {   text: '操作类型',
                    dataIndex: 'type' ,
                    flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                    },
                { text: '操作时间', dataIndex: 'time', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '项目名称', dataIndex: 'projectName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar:toobar,
            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: material_Query_Records_Store,   // same store GridPanel is using
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
                    var materiallogdetailList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','width','materialType','number'],
                        //fields:['materialName','length','materialType','width','number'],//'oldpanelId','oldpanelName','count'
                        proxy : {
                            type : 'ajax',
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=materiallogdetail&columnName=materiallogId&columnValue='+id,//获取同类型的原材料
                            reader : {
                                type : 'json',
                                rootProperty: 'materiallogdetail',
                            },
                        },
                        autoLoad : true
                    });
                    // 根据出入库0/1，决定弹出框表格列名
                    var col = material_Query_Records_specific_data_grid.columns[1];
                    if(opType == 1){
                        col.setText("出库数量");
                    }
                    else{
                        col.setText("入库数量");
                    }


                    material_Query_Records_specific_data_grid.setStore(materiallogdetailList);
                    console.log(materiallogdetailList);
                    Ext.getCmp('material_Query_Records_win_showmaterialData').show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})