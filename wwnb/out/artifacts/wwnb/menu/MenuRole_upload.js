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
					text : '旧板材库数据上传',
					id : 'data.Old_Upload_Data',
					leaf : true
				} , {
					text : '旧板材库数据查询',
					id : 'data.Old_Check_Data',
					leaf : true
				}]
			} ,{
				text : '新板材库信息数据',
				expanded : true,
				children : [ {
					text : '新板材库数据上传',
					id : 'data.New_Upload_Data',
					leaf : true
				} , {
					text : '新板材库数据查询',
					id : 'data.New_Check_Data',
					leaf : true
				}]
			} ,{
				text : '自动化扣板',
				expanded : true,
				children : [ {
					text : '项目立项',
					id : 'data.Build_Project',
					leaf : true
				} , {
					text : '生产材料单',
					id : 'data.Project_List',
					leaf : true
				}]
			}]
		}
	}
})