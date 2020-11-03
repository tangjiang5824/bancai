Ext.define('product.product_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '产品成品库存查询',
    initComponent: function(){
        var itemsPerPage = 50;

        var tableName="product_info_store_type";
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
            }
        });
        //仓库编号
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
            displayField: 'warehouseName',
            valueField: 'warehouseName',
            editable : false,
            store: storeNameList,
        });

        var productNameList = Ext.create('Ext.data.Store',{
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
        var productTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品类型',
            labelWidth : 70,
            width : 230,
            id :  'productType',
            name : 'productType',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'productTypeName',
            valueField: 'productTypeName',
            editable : false,
            store: productNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(productTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [productTypeList,

                {
                    xtype:'tbtext',
                    text:'库存数量:',
                    margin : '0 10 0 20',
                    itemId:'move_left',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'minCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'minCount',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    id :'maxCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'maxCount',
                    value:"",
                },
                storePosition,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                minCount : Ext.getCmp('minCount').getValue(),
                                maxCount : Ext.getCmp('maxCount').getValue(),

                                productType:Ext.getCmp('productType').getValue(),

                                warehouseName:Ext.getCmp('storePosition').rawValue,
                                tableName:tableName,

                            }
                        });
                    }
                },

            ]
        })

        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            //id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "oldpanel/query_data.do",
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

                        minCount : Ext.getCmp('minCount').getValue(),
                        maxCount : Ext.getCmp('maxCount').getValue(),

                        productType:Ext.getCmp('productType').getValue(),

                        warehouseName:Ext.getCmp('storePosition').rawValue,
                        tableName:tableName,

                    });
                }

            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            //id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                forceFit: false,
            emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
            deferEmptyText: false
            },
            //readOnly:true,
            columns : [

                {dataIndex : 'productName', text : '产品名称', flex :2, },
                {dataIndex : 'productTypeName', text : '产品类型', flex :1, },
                //{dataIndex : 'classificationName', text : '分类', flex :1, },
                {text: '分类', dataIndex: 'classificationId', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },

                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, },
                {dataIndex : 'count', text : '数量', flex :1, },
                //{dataIndex : 'countStore', text : '库存数量', flex :1, },
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, },
                {dataIndex : 'unitArea', text : '单面积', flex :1,},
                {dataIndex : 'unitWeight', text : '单重', flex :1,},
                {dataIndex : 'totalArea', text : '总面积', flex :1,},
                {dataIndex : 'totalWeight', text : '总重', flex :1,},
            ],

            tbar: toobar,
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