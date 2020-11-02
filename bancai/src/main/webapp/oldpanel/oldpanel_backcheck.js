Ext.define('oldpanel.oldpanel_backcheck',{
    // extend:'Ext.panel.Panel',
    extend:'Ext.tab.Panel',
    id:'old_pick_tabpanel',
    region: 'center',
    layout:'fit',
    title: '旧板退料审核',

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
            width : 550,
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
                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        // combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },
                select:function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)
                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : true,
                        listeners:{
                            load:function () {
                                Ext.getCmp('buildingName').setValue("");
                            }
                        }
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);
                }
            }
        });
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 0 0 40',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
        });

        //查询领料单
        var backListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'backStore/queryReturnOrder.do?type=3', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                }
            },
            autoLoad : true
        });

        var old_pickList=Ext.create('Ext.data.Store',{
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

        var backTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"1", "name":"成品退库"},
                {"abbr":"2", "name":"预加工半成品库"},
                {"abbr":"3", "name":"旧版库"},
                {"abbr":"4", "name":"原材料库"}
                //...
            ]
        });
        var backType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '退料类型',
            name: 'backType',
            id: 'backType',
            store: backTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 30 0 0',
            width: 200,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        var toolbar_top = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar_top",
            items: [
                //退料类型
                // backType,
                tableList,
                buildingName,
            ]
        });
        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [
                //单号
                {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '退料单号',
                    id :'backlistNum',
                    width: 200,
                    labelWidth: 60,
                    name: 'backlistNum',
                    value:"",
                },
                {
                    fieldLabel : '退料人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
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
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')

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
                    text: '项目退料单查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        backListStore.load({
                            params : {
                               // type:3,//默认旧板
                                projectId:Ext.getCmp('projectName').getValue(),
                                buildingId:Ext.getCmp('buildingName').getValue(),
                                operator:Ext.getCmp('operator').getValue(),
                                returnOrderId:Ext.getCmp('backlistNum').getValue(),
                                timeStart:Ext.getCmp('startTime').getValue(),
                                timeEnd:Ext.getCmp('endTime').getValue(),
                            }
                        });
                    }
                }]
        });



        var backlistgrid1 = Ext.create('Ext.grid.Panel',{
            // id : 'PickingListGrid',
            store:backListStore,//修改
            dock: 'bottom',
            columns:[{
                dataIndex:'returnOrderId',
                text:'退料单号',
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
                {
                    dataIndex:'buildingName',
                    text:'所属楼栋',
                    flex :1
                },
                {
                    dataIndex:'description',
                    text:'退料原因',
                    flex :1
                },
            ],
            flex:1,
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            // height:'100%',
            // tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // dockedItems: [
            //     {
            //         xtype: 'pagingtoolbar',
            //         store: backListStore,   // same store GridPanel is using
            //         dock: 'bottom',
            //         displayInfo: true,
            //         displayMsg:'显示{0}-{1}条，共{2}条',
            //         emptyMsg:'无数据'
            //     }
            // ],

            //多个tbar
            dockedItems:[{
                xtype : 'toolbar',
                dock : 'top',
                items : [toolbar_top]
            },
                {
                    xtype : 'toolbar',
                    dock : 'top',
                    style:'border-width:0 0 0 0;',
                    items : [toolbar]
                },
            ],
            listeners: {
                // 双击表行响应事件,显示领料单的具体信息
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data;
                    console.log("select--======",select);
                    var returnOrderId = select.returnOrderId;
                    var project_name = select.projectName;

                    //退料单查询
                    specific_backList.load({
                        params : {
                            returnOrderId:returnOrderId,
                        }
                    });

                    //确认领料部分，重置
                    old_pickList.removeAll();


                    toolbar_specific_backList.items.items[0].setValue(returnOrderId);
                    toolbar_specific_backList.items.items[1].setValue(project_name);

                    // //弹框
                    // win_picklistInfo_material_outbound.show();

                    var tabPanel = Ext.getCmp('old_pick_tabpanel');
                    var tabs = Ext.getCmp('myold_Panel');
                    if(!tabs){
                        var t = tabPanel.add({
                            // title:requisitionOrderId+'领料单明细',
                            title:'明细',
                            id:'myold_Panel',
                            layout:'fit',
                            items:[old_panel_specific],
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
                        // tabPanel.remove(tab);
                        return false;
                    });
                }
            }
        });

        var specific_backList = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:['materialName','length','materialType','width','specification','number'],
            proxy : {
                type : 'ajax',
                url : 'backStore/queryReturnOrderDetail.do',//获取同类型的原材料  +'&pickNum='+pickNum
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

        var toolbar_specific_backList = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            // id : "toolbar_specific_backList",
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '退料单号',
                    id :'backlist_id',
                    width: 200,
                    labelWidth: 60,
                    name: 'backlist_id',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                }, {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '所属项目',
                    id :'project_name',
                    width: 550,
                    labelWidth: 60,
                    name: 'project_name',
                    value:"",
                    editable : false,
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                }
            ]
        });

        //退料单明细
        var grid_backList_specific=Ext.create('Ext.grid.Panel',{
            // id : 'grid_backList_specific',
            tbar:toolbar_specific_backList,
            store:specific_backList,
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
                    dataIndex:'name',
                    text:'品名',
                    flex :1
                },
                {
                    dataIndex:'countAll',
                    text:'退料数量',
                    flex :1,
                },
                {
                    dataIndex:'countReturn',
                    text:'待退数量',
                    flex :1,
                },
                {
                    dataIndex:'backWarehouseName',
                    text:'退料仓库',
                    flex :1,
                },
                {
                    dataIndex:'warehouseName',
                    text:'收料仓库',
                    flex :1,
                },

                {
                    dataIndex:'unitArea',
                    text:'单面积',
                    flex :1,
                },
                {
                    dataIndex:'unitWeight',
                    text:'单重',
                    flex :1,
                },
                // {
                //     dataIndex:'totalArea',
                //     text:'总面积',
                //     flex :1,
                // },
                // {
                //     dataIndex:'totalWeight',
                //     text:'总重',
                //     flex :1,
                // },
                {
                    dataIndex:'count',
                    text:'退料数量',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
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
                    store: specific_backList,   // same store GridPanel is using
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
        //     items:grid_backList_specific,
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
        var material_receive_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'material_receive_errorlist_outbound',
            // tbar: toolbar_pop,
            store:m_receive_errorlistStore,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
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
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
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
            items:material_receive_errorlist_outbound,
        });


        var toobar_choose = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    fieldLabel : '确认人',
                    xtype : 'combo',
                    name : 'operator_back1',
                    id : 'operator_back1',
                    margin: '0 40 0 0',
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
                    margin : '0 0 0 30',
                    text : '确认完成退料',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型return_Grid
                        console.log('1===========')
                        var select = Ext.getCmp('return_Grid').getStore()
                            .getData(); //表格的所有数据
                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        console.log(s)
                        console.log('2===========')
                        var operator = Ext.getCmp('operator_back1').getValue();
                        //判断条件：若无数据或者没有操作人员则报错，不能提交
                        if(s.length != 0 && operator != null ){
                            //获取数据
                            Ext.Ajax.request({
                                url : 'order/finishReturnOrder.do', //确认退料
                                method:'POST',
                                // submitEmptyText : false,
                                params : {
                                    operator:operator,
                                    s : "[" + s + "]",//存储选择领料的数量
                                    type:3,//旧板
                                    returnOrderId:Ext.getCmp('backlist_id').getValue(),
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
                                                message: '退料失败，存在错误输入！\n是否查看具体错误数据',
                                                buttons: Ext.Msg.YESNO,
                                                icon: Ext.Msg.QUESTION,
                                                fn: function (btn) {
                                                    if (btn === 'yes') {
                                                        //点击确认，显示重复的数据
                                                        // m_receive_errorlistStore.loadData(errorList);
                                                        // win_mrec_errorInfo_outbound.show();

                                                        Ext.MessageBox.alert("提示","退料失败！标红的行数据存在问题！\n 请检查后重新领料！" );

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
                                            Ext.MessageBox.alert("提示","退料失败！未选择退料材料" );
                                        }
                                        else if(errorCode == 200){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","退料失败！未获取到类型或退料单号" );
                                        }
                                        else if(errorCode == 300){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","退料失败！未选择退料人" );
                                        }
                                        else if(errorCode == 1000){
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert("提示","退料失败，未知错误！请重新退料" );
                                        }
                                    }else{
                                        Ext.MessageBox.hide();
                                        Ext.MessageBox.alert("提示","退料成功" );

                                        //  领料页面重置
                                        Ext.getCmp('operator').setValue("");
                                        old_pickList.removeAll();

                                        //  领料单查询重新加载
                                        grid_backList_specific.getStore().load();
                                    }
                                },
                                failure : function(response) {
                                    console.log('--------------responseresponse',response)
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示","退料失败" );
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
            id : 'return_Grid',
            store:old_pickList,
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
                {dataIndex:'name', text:'材料名',flex :1 },
                {
                    dataIndex:'count',//countTemp
                    text:'退料数量',
                    flex :1
                },
            ],
            // height:'100%',
            flex:1,
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            tbar:toobar_choose,
            selType:'checkboxmodel',
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: old_pickList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        //领料的具体材料信息Panel
        var old_panel_specific = Ext.create('Ext.panel.Panel',{
            // title: '领料单明细',
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            items:[
                grid_backList_specific,
                {
                    xtype:'container',
                    // flex:0.3,
                    items:[{
                        xtype:'button',
                        // margin: '0 0 0 30',
                        text:'选择',
                        itemId:'move_right',
                        handler:function() {
                            var records = grid_backList_specific.getSelectionModel().getSelection();
                            console.log(records)
                            console.log("测试")
                            console.log(records[0])

                            for (i = 0; i < records.length; i++) {
                                console.log(records[i].data['countTemp'])
                                if(records[i].data['countTemp'] != 0){
                                    console.log("添加")
                                    old_pickList.add(records[i]);
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
                            old_pickList.remove(records);
                            grid_backList_specific.store.add(records);//grid_backList_specific
                        }
                    }]
                },
                grid2,
            ],
        });

        //领料单查询信息 panel
        var panel_query = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            title:'退料单查询',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:'100%',
            items:[backlistgrid1],
        });

        // this.tbar = toolbar;

        // this.dockedItems=[{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toolbar_top]
        // },
        //     {
        //         xtype : 'toolbar',
        //         dock : 'top',
        //         style:'border-width:0 0 0 0;',
        //         items : [toolbar]
        //     },
        // ];

        this.items = [panel_query];
        this.callParent(arguments);
    }
})