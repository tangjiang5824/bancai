Ext.define('finance.Query_cost', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '成本查询',
    initComponent : function() {
        var me = this;
        //定义表名
        var tableName="materialstore";
        var materialtype="0";
        var itemsPerPage = 50;


        var tableListStore1 = Ext.create('Ext.data.Store',{
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

        var tableList1 = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            width : 300,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: tableListStore1,
            listeners: {
                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
                            //url : 'project/findBuildingList.do?projectId='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	projectName:Ext.getCmp('projectName').getValue(),
                            // 	//buildingName:Ext.getCmp('buildingName').getValue(),
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : false
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);

                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedProjectName.do',
                    // 	params:{
                    // 		projectName:Ext.getCmp('projectName').getValue()
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })
                }
            }

        });


        // var tableListStore2 = Ext.create('Ext.data.Store',{
        // 	fields : [ 'buildingName'],
        // 	proxy : {
        // 		type : 'ajax',
        // 		url : 'project/findBuildingList.do',
        // 		params : {
        // 			projectName:Ext.getCmp('projectName').getValue(),
        // 			//buildingName:Ext.getCmp('buildingName').getValue(),
        // 		},
        // 		reader : {
        // 			type : 'json',
        // 			rootProperty: 'buildingList',
        // 		}
        // 	},
        // 	autoLoad : true
        // });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 60,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            //store: tableListStore2,
            listeners: {
                select:function () {

                    // // projectName:Ext.getCmp('projectName').getValue();
                    // // buildingName:Ext.getCmp('buildingName').getValue();
                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedBuildingName.do',
                    // 	params:{
                    // 		//projectName:Ext.getCmp('projectName').getValue(),
                    // 		buildingName:Ext.getCmp('buildingName').getValue(),
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })

                }
            }
        });



        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [tableList1,buildingName,
                {
                    xtype : 'button',
                    text: '成本查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        material_Statistics_Records_Store.load({
                            params : {
                                // userId : Ext.getCmp('userId').getValue(),
                                // endTime : Ext.getCmp('endTime').getValue(),
                                // startTime:Ext.getCmp('startTime').getValue(),
                                // projectName:Ext.getCmp('projectName').getValue(),
                            }
                        });
                    }
                },
            ]
        });

        var material_cost_Store = Ext.create('Ext.data.Store',{
            id: 'material_cost_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url : "",//"material/historyDataList.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    // start: 0,
                    // limit: itemsPerPage
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        // tableName :tableName,
                        // userId:Ext.getCmp('userId').getValue(),
                        // endTime:Ext.getCmp('endTime').getValue(),
                        // startTime:Ext.getCmp('startTime').getValue(),
                        // projectName:Ext.getCmp('projectName').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });


        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            store: material_cost_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            // store : {
            //     id: 'designlistStore',
            //     fields: ['产品编号', '产品名称','产品安装位置','是否由旧板生产']
            //
            // },
            columns : [
                {
                    dataIndex : 'materialName',
                    name : 'materialName',
                    text : '原材料名',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false
                    }
                },
                {
                    dataIndex : 'price',
                    name : 'price',
                    text : '单价',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                {
                    dataIndex : 'number',
                    name:'number',
                    text:'数量',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                // {
                //     dataIndex : '是否由旧板生产',
                //     text:'是否由旧板生产',
                //     name:'是否由旧板生产',
                //     //width : 110,
                //     editor : {// 文本字段
                //         xtype : 'textfield',
                //         allowBlank : false,
                //     }
                // },
            ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel',
            tbar: toolbar2,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: material_cost_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
        });


        //表格分组
        var myModel = Ext.define("studentInfo", {
            extend : "Ext.data.Model",
            fields : [ {
                name : "materialName",
                type : "string"
            }, {
                name : "price",
                type : "float"
            }, {
                name : "number",
                type : "float"
            }, {
                name : "chScore",
                type : "number"
            }, {
                name : "maScore",
                type : "number"
            }, {
                name : "enScore",
                type : "number"
            } ]
        });

        // 本地数据
        var myData = [ [ "No1", "Lisa", "1", 90, 90, 89 ], [ "No2", "Jack", "2", 91, 94, 100 ],
            [ "No3", "Nuna", "4", 92, 90, 90 ], [ "No4", "Selein", "4", 93, 65, 78 ], [ "No5", "Andy", "1", 78, 86, 89 ],
            [ "No6", "Nina", "2", 87, 90, 80 ], [ "No7", "Mofaid", "2", 85, 79, 89 ], [ "No8", "Holy", "4", 81, 90, 63 ],
            [ "No9", "Wooden", "1", 90, 92, 89 ], [ "No10", "Kasis", "1", 90, 90, 92 ] ];
        var myStore = Ext.create("Ext.data.Store", {
            model : "studentInfo",
            data : myData,
            groupField : "number"//以班级分组
        });

        // 表格
        var myGrid = new Ext.grid.Panel({
            columns : [ {
                text : "原材料名",
                dataIndex : "materialName"
            }, {
                text : "单价",
                dataIndex : "price",
                // renderer : function(value) {//设置列的样式
                //     return "<a href='http://www.baidu.com'>" + value + "</a>";
                // }
            }, {
                text : "数量",
                dataIndex : "number"
            }, {
                text : "语文",
                dataIndex : "chScore",
                summaryType : "sum"//总分
            }, {
                text : "数学",
                dataIndex : "maScore",
                summaryType : "average",//平均分
                summaryRenderer : function(value) {//设置结果格式
                    return Ext.util.Format.number(value, "0.00");
                }
            }, {
                text : "英语",
                dataIndex : "enScore",
                summaryType : "max"//最高分
            } ],
            store : myStore,
            features : [ {//定义表格特征
                ftype : "groupingsummary",
                hideGroupedHeader : true//隐藏当前分组的表头
            } ],
            tbar: toolbar2,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: material_cost_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
        });


        // this.dockedItems = [toolbar2,grid]; //
        this.items = [myGrid]; //dockedItems,,,,grid

        this.callParent(arguments);

    }

})




// Ext.define('finance.Query_cost',{
//     extend:'Ext.panel.Panel',
//     region: 'center',
//     layout:'fit',
//     title: '原材料出入库记录查询',
//     initComponent: function(){
//         var itemsPerPage = 50;
//         var tableName="material";
//         //var materialType="1";
//         //项目名称选择
//         var projectListStore = Ext.create('Ext.data.Store',{
//             fields : [ "项目名称","id"],
//             proxy : {
//                 type : 'ajax',
//                 url : 'project/findProjectList.do',
//
//                 reader : {
//                     type : 'json',
//                     rootProperty: 'projectList',
//                 }
//             },
//             autoLoad : true
//         });
//         var projectName = Ext.create('Ext.form.ComboBox',{
//             fieldLabel : '项目名',
//             labelWidth : 45,
//             width : 400,
//             id :  'projectName',
//             name : '项目名称',
//             matchFieldWidth: false,
//             emptyText : "--请选择--",
//             displayField: '项目名称',
//             valueField: 'id',
//             editable : false,
//             store: projectListStore,
//             listeners:{
//                 select: function(combo, record, index) {
//                     console.log(record[0].data.projectName);
//                 }
//             }
//
//         });
//
//         //操作类型
//         //操作类型选择
//         var optionTypeList = Ext.create('Ext.data.Store', {
//             fields: ['abbr', 'name'],
//             data : [
//                 {"abbr":"1", "name":"入库"},
//                 {"abbr":"0", "name":"出库"},
//                 //...
//             ]
//         });
//
//         var optionType = Ext.create('Ext.form.ComboBox', {
//             fieldLabel: '操作类型',
//             store: optionTypeList,
//             margin : '0 20 0 20',
//             width: 160,
//             labelWidth: 60,
//             queryMode: 'local',
//             displayField: 'name',
//             valueField: 'abbr',
//             renderTo: Ext.getBody()
//         });
//         var toobar = Ext.create('Ext.toolbar.Toolbar',{
//             dock: 'top',
//             items: [
//                 {
//                     xtype: 'textfield',
//                     margin : '0 20 0 20',
//                     fieldLabel: '操作员',
//                     id :'userId',
//                     width: 200,
//                     labelWidth: 50,
//                     name: 'userId',
//                     value:"",
//                 },projectName,
//                 optionType,
//                 {
//                     xtype : 'datefield',
//                     margin : '0 20 0 20',
//                     fieldLabel : '开始时间',
//                     width : 200,
//                     labelWidth : 60,
//                     id : "startTime",
//                     name : 'startTime',
//                     //align: 'right',
//                     format : 'Y-m-d',
//                     editable : false,
//                     //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
//                 },{
//                     xtype:'tbtext',
//                     text:'至',
//                     itemId:'move_left',
//                     // handler:function(){
//                     //     var records=grid2.getSelectionModel().getSelection();
//                     //     MaterialList2.remove(records);
//                     //     MaterialList.add(records);
//                     // }
//                 },
//                 {
//                     xtype : 'datefield',
//                     margin : '0 20 0 20',
//                     fieldLabel : '结束时间',
//                     width : 200,
//                     labelWidth : 60,
//                     id : "endTime",
//                     name : 'endTime',
//                     //align: 'right',
//                     format : 'Y-m-d',
//                     editable : false,
//                     //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
//                 },{
//                     xtype : 'button',
//                     text: '查询操作记录',
//                     width: 100,
//                     margin: '0 0 0 15',
//                     layout: 'right',
//                     handler: function(){
//                         material_Query_Records_Store.load({
//                             params : {
//                                 userId : Ext.getCmp('userId').getValue(),
//                                 endTime : Ext.getCmp('endTime').getValue(),
//                                 startTime:Ext.getCmp('startTime').getValue(),
//                                 projectName:Ext.getCmp('projectName').getValue(),
//                             }
//                         });
//                     }
//                 },
//
//                 // {
//                 //     text: '删除',
//                 //     width: 80,
//                 //     margin: '0 0 0 15',
//                 //     handler: function(){
//                 //         var select = grid.getSelectionModel().getSelection();
//                 //         if(select.length==0){
//                 //             Ext.Msg.alert('错误', '请选择要删除的记录')
//                 //         }
//                 //         else{
//                 //             Ext.Ajax.request({
//                 //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
//                 //                 params:{
//                 //                     tableName:tableName,
//                 //                     id:select[0].data.id
//                 //                 },
//                 //                 success:function (response) {
//                 //                     Ext.MessageBox.alert("提示","删除成功！")
//                 //                     grid.store.remove(grid.getSelectionModel().getSelection());
//                 //                 },
//                 //                 failure:function (reponse) {
//                 //                     Ext.MessageBox.alert("提示","删除失败！")
//                 //
//                 //                 }
//                 //             })
//                 //         }
//                 //     }
//                 // }
//                 ]
//         });
//
//         var material_Query_Records_Store = Ext.create('Ext.data.Store',{
//             id: 'material_Query_Records_Store',
//             autoLoad: true,
//             fields: [],
//             pageSize: itemsPerPage, // items per page
//             proxy:{
//                 url : "",//"material/historyDataList.do",
//                 type: 'ajax',
//                 reader:{
//                     type : 'json',
//                     rootProperty: 'value',
//                     totalProperty: 'totalCount'
//                 },
//                 params:{
//                     start: 0,
//                     limit: itemsPerPage
//                 }
//             },
//             listeners : {
//                 beforeload : function(store, operation, eOpts) {
//                     store.getProxy().setExtraParams({
//                         tableName :tableName,
//                         userId:Ext.getCmp('userId').getValue(),
//                         endTime:Ext.getCmp('endTime').getValue(),
//                         startTime:Ext.getCmp('startTime').getValue(),
//                         projectName:Ext.getCmp('projectName').getValue(),
//                         //materialType:materialType
//
//                     });
//                 }
//
//             }
//
//
//         });
//
//
//         var grid = Ext.create('Ext.grid.Panel',{
//             id: 'material_Query_Records_Main',
//             store: material_Query_Records_Store,
//             viewConfig : {
//                 enableTextSelection : true,
//                 editable:true
//             },
//             columns : [
//                 { text: '材料单编号', dataIndex: '材料单编号', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
//                 { text: '操作人员',  dataIndex: '操作人员' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
//                 { text: '上传时间', dataIndex: '上传时间', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
//                 { text: '项目名称', dataIndex: '项目名称',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
//                 {
//                     header: "操作", dataIndex: 'Gender',
//                     renderer: function() {                      //此处为主要代码
//                         var str = "<input type='button' value='查看' onclick='look()'>";
//                         return str;
//                     }
//                 },
//             ],
//             plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
//                 clicksToEdit : 3
//             })],
//             tbar:toobar,
//             dockedItems:[{
//                 xtype: 'pagingtoolbar',
//                 store: material_Query_Records_Store,   // same store GridPanel is using
//                 dock: 'bottom',
//                 displayInfo: true,
//                 displayMsg:'显示{0}-{1}条，共{2}条',
//                 emptyMsg:'无数据'
//             }],
//             listeners: {
//                 validateedit : function(editor, e) {
//                     var field=e.field
//                     var id=e.record.data.id
//                     Ext.Ajax.request({
//                         url:"",//"data/EditCellById.do",  //EditDataById.do
//                         params:{
//                             tableName:tableName,
//                             field:field,
//                             value:e.value,
//                             id:id
//                         },
//                         success:function (response) {
//                             //console.log(response.responseText);
//                         }
//                     })
//                     // console.log("value is "+e.value);
//                     // console.log(e.record.data["id"]);
//
//                 }
//             }
//         });
//
//         this.items = [grid];
//         // this.dockedItems = [toobar,toobar1,grid,{
//         //     xtype: 'pagingtoolbar',
//         //     store: material_Query_Records_Store,   // same store GridPanel is using
//         //     dock: 'bottom',
//         //     displayInfo: true,
//         //     displayMsg:'显示{0}-{1}条，共{2}条',
//         //     emptyMsg:'无数据'
//         // }];
//         this.callParent(arguments);
//     }
// })