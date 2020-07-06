Ext.define('oldpanel.oldpanel_Outbound',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板特殊出库',
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

    initComponent : function() {
        var me = this;
        var tableName="oldpanel_log";
        var whichStore="oldpanel";
        var itemsPerPage=50;

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
            }
        });
        //枚举
        //操作类型：枚举类型
        Ext.define('oldpanel.oepration.state', {
            statics: { // 关键
                0: { value: '0', name: '未回滚' },
                null: { value: '0', name: '未回滚' },
                1: { value: '1', name: '已回滚' },
            }
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '入库人',
                    id :'operator',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator',
                    value:"",
                },
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '开始时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : true,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '结束时间',
                    width : 180,
                    labelWidth : 60,
                    id : "endTime",
                    name : 'endTime',
                    format : 'Y-m-d',
                    editable : true,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
                {
                    xtype : 'button',
                    text: '入库查询',
                    width: 80,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        oldpanel_inBoundRecords_Store.load({
                            params : {
                                // operator : Ext.getCmp('operator').getValue(),
                                operator : Ext.getCmp('operator').getValue(),//获取操作员名
                                startTime:Ext.getCmp('startTime').getValue(),
                                endTime:Ext.getCmp('endTime').getValue(),
                                type:0
                            }
                        });
                    }
                }

            ]
        });

        var oldpanel_inBoundRecords_Store = Ext.create('Ext.data.Store',{
            id: 'oldpanel_inBoundRecords_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "oldpanel/outbound_query_records.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: 20,
                    operator : Ext.getCmp('operator').getValue(),//获取操作员名，type操作类型
                    startTime:Ext.getCmp('startTime').getValue(),
                    endTime:Ext.getCmp('endTime').getValue(),
                    tableName:tableName,
                    type:0
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        // operator : Ext.getCmp('operator').getValue(),
                        operator : Ext.getCmp('operator').getValue(),//获取操作员名
                        startTime:Ext.getCmp('startTime').getValue(),
                        endTime:Ext.getCmp('endTime').getValue(),
                        tableName:tableName,
                        type:0
                        // projectId:Ext.getCmp('projectName').getValue(),
                    });
                }

            }


        });


        //弹出框的表头
        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            items: [
                {
                    //保存logid的值
                    xtype: 'tbtext',
                    id:'log_id',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    //保存是否回滚的值
                    xtype: 'tbtext',
                    id:'is_rollback',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '回滚人',
                    id :'operator_back',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator_back',
                    value:"",
                },
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '回滚时间',
                    width : 180,
                    labelWidth : 60,
                    id : "backTime",
                    name : 'backTime',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },

                {
                    xtype : 'button',
                    text: '回滚所有记录',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        var oldpanel_logId = Ext.getCmp("log_id").text;
                        var is_rollback = Ext.getCmp("is_rollback").text;
                        var operator = Ext.getCmp("operator_back").getValue();
                        if (is_rollback != 1){
                            Ext.Msg.show({
                                title: '操作确认',
                                message: '将回滚数据，选择“是”否确认？',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url:"oldpanel/backOldpanelStore.do",  //入库记录撤销
                                            params:{
                                                operator:operator,  //回滚操作人
                                                oldpanellogId:oldpanel_logId,
                                                type:0,  //撤销出库1
                                                whichStore:whichStore,
                                            },
                                            success:function (response) {
                                                //console.log(response.responseText);
                                                Ext.MessageBox.alert("提示", "回滚成功!");
                                                //location="javascript:location.reload()";
                                                oldpanel_inBoundRecords_Store.load();
                                                //oldpanel_Query_Records_specific_data_grid.close();
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "回滚失败!");
                                            }
                                        })
                                    }
                                }
                            });

                        }
                        else{
                            Ext.Msg.alert('错误', '该条记录已回滚！')
                        }
                    }
                }

            ]
        });

        //弹出框，出入库详细记录
        var oldpanel_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'oldpanel_Query_Records_specific_data_grid',
            tbar: toolbar_pop,
            dock: 'bottom',
            columns:[
                {
                    text: '旧板品名',
                    dataIndex: 'oldpanelName',
                    flex :1,
                    width:"80"
                },

                {
                    // id:'outOrinNum',
                    text: '入库数量',
                    flex :1,
                    dataIndex: 'count'
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // listeners: {
            //     //监听修改
            //     validateedit: function (editor, e) {
            //         var field = e.field
            //         var id = e.record.data.id
            //     },
            // }
        });

        var oldpanel_Query_Records_win_showoldpanelData = Ext.create('Ext.window.Window', {
            id:'oldpanel_Query_Records_win_showoldpanelData',
            title: '原材料出入库记录回滚',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'close',
            items:oldpanel_Query_Records_specific_data_grid,
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            // store : {
            //     fields :['projectId','类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            // },
            // tbar:toolbar,
            store: oldpanel_inBoundRecords_Store,
            title: "入库详细记录",
            columns : [
                {   text: '录入人员',  dataIndex: 'operator' ,flex :1},
                {   text: '入库/出库',
                    dataIndex: 'type' ,
                    flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    // editor:{xtype : 'textfield', allowBlank : false}
                },
                {   text: '操作时间',
                    dataIndex: 'time',
                    flex :1 ,
                    // editor:{xtype : 'textfield', allowBlank : false},
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='查看' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },
                {   text: '记录是否回滚',
                    dataIndex: 'isrollback',
                    flex :1 ,
                    //defaultValue:0,
                    renderer: function (value) {
                        return oldpanel.oepration.state[value].name; // key-value
                    },
                },
            ],

            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },

            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: oldpanel_inBoundRecords_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel',
            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field = e.field
                    var id = e.record.data.id
                },

            }

        });
        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('addDataGrid').columns[columnIndex].text;
            var sm = Ext.getCmp('addDataGrid').getSelectionModel();
            var id = e.data.id  //选中记录的logid
            var isrollback = e.data.isrollback
            // console.log("行号：",e.data)

            if (fieldName == "操作") {

                var oldpanellogdetailList = Ext.create('Ext.data.Store', {
                    fields: ['oldpanelName', //'length', 'width','materialType',
                         'count'],
                    proxy: {
                        type: 'ajax',
                        url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=oldpanel_logdetail_oldpanelName&columnName=oldpanellogId&columnValue=' + id,//获取同一批出入库的原材料
                        reader: {
                            type: 'json',
                            rootProperty: 'oldpanel_logdetail_oldpanelName',
                        },
                    },
                    autoLoad: true
                });
                var col = oldpanel_Query_Records_specific_data_grid.columns[1];

                Ext.getCmp("toolbar_pop").items.items[0].setText(id); //设置log id的值
                Ext.getCmp("toolbar_pop").items.items[1].setText(isrollback);
                oldpanel_Query_Records_specific_data_grid.setStore(oldpanellogdetailList);
                Ext.getCmp('oldpanel_Query_Records_win_showoldpanelData').show();


            }


            console.log("rowIndex:",rowIndex)
            console.log("columnIndex:",columnIndex)

        }
        this.tbar = toolbar;
        // this.lbar = toolbar_ttop;
        this.items = [grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})
