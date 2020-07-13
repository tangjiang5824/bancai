Ext.define("project.form.mnpform",{
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
            name:'m',
            fieldLabel: 'm',
            id:'m3'
        },{
            xtype: 'textfield',
            name:'n',
            fieldLabel: 'n',
            id:'n3'
        },{
            xtype: 'textfield',
            name:'p',
            fieldLabel: 'p',
            id:'p'
        },
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con1 = Ext.getCmp('m3').getValue();
            var con2 = Ext.getCmp('n3').getValue();
            var con3 = Ext.getCmp('p').getValue();
            var con = con1+'#'+con2+'#'+con3;
            //将表格的值传到父页面
            Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});