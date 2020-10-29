Ext.define('project.management.queryproject',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目信息查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="project_username_statusName";
        //var materialType="1";
        //项目是否为预加工项目：枚举类型
        Ext.define('Project.check.State', {
            statics: { // 关键
                0: { value: '0', name: '否' },
                1: { value: '1', name: '是' },
                // 2: { value: '2', name: '已驳回' },
                null: { value: 'null', name: '无' },
            }
        });
        var tableListStore = Ext.create('Ext.data.Store',{
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

        var record_start = 0;

        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            width : 550,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'projectName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: tableListStore,
            listeners: {
                change : function(combo, record, eOpts) {
                    if(this.callback) {
                        if(combo.lastSelection && combo.lastSelection.length>0) {
                            this.callback(combo.lastSelection[0]);
                        }
                    }
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

                //下拉框默认返回的第一个值
                // render: function (combo) {//渲染
                //     combo.getStore().on("load", function (s, r, o) {
                //         combo.setValue(r[0].id);//第一个值
                //     });
                // }
            }

        });

        var toolbar_top = Ext.create("Ext.toolbar.Toolbar", {
            // dock : "top",
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>查询条件:</strong>',
                }
            ]
        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [

                tableList,
                {
                    xtype:'tbtext',
                    text:'项目时间:',
                    margin : '0 10 0 20',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'startTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'startTime',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    id :'endTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'endTime',
                    value:"",
                },
                {
                    xtype:'tbtext',
                    text:'项目计划时间:',
                    margin : '0 10 0 20',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'proStartTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'proStartTime',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    id :'proEndTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'proEndTime',
                    value:"",
                }]
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

        var toobar_2 = Ext.create('Ext.toolbar.Toolbar',{
            dock:'top',
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '项目负责人',
                //     id :'projectLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'projectLeader',
                //     value:"",
                // },
                {
                    fieldLabel : '计划负责人',
                    xtype : 'combo',
                    name : 'planLeader',
                    id : 'planLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true
                },
                {
                    fieldLabel : '生产负责人',
                    xtype : 'combo',
                    name : 'produceLeader',
                    id : 'produceLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '采购负责人',
                    xtype : 'combo',
                    name : 'purchaseLeader',
                    id : 'purchaseLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '财务负责人',
                    xtype : 'combo',
                    name : 'financeLeader',
                    id : 'financeLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '仓库负责人',
                    xtype : 'combo',
                    name : 'storeLeader',
                    id : 'storeLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype : 'button',
                    text: '查询',
                    iconCls:'right-button',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        console.log("项目id：",Ext.getCmp('projectName').value)
                        console.log("项目名：",Ext.getCmp('projectName').rawValue)
                        Query_Project_Store.load({
                            params : {
                                projectId:Ext.getCmp('projectName').value,
                                projectName:Ext.getCmp('projectName').rawValue,//获取显示字段
                                startTime:Ext.getCmp('startTime').getValue(),
                                endTime:Ext.getCmp('endTime').getValue(),
                                proStartTime:Ext.getCmp('proStartTime').getValue(),
                                proEndTime:Ext.getCmp('proEndTime').getValue(),
                                planLeader:Ext.getCmp('planLeader').getValue(),
                                produceLeader:Ext.getCmp('produceLeader').getValue(),
                                purchaseLeader:Ext.getCmp('purchaseLeader').getValue(),
                                financeLeader:Ext.getCmp('financeLeader').getValue(),
                                storeLeader:Ext.getCmp('storeLeader').getValue(),
                            }
                        });
                    }
                }
                // ,{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '采购负责人',
                //     id :'purchaseLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'purchaseLeader',
                //     value:"",
                //
                // },{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '财务负责人',
                //     id :'financeLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'financeLeader',
                //     value:"",
                //
                // },{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '仓库负责人',
                //     id :'storeLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'storeLeader',
                //     value:"",
                // }
                ]
        });


        //项目信息store
        var Query_Project_Store = Ext.create('Ext.data.Store',{
            id: 'Query_Project_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                // url : "material/findAllBytableName.do?tableName="+tableName,
                url:"/project/findprojectBycondition.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    //totalProperty: 'totalCount'
                },
                params:{
                    // start: 0,
                    // limit: itemsPerPage
                    //后面需要添加
                    //tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({


                    });
                }

            }


        });


        //弹出表格，楼栋信息表
        var building_grid_query=Ext.create('Ext.grid.Panel',{
            id : 'building_grid_query',
            // store:store1,//specificMaterialList，store1的数据固定
            dock: 'bottom',
            // bbar:toolbar4,
            columns:[
                {
                    text: '楼栋编号',
                    dataIndex: 'buildingNo',
                    flex :1
                },{
                    dataIndex : 'buildingName',
                    text : '楼栋名',
                    flex :1
                },{
                    dataIndex : 'buildingLeaderName',
                    text : '楼栋负责人',
                    flex :1
                }
            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],

        });

        //弹出窗口
        var win_showbuildingData_query = Ext.create('Ext.window.Window', {
            // id:'win_showbuildingData_query',
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            // tbar:toolbar5,
            items:building_grid_query,
            closeAction : 'hidden',
            modal:true,//模态窗口，背景窗口不可编辑
        });

        var archive_form = new Ext.form.FormPanel({
            // title:'新建原材料退库表',
            autoHeight: true,
            autoWidth: true,
            layout: 'form',
            border: false,
            bodyStyle:'text-align:center;',
            // height:700,
            // baseCls : 'my-panel-no-border',  //去掉边框

            items: [{
                columnWidth: .3,
                rowHeight:200,
                xtype: 'fieldset',
                title: '基本信息',
                layout: 'form',
                defaults: {anchor: '95%'},
                style: 'margin-left: 5px;padding-left: 5px;',
                width:500,
                bodyStyle:'text-align:center;',
                // 第一列中的表项
                items:[
                    {
                        xtype: 'textfield',
                        margin: '0 40 0 0',
                        fieldLabel: '退库人',
                        id: 'oprator',
                        width: 140,
                        height:80,
                        labelWidth: 50,
                        name: 'oprator',
                        value: "",
                        allowBlank:false,
                    },
                    {
                        xtype: 'datefield',
                        margin: '0 10 0 0',
                        fieldLabel: '退库时间',
                        id: 'backTime',
                        labelWidth : 60,
                        width : 180,
                        height:80,
                        name: 'backTime',
                        value: "",
                        format : 'Y-m-d',
                        editable : false,
                        matchFieldWidth: true,
                    }
                ]
            }],

        });
        // var form = new Ext.form.FieldSet({
        //     title: '新建原材料退库表',
        //     layout: 'form',
        //     border:true,
        //     defaults: {anchor: '95%'},
        //     style: 'margin-left: 5px;padding-left: 5px;',
        //     // height:300,
        //     // 第二列中的表项
        //     bodyStyle:'text-align:center;',
        //     items: [archive_form]
        // });

        //项目信息表
        var grid = Ext.create('Ext.grid.Panel',{
            id: 'Query_Project_Main',
            title:'项目信息',
            store: Query_Project_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            items:archive_form,
            columns : [
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start　+　1　+　rowIndex;
                    }
                },
                { text: '项目名称', dataIndex: 'projectName', flex :1 },
                { text: '开始时间',  dataIndex: 'startTime' ,flex :1},
                { text: '结束时间', dataIndex: 'endTime', flex :0.7 },
                { text: '预计开始时间', dataIndex: 'proStartTime', flex :0.7 },
                { text: '预计结束时间', dataIndex: 'proEndTime', flex :0.7 },
                { text: '计划负责人',  dataIndex: 'planLeaderName' ,flex :1},
                { text: '生产负责人', dataIndex: 'produceLeaderName', flex :1},
                { text: '采购负责人', dataIndex: 'purchaseLeaderName', flex :1},
                { text: '财务负责人', dataIndex: 'financeLeaderName', flex :1},
                { text: '仓库负责人', dataIndex: 'storeLeaderName', flex :1},
                { text: '是否为预加工项目', dataIndex: 'isPreprocess', flex :1,
                    renderer: function (value) {
                        return Project.check.State[value].name; // key-value
                    },
                },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // tbar: toobar_2,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: Query_Project_Store,   // same store GridPanel is using
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
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            //console.log(response.responseText);
                        }
                    })
                },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data
                    //项目id
                    var projectId = select.id;//项目名对应的id

                    console.log("iiiii")
                    console.log(projectId)

                    var buildinglList_projectId = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['buildingNo','buildingName','buildingLeader'],
                        proxy : {
                            type : 'ajax',
                            url : 'project/findBuilding.do?projectId='+projectId,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            },
                            // params:{
                            //     materialName:materialName,
                            //     // start: 0,
                            //     // limit: itemsPerPage
                            // }
                        },
                        autoLoad : true
                    });

                    building_grid_query.setStore(buildinglList_projectId);
                    win_showbuildingData_query.show();
                }
            }
        });


        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },{
            xtype : 'toolbar',
            dock : 'top',
            items : [toobar]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toobar_2]
        },
        ];
        this.items = [grid];
        this.callParent(arguments);
    }
})