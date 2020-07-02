Ext.define('project.management.buildinglist', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '项目楼栋查询',
    // reloadPage : function() {
    //     var p = Ext.getCmp('addDataGrid');
    //     p.removeAll();
    //     cmp = Ext.create("data.UploadDataTest");
    //     p.add(cmp);
    // },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        var project_Id;
        var table_name="building";
        //定义表名,计划清单
        // var tableName="planList";
        //var materialtype="0";


        //卡点名称
        // var nameStore = new Ext.data.Store({
        // 	proxy: new Ext.data.HttpProxy({
        // 		url: jt.webContextRoot+'productionOfEvidence/findZhanDianName.action' }),
        // 	reader: new Ext.data.JsonReader(
        // 		{ nameList: "" },        //后台获得的数据，传给前台的数据集合
        // 		["zhandianName"]         //json字符串的key
        // 	)
        // });
        // nameStore.load();
        // //下拉框
        // var zhandianName= new Ext.form.ComboBox({
        // 	fieldLabel: "站点名称",
        // 	name: 'zhandianName',
        // 	id: 'zhandianName',
        // 	displayField: 'zhandianName',   //显示的字段
        // 	triggerAction: 'all',
        // 	store: nameStore,
        // 	mode: 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
        // 	editable: false,
        // 	anchor: '100%',
        // });
        var tableListStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
            proxy : {
                type : 'ajax',
                url : 'project/findProjectList.do',

                reader : {
                    type : 'json',
                    rootProperty: 'projectList',
                }
            },
            autoLoad : true
        });

        //
        // var buidingStore = Ext.create('Ext.data.Store', {
        //     id: 'buidingStore',
        //     //autoLoad: true,
        //     fields: ['buildingNo','buildingName','buildingLeader']
        // });



        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            width : '35%',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'projectName',
            valueField: 'projectName',
            // typeAhead : true,
            editable : true,
            store: tableListStore,
            listeners:{
                // select: function(combo, record, index) {
                //     console.log(record[0].data.projectName);
                // }

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },

                //监听选中后响应的事件
                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();//获得选中的项目的id
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    project_Id=id;
                    Ext.Ajax.request({
                        url:"project/findProjectAndBuilding.do?projectId="+id,  //EditDataById.do
                        // params:{
                        //     tableName:tableName,
                        //     field:field,
                        //     value:e.value,
                        //     id:id
                        // },
                        success:function (response) {
                            //console.log(response.responseText);
                            var a= Ext.decode(response.responseText);
                            console.log('aaaaaazz');

                            //后端响应
                            var projectInfo = response.responseText//.//['project'];
                            var project_Buildingjson = JSON.parse(projectInfo);
                            var pro = (project_Buildingjson.project[0]);
                            var build = (project_Buildingjson.project[1]);
                            console.log(projectInfo.toString())

                            //动态修改值,项目信息
                            Ext.getCmp("planLeader").setValue(pro['planLeader'])//setText(pro['planLeader']);//计划负责人
                            Ext.getCmp("produceLeader").setValue(pro['produceLeader']);//生产负责人
                            Ext.getCmp("purchaseLeader").setValue(pro['purchaseLeader']);//采购负责人
                            Ext.getCmp("financeLeader").setValue(pro['financeLeader']);//财务负责人
                            Ext.getCmp("storeLeader").setValue(pro['storeLeader']);//仓库负责人
                            Ext.getCmp("startTime").setValue(pro['startTime']);//开始时间
                            Ext.getCmp("proEndTime").setValue(pro['proEndTime']);//开始时间
                            //动态修改值,楼栋信息
                            var buidingStore = Ext.create('Ext.data.Store',{
                                id: 'buidingStore',
                                fields: ['buildingNo','buildingName','buildingLeader'],
                                //pageSize: itemsPerPage, // items per page
                                //method:
                                proxy:{
                                    url : "project/findBuilding.do?projectId="+id,
                                    type: 'ajax',
                                    reader:{
                                        type : 'json',
                                        rootProperty: 'building',
                                        //totalProperty: 'totalCount'
                                    }
                                    // ,
                                    // params:{
                                    //     projectId:id,
                                    // }
                                },
                                autoLoad : true,
                            });
                            console.log(buidingStore);
                            Ext.getCmp('addDataGrid').setStore(buidingStore);



                            //Ext.getCmp('buidingStore').loadData(projectInfo);loadData
                            //buidingStore.loadData(projectInfo.toString());

                        }
                    });

                    // var buildingStoreTemp = Ext.create('Ext.data.Store', {
                    //     fields: ['buildingName'],
                    //     proxy: {
                    //         type: 'ajax',
                    //         //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                    //         url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=' + tableName + '&columnName=' + projectId + '&columnValue=' + id,//根据项目id查询对应的楼栋名
                    //         //url : 'project/findBuildingList.do?projectId='+id,//根据项目id查询对应的楼栋名
                    //         // params : {
                    //         // 	projectName:Ext.getCmp('projectName').getValue(),
                    //         // 	//buildingName:Ext.getCmp('buildingName').getValue(),
                    //         // },
                    //         reader: {
                    //             type: 'json',
                    //             rootProperty: 'building',
                    //         }
                    //     },
                    //     autoLoad: true
                    // });
                    //buildingName,下拉框重新加载数据
                    //动态修改值
                    //Ext.getCmp("toolbar5").items.items[1].setText(pickNum);
                }

            }

        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [

                    tableList,
                {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '开始时间',
                    width : 180,
                    labelWidth : 80,
                    id : "startTime",
                    name : 'startTime',
                    //align: 'right',
                    format : 'Y-m',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
                },  {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '预计结束时间',
                    width : 180,
                    labelWidth : 80,
                    id : "proEndTime",
                    name : 'proEndTime',
                    //align: 'right',
                    format : 'Y-m',
                    editable : false,
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '计划负责人',
                    id :'planLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'planLeader',
                    value:"",
                    //dataIndex:'planLeader'

                }]
        });
        var toobar_2 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '生产负责人',
                    id :'produceLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'produceLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '采购负责人',
                    id :'purchaseLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'purchaseLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '财务负责人',
                    id :'financeLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'financeLeader',
                    value:"",

                },{
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '仓库负责人',
                    id :'storeLeader',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeLeader',
                    value:"",

                }]
        });
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '增加楼栋',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{

                        '楼栋编号' : '',
                        '楼栋名' : '',
                        '楼栋负责人' : ''

                    }];
                    //Ext.getCmp('addDataGrid')返回定义的对象
                    Ext.getCmp('addDataGrid').getStore().loadData(data,
                        true);

                }

            },
            //     xtype : 'button',
            //     iconAlign : 'center',
            //     iconCls : 'rukuicon ',
            //     text : '添加字段名',
            //     // handler : function() {
            //     // 	//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
            //     // 	var data = [{
            //     // 		'品号' : '',
            //     // 		'长' : '',
            //     // 		'类型' : '',
            //     // 		'宽' : '',
            //     // 	}];
            //     // 	//Ext.getCmp('addDataGrid')返回定义的对象
            //     // 	Ext.getCmp('addDataGrid').getStore().loadData(data,
            //     // 		true);
            //     //
            //     // }
            //
            // },
                // 	{
                // 	xtype : 'button',
                // 	iconAlign : 'center',
                // 	iconCls : 'rukuicon ',
                // 	text : '保存',
                //
                // 	handler : function() {
                // 		// 取出grid的字段名字段类型
                // 		//var userid="<%=session.getAttribute('userid')%>";
                // 		var select = Ext.getCmp('addDataGrid').getStore()
                // 			.getData();
                // 		var s = new Array();
                // 		select.each(function(rec) {
                // 			//delete rec.data.id;
                // 			s.push(JSON.stringify(rec.data));
                // 			//alert(JSON.stringify(rec.data));//获得表格中的数据
                // 		});
                // 		//alert(s);//数组s存放表格中的数据，每条数据以json格式存放
                //
                // 		Ext.Ajax.request({
                // 			url : 'addData.do', //HandleDataController
                // 			method:'POST',
                // 			//submitEmptyText : false,
                // 			params : {
                // 				tableName:tableName,
                // 				materialType:materialtype,
                // 				s : "[" + s + "]",
                // 			},
                // 			success : function(response) {
                // 				Ext.MessageBox.alert("提示", "保存成功！");
                // 				me.close();
                //
                // 			},
                // 			failure : function(response) {
                // 				Ext.MessageBox.alert("提示", "保存失败！");
                // 			}
                // 		});
                //
                // 	}
                // }
            ]
        });
        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            dockedItems : [toolbar2],
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            //store : buidingStore,
            //     {
            //     id: 'buidingStore',
            //     fields: ['buildingNo','buildingName','buildingLeader']
            // },
            columns : [ {
                dataIndex : 'buildingNo',
                text : '楼栋编号',
                width : 150,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            }, {
                dataIndex : 'buildingName',
                text : '楼栋名',
                width : 150,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,

                }

            },{
                dataIndex : 'buildingLeader',
                text : '楼栋负责人',
                width : 150,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,
                }
            }
            ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            selType : 'rowmodel',
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    var flag=false;
                    if(id === "" || id ==null|| isNaN(id)){
                        flag=true;
                        id='0'
                    }

                    Ext.Ajax.request({
                        url:"data/BuildingEditCellById.do",  //EditDataById.do
                        params:{
                            tableName:table_name,
                            projectId:project_Id,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            if(flag){
                                e.record.data.id=response.responseText;
                            }

                        }
                    })
                }
            }
        });

        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [  {
                xtype: 'displayfield',
                margin : '0 10 0 0',
                fieldLabel: '楼栋信息',
                id :'planList',
                //labelWidth: 60,
            }]
        });

        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar3",
            //style:{float:'center',},
            //margin-right: '2px',
            //padding: '0 0 0 750',
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '创建',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var select = Ext.getCmp('addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                    });

                    //获取数据
                    var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');

                    Ext.Ajax.request({
                        url : 'generate_project.do', //createProject.do
                        method:'POST',
                        //submitEmptyText : false,

                        params : {
                            //tableName:tableName,
                            //materialType:materialtype,
                            startTime:sTime,
                            planLeader:Ext.getCmp('planLeader').getValue(),
                            produceLeader:Ext.getCmp('produceLeader').getValue(),
                            proEndTime:Ext.getCmp('proEndTime').getValue(),
                            purchaseLeader:Ext.getCmp('purchaseLeader').getValue(),
                            financeLeader:Ext.getCmp('financeLeader').getValue(),
                            storeLeader:Ext.getCmp('storeLeader').getValue(),
                            projectName:Ext.getCmp('projectName').getValue(),
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "创建成功！");
                            me.close();
                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "创建失败，重新输入楼栋信息");
                        }
                    });

                }
            }]
        });

        this.dockedItems = [toobar,toobar_2,toolbar2,grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

