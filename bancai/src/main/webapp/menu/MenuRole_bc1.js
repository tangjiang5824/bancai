//系统管理员
Ext.define("menu.MenuRole_bc1", {
	extend : "menu.BaseMenu",
	doLogout : function() {
		window.location.href = 'testLogin.jsp';
	},
	store : {
		root : {
			expanded : true,
			children : [ {
				text : '产品管理',
				expanded : true,
				children : [ {
					text : '产品信息录入',
					id : 'product.product_Inbound',
					leaf : true
				} , {
					text : '产品信息查询',
					id : 'product.product_Query_Data',
					leaf : true
				} ,
				]
			},{
				text : '项目管理',
				expanded : true,
				children : [ {
					text : '项目立项',
					id : 'project.management.buildproject',
					leaf : true
				}, {
					text : '项目信息查询',
					id : 'project.management.queryproject',
					leaf : true
				}, {
					text : '项目信息修改',
					id : 'project.management.editProject',
					leaf : true
				},
					{
					text : '项目楼栋信息查询',
					id : 'project.management.buildinglist',
					leaf : true
				}, {
					text : '导入设计清单',
					id : 'project.import_design_list',//project.import_planList
					leaf : true
				} , {
					text : '项目旧板材料清单',
					id : 'project.oldpanel_material_list',
					leaf : true
				} , {
					text : '项目新板材料清单',
					id : 'project.newpanel_material_list',
					leaf : true
				} , {
					text : '项目生产材料单',
					id : 'project.project_plan_list',
					leaf : true
				}, {
					text : '项目领料单',
					id : 'project.project_material_picklist',
					leaf : true
				}, {
					text : '项目产品工单',
					id : '',
					leaf : true
				}]
			},
				{
				text : '基础信息管理',
				expanded : true,
				children : [ {
					text : '原材料种类管理',
					//leaf : true
					expanded : true,
					children : [{
						text : '添加新的类型',
						id : 'material.add_Mcatergory_baseInfo',
						leaf : true
					},{
						text : '查看原材料类型',
						id : 'material.query_Mcatergory_baseInfo',
						leaf : true
					}
					]
				} , {
					text : '旧版种类管理',
					//leaf : true
					expanded : true,
					children : [{
						text : '添加新的类型',
						id : 'oldpanel.add_Ocatergory_baseInfo',
						leaf : true
					},{
						text : '查看旧版基础信息',
						id : 'oldpanel.query_Ocatergory_baseInfo',
						leaf : true
					}
					]
				} , {
					text : '产品种类管理',
					//leaf : true
					expanded : true,
					children : [{
						text : '添加新的类型',
						id : 'product.add_Pcatergory_baseInfo',
						leaf : true
					},{
						text : '查看产品基础信息',
						id : 'product.query_Pcatergory_baseInfo',//
						leaf : true
					}
					]
				}
				]
			}
			]
		}
	}
})