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
            fields : [ "项目名称","id"],
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
            width : 300,
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: '项目名称',
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
                    width: 200,
                    labelWidth: 50,
                    name: 'userId',
                    value:"",
                },projectName,
                optionType,
                {
                    xtype : 'datefield',
                    margin : '0 20 0 20',
                    fieldLabel : '开始时间',
                    width : 200,
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
                    width : 200,
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
                                projectName:Ext.getCmp('projectName').getValue(),
                            }
                        });
                    }
                },

                // {
                //     text: '删除',
                //     width: 80,
                //     margin: '0 0 0 15',
                //     handler: function(){
                //         var select = grid.getSelectionModel().getSelection();
                //         if(select.length==0){
                //             Ext.Msg.alert('错误', '请选择要删除的记录')
                //         }
                //         else{
                //             Ext.Ajax.request({
                //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
                //                 params:{
                //                     tableName:tableName,
                //                     id:select[0].data.id
                //                 },
                //                 success:function (response) {
                //                     Ext.MessageBox.alert("提示","删除成功！")
                //                     grid.store.remove(grid.getSelectionModel().getSelection());
                //                 },
                //                 failure:function (reponse) {
                //                     Ext.MessageBox.alert("提示","删除失败！")
                //
                //                 }
                //             })
                //         }
                //     }
                // }
            ]
        });

        var material_Query_Records_Store = Ext.create('Ext.data.Store',{
            id: 'material_Query_Records_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "",//"material/historyDataList.do",
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
                        tableName :tableName,
                        userId:Ext.getCmp('userId').getValue(),
                        endTime:Ext.getCmp('endTime').getValue(),
                        startTime:Ext.getCmp('startTime').getValue(),
                        projectName:Ext.getCmp('projectName').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Records_Main',
            store: material_Query_Records_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '材料单编号', dataIndex: '材料单编号', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传人',  dataIndex: '上传人' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '上传时间', dataIndex: '上传时间', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '项目名称', dataIndex: '项目名称',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                {
                    header: "操作", dataIndex: 'Gender',
                    renderer: function() {                      //此处为主要代码
                        var str = "<input type='button' value='查看' onclick='look()'>";
                        return str;
                    }
                },
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
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    Ext.Ajax.request({
                        url:"",//"data/EditCellById.do",  //EditDataById.do
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
                    // console.log("value is "+e.value);
                    // console.log(e.record.data["id"]);

                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})