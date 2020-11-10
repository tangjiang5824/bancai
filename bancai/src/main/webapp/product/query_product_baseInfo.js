Ext.define('product.query_product_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查看旧板基础信息',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="product_info_view";

        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
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
                    rootProperty: tableName,
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
                        //oldpanelCatergory:Ext.getCmp('oldpanelCatergory').getValue(),
                        tableName:tableName,
                    });
                }
            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            height:400,
            width:600,
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                //序号
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 45,
                    align: 'center',
                    sortable: false
                },
                { text: '产品品名',  dataIndex: 'productName' ,flex :1},
                { text: '库存单位',  dataIndex: 'inventoryUnit' ,flex :1},
                { text: '单面积',  dataIndex: 'unitArea' ,flex :1},
                { text: '单重',  dataIndex: 'unitWeight' ,flex :1},
                { text: '产品类型名称',  dataIndex: 'productTypeName' ,flex :1},
                { text: '分类',  dataIndex: 'classificationName' ,flex :1},
                { text: '描述',  dataIndex: 'remark' ,flex :1},

            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],

            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})