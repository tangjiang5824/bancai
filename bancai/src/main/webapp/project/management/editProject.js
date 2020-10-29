Ext.define('project.management.editProject',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目信息修改',
    initComponent: function(){
        var table_name="building";
        var itemsPerPage = 50;
        var tableName="project_username_statusName";
        //var materialType="1";
        //项目是否为预加工项目：枚举类型
        Ext.define('Project.check.State', {
            statics: { // 关键
                0: { value: '0', name: '否' },
                1: { value: '1', name: '是' },
                // 2: { value: '2', name: '已驳回' },
                null: { value: 'null', name: '无' },
            }
        });
        var record_start = 0;

        var tableListStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
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
            labelWidth : 60,
            width : 550,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'projectName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: tableListStore,
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
                // render: function (combo) {//渲染
                //     combo.getStore().on("load", function (s, r, o) {
                //         combo.setValue(r[0].get('projectName'));//第一个值
                //     });
                // }
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

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            dock:'top',
            items: [
                tableList,
                {
                    xtype:'tbtext',
                    text:'项目时间:',
                    margin : '0 10 0 20',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'startTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'startTime',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    id :'endTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'endTime',
                    value:"",
                },
                {
                    xtype:'tbtext',
                    text:'项目计划时间:',
                    margin : '0 10 0 20',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'proStartTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'proStartTime',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'monthfield',
                    margin : '0 10 0 0',
                    id :'proEndTime',
                    width: 100,
                    // labelWidth: 60,
                    name: 'proEndTime',
                    value:"",
                }]
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

        var toobar_2 = Ext.create('Ext.toolbar.Toolbar',{
            dock:'top',
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '项目负责人',
                //     id :'projectLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'projectLeader',
                //     value:"",
                // },
                {
                    fieldLabel : '计划负责人',
                    xtype : 'combo',
                    name : 'planLeader',
                    id : 'planLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true
                },
                {
                    fieldLabel : '生产负责人',
                    xtype : 'combo',
                    name : 'produceLeader',
                    id : 'produceLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '采购负责人',
                    xtype : 'combo',
                    name : 'purchaseLeader',
                    id : 'purchaseLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '财务负责人',
                    xtype : 'combo',
                    name : 'financeLeader',
                    id : 'financeLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '仓库负责人',
                    xtype : 'combo',
                    name : 'storeLeader',
                    id : 'storeLeader',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype : 'button',
                    text: '查询',
                    iconCls:'right-button',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        console.log("项目id：",Ext.getCmp('projectName').value)
                        console.log("项目名：",Ext.getCmp('projectName').rawValue)
                        Query_Project_Store.load({
                            params : {
                                projectId:Ext.getCmp('projectName').value,
                                projectName:Ext.getCmp('projectName').rawValue,//获取显示字段
                                startTime:Ext.getCmp('startTime').getValue(),
                                endTime:Ext.getCmp('endTime').getValue(),
                                proStartTime:Ext.getCmp('proStartTime').getValue(),
                                proEndTime:Ext.getCmp('proEndTime').getValue(),
                                planLeader:Ext.getCmp('planLeader').getValue(),
                                produceLeader:Ext.getCmp('produceLeader').getValue(),
                                purchaseLeader:Ext.getCmp('purchaseLeader').getValue(),
                                financeLeader:Ext.getCmp('financeLeader').getValue(),
                                storeLeader:Ext.getCmp('storeLeader').getValue(),
                            }
                        });
                    }
                }
                // ,{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '采购负责人',
                //     id :'purchaseLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'purchaseLeader',
                //     value:"",
                //
                // },{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '财务负责人',
                //     id :'financeLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'financeLeader',
                //     value:"",
                //
                // },{
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '仓库负责人',
                //     id :'storeLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'storeLeader',
                //     value:"",
                // }
                ]
        });


        //项目信息store
        var Query_Project_Store = Ext.create('Ext.data.Store',{
            id: 'Query_Project_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                // url : "material/findAllBytableName.do?tableName="+tableName,
                url:"project/findprojectBycondition.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    //totalProperty: 'totalCount'
                },
                params:{
                    // start: 0,
                    // limit: itemsPerPage
                    //后面需要添加
                    //tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({


                    });
                }

            }
        });

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            saveBtnText: '保存',
            cancelBtnText: '取消',
            autoCancel: false
        });

        var buildingOwnerList=Ext.create('Ext.form.ComboBox',{
            id :  'buildingOwnerList',
            name : 'buildingOwnerList',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'workerName',
            valueField: 'id',
            forceSelection: true,
            editable : false,
            triggerAction: 'all',
            selectOnFocus:true,
            store: workerListStore,
        });
        //弹出表格，楼栋信息表
        var building_grid=Ext.create('Ext.grid.Panel',{
            id : 'building_grid',
            style:"text-align:center;",
            // store:store1,//specificMaterialList，store1的数据固定
            // dock: 'bottom',
            // bbar:toolbar4,
            columns:[
                {
                    text: '楼栋编号',
                    dataIndex: 'buildingNo',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },{
                    dataIndex : 'buildingName',
                    text : '楼栋名',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },{
                    dataIndex : 'buildingLeader',
                    text : '楼栋负责人',
                    flex :1,
                    editor:buildingOwnerList,renderer:function(value, cellmeta, record){
                        var index = workerListStore.find(buildingOwnerList.valueField,value);
                        var ehrRecord = workerListStore.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('workerName');
                        }
                        return returnvalue;
                    }


                },{
                    xtype:'actioncolumn',
                    text : '删除操作',
                    width:100,
                    style:"text-align:center;",
                    items: [
                        //修改按钮
                        // {
                        //     icon: 'extjs/imgs/edit.png',  // Use a URL in the icon config
                        //     tooltip: 'Edit',
                        //     style:"margin-right:20px;",
                        //     handler: function(grid, rowIndex, colIndex) {
                        //         // var records = grid.getSelectionModel();
                        //         // var rec = records.getSelection();
                        //
                        //         var rec = grid.getStore().getAt(rowIndex);
                        //         console.log("当前修改选中：",rec)
                        //         // Ext.getCmp('building_grid').getStore().remove(rec);
                        //     }
                        // },
                        //删除按钮
                        {
                            icon: 'extjs/imgs/delete.png',
                            tooltip: 'Delete',
                            style:"margin-right:20px;",
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                console.log("删除：",rec.data.id)
                                //楼栋id
                                var buildingId = rec.data.id;
                                //弹框提醒
                                Ext.Msg.show({
                                    title: '操作确认',
                                    message: '将删除数据，选择“是”否确认？',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                // url:"material/backMaterialstore.do",  //删除楼栋信息
                                                params:{
                                                    buildingId:buildingId,
                                                },
                                                success:function (response) {
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('building_grid').getStore().remove(rec);
                                                },
                                                failure : function(response){
                                                    Ext.MessageBox.alert("提示", "删除失败!");
                                                }
                                            })
                                        }
                                    }
                                });
                                // alert("Terminate " + rec.get('firstname'));
                            }
                    }]
                    // name : '操作',
                    // text : '操作',
                    // renderer:function(value, cellmeta){
                    //     return "<INPUT type='button' value='删除' style='font-size: 6px;height:20px;width:35px;'>";
                    //     // return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    // }
                }
            ],
            flex:1,
            //selType:'checkboxmodel',
            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 2
            // })],
            plugins : [rowEditing], //行编辑

            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    var flag=false;
                    if(id === "" || id ==null|| isNaN(id)){
                        flag=true;
                        id='0'
                    }
                    //项目id
                    var project_Id = Ext.getCmp("project_id").text;
                    console.log("项目id：",project_Id)

                    //修改的行数据
                    var data = editor.context.newValues;
                    //每个属性值
                    var buildingNo = data.buildingNo;
                    var buildingName = data.buildingName;
                    var buildingLeader = data.buildingLeader;


                    var s = new Array();
                    //修改的一行数据
                    s.push(JSON.stringify(data));
                    // console.log("editor===",editor.context.newValues)  //

                    Ext.Ajax.request({
                        url:"project/addAndupdateBuiling.do",  //EditDataById.do
                        params:{
                            // tableName:table_name,
                            projectId:project_Id,
                            // field:field,
                            // value:e.value,
                            id:id,
                            // s : "[" + s + "]",
                            buildingNo:buildingNo,
                            buildingName:buildingName,
                            buildingLeader:buildingLeader
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            if(flag){
                                e.record.data.id=response.responseText;
                            }
                            //重新加载
                            Ext.getCmp('building_grid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
            }
        });

        //弹出框的表头
        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            items: [
                // MaterialTypeList,
                {
                    //保存projectId的值
                    xtype: 'tbtext',
                    id:'project_id',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '增加新楼栋',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{

                            '楼栋编号' : '',
                            '楼栋名' : '',
                            '楼栋负责人' : ''

                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('building_grid').getStore().loadData(data,
                            true);

                    }

                },
            ]
        });

        //弹出窗口
        var win_showbuildingData = Ext.create('Ext.window.Window', {
            // id:'win_showbuildingData', //添加id，会影响弹框界面混乱
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            tbar:toolbar_pop,
            items:building_grid,
            closeAction : 'hidden',
            modal:true,//模态窗口，背景窗口不可编辑
        });


        //项目信息表
        var grid = Ext.create('Ext.grid.Panel',{
            id: 'Query_Project_Main',
            title:'项目信息',
            store: Query_Project_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start　+　1　+　rowIndex;
                    }
                },
                { text: '项目名称', dataIndex: 'projectName', flex :1 },
                { text: '开始时间',  dataIndex: 'startTime' ,flex :1},
                { text: '结束时间', dataIndex: 'endTime', flex :0.7 },
                { text: '预计开始时间', dataIndex: 'proStartTime', flex :0.7 },
                { text: '预计结束时间', dataIndex: 'proEndTime', flex :0.7 },
                { text: '计划负责人',  dataIndex: 'planLeaderName' ,flex :1},
                { text: '生产负责人', dataIndex: 'produceLeaderName', flex :1},
                { text: '采购负责人', dataIndex: 'purchaseLeaderName', flex :1},
                { text: '财务负责人', dataIndex: 'financeLeaderName', flex :1},
                { text: '仓库负责人', dataIndex: 'storeLeaderName', flex :1},
                { text: '是否为预加工项目', dataIndex: 'isPreprocess', flex :1,
                    renderer: function (value) {
                        return Project.check.State[value].name; // key-value
                    },
                },

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // tbar: toobar_2,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: Query_Project_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                //监听修改
                // validateedit : function(editor, e) {
                //     var field=e.field
                //     var id=e.record.data.id
                //     Ext.Ajax.request({
                //         url:"data/EditCellById.do",  //EditDataById.do
                //         params:{
                //             tableName:tableName,
                //             field:field,
                //             value:e.value,
                //             id:id
                //         },
                //         success:function (response) {
                //             //console.log(response.responseText);
                //         }
                //     })
                // },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data
                    //项目id
                    var projectId = select.id;//项目名对应的id

                    console.log("iiiii")
                    console.log(projectId)

                    var buildinglList_projectId = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['buildingNo','buildingName','buildingLeader'],
                        proxy : {
                            type : 'ajax',
                            url : 'project/findBuilding.do?projectId='+projectId,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            },
                            // params:{
                            //     materialName:materialName,
                            //     // start: 0,
                            //     // limit: itemsPerPage
                            // }
                        },
                        autoLoad : true
                    });

                    //将projectId传给弹出框
                    Ext.getCmp("toolbar_pop").items.items[0].setText(projectId);
                    building_grid.setStore(buildinglList_projectId);
                    win_showbuildingData.show();
                }
            }
        });

        //添加cell单击事件
        // building_grid.addListener('cellclick', cellclick);
        // function cellclick(grid, rowIndex, columnIndex, e) {
        //     if (rowIndex < 0) {
        //         return;
        //     }
        //     var fieldName = Ext.getCmp('addDataGrid').columns[columnIndex-1].text;
        //
        //     console.log("列名：",fieldName)
        //     if (fieldName == "操作") {
        //         //设置监听事件getSelectionModel().getSelection()
        //         var sm = Ext.getCmp('addDataGrid').getSelectionModel();
        //         var materialArr = sm.getSelection();
        //         if (materialArr.length != 0) {
        //             Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认删除？", function (btn) {
        //                 if (btn == 'yes') {
        //                     //先删除后台再删除前台
        //                     //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
        //
        //                     //Extjs 4.x 删除
        //                     Ext.getCmp('addDataGrid').getStore().remove(materialArr);
        //                 } else {
        //                     return;
        //                 }
        //             });
        //         } else {
        //             //Ext.Msg.confirm("提示", "无选中数据");
        //             Ext.Msg.alert("提示", "无选中数据");
        //         }
        //     }
        //
        //
        //     console.log("rowIndex:",rowIndex)
        //     console.log("columnIndex:",columnIndex)
        //
        //
        // };

        //设置panel多行tbar
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },{
            xtype : 'toolbar',
            dock : 'top',
            items : [toobar]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toobar_2]
        },
        ];
        this.items = [grid];
        this.callParent(arguments);
    }
})