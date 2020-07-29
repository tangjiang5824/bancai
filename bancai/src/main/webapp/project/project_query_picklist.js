Ext.define('project.project_query_picklist',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目领料单查询',
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
                    margin: '0 0 0 40',
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
                                proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
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
                ],
            flex:1,
            // height:'100%',
            tbar: toolbar,
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
                    //var pickNumber = select.
                    // var specificMaterialList = Ext.create('Ext.data.Store',{
                    //     //id,materialName,length,width,materialType,number
                    //     fields:['materialName','length','materialType','width','specification','number'],
                    //     proxy : {
                    //         type : 'ajax',
                    //         url : 'order/queryRequisitionOrderDetail.do?requisitionOrderId='+requisitionOrderId,//获取同类型的原材料  +'&pickNum='+pickNum
                    //         reader : {
                    //             type : 'json',
                    //             rootProperty: 'requisitionOrderDetailList',
                    //         },
                    //     },
                    //     autoLoad : true
                    // });

                    specificMaterialList.load({
                        params : {
                            requisitionOrderId:requisitionOrderId,
                            //proejctId:'1',
                        }
                    });

                    // grid__query_pickList_specific.setStore(specificMaterialList);
                    // grid__query_pickList_specific.getDockedItems().setStore(specificMaterialList)
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

        var specificMaterialList = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:['materialName','length','materialType','width','specification','number'],
            proxy : {
                type : 'ajax',
                url : 'order/queryRequisitionOrderDetail.do',//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'requisitionOrderDetailList',
                },
            },
            autoLoad : true
        });

        var grid__query_pickList_specific=Ext.create('Ext.grid.Panel',{
            title:'领料单明细',
            id : 'grid__query_pickList_specific',
            // tbar:toolbar_specific,
            store:specificMaterialList,
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
            // selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: specificMaterialList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
        });

        //弹框


        //领料单查询信息 Panel
        // var panel_bottom = Ext.create('Ext.panel.Panel',{
        //     title: '领料',
        //     //dock: 'bottom',
        //     layout:{
        //         type:'hbox',
        //         align:'stretch'
        //     },
        //     width:'100%',
        //     height:500,
        //
        //     items:[grid__query_pickList_specific,
        //     ],
        // });

        //领料的具体材料信息 panel
        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'vbox',
                align:'stretch'
            },
            width:'100%',
            height:'100%',

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
                grid__query_pickList_specific
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