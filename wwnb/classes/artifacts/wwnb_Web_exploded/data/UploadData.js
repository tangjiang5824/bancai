Ext.define('data.UploadData', {
	extend : 'Ext.panel.Panel',
	region : 'center',
	layout : "fit",
	title : '数据上传',
	requires : [ 'component.TableList', "component.YearList" ],
	reloadPage : function() {
		var p = Ext.getCmp('functionPanel');
		p.removeAll();
		cmp = Ext.create("data.UploadData");
		p.add(cmp);
	},
	clearGrid : function() {
		var msgGrid = Ext.getCmp("msgGrid");
		if (msgGrid != null || msgGrid != undefined)
			this.remove(msgGrid);
	},
	//表头
	showMsgGrid : function(fields, data, columns) {
		this.clearGrid();
		var msgGrid = Ext.create('Ext.grid.Panel', {
			id : "msgGrid",
			store : {
				fields : fields,
				data : data,
				proxy : {
					type : 'memory',
					reader : {
						type : 'json',
						rootProperty : 'value'
					}
				}
			},
			columns : columns
		});
		this.add(msgGrid);
	},
	//表通过tablename，uploadId查询数据
	showDataGrid : function(tableName, uploadId) {
		var me = this;
		var itemsPerPage = 50;
		this.clearGrid();
		Ext.Ajax.request({
			url : "system/dataTable/getColumnsAndFields.do",
			params : {
				tableName : tableName
			},
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				var store = Ext.create('Ext.data.Store', {
					pageSize : itemsPerPage,
					fields : obj.fields,
					proxy : {
						type : 'ajax',
						url : 'dataListByUploadId.do',
						extraParams : {
							tableName : tableName,
							id : uploadId
						},
						reader : {
							type : 'json',
							rootProperty : 'value',
							totalProperty : 'totalCount'
						}
					},
					autoLoad : true
				});
				var grid = Ext.create('Ext.grid.Panel', {
					title : '最新上传数据',
					autoScroll : true,
					viewConfig : {
						enableTextSelection : true
					},
					id : "msgGrid",
					store : store,
					columns : obj.columns,
					dockedItems : [ {
						xtype : 'pagingtoolbar',
						store : store,
						dock : 'bottom',
						displayInfo : true,
						displayMsg : '显示{0}-{1}条，共{2}条',
						emptyMsg : '无数据',
						beforePageText : '第',
						afterPageText : '页，共{0}页'
					} ]
				});
				me.add(grid);
			}
		});
	},
	createBatch : function() {
		var me = this;
		var tableName = Ext.getCmp("tableList").getValue();
		var year = Ext.getCmp("yearList").getValue();
		if (tableName != null && year != null) {
			Ext.Ajax.request({
				url : 'data/getNextBatch.do',
				params : {
					tableName : tableName,
					year : year
				},
				success : function(response) {
					var nextBatch = Ext.util.JSON.decode(response.responseText);
					var toolbar2 = Ext.getCmp("toolbar2");
					var toolbar3 = Ext.getCmp("toolbar3");
					toolbar2.setVisible(false);
					toolbar3.setVisible(false);
					me.clearGrid();
					if (nextBatch.batchNo != null) {
						toolbar2.setVisible(true);
						toolbar3.setVisible(true);
						var startTime = Ext.getCmp("startTime");
						var batchNo = Ext.getCmp("batchNo");
						var endTime = Ext.getCmp("endTime");
						batchNo.setValue(nextBatch.batchNo);
						batchNo.setDisabled(true);
						startTime.setValue(nextBatch.startTime);
						endTime.setValue(nextBatch.endTime);
						if (nextBatch.uploadCycle != 0) {
							startTime.setDisabled(true);
							endTime.setDisabled(true);
							Ext.Msg.alert('提示', '数据批次和所属期已经自动生成！<br>请注意核对：上传数据的批次和所属期必须与生成的相同！<br>若当期无数据，请点“当期无数据”。');

						} else {
							startTime.setDisabled(false);
							endTime.setDisabled(false);
							Ext.Msg.alert('提示', '数据批次和所属期已经自动生成！<br>请注意核对：上传数据的批次必须与生成的相同，所属期可自行调整！');
						}

					} else {
						Ext.Msg.alert('提示', '所选年份的数据批次已上传完毕！');
					}
				}
			})
		}
	},
	initComponent : function() {
		var me = this;
		var tableList = Ext.create('component.TableList', {
			id : "tableList",
			listeners : {
				change : function(combo, newValue, oldValue, eOpts) {
					me.createBatch();
				}
			}
		});
		var yearList = Ext.create('component.YearList', {
			id : "yearList",
			listeners : {
				change : function(combo, newValue, oldValue, eOpts) {
					me.createBatch();
				}
			}
		});
		var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			items : [ tableList, yearList, {
				xtype : 'button',
				text : '下载模板',
				handler : function() {
					var tableName = tableList.getValue();
					if (tableName != null) {
						if(tableName=='统计局涉税信息表一（生产总值）'){
							window.location.href = encodeURI('excel/统计局涉税信息表一_生产总值.xls');
						}else if(tableName=='统计局涉税信息表二（工业增加值）'){
							window.location.href = encodeURI('excel/统计局涉税信息表二_工业增加值.xls');
						}else if(tableName=='统计局涉税信息表三（交通）'){
							window.location.href = encodeURI('excel/统计局涉税信息表三_交通.xls');
						}else if(tableName=='统计局涉税信息表四（投资）'){
							window.location.href = encodeURI('excel/统计局涉税信息表四_投资.xls');
						}else if(tableName=='统计局涉税信息表五（房地产）'){
							window.location.href = encodeURI('excel/统计局涉税信息表五_房地产.xls');
						}else if(tableName=='统计局涉税信息表六（社零）'){
							window.location.href = encodeURI('excel/统计局涉税信息表六_社零.xls');
						}else if(tableName=='统计局涉税信息表七（人民生活物价）'){
							window.location.href = encodeURI('excel/统计局涉税信息表七_人民生活物价.xls');
						}else if(tableName=='统计局涉税信息表八（工业总产值）'){
							window.location.href = encodeURI('excel/统计局涉税信息表八_工业总产值.xls');
						}else{
							window.location.href = encodeURI('data/downloadExcelTemplate.do?tableName=' + tableName);
						}
//						if(tableName=='统计局涉税信息表一（生产总值）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表一_生产总值.xls');
//						}else if(tableName=='统计局涉税信息表二（工业总产值）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表二_工业总产值.xls');
//						}else if(tableName=='统计局涉税信息表三（工业产品）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表三_工业产品.xls');
//						}else if(tableName=='统计局涉税信息表四（交通）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表四_交通.xls');
//						}else if(tableName=='统计局涉税信息表五（投资）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表五_投资.xls');
//						}else if(tableName=='统计局涉税信息表六（房地产）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表六_房地产.xls');
//						}else if(tableName=='统计局涉税信息表七（社零）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表七_社零.xls');
//						}else if(tableName=='统计局涉税信息表八（人民生活物价）'){
//							window.location.href = encodeURI('excel/统计局涉税信息表八_人民生活物价.xls');
//						}else{
//							window.location.href = encodeURI('data/downloadExcelTemplate.do?tableName=' + tableName);
//						}
					} else {
						Ext.Msg.alert('消息', '请选择数据类型！');
					}
				}
			} ]
		});
		var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			hidden : true,
			id : "toolbar2",
			items : [ {
				xtype : 'textfield',
				id : 'batchNo',
				name : 'batchNo',
				width : 120,
				labelWidth : 60,
				editable : false,
				fieldLabel : '上传批次'
			}, {
				xtype : 'monthfield',
				margin : '0 10 0 0',
				fieldLabel : '所属期始',
				width : 180,
				labelWidth : 60,
				id : "startTime",
				name : 'startTime',
				format : 'Y-m',
				editable : false,
				value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -1), "Y-m")
			}, {
				xtype : 'monthfield',
				margin : '0 10 0 0',
				fieldLabel : '所属期止',
				width : 180,
				labelWidth : 60,
				id : "endTime",
				name : 'endTime',
				format : 'Y-m',
				editable : false,
				value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -1), "Y-m")
			} ]
		});
		var form = Ext.create("Ext.form.Panel", {
			border : false,
			items : [ {
				xtype : 'filefield',
				width : 400,
				margin: '1 0 0 0',
				buttonText : '上传数据文件',
				name : 'uploadFile',
				//id : 'uploadFile',
				listeners : {
					change : function(file, value, eOpts) {
						if (value.indexOf('.xls',value.length-4)==-1) {
							Ext.Msg.alert('错误', '文件格式错误，请重新选择xls格式的文件！')
						} else {
							Ext.Msg.show({
								title : '操作确认',
								message : '将上传数据，选择“是”否确认？',
								buttons : Ext.Msg.YESNO,
								icon : Ext.Msg.QUESTION,
								fn : function(btn) {
									if (btn === 'yes') {
										var batchNo = Ext.getCmp("batchNo").getValue();
										var startTime = Ext.util.Format.date(Ext.getCmp("startTime").getValue(), "Y-m");
										var endTime = Ext.util.Format.date(Ext.getCmp("endTime").getValue(), "Y-m");
										var curTime = Ext.util.Format.date(new Date(), "Y-m");
										var tableName = Ext.getCmp("tableList").getValue();
										var year = Ext.getCmp("yearList").getValue();
										var check=Ext.getCmp("check").getValue();
										console.log(curTime.replace("-",""));
										console.log(endTime.replace("-",""));
										
										if(curTime.replace("-","")>endTime.replace("-","")){
										form.submit({
											url : 'data/uploadData.do',
											waitMsg : '正在上传...',
											params : {
												tableName : tableName,
												year : year,
												batchNo : batchNo,
												startTime : startTime,
												endTime : endTime,
												check:check
											},
											success : function(form, action) {
												var response = action.result;
												Ext.MessageBox.alert("提示", "上传成功!");
												var toolbar2 = Ext.getCmp("toolbar2");
												var toolbar3 = Ext.getCmp("toolbar3");
												toolbar2.setVisible(false);
												toolbar3.setVisible(false);
												me.showDataGrid(tableName, response.uploadId);
											},
											failure : function(form, action) {
												var response = action.result;
												switch (response.errorCode) {
												case 0:
													Ext.MessageBox.alert("错误", "上传批次或者所属期错误，重新生成上传批次和所属期!");
													break;
												case 1:
													Ext.MessageBox.alert("错误", "上传文件中的批次与生成的上传批次不同，请检查上传文件!");
													me.showMsgGrid([ "name", "input", "expected" ], response.value, [ {
														text : "错误字段",
														dataIndex : "name",
														width : 100
													}, {
														text : "上传文件中的值",
														dataIndex : "input",
														width : 200
													}, {
														text : "期望值",
														dataIndex : "expected",
														width : 100
													} ]);
													break;
												case 2:
													Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
													me.showMsgGrid([ "name", "value" ], response.value, [ {
														text : "错误描述",
														dataIndex : "name",
														width : 250
													}, {
														text : "错误字段",
														dataIndex : "value",
														width : 400
													} ]);
													break;
												case 3:
													Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
													me.showMsgGrid([ "row", "col", "value", "type" ], response.value, [ {
														text : "出错行",
														dataIndex : "row",
														width : 100
													}, {
														text : "出错列",
														dataIndex : "col",
														width : 250
													}, {
														text : "出错值",
														dataIndex : "value",
														width : 250
													}, {
														text : "期望类型",
														dataIndex : "type",
														width : 250
													} ]);
													break;
												case 1000:
													Ext.MessageBox.alert("错误", "上传文件出现未知错误，请检查上传文件格式！<br>若无法解决问题，请联系管理员！");
													Ext.MessageBox.alert("错误原因", response.msg);
													break;
												default:
													Ext.MessageBox.alert("错误", "服务器异常，请检查网络连接，或者联系管理员");
												}

											}
										});
										}
										else{
											Ext.MessageBox.alert("错误", "上传批次提前，请检查上传文件具体批次！");
										}
									}
								}
							});
						}
					}
				}
			} ]
		})
		var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
			dock : "top",
			hidden : true,
			id : "toolbar3",
			items : [  {
				xtype : 'checkboxfield',
				boxLabel : '校验数据',
				name : 'check',
				checked   : true,
				id : 'check'
			}, form,{
				xtype : 'button',
				text : '当期无数据',
				margin: '0 0 0 5',
				handler : function() {
					Ext.Msg.show({
						title : '操作确认',
						message : '选择“是”将确认当期无数据，是否确认？',
						buttons : Ext.Msg.YESNO,
						icon : Ext.Msg.QUESTION,
						fn : function(btn) {
							if (btn === 'yes') {
								var batchNo = Ext.getCmp("batchNo").getValue();
								var startTime = Ext.util.Format.date(Ext.getCmp("startTime").getValue(), "Y-m");
								var endTime = Ext.util.Format.date(Ext.getCmp("endTime").getValue(), "Y-m");
								var tableName = Ext.getCmp("tableList").getValue();
								var year = Ext.getCmp("yearList").getValue();
								Ext.Ajax.request({
									url : 'data/setNoData.do',
									params : {
										tableName : tableName,
										year : year,
										batchNo : batchNo,
										startTime : startTime,
										endTime : endTime
									},
									success : function(response) {
										var ret = Ext.util.JSON.decode(response.responseText);
										if (ret) {
											Ext.MessageBox.alert("提示", "操作成功，当期无数据！");
											me.reloadPage();
										}
									},
									failure : function(response) {
										Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
									}
								});
							}
						}
					});

				}
			} ]
		})
		this.dockedItems = [ toolbar1, toolbar2, toolbar3 ];
		// this.items = [ me.grid ];
		this.callParent(arguments);

	}

})