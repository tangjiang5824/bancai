Ext.define('oldpanel.add_oldpanel_rules', {
    extend : 'Ext.panel.Panel',
    // region : 'center',
    // layout : "fit",
    layout:"border",
    title : '新增旧板匹配规则',
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

        var component1 = Ext.create('Ext.form.ComboBox', {
            // fieldLabel: '操作类型',
            name: 'component1',
            id: 'component1',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 80,
            // labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {
                    var type = component1.value; //id值
                    var typeName = component1.rawValue; //id值
                    //    store中的数据添加类型
                    data = [{
                        '格式名称' : typeName,
                    }];
                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);

                }
            }
        });
        var component2 = Ext.create('Ext.form.ComboBox', {
            // fieldLabel: '操作类型',
            name: 'component2',
            id: 'component2',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 80,
            // labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {
                    var type = component2.value; //id值
                    var typeName = component2.rawValue; //id值
                    //    store中的数据添加类型
                    data = [{
                        '格式名称' : typeName,
                    }];
                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);

                }
            }
        });
        var component3 = Ext.create('Ext.form.ComboBox', {
            // fieldLabel: '操作类型',
            name: 'component3',
            id: 'component3',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 80,
            // labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {
                    var type = component3.value; //id值
                    var typeName = component3.rawValue; //id值
                    //    store中的数据添加类型
                    data = [{
                        '格式名称' : typeName,
                    }];
                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);

                }
            }
        });
        var component4 = Ext.create('Ext.form.ComboBox', {
            // fieldLabel: '操作类型',
            name: 'component4',
            id: 'component4',
            store: optionTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 80,
            // labelWidth: 60,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {
                    var type = component4.value; //id值
                    var typeName = component4.rawValue; //id值
                    //    store中的数据添加类型
                    data = [{
                        '格式名称' : typeName,
                    }];
                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);

                }
            }
        });

        //根据类型名确认store的data数据
        var typeStore = Ext.create('Ext.data.Store', {
            fields:['类型','约束条件'],
            data:[
            ]
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
                component1,
                component2,
                component3,
                component4,
            ]
        });
        //成本 数量 存放位置
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype: 'tbtext',
                    margin: '0 0 0 0',
                    text:'<strong>旧板品名格式选择：</strong>'
                },
                // component1,
                // component2,
                // component3,
                // component4,
            ]
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'product_addDataGrid',
            region:'north',
            height:400,
            store : {
                fields :[]
            },
            //bbar:,
            width:800,
            // tbar:toolbar,

            columns : [
                {
                    dataIndex : '格式名称',
                    text : '格式名称',
                    //width : 110,
                    id:'类型名',
                },
                {
                    // name : '操作',
                    text : '约束条件',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='添 加' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                }
            ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel'
        });
        //产品右侧
        var condition_form1 = new Ext.form.Panel({
            // title:'新建原材料退库表',
            id: 'condition_form1',
            autoHeight: true,
            autoWidth: true,
            layout: 'form',
            border: false,
            bodyStyle: 'text-align:center;',
            // height:700,
            // baseCls : 'my-panel-no-border',  //去掉边框
            //居中
            // layout: {
            //     align: 'middle',
            //     pack: 'center',
            //     type: 'vbox'
            // },
            items: [{
                columnWidth: .3,
                xtype: 'fieldset',
                title: '添加约束条件',
                layout: 'form',
                defaults: {anchor: '95%'},
                style: 'margin-left: 5px;padding-left: 5px;',
                width:500,
                // 第二列中的表项
                bodyStyle:'text-align:center;',
                items:[
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '规格',
                        id: 'specification',
                        width: 140,
                        labelWidth: 30,
                        name: 'specification',
                        value: "",
                        allowBlank:false,
                    },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '横截面',
                        id: 'width',
                        labelWidth : 50,
                        width : 180,
                        name: 'width',
                        value: "",
                    },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '单重',
                        id: 'unitWeight',
                        width: 180,
                        labelWidth: 30,
                        name: 'unitWeight',
                        value: "",
                    },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '总重',
                        id: 'totalWeight',
                        width: 180,
                        labelWidth: 30,
                        name: 'totalWeight',
                        value: "",
                    },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '数量',
                        id: 'count',
                        width: 140,
                        labelWidth: 30,
                        name: 'count',
                        value: "",
                        allowBlank:false,
                    },{
                        xtype: 'textfield',
                        // margin: '0 10 0 0',
                        fieldLabel: ' 库存单位',
                        id: 'stockUnit',
                        width: 230,
                        labelWidth: 70,
                        name: 'stockUnit',
                        value: "",
                    }
                    // {xtype: 'textfield',fieldLabel: '职工类别',name: 'personType'}
                ]
            }]
        });


        var grid_pro_condition = Ext.create("Ext.panel.Panel", {
            id : 'grid_pro_condition',
            // region:'north',
            // title:'新建原材料退库表',
            height:400,
            store : {
                fields :[]
            },
            //bbar:,
            width:1000,
            // tbar:toolbar,
            // columns : [],
            hidden:true,//隐藏
            items:[condition_form1],
            // form:condition_form1,
            selType : 'rowmodel'
        });


        var grid2 = Ext.create("Ext.grid.Panel", {
            id : 'DataGrid',
            //dockedItems : [toolbar2],
            region: 'south',

            height:400,
            store : {
                fields :['类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            },
            //bbar:,
            tbar:toolbar1,

            columns : [
                {
                    dataIndex : 'aa',
                    name : 'aa',
                    text : 'aa',
                    //width : 110,
                    value:'99',
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true
                    },
                    //defaultValue:"2333",
                },

            ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel'
        });


        //产品
        var product_panel = Ext.create('Ext.panel.Panel',{
            layout:{
                type:'hbox',
                align:'stretch'
            },
            tbar:toolbar,
            // width:800,
            items:[
                grid,
                grid_pro_condition,
            ]
        });

        //产品和旧板panel
        var hole_panel = Ext.create('Ext.panel.Panel',{
            layout:{
                type:'vbox',
                align:'stretch'
            },
            // width:800,

            items:[
                //     {
                //     xtype:'tbtext',
                //     style: 'background-color: #99bce8',
                //     text:'<h2>产品品名格式:</h2>',
                // },
                product_panel,
                // {
                //                 //     xtype:'tbtext',
                //                 //     style: 'background-color: #99bce8',
                //                 //     text:'<h2>旧板品名格式:</h2>',
                //                 // },
                grid2,


            ]
        });

        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('product_addDataGrid').columns[columnIndex].text;
            console.log("列名：",fieldName)
            if (fieldName == "约束条件") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('product_addDataGrid').getSelectionModel();
                var materialArr = sm.getSelection();
                Ext.getCmp('grid_pro_condition').setHidden(false);
            }
        }

        // this.dockedItems = [toolbar,
        //     //toobar,
        //     toolbar1, grid,toolbar3];
        this.items = [ hole_panel ];
        this.callParent(arguments);

    }

})

