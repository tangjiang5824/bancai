<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css"
href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
    <script src="extjs/ext-all.js"></script>
    <script src="js/LodopFuncs.js"></script>
    <script>
var login = Ext.create('Ext.form.Panel',{

    defaultType: 'textfield',
    bodyPadding: 0,
    url: 'login.do',
    items:[
        {
            fieldLabel: '用户名',
            allowBlank: false,
            emptyText: '请输入用户名',
            blankText:'用户名不能为空',
            msgTarget:'under',
            name: 'loginName',
            listeners : {
                specialkey : function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.up('form').doLogin();
                    }
                }
            }
        },
        {
            fieldLabel: '密码',
            allowBlank: false,
            emptyText: '请输入密码',
            inputType: 'password',
            blankText:'密码不能为空',
            msgTarget:'under',
            name: 'pwd',
            listeners : {
                specialkey : function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.up('form').doLogin();
                    }
                }
            }
        },
        {
            fieldLabel: '角色',
            name: 'role',
            value: "组织管理员",
            editable: false
        },
        {
            fieldLabel: '角色',
            emptyText: '组织管理员',
            name: 'roleId',
            value: 2,
            hidden:true,
            editable: false
        }
    ],
    buttons:[
        {
            text: '登录',
            handler: function(){
                this.up('form').doLogin();
            }
        }
    ],
    doLogin: function(){
        var form = this.getForm();
        if (form.isValid()) {
            form.submit({
                success: function(form, action) {
                    Ext.Msg.alert('消息', "登录成功");
                    window.location.href = "main.jsp";
                },
                failure: function(form, action) {
                    Ext.Msg.alert('消息', "登录失败，请检查用户名和密码");
                }
            });
        }
    }
});

Ext.onReady(function(){
    var win;
    var LODOP;
    if(!win){
        win = new Ext.Window({
            title:'LODOP打印控件测试',

            width:600,
            height:450,
            closeAction:'close',
            plain: true,
            autoLoad:{url:'a.asp',scripts:true},


            buttons: [{
                text:"测试",
                // handler: CheckIsInstall
            },
                {
                    text:'打印预览',
                    handler: prn1_preview
                },{
                    text: 'Close',
                    handler: function(){
                        win.close();
                    }
                }]
        });
    }
    win.show(this);

    function prn1_preview() {
        CreateOneFormPage();
        LODOP.PREVIEW();
    };
    function CreateOneFormPage()
    {
        LODOP=getLodop(document.getElementByIdx_x('LODOP_OB'),document.getElementByIdx_x('LODOP_EM'));
        LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
        LODOP.SET_PRINT_STYLE("FontSize",18);
        LODOP.SET_PRINT_STYLE("Bold",1);

        LODOP.ADD_PRINT_HTM(18,20,350,600,document.getElementByIdx_x("form2").innerHTML);
    };


    Ext.tip.QuickTipManager.init();
    //Ext.form.Field.prototype.msgTarget="side";
    Ext.create('Ext.window.Window',{
        title: '新久融板材信息系统',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        closable: false,
        layout: 'fit',
        items: [login]
    }).show();

});

</script>
<title>新久融板材信息系统</title>
</head>
<body>

</body>
</html>




Ext.define('project.result.newpanel_material_match_result',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '新板匹配结果',
    initComponent: function() {
    // <script language="javascript" type="text/javascript">



})
