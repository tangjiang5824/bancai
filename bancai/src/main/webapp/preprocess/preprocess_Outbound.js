Ext.define('preprocess.preprocess_Outbound',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '预加工半成品特殊出库',
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
        var tableName="preprocess";
        //var materialtype="1";
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
            }
        });
        //枚举
        //操作类型：枚举类型
        Ext.define('preprocess.oepration.state', {
            statics: { // 关键
                0: { value: '0', name: '未撤销' },
                1: { value: '1', name: '已撤销' },
            }
        });

        //原材料类型
        // var MaterialNameList = Ext.create('Ext.data.Store',{
        //     fields : [ 'materialName'],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'material/materialType.do',
        //         reader : {
        //             type : 'json',
        //             rootProperty: 'typeList',
        //         }
        //     },
        //     autoLoad : true
        // });
        // var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
        //     fieldLabel : '原材料类型',
        //     labelWidth : 70,
        //     width : 230,
        //     id :  'materialName',
        //     name : 'materialName',
        //     matchFieldWidth: false,
        //     emptyText : "--请选择--",
        //     displayField: 'materialTypeName',
        //     valueField: 'materialType',
        //     editable : true,
        //     store: MaterialNameList,
        //     listeners:{
        //         select: function(combo, record, index) {
        //             var type = MaterialTypeList.rawValue;
        //             var L2 = Ext.getCmp('length2');
        //             var W2 = Ext.getCmp('width2');
        //             var chang2 = Ext.getCmp('长2');
        //             var kuan2 = Ext.getCmp('宽2');
        //             if(type=='IC'){
        //                 //该类型为1000X200类型
        //                 L2.setHidden(false);
        //                 W2.setHidden(false);
        //                 chang2.setHidden(false);
        //                 kuan2.setHidden(false);
        //             }else{
        //                 L2.setHidden(true);
        //                 W2.setHidden(true);
        //                 chang2.setHidden(true);
        //                 kuan2.setHidden(true);
        //             }
        //             //console.log(MaterialTypeList.rawValue)//选择的值
        //             console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
        //             //console.log(record[0].data.materialName);
        //         }
        //     }
        //
        // });
        var toolbar_ttop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype:'tbtext',
                    text:'查询条件',
                    margin : '0 40 0 0',
                }

            ]
        });

        //长1 长2 宽1 宽2 库存单位
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                // MaterialTypeList,
                {
                    fieldLabel : '入库人',
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
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '入库时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : true,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
              //  MaterialTypeList,
                {
                    xtype : 'button',
                    text: '入库查询',
                    width: 80,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        preprocess_inBoundRecords_Store.load({
                            params : {
                                // operator : Ext.getCmp('operator').getValue(),
                                operator : Ext.getCmp('operator').getValue(),//获取操作员名
                                startTime:Ext.getCmp('startTime').getValue(),
                                type:0
                            }
                        });
                    }
                }

            ]
        });

        var preprocess_inBoundRecords_Store = Ext.create('Ext.data.Store',{
            id: 'preprocess_inBoundRecords_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/material_query_records.do?tableName=preprocess_log_view",
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
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        // operator : Ext.getCmp('operator').getValue(),
                        operator : Ext.getCmp('operator').getValue(),//获取操作员名
                        startTime:Ext.getCmp('startTime').getValue(),
                        // projectId:Ext.getCmp('projectName').getValue(),
                    });
                }

            }


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


        //弹出框的表头
        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            items: [
                // MaterialTypeList,
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
                    xtype: 'combo',
                    margin : '0 40 0 0',
                    fieldLabel: '撤销人',
                    id :'operator_back',
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator_back',
                    value:"",
                },
                // {
                //     xtype : 'datefield',
                //     margin : '0 40 0 0',
                //     fieldLabel : '回滚时间',
                //     width : 180,
                //     labelWidth : 60,
                //     id : "backTime",
                //     name : 'backTime',
                //     format : 'Y-m-d',
                //     editable : false,
                //     //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                // },

                {
                    xtype : 'button',
                    text: '撤销所有记录',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        var preprocess_logId = Ext.getCmp("log_id").text;
                        var is_rollback = Ext.getCmp("is_rollback").text;
                        var operator = Ext.getCmp("operator_back").getValue();
                        // console.log("id为：----",is_rollback)
                    //    material/backMaterialstore.do
                        if (is_rollback != 1){
                            Ext.Msg.show({
                                title: '操作确认',
                                message: '将撤销数据，选择“是”否确认？',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url:"preprocess/addDataRollback.do",  //入库记录撤销
                                            params:{
                                                operator:operator,  //回滚操作人
                                                preprocesslogId:preprocess_logId,
                                                type:0  //撤销出库1
                                            },
                                            success:function (response) {
                                                //console.log(response.responseText);
                                                var ob=JSON.parse(response.responseText);
                                                if(ob.success==false)
                                                    Ext.MessageBox.alert("提示", ob.msg);
                                                else
                                                    Ext.MessageBox.alert("提示", "撤销成功!");
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "撤销失败!");
                                            }
                                        })
                                    }
                                }
                            });

                        }
                        else{
                            Ext.Msg.alert('错误', '该条记录已撤销！')
                        }
                    }
                }

            ]
        });

        //弹出框，出入库详细记录
        var preprocess_Query_Records_specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'preprocess_Query_Records_specific_data_grid',
            tbar: toolbar_pop,
            // store:material_Query_Records_store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '产品名',
                    dataIndex: 'productName',
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
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
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

        var preprocess_Query_Records_win_showpreprocessData = Ext.create('Ext.window.Window', {
            title: '预加工半成品出入库记录撤销',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'close',
            items:preprocess_Query_Records_specific_data_grid,
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            // store : {
            //     fields :['projectId','类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            // },
            // tbar:toolbar,
            store: preprocess_inBoundRecords_Store,
            title: "入库详细记录",
            columns : [
                {   text: '录入人员',  dataIndex: 'workerName' ,flex :1},
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
                {   text: '记录是否撤销',
                    dataIndex: 'isrollback',
                    flex :1 ,
                    renderer: function (value) {
                        return preprocess.oepration.state[value].name; // key-value
                    },
                }
            ],

            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },

            dockedItems:[{
                xtype: 'pagingtoolbar',
                store: preprocess_inBoundRecords_Store,   // same store GridPanel is using
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
            // var isrollback = Ext.getCmp('isrollback').getValue();
            var preprocessArr = sm.getSelection();
            var id = e.data.id  //选中记录的logid
            var isrollback = e.data.isrollback
            // console.log("行号：",e.data)

            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                // var sm = Ext.getCmp('addDataGrid').getSelectionModel();
                // var materialArr = sm.getSelection();
                // var re = Ext.getCmp('addDataGrid').getSelectionModel();
                // console.log("qqqqqqqqqqqq:",re.data);

                var preprocesslogdetailList = Ext.create('Ext.data.Store', {
                    //id,materialName,length,width,materialType,number
                    fields: ['preprocessName', 'length', 'width', 'preprocessType', 'count'],
                    //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                    proxy: {
                        type: 'ajax',
                        url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=preprocess_logdetail_productName&columnName=preprocesslogId&columnValue=' + id,//获取同一批出入库的原材料
                        reader: {
                            type: 'json',
                            rootProperty: 'preprocess_logdetail_productName',
                        },
                    },
                    autoLoad: true
                });
                // 根据出入库0/1，决定弹出框表格列名
                var col = preprocess_Query_Records_specific_data_grid.columns[1];
                // if (opType == 1) {
                //     col.setText("出库数量");
                // }
                // if (opType == 2) {
                //     col.setText("退库数量");
                // } else {
                //     col.setText("入库数量");
                // }

                Ext.getCmp("toolbar_pop").items.items[0].setText(id); //设置log id的值
                Ext.getCmp("toolbar_pop").items.items[1].setText(isrollback);
                preprocess_Query_Records_specific_data_grid.setStore(preprocesslogdetailList);
                // console.log(materiallogdetailList);
               preprocess_Query_Records_win_showpreprocessData.show();


            }


            console.log("rowIndex:",rowIndex)
            console.log("columnIndex:",columnIndex)

        }
        // this.dockedItems = [toolbar, grid, toolbar3];
        // this.dockedItems = [toolbar_ttop,toolbar, grid,
        //     {
        //         xtype: 'pagingtoolbar',
        //         store: material_inBoundRecords_Store,   // same store GridPanel is using
        //         dock: 'bottom',
        //         displayInfo: true,
        //         displayMsg:'显示{0}-{1}条，共{2}条',
        //         emptyMsg:'无数据'
        //     }
        // ];
        this.tbar = toolbar;
        // this.lbar = toolbar_ttop;
        this.items = [grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})
