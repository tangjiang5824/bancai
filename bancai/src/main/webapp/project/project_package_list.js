Ext.define('project.project_package_list',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目信息修改',
    initComponent: function(){

        var itemsPerPage = 50;
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
        var projectNameListStore = Ext.create('Ext.data.Store',{
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


        var projectNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 300,//'35%'
            queryMode: 'local',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectNameListStore,
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus:true,
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
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
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

                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedProjectName.do',
                    // 	params:{
                    // 		projectName:Ext.getCmp('projectName').getValue()
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })
                }
            }

        });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 200,
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
            listeners: {
                load:function () {

                    // // projectName:Ext.getCmp('projectName').getValue();
                    // // buildingName:Ext.getCmp('buildingName').getValue();
                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedBuildingName.do',
                    // 	params:{
                    // 		//projectName:Ext.getCmp('projectName').getValue(),
                    // 		buildingName:Ext.getCmp('buildingName').getValue(),
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })

                }
            }
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
            labelWidth : 60,
            width : 200,
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
            // listeners: {
            //
            //     //下拉框默认返回的第一个值
            //     render: function (combo) {//渲染
            //         combo.getStore().on("load", function (s, r, o) {
            //             combo.setValue(r[0].get('projectName'));//第一个值
            //         });
            //     }
            // }

        });

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar1",
            items : [   projectNameList,
                buildingName,
                //buildingPositionList,
                {
                    xtype : 'button',
                    text: '查询',
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
                        Query_Project_Store.load({
                            params : {
                                projectId: Ext.getCmp('projectName').getValue(),
                                buildingId: Ext.getCmp("buildingName").getValue(),
                                positionId: Ext.getCmp("positionName").getValue(),
                            }
                        });
                    }
                }

            ]//exceluploadform
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

        //项目信息store
        var Query_Project_Store = Ext.create('Ext.data.Store',{
            id: 'Query_Project_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                // url : "material/findAllBytableName.do?tableName="+tableName,
                url:"project/queryRunningProject.do",
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
                    projectId: Ext.getCmp('projectName').getValue(),
                    buildingId: Ext.getCmp("buildingName").getValue(),
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

        //弹出表格，楼栋信息表
        var pop_package_grid=Ext.create('Ext.grid.Panel',{
            id : 'pop_package_grid',
            style:"text-align:center;",
            // store:store1,//specificMaterialList，store1的数据固定
            // dock: 'bottom',
            // bbar:toolbar4,
            columns:[

                {
                    text: '包Id',
                    dataIndex: 'id',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    },
                    hidden:true,
                },{
                    text: '包编号',
                    dataIndex: 'packageNo',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },{
                    dataIndex : 'packageName',
                    text : '包名',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
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
                        //         // Ext.getCmp('pop_package_grid').getStore().remove(rec);
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
                                console.log(rec.data)
                                //楼栋id
                                var packageId = rec.data.id;
                                //弹框提醒
                                Ext.Msg.show({
                                    title: '操作确认',
                                    message: '将删除数据，选择“是”否确认？',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url:"/package/deletePackage.do",  //删除包信息
                                                params:{
                                                    packageId:packageId,
                                                },
                                                success:function (response) {
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('pop_package_grid').getStore().remove(rec);
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
                    var projectId = Ext.getCmp("projectId").text;
                    var buildingId = Ext.getCmp("buildingId").text;
                    console.log("update点完后的data")

                    //修改的行数据
                    var data = editor.context.newValues;
                    console.log(data)
                    //每个属性值
                    var packageNo = data.packageNo;
                    var packageName = data.packageName;
                    var packageId = data.id;


                    var s = new Array();
                    //修改的一行数据
                    s.push(JSON.stringify(data));
                    // console.log("editor===",editor.context.newValues)  //

                    Ext.Ajax.request({
                        url:"package/addPackage.do",  //EditDataById.do
                        params:{
                            // tableName:table_name,
                            //packageId:package_id,
                            // field:field,
                            // value:e.value,
                            //id:id,
                            // s : "[" + s + "]",
                            projectId:projectId,
                            buildingId:buildingId,
                            packageNo:packageNo,
                            packageName:packageName,
                            packageId:packageId
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            if(flag){
                                e.record.data.id=response.responseText;
                            }
                            //重新加载
                            Ext.getCmp('pop_package_grid').getStore().load();
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
                    xtype: 'tbtext',
                    id:'projectId',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    xtype: 'tbtext',
                    id:'buildingId',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    //保存projectId的值
                    xtype: 'tbtext',
                    id:'package_id',
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
                    text : '增加新包',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{

                            '包编号' : '',
                            '包名' : '',
                            //'楼栋负责人' : ''

                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('pop_package_grid').getStore().loadData(data,
                            true);

                    }

                },
            ]
        });

        //弹出窗口
        var win_showPackageData = Ext.create('Ext.window.Window', {
            // id:'win_showPackageData', //添加id，会影响弹框界面混乱
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            tbar:toolbar_pop,
            items:pop_package_grid,
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
                { text: '楼栋名称', dataIndex: 'buildingName', flex :1 },
                //{ text: '楼栋位置', dataIndex: 'positionName', flex :1 },
                // { text: '开始时间',  dataIndex: 'startTime' ,flex :1},
                // { text: '结束时间', dataIndex: 'endTime', flex :0.7 },
                // { text: '预计开始时间', dataIndex: 'proStartTime', flex :0.7 },
                // { text: '预计结束时间', dataIndex: 'proEndTime', flex :0.7 },
                // { text: '计划负责人',  dataIndex: 'planLeaderName' ,flex :1},
                // { text: '生产负责人', dataIndex: 'produceLeaderName', flex :1},
                // { text: '采购负责人', dataIndex: 'purchaseLeaderName', flex :1},
                // { text: '财务负责人', dataIndex: 'financeLeaderName', flex :1},
                // { text: '仓库负责人', dataIndex: 'storeLeaderName', flex :1},
                // { text: '是否为预加工项目', dataIndex: 'isPreprocess', flex :1,
                //     renderer: function (value) {
                //         return Project.check.State[value].name; // key-value
                //     },
                // },

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
                    var projectId = select.projectId;//项目名对应的id
                    var buildingId = select.buildingId;
                    var buildingpositionId = select.buildingpositionId;
                    var packageId = select.id;
                    console.log("iiiii")
                    console.log(select)
                    console.log(projectId)

                    var buildinglList_projectId = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['id','packageNo','packageName'],
                        proxy : {
                            type : 'ajax',
                            //url : 'project/findBuilding.do?projectId='+projectId,//获取同类型的原材料  +'&pickNum='+pickNum
                            url : 'project/queryPackageList.do?tableName=package_view&projectId='+projectId+'&buildingId='+buildingId,//+'&buildingpositionId='+buildingpositionId,
                            reader : {
                                type : 'json',
                                rootProperty: 'value',
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
                    Ext.getCmp("toolbar_pop").items.items[1].setText(buildingId);
                    pop_package_grid.setStore(buildinglList_projectId);
                    win_showPackageData.show();
                }
            }
        });

        //添加cell单击事件
        // pop_package_grid.addListener('cellclick', cellclick);
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
            items : [toolbar1]
        },
        //     {
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     style:'border-width:0 0 0 0;',
        //     items : [toobar_2]
        // },
        ];
        this.items = [grid];
        this.callParent(arguments);
    }
})