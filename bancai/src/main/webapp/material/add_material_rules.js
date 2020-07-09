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
        var type_tableName="material_type";
        var pro_tableName="product_info";

        //方法重写，表单验证，必填项加*号
        Ext.override(Ext.form.field.Base,{
            initComponent:function(){
                if(this.allowBlank!==undefined && !this.allowBlank){
                    if(this.fieldLabel){
                        this.fieldLabel += '<font color=red>*</font>';
                    }
                }
                this.callParent(arguments);
            }
        });

        var materialTypeStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : "material/findAllBytableName.do?tableName="+type_tableName,  //通用接口,查询原材料基础信息

                reader : {
                    type : 'json',
                    rootProperty: 'material_type',
                }
            },
            autoLoad : true
        });
        //
        var material_type = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '原材料类型',
            name: 'material_type',
            id: 'material_type',
            store: materialTypeStore,
            queryMode: 'local',
            displayField: 'typeName',
            valueField: 'id',
            margin : '0 20 0 40',
            width: 200,
            labelWidth: 75,
            allowBlank:false,
            blankText  : "原材料类型不能为空",
            renderTo: Ext.getBody(),

        });

        var productStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+pro_tableName,  //通用接口,查询原材料基础信息
                reader : {
                    type : 'json',
                    rootProperty: 'product_info',
                }
            },
            autoLoad : true
        });
        var productNameList = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '产品名',
            name: 'productNameList',
            store: productStore,
            queryMode: 'local',
            displayField: 'productName',
            valueField: 'id',
            margin : '0 20 0 40',
            width: 200,
            labelWidth: 50,
            allowBlank:false,
            blankText  : "产品名不能为空",
            renderTo: Ext.getBody(),

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
            ]
        });



        // 产品右侧
        var new_condition_form = new Ext.form.Panel({
            // title: '添加约束条件',
            // margin:'10 10 10 10',
            id: 'new_condition_form',
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
                                        material_type,
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
                                        productNameList,
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
            region:'center',
            title:'填写约束条件',
            // height:400,
            store : {
                fields :[]
            },
            //bbar:,
            // width:800,
            // columns : [],
            // hidden:true,//隐藏
            // bodyStyle: 'text-align:center;',
            items:[new_condition_form],
            selType : 'rowmodel'
        });




        //产品
        var product_panel = Ext.create('Ext.panel.Panel',{

            width:1800,
            height:1000,
            // tbar:toolbar,
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

