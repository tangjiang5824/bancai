//系统管理员
Ext.define("menu.MenuRole_bc0", {
	extend : "menu.BaseMenu",
	doLogout : function() {
		window.location.href = 'testLogin.jsp';
	},
	store : {
		root : {
			expanded : true,//菜单项 展开
			children : [{
				text : '仓库管理',
				expanded : true,
				children : [
						{
				text : '旧板管理',
				// expanded : true,
				children : [
					{
					text : '入库',
					id : 'oldpanel.oldpanel_Inbound',
					leaf : true
				} ,
				// 	{
				// 	text : '批量入库',
				// 	id : 'oldpanel.old_Upload_Data',
				// 	leaf : true
				// } ,
					{
					text : '误入库撤销',
					id : 'oldpanel.oldpanel_Outbound',
					leaf : true
				},
					{
					text : '库存查询',
					id : 'oldpanel.Old_Query_Data',
					leaf : true
				},
				// 	{
				// 	text : '旧板退库',
				// 	id : 'oldpanel.oldpanel_Back',
				// 	leaf : true
				// },
				{
					text : '领料',
					id : 'oldpanel.oldpanel_Receive',
					leaf : true
				},
				{
					text : '退料审核',
					id : 'oldpanel.oldpanel_backcheck',
					leaf : true
				},
				{
					text : '出入库记录查询',
					id : 'oldpanel.oldpanel_Query_Records',//'oldpanel.oldpanel_Query_Records',
					leaf : true
				}
				// ,{
				// 	text : '出入库记录统计',
				// 	id : 'oldpanel.oldpanel_Statistics_Records',
				// 	leaf : true
				// }
				]
			} ,{
				text : '原材料管理',
				// expanded : true,
				children : [
					{
					text : '入库',
					id : 'material.material_Inbound',
					leaf : true
				} ,

					{
					text : '批量入库',
					id : 'material.material_Upload_Data',
					leaf : true
				}, {
						text : '误入库撤销',
						id : 'material.material_Outbound',
						leaf : true
					},
					{
					text : '库存查询',
					id : 'material.material_Query_Data',
					leaf : true
				},

					{
						text : '领料',
						id : 'material.material_Receive',
						leaf : true
					},
					{
						text : '领料(自定义)',
						id : 'material.material_Receive_input',
						leaf : true
					},
					// 	{
					// 	text : '原材料退库',
					// 	id : 'material.material_Back',
					// 	leaf : true
					// },
					{
						text : '退料审核',
						id : 'material.material_backcheck',
						leaf : true
					},
					{
					text : '出入库记录查询',
					id : 'material.material_Query_Records',//'material.material_Query_Records',
					leaf : true
				}
				// ,{
				// 	text : '出入库记录统计',
				// 	id : 'material.material_Statistics_Records',
				// 	leaf : true
				// }
				,{
					text : '库存预警',
					id : 'material.material_Warning',
					leaf : true
				},{
					text : '库存报警',
					id : 'material.material_Alarm',
					leaf : true
				}]
			}, {
				text : '预加工仓库管理',
				// expanded : true,
				children : [
				// 	{
				// 	text : '半成品预加工',
				// 	id : '',
				// 	leaf : true
				// },
					{
					text : '入库',
					id : 'preprocess.preprocess_Inbound',
					leaf : true
				} ,
					{
						text : '误入库撤销',
						id : 'preprocess.preprocess_Outbound',
						leaf : true
					},
					// {
					// 	text : '入库',
					// 	id : 'preprocess.preprocess_Inbound_old',
					// 	leaf : true
					// } ,
				// 	{
				// 	text : '批量入库',
				// 	id : 'preprocess.preprocess_Upload_Data',
				// 	leaf : true
				// } ,
					{
					text : '库存查询',
					id : 'preprocess.preprocess_Query_Data',
					leaf : true
				},
					{
						text : '领料',
						id : 'preprocess.preprocess_Receive',
						leaf : true
					},
					{
						text : '退料',
						id : 'preprocess.preprocess_backcheck',
						leaf : true
					},

					{
						text : '出入库记录查询',
						id : 'preprocess.preprocess_Query_Records',
						leaf : true
				}
				// ,{
				// 	text : '出入库记录统计',
				// 	id : '',
				// 	leaf : true
				// }
				]
			},{
				text : '退库成品仓库管理',
				// expanded : true,
				children : [
					{
					text : '入库',
					id : 'backproduct.backproduct_Inbound',
					leaf : true
				} ,
					{
						text : '误入库撤销',
						id : 'backproduct.backproduct_Outbound',
						leaf : true
					},
					{
					text : '库存查询',
					id : 'backproduct.backproduct_Query_Data',
					leaf : true
				},
					{
						text : '领料',
						id : 'backproduct.backproduct_Receive',
						leaf : true
					},
					{
						text : '退料',
						id : 'backproduct.backproduct_backcheck',
						leaf : true
					},
					{
					text : '出入库记录查询',
					id : 'backproduct.backproduct_Query_Records',
					leaf : true
				}
				// , {
				// 	text : '出入库记录统计',
				// 	id : 'backproduct.backproduct_Statistics_Records',
				// 	leaf : true
				// }
				]
			},{
				text : '产品成品仓库管理',
				// expanded : true,
				children : [
				// 	{
				// 	text : '单件产品成品入库',
				// 	id : 'product.product_Inbound_One',
				// 	leaf : true
				// } ,
				// 	{
				// 	text : '产品成品入库',
				// 	id : 'product.product_Inbound',
				// 	leaf : true
				// } ,
					{
					text : '库存查询',
					id : 'product.product_Query_Data',
					leaf : true
				},
				// 	{
				// 	text : '产品成品出库',
				// 	id : 'product.product_outBound',
				// 	leaf : true
				// },
					{
					text : '出入库记录查询',
					id : 'product.product_Query_Records',
					leaf : true
				},
				// 	{
				// 	text : '出入库记录统计',
				// 	id : 'product.product_Statistics_Records',
				// 	leaf : true
				// }
				]
			},
					{
						text : '废料仓库管理',
						// expanded : true,
						children : [
							{
								text : '入库',
								id : 'unuseMaterial.unuseMaterial_Inbound',
								leaf : true
							},
							{
								text : '库存查询',
								id : 'unuseMaterial.unuseMaterial_Query_Data',
								leaf : true
							} ,{
								text : '出入库记录查询',
								id : 'unuseMaterial.unuseMaterial_Query_Records',
								leaf : true
							} ,{
								text : '废料记录撤销',
								id : 'unuseMaterial.unuseMaterial_cancelRecords',
								leaf : true
							} ,{
								text : '废料出库',
								id : 'unuseMaterial.unuseMaterial_outBound',
								leaf : true
							} ,
							{
								text : '废料结算',
								id : 'unuseMaterial.unuseMaterial_settleAccount',
								leaf : true
							} ,
							{
								text : '废料结算查询',
								id : 'unuseMaterial.unuseMaterial_query_settle',
								leaf : true
							} ,
						]
					},
		]},

			// 	{
			// 	text : '产品管理',
			// 	expanded : true,
			// 	children : [ {
			// 		text : '产品信息录入',
			// 		id : 'product.product_Inbound',
			// 		leaf : true
			// 	} , {
			// 		text : '产品信息查询',
			// 		id : 'product.product_Query_Data',
			// 		leaf : true
			// 	} ,
			// 	]
			// },
				{
				text : '项目管理',
				// expanded : true,
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
				// 	{
				// 	text : '项目楼栋信息查询',
				// 	id : 'project.management.buildinglist',
				// 	leaf : true
				// },
					{
					text : '导入设计清单',
					id : 'project.import_design_list',//project.import_planList
					leaf : true
					} ,
					{
						text : '设计清单撤销',
						id : 'project.project_check_designList',//
						leaf : true
					} ,
					// {
					// 	text : '项目匹配结果总览',
					// 	id : 'project.result.project_match_result',//project.import_planList
					// 	leaf : true
					// },
					{
						text : '项目匹配结果查询',
						id : 'project.result.designlist_match_result',//project.import_planList
						leaf : true
					},
					// {
					// 	text : '成品退库匹配结果查询',
					// 	id : 'project.Query_Backproduct_Match_Result',//project.import_planList
					// 	leaf : true
					// } ,
					// {
					// 	text : '预加工半成品匹配结果查询',
					// 	id : 'project.result.preProduct_material_match_result',//project.import_planList
					// 	leaf : true
					// } ,
					// {
					// 	text : '旧板匹配结果查询',
					// 	id : 'project.result.oldpanel_material_match_result',//project.import_planList
					// 	leaf : true
					// } ,
					// {
					// 	text : '原材料匹配结果查询',
					// 	id : 'project.result.newpanel_material_match_result',//project.import_planList
					// 	leaf : true
					// } ,

				// 	{
				// 		text : '生产材料单查询',
				// 		id : 'project.product_produce_list',//project.import_planList
				// 		leaf : true
				// 	} ,
				// 	{
				// 	text : '项目旧板材料清单',
				// 	id : 'project.oldpanel_material_list',
				// 	leaf : true
				// } , {
				// 	text : '项目新板材料清单',
				// 	id : 'project.newpanel_material_list',
				// 	leaf : true
				// } , {
				// 	text : '项目生产材料单',
				// 	id : 'project.project_plan_list',
				// 	leaf : true
				// },
					{
						text : '项目产品工单',
						id : 'project.project_worksheet',
						leaf : true
					},{
						text : '工单查询',
						id : 'project.project_query_worksheet',
						leaf : true

					},
					{
						text : '工单审核',
						id : 'project.project_check_worksheet',
						leaf : true

					},{
						text : '项目创建领料单',
						id : 'project.project_create_picklist',
						leaf : true
					},
					{
						text : '原材料超领单',
						id : 'project.material_over_pick',
						leaf : true
					},
					{
						text : '项目领料单查询',
						id : 'project.project_query_picklist',
						leaf : true
					},
					{
						text : '项目原材料超领单查询',
						id : 'project.project_query_overpicklist',
						leaf : true
					},
					// {
					// 	text : '项目确认领料',
					// 	id : 'project.project_material_picklist',
					// 	leaf : true
					// },
					{
						text : '项目进度查询',
						id : 'project.management.project_process_status',//project.import_planList
						leaf : true
					},
					{
						text : '项目创建退料单',
						id : 'project.project_create_backlist',
						leaf : true
					},
					{
						text : '项目退料单查询',
						id : 'project.project_query_backlist',
						leaf : true
					},
				]
			},
			// 	{
			// 	text : '财务管理',
			// 	expanded : true,
			// 	children : [ {
			// 		text : '成本查询',
			// 		id : 'finance.Query_cost',
			// 		leaf : true
			// 	} , {
			// 		text : '成本统计',
			// 		id : 'finance.statistics_cost',
			// 		leaf : true
			// 	} ,
			// 	]
			// },
				{
				text : '基础信息管理',
				expanded : true,
				children : [
					{
					text : '原材料种类管理',
					//leaf : true
					// expanded : true,
					children : [
						{
							text : '原材料类型',
							id : 'material.add_Mtype_baseInfo',
							leaf : true
						},{
						text : '添加原材料基础信息',
						id : 'material.add_Mcatergory_baseInfo',
						leaf : true
					},{
						text : '查看原材料基础信息',
						id : 'material.query_Mcatergory_baseInfo',
						leaf : true
					},
					// 	{
					// 	text : '添加原材料基础信息',
					// 	id : 'material.material_Basic_Info_Input',
					// 	leaf : true
					// },
						{

						text : '添加新板匹配规则',
						id : 'material.add_material_rules',

						leaf : true
					},
						{

							text : '查询修改新板匹配规则',
							id : 'material.query_Newpanel_Rules',

							leaf : true
						},
					]
				} , {
					text : '旧版种类管理',
					//leaf : true
					// expanded : true,
					children : [
						// {
						// 	text : '添加新的类型',
						// 	id : 'oldpanel.add_Ocatergory_baseInfo',
						// 	leaf : true
						// },
						{
							text : '旧板类型',
							id : 'oldpanel.add_Otype_baseInfo',
							leaf : true
						},
						{
							text : '查看旧板类型',
							id : 'oldpanel.query_Otype_baseInfo',
							leaf : true
						},
						{
							text : '添加旧板基础信息',
							id : 'oldpanel.oldpanel_Basic_Info_Input',
							leaf : true
						},
						{
							text : '查看旧版基础信息',
							id : 'oldpanel.query_Ocatergory_baseInfo',
							leaf : true
						},
						{
							text : '添加旧板匹配规则',
							id : 'oldpanel.add_oldpanel_rules',
							leaf : true
						},
						{
							text : '添加旧板格式',
							id : 'oldpanel.oldpanel_Format_Input',
							leaf : true
						},

					]
				} , {
					text : '产品种类管理',
					//leaf : true
					// expanded : true,
					children : [
						// {
						// 	text : '添加新的类型',
						// 	id : 'product.add_Pcatergory_baseInfo',
						// 	leaf : true
						// },
						{
							text : '产品类型',
							id : 'product.add_Ptype_baseInfo',
							leaf : true
						},
						{
							text : '查询产品类型',
							id : 'product.query_Ptype_baseInfo',
							leaf : true
						},
						{
							text : '添加产品基础信息',
							id : 'product.product_Basic_Info_Input',
							leaf : true
						},
						{
						text : '查看产品基础信息',
						id : 'product.query_Pcatergory_baseInfo',//
						leaf : true
					},{
						text : '添加产品格式',
						id : 'product.product_Format_Input',
						leaf : true
					},
					// {
					// 	text: 'scscscscscscscsc',
					// 	id :'product.product_Basic_Info_Input_2',
					// 	leaf : true
					// }
					]
				},{
					//
					text : '部门职员管理',
					// expanded : true,
					children : [ {
						text : '职员信息',
						id : 'userManagement.department_worker',
						leaf : true
					}
						// , {
						// 	text : '成本统计',
						// 	id : 'finance.statistics_cost',
						// 	leaf : true
						// } ,
						]
				}
				]
			}
			]
		}
	}
})