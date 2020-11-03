Ext.define('unuseMaterial.unuseMaterial_outBound',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '废料出库',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

        var record_start_pop = 0;
        var record_start_bottom = 0;//序号
        var record_start_rec = 0;

        //原件类型：枚举类型
        Ext.define('product.model.originType', {
            statics: { // 关键s
                0: { value: '0', name: '未匹配' },
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料' },
                9: { value: '5', name: '未匹配成功' },
            }
        });

        //项目名称选择
        var tableListStore = Ext.create('Ext.data.Store',{
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
        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : '35%',
            margin : '0 10 0 0',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }
        });


        var pickList=Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount'],
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




        //弹框的toolbar
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 10 0 0',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
        });

        var buildingPositionStore = Ext.create('Ext.data.Store',{
            fields : [ 'buildingPosition'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=building_position',

                reader : {
                    type : 'json',
                    rootProperty: 'building_position',
                }
            },
            autoLoad : true
        });

        var buildingPositionList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '清单位置',
            labelWidth : 60,
            width : 200,
            id :  'positionName',
            name : 'positionName',
            matchFieldWidth: true,
            margin: '0 10 0 40',
            // emptyText : "--请选择项目--",
            displayField: 'positionName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: buildingPositionStore,
        });

        //仓库编号
        var storeNameList = Ext.create('Ext.data.Store',{
            fields : [ 'warehouseName'],
            proxy : {
                type : 'ajax',
                url : 'material/findStore.do', //查询所有的仓库编号
                reader : {
                    type : 'json',
                    rootProperty: 'StoreName',
                }
            },
            autoLoad : true
        });
        var storePosition = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '仓库名',
            labelWidth : 50,
            width : 250,
            margin: '0 0 0 21',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'id',
            editable : false,
            store: storeNameList,
        });

        var unusual_Query_Data_Store = Ext.create('Ext.data.Store',{
            id: 'unusual_Query_Data_Store',
            autoLoad: true,  //初始自动加载
            fields: [],
            pageSize: itemsPerPage, // items per page,每页显示的记录条数
            proxy:{
                url : "waste/queryStore.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :"waste_store",
                        wasteName:Ext.getCmp('wasteName').getValue(),
                        warehouseName:Ext.getCmp('warehouseName').getValue(),
                    });
                }
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

        var toolbar_specific_pickList = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            // id : "toolbar_specific_pickList",
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     id :'picklistId',
                //     width: 180,
                //     labelWidth: 30,
                //     name: 'picklistId',
                //     value:"",
                //     hidden:true
                // },
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     id :'project_Id',
                //     width: 180,
                //     labelWidth: 30,
                //     name: 'project_Id',
                //     value:"",
                //     hidden:true
                // },
                // //楼栋
                // buildingName,
                // //位置
                // buildingPositionList,
                // //仓库
                // storePosition,
                // {
                //     xtype : 'button',
                //     text: '领料单明细查询',
                //     width: 100,
                //     margin: '0 0 0 40',
                //     layout: 'right',
                //     handler: function(){
                //         //材料的筛选条件
                //         var requisitionOrderId = Ext.getCmp('picklistId').getValue();
                //
                //         var buildingId = Ext.getCmp('buildingName').getValue();
                //         var buildingpositionId = Ext.getCmp('positionName').getValue();
                //         var warehouseName = Ext.getCmp('storePosition').rawValue;
                //
                //         console.log('sss')
                //         //传入所选项目的id
                //         console.log(Ext.getCmp('projectName').getValue())
                //         unusual_Query_Data_Store.load({
                //             params : {
                //                 buildingId:buildingId,
                //                 buildingpositionId:buildingpositionId,
                //                 warehouseName:warehouseName,
                //                 //proejctId:'1',
                //                 //type和领料单Id
                //                 requisitionOrderId:requisitionOrderId,
                //                 type:4,//原材料
                //             }
                //         });
                //     }
                // },
                {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '废料名',
                    id :'wasteName',
                    width: 180,
                    labelWidth: 45,
                    name: 'wasteName',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '仓库名',
                    id :'warehouseName',
                    width: 180,
                    labelWidth: 45,
                    name: 'warehouseName',
                    value:"",
                },
                {
                    xtype : 'button',
                    text: '查 询',
                    // iconCls:'right-button',
                    iconAlign : 'center',
                    width: 60,
                    region:'center',
                    // margin: '0 0 0 15',
                    // layout: 'right',
                    handler: function(){
                        unusual_Query_Data_Store.load({
                            params : {
                                wasteName:Ext.getCmp('wasteName').getValue(),
                                warehouseName:Ext.getCmp('warehouseName').getValue(),
                            }
                        });
                    }
                }
                ]
        });

        var grid_query_waste=Ext.create('Ext.grid.Panel',{
            title:'废料仓库信息',
            // id : 'grid_query_waste',
            // tbar:toolbar_specific_pickList,
            store:unusual_Query_Data_Store,
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            // closable:true,
            closeAction: 'hide',
            columns:[
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                {
                    dataIndex : 'wasteName',
                    name : '废料名',
                    text : '废料名',
                    //width : 110,
                    flex :1,
                },
                {
                    dataIndex : 'inventoryUnit',
                    text : '库存单位',
                    flex :.6,
                },
                {
                    dataIndex : 'countStore',
                    name : '数量',
                    text : '数量',
                    flex :1,
                },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1,
                },
                {
                    dataIndex : 'count',
                    name : '出库数量',
                    text : '出库数量',
                    //width : 130,
                    flex :1,
                    editor : {
                                xtype : 'textfield',
                                allowBlank : true
                            }
                },

                // {
                //     dataIndex:'countRec',
                //     text:'待出库数量',
                //     flex :1,
                // },
                // {
                //     dataIndex:'count',
                //     text:'出库数量',
                //     flex :1,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },

            ],
            // height:'100%',
            flex:1,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
            },
            selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: unusual_Query_Data_Store,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        //弹框
        // var win_picklistInfo_material_outbound = Ext.create('Ext.window.Window', {
        //     // id:'win_errorInfo_outbound',
        //     title: '领料',
        //     height: 500,
        //     width: 800,
        //     layout: 'fit',
        //     closable : true,
        //     draggable:true,
        //     closeAction : 'hidden',
        //     // tbar:toolbar_pop1,
        //     items:grid_query_waste,
        // });

        //错误提示，弹出框
        var m_receive_errorlistStore = Ext.create('Ext.data.Store',{
            id: 'm_receive_errorlistStore',
            autoLoad: true,
            fields: ['productName','position'],
            //pageSize: itemsPerPage, // items per page
            data:[],
            editable:false,
        });

        //弹出框，出入库详细记录
        var waste_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'waste_errorlist_outbound',
            // tbar: toolbar_pop,
            store:m_receive_errorlistStore,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start_pop　+　1　+　rowIndex;
                    }
                },

                {
                    text: '序列',
                    dataIndex: 'id',
                    flex :1,
                    width:"80"
                },
                {
                    text: '错误原因',
                    flex :1,
                    dataIndex: 'errorType',
                }
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
        });

        var win_mrec_errorInfo_outbound = Ext.create('Ext.window.Window', {
            // id:'win_mrec_errorInfo_outbound',
            title: '错误详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            // tbar:toolbar_pop1,
            items:waste_errorlist_outbound,
        });


        var toobar_right = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    fieldLabel : '出库人',
                    xtype : 'combo',
                    name : 'operator_pick',
                    id : 'operator_pick',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
                    width: 200,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },

                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    // margin : '0 0 0 0',
                    text : '出库',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型waste_operateGrid
                        console.log('1===========')
                        var select = Ext.getCmp('waste_operateGrid').getStore()
                            .getData();

                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        var operator = Ext.getCmp('operator_pick').getValue();
                        //判断条件：若无数据或者没有操作人员则报错，不能提交
                        if(s.length != 0 && operator != null ){
                            //获取数据
                            Ext.Ajax.request({
                                url : 'waste/outStore.do', //领料
                                method:'POST',
                                // submitEmptyText : false,
                                params : {
                                    // requisitionOrderId:Ext.getCmp('picklistId').getValue(),
                                    // projectId:projectId,
                                    operator:operator,
                                    s : "[" + s + "]",//存储选择领料的数量
                                },
                                success : function(response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    console.log('111111111111111111111',response);
                                    var res = response.responseText;
                                    var jsonobj = JSON.parse(res);//将json字符串转换为对象
                                    console.log(jsonobj);
                                    console.log("success--------------",jsonobj.success);
                                    console.log("errorList--------------",jsonobj['errorList']);
                                    var success = jsonobj.success;
                                    var errorList = jsonobj.errorList;
                                    var errorCode = jsonobj.errorCode;
                                    var errorCount = jsonobj.errorNum;
                                    if(success == false){
                                        //错误输入
                                        if(errorCode == 400){
                                            //关闭进度条
                                            Ext.MessageBox.hide();
                                            // Ext.MessageBox.alert("提示","匹配失败，产品位置重复或品名不合法！请重新导入" );
                                            Ext.Msg.show({
                                                title: '提示',
                                                message: '领取失败，存在错误输入！\n是否查看具体错误数据',
                                                buttons: Ext.Msg.YESNO,
                                                icon: Ext.Msg.QUESTION,
                                                fn: function (btn) {
                                                    if (btn === 'yes') {
                                                        //点击确认，显示重复的数据
                                                        // m_receive_errorlistStore.loadData(errorList);
                                                        // win_mrec_errorInfo_outbound.show();

                                                        Ext.MessageBox.alert("提示","出库失败！标红的行数据存在问题！\n 请检查后重新领料！" );
                                                        //添加错误原因
                                                        // var column = Ext.create('Ext.grid.column.Column', {
                                                        //     dataIndex:'',
                                                        //     text: '错误原因',
                                                        //     flex:1,
                                                        //     style: "text-align:center;",
                                                        //     align:'center',
                                                        // });
                                                        // grid2.headerCt.insert(grid2.columns.length+1,column);

                                                        //红色标记
                                                        for(var i=0;i<errorList.length;i++){
                                                            console.log("errorList------------",errorList[i]);
                                                            var row_id = errorList[i].id;
                                                            var row_errorType = errorList[i].errorType;

                                                            var row = grid2.getStore().indexOfId(row_id)     //(row_id);
                                                            console.log("row--------->>>",row)
                                                            var tr = grid2.getView().getNode(row);

                                                            //设置值
                                                            // grid2.getStore().getAt(row).set('错误原因',row_errorType);

                                                            //标红
                                                            console.log("tr--------->>>",tr);
                                                            tr.style.backgroundColor = '#FF0000';//行标红

                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        else if(errorCode == 100){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","出库失败！提交的数据为空" );
                                        }
                                        // else if(errorCode == 200){
                                        //     Ext.MessageBox.hide();
                                        //     Ext.MessageBox.alert("提示","领取失败！未收到领料单号或项目ID" );
                                        // }
                                        else if(errorCode == 300){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","出库失败！未选择出库人" );
                                        }
                                        else if(errorCode == 1000){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","出库失败，未知错误！请重新领取" );
                                        }
                                    }else{
                                        Ext.MessageBox.hide();
                                        Ext.MessageBox.alert("提示","出库成功" );

                                        console.log('=================1');
                                        //  领料页面重置
                                        // Ext.getCmp('operator').setValue("");
                                        pickList.removeAll();
                                        console.log('=================2');
                                        //  领料单查询重新加载
                                        grid_query_waste.getStore().load();
                                        console.log('=================3');
                                    }
                                },
                                failure : function(response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示","出库失败" );
                                }
                            });
                        }else {
                            Ext.MessageBox.alert("提示","没有数据或操作人！" );
                        }
                    }
                }

            ]
        });

        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'waste_operateGrid',
            store:pickList,
            dock: 'bottom',
            autoScroll: true, //超过长度带自动滚动条
            columns:[
                //序号
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                {
                    dataIndex : 'wasteName',
                    name : '废料名',
                    text : '废料名',
                    //width : 110,
                    flex :1,
                },
                {
                    dataIndex : 'inventoryUnit',
                    text : '库存单位',
                    flex :.6,
                },
                {
                    dataIndex : 'countStore',
                    name : '数量',
                    text : '数量',
                    flex :1,
                },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1,
                },
                {
                    dataIndex : 'count',
                    name : '出库数量',
                    text : '出库数量',
                    //width : 130,
                    flex :1,
                },
                ],
            // height:'100%',
            flex:1,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
            },
            tbar:toobar_right,
            selType:'checkboxmodel',
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: pickList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });


        //领料的具体材料信息Panel
        var panel_specific = Ext.create('Ext.panel.Panel',{
            // title: '领料单材料详情',
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            height:500,
            // closable:true,
            // closeAction : 'hide',
            // autoDestroy: false,
            items:[
                grid_query_waste,
                {
                    xtype:'container',
                    // flex:0.3,
                    items:[{
                        xtype:'button',
                        // margin: '0 0 0 30',
                        text:'选择',
                        itemId:'move_right',
                        handler:function() {
                            var records = grid_query_waste.getSelectionModel().getSelection();
                            console.log(records)
                            console.log("测试")
                            console.log(records[0])

                            for (i = 0; i < records.length; i++) {
                                console.log(records[i].data['countTemp'])
                                if(records[i].data['countTemp'] != 0){
                                    console.log("添加")
                                    pickList.add(records[i]);
                                }
                            }
                            //若要领数量<领取数量，则不能直接remove，需要更改数量值

                        }
                    },{
                        xtype:'button',
                        text:'撤销',
                        itemId:'move_left',
                        handler:function(){
                            var records=grid2.getSelectionModel().getSelection();
                            pickList.remove(records);
                            grid_query_waste.store.add(records);//grid_query_waste
                        }
                    }]
                },
                grid2,
            ],
            // listeners:{
            //     beforeclose: conrirmTab
            // }
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
                items : [toolbar_specific_pickList]
            },
        ];


        this.items = [panel_specific];
        this.callParent(arguments);
    }
})