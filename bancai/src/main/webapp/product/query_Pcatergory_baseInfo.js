Ext.define('product.query_Pcatergory_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查询产品基础信息',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="producttype";

        //
        var typeListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=producttype',//类型
                reader : {
                    type : 'json',
                    rootProperty: 'producttype',
                },
            },
            autoLoad : true
        });

        var classListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=product_classification',//类型
                reader : {
                    type : 'json',
                    rootProperty: 'product_classification',
                },
            },
            autoLoad : true
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [
                {
                    fieldLabel : '类型',
                    xtype : 'combo',
                    name : 'productType',
                    id : 'productType',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : typeListStore,
                    displayField : 'productTypeName',
                    valueField : 'id',
                    editable : true,
                },
                //单号
                {
                    fieldLabel : '位置',
                    xtype : 'combo',
                    name : 'classification',
                    id : 'classification',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : classListStore,
                    displayField : 'classificationName',
                    valueField : 'classificationId',
                    editable : true,
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        productInfo_Store.load({
                            params : {
                                typeId:Ext.getCmp('productType').rawValue,//必须
                                classificationId:Ext.getCmp('classification').rawValue,
                                tableName:'product',
                            }
                        });
                    }
                }]
        });

        //自动将读取到的数据返回到页面中
        var productInfo_Store = Ext.create('Ext.data.Store',{
            id: 'productInfo_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "oldpanel/queryInfo.do",
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
                    tableName:'product',
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        //productCatergory:Ext.getCmp('productCatergory').getValue(),
                        tableName:'product',
                    });
                }
            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            height:400,
            width:600,
            store: productInfo_Store,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                { text: '品名',  dataIndex: 'productName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '品名',  dataIndex: 'classificationName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},

                { text: '类型',  dataIndex: 'productTypeName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '描述',  dataIndex: 'description' ,flex :1, editor : {xtype : 'textfield', allowBlank : false}}
            ],

            //tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: productInfo_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],

        });
        this.tbar = toolbar;

        this.items = [grid];
        this.callParent(arguments);
    }
})