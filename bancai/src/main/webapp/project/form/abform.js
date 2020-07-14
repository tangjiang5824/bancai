Ext.define("project.form.abform",{
    extend:"Ext.form.Panel",
    width:'95%',
    bodyStyle: 'text-align:center;padding:10px 10px 0px 5px',
    buttonAlign:'right',
    defaults: {
        // border:false,
        labelWidth:30,
        labelAlign:'right',
        width:'95%'
    },

    baseCls : 'my-panel-no-border',  //去掉边框
    //居中
    layout: {
        align: 'left',
        pack: 'center',
        type: 'vbox'
    },
    items: [
        {
            xtype: 'textfield',
            name:'a',
            fieldLabel: 'a',
            id:'a1'
        },{
            xtype: 'textfield',
            name:'b',
            fieldLabel: 'b',
            id:'b1'
        },
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con1 = Ext.getCmp('a1').getValue();
            var con2 = Ext.getCmp('b1').getValue();
            var con = con1+'#'+con2
            //将表格的值传到父页面
            Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});

Ext.define("project.form.abform",{
    extend:"Ext.form.Panel",
    width:'95%',
    bodyStyle: 'text-align:center;padding:10px 10px 0px 5px',
    buttonAlign:'right',
    defaults: {
        // border:false,
        labelWidth:30,
        labelAlign:'right',
        width:'95%'
    },

    baseCls : 'my-panel-no-border',  //去掉边框
    //居中
    layout: {
        align: 'left',
        pack: 'center',
        type: 'vbox'
    },
    items: [
        {
            xtype: 'textfield',
            name:'a',
            fieldLabel: 'a',
            id:'a1'
        },{
            xtype: 'textfield',
            name:'b',
            fieldLabel: 'b',
            id:'b1'
        },
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con1 = Ext.getCmp('a1').getValue();
            var con2 = Ext.getCmp('b1').getValue();
            var con = con1+'#'+con2
            //将表格的值传到父页面
            Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});
