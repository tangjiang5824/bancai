Ext.define("project.form.nform",{
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
            name:'n',
            fieldLabel: 'n',
            id:'n1'
        },
    ],
    buttons:[{
        text:'保存',
        handler : function(btn) {
            var con = Ext.getCmp('n1').getValue();
            console.log("con---",con);
            console.log("值---",Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0]);
            //将表格的值传到父页面
            Ext.getCmp("product_addDataGrid").getSelectionModel().getSelection()[0].set('format_con',con);
            //关闭窗口
            Ext.getCmp("win_condition").close();
        },
    }]
});