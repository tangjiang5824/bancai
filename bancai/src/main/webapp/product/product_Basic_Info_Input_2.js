Ext.define('product.product_Basic_Info_Input_2',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料领料',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        var productTypeId="-1";
        //var materialType="1";
        //存放所选的原材料的具体规格
        var materialList = '';
        // //项目名称选择
        // var tableListStore = Ext.create('Ext.data.Store',{
        //     fields : [ "项目名称","id"],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'project/findProjectList.do',
        //         reader : {
        //             type : 'json',
        //             rootProperty: 'projectList',
        //         }
        //     },
        //     autoLoad : true
        // });
        // var tableList = Ext.create('Ext.form.ComboBox',{
        //     fieldLabel : '项目名',
        //     labelWidth : 45,
        //     width : '35%',
        //     id :  'projectName',
        //     name : '项目名称',
        //     matchFieldWidth: true,
        //     emptyText : "--请选择--",
        //     displayField: 'projectName',
        //     valueField: 'id',
        //     editable : true,
        //     store: tableListStore,
        //     listeners:{
        //         select: function(combo, record, index) {
        //             console.log(record[0].data.projectName);
        //         }
        //     }
        //
        // });
        //查询的数据存放位置 左侧界面
        var MaterialList = Ext.create('Ext.data.Store',{
            fields:['productTypeName','classificationName','description'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=producttype_classification_format',
                reader : {
                    type : 'json',
                    rootProperty: 'producttype_classification_format',
                }
            },
            autoLoad : true,
        });
        var MaterialList2=Ext.create('Ext.data.Store',{
            fields:['productFormat'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=product_format',//&productTypeId='+productTypeId,
                reader : {
                    type : 'json',
                    rootProperty: 'product_format',
                }
            },
            autoLoad : false,
        });
        var clms=[
            {
                dataIndex:'productTypeName',
                text:'产品类型名',
                flex :1,
                editor:{xtype : 'textfield', allowBlank : false}
            },
            {
                dataIndex:'classificationName',
                text:'分类',
                flex :1,
                editor:{xtype : 'textfield', allowBlank : false}
            },
            {
                dataIndex:'description',
                text:'描述',
                flex :1,
                editor:{xtype : 'textfield', allowBlank : false}
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
            //
            // }
        ];
        var clms1=[
            //{dataIndex:'materialName', text:'材料名',flex :1 },
            {
                dataIndex:'productFormat',//countTemp
                text:'该类产品格式',
                flex :1,
                editor:{xtype : 'textfield', allowBlank : false}

            }
            // {dataIndex:'countNotReceived', text:'要领数量',flex :1
            //     //editor:{xtype : 'textfield', allowBlank : false}
            // },

        ];
        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [//tableList,
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '新增产品类型',
                    handler : function() {
                        var data = [{
                            'productTypeName':'',
                            'classificationName':'',
                            'description' : '',
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('productTypeGrid').getStore().loadData(data,
                            true);
                    }

                },{
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '保存更改',

                    handler : function() {
                        // 取出grid的字段名字段类型
                        //var userid="<%=session.getAttribute('userid')%>";
                        var select = Ext.getCmp('productTypeGrid').getStore()
                            .getData();
                        //console.log(select);
                        var s = new Array();
                        select.each(function(rec) {
                            //console.log(rec);
                            //delete rec.data.id;
                            s.push(JSON.stringify(rec.data));
                            //alert(JSON.stringify(rec.data));//获得表格中的数据
                        });
                        //alert(s);//数组s存放表格中的数据，每条数据以json格式存放
                        var records = grid1.getSelectionModel().getSelection();
                        console.log(records)
                        console.log("测试")
                        console.log(records[0].id)
                        //productTypeId = records[0].id;
                        Ext.Ajax.request({
                            url : 'material/insertIntoProductbasicinfo.do', //HandleDataController
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                // tableName:tableName,
                                // materialType:materialtype,
                                s : "[" + s + "]",
                                //userid: userid + ""
//									tableName : tabName,
//									organizationId : organizationId,
//									tableType : tableType,
//									uploadCycle : uploadCycle,
//									cycleStart : cycleStart

                            },
                            success : function(response) {
                                Ext.MessageBox.alert("提示", "保存成功！");
                                me.close();
//									var obj = Ext.decode(response.responseText);
//									if (obj) {
//
//										Ext.MessageBox.alert("提示", "保存成功！");
//										me.close();
//
//									} else {
//										// 数据库约束，返回值有问题
//										Ext.MessageBox.alert("提示", "保存失败！");
//
//									}

                            },
                            failure : function(response) {
                                Ext.MessageBox.alert("提示", "保存失败！");
                            }
                        });

                    }
                },
                {
                    xtype : 'button',
                    text: '产品类型查询',
                    width: 100,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        //console.log(Ext.getCmp('projectName').getValue())
                        MaterialList.load({
                            params : {
                                //proejctId:Ext.getCmp('projectName').getValue(),
                                //proejctId:'1',
                            }
                        });
                    }
                }
                ]
        });
        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'productTypeGrid',
            store:MaterialList,
            dock: 'bottom',
            columns:clms,
            flex:1,
            // height:'100%',
            // tbar: toolbar,
            selType:'checkboxmodel', //选择框
            selModel: {
                injectCheckbox: 0,
                mode: "SINGLE",     //"SINGLE"/"SIMPLE"/"MULTI"
                checkOnly: true     //只能通过checkbox选择
            },
            //singleSelects:['edit'],
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
                // {
                //     xtype: 'datefield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '领料时间',
                //     id :'pickTime',
                //     width: 200,
                //     labelWidth: 60,
                //     name: 'pickTime',
                //     value:"",
                //     format : 'Y-m-d',
                //     editable : false,
                //     // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                //     value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                // },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '新增格式',
                    handler : function() {
                        var data = [{
                            'productFormat':'',
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('productFormatGrid').getStore().loadData(data,
                            true);
                    }

                },{
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '保存更改',

                    handler : function() {
                        // 取出grid的字段名字段类型
                        //var userid="<%=session.getAttribute('userid')%>";
                        var select = Ext.getCmp('productFormatGrid').getStore()
                            .getData();
                        var s = new Array();
                        select.each(function(rec) {
                            //delete rec.data.id;
                            s.push(JSON.stringify(rec.data));
                            //alert(JSON.stringify(rec.data));//获得表格中的数据
                        });
                        //alert(s);//数组s存放表格中的数据，每条数据以json格式存放

                        Ext.Ajax.request({
                            url : 'material/insertIntoProductbasicinfo.do', //HandleDataController
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                // tableName:tableName,
                                // materialType:materialtype,
                                s : "[" + s + "]",
                                //userid: userid + ""
//									tableName : tabName,
//									organizationId : organizationId,
//									tableType : tableType,
//									uploadCycle : uploadCycle,
//									cycleStart : cycleStart

                            },
                            success : function(response) {
                                Ext.MessageBox.alert("提示", "保存成功！");
                                me.close();
//									var obj = Ext.decode(response.responseText);
//									if (obj) {
//
//										Ext.MessageBox.alert("提示", "保存成功！");
//										me.close();
//
//									} else {
//										// 数据库约束，返回值有问题
//										Ext.MessageBox.alert("提示", "保存失败！");
//
//									}

                            },
                            failure : function(response) {
                                Ext.MessageBox.alert("提示", "保存失败！");
                            }
                        });

                    }
                }
                // {
                //     xtype : 'button',
                //     iconAlign : 'center',
                //     iconCls : 'rukuicon ',
                //     margin : '0 0 0 30',
                //     text : '创建领料单',
                //     region:'center',
                //     bodyStyle: 'background:#fff;',
                //     handler : function() {
                //
                //         // 取出grid的字段名字段类型pickingMaterialGrid
                //         console.log('1===========')
                //         var select = Ext.getCmp('pickingMaterialGrid').getStore()
                //             .getData();
                //
                //         // console.log(select)
                //
                //
                //         var s = new Array();
                //         select.each(function(rec) {
                //             s.push(JSON.stringify(rec.data));
                //         });
                //         console.log(s)
                //         console.log('2===========')
                //         //获取数据
                //         Ext.Ajax.request({
                //             url : 'material/materialreceivelist', //原材料入库
                //             method:'POST',
                //             //submitEmptyText : false,
                //             params : {
                //                 pickName:Ext.getCmp('pickName').getValue(),
                //                 pickTime:Ext.getCmp('pickTime').getValue(),
                //                 s : "[" + s + "]",//存储选择领料的数量
                //                 // materialList : "[" + materialList + "]",
                //             },
                //             success : function(response) {
                //                 //var message =Ext.decode(response.responseText).showmessage;
                //                 Ext.MessageBox.alert("提示","领取成功" );
                //                 //刷新页面
                //                 MaterialList.reload();
                //
                //             },
                //             failure : function(response) {
                //                 //var message =Ext.decode(response.responseText).showmessage;
                //                 Ext.MessageBox.alert("提示","领取失败" );
                //             }
                //         });
                //
                //         // 重新加载页面，该项目的领料单信息
                //         MaterialList.load({
                //             params : {
                //                 proejctId:Ext.getCmp('projectName').getValue(),
                //                 //proejctId:'1',
                //             }
                //         });
                //         //  右边输入框重置
                //
                //         //  右边页面重置
                //         Ext.getCmp('pickName').setValue("");
                //         MaterialList2.removeAll();
                //     }
                // }
            ]
        })
        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'productFormatGrid',
            store:MaterialList2,
            dock: 'bottom',
            columns:clms1,
            // height:'100%',
            flex:1,
            tbar:toobar_right,
            selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
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
                        text:'查看格式',
                        itemId:'move_right',
                        handler:function() {
                            var records = grid1.getSelectionModel().getSelection();
                            console.log(records)
                            console.log("测试")
                            console.log(records[0].id)
                            productTypeId = records[0].id;
                            // for (i = 0; i < records.length; i++) {
                            //     console.log(records[i].data['countTemp'])
                            //     if(records[i].data['countTemp'] != 0){
                            //         console.log("添加")
                            //         MaterialList2.add(records[i]);
                            //     }
                            // }
                            //若要领数量<领取数量，则不能直接remove，需要更改数量值
                            MaterialList2.load({
                                params : {
                                    //proejctId:Ext.getCmp('projectName').getValue(),
                                    //proejctId:'1',
                                    columnName:"productTypeId" ,
                                    columnValue: records[0].id,
                                }
                            });
                        }
                    },
                    //     {
                    //     xtype:'button',
                    //     text:'撤销',
                    //     itemId:'move_left',
                    //     handler:function(){
                    //         var records=grid2.getSelectionModel().getSelection();
                    //         MaterialList2.remove(records);
                    //         MaterialList.add(records);
                    //     }
                    // }
                    ]
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

