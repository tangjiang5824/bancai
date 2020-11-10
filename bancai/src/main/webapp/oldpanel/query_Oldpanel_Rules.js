Ext.define('oldpanel.query_Oldpanel_Rules',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查询旧板匹配规则',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="zzyquery_oldpanel_match_rules_pair";
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
            }
        });
        var productTypeNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'productTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=producttype',
                reader : {
                    type : 'json',
                    rootProperty: 'producttype',
                }
            },
            autoLoad : true
        });
        var productTypeNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品类型',
            labelWidth : 70,
            width : 230,
            id :  'productTypeName',
            name : 'productTypeName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'productTypeName',
            valueField: 'id',
            editable : false,
            store: productTypeNameStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(productTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var oldpanelTypeNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=oldpaneltype',
                reader : {
                    type : 'json',
                    rootProperty: 'oldpaneltype',
                }
            },
            autoLoad : true
        });
        var oldpanelTypeNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelTypeName',
            name : 'oldpanelTypeName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'id',
            editable : false,
            store: oldpanelTypeNameStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var MaterialTypeNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'MaterialTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=material_type',
                reader : {
                    type : 'json',
                    rootProperty: 'material_type',
                },
                fields : ['id','typeName']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });
        var MaterialTypeNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 260,
            id :  'typeName',
            name : 'typeName',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'typeName',
            valueField: 'id', //显示name
            editable : true,
            store: MaterialTypeNameStore,
        });
        var productFormatStore = Ext.create('Ext.data.Store',{
            fields : [ 'productFormat'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=product_format',
                reader : {
                    type : 'json',
                    rootProperty: 'product_format',
                },
                fields : ['id','productFormat']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });
        var productFormatList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品格式',
            labelWidth : 70,
            width : 260,
            id :  'productFormat',
            name : 'productFormat',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'productFormat',
            valueField: 'id', //显示name
            editable : true,
            store: productFormatStore,
        });
        var oldpanelFormatStore = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelFormat'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=oldpanel_format',
                reader : {
                    type : 'json',
                    rootProperty: 'oldpanel_format',
                },
                fields : ['id','oldpanelFormat']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });
        var oldpanelFormatList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板格式',
            labelWidth : 70,
            width : 260,
            id :  'oldpanelFormat',
            name : 'oldpanelFormat',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'oldpanelFormat',
            valueField: 'id', //显示name
            editable : true,
            store: oldpanelFormatStore,
        });

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar',{
            items: [productTypeNameList,
                oldpanelTypeNameList,
                productFormatList,
                oldpanelFormatList,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                productTypeId:Ext.getCmp('productTypeName').getValue(),
                                oldpanelTypeId:Ext.getCmp('oldpanelTypeName').getValue(),
                                productFormatId:Ext.getCmp('productFormat').getValue(),
                                oldpanelFormatId:Ext.getCmp('oldpanelFormat').getValue(),
                                tableName:tableName,

                            }
                        });
                    }
                },
            ]
        })
        //单条录入和添加记录按钮
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype:'tbtext',
                    text:'<strong>规则修改:</strong>',
                    margin: '0 40 0 0',
                },
                {   xtype : 'button',
                    margin: '0 40 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加记录',
                    handler: function(){
                        // var productName = Ext.getCmp('productName').getValue();
                        // var count = Ext.getCmp('count').getValue();
                        // var warehouseName = Ext.getCmp('storePosition').rawValue;
                        var data = [{
                            'oldpanelName' : '',
                            'partNo' : '',
                            'warehouseName':'',
                            'remark' : '',
                            'count' : '',
                        }];

                        Ext.getCmp('uploadRecordsMain').getStore().loadData(data, true);
                    }
                },
                //删除行数据
                {
                    xtype : 'button',
                    margin: '0 0 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    handler: function(){
                        var sm = Ext.getCmp('uploadRecordsMain').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('uploadRecordsMain').getStore().remove(oldpanelArr);
                                } else {
                                    return;
                                }
                            });
                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }
                    }
                }

            ]
        });
        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            //id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "project/queryOldPanelMatchRules.do",
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
                        productTypeId:Ext.getCmp('productTypeName').getValue(),
                        oldpanelTypeId:Ext.getCmp('oldpanelTypeName').getValue(),
                        productFormatId:Ext.getCmp('productFormat').getValue(),
                        oldpanelFormatId:Ext.getCmp('oldpanelFormat').getValue(),
                        tableName:tableName,

                    });
                }

            }

        });
        //弹出表格，楼栋信息表
        var building_grid_query=Ext.create('Ext.grid.Panel',{
            id : 'building_grid_query',
            // store:store1,//specificMaterialList，store1的数据固定
            dock: 'bottom',
            // bbar:toolbar4,
            columns:[
                {
                    text: '楼栋编号',
                    dataIndex: 'buildingNo',
                    flex :1
                },{
                    dataIndex : 'buildingName',
                    text : '楼栋名',
                    flex :1
                },{
                    dataIndex : 'buildingLeaderName',
                    text : '楼栋负责人',
                    flex :1
                }
            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],

        });

        //弹出窗口
        var win_showbuildingData_query = Ext.create('Ext.window.Window', {
            // id:'win_showbuildingData_query',
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            // tbar:toolbar5,
            items:building_grid_query,
            closeAction : 'hidden',
            modal:true,//模态窗口，背景窗口不可编辑
        });
        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                ptype : "gridviewdragdrop",
                dragText : "可用鼠标拖拽进行上下排序"
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            //readOnly:true,
            columns : [
                {dataIndex : 'productTypeName', text : '产品类型', flex :1,editor : {xtype : 'textfield', allowBlank : false,} ,
                    // renderer:function(value, cellmeta, record){
                    //     var index = productTypeNameStore.find(productTypeNameList.valueField,value);
                    //     var ehrRecord = productTypeNameStore.getAt(index);
                    //     var returnvalue = "";
                    //     if (ehrRecord) {
                    //         returnvalue = ehrRecord.get('productTypeName');
                    //     }
                    //     return returnvalue;
                    // },
                    // render:{},
                },
                //{text: '分类', dataIndex: 'classificationName', flex :1,  editor : {xtype : 'textfield', allowBlank : false,}  },
                {dataIndex : 'productFormat', text : '产品格式', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'oldpanelTypeName', text : '旧板类型', flex :1,editor : {xtype : 'textfield', allowBlank : false,} ,
                    // renderer:function(value, cellmeta, record){
                    //     var index = oldpanelTypeNameStore.find(oldpanelTypeNameList.valueField,value);
                    //     var ehrRecord = oldpanelTypeNameStore.getAt(index);
                    //     var returnvalue = "";
                    //     if (ehrRecord) {
                    //         returnvalue = ehrRecord.get('oldpanelTypeName');
                    //     }
                    //     return returnvalue;
                    // },
                    // render:{},
                },
                {dataIndex : 'oldpanelFormat', text : '旧板格式', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'priority', text : '优先级', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'isCompleteMatch', text : '是否完全匹配', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'isValid', text : '是否启用', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {
                //     // name : '操作',
                //     text : '查看约束',
                //     flex :1 ,
                //     renderer:function(value, cellmeta){
                //         return "<INPUT type='button' value='查看约束' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                //     }
                // },
                {dataIndex : 'pDescription', text : '产品约束条件', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'oDescription', text : '旧板约束条件', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

            ],

            //tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            },{
                xtype : 'toolbar',
                //dock : 'top',
                items : [toolbar1]
            },

                {
                    xtype : 'toolbar',
                    //dock : 'top',
                    items : [toolbar2]
                },
            ],


            //  //点击表项修改
            // listeners: {
            //
            //     validateedit: function(editor, e){//监听点击表格
            //
            //         //获得当前行的id
            //         var cellId = e.record.id;
            //         var cellField = e.field;
            //         var cellValue = e.value//当前值
            //
            //         Ext.Ajax.request({
            //             url : 'data/EditCellById.do',
            //             method:'POST',
            //             //submitEmptyText : false,
            //             params : {
            //                 tableName:tableName,
            //                 id:cellId,
            //                 field:cellField,
            //                 value:cellValue
            //             },
            //             success : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改成功！");
            //                 // uploadRecordsStore.load({
            //                 //
            //                 // });
            //                 // me.close();
            //
            //             },
            //             failure : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改失败！");
            //             }
            //         });
            //     },
            // },
            // //对表的行双击，响应的事件
            //
            // listeners: {
            // 	itemdblclick: function(me, item, index){
            // 		//var select = record.data;
            // 		//var id =select.id;
            // 		//var tableName=select.tableName;
            // 		var url='showData.jsp?taxTableName='
            // 			+ tableName
            // 			+ "&taxTableId=" + id;
            // 		url=encodeURI(url)
            // 		window.open(url,
            // 			'_blank');
            // 	}
            // }
        });

        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            console.log(e)
            console.log("zzy e.data:"+e.data.rulesRangeId)
            console.log("zzy e.data.id:"+e.data.id)
            //console.log("zzy columnIndex"+columnIndex)
            if (columnIndex == 7) {
                //var select = record.data
                //项目id
                var rulesRangeId = e.data.rulesRangeId;//项目名对应的id
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
                building_grid_query.setStore(buildinglList_projectId);
                win_showbuildingData_query.show();
            }
        }


        this.items = [grid];
        this.callParent(arguments);
    }
})