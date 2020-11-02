<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--[if IE]><![endif]-->
<!--[if IE 8 ]>    <html lang="zh" class="ie8"> 
 <link rel="stylesheet" type="text/css" href="show.css"> 

  <![endif]-->
<!--[if IE 9 ]>    <html lang="zh" class="ie9">  <link rel="stylesheet" type="text/css" href="show.css">   <![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css"
    href="extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
<script src="extjs/ext-all.js"></script>
<script src="extjs/packages/ext-locale/build/ext-locale-zh_CN.js"></script>
<script src="extjs/json2.js"></script>
<script src="extjs/MonthField.js"></script>
<script src="extjs/util.js"></script>
<style type="text/css">
.x-btn-default-toolbar-small{
	background-color: #b9d0ec;
	border: solid white 1px;
	height: 24px;
}
 
.x-btn-button-default-small{
	height: 10px;
    width: 80px;
    margin: 0 0 0 0;
    background-color: #b9d0ec;
    border: solid white 1px;
}
.x-btn-default-small{
	border: solid #8995d2 0px;
	padding: 0px;
	height: 24px;
}
</style>

<script type="text/javascript">

	
	var timeout = function clock() {
		Ext.Ajax.request({
			url : 'timeout.do',
		})
	}
	
	function sessionTimeOut(roleId)
	{
		window.setInterval("timeout()", 1000 * 60 * 30);
		Ext.Ajax.on('requestexception', function(conn, response, options) {
			if (response.status == "999") {
				log("999");
				Ext.Msg.alert('提示', '会话超时，请重新登录!', function() {
					if (roleId == 0)
						window.location.href = 'system.jsp';
					else if (roleId == 1)
						window.location.href = 'tax.jsp';
					else if (roleId == 2)
						window.location.href = 'organization.jsp';
				});
			}
		}); 
	}
	Ext.onReady(function() {
		var usertype=<c:out value="${usertype}"/>;
		Ext.tip.QuickTipManager.init();
		var title='<c:out value="${username}"/>,欢迎您！'; //<c:out value="${usertype}"/>:
		var usertype='<c:out value="${usertype}"/>';
        //MenuRole_bc:0:admin,1:计划处，2：财务处
        // var menu=Ext.create("menu.MenuRole_bc"+usertype,{title:title,usertype:usertype});
		var menu=Ext.create("menu.MenuRole_bc"+usertype,{title:"功能导航"});
        var welcome = Ext.create("welcome.Welcome0"); //欢迎页面
        // var welcome = Ext.create("project.management.queryproject");

		// var menu=Ext.create("menu.MenuRole_upload",{title:title,usertype:usertype});
		// var welcome = Ext.create("welcome.Welcome0");

		Ext.create('Ext.container.Viewport', {
			layout : 'border',
			items : [
                {
                    title: '新久融板材管理系统',
                    region: 'north',
                    xtype: 'panel',
                    margins:'0 0 5 0',
                    tbar:[
                        '->',
						title,  //title+',欢迎您!',
                        '日期:'+Ext.Date.format(new Date(),'Y-m-d'),
                        // {
                        //     text:'修改密码'
                        // },
                        {
                            text:'退出'
                        },
                        {
                            xtype:'displayfield',
                            width:50
                        }

                    ]
                },
			    menu,
                welcome ]
		}).show();
		sessionTimeOut(usertype);
	});
	
</script>
	<title>新久融板材信息系统</title>

</head>
<body>
</body>
</html>