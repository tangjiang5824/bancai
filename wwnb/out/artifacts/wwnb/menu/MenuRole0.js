//系统管理员
Ext.define("menu.MenuRole0", {
			extend : "menu.BaseMenu",
			doLogout:function(){
				window.location.href = 'system.jsp';
			},
			store : {
				root : {
					expanded : true,
					children : [{
								text : '用户管理',
								id : 'system.userAdmin.main',
								leaf : true
							}, {
								text : '组织管理',
								id : 'system.organization.main',
								leaf : true
							}, {
								text : '数据表管理',
								id : 'system.dataTable.main',
								leaf : true
							}, {
								text : '修改密码',
								id : 'system.userAdmin.changePassword',
								leaf : true
							}, {
								text : '退出系统',
								id : 'logout',
								leaf : true
							}]
				}
			}
		})