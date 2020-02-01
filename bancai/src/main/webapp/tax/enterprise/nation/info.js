Ext.define('tax.enterprise.nation.info', {
			extend : 'Ext.form.Panel',
			title : '国税企业信息展示',
			margin : '0 0 20 0',
			xtype : 'equiform',
			minHeight : 550,
			maxHeight: 550,
			id : '国税企业信息展示',
			bodyCls : 'mytable',
			layout : {
				type : 'table',
				columns : 4
			},
			defaults : {
				xtype : 'displayfield'
			},
			items : [

			{
						xtype : 'label',
						text : '纳税人名称',
						tdAttrs : {
							style : "width:280px;"
						},
						cellCls : 'thead'
					}, {
						id : '纳税人名称_nation'
					}, {
						xtype : 'label',
						text : '社会信用代码（纳税人识别号）',
						tdAttrs : {
							style : "width:280px;"
						},
						cellCls : 'thead'
					}, {
						id : '社会信用代码（纳税人识别号）_nation'
					}, {
						xtype : 'label',
						text : '法定代表人姓名',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人姓名_nation'
					}, {
						xtype : 'label',
						text : '法定代表人身份证号码',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人身份证号码_nation'
					},
					/* 表格第三行 */
					{
						xtype : 'label',
						text : '法定代表人身份证件类型',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人身份证件类型_nation'
					}, {
						xtype : 'label',
						text : '法定代表人固定电话',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人固定电话_nation'
					}, {
						xtype : 'label',
						text : '法定代表人移动电话',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人移动电话_nation'
					}, {
						xtype : 'label',
						text : '纳税人状态',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '纳税人状态_nation'
					},
					/* 表格第四行 */
					{
						xtype : 'label',
						text : '课征主体登记类型',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '课征主体登记类型_nation'
					}, {
						xtype : 'label',
						text : '登记注册类型',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '登记注册类型_nation'
					}, {
						xtype : 'label',
						text : '组织机构代码',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '组织机构代码_nation'
					}, {
						xtype : 'label',
						text : '国地管户类型',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '国地管户类型_nation'
					},
					/* 表格第五行 */
					{
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '单位隶属关系',
						cellCls : 'thead'
					}, {
						id : '单位隶属关系_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '批准设立机关',
						cellCls : 'thead'
					}, {
						id : '批准设立机关_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '证照名称',
						cellCls : 'thead'
					}, {
						id : '证照名称_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '证照编号',
						cellCls : 'thead'
					}, {
						id : '证照编号_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '开业设立日期',
						cellCls : 'thead'
					}, {
						id : '开业设立日期_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '从业人数',
						cellCls : 'thead'
					}, {
						id : '从业人数_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '组织机构类型',
						cellCls : 'thead'
					}, {
						id : '组织机构类型_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '经营范围',
						cellCls : 'thead'
					}, {
						id : '经营范围_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '行业',
						cellCls : 'thead'
					}, {
						id : '行业_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '登记日期',
						cellCls : 'thead'
					}, {
						id : '登记日期_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '主管税务所（科、分局）',
						cellCls : 'thead'
					}, {
						id : '主管税务所（科、分局）_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '街道乡镇',
						cellCls : 'thead'
					}, {
						id : '街道乡镇_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '国有控股类型',
						cellCls : 'thead'
					}, {
						id : '国有控股类型_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '国有投资比例',
						cellCls : 'thead'
					}, {
						id : '国有投资比例_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '营改增纳税人类型',
						cellCls : 'thead'
					}, {
						id : '营改增纳税人类型_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '核算方式',
						cellCls : 'thead'
					}, {
						id : '核算方式_nation'
					},

					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'批准设立机关类型代码',cellCls:
					// 'thead' },{id:'批准设立机关类型代码'},
					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'办证方式',cellCls:
					// 'thead' },{id:'办证方式'},
					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'开业设立日期',cellCls:
					// 'thead' },{id:'开业设立日期'},
					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'跨区房产税主体登记标志',cellCls:
					// 'thead' },{id:'跨区房产税主体登记标志'},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '非居民企业标志',
						cellCls : 'thead'
					}, {
						id : '非居民企业标志_nation'
					},
					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'经营范围',cellCls:
					// 'thead' },{id:'经营范围'},
					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '跨区财产税主体登记标志',
						cellCls : 'thead'
					}, {
						id : '跨区财产税主体登记标志_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册地址',
						cellCls : 'thead'
					}, {
						id : '注册地址_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册地联系电话',
						cellCls : 'thead'
					}, {
						id : '注册地联系电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '生产经营地址',
						cellCls : 'thead'
					}, {
						id : '生产经营地址_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '生产经营地联系电话',
						cellCls : 'thead'
					}, {
						id : '生产经营地联系电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人姓名',
						cellCls : 'thead'
					}, {
						id : '财务负责人姓名_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人身份证件号码',
						cellCls : 'thead'
					}, {
						id : '财务负责人身份证件号码_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人固定电话',
						cellCls : 'thead'
					}, {
						id : '财务负责人固定电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人移动电话',
						cellCls : 'thead'
					}, {
						id : '财务负责人移动电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人姓名',
						cellCls : 'thead'
					}, {
						id : '办税人姓名_nation'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人身份证件号码',
						cellCls : 'thead'
					}, {
						id : '办税人身份证件号码_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人固定电话',
						cellCls : 'thead'
					}, {
						id : '办税人固定电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人移动电话',
						cellCls : 'thead'
					}, {
						id : '办税人移动电话_nation'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '原纳税人识别号',
						cellCls : 'thead'
					}, {
						id : '原纳税人识别号_nation'
					},{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '评估机关',
						cellCls : 'thead'
					}, {
						id : '评估机关_nation'
					}
//					, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '固定工人数',
//						cellCls : 'thead'
//					}, {
//						id : '固定工人数'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '雇工人数',
//						cellCls : 'thead'
//					}, {
//						id : '雇工人数'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '合伙人数',
//						cellCls : 'thead'
//					}, {
//						id : '合伙人数'
//					},
//
//					{
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '外籍从业人数',
//						cellCls : 'thead'
//					}, {
//						id : '外籍从业人数'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '从业人数',
//						cellCls : 'thead'
//					}, {
//						id : '从业人数'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '生产经营地联系电话',
//						cellCls : 'thead'
//					}, {
//						id : '生产经营地联系电话'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '生产经营地邮政编码',
//						cellCls : 'thead'
//					}, {
//						id : '生产经营地邮政编码'
//					},
//
//					{
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '注册地邮政编码',
//						cellCls : 'thead'
//					}, {
//						id : '注册地邮政编码'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '主管税务局代码',
//						cellCls : 'thead'
//					}, {
//						id : '主管税务局代码'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '注册地址',
//						cellCls : 'thead'
//					}, {
//						id : '注册地址'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '税务登记类型',
//						cellCls : 'thead'
//					}, {
//						id : '税务登记类型'
//					},
//
//					{
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '国地管户类型',
//						cellCls : 'thead'
//					}, {
//						id : '国地管户类型'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '生产经营地址',
//						cellCls : 'thead'
//					}, {
//						id : '生产经营地址'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '登记注册类型',
//						cellCls : 'thead'
//					}, {
//						id : '登记注册类型'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '单位隶属关系',
//						cellCls : 'thead'
//					}, {
//						id : '单位隶属关系'
//					},
//
//					{
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '税收管理员',
//						cellCls : 'thead'
//					}, {
//						id : '税收管理员'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '征收方式',
//						cellCls : 'thead'
//					}, {
//						id : '征收方式'
//					}, {
//						xtype : 'label',
//						tdAttrs : {
//							style : "width:90px;"
//						},
//						text : '组织机构代码',
//						cellCls : 'thead'
//					}, {
//						id : '组织机构代码'
//					},
//
//					{
//						xtype : 'label',
//						tdAttrs : {},
//						text : '经营范围',
//						cellCls : 'thead'
//					}, {
//						id : '经营范围',
//						renderer : function(value, meta, record) {
//							var max = 14; // 显示多少个字符
//							meta.tdAttr = 'data-qtip="' + value + '"';
//							return value.length < max ? value : value
//									.substring(0, max - 3)
//									+ '...';
//						},
//						listeners : {
//							render : function(p) {// 渲染后给el添加mouseover事件
//								p.getEl().on('mouseover', function(p) {
//									Ext.getCmp('企业信息展示').updateTip(Ext
//											.getCmp('经营范围'))
//								});
//							}
//						}
//
//					}
					],
			/**
			 * 
			 * @param {} field
			 * @param {} t
			 * 用于显示浮动窗口
			 */
			updateTip : function(field, t) {
				Ext.QuickTips.init();
				Ext.QuickTips.register({
							target : field.el,
							text : field.getValue()
						})
			}
		});
