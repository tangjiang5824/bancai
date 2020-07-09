Ext.define('material.add_material_rules', {
    extend : 'Ext.panel.Panel',
    // region : 'center',
    // layout : "fit",
    layout:"border",
    title : '新增新板匹配规则',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("data.UploadDataTest");
        p.add(cmp);
    },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        var tableName="material";

        //保存类型名的数组
        var product_typeArr = [];
        //var materialtype="1";

        //出库or入库选择
        var optionTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"类型名"},
                {"abbr":"1", "name":"m"},
                {"abbr":"2", "name":"n"},
                {"abbr":"3", "name":"axb"},
                {"abbr":"4", "name":"bxa"},
                {"abbr":"5", "name":"m+n"},
                {"abbr":"6", "name":"后缀"},
                //...
            ]
        });

        var ProductTypeStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'match/findProductTypeList.do',

                reader : {
                    type : 'json',
                    rootProperty: 'productTypeList',
                }
            },
            autoLoad : true
        });
        //
        var product_type = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '产品类型',
            name: 'product_type',
            id: 'product_type',
            store: ProductTypeStore,
            queryMode: 'local',
            displayField: 'productTypeName',
            valueField: 'id',
            margin : '0 20 0 40',
            width: 200,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {

                    //将产品查询store放到数组中
                    var records = ProductTypeStore.data.items;
                    var records_len = records.length;
                    //循环
                    for(var i=0;i<records_len;i++){
                        var rec = records[i];
                        var typename = rec.data.productTypeName;
                        product_typeArr.push(typename)
                    }


                    //选中后
                    var select = record[0].data;
                    var id = select.id;//type对应的id
                    console.log(id)

                    // var type = component1.value; //id值
                    // var typeName = component1.rawValue; //id值
                    //    store中的数据添加类型
                    // data = [{
                    //     '格式名称' : typeName,
                    // }];

                    //表名
                    // var tableName = 'building';
                    //属性名
                    var projectId = 'productTypeId';
                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'match/findProductFormatList.do?productTypeId='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            //     productTypeId:id,
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'productFormatList',
                            }
                        },
                        autoLoad : true,
                        // listeners:{
                        //     load:function () {
                        //         Ext.getCmp('buildingName').setValue("");
                        //     }
                        // }
                    });

                    //product_format,下拉框重新加载数据
                    product_format.setStore(tableListStore2);

                    //grid store重载
                    Ext.getCmp('product_addDataGrid').getStore().removeAll();

                    // Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                    //     true);

                }
            }
        });
        var product_format = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '格式',
            name: 'product_format',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'productFormat',
            valueField: 'id',
            margin : '0 20 0 40',
            width: 200,
            labelWidth: 35,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {

                    //grid store重载
                    Ext.getCmp('product_addDataGrid').getStore().removeAll();

                    // var type = product_format.value; //id值
                    var productFormat = record[0].data.productFormat;
                    //按空格切分
                    var arr = productFormat.split(' ');
                    console.log("arr================>",arr[0])

                    // var typeName = product_format.rawValue; //id值
                    //    store中的数据添加类型
                    data = [
                        // {
                        // '格式名称' : arr[0],
                        // },
                    ];
                    //循环
                    Ext.each(arr,function (typeName,index,self) {
                        // console.log("typeName................",typeName);
                        data.push({'format_each_name' : typeName})
                    }),

                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);
                }
            }
        });


        //产品的toolbar
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype: 'tbtext',
                    margin: '0 0 0 0',
                    text:'<strong>产品品名格式选择：</strong>'
                },
                product_type,

                product_format,
                // component3,
                // component4,
            ]
        });



        // 产品右侧
        var condition_form_ab = new Ext.form.Panel({
            // title: '添加约束条件',
            // margin:'10 10 10 10',
            id: 'condition_form_ab',
            // autoHeight: true,
            // autoWidth: true,
            // layout: 'form',
            // border: true,
            width:'95%',
            bodyStyle: 'text-align:center;padding:20px 10px 0px 5px',
            buttonAlign:'left',
            defaults: {
                // border:false,
                labelWidth:70,
                labelAlign:'right',
                width:'95%'
            },
            // height:700,
            baseCls : 'my-panel-no-border',  //去掉边框
            //居中
            layout: {
                align: 'left',
                pack: 'center',
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '产品原材料',
                    layout: 'form',
                    defaults: {anchor: '95%'},
                    style: 'margin-left: 5px;padding-left: 5px;',
                    width:700,
                    bodyStyle:'text-align:center;margin-top:5px;',
                    // 第一列中的表项
                    // style:"margin-top:50px;",
                    fieldDefaults:{
                        labelAlign:'right',
                        labelWidth:80,
                    },
                    items:[
                        {
                            layout: {
                                align: 'left',
                                // pack: 'center',
                                type: 'hbox'
                            },
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                            },
                            baseCls : 'my-panel-no-border',  //去掉边框
                            items:[
                                {
                                    flex:1,
                                    defaults: {
                                        border:false,
                                        labelWidth:70,
                                        labelAlign:'right',
                                        width:'95%'
                                    },
                                    layout:{
                                        align: 'left',
                                        // pack: 'center',
                                        type: 'vbox'
                                    },
                                    items:[
                                        product_type,
                                    ]
                                },
                                {
                                    flex:1,
                                    defaults: {
                                        border:false,
                                        labelWidth:70,
                                        labelAlign:'right',
                                        width:'95%'
                                    },
                                    layout:{
                                        align: 'left',
                                        // pack: 'center',
                                        type: 'vbox'
                                    },
                                    items:[
                                        product_format,
                                    ]
                                },
                            ]
                        },
                    ]},

                {
                    xtype: 'fieldset',
                    title: '约束条件',
                    layout: 'form',
                    defaults: {anchor: '95%'},
                    style: 'margin-left: 5px;padding-left: 5px;',
                    width:700,
                    bodyStyle:'text-align:center;margin-top:5px;',
                    // 第一列中的表项
                    // style:"margin-top:50px;",
                    fieldDefaults:{
                        labelAlign:'right',
                        labelWidth:80,
                    },
                    items:[
                        {
                            layout: {
                                align: 'left',
                                // pack: 'center',
                                type: 'hbox'
                            },
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                            },
                            baseCls : 'my-panel-no-border',  //去掉边框
                            items:[
                                {
                                    flex:1,
                                    defaults: {
                                        border:false,
                                        labelWidth:70,
                                        labelAlign:'right',
                                        width:'75%'
                                    },
                                    layout:{
                                        align: 'left',
                                        // pack: 'center',
                                        type: 'vbox'
                                    },
                                    items:[
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'm',
                                            name: 'm_con',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'n',
                                            name: 'n_con',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'a',
                                            name: 'a_con',
                                        },{
                                            xtype: 'textfield',
                                            fieldLabel: 'b',
                                            name: 'm_con',

                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'p',
                                            name: 'p_con',

                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '条件1',
                                            name: 'con1',
                                        },{
                                            xtype: 'textfield',
                                            fieldLabel: '条件2',
                                            name: 'con2',

                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'upWidth',
                                            name: 'upWidth',
                                        }
                                    ]
                                },
                                // {
                                //     flex:1,
                                //     defaults: {
                                //         border:false,
                                //         labelWidth:70,
                                //         labelAlign:'right',
                                //         width:'65%'
                                //     },
                                //     layout:{
                                //         align: 'left',
                                //         // pack: 'center',
                                //         type: 'vbox'
                                //     },
                                //     items:[
                                //         {
                                //             xtype: 'textfield',
                                //             name:'greater',
                                //             fieldLabel: '大于',
                                //         },
                                //         {
                                //             xtype: 'textfield',
                                //             name:'less',
                                //             fieldLabel: '小于',
                                //         },
                                //     ]
                                // },
                            ]
                        },
                    ]},


                // {
                //     xtype: 'textarea',
                //     name:'desc',
                //     fieldLabel: '备注',
                // }
            ],
            buttons:[{
                text:'保存'
            },{
                text:'取消'
            }]
        });



        var grid_pro_condition = Ext.create("Ext.panel.Panel", {
            id : 'grid_pro_condition',
            region:'center',
            title:'填写约束条件',
            // height:400,
            store : {
                fields :[]
            },
            //bbar:,
            // width:800,
            // tbar:toolbar,
            // columns : [],
            // hidden:true,//隐藏
            // bodyStyle: 'text-align:center;',
            items:[condition_form_ab],
            selType : 'rowmodel'
        });




        //产品
        var product_panel = Ext.create('Ext.panel.Panel',{

            width:1800,
            height:1000,
            tbar:toolbar,
            items:[
                grid_pro_condition,
            ]
        });





        // this.dockedItems = [toolbar,
        //     //toobar,
        //     toolbar1, grid,toolbar3];
        this.items = [ product_panel ];
        this.callParent(arguments);

    }

})

