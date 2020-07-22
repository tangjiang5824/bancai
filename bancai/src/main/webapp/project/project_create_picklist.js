Ext.define('project.project_create_picklist',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    // title: '创建领料单',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

        //项目名称选择
        var tableListStore = Ext.create('Ext.data.Store',{
            fields : [ "项目名称","id"],
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
        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : '35%',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
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
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : true,
                        listeners:{
                            load:function () {
                                Ext.getCmp('buildingName').setValue("");
                            }
                        }
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);
                }
            }
        });
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 10 0 40',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
        });

        var buildingPositionStore = Ext.create('Ext.data.Store',{
            fields : [ 'buildingPosition'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=building_position',

                reader : {
                    type : 'json',
                    rootProperty: 'building_position',
                }
            },
            autoLoad : true
        });

        var buildingPositionList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '清单位置',
            labelWidth : 60,
            width : 200,
            id :  'positionName',
            name : 'positionName',
            matchFieldWidth: true,
            margin: '0 10 0 40',
            // emptyText : "--请选择项目--",
            displayField: 'positionName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: buildingPositionStore,
        });



        //查询的工单数据存放位置---上界面
        var worksheetListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'order/queryWorkOrderLog.do',   //order/queryWorkOrder.do
                reader : {
                    type : 'json',
                    rootProperty: 'workOrderLogList',
                },
                // params:{
                //     start: 0,
                //     limit: itemsPerPage
                // },

            },
            autoLoad : false,
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        projectId:Ext.getCmp("projectName").getValue(),
                        buildingId:Ext.getCmp("buildingName").getValue(),
                        buildingpositionId:Ext.getCmp("positionName")
                    });
                }
            }
        });

        var MaterialList2=Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount'],
        });


        //确认入库按钮，
        // var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
        //     dock : "bottom",
        //     id : "toolbar3",
        //     //style:{float:'center',},
        //     //margin-right: '2px',
        //     //padding: '0 0 0 750',
        //     style:{
        //         //marginLeft: '900px'
        //         layout: 'right'
        //     },
        //     items : [{
        //         xtype : 'button',
        //         iconAlign : 'center',
        //         iconCls : 'rukuicon ',
        //         text : '确认领料',
        //         region:'center',
        //         bodyStyle: 'background:#fff;',
        //         handler : function() {
        //
        //             // 取出grid的字段名字段类型pickingcreate_Grid
        //             console.log('===========')
        //             console.log(materialList)
        //             var select = Ext.getCmp('worksheet_Grid').getStore()
        //                 .getData();
        //             var s = new Array();
        //             select.each(function(rec) {
        //                 s.push(JSON.stringify(rec.data));
        //             });
        //             //获取数据
        //             Ext.Ajax.request({
        //                 url : 'material/updateprojectmateriallist.do', //原材料入库
        //                 method:'POST',
        //                 //submitEmptyText : false,
        //                 params : {
        //                     s : "[" + s + "]",//存储选择领料的数量
        //                     materialList : "[" + materialList + "]",
        //                 },
        //                 success : function(response) {
        //                     //var message =Ext.decode(response.responseText).showmessage;
        //                     Ext.MessageBox.alert("提示","领取成功" );
        //                     //刷新页面
        //                     MaterialList.reload();
        //
        //                 },
        //                 failure : function(response) {
        //                     //var message =Ext.decode(response.responseText).showmessage;
        //                     Ext.MessageBox.alert("提示","领取失败" );
        //                 }
        //             });
        //
        //         }
        //     }]
        // });

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                buildingName,
                buildingPositionList,
                {
                    xtype : 'button',
                    text: '项目工单查询',
                    width: 100,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        worksheetListStore.load({
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
                                buildingpositionId:Ext.getCmp("positionName").getValue(),
                            }
                        });
                    }
                }]
        });


        var worksheet_Grid=Ext.create('Ext.grid.Panel',{
            title: '工单查询',
            id : 'worksheet_Grid',
            store:worksheetListStore,
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'projectName',
                    text:'项目名',
                    flex :1
                },
                {
                    dataIndex:'buildingName',
                    text:'楼栋名',
                    flex :1
                },
                {
                    dataIndex:'positionName',
                    text:'清单位置',
                    flex :1
                },
                {
                    dataIndex:'worksheetName',
                    text:'工单名称',
                    flex :1
                },
                {
                    dataIndex:'operator',
                    text:'创建人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },
            ],
            flex:1,
            // height:'100%',
            tbar: toolbar,
            selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // dockedItems: [
            //     {
            //     xtype: 'pagingtoolbar',
            //     store: MaterialList,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // },
            //     toolbar3
            // ],
            listeners: {


                //双击表行响应事件
                // itemdblclick: function(me, record, item, index,rowModel){
                //     var select = record.data;
                //     //类型名
                //     var materialName = select.materialName;
                //     //该类型领取的数量
                //     //var pickNum= select.countTemp;
                //     var pickNum = select.countNotReceived;
                //     console.log(select.countNotReceived)
                //
                //     console.log(index+1)
                //     //var pickNumber = select.
                //     var specificMaterialList = Ext.create('Ext.data.Store',{
                //         //id,materialName,length,width,materialType,number
                //         fields:['materialName','length','materialType','width','specification','number'],
                //         proxy : {
                //             type : 'ajax',
                //             url : 'material/materiallsitbyname.do?materialName='+materialName,//获取同类型的原材料  +'&pickNum='+pickNum
                //             reader : {
                //                 type : 'json',
                //                 rootProperty: 'materialstoreList',
                //             },
                //         },
                //         autoLoad : true
                //     });
                //
                //     Ext.getCmp("toolbar5").items.items[1].setText(pickNum);//修改id为win_num的值，动态显示在窗口中
                //     //传rowNum响应的行号:index+1
                //     Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                //     specific_data_grid.setStore(specificMaterialList);
                //     Ext.getCmp('win_showmaterialData').show();
                // }

            }

        });

        var toobar_right = Ext.create('Ext.toolbar.Toolbar',{
            items: [

                {
                    xtype: 'textfield',
                    margin : '0 30 0 0',
                    fieldLabel: '创建人',
                    id :'pickName',
                    width: 200,
                    labelWidth: 50,
                    name: 'pickName',
                    value:"",
                },
                {
                    xtype: 'datefield',
                    margin : '0 30 0 0',
                    fieldLabel: '创建时间',
                    id :'pickTime',
                    width: 200,
                    labelWidth: 60,
                    name: 'pickTime',
                    format : 'Y-m-d',
                    editable : false,
                    // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    margin : '0 0 0 30',
                    text : '创建领料单',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型pickingcreate_Grid
                        console.log('1===========')
                        var select = Ext.getCmp('pickingcreate_Grid').getStore()
                            .getData();

                        // console.log(select)


                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        console.log(s)
                        console.log('2===========')
                        //获取数据
                        Ext.Ajax.request({
                            url : 'material/materialreceivelist', //原材料入库
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                pickName:Ext.getCmp('pickName').getValue(),
                                pickTime:Ext.getCmp('pickTime').getValue(),
                                s : "[" + s + "]",//存储选择领料的数量
                                // materialList : "[" + materialList + "]",
                            },
                            success : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","领取成功" );
                                //刷新页面
                                worksheetListStore.reload();

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","领取失败" );
                            }
                        });

                        // 重新加载页面，该项目的领料单信息
                        worksheetListStore.load({
                            params : {
                                proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
                            }
                        });
                        //  右边输入框重置

                        //  右边页面重置
                        Ext.getCmp('pickName').setValue("");
                        MaterialList2.removeAll();
                    }
                }

            ]
        })
        var pickingcreate_Grid=Ext.create('Ext.grid.Panel',{
            title: '领料单创建',
            id : 'pickingcreate_Grid',
            store:MaterialList2,
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'worksheetName',
                    text:'工单名称',
                    flex :1
                },
                // {
                //     dataIndex:'countTemp',//countTemp
                //     text:'领取数量',
                //     flex :1
                //     //editor:{xtype : 'textfield', allowBlank : true},
                // }
            ],
            // height:'100%',
            flex:1,
            tbar:toobar_right,
            selType:'checkboxmodel'
        });


        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            height:800,
            items:[
                worksheet_Grid,
                {
                    xtype:'container',
                    // flex:0.3,
                    items:[{
                        xtype:'button',
                        // margin: '0 0 0 30',
                        text:'选择',
                        itemId:'move_right',
                        handler:function() {
                            var records = worksheet_Grid.getSelectionModel().getSelection();
                            console.log(records)
                            console.log("测试")
                            console.log(records[0])

                            for (i = 0; i < records.length; i++) {
                                console.log(records[i].data['countTemp'])
                                if(records[i].data['countTemp'] != 0){
                                    console.log("添加")
                                    MaterialList2.add(records[i]);
                                }
                            }
                            //若要领数量<领取数量，则不能直接remove，需要更改数量值

                        }
                    },{
                        xtype:'button',
                        text:'撤销',
                        itemId:'move_left',
                        handler:function(){
                            var records=pickingcreate_Grid.getSelectionModel().getSelection();
                            MaterialList2.remove(records);
                            worksheetListStore.add(records);
                        }
                    }]
                },
                pickingcreate_Grid
            ],
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            //store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },

        });

        // this.dockedItems = [toolbar,panel,{
        //     xtype: 'pagingtoolbar',
        //     // store: material_Query_Data_Store,   // same store GridPanel is using
        //     dock: 'bottom',
        //     displayInfo: true,
        //     displayMsg:'显示{0}-{1}条，共{2}条',
        //     emptyMsg:'无数据'
        // }
        // ];
        // this.dockedItems = [toolbar,panel,toolbar3];
        this.items = [panel];
        this.callParent(arguments);
    }
})