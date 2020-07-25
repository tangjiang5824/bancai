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
            //
        });


        //查询的工单数据存放位置---上界面
        var worksheetListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllbyTableNameAndOnlyOneCondition.do',
                reader : {
                    type : 'json',
                    rootProperty: 'work_order_log_view',
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
                                tableName:table_workoderLog,
                                columnName:'projectId',
                                columnValue:Ext.getCmp('projectName').getValue(),
                            }
                        });
                    }
                }]
        });


        var worksheet_Grid=Ext.create('Ext.grid.Panel',{
            title: '工单查询',
            id : 'worksheet_Grid',
            store:worksheetListStore,
            dock: 'bottom',
            columns:[
                // {
                //     dataIndex:'projectName',
                //     text:'项目名',
                //     flex :1
                // },
                // {
                //     dataIndex:'buildingName',
                //     text:'楼栋名',
                //     flex :1
                // },
                // {
                //     dataIndex:'buildingPositionName',
                //     text:'清单位置',
                //     flex :1
                // },
                {
                    dataIndex:'id',
                    text:'工单号',
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
                    flex :1
                },
            ],
            flex:1,
            // height:'100%',
            tbar: toolbar,
            selType:'checkboxmodel', //选择框
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
            listeners: {
                // 双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data;
                    //工单id
                    var workorderlogId = select.id;

                    //var pickNumber = select.

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

                    Ext.getCmp("toolbar_pop").items.items[0].setText(workorderlogId);//修改id为win_num的值，动态显示在窗口中
                    // //传rowNum响应的行号:index+1
                    // Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                    specific_workorder_outbound.setStore(specific_worksheet_List);
                    win_showworkorder_outbound.show();
                }

            }

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
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '审核人',
                    id :'operator_back',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator_back',
                    value:"",
                },
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '审核时间',
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
                    text: '审核',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        var material_logId = Ext.getCmp("log_id").text;
                        var is_rollback = Ext.getCmp("is_rollback").text;
                        var operator = Ext.getCmp("operator_back").getValue();
                        // console.log("id为：----",is_rollback)
                        //    material/backMaterialstore.do
                        if (is_rollback != 1){
                            Ext.Msg.show({
                                title: '操作确认',
                                message: '将回滚数据，选择“是”否确认？',
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
                                                Ext.MessageBox.alert("提示", "回滚成功!");
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

        var win_showworkorder_outbound = Ext.create('Ext.window.Window', {
            // id:'win_showworkorder_outbound',
            title: '工单详情',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            items:specific_workorder_outbound,
        });



        this.items = [worksheet_Grid];
        this.callParent(arguments);
    }
})