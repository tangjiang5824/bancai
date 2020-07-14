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
        var oldPanel_typeArr = [];
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
                    //产品表格
                    var pro_select = Ext.getCmp('product_addDataGrid').getStore()
                        .getData();
                    var s_pro = new Array();
                    pro_select.each(function(rec) {
                        s_pro.push(JSON.stringify(rec.data));
                    });
                    console.log("产品------------",s_pro);
                    //产品格式Id
                    var pro_format_id = Ext.getCmp('product_format').getValue();
                    console.log("Id------------",pro_format_id);

                    //获取数据
                    // Ext.Ajax.request({
                    //     url : 'material/updateprojectmateriallist.do', //原材料入库
                    //     method:'POST',
                    //     //submitEmptyText : false,
                    //     params : {
                    //         s : "[" + s + "]",//存储选择领料的数量
                    //         materialList : "[" + materialList + "]",
                    //     },
                    //     success : function(response) {
                    //         //var message =Ext.decode(response.responseText).showmessage;
                    //         Ext.MessageBox.alert("提示","保存成功" );
                    //         //刷新页面
                    //         MaterialList.reload();
                    //
                    //     },
                    //     failure : function(response) {
                    //         //var message =Ext.decode(response.responseText).showmessage;
                    //         Ext.MessageBox.alert("提示","保存失败" );
                    //     }
                    // });
                }
            }]
        });

        //出库or入库选择
        var haveABList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无AB角"},
                {"abbr":"1", "name":"有A角"},
                {"abbr":"2", "name":"有B角"},
            ]
        });
        var haveAB = Ext.create('Ext.form.ComboBox', {
            // fieldLabel: '格式',
            id: 'haveAB',
            name: 'haveAB',
            store: haveABList,
            queryMode: 'local',
            displayField: 'name',
            editable:false,
            valueField: 'abbr',
            // margin: '0 20 0 0',
            width: 70,
            // labelWidth: 35,
            renderTo: Ext.getBody(),
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
            id:'product_format',
            name: 'product_format',
            store: '',
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

        //旧板
        var oldPanelTypeStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'match/findOldpanelTypeList.do',

                reader : {
                    type : 'json',
                    rootProperty: 'oldpanelTypeList',
                }
            },
            autoLoad : true
        });
        //
        var oldPanel_type = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '旧板类型',
            name: 'oldPanel_type',
            id: 'oldPanel_type',
            store: oldPanelTypeStore,
            queryMode: 'local',
            displayField: 'oldpanelTypeName',
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
                        var typename = rec.data.oldpanelTypeName;
                        oldPanel_typeArr.push(typename)
                    }

                    //选中后
                    var select = record[0].data;
                    var id = select.id;//type对应的id
                    console.log(id)
                    var projectId = 'productTypeId';
                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'match/findOldpanelFormatList.do?oldpanelTypeId='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            //     productTypeId:id,
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'oldpanelFormatList',
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
                    oldpanel_format.setStore(tableListStore2);

                    //grid store重载
                    Ext.getCmp('product_addDataGrid').getStore().removeAll();

                    // Ext.getCmp('product_addDataGrid').getStore().loadData(data,
                    //     true);

                }
            }
        });
        var oldpanel_format = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '格式',
            id:'oldpanel_format',
            name: 'oldpanel_format',
            store: '',
            queryMode: 'local',
            displayField: 'oldpanelFormat',
            valueField: 'id',
            margin : '0 20 0 40',
            width: 180,
            labelWidth: 35,
            renderTo: Ext.getBody(),
            listeners:{
                //    typeStore
                select: function(combo, record, index) {

                    //grid store重载
                    Ext.getCmp('old_addDataGrid').getStore().removeAll();

                    // var type = product_format.value; //id值
                    var oldpanelFormat = record[0].data.oldpanelFormat;
                    //按空格切分
                    var arr = oldpanelFormat.split(' ');
                    console.log("arr================>",arr[0])

                    data = [];
                    //循环
                    Ext.each(arr,function (typeName,index,self) {
                        // console.log("typeName................",typeName);
                        data.push({'format_each_name' : typeName})
                    }),

                        Ext.getCmp('old_addDataGrid').getStore().loadData(data,
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
        //j旧板的toolbar
        var toolbar_old = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype: 'tbtext',
                    margin: '0 0 0 0',
                    text:'<strong>旧板品名格式选择：</strong>'
                },
                oldPanel_type,
                oldpanel_format,
                // component3,
                // component4,
            ]
        });

        var product_condition_form = new Ext.form.Panel({
            // title: '添加约束条件',
            // margin:'10 10 10 10',
            id: 'product_condition_form',
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
                                        width:'95%'
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
                                            name: 'm',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'n',
                                            name: 'n',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'p',
                                            name: 'p',

                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'a',
                                            name: 'a',
                                        },{
                                            xtype: 'textfield',
                                            fieldLabel: 'b',
                                            name: 'b',

                                        }
                                    ]
                                },
                                {
                                    flex:.3,
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
                                        // haveAB,
                                        {
                                            xtype: 'combo',
                                            name: 'm_haveAB',
                                            fieldLabel: '有无AB角',
                                            store: haveABList,
                                            emptyText:'-请选择-',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            editable:false,
                                            valueField: 'abbr',
                                            width: 150,
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'n_haveAB',
                                            id:'n_haveAB',
                                            fieldLabel: '有无AB角',
                                            store: haveABList,
                                            queryMode: 'local',
                                            displayField: 'name',
                                            editable:false,
                                            valueField: 'abbr',
                                            width: 150,
                                            //默认第一个值
                                            listeners: {
                                                //下拉框默认返回的第一个值
                                                render: function (combo) {//渲染
                                                    console.log("log----",combo)
                                                    combo.getStore().on("load", function (s, r, o) {
                                                        combo.setValue(r[0].get('name'));//第一个值
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'p_haveAB',
                                            fieldLabel: '有无AB角',
                                            store: haveABList,
                                            queryMode: 'local',
                                            displayField: 'name',
                                            editable:false,
                                            valueField: 'abbr',
                                            width: 150,
                                        }
                                    ]
                                }

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
                text:'保存',
                handler : function(btn) { // 按钮响应函数
                    Ext.Msg.show({
                        title: '操作确认',
                        message: '添加新的规则，选择“是”、“否”确认？',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function (btn) {
                            console.log("btn:----",btn)
                            // console.log("operatorName:----",Ext.getCmp('formMain').getForm().findField('projectName').getValue())
                            // console.log("projectid:----",Ext.getCmp('formMain').getForm().findField('projectName').value)
                            if (btn === 'yes') {
                                Ext.getCmp('new_condition_form').getForm().submit({
                                    url: 'project/match/newPanel.do', //新版添加规则
                                    method: 'POST',
                                    //submitEmptyText : false,
                                    success: function (response) {
                                        //var message =Ext.decode(response.responseText).showmessage;
                                        Ext.MessageBox.alert("提示", "保存成功");
                                    },
                                    failure: function (response) {
                                        //var message =Ext.decode(response.responseText).showmessage;
                                        Ext.MessageBox.alert("提示", "保存失败");
                                    }
                                })
                            }
                        }
                    })
                },
            },{
                text:'取消'
            }]
        });

        var old_condition_form = new Ext.form.Panel({
            // title: '添加约束条件',
            // margin:'10 10 10 10',
            id: 'old_condition_form',
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
                                            name: 'm',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'n',
                                            name: 'n',
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'a',
                                            name: 'a',
                                        },{
                                            xtype: 'textfield',
                                            fieldLabel: 'b',
                                            name: 'b',

                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'p',
                                            name: 'p',

                                        },
                                    ]
                                },

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
                text:'保存',
                handler : function(btn) { // 按钮响应函数
                    Ext.Msg.show({
                        title: '操作确认',
                        message: '添加新的规则，选择“是”、“否”确认？',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function (btn) {
                            console.log("btn:----",btn)
                            // console.log("operatorName:----",Ext.getCmp('formMain').getForm().findField('projectName').getValue())
                            // console.log("projectid:----",Ext.getCmp('formMain').getForm().findField('projectName').value)
                            if (btn === 'yes') {
                                Ext.getCmp('new_condition_form').getForm().submit({
                                    url: 'project/match/newPanel.do', //新版添加规则
                                    method: 'POST',
                                    //submitEmptyText : false,
                                    success: function (response) {
                                        //var message =Ext.decode(response.responseText).showmessage;
                                        Ext.MessageBox.alert("提示", "保存成功");
                                    },
                                    failure: function (response) {
                                        //var message =Ext.decode(response.responseText).showmessage;
                                        Ext.MessageBox.alert("提示", "保存失败");
                                    }
                                })
                            }
                        }
                    })
                },
            },{
                text:'取消'
            }]
        });


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

        //产品
        var product_panel = Ext.create('Ext.panel.Panel',{
            // layout:{
            //     type:'vbox',
            //     align:'stretch'
            // },
            region:'West',
            tbar:toolbar,
            items:[
                // grid,
                product_condition_form,
            ]
        });

        //产品
        var old_panel = Ext.create('Ext.panel.Panel',{
            // layout:{
            //     type:'vbox',
            //     align:'stretch'
            // },
            region:'center',
            tbar:toolbar_old,
            items:[
                // grid2,
                old_condition_form,
            ]
        });

        //产品和旧板panel
        var hole_panel = Ext.create('Ext.panel.Panel',{
            // layout:{
            //     type:'vbox',
            //     align:'stretch'
            // },
            layout:'hbox',//左右上下布局
            // width:800,
            items:[
                product_panel,
                old_panel,
            ]
        });

        // this.dockedItems = [toolbar,
        //     //toobar,
        //     toolbar1, grid,toolbar3];
        this.tbar =toolbar_top ;
        this.items = [ hole_panel ];
        this.callParent(arguments);

    }

})

