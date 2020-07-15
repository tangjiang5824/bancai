Ext.define("project.form.mform",{
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
            id:'m1'
        },
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con = Ext.getCmp('m1').getValue();
            //将表格的值传到父页面
           Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});


//旧板
Ext.define("project.form.mform_old",{
    extend:"Ext.form.Panel",
    width:'95%',
    bodyStyle: 'text-align:center;padding:10px 10px 0px 5px',
    buttonAlign:'left',
    defaults: {
        // border:false,
        labelWidth:30,
        labelAlign:'right',
        width:'95%'
    },

    baseCls : 'my-panel-no-border',  //去掉边框
    //居中
    layout: 'column',
    items: [
        {
            layout: "form", border: false, items: { xtype: "textfield", fieldLabel: "m", id:'m_1' }, columnWidth: .3
        },
        {
            layout: "form", border: false, items: { xtype: "tbtext", text: "---", width: 40 }, columnWidth: .1
        },
        {
            layout: "form", border: false, items: { xtype: "textfield", width: 80, id:'m_2' }, columnWidth: .25
        }
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con1 = Ext.getCmp('m_1').getValue();
            var con2 = Ext.getCmp('m_2').getValue();
            var con = con1+'#'+con2
            //将表格的值传到父页面
            Ext.getCmp("old_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});