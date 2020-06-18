Ext.define('material.query_Mcatergory_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查看原材料类型',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="materialtype";

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
                    rootProperty: 'materialtype',
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
                        //materialCatergory:Ext.getCmp('materialCatergory').getValue(),
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
                { text: '原材料类型',  dataIndex: 'materialTypeName' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
                { text: '描述',  dataIndex: 'description' ,flex :1, editor : {xtype : 'textfield', allowBlank : false}}
                ],

            //tbar: toobar,
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

            listeners: {

                validateedit: function(editor, e){//监听点击表格

                    //获得当前行的id
                    var cellId = e.record.id;
                    var cellField = e.field;
                    var cellValue = e.value//当前值

                    Ext.Ajax.request({
                        url : 'data/EditCellById.do',
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            id:cellId,
                            field:cellField,
                            value:cellValue
                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "修改成功！");
                            // uploadRecordsStore.load({
                            //
                            // });
                            // me.close();

                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "修改失败！");
                        }
                    });
                },
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})