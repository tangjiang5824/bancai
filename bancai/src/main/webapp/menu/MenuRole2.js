//组织管理员
Ext.define("menu.MenuRole2", {
	extend : "menu.BaseMenu",
	doLogout : function() {
		window.location.href = 'organization.jsp';
	},
	store : {
		root : {
			expanded : true,
			children : [ {
				text : '数据管理',
				expanded : true,
				children : [ {
					text : '数据上传',
					id : 'data.UploadData',
					leaf : true
				}, {
					text : '历史数据查询',
					// id: 'org.admin.hisSearch',
					id : "org.data.uploadRecords",
					leaf : true
				}, {
					text : '修改密码',
					id : 'org.data.changePassword',
					leaf : true
				} ]
			}, {
				text : '修改用户信息',
				id : 'org.edit.userInfo',
				leaf : true
			}, {
				text : '退出系统',
				id : 'logout',
				leaf : true
			} ]
		}
	}
})