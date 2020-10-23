Ext.define('project.project_query_worksheet',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '工单查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var table_workoderLog="work_order_log_view";
        var table_workoderLogDetail="work_order_detail_view";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

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
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='工单详情' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },
                {
                    // name : '操作',
                    // name : '操作',
                    text : '打印',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='打印工单' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
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
                    specific_workorder_outbound_query.setStore(specific_worksheet_List);
                    win_showworkorder_outbound.show();
                }

            }

        });

        var toolbar_pop_query = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop_query',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '工单号',
                    id :'worksheet_Id_query',
                    width: 250,
                    labelWidth: 50,
                    name: 'worksheet_Id_query',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '所属项目',
                    id :'projectName_Id_query',
                    width : 380,
                    labelWidth : 60,
                    name: 'projectName_Id_query',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
            ]
        });

        //弹出框，出入库详细记录
        var specific_workorder_outbound_query=Ext.create('Ext.grid.Panel',{
            id : 'specific_workorder_outbound_query',
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
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            tbar:toolbar_pop_query,
            items:specific_workorder_outbound_query,
        });


        //添加cell单击事件
        worksheet_Grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            //console.log("grid.columns[columnIndex]：",Ext.getCmp('worksheet_Grid').columns[columnIndex-1])
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
                Ext.getCmp("toolbar_pop_query").items.items[0].setValue(worksheetNum);//修改id为win_num的值，动态显示在窗口中
                Ext.getCmp("toolbar_pop_query").items.items[1].setValue(projectName);//修改id为win_num的值，动态显示在窗口中

                // Ext.getCmp("toolbar_pop").items.items[0].setText(workorderlogId);//修改id为win_num的值，动态显示在窗口中
                // Ext.getCmp("toolbar_pop").items.items[1].setText(isActive);//修改id为win_num的值，动态显示在窗口中

                // //传rowNum响应的行号:index+1
                // Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                specific_workorder_outbound_query.setStore(specific_worksheet_List);
                win_showworkorder_outbound.show();
            }
            if (fieldName == "打印") {
                console.log("zzzzzzzzzzzzzzzzzyyyyyyyyyyyyyyyyyyyzzzzz")
                console.log(workorderlogId)
                Ext.Ajax.request({
                    url : 'project/printWorkOrder.do', //打印
                    method:'POST',
                    //submitEmptyText : false,
                    params : {
                        //s : "[" + s + "]",
                        workorderlogId : workorderlogId,
                        //operator: Ext.getCmp('operator').getValue(),
                        // inputTime:Ext.getCmp('inputTime').getValue(),
                    },
                    success : function(response) {
                        console.log("12312312312321",response.responseText);
                        // if(response.responseText.includes("false"))
                        // {
                        //     Ext.MessageBox.alert("提示","入库失败，品名不规范" );
                        // }
                        // //var message =Ext.decode(response.responseText).showmessage;
                        // else{
                        //     Ext.MessageBox.alert("提示","入库成功" );
                        // }

                        var res = response.responseText;
                        var jsonobj = JSON.parse(res);//将json字符串转换为对象
                        console.log(jsonobj);
                        console.log("success--------------",jsonobj.success);
                        console.log("errorList--------------",jsonobj['errorList']);
                        var success = jsonobj.success;
                        var errorList = jsonobj.errorList;
                        var errorCode = jsonobj.errorCode;
                        var errorCount = jsonobj.errorCount;
                        if(success == false){
                            //错误输入
                            if(errorCode == 200){
                                //关闭进度条
                                // Ext.MessageBox.alert("提示","匹配失败，产品位置重复或品名不合法！请重新导入" );
                                Ext.Msg.show({
                                    title: '提示',
                                    message: '打印失败！',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            //点击确认，显示重复的数据
                                            //old_inb_errorlistStore.loadData(errorList);
                                            //win_oldinb_errorInfo_outbound.show();

                                        }
                                    }
                                });
                            }
                            else if(errorCode == 1000){
                                Ext.MessageBox.alert("提示","打印失败，未知错误！请重新打印" );
                            }
                        }else{
                            Ext.MessageBox.alert("提示","打印成功" );
                        }

                    },
                    failure : function(response) {
                        //var message =Ext.decode(response.responseText).showmessage;
                        Ext.MessageBox.alert("提示","打印失败" );
                    }
                });
            }
        }


        this.items = [worksheet_Grid];
        this.callParent(arguments);
    }
})