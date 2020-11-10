Ext.define('backproduct.backproduct_Receive',{
    extend:'Ext.tab.Panel',
    id:'back_pick_tabpanel',
    region: 'center',
    layout:'fit',
    title: '退库成品领料',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="preprocess";
        //var preprocessType="1";

        //存放所选的预加工半成品的具体规格
        var preprocessList = '';

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

        //查询领料单
        var backpickListStore = Ext.create('Ext.data.Store',{
            fields:['preprocessName','preprocessCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrder.do', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                }
            },
            autoLoad : true
        });

        var pickList=Ext.create('Ext.data.Store',{
            fields:['preprocessName','preprocessCount'],
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

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                //单号
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '单号',
                //     id :'picklistNum',
                //     width: 180,
                //     labelWidth: 30,
                //     name: 'picklistNum',
                //     value:"",
                // },
                {
                    fieldLabel : '创建人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 10 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    fieldLabel : '创建时间',
                    width : 180,
                    labelWidth : 60,
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
                    margin : '0 0 0 0',
                    // fieldLabel : '结束时间',
                    width : 120,
                    // labelWidth : 60,
                    id : "endTime",
                    name : 'endTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },

                {
                    xtype : 'button',
                    text: '项目领料单查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        // var url='preprocess/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        backpickListStore.load({
                            params : {
                                projectId:Ext.getCmp('projectName').getValue(),
                                //projectId:'1',
                                operator:Ext.getCmp('operator').getValue(),
                                timeStart:Ext.getCmp('startTime').getValue(),
                                timeEnd:Ext.getCmp('endTime').getValue(),
                                origin:1,

                            }
                        });
                    }
                }]
        });



        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'back_PickingListGrid',
            store:backpickListStore,
            dock: 'bottom',
            columns:[
                {
                    // header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                {
                    dataIndex:'requisitionOrderNo',
                    text:'领料单号',
                    flex :1
                },
                {
                    dataIndex:'workerName',
                    text:'负责人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    flex :1,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    dataIndex:'projectName',
                    text:'所属项目',
                    flex :1
                },
            ],
            flex:1,
            // height:'100%',
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: backpickListStore,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
            listeners: {
                // 双击表行响应事件,显示领料单的具体信息
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data;
                    console.log("select--======",select);
                    var requisitionOrderId = select.requisitionOrderId;//领料单号
                    var projectId = select.projectId;
                    var requisitionOrderNo = select.requisitionOrderNo;
                    var projectName = select.projectName;

                    //预加工半成品领料，只查询领料单中的预加工半成品，type=2
                    specificbackList.load({
                        params : {
                            requisitionOrderId:requisitionOrderId,
                            type:1,
                        }
                    });

                    //确认领料部分，重置
                    pickList.removeAll();

                    //表名
                    var tableName = 'building';
                    //属性名
                    var C_projectId = 'projectId';
                    //根据选中记录的projectid，决定明细表格的楼栋信息
                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，preprocess/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+C_projectId+'&columnValue='+projectId,//根据项目id查询对应的楼栋名
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : true,

                        // listeners:{
                        //     load:function () {
                        //         Ext.getCmp('buildingName').setValue("");
                        //     }
                        // }
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);

                    //将requisitionOrderId传到明细表格
                    // Ext.getCmp('toolbar_specific_pickList').items.items[0].setValue(requisitionOrderId);

                    toolbar_show_back.items.items[0].setValue(requisitionOrderId);
                    toolbar_show_back.items.items[1].setValue(requisitionOrderNo);
                    toolbar_show_back.items.items[2].setValue(projectId);
                    toolbar_show_back.items.items[3].setValue(projectName);

                    // toolbar_specific_pickList.items.items[0].setValue(requisitionOrderId);
                    // toolbar_specific_pickList.items.items[1].setValue(projectId);

                    console.log("--------------requisitionOrderId:",requisitionOrderId)
                    // //弹框
                    // win_picklistInfo_preprocess_outbound.show();
                    var tabPanel = Ext.getCmp('back_pick_tabpanel');
                    var tabs = Ext.getCmp('back_myPanel');
                    if(!tabs){
                        var t = tabPanel.add({
                            // title:requisitionOrderId+'领料单明细',
                            title:'明细',
                            id:'back_myPanel',
                            layout:'fit',
                            items:[panel_specific_back],
                            closable:true,
                            closeAction:'hide',
                            autoDestroy: true,
                        });
                        tabPanel.setActiveTab(t);
                    }
                    else{
                        tabs.show();
                    }

                    //关闭
                    tabPanel.on('beforeremove', function(tabs, tab) {
                        // console.log("beforeremove----",tabs)
                        // tabPanel.remove(tab);
                        // Ext.getCmp("pick_tabpanel").remove(Ext.getCmp("myPanel"));
                        return false;
                    });
                }
            }
        });

        var specificbackList = Ext.create('Ext.data.Store',{
            //id,preprocessName,length,width,preprocessType,number
            fields:['preprocessName','length','preprocessType','width','specification','number'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrderDetail.do',//获取同类型的预加工半成品  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'value',
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

        var toolbar_show_back = Ext.create('Ext.toolbar.Toolbar',{
            // dock : "top",
            id : "toolbar_show_back",
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel : '单号',
                    margin : '0 40 0 0',
                    id :'picklistId',
                    width: 320,
                    labelWidth: 60,
                    name: 'picklistId',
                    value:"",
                    hidden:true
                },
                {
                    xtype: 'textfield',
                    fieldLabel : '领料单号',
                    margin : '0 40 0 0',
                    id :'picklistNo',
                    width: 320,
                    labelWidth: 60,
                    name: 'picklistNo',
                    value:"",
                    disabled : true,
                    editable : false
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel : '所属项目id',
                    id :'project_Id',
                    width: 550,
                    labelWidth: 60,
                    name: 'project_Id',
                    value:"",
                    disabled : true,
                    editable : false,
                    hidden:true
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel : '所属项目',
                    id :'project_Name',
                    width: 550,
                    labelWidth: 60,
                    name: 'project_Name',
                    value:"",
                    disabled : true,
                    editable : false
                    // hidden:true
                },

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
                //楼栋
                buildingName,
                //位置
                buildingPositionList,
                //仓库
                storePosition,
                {
                    xtype : 'button',
                    text: '领料单明细查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        //材料的筛选条件
                        var requisitionOrderId = Ext.getCmp('picklistId').getValue();

                        var buildingId = Ext.getCmp('buildingName').getValue();
                        var buildingpositionId = Ext.getCmp('positionName').getValue();
                        var warehouseName = Ext.getCmp('storePosition').rawValue;

                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        specificbackList.load({
                            params : {
                                buildingId:buildingId,
                                buildingpositionId:buildingpositionId,
                                warehouseName:warehouseName,
                                //projectId:'1',
                                //type和领料单Id
                                requisitionOrderId:requisitionOrderId,
                                type:1,//退库产品
                            }
                        });
                    }
                },
                //领料
                // {
                //     xtype : 'button',
                //     iconAlign : 'center',
                //     iconCls : 'rukuicon ',
                //     margin : '0 0 0 30',
                //     text : '领料',
                //     region:'center',
                //     bodyStyle: 'background:#fff;',
                //     handler : function() {
                //
                //         // 取出grid的字段名字段类型pro_picking_PreprocessGrid
                //         console.log('1===========')
                //         var projectId = Ext.getCmp('project_Id').getValue();
                //
                //         var records = grid_back_query_pickList_specific.getSelectionModel().getSelection();
                //         var s = new Array();
                //         for(var i=0;i<records.length;i++){
                //             // console.log("aaaa",records[i].data)
                //             s.push(JSON.stringify(records[i].data))
                //         }
                //
                //         console.log(s)
                //         console.log('2===========')
                //         // var operator = Ext.getCmp('operator').getValue();
                //         var operator = 1;
                //         console.log('2===========',operator)
                //         //判断条件：若无数据或者没有操作人员则报错，不能提交
                //         if(s.length != 0 && operator != null ){
                //             //获取数据
                //             Ext.Ajax.request({
                //                 url : 'order/finishRequisitionOrder.do', //领料
                //                 method:'POST',
                //                 // submitEmptyText : false,
                //                 params : {
                //                     requisitionOrderId:Ext.getCmp('picklistId').getValue(),
                //                     projectId:projectId,
                //                     operator:operator,
                //                     s : "[" + s + "]",//存储选择领料的数量
                //                 },
                //                 success : function(response) {
                //                     //var message =Ext.decode(response.responseText).showmessage;
                //                     if(response == true){
                //                         Ext.MessageBox.alert("提示","领取成功" );
                //                     }else{
                //                         Ext.MessageBox.alert("提示","领取失败" );
                //                     }
                //                 },
                //                 failure : function(response) {
                //                     //var message =Ext.decode(response.responseText).showmessage;
                //                     Ext.MessageBox.alert("提示","领取失败" );
                //                 }
                //             });
                //         }else {
                //             Ext.MessageBox.alert("提示","没有数据或领料人！" );
                //         }
                //
                //         //  左边输入框重置
                //         grid_back_query_pickList_specific.getStore().removeAll();
                //
                //         //  右边页面重置
                //         Ext.getCmp('operator').setValue("");
                //         pickList.removeAll();
                //     }
                // }
            ]
        });

        var grid_back_query_pickList_specific=Ext.create('Ext.grid.Panel',{
            // id : 'grid_back_query_pickList_specific',
            tbar:toolbar_specific_pickList,
            store:specificbackList,
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            // closable:true,
            closeAction: 'hide',
            columns:[
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start_rec　+　1　+　rowIndex;
                    }
                },
                // new Ext.grid.RowNumberer(),//序号
                // {
                //     header: '序号',
                //     xtype: 'rownumberer',
                //     width: 60,
                //     align: 'center',
                //     sortable: false
                // },
                {
                    dataIndex:'name',
                    text:'材料名',
                    flex :1
                },
                {
                    dataIndex:'type',
                    text:'类型',
                    flex :1,
                    renderer: function (value) {
                        return product.model.originType[value].name; // key-value
                    },
                },
                {
                    dataIndex:'warehouseName',
                    text:'仓库名',
                    flex :1,
                },
                {
                    dataIndex:'countStore',
                    text:'库存数量',
                    flex :1,
                },
                {
                    dataIndex:'countAll',
                    text:'领取总数',
                    flex :1,
                },
                {
                    dataIndex:'countRec',
                    text:'待领数量',
                    flex :1,
                },
                {
                    dataIndex:'count',
                    text:'领取数量',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                // {
                //     dataIndex:'',
                //     text:'错误原因',
                //     flex :1,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },
            ],
            // height:'100%',
            flex:1,
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: specificbackList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        //弹框
        // var win_picklistInfo_preprocess_outbound = Ext.create('Ext.window.Window', {
        //     // id:'win_errorInfo_outbound',
        //     title: '领料',
        //     height: 500,
        //     width: 800,
        //     layout: 'fit',
        //     closable : true,
        //     draggable:true,
        //     closeAction : 'hidden',
        //     // tbar:toolbar_pop1,
        //     items:grid_back_query_pickList_specific,
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
        var preprocess_receive_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'preprocess_receive_errorlist_outbound',
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
            //selType:'checkboxmodel',
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
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
            items:preprocess_receive_errorlist_outbound,
        });


        var toobar_right = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '领料人',
                //     id :'pickName',
                //     width: 200,
                //     labelWidth: 50,
                //     name: 'pickName',
                //     value:"",
                // },
                {
                    fieldLabel : '领料人',
                    xtype : 'combo',
                    name : 'operator_pick',
                    id : 'operator_pick',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 200,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                // {
                //     xtype: 'datefield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '领料时间',
                //     id :'pickTime',
                //     width: 200,
                //     labelWidth: 60,
                //     name: 'pickTime',
                //     value:"",
                //     format : 'Y-m-d',
                //     editable : false,
                //     // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                //     value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                // },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    margin : '0 0 0 30',
                    text : '领料',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型pro_picking_PreprocessGrid
                        console.log('1===========')
                        var select = Ext.getCmp('pro_picking_PreprocessGrid').getStore()
                            .getData();
                        // console.log(select)
                        var projectId = Ext.getCmp('project_Id').getValue();
                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        console.log(s)
                        console.log('2===========')
                        var operator = Ext.getCmp('operator_pick').getValue();
                        console.log('2===========',operator)
                        //判断条件：若无数据或者没有操作人员则报错，不能提交
                        if(s.length != 0 && operator != null ){
                            //获取数据
                            Ext.Ajax.request({
                                url : 'order/finishRequisitionOrder.do', //领料
                                method:'POST',
                                // submitEmptyText : false,
                                params : {
                                    requisitionOrderId:Ext.getCmp('picklistId').getValue(),
                                    projectId:projectId,
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

                                                        Ext.MessageBox.alert("提示","领取失败！标红的行数据存在问题！\n 请检查后重新领料！" );
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
                                            Ext.MessageBox.alert("提示","领取失败！未选择领取材料" );
                                        }
                                        else if(errorCode == 200){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","领取失败！未收到领料单号或项目ID" );
                                        }
                                        else if(errorCode == 300){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","领取失败！未选择领料人" );
                                        }
                                        else if(errorCode == 1000){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","领取失败，未知错误！请重新领取" );
                                        }
                                    }else{
                                        Ext.MessageBox.hide();
                                        Ext.MessageBox.alert("提示","领取成功" );

                                        //  领料页面重置
                                        Ext.getCmp('operator').setValue("");
                                        pickList.removeAll();

                                        //  领料单查询重新加载
                                        grid_back_query_pickList_specific.getStore().load();
                                    }
                                    // if(response == true){
                                    //     Ext.MessageBox.alert("提示","领取成功" );
                                    // }else{
                                    //     Ext.MessageBox.alert("提示","领取失败" );
                                    // }
                                },
                                failure : function(response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示","领取失败" );
                                }
                            });
                        }else {
                            Ext.MessageBox.alert("提示","没有数据或领料人！" );
                        }
                    }
                }

            ]
        });

        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'pro_picking_PreprocessGrid',
            store:pickList,
            dock: 'bottom',
            autoScroll: true, //超过长度带自动滚动条
            columns:[
                //序号
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start_rec　+　1　+　rowIndex;
                    }
                },
                {dataIndex:'name', text:'材料名',flex :1 },
                {
                    dataIndex:'count',//countTemp
                    text:'领取数量',
                    flex :1
                    //editor:{xtype : 'textfield', allowBlank : true},
                },
            ],
            // height:'100%',
            flex:1,
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
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

        // function conrirmTab(e) {
        //     Ext.MessageBox.show({
        //         title:'操作确认',
        //         msg:'您确定要退出  <b>'+e.title+'</b> 么？',
        //         buttons:Ext.MessageBox.YESNO,
        //         icon:Ext.MessageBox.QUESTION,
        //         fn:function(btn, text) {
        //             if(btn=='yes') {
        //                 // Ext.getCmp('pick_tabpanel').remove(e);//remove(tab,true)
        //                 Ext.getCmp('pick_tabpanel').remove(e,true)
        //             }
        //         }
        //     });
        //     return false;
        // }

        //领料的具体材料信息Panel
        var panel_specific_back = Ext.create('Ext.panel.Panel',{
            // title: '领料单材料详情',
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            tbar:toolbar_show_back,
            width:'100%',
            height:500,
            // closable:true,
            // closeAction : 'hide',
            // autoDestroy: false,
            items:[
                grid_back_query_pickList_specific,
                {
                    xtype:'container',
                    // flex:0.3,
                    items:[{
                        xtype:'button',
                        // margin: '0 0 0 30',
                        text:'选择',
                        itemId:'move_right',
                        handler:function() {
                            var records = grid_back_query_pickList_specific.getSelectionModel().getSelection();
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
                            grid_back_query_pickList_specific.store.add(records);//grid_back_query_pickList_specific
                        }
                    }]
                },
                grid2,
            ],
            // listeners:{
            //     beforeclose: conrirmTab
            // }
        });

        //领料单查询信息 panel
        var panel_query = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            title:'领料单查询',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:'100%',
            items:[grid1],

        });

        // this.tbar = toolbar;

        this.items = [panel_query];
        this.callParent(arguments);
    }
})