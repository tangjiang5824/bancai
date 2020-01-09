Ext.define('tax.enterprise.local.info', {
			extend : 'Ext.form.Panel',
			title : '地税企业信息展示',
			margin : '0 0 20 0',
			xtype : 'equiform',
			minHeight : 780,
			id : '地税企业信息展示',
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
						id : '纳税人名称_local'
					}, {
						xtype : 'label',
						text : '社会信用代码(纳税人识别号)',
						tdAttrs : {
							style : "width:280px;"
						},
						cellCls : 'thead'
					}, {
						id : '社会信用代码(纳税人识别号)_local'
					}, {
						xtype : 'label',
						text : '法定代表人（负责人、业主）姓名',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人（负责人、业主）姓名_local'
					}, {
						xtype : 'label',
						text : '法定代表人（负责人、业主）身份证件号码',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人（负责人、业主）身份证件号码_local'
					},
					/* 表格第三行 */
					{
						xtype : 'label',
						text : '法定代表人（负责人、业主）身份证件种类',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人（负责人、业主）身份证件种类_local'
					}, {
						xtype : 'label',
						text : '联系电话',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '联系电话_local'
					}, {
						xtype : 'label',
						text : '法定代表人（负责人、业主）电子信箱',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '法定代表人（负责人、业主）电子信箱_local'
					}, {
						xtype : 'label',
						text : '纳税人状态',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '纳税人状态_local'
					},
					/* 表格第四行 */
					{
						xtype : 'label',
						text : '行业门类',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '行业门类_local'
					}, {
						xtype : 'label',
						text : '行业大类',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '行业大类_local'
					}, {
						xtype : 'label',
						text : '行业中类',
						tdAttrs : {
							style : "width:80px;"
						},
						cellCls : 'thead'
					}, {
						id : '行业中类_local'
					}, {
						xtype : 'label',
						text : '行业小类',
						tdAttrs : {
							style : "width:90px;"
						},
						cellCls : 'thead'
					}, {
						id : '行业小类_local'
					},
					/* 表格第五行 */
					{
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '办税人身份证件号码',
						cellCls : 'thead'
					}, {
						id : '办税人身份证件号码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '办税人身份证件种类',
						cellCls : 'thead'
					}, {
						id : '办税人身份证件种类_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:80px;"
						},
						text : '主管税务所（科、分局）',
						cellCls : 'thead'
					}, {
						id : '主管税务所（科、分局）_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '一般纳税人标志',
						cellCls : 'thead'
					}, {
						id : '一般纳税人标志_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '是否购买发票',
						cellCls : 'thead'
					}, {
						id : '是否购买发票_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '功能区域',
						cellCls : 'thead'
					}, {
						id : '功能区域_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '登记序号',
						cellCls : 'thead'
					}, {
						id : '登记序号_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '单位性质',
						cellCls : 'thead'
					}, {
						id : '单位性质_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '国有控股类型',
						cellCls : 'thead'
					}, {
						id : '国有控股类型_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '会计制度（准则）',
						cellCls : 'thead'
					}, {
						id : '会计制度（准则）_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '批准证明或文件号',
						cellCls : 'thead'
					}, {
						id : '批准证明或文件号_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '批准设立机关名称',
						cellCls : 'thead'
					}, {
						id : '批准设立机关名称_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '批准设立机关类型代码',
						cellCls : 'thead'
					}, {
						id : '批准设立机关类型代码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办证方式',
						cellCls : 'thead'
					}, {
						id : '办证方式_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '开业设立日期',
						cellCls : 'thead'
					}, {
						id : '开业设立日期_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '跨区房产税主体登记标志',
						cellCls : 'thead'
					}, {
						id : '跨区房产税主体登记标志_local'
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
						text : '核算方式',
						cellCls : 'thead'
					}, {
						id : '核算方式_local'
					},
					// {xtype:'label',tdAttrs:{style:"width:90px;"},text:'经营范围',cellCls:
					// 'thead' },{id:'经营范围'},
					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '街道乡镇',
						cellCls : 'thead'
					}, {
						id : '街道乡镇_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '证照编号',
						cellCls : 'thead'
					}, {
						id : '证照编号_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '执照类型名称',
						cellCls : 'thead'
					}, {
						id : '执照类型名称_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '录入日期',
						cellCls : 'thead'
					}, {
						id : '录入日期_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '录入人',
						cellCls : 'thead'
					}, {
						id : '录入人_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '登记日期',
						cellCls : 'thead'
					}, {
						id : '登记日期_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '总分机构类型',
						cellCls : 'thead'
					}, {
						id : '总分机构类型_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '投资总额',
						cellCls : 'thead'
					}, {
						id : '投资总额_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册资本币种一',
						cellCls : 'thead'
					}, {
						id : '注册资本币种一_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册资本',
						cellCls : 'thead'
					}, {
						id : '注册资本_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人电话',
						cellCls : 'thead'
					}, {
						id : '财务负责人电话_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '财务负责人姓名',
						cellCls : 'thead'
					}, {
						id : '财务负责人姓名_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人电话号码',
						cellCls : 'thead'
					}, {
						id : '办税人电话号码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '办税人姓名',
						cellCls : 'thead'
					}, {
						id : '办税人姓名_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '类别代码',
						cellCls : 'thead'
					}, {
						id : '类别代码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '固定工人数',
						cellCls : 'thead'
					}, {
						id : '固定工人数_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '雇工人数',
						cellCls : 'thead'
					}, {
						id : '雇工人数_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '合伙人数',
						cellCls : 'thead'
					}, {
						id : '合伙人数_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '外籍从业人数',
						cellCls : 'thead'
					}, {
						id : '外籍从业人数_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '从业人数',
						cellCls : 'thead'
					}, {
						id : '从业人数_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '生产经营地联系电话',
						cellCls : 'thead'
					}, {
						id : '生产经营地联系电话_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '生产经营地邮政编码',
						cellCls : 'thead'
					}, {
						id : '生产经营地邮政编码_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册地邮政编码',
						cellCls : 'thead'
					}, {
						id : '注册地邮政编码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '主管税务局代码',
						cellCls : 'thead'
					}, {
						id : '主管税务局代码_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '注册地址',
						cellCls : 'thead'
					}, {
						id : '注册地址_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '税务登记类型',
						cellCls : 'thead'
					}, {
						id : '税务登记类型_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '国地管户类型',
						cellCls : 'thead'
					}, {
						id : '国地管户类型_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '生产经营地址',
						cellCls : 'thead'
					}, {
						id : '生产经营地址_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '登记注册类型',
						cellCls : 'thead'
					}, {
						id : '登记注册类型_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '单位隶属关系',
						cellCls : 'thead'
					}, {
						id : '单位隶属关系_local'
					},

					{
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '税收管理员',
						cellCls : 'thead'
					}, {
						id : '税收管理员_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '征收方式',
						cellCls : 'thead'
					}, {
						id : '征收方式_local'
					}, {
						xtype : 'label',
						tdAttrs : {
							style : "width:90px;"
						},
						text : '组织机构代码',
						cellCls : 'thead'
					}, {
						id : '组织机构代码_local'
					},

					{
						xtype : 'label',
						tdAttrs : {},
						text : '经营范围',
						cellCls : 'thead'
					}, {
						id : '经营范围_local',
						renderer : function(value, meta, record) {
							var max = 14; // 显示多少个字符
							meta.tdAttr = 'data-qtip="' + value + '"';
							return value.length < max ? value : value
									.substring(0, max - 3)
									+ '...';
						},
						listeners : {
							render : function(p) {// 渲染后给el添加mouseover事件
								p.getEl().on('mouseover', function(p) {
									Ext.getCmp('地税企业信息展示').updateTip(Ext
											.getCmp('经营范围_local'))
								});
							}
						}

					}],
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
