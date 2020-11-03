Ext.define('project.project_check_worksheet',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '工单审核',
    initComponent: function(){
        var itemsPerPage = 50;
        var table_workoderLog="work_order_log_view";
        var table_workoderLogDetail="work_order_detail_view";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';
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
        //工单审核状态：枚举类型
        Ext.define('Worksheet.check.State', {
            statics: { // 关键
                0: { value: '0', name: '待审核' },
                1: { value: '1', name: '已审核' },
                2: { value: '2', name: '已驳回' },
                null: { value: 'null', name: '无' },
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
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
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
            }
            //
        });


        //查询的工单数据存放位置---上界面
        var worksheetListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'order/workApprovalview.do',
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                }
            },
            autoLoad : false
        });

        //是否审核
        var isActiveListStore = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"待审核"},
                {"abbr":"1", "name":"已审核"},
                {"abbr":"2", "name":"已驳回"},
                //...
            ]
        });

        var isActiveList = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '工单状态',
            name: 'isActiveList',
            id: 'isActiveList',
            store: isActiveListStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 160,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                //是否审核
                isActiveList,
                {
                    xtype : 'button',
                    text: '项目工单查询',
                    width: 100,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        worksheetListStore.load({
                            params : {
                                projectId:Ext.getCmp('projectName').getValue(),
                                isActive:Ext.getCmp('isActiveList').getValue(),
                                // tableName:table_workoderLog,
                                // columnName:'projectId',
                                // columnValue:Ext.getCmp('projectName').getValue(),
                            }
                        });
                    }
                }]
        });


        var worksheet_Grid=Ext.create('Ext.grid.Panel',{
            // title: '工单查询',
            id : 'worksheet_Grid',
            store:worksheetListStore,
            dock: 'bottom',
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>无数据</div>",
                deferEmptyText: false
            },
            columns:[
                {
                    dataIndex:'id',
                    text:'工单号',
                    flex :1
                },
                {
                    dataIndex:'projectName',
                    text:'所属项目',
                    flex :1
                },
                {
                    dataIndex:'workerName',
                    text:'创建人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                }, {
                    dataIndex:'isActive',
                    text:'是否审核',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1,
                    renderer: function (value) {
                        return Worksheet.check.State[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='审核' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },


            ],
            flex:1,
            // height:'100%',
            tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                xtype: 'pagingtoolbar',
                store: worksheetListStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }
            ],
            // listeners: {
            //     // 双击表行响应事件
            //     itemdblclick: function(me, record, item, index,rowModel){
            //         var select = record.data;
            //         //工单id
            //         var workorderlogId = select.id;
            //
            //         //工单的具体信息
            //         var specific_worksheet_List = Ext.create('Ext.data.Store',{
            //             //id,materialName,length,width,materialType,number
            //             fields:['materialName','length','materialType','width','specification','number'],
            //             proxy : {
            //                 type : 'ajax',
            //                 url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+table_workoderLogDetail+'&columnName=workorderlogId'+'&columnValue='+workorderlogId,//获取同类型的原材料  +'&pickNum='+pickNum
            //                 reader : {
            //                     type : 'json',
            //                     rootProperty: table_workoderLogDetail,
            //                 },
            //             },
            //             autoLoad : true
            //         });
            //         Ext.getCmp("toolbar_pop").items.items[0].setText(workorderlogId);//修改id为win_num的值，动态显示在窗口中
            //         // //传rowNum响应的行号:index+1
            //         // Ext.getCmp("toolbar5").items.items[2].setText(index+1)
            //         specific_workorder_outbound.setStore(specific_worksheet_List);
            //         win_showworkorder_outbound.show();
            //     }
            // }

        });

        var toolbar_pop1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop1',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '工单号',
                    id :'worksheet_Id',
                    width: 250,
                    labelWidth: 50,
                    name: 'worksheet_Id',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '所属项目',
                    id :'projectName_Id',
                    width : 380,
                    labelWidth : 60,
                    name: 'projectName_Id',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
            ]
        });

        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            items: [
                {
                    //保存logid的值
                    xtype: 'tbtext',
                    id:'sheetLog_Id',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    //保存审核的值
                    xtype: 'tbtext',
                    id:'pop_isActive',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                // {
                //     xtype: 'textfield',
                //     margin : '0 40 0 0',
                //     fieldLabel: '审核人',
                //     id :'operator_back',
                //     width: 150,
                //     labelWidth: 50,
                //     name: 'operator_back',
                //     value:"",
                // },
                {
                    fieldLabel : '审核人',
                    xtype : 'combo',
                    name : 'operator_back',
                    id : 'operator_back',
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
                // {
                //     xtype : 'datefield',
                //     margin : '0 40 0 0',
                //     fieldLabel : '审核时间',
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
                    text: '审核',
                    width: 50,
                    margin: '0 40 0 0',
                    layout: 'right',
                    handler: function(){

                        //若工单已审核，则不能再审核
                        var isAct = Ext.getCmp("pop_isActive").text;
                        if(isAct == 0){
                            var worksheet_Id = Ext.getCmp("worksheet_Id").getValue();
                            console.log("worksheet_Id---------",worksheet_Id)
                            //    material/backMaterialstore.do
                            Ext.Msg.show({
                                title: '操作确认',
                                message: '将通过审核，选择“是”否确认？',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url:"order/workApproval.do",  //审核
                                            params:{
                                                id:worksheet_Id,  //工单id
                                                type:1,//审核通过
                                            },
                                            success:function (response) {
                                                Ext.MessageBox.alert("提示", "审核通过!");
                                                win_showworkorder_outbound.close();//关闭窗口
                                                //刷新页面
                                                Ext.getCmp("worksheet_Grid").getStore().load()
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "审核失败!");
                                            }
                                        })
                                    }
                                }
                            });
                        }
                        else{
                            Ext.MessageBox.alert("提示", "已审核!");
                        }
                    }
                },
                {
                    xtype : 'button',
                    text: '撤销审核',
                    width: 80,
                    margin: '0 40 0 0',
                    layout: 'right',
                    handler: function(){
                        //若工单未审核，则不能撤销审核
                        var isAct = Ext.getCmp("pop_isActive").text;
                        console.log("e.data：")
                        if(isAct == 1){
                            var worksheet_Id = Ext.getCmp("worksheet_Id").getValue();
                            Ext.Msg.show({
                                title: '操作确认',
                                message: '将驳回工单，选择“是”否确认？',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url:"order/workApproval.do",  //入库记录撤销
                                            params:{
                                                id:worksheet_Id,  //工单id
                                                type:2,//驳回审核
                                            },
                                            success:function (response) {
                                                //console.log(response.responseText);
                                                Ext.MessageBox.alert("提示", "驳回成功!");
                                                win_showworkorder_outbound.close();//关闭窗口
                                                //页面刷新
                                                Ext.getCmp("worksheet_Grid").getStore().load()
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "驳回失败!");
                                            }
                                        })
                                    }
                                }
                            });
                        }
                        else{
                            Ext.MessageBox.alert("提示", "工单未审核，不能撤销!");
                        }
                    }
                }
            ]
        });

        //弹出框，出入库详细记录
        var specific_workorder_outbound=Ext.create('Ext.grid.Panel',{
            id : 'specific_workorder_outbound',
            tbar: toolbar_pop,
            // store:material_Query_Records_store1,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    text: '楼栋名',
                    dataIndex: 'buildingName',
                    flex :1,
                    width:"80"
                },
                {
                    text: '清单位置',
                    dataIndex: 'positionName',
                    flex :1,
                    width:"80"
                },
                {
                    text: '产品名',
                    dataIndex: 'productName',
                    flex :1,
                    width:"80"
                },
                {
                    text: '产品数量',
                    flex :1,
                    dataIndex: 'count'
                },
                {
                    text: '工单创建时间',
                    flex :1,
                    dataIndex: 'time',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },

                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
        });

        var win_showworkorder_outbound = Ext.create('Ext.window.Window', {
            // id:'win_showworkorder_outbound',
            title: '工单详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            modal :true, //除了窗口，不能操作其他
            closeAction : 'hidden',
            tbar:toolbar_pop1,
            items:specific_workorder_outbound,
        });


        //添加cell单击事件
        worksheet_Grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            console.log("grid.columns[columnIndex]：",Ext.getCmp('worksheet_Grid').columns[columnIndex-1])
            var fieldName = Ext.getCmp('worksheet_Grid').columns[columnIndex-1].text;
            var sm = Ext.getCmp('worksheet_Grid').getSelectionModel();
            // var isrollback = Ext.getCmp('isrollback').getValue();
            var materialArr = sm.getSelection();
            var worksheetNum = e.data.id;  //选中记录的logid,工单号
            var projectName = e.data.projectName;  //选中记录的项目名
            var workorderlogId = e.data.id;  //选中记录的logid,工单号

            var isActive = e.data.isActive;
            console.log("e.data：",e.data)
            if (fieldName == "操作") {

                //设置监听事件getSelectionModel().getSelection()
                //工单的具体信息
                var specific_worksheet_List = Ext.create('Ext.data.Store',{
                    //id,materialName,length,width,materialType,number
                    fields:['materialName','length','materialType','width','specification','number'],
                    proxy : {
                        type : 'ajax',
                        url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+table_workoderLogDetail+'&columnName=workorderlogId'+'&columnValue='+workorderlogId,//获取同类型的原材料  +'&pickNum='+pickNum
                        reader : {
                            type : 'json',
                            rootProperty: table_workoderLogDetail,
                        },
                    },
                    autoLoad : true
                });
                Ext.getCmp("toolbar_pop1").items.items[0].setValue(worksheetNum);//修改id为win_num的值，动态显示在窗口中
                Ext.getCmp("toolbar_pop1").items.items[1].setValue(projectName);//修改id为win_num的值，动态显示在窗口中

                Ext.getCmp("toolbar_pop").items.items[0].setText(workorderlogId);//修改id为win_num的值，动态显示在窗口中
                Ext.getCmp("toolbar_pop").items.items[1].setText(isActive);//修改id为win_num的值，动态显示在窗口中

                // //传rowNum响应的行号:index+1
                // Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                specific_workorder_outbound.setStore(specific_worksheet_List);
                win_showworkorder_outbound.show();
            }
        }

        this.items = [worksheet_Grid];
        this.callParent(arguments);
    }
})