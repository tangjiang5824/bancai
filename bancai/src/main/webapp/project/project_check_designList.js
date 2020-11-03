Ext.define('project.project_check_designList',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目设计清单撤销',
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
                0: { value: '0', name: '上传成功' },
                1: { value: '1', name: '已撤销' },
                // 2: { value: '2', name: '已驳回' },
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
            listeners: {
                change : function(combo, record, eOpts) {
                    if(this.callback) {
                        if(combo.lastSelection && combo.lastSelection.length>0) {
                            this.callback(combo.lastSelection[0]);
                        }
                    }
                },
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

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },

                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();
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
            margin: '0 10 0 40',
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
            fieldLabel : '位置',
            labelWidth : 30,
            width : 180,
            margin: '0 10 0 40',
            id :  'positionName',
            name : 'positionName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'positionName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: buildingPositionStore,
        });

        //查询的设计清单数据存放位置
        var designList_Store = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'designlist/queryUploadLog.do',//查询设计清单日志
                reader : {
                    type : 'json',
                    rootProperty: 'designlistlogList',
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
            fieldLabel: '设计清单状态',
            name: 'isActiveList',
            id: 'isActiveList',
            store: isActiveListStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 180,
            labelWidth: 80,
            renderTo: Ext.getBody()
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                buildingName,
                buildingPositionList,
                //是否审核
                // isActiveList,
                {
                    xtype : 'button',
                    text: '项目设计清单查询',
                    width: 130,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        designList_Store.load({
                            params : {
                                projectId: Ext.getCmp('projectName').getValue(),
                                buildingId: Ext.getCmp("buildingName").getValue(),
                                positionId: Ext.getCmp("positionName").getValue(),
                            }
                            });
                    }
                }]
        });


        var designList_Grid=Ext.create('Ext.grid.Panel',{
            // title: '工单查询',
            id : 'designList_Grid',
            store:designList_Store,
            dock: 'bottom',
            //默认无数据
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>无数据</div>",
                deferEmptyText: false
            },
            columns:[
                {
                    // header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                {
                    dataIndex:'designlistLogId',
                    text:'设计清单号',
                    flex :1
                },

                {
                    dataIndex:'userName',
                    text:'操作人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },
                {
                    dataIndex:'projectName',
                    text:'项目名',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },
                {
                    dataIndex:'buildingName',
                    text:'楼栋名',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },
                {
                    dataIndex:'buildingpositionName',
                    text:'位置',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },

                {
                    dataIndex:'isrollback',
                    text:'是否撤销',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1,
                    renderer: function (value) {
                        return Worksheet.check.State[value].name; // key-value
                    },
                },
                {
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='撤销' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
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
                store: designList_Store,   // same store GridPanel is using
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

        var toolbar_pop1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop1',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '设计清单号',
                    id :'designlist_Id',
                    width: 250,
                    labelWidth: 80,
                    name: 'designlist_Id',
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

        var toolbar_back_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_back_pop',
            items: [
                {
                    //保存logid的值
                    xtype: 'tbtext',
                    id:'designListLog_Id',
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
                    text: '撤销',
                    width: 50,
                    margin: '0 40 0 0',
                    layout: 'right',
                    handler: function(){
                        var designlist_Id = Ext.getCmp("designlist_Id").getValue();
                        console.log("designlist_Id---------",designlist_Id)
                        //    material/backMaterialstore.do
                        Ext.Msg.show({
                            title: '操作确认',
                            message: '将撤销设计清单，选择“是”否确认？',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url:"designlist/rollbackUploadData.do?designlistlogId="+designlist_Id,  //审核
                                        // params:{
                                        //     designlistlogId:designlist_Id,  //工单id
                                        // },
                                        success:function (response) {
                                            var jsonObj = JSON.parse(response.responseText);
                                            var success = jsonObj.success;
                                            var errorCode = jsonObj.errorCode;
                                            if(success == false){
                                                if(errorCode == 200){
                                                    //失败原因
                                                    Ext.MessageBox.alert("提示", "撤销失败，已生成工单，或该清单不存在!");
                                                }
                                                else if(errorCode == 100){
                                                    Ext.MessageBox.alert("提示", "撤销失败，未获取到该行数据!");
                                                }
                                                else if(errorCode == 1000){
                                                    //未知错误
                                                    Ext.MessageBox.alert("提示", "撤销失败，未知错误!");
                                                }
                                            }
                                            else{
                                                Ext.MessageBox.alert("提示", "撤销成功!");
                                                //关闭窗口
                                                win_showdesignList_outbound.close();
                                                //刷新页面
                                                designList_Store.load()
                                            }

                                            // win_showworkorder_outbound.close();//关闭窗口
                                            // //刷新页面
                                            // Ext.getCmp("designList_Grid").getStore().load()
                                            },
                                        failure : function(response){
                                            Ext.MessageBox.alert("提示", "撤销失败!");
                                        }
                                    })
                                }
                            }
                        });
                    }
                },
            ]
        });

        //弹出框，出入库详细记录
        var specific_designList_outbound=Ext.create('Ext.grid.Panel',{
            // id : 'specific_designList_outbound',
            tbar: toolbar_back_pop,
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
                    text: '位置',
                    dataIndex: 'position',
                    flex :1,
                    width:"80"
                },
                // {
                //     text: '产品名',
                //     dataIndex: 'productName',
                //     flex :1,
                //     width:"80"
                // },
                // {
                //     text: '产品数量',
                //     flex :1,
                //     dataIndex: 'count'
                // }
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

        var win_showdesignList_outbound = Ext.create('Ext.window.Window', {
            // id:'win_showdesignList_outbound',
            title: '设计清单详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            tbar:toolbar_pop1,
            items:specific_designList_outbound,
        });


        //添加cell单击事件
        designList_Grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            console.log("grid.columns[columnIndex]：",Ext.getCmp('designList_Grid').columns[columnIndex-1])
            var fieldName = Ext.getCmp('designList_Grid').columns[columnIndex-1].text;
            var sm = Ext.getCmp('designList_Grid').getSelectionModel();
            // var isrollback = Ext.getCmp('isrollback').getValue();
            var materialArr = sm.getSelection();
            var designlistLogId = e.data.designlistLogId;  //选中记录的logid,工单号
            var projectName = e.data.projectName;  //选中记录的项目名
            // var workorderlogId = e.data.id  //选中记录的logid,工单号
            var isrollback = e.data.isrollback;  //清单是否撤销
            console.log("e.data：",e.data)
            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                if(isrollback == 0){
                    //工单的具体信息
                    var specific_designList_List = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','materialType','width','specification','number'],
                        proxy : {
                            type : 'ajax',
                            url : 'designlist/queryDesignlistByLogId.do?designlistlogId='+designlistLogId,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'designlistList',
                            },
                        },
                        autoLoad : true
                    });
                    Ext.getCmp("toolbar_pop1").items.items[0].setValue(designlistLogId);//修改id为win_num的值，动态显示在窗口中
                    Ext.getCmp("toolbar_pop1").items.items[1].setValue(projectName);//修改id为win_num的值，动态显示在窗口中

                    // Ext.getCmp("toolbar_pop").items.items[0].setText(workorderlogId);//修改id为win_num的值，动态显示在窗口中
                    // //传rowNum响应的行号:index+1
                    // Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                    specific_designList_outbound.setStore(specific_designList_List);
                    win_showdesignList_outbound.show();
                }
                else{
                    Ext.MessageBox.alert("提示", "清单已撤销!");
                }
            }
        }

        this.items = [designList_Grid];
        this.callParent(arguments);
    }
})