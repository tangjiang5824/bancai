Ext.define('oldpanel.oldpanel_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板出入库记录查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel";
        //var materialType="1";
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
                    id :'userId',
                    width: 150,
                    labelWidth: 50,
                    name: 'userId',
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
                                userId : Ext.getCmp('userId').getValue(),
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

        var material_Query_Records_Store = Ext.create('Ext.data.Store',{
            id: 'material_Query_Records_Store',
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
                    limit: itemsPerPage
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        userId : Ext.getCmp('userId').getValue(),
                        endTime : Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectId:Ext.getCmp('projectName').getValue(),
                        optionType:Ext.getCmp('oldpanel_query_records_optionType').getValue(),

                    });
                }

            }


        });

        var sampleData=[{
            // materialName:1,
            // length:'Zeng',
            // materialType:'2',
            // width:'ttt',
            // number:'12'
        }];
        var material_Query_Records_store1=Ext.create('Ext.data.Store',{
            id: 'material_Query_Records_store1',
            fields:['旧板领料记录单编号','旧板名称','领取数量','规格'],
            data:sampleData
        });


        var material_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'material_Query_Records_specific_data_grid',
            store:material_Query_Records_store1,//specificMaterialList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '旧板领料记录单编号',
                    dataIndex: 'id',
                    width:"80"
                },{
                    text: '旧板名称',
                    dataIndex: 'oldpanelName'
                },{
                    text: '领取数量',
                    dataIndex: 'count'
                },{
                    text: '规格',
                    dataIndex: 'specification'
                },
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
            title: '领取同类型下的具体规格',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
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
                { text: '旧板领料记录单编号', dataIndex: 'id', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传人',  dataIndex: 'userId' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传时间', dataIndex: 'time', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},

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
                    console.log(materialName)
                    var specificMaterialList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['oldpanelId','oldpanelName','count','specification'],
                        //fields:['materialName','length','materialType','width','number'],//'oldpanelId','oldpanelName','count'
                        proxy : {
                            type : 'ajax',
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=oldpanellogdetail&columnName=oldpanellogId&columnValue='+id,//获取同类型的原材料
                            // params:{
                            //     start: 0,
                            //     limit: itemsPerPage
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'materialstoreList',
                            },
                        },
                        autoLoad : true
                    });
                    material_Query_Records_specific_data_grid.setStore(specificMaterialList);
                    Ext.getCmp('material_Query_Records_win_showmaterialData').show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})