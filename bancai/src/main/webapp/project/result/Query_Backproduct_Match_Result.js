Ext.define('project.result.Query_Backproduct_Match_Result',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '退库成品匹配结果查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel_info_store_type";
        //仓库编号
        var tableListStore1 = Ext.create('Ext.data.Store',{
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


        var tableList1 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,//'35%'
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: tableListStore1,
            listeners: {

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

        // var tableListStore2 = Ext.create('Ext.data.Store',{
        // 	fields : [ 'buildingName'],
        // 	proxy : {
        // 		type : 'ajax',
        // 		url : 'project/findBuildingList.do',
        // 		params : {
        // 			projectName:Ext.getCmp('projectName').getValue(),
        // 			//buildingName:Ext.getCmp('buildingName').getValue(),
        // 		},
        // 		reader : {
        // 			type : 'json',
        // 			rootProperty: 'buildingList',
        // 		}
        // 	},
        // 	autoLoad : true
        // });

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
            width : 200,
            margin: '0 10 0 20',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehousename',
            valueField: 'warehousename',
            editable : false,
            store: storeNameList,
        });

        var oldPanelNameList = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelName'],
            proxy : {
                type : 'ajax',
                url : 'oldpanel/oldpanelType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typeList',
                }
            },
            autoLoad : true
        });
        var oldpanelTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType',
            name : 'oldpanelType',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar1",
            items : [   tableList1,
                buildingName,
                buildingPositionList,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                projectId : Ext.getCmp("projectName").getValue(),
                                buildingId : Ext.getCmp("buildingName").getValue(),
                                positionId : Ext.getCmp("positionName").getValue(),
                                tableName:tableName,
                            }
                        });
                    }
                },

            ]//exceluploadform
        });
        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "project/queryBackproductMatchResult.do",
                type: 'ajax',
                method:'POST',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    projectId : Ext.getCmp("projectName").getValue(),
                    buildingId : Ext.getCmp("buildingName").getValue(),
                    positionId : Ext.getCmp("positionName").getValue(),
                    tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        // startWidth : Ext.getCmp('startWidth').getValue(),
                        // endWidth : Ext.getCmp('endWidth').getValue(),
                        // startLength:Ext.getCmp('startLength').getValue(),
                        // endLength:Ext.getCmp('endLength').getValue(),
                        // mType:Ext.getCmp('mType').getValue(),
                        projectId : Ext.getCmp("projectName").getValue(),
                        buildingId : Ext.getCmp("buildingName").getValue(),
                        positionId : Ext.getCmp("positionName").getValue(),
                        tableName:tableName,

                    });
                }

            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true
            },
            //readOnly:true,
            columns : [
                {dataIndex : 'desiginlistName', text : '设计清单中名称', flex :1, },
                {dataIndex : 'backproductName', text : '对应退库旧板名称', flex :1, },

            ],

            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],

        });
        this.dockedItems=[

            {
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toolbar1]
        },
        ];

        this.items = [grid];
        this.callParent(arguments);
    }
})