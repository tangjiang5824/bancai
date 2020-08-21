Ext.define('product.query_Ptype_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查询产品类型',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="producttype";


        //自动将读取到的数据返回到页面中
        var productType_Store = Ext.create('Ext.data.Store',{
            id: 'productType_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "material/findAllBytableName.do",
                type: 'ajax',
                method:'POST',
                reader:{
                    type : 'json',
                    rootProperty: 'producttype',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        //productCatergory:Ext.getCmp('productCatergory').getValue(),
                        tableName:tableName,
                    });
                }
            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            height:400,
            width:600,
            store: productType_Store,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                { text: '类型',  dataIndex: 'productTypeName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '描述',  dataIndex: 'description' ,flex :1, editor : {xtype : 'textfield', allowBlank : false}}
            ],

            //tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: productType_Store,   // same store GridPanel is using
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