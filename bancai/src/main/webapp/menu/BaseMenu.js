Ext.define("menu.BaseMenu", {
			extend : "Ext.tree.Panel",
			width : 250,
			config : {
				roleId : undefined
			},
			collapsed : false,
			collapsible : true,
			rootVisible : false,
			region : "west",
			doLogout : function() {
				// 在子类重载
			},
			listeners : {
				itemclick : function(me, selected, eOpts) {
					var me = this;
					var data = me.getSelectionModel().selected.items[0];
					var cmp = null;
					var p = Ext.getCmp('functionPanel');
					if (data.id == 'logout') {
						Ext.Msg.show({
							title : '操作确认',
							message : '是否退出系统',
							buttons : Ext.Msg.YESNO,
							icon : Ext.Msg.QUESTION,
							fn : function(btn) {
								if (btn === 'yes') {
									Ext.Ajax.request({
										url : 'logout.do',
										success : function(response) {
											me.doLogout();
//											Ext.MessageBox.alert('消息', '已退出系统！',
//													function() {
//														me.doLogout();
//													})
										}
									});
								}
							}
						});
						
					} else {

						if (data.id.substr(0, 9) == 'tax.data.') {
							p.removeAll();
							Ext.syncRequire('tax.data.main');
							cmp = Ext.create('tax.data.main', {
										organizationId : data.id.substring(9),
										title : data.text
									});
							p.add(cmp);
						} else {
							if (data.id.substr(0, 14) == 'tax.checkdata.') {
								p.removeAll();
								Ext.syncRequire('tax.orgData.main');
								cmp = Ext.create('tax.orgData.main', {
											organizationId : data.id
													.substring(14),
											title : data.text
										});
								p.add(cmp);
							} else {
								p.removeAll();
								Ext.syncRequire(data.id);
								cmp = Ext.create(data.id);
								p.add(cmp);
							}
						}
					}

				}
			}
		});