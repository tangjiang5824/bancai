Ext.define('material.query_Newpanel_Rules',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查询新板匹配规则',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material_matchrules_view";
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

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar',{
            items: [productTypeNameList,
                MaterialTypeNameList,
                productFormatList,
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
                                materialTypeId:Ext.getCmp('typeName').getValue(),
                                productFormatId:Ext.getCmp('productFormat').getValue(),
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
                url : "project/queryNewPanelMatchRules.do",
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
                        materialTypeId:Ext.getCmp('typeName').getValue(),
                        productFormatId:Ext.getCmp('productFormat').getValue(),
                        tableName:tableName,

                    });
                }

            }

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
                    renderer:function(value, cellmeta, record){
                        var index = productTypeNameStore.find(productTypeNameList.valueField,value);
                        var ehrRecord = productTypeNameStore.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('productTypeName');
                        }
                        return returnvalue;
                    },
                    render:{}
                    },
                //{dataIndex : 'classificationName', text : '分类', flex :1, },
                {text: '分类', dataIndex: 'classificationName', flex :1,  editor : {xtype : 'textfield', allowBlank : false,}  },
                {dataIndex : 'productFormat', text : '产品格式', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'typeName', text : '匹配原材料类型', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'nValue', text : 'n值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'mValue', text : 'm值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'aValue', text : 'a值', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'bValue', text : 'b值', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'pValue', text : 'p值', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'upWidth', text : '标准值', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'countValue', text : '数量', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'orientation', text : '方向', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'condition1', text : '条件1', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'condition2', text : '条件2', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'suffix', text : '后缀', flex :1,editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'length', text : '长', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'width', text : '宽', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
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

        this.items = [grid];
        this.callParent(arguments);
    }
})