Ext.define('material.material_Receive',{
    // extend:'Ext.panel.Panel',
    extend:'Ext.tab.Panel',
    id:'pick_tabpanel',
    region: 'center',
    layout:'fit',
    title: '原材料领料',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

        var record_start_bottom = 0;//序号

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
        var MaterialpickListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrder.do', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'requisitionOrderList',
                }
            },
            autoLoad : true
        });

        var pickList=Ext.create('Ext.data.Store',{
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
        //             // 取出grid的字段名字段类型pro_picking_MaterialGrid
        //             console.log('===========')
        //             console.log(materialList)
        //             var select = Ext.getCmp('PickingListGrid').getStore()
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
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '单号',
                    id :'picklistNum',
                    width: 180,
                    labelWidth: 30,
                    name: 'picklistNum',
                    value:"",
                },
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
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        MaterialpickListStore.load({
                            params : {
                                proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
                            }
                        });
                    }
                }]
        });

        var receive_info = Ext.create('material.receive_info');

        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'PickingListGrid',
            store:MaterialpickListStore,
            dock: 'bottom',
            columns:[
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 45,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start_bottom　+　1　+　rowIndex;
                    }
                },
                {
                dataIndex:'requisitionOrderId',
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
                    flex :1
                },
                {
                    dataIndex:'projectName',
                    text:'所属项目',
                    flex :1
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
                    store: MaterialpickListStore,   // same store GridPanel is using
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
                    var requisitionOrderId = select.requisitionOrderId;
                    var projectId = select.projectId;

                    //var pickNumber = select.
                    // var specificMaterialList = Ext.create('Ext.data.Store',{
                    //     //id,materialName,length,width,materialType,number
                    //     fields:['materialName','length','materialType','width','specification','number'],
                    //     proxy : {
                    //         type : 'ajax',
                    //         url : 'order/queryRequisitionOrderDetail.do?requisitionOrderId='+requisitionOrderId,//获取同类型的原材料  +'&pickNum='+pickNum
                    //         reader : {
                    //             type : 'json',
                    //             rootProperty: 'requisitionOrderDetailList',
                    //         },
                    //     },
                    //     autoLoad : true
                    // });

                    //原材料领料，只查询领料单中的原材料，type=4
                    specificMaterialList.load({
                        params : {
                            requisitionOrderId:requisitionOrderId,
                            type:4,
                        }
                    });

                    //表名
                    var tableName = 'building';
                    //属性名
                    var C_projectId = 'projectId';
                    //根据选中记录的projectid，决定明细表格的楼栋信息
                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
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


                    // toolbar_specific_pickList.items.items[0].setValue(requisitionOrderId);

                    // //弹框
                    // win_picklistInfo_material_outbound.show();

                    //添加一个tabPanel
                    var tabPanel = Ext.getCmp('pick_tabpanel');
                    console.log("--------------------------->",tabPanel.activeTab);
                    var tab = tabPanel.add(
                            // grid__query_pickList_specific,
                            panel_specific
                        );
                    console.log("<--------------------------->",tabPanel);
                    console.log(panel_specific);
                    console.log(grid__query_pickList_specific)
                    console.log(specificMaterialList)
                    tabPanel.setActiveTab(tab);
                }
            }
        });

        var specificMaterialList = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:['materialName','length','materialType','width','specification','number'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrderDetail.do',//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'requisitionOrderDetailList',
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

        var toolbar_specific_pickList = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            // id : "toolbar_specific_pickList",
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    id :'picklistId',
                    width: 180,
                    labelWidth: 30,
                    name: 'picklistId',
                    value:"",
                    hidden:true
                },
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
                        specificMaterialList.load({
                            params : {
                                buildingId:buildingId,
                                buildingpositionId:buildingpositionId,
                                warehouseName:warehouseName,
                                //proejctId:'1',
                                //type和领料单Id
                                requisitionOrderId:requisitionOrderId,
                                type:4,//原材料
                            }
                        });
                    }
                }]
        });

        var grid__query_pickList_specific=Ext.create('Ext.grid.Panel',{
            // id : 'grid__query_pickList_specific',
            tbar:toolbar_specific_pickList,
            store:specificMaterialList,
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            closable:true,
            closeAction: 'hide',
            columns:[
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
                    dataIndex:'countAll',
                    text:'总数量',
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
            ],
            // height:'100%',
            flex:1,
            // selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: specificMaterialList,   // same store GridPanel is using
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
        //     // items:grid__query_pickList_specific,
        // });


        //领料的具体材料信息Panel
        var panel_specific = Ext.create('Ext.panel.Panel',{
            title: '领料单明细',
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:500,
            closable:true,
            closeAction : 'hide',
            autoDestroy: false,
            items:[grid__query_pickList_specific],
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