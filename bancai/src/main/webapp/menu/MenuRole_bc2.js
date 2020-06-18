//系统管理员
Ext.define("menu.MenuRole_bc2", {
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
					text : '旧板领料',
					id : 'oldpanel.oldpanel_Receive',
					leaf : true
				}, {
					text : '旧板入库',
					id : 'oldpanel.oldpanel_Inbound',
					leaf : true
				} ,{
					text : '旧板批量入库',
					id : 'oldpanel.old_Upload_Data',
					leaf : true
				} ,{
					text : '旧板库存查询',
					id : 'oldpanel.Old_Query_Data',
					leaf : true
				}, {
					text : '旧板出入库记录查询',
					id : 'oldpanel.oldpanel_Query_Records',
					leaf : true
				}, {
					text : '旧板出入库记录统计',
					id : 'oldpanel.oldpanel_Statistics_Records',
					leaf : true
				}]
			} ,{
				text : '原材料管理',
				expanded : true,
				children : [ {
					text : '原材料领料',
					id : 'material.material_Receive',
					leaf : true
				} , {
					text : '原材料入库',
					id : 'material.material_Inbound',
					leaf : true
				} ,
				{
					text : '原材料出库',
					id : 'material.material_Outbound',
					leaf : true
				},
				{
					text : '原材料批量入库',
					id : 'material.material_Upload_Data',
					leaf : true
				},
					{
					text : '原材料数据查询',

					id : 'material.material_Query_Data',
					leaf : true
				}, {
					text : '原材料出入库记录查询',
					id : 'material.material_Query_Records',
					leaf : true
				}, {
					text : '原材料出入库记录统计',
					id : 'material.material_Statistics_Records',
					leaf : true
				}, {
					text : '原材料预警',
					id : 'material.material_Warning',
					leaf : true
				}, {
					text : '原材料报警',
					id : 'material.material_Alarm',
					leaf : true
				}]
			},{
				text : '财务管理',
				expanded : true,
				children : [ {
					text : '成本查询',
					id : 'finance.Query_cost',
					leaf : true
				} , {
					text : '成本统计',
					id : 'finance.statistics_cost',
					leaf : true
				} ,
				]
			},
			]
		}
	}
})