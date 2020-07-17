Ext.define('project.project_worksheet',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目工单',

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
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }

        });

        var projectListStore = Ext.create('Ext.data.Store',{
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


        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,//'35%'
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners: {

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });

                },
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
            fieldLabel : '位置',
            labelWidth : 35,
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




        //查询的数据存放位置 左侧界面
        var MaterialList = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'material/materiallsitbyproject.do',
                reader : {
                    type : 'json',
                    rootProperty: 'materialList',
                }
            },
            autoLoad : false
        });

        var MaterialList2=Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount'],
        });

        var clms=[
            {
                dataIndex:'productName',
                text:'产品名',
                flex :1
            },
            {
                dataIndex:'madeBy',
                text:'基础板',
                flex :1
            },
            {
                dataIndex:'count',
                text:'数量',
                flex :1
            },
            {
                // name : '操作',
                text : '操作',
                renderer:function(value, cellmeta){
                    return "<INPUT type='button' value='生成工单' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                }
            }
        ];
        var clms1=[ {dataIndex:'materialName', text:'材料名',flex :1 },
                    {
                        dataIndex:'countTemp',//countTemp
                        text:'领取数量',
                        flex :1
                        //editor:{xtype : 'textfield', allowBlank : true},

                    }
                    // {dataIndex:'countNotReceived', text:'要领数量',flex :1
                    //     //editor:{xtype : 'textfield', allowBlank : false}
                    // },

                    ];


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
        //             // 取出grid的字段名字段类型pickingMaterialGrid
        //             console.log('===========')
        //             console.log(materialList)
        //             var select = Ext.getCmp('PickingListGrid').getStore()
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
            items: [projectList,
                buildingName,
                buildingPositionList,
                {
                    xtype : 'button',
                    text: '项目领料单查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        MaterialList.load({
                            params : {
                                proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
                            }
                        });
                    }
                }]
        });


        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'PickingListGrid',
            store:MaterialList,
            dock: 'bottom',
            columns:clms,
            flex:.7,
            // height:'100%',
            // tbar: toolbar,
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
                    margin : '0 10 0 0',
                    fieldLabel: '项目信息',
                    id :'projectInfo',
                    width: 200,
                    labelWidth: 60,
                    name: 'projectInfo',
                    value:"",
                    // border:'0 0 1 0',
                    fieldStyle:'background:none; border-right: #000000 0px solid;border-top:0px solid;border-left:0px solid;border-bottom:#000000 1px solid;'
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '工单号',
                    id :'workSheet_Num',
                    width: 200,
                    labelWidth: 50,
                    name: 'workSheet_Num',
                    value:"",
                    fieldStyle:'background:none; border-right: #000000 0px solid;border-top:0px solid;border-left:0px solid;border-bottom:#000000 1px solid;'
                },
                {
                    xtype: 'datefield',
                    margin : '0 10 0 0',
                    fieldLabel: '创建时间',
                    id :'createTime',
                    width: 200,
                    labelWidth: 60,
                    name: 'createTime',
                    value:"",
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

                        // 取出grid的字段名字段类型pickingMaterialGrid
                        console.log('1===========')
                        var select = Ext.getCmp('pickingMaterialGrid').getStore()
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
                                workSheet_Num:Ext.getCmp('workSheet_Num').getValue(),
                                createTime:Ext.getCmp('createTime').getValue(),
                                s : "[" + s + "]",//存储选择领料的数量
                                // materialList : "[" + materialList + "]",
                            },
                            success : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","领取成功" );
                                //刷新页面
                                MaterialList.reload();

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","领取失败" );
                            }
                        });

                    // 重新加载页面，该项目的领料单信息
                        MaterialList.load({
                            params : {
                                proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
                            }
                        });
                    //  右边输入框重置

                    //  右边页面重置
                        Ext.getCmp('workSheet_Num').setValue("");
                        MaterialList2.removeAll();
                    }
                }

                ]
        })
        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'pickingMaterialGrid',
            store:MaterialList2,
            dock: 'bottom',
            columns:clms1,
            // height:'100%',
            flex:1,
            tbar:toobar_right,
            selType:'checkboxmodel'
        });


        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:800,

            items:[grid1,
                {
                xtype:'container',
                // flex:0.3,
                items:[{
                    xtype:'button',
                    // margin: '0 0 0 30',
                    text:'选择',
                    itemId:'move_right',
                    handler:function() {
                        var records = grid1.getSelectionModel().getSelection();
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
                        var records=grid2.getSelectionModel().getSelection();
                        MaterialList2.remove(records);
                        MaterialList.add(records);
                    }
                }]
            },
                grid2
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


        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('PickingListGrid').columns[columnIndex-1].text;

            console.log("列名：",fieldName)
            if (fieldName == "生成工单") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('PickingListGrid').getSelectionModel();
                var materialArr = sm.getSelection();
                if (materialArr.length != 0) {
                    // Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认删除？", function (btn) {
                    //     if (btn == 'yes') {
                    //         //先删除后台再删除前台
                    //         //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                    //
                    //     } else {
                    //         return;
                    //     }
                    // });
                } else {
                    //Ext.Msg.confirm("提示", "无选中数据");
                    Ext.Msg.alert("提示", "无选中数据");
                }
            }
            console.log("rowIndex:",rowIndex)
            console.log("columnIndex:",columnIndex)
        }

        this.dockedItems = [toolbar,panel,{
            xtype: 'pagingtoolbar',
            // store: material_Query_Data_Store,   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            displayMsg:'显示{0}-{1}条，共{2}条',
            emptyMsg:'无数据'
        }
        ];
        // this.dockedItems = [toolbar,panel,toolbar3];
        // this.items = [grid1];
        this.callParent(arguments);
    }
})

