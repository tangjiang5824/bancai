Ext.define('material.material_Outbound',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料特殊出库',
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
        var tableName="material";
        //var materialtype="1";
        var itemsPerPage=20;

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
        //枚举
        //操作类型：枚举类型
        Ext.define('material.oepration.state', {
            statics: { // 关键
                0: { value: '0', name: '未撤销' },
                1: { value: '1', name: '已撤销' },
            }
        });


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

        //长1 长2 宽1 宽2 库存单位
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [

                // {
                //     xtype: 'textfield',
                //     margin : '0 40 0 0',
                //     fieldLabel: '入库人',
                //     id :'operator',
                //     width: 150,
                //     labelWidth: 50,
                //     name: 'operator',
                //     value:"",
                // },
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
                // MaterialTypeList,
                {
                    xtype : 'button',
                    text: '入库查询',
                    width: 80,
                    margin: '0 40 0 0',
                    layout: 'right',
                    handler: function(){
                        material_inBoundRecords_Store.load({
                            params : {
                                // operator : Ext.getCmp('operator').getValue(),
                                operator : Ext.getCmp('operator').getValue(),//获取操作员名
                                startTime:Ext.getCmp('startTime').getValue(),
                                type:0,
                                projectId:'',
                                endTime : '',
                            }
                        });
                    }
                }

            ]
        });

        var material_inBoundRecords_Store = Ext.create('Ext.data.Store',{
            id: 'material_inBoundRecords_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/material_query_records.do?tableName=materiallog_projectname_view",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    type:0,
                    // operator : Ext.getCmp('operator').getValue(),//获取操作员名，type操作类型
                    // startTime:Ext.getCmp('startTime').getValue(),
                    operator : Ext.getCmp('operator').getValue(),//获取用户名
                    endTime : '',
                    startTime:Ext.getCmp('startTime').getValue(),
                    projectId:'',
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        operator : Ext.getCmp('operator').getValue(),//获取操作员名
                        startTime:Ext.getCmp('startTime').getValue(),
                        type:0,
                        projectId:'',
                        endTime : '',
                    });
                }

            }


        });



        //确认入库按钮，
        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar3",
            //style:{float:'center',},
            //margin-right: '2px',
            //padding: '0 0 0 750',
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [
                {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认出库',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {

                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        s.push(JSON.stringify(rec.data));
                        // s.push('品号','');
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                        //s.push();
                    });

                    console.log(select);

                    //获取数据
                    //获得当前操作时间
                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                    Ext.Ajax.request({
                        url : 'material/addData.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            //materialType:materialtype,
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","退库成功" );
                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","退库失败" );
                        }
                    });

                }
            }]
        });

        //防止按钮重复点击，发送多次请求，post_flag
        var post_flag = false;

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
                {
                    xtype : 'button',
                    text: '撤销所有记录',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        if(post_flag){
                            return;
                        }
                        post_flag = true;

                        var material_logId = Ext.getCmp("log_id").text;
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
                                            url:"material/backMaterialstore.do",  //入库记录撤销
                                            params:{
                                                operator:operator,  //回滚操作人
                                                materiallogId:material_logId,
                                                type:0  //撤销出库1
                                            },
                                            success:function (response) {
                                                //console.log(response.responseText);
                                                var ob=JSON.parse(response.responseText);
                                                if(ob.success==false){
                                                    Ext.MessageBox.alert("提示", ob.msg);
                                                    post_flag =false;
                                                }
                                                else{
                                                    Ext.MessageBox.alert("提示", "撤销成功!");

                                                    //成功后，关闭窗口
                                                    win_showmaterialData_outbound.close();

                                                    //重新刷新页面
                                                    Ext.getCmp('addDataGrid').getStore().load();

                                                    post_flag =false;
                                                }
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "撤销失败!");
                                                post_flag =false;
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
        var specific_data_grid_outbound=Ext.create('Ext.grid.Panel',{
            id : 'specific_data_grid_outbound',
            tbar: toolbar_pop,
            // store:material_Query_Records_store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '原材料品名',
                    dataIndex: 'materialName',
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
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
        });

        var win_showmaterialData_outbound = Ext.create('Ext.window.Window', {
            // id:'win_showmaterialData_outbound',
            title: '原材料出入库记录撤销',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            modal :true,
            closeAction : 'hidden',
            items:specific_data_grid_outbound,
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
            // store : {
            //     fields :['projectId','类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            // },
            // tbar:toolbar,
            store: material_inBoundRecords_Store,
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
                        return material.oepration.state[value].name; // key-value
                    },
                },
                // {
                //     dataIndex : '品号',
                //     name : '品号',
                //     text : '品号',
                //     //width : 110,
                //     value:'99',
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : true
                //     },
                //     //defaultValue:"2333",
                // },
                // {
                //     dataIndex : '长1',
                //     text : '长1',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //     }
                // },
                // {
                //     dataIndex : '长2',
                //     text : '长2',
                //     //width : 110,
                //     id:'长2',
                //     hidden:true,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : true,
                //
                //     },
                //     // defaultValue:"",
                //
                // },
                // {
                //     dataIndex : '类型',
                //     text : '类型',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //
                //     }
                //
                // },{
                //     dataIndex : '宽1',
                //     text : '宽1',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //     }
                // },
                // {
                //     dataIndex : '宽2',
                //     text : '宽2',
                //     //width : 110,
                //     id:'宽2',
                //     hidden:true,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : true,
                //     }
                // },
                // {
                //     dataIndex : '规格',
                //     text : '规格',
                //     //width : 192,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
                // }, {
                //     dataIndex : '库存单位',
                //     text : '库存单位',
                //     //width : 110,
                //     editor : {// 文本字段
                //         id : 'isNullCmb',
                //         xtype : 'textfield',
                //         allowBlank : true
                //
                //     }
                //
                // },
                // {
                //     dataIndex : '数量',
                //     name : '数量',
                //     text : '数量',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
                //
                // },{
                //     dataIndex : '成本',
                //     name : '成本',
                //     text : '成本',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : false
                //     }
                // },
                // {
                //     dataIndex : '仓库编号',
                //     name : '仓库编号',
                //     text : '仓库编号',
                //     //width : 130,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },
                // {
                //     dataIndex : '行',
                //     name : '行',
                //     text : '位置-行',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },
                // {
                //     dataIndex : '列',
                //     name : '列',
                //     text : '位置-列',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // } ,{
                //     dataIndex: '原材料名称',
                //     text: '材料名',
                //     //width : 110,
                //     editor: {// 文本字段
                //         xtype: 'textfield',
                //         allowBlank: false,
                //     }
                // }
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
                store: material_inBoundRecords_Store,   // same store GridPanel is using
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

                // 双击表行响应事件
                // itemdblclick: function (me, record, item, index) {
                //     var select = record.data;
                //     var id = select.id;
                //     //操作类型opType
                //     var opType = select.type;
                //     console.log(id);
                //     console.log(opType)
                //     var materiallogdetailList = Ext.create('Ext.data.Store', {
                //         //id,materialName,length,width,materialType,number
                //         fields: ['materialName', 'length', 'width', 'materialType', 'count'],
                //         //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                //         proxy: {
                //             type: 'ajax',
                //             url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=material_logdetail&columnName=materiallogId&columnValue=' + id,//获取同一批出入库的原材料
                //             reader: {
                //                 type: 'json',
                //                 rootProperty: 'materiallogdetail',
                //             },
                //         },
                //         autoLoad: true
                //     });
                //     // 根据出入库0/1，决定弹出框表格列名
                //     var col = material_Query_Records_specific_data_grid.columns[1];
                //     if (opType == 1) {
                //         col.setText("出库数量");
                //     }
                //     if (opType == 2) {
                //         col.setText("退库数量");
                //     } else {
                //         col.setText("入库数量");
                //     }
                //
                //     material_Query_Records_specific_data_grid.setStore(materiallogdetailList);
                //     console.log(materiallogdetailList);
                //     Ext.getCmp('material_Query_Records_win_showmaterialData').show();
                // }
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
            var materialArr = sm.getSelection();
            var id = e.data.id  //选中记录的logid
            var isrollback = e.data.isrollback
            // console.log("行号：",e.data)

            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                // var sm = Ext.getCmp('addDataGrid').getSelectionModel();
                // var materialArr = sm.getSelection();
                // var re = Ext.getCmp('addDataGrid').getSelectionModel();
                // console.log("qqqqqqqqqqqq:",re.data);

                var materiallogdetailList = Ext.create('Ext.data.Store', {
                    //id,materialName,length,width,materialType,number
                    fields: ['materialName', 'length', 'width', 'materialType', 'count'],
                    //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                    proxy: {
                        type: 'ajax',
                       // url: 'material/findMaterialLogdetails.do?materiallogId=' + id,//获取同一批出入库的原材料
                        url: '/material/findAllbyTableNameAndOnlyOneCondition.do?tableName=material_logdetail_view&&columnName=materiallogId&&columnValue='+id,
                        reader: {
                            type: 'json',
                            rootProperty: 'material_logdetail_view',
                        },
                    },
                    autoLoad: true
                });
                // 根据出入库0/1，决定弹出框表格列名
                var col = specific_data_grid_outbound.columns[1];
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
                specific_data_grid_outbound.setStore(materiallogdetailList);
                // console.log(materiallogdetailList);
                win_showmaterialData_outbound.show();

                // if (materialArr.length != 0) {
                //     Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认撤消？", function (btn) {
                //         if (btn == 'yes') {
                //             //对该条记录出库var id = select.id;
                //             // Ext.getCmp('addDataGrid').getStore().remove(materialArr);
                //             //撤销入库记录
                //             var materialLog_id = materialArr[0].data.id;  //日志记录id
                //             Ext.Ajax.request({
                //                 url:"",  //入库记录撤销
                //                 params:{
                //                     // tableName:tableName,
                //                     materiallogId:materialLog_id,
                //                     type:1  //撤销出库1
                //                 },
                //                 success:function (response) {
                //                     //console.log(response.responseText);
                //                 }
                //             })
                //         } else {
                //             return;
                //         }
                //     });
                // } else {
                //     //Ext.Msg.confirm("提示", "无选中数据");
                //     Ext.Msg.alert("提示", "无选中数据");
                // }
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
