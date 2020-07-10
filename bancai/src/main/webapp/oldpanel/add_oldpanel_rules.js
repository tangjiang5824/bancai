Ext.define('oldpanel.add_oldpanel_rules', {
    extend : 'Ext.panel.Panel',
    // region : 'center',
    layout : "fit",
    // layout:"border",
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

        //保存类型名的数组
        var product_typeArr = [];
        //var materialtype="1";

        var toolbar_top = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar4",
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '添加规则',
                // region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {
                    //保存规则
                    
                }
            }]
        });

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

        var map = new Ext.util.MixedCollection();


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
            width: 180,
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
            width: 180,
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
                        'format_each_name' : typeName,
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
                        'format_each_name' : typeName,
                    }];
                    Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                        true);

                }
            }
        });

        //根据类型名确认store的data数据
        var typeStore = Ext.create('Ext.data.Store', {
            fields:['类型','条件','约束条件'],
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
                product_type,

                product_format,
                // component3,
                // component4,
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
            height:300,
            store : {
                fields :[]
            },
            //bbar:,
            width:1800,
            // flex:1,
            // tbar:toolbar,

            columns : [
                {
                    dataIndex : 'format_each_name',
                    text : '格式名称',
                    width : 110,
                    id:'typename',
                    // flex:0.2
                },
                {
                    // name : '操作',
                    // flex:0.2,
                    width : 110,
                    text : '约束条件',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='添 加' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },{
                    dataIndex : 'format_con',
                    text : '条件',
                    width : 600,
                    id:'condition',
                    // flex:0.6,
                    editor:{xtype : 'textfield', allowBlank : false}
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

        var grid2 = Ext.create("Ext.grid.Panel", {
            id : 'old_addDataGrid',
            region:'north',
            // height:300,
            store : {
                fields :[]
            },
            //bbar:,
            width:1800,
            // flex:1,
            // tbar:toolbar,

            columns : [
                {
                    dataIndex : 'format_each_name',
                    text : '格式名称',
                    width : 110,
                    id:'old_typename',
                    // flex:0.4
                },
                {
                    // name : '操作',
                    // flex:1,
                    width : 110,
                    text : '约束条件',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='添 加' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },{
                    dataIndex : 'format_con',
                    text : '条件',
                    width : 600,
                    id:'old_condition',
                    // flex:1.5,
                    editor:{xtype : 'textfield', allowBlank : false}
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

        var condition_form_ab = Ext.create('project.form.abform');
        var condition_form_m = Ext.create('project.form.mform');
        var condition_form_n = Ext.create('project.form.nform');
        var condition_form_mn = Ext.create('project.form.mnform');
        var condition_form_mnp = Ext.create('project.form.mnpform');

        //产品右侧
        // var condition_form_m = new Ext.form.Panel({
        //     // title: '添加约束条件',
        //     // margin:'10 10 10 10',
        //     id: 'condition_form_m',
        //     // autoHeight: true,
        //     // autoWidth: true,
        //     // layout: 'form',
        //     // border: true,
        //     width:'95%',
        //     bodyStyle: 'text-align:center;padding:20px 10px 0px 5px',
        //     buttonAlign:'center',
        //     defaults: {
        //         // border:false,
        //         labelWidth:70,
        //         labelAlign:'right',
        //         width:'95%'
        //     },
        //     hidden:true,
        //
        //     // height:700,
        //     baseCls : 'my-panel-no-border',  //去掉边框
        //     //居中
        //     layout: {
        //         align: 'left',
        //         pack: 'center',
        //         type: 'vbox'
        //     },
        //     items: [
        //         {
        //             xtype: 'fieldset',
        //             title: 'm的约束条件',
        //             layout: 'form',
        //             defaults: {anchor: '95%'},
        //             style: 'margin-left: 5px;padding-left: 5px;',
        //             width:500,
        //             bodyStyle:'text-align:center;margin-top:5px;',
        //             // 第一列中的表项
        //             // style:"margin-top:50px;",
        //             fieldDefaults:{
        //                 labelAlign:'right',
        //                 labelWidth:80,
        //             },
        //             items:[
        //                 {
        //                     layout: {
        //                         align: 'left',
        //                         // pack: 'center',
        //                         type: 'hbox'
        //                     },
        //                     defaults: {
        //                         border:false,
        //                         labelWidth:70,
        //                         labelAlign:'right',
        //                     },
        //                     items:[
        //                         {
        //                             flex:0.6,
        //                             defaults: {
        //                                 border:false,
        //                                 labelWidth:70,
        //                                 labelAlign:'right',
        //                                 width:'65%'
        //                             },
        //                             layout:{
        //                                 align: 'left',
        //                                 // pack: 'center',
        //                                 type: 'vbox'
        //                             },
        //                             items:[
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'greaterAndequal',
        //                                     fieldLabel: '大于等于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'lessAndequal',
        //                                     fieldLabel: '小于等于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'equal',
        //                                     fieldLabel: '等于',
        //                                 }
        //                             ]
        //                         },
        //                         {
        //                             flex:0.6,
        //                             defaults: {
        //                                 border:false,
        //                                 labelWidth:70,
        //                                 labelAlign:'right',
        //                                 width:'65%'
        //                             },
        //                             layout:{
        //                                 align: 'left',
        //                                 // pack: 'center',
        //                                 type: 'vbox'
        //                             },
        //                             items:[
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'greater',
        //                                     fieldLabel: '大于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'less',
        //                                     fieldLabel: '小于',
        //                                 },
        //                             ]
        //                         },
        //                         // {
        //                         //     flex:1,
        //                         //     defaults: {
        //                         //         border:false,
        //                         //         labelWidth:70,
        //                         //         labelAlign:'right',
        //                         //         width:'95%'
        //                         //     },
        //                         //     layout:{
        //                         //         align: 'left',
        //                         //         // pack: 'center',
        //                         //         type: 'vbox'
        //                         //     },
        //                         //     items:[
        //                         //         {
        //                         //             xtype: 'textfield',
        //                         //             name:'bigger',
        //                         //             fieldLabel: '大于等于',
        //                         //         },
        //                         //         {
        //                         //             xtype: 'textfield',
        //                         //             name:'bigger',
        //                         //             fieldLabel: '大于等于',
        //                         //         },
        //                         //         {
        //                         //             xtype: 'textfield',
        //                         //             name:'bigger',
        //                         //             fieldLabel: '大于等于',
        //                         //         }
        //                         //     ]
        //                         // }
        //                     ]
        //                 },
        //             ]},
        //
        //         {
        //             xtype: 'fieldset',
        //             title: 'b的约束条件',
        //             layout: 'form',
        //             defaults: {anchor: '95%'},
        //             style: 'margin-left: 5px;padding-left: 5px;',
        //             width:500,
        //             bodyStyle:'text-align:center;margin-top:5px;',
        //             // 第一列中的表项
        //             // style:"margin-top:50px;",
        //             fieldDefaults:{
        //                 labelAlign:'right',
        //                 labelWidth:80,
        //             },
        //             items:[
        //                 {
        //                     layout: {
        //                         align: 'left',
        //                         // pack: 'center',
        //                         type: 'hbox'
        //                     },
        //                     defaults: {
        //                         border:false,
        //                         labelWidth:70,
        //                         labelAlign:'right',
        //                     },
        //                     items:[
        //                         {
        //                             flex:1,
        //                             defaults: {
        //                                 border:false,
        //                                 labelWidth:70,
        //                                 labelAlign:'right',
        //                                 width:'65%'
        //                             },
        //                             layout:{
        //                                 align: 'left',
        //                                 // pack: 'center',
        //                                 type: 'vbox'
        //                             },
        //                             items:[
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'greaterAndequal',
        //                                     fieldLabel: '大于等于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'lessAndequal',
        //                                     fieldLabel: '小于等于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'equal',
        //                                     fieldLabel: '等于',
        //                                 }
        //                             ]
        //                         },
        //                         {
        //                             flex:1,
        //                             defaults: {
        //                                 border:false,
        //                                 labelWidth:70,
        //                                 labelAlign:'right',
        //                                 width:'65%'
        //                             },
        //                             layout:{
        //                                 align: 'left',
        //                                 // pack: 'center',
        //                                 type: 'vbox'
        //                             },
        //                             items:[
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'greater',
        //                                     fieldLabel: '大于',
        //                                 },
        //                                 {
        //                                     xtype: 'textfield',
        //                                     name:'less',
        //                                     fieldLabel: '小于',
        //                                 },
        //                             ]
        //                         },
        //                     ]
        //                 },
        //             ]},
        //
        //
        //         // {
        //         //     xtype: 'textarea',
        //         //     name:'desc',
        //         //     fieldLabel: '备注',
        //         // }
        //     ],
        //     buttons:[{
        //         text:'保存'
        //     },{
        //         text:'取消'
        //     }]
        // });
        var grid_pro_condition = Ext.create("Ext.panel.Panel", {
            id : 'grid_pro_condition',
            // region:'north',
            // title:'填写约束条件',
            height:400,
            store : {
                fields :[]
            },
            width:800,
            // hidden:true,//隐藏
            bodyStyle: 'text-align:center;',
            // items:[],
            selType : 'rowmodel'
        });

        //弹出了窗口
        var win_condition = Ext.create('Ext.window.Window', {
            id:'win_condition',
            title: '添加约束',
            height: 150,
            width: 400,
            layout: 'fit',
            closable : true,
            draggable:true,
            items:grid_pro_condition,
            closeAction : 'close',

            modal:true,//模态窗口，背景窗口不可编辑
        });

        //窗口关闭响应事件
        // win_condition.on('close',function(){
        //     var items=grid_pro_condition.items;
        //     console.log("items-------",items)
        //     grid_pro_condition.removeAll();
        //     // var items=Ext.getCmp('grid_pro_condition').items;
        //     // Ext.getCmp('grid_pro_condition').remove(items.items[0]);
        // })


        //产品
        var product_panel = Ext.create('Ext.panel.Panel',{
            layout:{
                type:'hbox',
                align:'stretch'
            },
            tbar:toolbar,
            items:[
                grid,
            ]
        });

        //产品
        var old_panel = Ext.create('Ext.panel.Panel',{
            layout:{
                type:'hbox',
                align:'stretch'
            },
            // tbar:toolbar,
            items:[
                grid2,
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
                //     xtype:'tbtext',
                //     style: 'background-color: #99bce8',
                //     text:'<h2>旧板品名格式:</h2>',
                // },
                old_panel,



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

                var form_con=Ext.getCmp("grid_pro_condition");
                form_con.removeAll();

                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('product_addDataGrid').getSelectionModel();
                var materialArr = sm.getSelection();

                var format_each_name = e.data.format_each_name
                console.log("选择记录：",e.data.format_each_name);
                //判断格式名称，若为W（产品类型）和无，则无约束条件。
                // format_each_nameconsole.log(typeArr.includes("WPE"))
                if(format_each_name == '无' || product_typeArr.includes(format_each_name)){
                    Ext.MessageBox.alert("提示", "没有约束条件");
                }
                else if(format_each_name == 'n'){

                    form_con.add(condition_form_n);
                    form_con.doLayout();  //动态添加items

                    // Ext.getCmp('win_condition').show();
                    win_condition.show();
                    // condition_form_ab.setHidden(false);
                    // grid_pro_condition.addItem(condition_form_ab);
                }
                else if(format_each_name == 'm'){
                    form_con.add(condition_form_m);
                    form_con.doLayout();  //动态添加items

                    // Ext.getCmp('win_condition').show();
                    win_condition.show();
                }else if(format_each_name == 'a+b' || format_each_name == 'a*b' ||format_each_name == 'b*a'){
                    form_con.add(condition_form_ab);
                    form_con.doLayout();  //动态添加items
                    win_condition.show();
                }else if(format_each_name == 'm+n'){
                    form_con.add(condition_form_mn);
                    form_con.doLayout();  //动态添加items
                    win_condition.show();
                }else if(format_each_name == 'm+n+p'){
                    form_con.add(condition_form_mnp);
                    form_con.doLayout();  //动态添加items
                    win_condition.show();
                }
            }
        }

        // this.dockedItems = [toolbar,
        //     //toobar,
        //     toolbar1, grid,toolbar3];
        this.tbar =toolbar_top ;
        this.items = [ hole_panel ];
        this.callParent(arguments);

    }

})

