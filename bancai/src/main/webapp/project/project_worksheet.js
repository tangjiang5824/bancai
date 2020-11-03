Ext.define('project.project_worksheet',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目工单',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName_workorder="work_order_view";
        var tableName_pro_specific = '';//某类产品的具体匹配信息
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

        var projectListStore = Ext.create('Ext.data.Store',{
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


        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,//'35%'
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
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

        //原件类型：枚举类型
        Ext.define('product.model.originType', {
            statics: { // 关键s
                0: { value: '0', name: '未匹配' },
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料新板' },
                9: { value: '5', name: '未匹配成功' },
            }
        });


        //查询的数据存放位置 左侧界面
        var productListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            pageSize: itemsPerPage,
            // autoLoad : true,
            proxy : {
                type : 'ajax',
                // url : 'material/findAllBytableName.do?tableName='+tableName_workorder,
                url:'order/queryWorkOrder.do',
                params:{
                    start: 0,
                    limit: itemsPerPage
                },
                reader : {
                    type : 'json',
                    rootProperty: 'workOrderList',
                },
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        projectId:Ext.getCmp("projectName").getValue(),
                        buildingId:Ext.getCmp("buildingName").getValue(),
                        buildingpositionId:Ext.getCmp("positionName")
                    });
                }

            }
        });

        var pre_worksheetStore=Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount'],
        });

        //确认入库按钮，
        // var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
        //     dock : "bottom",
        //     id : "toolbar3",
        //     //style:{float:'center',},
        //     //margin-right: '2px',
        //     //padding: '0 0 0 750',
        //     style:{
        //         //marginLeft: '900px'
        //         layout: 'right'
        //     },
        //     items : [{
        //         xtype : 'button',
        //         iconAlign : 'center',
        //         iconCls : 'rukuicon ',
        //         text : '确认领料',
        //         region:'center',
        //         bodyStyle: 'background:#fff;',
        //         handler : function() {
        //
        //             // 取出grid的字段名字段类型pickingMaterialGrid
        //             console.log('===========')
        //             console.log(materialList)
        //             var select = Ext.getCmp('productPickingListGrid').getStore()
        //                 .getData();
        //             var s = new Array();
        //             select.each(function(rec) {
        //                 s.push(JSON.stringify(rec.data));
        //             });
        //             //获取数据
        //             Ext.Ajax.request({
        //                 url : 'material/updateprojectmateriallist.do', //原材料入库
        //                 method:'POST',
        //                 //submitEmptyText : false,
        //                 params : {
        //                     s : "[" + s + "]",//存储选择领料的数量
        //                     materialList : "[" + materialList + "]",
        //                 },
        //                 success : function(response) {
        //                     //var message =Ext.decode(response.responseText).showmessage;
        //                     Ext.MessageBox.alert("提示","领取成功" );
        //                     //刷新页面
        //                     MaterialList.reload();
        //
        //                 },
        //                 failure : function(response) {
        //                     //var message =Ext.decode(response.responseText).showmessage;
        //                     Ext.MessageBox.alert("提示","领取失败" );
        //                 }
        //             });
        //
        //         }
        //     }]
        // });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [projectList,
                buildingName,
                buildingPositionList,
                {
                    xtype : 'button',
                    text: '项目产品查询',
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
                        productListStore.load({
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
                                buildingpositionId:Ext.getCmp("positionName").getValue(),
                                }
                        });
                    }
                }]
        });

        //表格分组，字段名
        var myModel = Ext.define("filedInfo", {
            extend : "Ext.data.Model",
            fields : [ {
                name : "name",
                type : "string"
            },{
                name : "count",
                type : "number"
            }, {
                name : "totalNumber",
                type : "number"
            }, {
                name : "index",
                type : "number"
            }
            ]
        });


        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'productPickingListGrid',
            store:productListStore,
            dock: 'bottom',
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>无数据</div>",
                deferEmptyText: false
            },
            columns:[
                {
                    dataIndex:'productName',
                    text:'产品名',
                    flex :1
                },
                { text: '主件类型', dataIndex: 'madeBy', flex :1.2,
                    renderer: function (value) {
                        return product.model.originType[value].name; // key-value
                    },
                },
                {
                    dataIndex:'count',
                    text:'数量',
                    flex :1
                },
                {
                    dataIndex:'projectName',
                    text:'项目',
                    flex :1
                },
                {
                    dataIndex:'buildingName',
                    text:'楼栋',
                    flex :1
                },
                {
                    dataIndex:'positionName',
                    text:'位置',
                    flex :1
                },
            ],
            flex:1.3,
            // height:'100%',
            // tbar: toolbar,
            selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                xtype: 'pagingtoolbar',
                store: productListStore,   // same store GridPanel is using
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
                    var projectId = select.projectId;
                    var buildingId = select.buildingId;
                    var buildingpositionId = select.buildingpositionId;
                    var productMadeBy = select.madeBy;
                    var productId = select.productId;

                    var productName = select.productName;
                    var pro_count = select.count;
                    console.log("选择---记录",select)

                    //查询某类产品具体的匹配信息，右侧界面
                    var product_specificListStore = Ext.create('Ext.data.Store',{
                        fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
                        proxy : {
                            type : 'ajax',
                            url : 'project/workOrderDetialList.do?projectId='+projectId+'&buildingId='+buildingId+'&buildingpositionId='+buildingpositionId+'&productMadeBy='+productMadeBy+'&productId='+productId,
                            reader : {
                                type : 'json',
                                rootProperty: 'value',
                            }
                        },
                        autoLoad : true,
                        model : "filedInfo",
                        groupField : 'index',
                    });

                    Ext.getCmp("toolbar_specific").items.items[0].setValue(productName);//修改id为win_num的值，动态显示在窗口中
                    Ext.getCmp("toolbar_specific").items.items[1].setValue(productMadeBy);
                    Ext.getCmp("toolbar_specific").items.items[2].setValue(pro_count);
                    grid_pro_specific.setStore(product_specificListStore);
                }
            }

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

        var toobar_right = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 30 0 0',
                //     fieldLabel: '项目信息',
                //     id :'projectInfo',
                //     width: 200,
                //     labelWidth: 60,
                //     name: 'projectInfo',
                //     value:"",
                //     // border:'0 0 1 0',
                //     fieldStyle:'background:none; border-right: #000000 0px solid;border-top:0px solid;border-left:0px solid;border-bottom:#000000 1px solid;'
                // },
                // {
                //     xtype: 'textfield',
                //     margin : '0 30 0 0',
                //     fieldLabel: '工单号',
                //     id :'workSheet_Num',
                //     width: 200,
                //     labelWidth: 50,
                //     name: 'workSheet_Num',
                //     value:"",
                //     fieldStyle:'background:none; border-right: #000000 0px solid;border-top:0px solid;border-left:0px solid;border-bottom:#000000 1px solid;'
                // },
                {
                    fieldLabel : '操作人',
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
                    xtype: 'datefield',
                    margin : '0 10 0 0',
                    fieldLabel: '创建时间',
                    id :'createTime',
                    width: 200,
                    labelWidth: 60,
                    name: 'createTime',
                    value:"",
                    format : 'Y-m-d',
                    editable : false,
                    // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    margin : '0 0 0 30',
                    text : '创建工单',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型pickingMaterialGrid
                        console.log('1===========')
                        var select = Ext.getCmp('pickingMaterialGrid').getStore()
                            .getData();

                        console.log('-------->',select)
                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        console.log(s)
                        //获取数据
                        Ext.Ajax.request({
                            url : 'order/createworkorder.do', //创建工单
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                // workSheet_Num:Ext.getCmp('workSheet_Num').getValue(),
                                // createTime:Ext.getCmp('createTime').getValue(),
                                operator:Ext.getCmp("operator").value,
                                s : "[" + s + "]",//存储选择领料的数量
                                projectId:Ext.getCmp("projectName").getValue(),
                                // buildingId:Ext.getCmp("buildingName").getValue(),
                                // buildingpositionId:Ext.getCmp("positionName").getValue(),
                                // materialList : "[" + materialList + "]",
                            },
                            success : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","创建成功" );

                                //刷新页面
                                pre_worksheetStore.load();
                                // Ext.getCmp('productPickingListGrid').getStore().load();
                                var projectId = Ext.getCmp('projectName').getValue();
                                //显示已创建的工单
                                //查询某类产品具体的匹配信息，右侧界面
                                var worksheet_specificListStore = Ext.create('Ext.data.Store',{
                                    fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
                                    proxy : {
                                        type : 'ajax',
                                        url : 'order/workApprovalview.do?projectId='+projectId+'&isActive=',
                                        reader : {
                                            type : 'json',
                                            rootProperty: 'value',
                                        }
                                    },
                                    autoLoad : true,
                                });
                                grid_worksheet_specific.setStore(worksheet_specificListStore);
                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","创建失败" );
                            }
                        });

                    // 重新加载页面，该项目的领料单信息
                    //     productListStore.load({
                    //         params : {
                    //             projectId:Ext.getCmp('projectName').getValue(),
                    //             //projectId:'1',
                    //         }
                    //     });

                    //  右边页面重置
                    //     Ext.getCmp('workSheet_Num').setValue("");
                        pre_worksheetStore.removeAll();
                    }
                }

                ]
        });

        var grid2=Ext.create('Ext.grid.Panel',{
            // title: '创建工单',
            id : 'pickingMaterialGrid',
            store:pre_worksheetStore,
            dock: 'bottom',
            region:'center',
            height:'50%',
            columns:[
                {
                    dataIndex:'productName',
                    text:'产品名',
                    flex :1
                },
                { text: '主件类型', dataIndex: 'madeBy', flex :1.2,
                    renderer: function (value) {
                        return product.model.originType[value].name; // key-value
                    },
                },
                {
                    dataIndex:'count',
                    text:'数量',
                    flex :1
                },
            ],
            // height:'100%',
            flex:1.3,
            tbar:toobar_right,
            selType:'checkboxmodel',
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: pre_worksheetStore,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }]
        });

        // //查询某类产品具体的匹配信息，右侧界面
        // var product_specificListStore = Ext.create('Ext.data.Store',{
        //     fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'project/workOrderDetialList.do',
        //         params:{
        //
        //         },
        //         reader : {
        //             type : 'json',
        //             rootProperty: tableName_pro_specific,
        //         }
        //     },
        //     autoLoad : true
        // });

        var toolbar_specific = Ext.create('Ext.toolbar.Toolbar',{
            id:'toolbar_specific',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '产品',
                    id :'product_name',
                    width: 200,
                    labelWidth: 35,
                    name: 'product_name',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                }, {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '材料类型',
                    id :'madeBy_specific',
                    width: 200,
                    labelWidth: 60,
                    name: 'madeBy_specific',
                    value:"",
                    editable : false,
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '产品数量',
                    id :'pro_count',
                    width: 200,
                    labelWidth: 60,
                    name: 'pro_count',
                    value:"",
                    editable : false,
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                },
            ]
        })

        var grid_pro_specific=Ext.create('Ext.grid.Panel',{
            id : 'grid_pro_specific',
            tbar:toolbar_specific,
            // store:product_specificListStore,
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'name',
                    text:'材料名',
                    flex :1
                },

                {
                    dataIndex:'count',
                    text:'数量',
                    flex :1
                },
                // { text: '总数', dataIndex: 'totalNumber', flex :1.2,
                //     // renderer: function (value) {
                //     //     return product.model.originType[value].name; // key-value
                //     // },
                // },
                {
                    //分组依据
                    dataIndex:'index',
                    text:'index',
                    flex :1,
                    hidden:true
                },
            ],
            // height:'100%',
            flex:1,
            // selType:'checkboxmodel' ,//每行的复选框
            features : [ {//定义表格特征
                ftype : "groupingsummary",
                hideGroupedHeader : true,//隐藏当前分组的表头
                groupHeaderTpl:'这类产品有(<b><font color=red>{[values.rows[0].data.totalNumber]}</font></b>)个',
            } ],
        });

        var panel_show = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:360,
            items:[grid1,
                grid_pro_specific
            ],
        });

        var toolbar_worksheet_specific = Ext.create('Ext.toolbar.Toolbar',{
            id:'toolbar_worksheet_specific',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '项目名',
                    id :'project_name',
                    width: 250,
                    labelWidth: 50,
                    name: 'project_name',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                    // border:'0 0 1 0',
                }
            ]
        });

        var toolbar_worksheet_specific = Ext.create('Ext.toolbar.Toolbar',{
            id:'toolbar_worksheet_specific',
            items: [
                {
                    xtype: 'tbtext',
                    margin : '0 10 0 0',
                    text: '已创建的工单',

                    // border:'0 0 1 0',
                }
            ]
        });

        //工单部分order/workApprovalview
        var grid_worksheet_specific=Ext.create('Ext.grid.Panel',{
            id : 'grid_worksheet_specific',
            tbar:toolbar_worksheet_specific,
            store:'',
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
                    dataIndex:'time',
                    text:'创建时间',
                    flex :1
                },
                {
                    dataIndex:'isActive',
                    text:'是否审核',
                    flex :1,
                    renderer: function (value) {
                        return Worksheet.check.State[value].name; // key-value
                    },
                },
            ],
            // height:'100%',
            flex:1,
            // selType:'checkboxmodel' ,//每行的复选框
            features : [ {//定义表格特征
                ftype : "groupingsummary",
                hideGroupedHeader : true,//隐藏当前分组的表头
                groupHeaderTpl:'这类产品有(<b><font color=red>{[values.rows[0].data.totalNumber]}</font></b>)个',
            } ],
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: pre_worksheetStore,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }]
        });

        //工单panel
        var panel_show2 = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            title: '创建工单',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            region:'center',
            width:'100%',
            height:360,
            // height:'50%',
            autoScroll: true,
            items:[grid2,
                grid_worksheet_specific
            ],
        });


        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            // layout:{
            //     type:'vbox',
            //     align:'stretch',
            //
            // },
            width:'100%',
            height:'100%',
            // autoHeight: true,
            autoScroll:true,
            // bodyStyle:'overflow-x:hidden;overflow-y:auto;',
            items:[
                // grid1,
                panel_show,
                {
                xtype:'container',
                // flex:0.3,
                items:[{
                    xtype:'button',
                    // margin: '0 0 0 30',
                    text:'选择',
                    itemId:'move_right',
                    handler:function() {
                        var records = grid1.getSelectionModel().getSelection();
                        console.log(records)
                        console.log("测试")
                        console.log(records[0])

                        for (i = 0; i < records.length; i++) {
                            console.log(records[i].data['countTemp'])
                            if(records[i].data['countTemp'] != 0){
                                console.log("添加")
                                pre_worksheetStore.add(records[i]);
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
                        pre_worksheetStore.remove(records);
                        productListStore.add(records);
                    }
                }]
            },
                // grid2
                panel_show2
            ],
        });



        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            //store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },

        });


        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('productPickingListGrid').columns[columnIndex-1].text;

            console.log("列名：",fieldName)
            if (fieldName == "生成工单") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('productPickingListGrid').getSelectionModel();
                var materialArr = sm.getSelection();
                if (materialArr.length != 0) {
                    // Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认删除？", function (btn) {
                    //     if (btn == 'yes') {
                    //         //先删除后台再删除前台
                    //         //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                    //
                    //     } else {
                    //         return;
                    //     }
                    // });
                } else {
                    //Ext.Msg.confirm("提示", "无选中数据");
                    Ext.Msg.alert("提示", "无选中数据");
                }
            }
            console.log("rowIndex:",rowIndex)
            console.log("columnIndex:",columnIndex)
        }

        this.dockedItems = [toolbar,panel];
        // this.dockedItems = [toolbar,panel,toolbar3];
        // this.items = [grid1];
        this.callParent(arguments);
    }
})

