Ext.define('project.project_query_backlist',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目退料单查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

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

        //查询退料单
        var backListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'backStore/queryReturnOrder.do', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                }
            },
            autoLoad : true
        });

        var pickList=Ext.create('Ext.data.Store',{
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
                backType,
                tableList,
                buildingName,
                ]
        });
        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [
                // tableList,
                // buildingName,
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
                                type:Ext.getCmp('backType').getValue(),//必须
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


        var allBackListGrid=Ext.create('Ext.grid.Panel',{
            id : 'allBackListGrid',
            store:backListStore,
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
            // height:'100%',
            // tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                xtype: 'pagingtoolbar',
                store: backListStore,   // same store GridPanel is using
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
                    var requisitionOrderId = select.returnOrderId;

                    specific_backList.load({
                        params : {
                            returnOrderId:requisitionOrderId,
                            //projectId:'1',
                        }
                    });

                    // grid__query_pickList_specific.setStore(specificMaterialList);
                    // grid__query_pickList_specific.getDockedItems().setStore(specificMaterialList)
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

        //具体的退料单
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
            autoLoad : false
        });

        var grid__query_pickList_specific=Ext.create('Ext.grid.Panel',{
            title:'退料单明细',
            id : 'grid__query_pickList_specific',
            // tbar:toolbar_specific,
            store:specific_backList,
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            columns:[
                //序号
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
                // {
                //     dataIndex:'type',
                //     text:'类型',
                //     flex :1,
                //     renderer: function (value) {
                //         return product.model.originType[value].name; // key-value
                //     },
                // },
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
                {
                    dataIndex:'totalArea',
                    text:'总面积',
                    flex :1,
                },
                {
                    dataIndex:'totalWeight',
                    text:'总重',
                    flex :1,
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
                    store: specific_backList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });


        //领料的具体材料信息 panel
        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            height:'100%',

            items:[allBackListGrid,
                grid__query_pickList_specific
            ],
        });

        this.dockedItems=[{
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
        ];
        this.items = [panel];
        this.callParent(arguments);
    }
})