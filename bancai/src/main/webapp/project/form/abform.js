Ext.define("project.form.abform",{
    extend:"Ext.form.Panel",
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
    // hidden:true,
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
            title: 'a的约束条件',
            layout: 'form',
            defaults: {anchor: '95%'},
            style: 'margin-left: 5px;padding-left: 5px;',
            width:500,
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
                    items:[
                        {
                            flex:0.6,
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                                width:'65%'
                            },
                            layout:{
                                align: 'left',
                                // pack: 'center',
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'textfield',
                                    name:'greaterAndequal',
                                    fieldLabel: '大于等于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'lessAndequal',
                                    fieldLabel: '小于等于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'equal',
                                    fieldLabel: '等于',
                                }
                            ]
                        },
                        {
                            flex:0.6,
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                                width:'65%'
                            },
                            layout:{
                                align: 'left',
                                // pack: 'center',
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'textfield',
                                    name:'greater',
                                    fieldLabel: '大于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'less',
                                    fieldLabel: '小于',
                                },
                            ]
                        },
                        // {
                        //     flex:1,
                        //     defaults: {
                        //         border:false,
                        //         labelWidth:70,
                        //         labelAlign:'right',
                        //         width:'95%'
                        //     },
                        //     layout:{
                        //         align: 'left',
                        //         // pack: 'center',
                        //         type: 'vbox'
                        //     },
                        //     items:[
                        //         {
                        //             xtype: 'textfield',
                        //             name:'bigger',
                        //             fieldLabel: '大于等于',
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name:'bigger',
                        //             fieldLabel: '大于等于',
                        //         },
                        //         {
                        //             xtype: 'textfield',
                        //             name:'bigger',
                        //             fieldLabel: '大于等于',
                        //         }
                        //     ]
                        // }
                    ]
                },
            ]},

        {
            xtype: 'fieldset',
            title: 'b的约束条件',
            layout: 'form',
            defaults: {anchor: '95%'},
            style: 'margin-left: 5px;padding-left: 5px;',
            width:500,
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
                    items:[
                        {
                            flex:1,
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                                width:'65%'
                            },
                            layout:{
                                align: 'left',
                                // pack: 'center',
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'textfield',
                                    name:'greaterAndequal',
                                    fieldLabel: '大于等于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'lessAndequal',
                                    fieldLabel: '小于等于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'equal',
                                    fieldLabel: '等于',
                                }
                            ]
                        },
                        {
                            flex:1,
                            defaults: {
                                border:false,
                                labelWidth:70,
                                labelAlign:'right',
                                width:'65%'
                            },
                            layout:{
                                align: 'left',
                                // pack: 'center',
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'textfield',
                                    name:'greater',
                                    fieldLabel: '大于',
                                },
                                {
                                    xtype: 'textfield',
                                    name:'less',
                                    fieldLabel: '小于',
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
        text:'保存'
    },{
        text:'取消'
    }]
});