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
				text : '旧板管理',
				expanded : true,
				children : [ {
					text : '旧板批量入库（Excel）',
					id : 'oldpanel.Old_Upload_Data',
					leaf : true
				} , {
					text : '旧板手动入库（下拉框）',
					//id : ,//'oldpanel.Old_Upload_Data',
					leaf : true
				} ,{
					text : '旧板出库（左右两个界面，可选出库数量）',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '旧板库存查询（显示旧板表）',
					id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '旧板出入库记录查询（出入库日志）',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '旧板出入库记录统计',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}]
			} ,{
				text : '原材料管理',
				expanded : true,
				children : [ {
					text : '原材料领料（左右两个界面，可选出库数量）',
					id : 'material.material_Receive',
					leaf : true
				} , {
					text : '原材料入库',
					id : 'material.material_Inbound',
					leaf : true
				} ,{
					text : '原材料数据上传',
					id : 'material.material_Upload_Data',
					leaf : true
				},
					{
					text : '原材料数据查询',

					id : 'material.material_Query_Data',
					leaf : true
				}, {
					text : '原材料出入库记录查询（出入库日志）',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '原材料出入库记录统计',
					id : 'material.material_Query_Records',
					leaf : true
				}, {
					text : '预警',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '报警',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}]
			},{
				text : '产品管理',
				expanded : true,
				children : [ {
					text : '产品信息录入',
					//id : 'material.material_Upload_Data',
					leaf : true
				} , {
					text : '产品信息查询',
					//id : 'material.material_Upload_Data',
					leaf : true
				} , {
					text : '产品信息修改',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '产品信息删除（待定）',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '',
					//id : 'oldpanel.Old_Query_Data',
					leaf : true
				}]
			},{
				text : '项目管理',
				expanded : true,
				children : [ {
					text : '项目立项',
					id : 'project.management.buildproject',
					leaf : true
				}, {
					text : '项目楼栋信息查询',
					id : 'project.management.buildinglist',
					leaf : true
					}, {
					text : '导入设计清单',
					id : 'project.import_design_list',
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