Ext.define('project.material_over_pick',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料超领',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_info_store_type";//原材料仓库表
        //var materialType="1";

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
            width : 500,
            margin : '0 0 0 10',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
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
                },
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
            }
        });
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 0 0 50',
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
            width : 200,
            margin: '0 0 0 50',
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
        //创建超领单
        var toolbar_top = Ext.create("Ext.toolbar.Toolbar", {
            // dock : "top",
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>创建超领单:</strong>',
                }
            ]
        });
        //项目名，楼栋名，位置
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                //项目名
                tableList,
                buildingName,
                buildingPositionList,
                ]
        });
        //超领原因，申请日期，申请人
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                //超龄原因
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '超领原因',
                    id :'overpick_res',
                    width: 510,
                    labelWidth: 55,
                    name: 'overpick_res',
                    value:"",
                },
                //申请日期
                // {
                //     xtype: 'datefield',
                //     margin: '0 50 0 0',
                //     fieldLabel: '申请日期',
                //     id: 'overpickTime',
                //     labelWidth : 55,
                //     width : 220,
                //     name: 'overpickTime',
                //     value: "",
                //     format : 'Y-m-d',
                //     editable : false,
                //     matchFieldWidth: true,
                //     style:"margin-top:50px;",
                // },
                //申请人
                {
                    fieldLabel : '申请人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 0 0 75',
                    width: 215,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                    allowBlank:false,
                    blankText  : "申请人姓名不能为空"
                },
            ]
        });
        //新增按钮
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增超领材料',
                margin : '0 40 0 0',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'materialName':'',
                        'materialTypeName':'',
                        'countStore':'',
                        'countUse':'',
                        'inventoryUnit':'',
                        'warehouseName' : '',
                    }];
                    //Ext.getCmp('addMaterialBasicGrid')返回定义的对象
                    Ext.getCmp('material_Query_Data_Main').getStore().loadData(data,
                        true);
                }
            }, {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '保存',
                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var projectId = Ext.getCmp('projectName').getValue();
                    var buildingId = Ext.getCmp('buildingName').getValue();
                    var positionId = Ext.getCmp('positionName').getValue();
                    var overpick_res = Ext.getCmp('overpick_res').getValue();
                    var operator = Ext.getCmp('operator').getValue();

                    var select = Ext.getCmp('material_Query_Data_Main').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        delete rec.data.id;
                        s.push(JSON.stringify(rec.data));

                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                    });
                    //alert(s);//数组s存放表格中的数据，每条数据以json格式存放

                    Ext.Ajax.request({
                        url : 'order/createOverRequisitionOrder.do', //HandleDataController
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            projectId:projectId,
                            buildingId:buildingId,
                            buildingpositionId:positionId,
                            description:overpick_res,
                            operator:operator,


                            // materialType:materialtype,
                            s : "[" + s + "]",

                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "录入成功！");
                            Ext.getCmp("addMaterialBasicGrid").getStore().removeAll();
                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "录入失败！");
                        }
                    });

                }
            }]
        });


        //查询数据库，返回原材料类型
        var MaterialStoreList = Ext.create('Ext.data.Store',{
            fields : [ 'materialName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,
                reader : {
                    type : 'json',
                    rootProperty: 'material_info_store_type',
                },
                fields : ['id','materialName']
            },
            autoLoad : true
        });

        //原材料类型，下拉框显示
        var MaterialNameList = Ext.create('Ext.form.ComboBox',{
            // fieldLabel : '原材料品名',
            // labelWidth : 70,
            width : 260,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: true,
            allowBlank:false,
            // emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'id', //显示name
            editable : true,
            store: MaterialStoreList,
            listeners:{
                select: function(combo, record, index) {
                    console.log("hellon  wwww");
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(select);
                    //确定后面的属性值
                    var inventoryUnit = select.inventoryUnit;
                    var materialTypeName = select.materialTypeName;
                    //存放位置，行列
                    var warehouseName = select.warehouseName;
                    var countStore = select.countStore;
                    var countUse = select.countUse;
                    var storeId = select.storeId;

                    var sc = Ext.getCmp('material_Query_Data_Main').getSelectionModel().getSelection();

                    sc[0].set('storeId',storeId);

                    sc[0].set('inventoryUnit',inventoryUnit);
                    sc[0].set('materialTypeName',materialTypeName);
                    sc[0].set('warehouseName',warehouseName);
                    sc[0].set('countStore',countStore);
                    sc[0].set('countUse',countUse);
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

            }
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            title: "原材料仓库信息记录",
            // store: material_Query_Data_Store,
            store:{
                fields: ['materialName','description']
            },
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {
                    dataIndex : 'materialName',
                    name : '原材料名',
                    text : '原材料名',
                    //width : 110,
                    flex :1,
                    editor:MaterialNameList,
                    renderer:function(value, cellmeta, record){
                        var index = MaterialStoreList.find(MaterialNameList.valueField,value);
                        var ehrRecord = MaterialStoreList.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('materialName');
                        }
                        return returnvalue;
                    },
                },
                {
                    dataIndex : 'storeId',
                    name : '原材料id',
                    text : '原材料id',
                    hidden:true,
                    flex :1,
                },
                {
                    dataIndex : 'materialTypeName',
                    name : '原材料类型',
                    text : '原材料类型',
                    flex :1,
                    // editor:{
                    //     xtype : 'textfield',
                    //     allowBlank : false,
                    // }
                },
                {
                    dataIndex : 'inventoryUnit',
                    text : '库存单位',
                    flex :.6,
                    editor:{
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                 },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1,
                },
                {
                    dataIndex : 'countStore',
                    name : '库存数量',
                    text : '库存数量',
                    flex :1,
                },
                {
                    dataIndex : 'countUse',
                    name : '可用数量',
                    text : '可用数量',
                    flex :1,
                },{
                    dataIndex : 'count',
                    name : '超领数量',
                    text : '超领数量',
                    flex :1,
                    editor:{
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                // store: material_Query_Data_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                // validateedit : function(editor, e) {
                //     var field=e.field
                //     var id=e.record.data.id
                //     if(id)
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
                // }
            }
        });

        // this.tbar = toobar;
        this.items = [grid];
        //设置panel多行tbar
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toobar]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toolbar1]
        },
        {
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toolbar2]
        },
        ];
        this.callParent(arguments);
    }
})