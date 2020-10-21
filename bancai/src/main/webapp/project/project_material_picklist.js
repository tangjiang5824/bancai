Ext.define('project.project_material_picklist',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目确认领料单',
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

        //查询领料单
        var MaterialpickListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrder.do', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'requisitionOrderList',
                }
            },
            autoLoad : true
        });

        var pickList=Ext.create('Ext.data.Store',{
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
        //             // 取出grid的字段名字段类型pro_picking_MaterialGrid
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
            items: [tableList,
                {
                    xtype : 'button',
                    text: '项目领料单查询',
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
                        MaterialpickListStore.load({
                            params : {
                                projectId:Ext.getCmp('projectName').getValue(),
                                //projectId:'1',
                            }
                        });
                    }
                }]
        });


        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'PickingListGrid',
            store:MaterialpickListStore,
            dock: 'bottom',
            columns:[{
                dataIndex:'requisitionOrderId',
                text:'领料单号',
                flex :1
            },
                {
                    dataIndex:'workerName',
                    text:'负责人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    flex :1
                },
                // {
                //     dataIndex:'materialCount',
                //     text:'所需数量',
                //     flex :1
                // },
                // {
                //     dataIndex:'countReceived',
                //     text:'已领数量',
                //     flex :1
                // },
                // {
                //     dataIndex:'countNotReceived',
                //     text:'待领数量',
                //     //editor:{xtype : 'textfield', allowBlank : false}
                //     flex :1
                // },
                // {
                //     dataIndex:'countTemp',//countTemp
                //     text:'选择领取数量',
                //     id:'temp',
                //     flex :1,
                //     editor:{xtype : 'textfield', allowBlank : true},
                // }
                ],
            flex:1,
            // height:'100%',
            // tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                xtype: 'pagingtoolbar',
                store: MaterialpickListStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }
            ],
            listeners: {
                // 双击表行响应事件,显示领料单的具体信息
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data;

                    var requisitionOrderId = select.requisitionOrderId;
                    console.log(select)

                    console.log(index+1)
                    //var pickNumber = select.
                    var specificMaterialList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','materialType','width','specification','number'],
                        proxy : {
                            type : 'ajax',
                            url : 'order/queryRequisitionOrderDetail.do?requisitionOrderId='+requisitionOrderId,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'requisitionOrderDetailList',
                            },
                        },
                        autoLoad : true
                    });
                    // Ext.getCmp("toolbar5").items.items[1].setText(pickNum);//修改id为win_num的值，动态显示在窗口中
                    // //传rowNum响应的行号:index+1
                    // Ext.getCmp("toolbar5").items.items[2].setText(index+1)    dockedItems
                    grid_pickList_specific.setStore(specificMaterialList);
                    grid_pickList_specific.getDockedItems().setStore(specificMaterialList)
                }
            }

        });

        //职员信息
        var workerListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=department_worker',
                reader : {
                    type : 'json',
                    rootProperty: 'department_worker',
                },
            },
            autoLoad : true
        });


        var toobar_right = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '领料人',
                //     id :'pickName',
                //     width: 200,
                //     labelWidth: 50,
                //     name: 'pickName',
                //     value:"",
                // },
                {
                    fieldLabel : '领料人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 200,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype: 'datefield',
                    margin : '0 10 0 0',
                    fieldLabel: '领料时间',
                    id :'pickTime',
                    width: 200,
                    labelWidth: 60,
                    name: 'pickTime',
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
                    text : '领料',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型pro_picking_MaterialGrid
                        console.log('1===========')
                        var select = Ext.getCmp('pro_picking_MaterialGrid').getStore()
                            .getData();
                        // console.log(select)
                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });
                        console.log(s)
                        console.log('2===========')
                        var operator = Ext.getCmp('operator').getValue();
                        console.log('2===========',operator)
                        //判断条件：若无数据或者没有操作人员则报错，不能提交
                        if(s.length != 0 && operator != null ){
                            //获取数据
                            Ext.Ajax.request({
                                url : 'order/finishRequisitionOrder.do', //领料
                                method:'POST',
                                // submitEmptyText : false,
                                params : {
                                    operator:operator,
                                    s : "[" + s + "]",//存储选择领料的数量
                                },
                                success : function(response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    if(response == true){
                                        Ext.MessageBox.alert("提示","领取成功" );
                                    }else{
                                        Ext.MessageBox.alert("提示","领取失败" );
                                    }
                                },
                                failure : function(response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示","领取失败" );
                                }
                            });
                        }else {
                            Ext.MessageBox.alert("提示","没有数据或领料人！" );
                        }

                        //  左边输入框重置
                        grid_pickList_specific.getStore().removeAll();

                        //  右边页面重置
                        Ext.getCmp('operator').setValue("");
                        pickList.removeAll();
                    }
                }

            ]
        })
        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'pro_picking_MaterialGrid',
            store:pickList,
            dock: 'bottom',
            autoScroll: true, //超过长度带自动滚动条
            columns:[
                {dataIndex:'name', text:'材料名',flex :1 },
                {
                    dataIndex:'count',//countTemp
                    text:'领取数量',
                    flex :1
                    //editor:{xtype : 'textfield', allowBlank : true},

                }],
            // height:'100%',
            flex:1,
            tbar:toobar_right,
            selType:'checkboxmodel',
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: pickList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        var grid_pickList_specific=Ext.create('Ext.grid.Panel',{
            id : 'grid_pickList_specific',
            // tbar:toolbar_specific,
            // store:product_specificListStore,
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'name',
                    text:'材料名',
                    flex :1
                },
                {
                    dataIndex:'type',
                    text:'类型',
                    flex :1,
                },
                {
                    dataIndex:'warehouseName',
                    text:'仓库名',
                    flex :1,
                },
                {
                    dataIndex:'countAll',
                    text:'总数量',
                    flex :1,
                },
                {
                    dataIndex:'countRec',
                    text:'待领数量',
                    flex :1,
                },
                {
                    dataIndex:'count',
                    text:'领取数量',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
            ],
            // height:'100%',
            flex:1,
            selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // features : [ {//定义表格特征
            //     ftype : "groupingsummary",
            //     hideGroupedHeader : true,//隐藏当前分组的表头
            //     groupHeaderTpl:'这类产品有(<b><font color=red>{[values.rows[0].data.totalNumber]}</font></b>)个',
            // } ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    // store: pickList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        //领料单查询信息 Panel
        var panel_bottom = Ext.create('Ext.panel.Panel',{
            title: '领料',
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:500,

            items:[grid_pickList_specific,
                {
                    xtype:'container',
                    // flex:0.3,
                    items:[{
                        xtype:'button',
                        // margin: '0 0 0 30',
                        text:'选择',
                        itemId:'move_right',
                        handler:function() {
                            var records = grid_pickList_specific.getSelectionModel().getSelection();
                            console.log(records)
                            console.log("测试")
                            console.log(records[0])

                            for (i = 0; i < records.length; i++) {
                                console.log(records[i].data['countTemp'])
                                if(records[i].data['countTemp'] != 0){
                                    console.log("添加")
                                    pickList.add(records[i]);
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
                            pickList.remove(records);
                            grid_pickList_specific.store.add(records);//grid_pickList_specific
                        }
                    }]
                },
                grid2,

            ],
        });

        //领料的具体材料信息 panel
        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            height:800,

            items:[grid1,
                // {
                //     xtype:'container',
                //     // flex:0.3,
                //     items:[{
                //         xtype:'button',
                //         // margin: '0 0 0 30',
                //         text:'选择',
                //         itemId:'move_right',
                //         handler:function() {
                //             var records = grid1.getSelectionModel().getSelection();
                //             console.log(records)
                //             console.log("测试")
                //             console.log(records[0])
                //
                //             for (i = 0; i < records.length; i++) {
                //                 console.log(records[i].data['countTemp'])
                //                 if(records[i].data['countTemp'] != 0){
                //                     console.log("添加")
                //                     pickList.add(records[i]);
                //                 }
                //             }
                //             //若要领数量<领取数量，则不能直接remove，需要更改数量值
                //
                //         }
                //     },{
                //         xtype:'button',
                //         text:'撤销',
                //         itemId:'move_left',
                //         handler:function(){
                //             var records=grid2.getSelectionModel().getSelection();
                //             pickList.remove(records);
                //             MaterialpickListStore.add(records);
                //         }
                //     }]
                // },
                // grid2
                panel_bottom
            ],
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
        // this.tbar = toolbar;
        this.items = [panel];
        this.callParent(arguments);
    }
})