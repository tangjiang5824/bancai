Ext.define('oldpanel.query_Otype_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查看旧板类型',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel_type_view";

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
                { text: '旧版类型名称',  dataIndex: 'oldpanelTypeName' ,flex :1},
                { text: '分类',  dataIndex: 'classificationName' ,flex :1},
                { text: '描述',  dataIndex: 'description' ,flex :1},
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