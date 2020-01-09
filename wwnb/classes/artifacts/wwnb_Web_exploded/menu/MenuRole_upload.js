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
				text : '旧版材库信息数据',
				expanded : true,
				children : [ {
					text : '旧板数据上传',
					id : 'data.Old_Upload_Data',
					leaf : true
				} , {
					text : '旧板数据查询',
					id : 'data.Old_Query_Data',
					leaf : true
				}]
			} ,{
				text : '新板信息数据',
				expanded : true,
				children : [ {
					text : '新板数据上传',
					id : 'data.New_Upload_Data',
					leaf : true
				} , {
					text : '新板数据查询',
					id : 'data.New_Query_Data',
					leaf : true
				}]
			},{
				text : '自动化扣板',
				expanded : true,
				children : [ {
					text : '项目立项',
					id : 'project.project_plan',
					leaf : true
				} , {
					text : '导入设计清单',
					id : '',
					leaf : true
				} , {
					text : '项目旧板材料清单',
					id : '',
					leaf : true
				} , {
					text : '项目新板材料清单',
					id : '',
					leaf : true
				} , {
					text : '项目生产材料单',
					id : 'project.project_plan_list',
					leaf : true
				}, {
					text : '项目领料单',
					id : '',
					leaf : true
				}, {
					text : '项目产品工单',
					id : '',
					leaf : true
				}]
			}
			]
		}
	}
})