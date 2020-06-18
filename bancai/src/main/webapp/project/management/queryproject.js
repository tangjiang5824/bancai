Ext.define('project.management.queryproject',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目信息查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="project_username_statusName";
        //var materialType="1";
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


        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            width : '35%',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'projectName',
            valueField: 'projectName',
            // typeAhead : true,
            editable : true,
            store: tableListStore,
            // listeners: {
            //
            //     //下拉框默认返回的第一个值
            //     render: function (combo) {//渲染
            //         combo.getStore().on("load", function (s, r, o) {
            //             combo.setValue(r[0].get('projectName'));//第一个值
            //         });
            //     }
            // }

        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [

                tableList,
                {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '开始时间',
                    width : 180,
                    labelWidth : 80,
                    id : "startTime",
                    name : 'startTime',
                    //align: 'right',
                    format : 'Y-m',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
                },  {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '预计结束时间',
                    width : 180,
                    labelWidth : 80,
                    id : "proEndTime",
                    name : 'proEndTime',
                    //align: 'right',
                    format : 'Y-m',
                    editable : false,
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '计划负责人',
                    id :'planLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'planLeader',
                    value:"",
                    //dataIndex:'planLeader'

                }]
        });
        var toobar_2 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '生产负责人',
                    id :'produceLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'produceLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '采购负责人',
                    id :'purchaseLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'purchaseLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '财务负责人',
                    id :'financeLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'financeLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '仓库负责人',
                    id :'storeLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeLeader',
                    value:"",

                }]
        });


        var Query_Project_Store = Ext.create('Ext.data.Store',{
            id: 'Query_Project_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/findAllBytableName.do?tableName="+tableName,
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: tableName,
                    //totalProperty: 'totalCount'
                },
                params:{
                    //start: 0,
                    //limit: itemsPerPage
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
        var building_grid=Ext.create('Ext.grid.Panel',{
            id : 'building_grid',
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
                    dataIndex : 'buildingLeader',
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
        var win_showbuildingData = Ext.create('Ext.window.Window', {
            id:'win_showbuildingData',
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            // tbar:toolbar5,
            items:building_grid,
            closeAction : 'hide',
            modal:true,//模态窗口，背景窗口不可编辑
        });

        //项目信息表
        var grid = Ext.create('Ext.grid.Panel',{
            id: 'Query_Project_Main',
            store: Query_Project_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '项目名称', dataIndex: 'projectName', flex :1 },
                { text: '开始时间',  dataIndex: 'startTime' ,flex :1},
                { text: '结束时间', dataIndex: 'endTime', flex :0.7 },
                { text: '预计结束时间', dataIndex: 'proEndTime', flex :0.7 },
                { text: '计划处负责人', dataIndex: 'planLeader',flex :1 },
                { text: '生产处负责人', dataIndex: 'produceLeader', flex :0.7 },
                { text: '采购处负责人', dataIndex: 'purchaseLeader', flex :0.7 },
                { text: '财务部负责人', dataIndex: 'financeLeader', flex :1 },
                { text: '仓储负责人', dataIndex: 'storeLeader', flex :1},
                { text: '项目状态',  dataIndex: 'statusName' ,flex :1},
                { text: '上传人', dataIndex: 'username', flex :1},

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // tbar: toobar_2,
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: Query_Project_Store,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }],
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

                    building_grid.setStore(buildinglList_projectId);
                    Ext.getCmp('win_showbuildingData').show();
                }
            }
        });

        // this.items = [grid];
        this.dockedItems = [toobar,toobar_2,grid,{
            xtype: 'pagingtoolbar',
            store: Query_Project_Store,   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            displayMsg:'显示{0}-{1}条，共{2}条',
            emptyMsg:'无数据'
        }];
        this.callParent(arguments);
    }
})