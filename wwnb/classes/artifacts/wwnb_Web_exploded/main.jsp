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
		var roleId=<c:out value="${roleId}"/>;
		Ext.tip.QuickTipManager.init();
		var title='<c:out value="${organizationName}"/>:<c:out value="${loginName}"/>';
		var organizationId='<c:out value="${organizationId}"/>';
		var menu=Ext.create("menu.MenuRole"+roleId,{title:title,organizationId:organizationId});
		var welcome = Ext.create("welcome.Welcome"+roleId);
		Ext.create('Ext.container.Viewport', {
			layout : 'border',
			items : [ menu, welcome ]
		}).show();
		sessionTimeOut(roleId);
	});
	
</script>
	<title>万州区税收征管保障信息系统</title>

</head>
<body>
</body>
</html>