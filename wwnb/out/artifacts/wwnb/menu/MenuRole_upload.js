//系统管理员
Ext.define("menu.MenuRole_upload", {
	extend : "menu.BaseMenu",
	doLogout : function() {
		window.location.href = 'testLogin.jsp';
	},
	store : {
		root : {
			expanded : true,
			children : [ {
				text : '数据上传',
				expanded : true,
				children : [ {
					text : '数据上传',
					id : 'data.Upload_Data',
					leaf : true
				} ]
			} ]
		}
	}
})