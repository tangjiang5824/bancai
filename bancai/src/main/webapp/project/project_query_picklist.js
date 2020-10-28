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

        //原件类型：枚举类型
        Ext.define('product.model.originType', {
            statics: { // 关键s
                0: { value: '0', name: '未匹配' },
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料' },
                9: { value: '5', name: '未匹配成功' },
            }
        });
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
            margin : '0 10 0 0',
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
                },
                listeners:{
                    //下拉框搜索
                    beforequery :function(e){
                        var combo = e.combo;
                        combo.collapse();//收起
                        var value = combo.getValue();
                        if (!e.forceAll) {//如果不是通过选择，而是文本框录入
                            combo.store.clearFilter();
                            combo.store.filterBy(function(record, id) {
                                var text = record.get(combo.displayField);
                                // 用自己的过滤规则,如写正则式
                                return (text.indexOf(value) != -1);
                            });
                            combo.onLoad();//不加第一次会显示不出来
                            combo.expand();
                            return false;
                        }
                        if(!value) {
                            //如果文本框没值，清除过滤器
                            combo.store.clearFilter();
                        }
                    },
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
                    rootProperty: 'value',
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

        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                //单号
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '单号',
                    id :'picklistNum',
                    width: 180,
                    labelWidth: 30,
                    name: 'picklistNum',
                    value:"",
                },
                {
                    fieldLabel : '创建人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 10 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    fieldLabel : '创建时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')

                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    // fieldLabel : '结束时间',
                    width : 120,
                    // labelWidth : 60,
                    id : "endTime",
                    name : 'endTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },

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
                                projectId:Ext.getCmp('projectName').getValue(),
                                //projectId:'1',
                            }
                        });
                    }
                }]
        });


        var PickingListGrid=Ext.create('Ext.grid.Panel',{
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
                    flex :1,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')  //
                },
                {
                    // name : '操作',
                    // name : '操作',
                    text : '打印',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='打印领料单' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    },
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
                            //projectId:'1',
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
                    rootProperty: 'value',
                },
            },
            autoLoad : false
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
                    renderer: function (value) {
                        return product.model.originType[value].name; // key-value
                    },
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

            items:[PickingListGrid,
                // {
                //     xtype:'container',
                //     // flex:0.3,
                //     items:[{
                //         xtype:'button',
                //         // margin: '0 0 0 30',
                //         text:'选择',
                //         itemId:'move_right',
                //         handler:function() {
                //             var records = PickingListGrid.getSelectionModel().getSelection();
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

        PickingListGrid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            // console.log("grid")
            // console.log(grid)
            // console.log("rowIndex")
            // console.log(rowIndex)
            // console.log("columnIndex")
            // console.log(columnIndex)
            // console.log("e")
            // console.log(e)
            //console.log("grid.columns[columnIndex]：",Ext.getCmp('worksheet_Grid').columns[columnIndex-1])
            //var fieldName = Ext.getCmp('PickingListGrid').columns[columnIndex-1].text;
            var sm = Ext.getCmp('PickingListGrid').getSelectionModel();
            //var isrollback = Ext.getCmp('isrollback').getValue();
            var materialArr = sm.getSelection();
            var requisitionOrderId = e.data.requisitionOrderId;  //选中记录的logid,工单号
            var projectName = e.data.projectName;  //选中记录的项目名
            var workerName = e.data.workerName;  //选中记录的项目名
            var time = e.data.time;  //选中记录的项目名
            console.log("e.data：",e.data);
            console.log("requisitionOrderId "+requisitionOrderId+" projectName "+projectName+" workerName "+workerName+" time "+time);
            if (columnIndex == 3) {
                console.log("zzzzzzzzzzzzzzzzzyyyyyyyyyyyyyyyyyyyzzzzz打印")
                console.log("requisitionOrderId="+requisitionOrderId)
                Ext.Ajax.request({
                    url : 'project/printRequisitionOrder.do', //打印
                    method:'POST',
                    //submitEmptyText : false,
                    params : {
                        //s : "[" + s + "]",
                        requisitionOrderId : requisitionOrderId,
                        //operator: Ext.getCmp('operator').getValue(),
                        // inputTime:Ext.getCmp('inputTime').getValue(),
                    },
                    success : function(response) {
                        console.log("12312312312321",response.responseText);
                        // if(response.responseText.includes("false"))
                        // {
                        //     Ext.MessageBox.alert("提示","入库失败，品名不规范" );
                        // }
                        // //var message =Ext.decode(response.responseText).showmessage;
                        // else{
                        //     Ext.MessageBox.alert("提示","入库成功" );
                        // }

                        var res = response.responseText;
                        var jsonobj = JSON.parse(res);//将json字符串转换为对象
                        console.log(jsonobj);
                        console.log("success--------------",jsonobj.success);
                        console.log("errorList--------------",jsonobj['errorList']);
                        var success = jsonobj.success;
                        var errorList = jsonobj.errorList;
                        var errorCode = jsonobj.errorCode;
                        var errorCount = jsonobj.errorCount;
                        if(success == false){
                            //错误输入
                            if(errorCode == 200){
                                //关闭进度条
                                // Ext.MessageBox.alert("提示","匹配失败，产品位置重复或品名不合法！请重新导入" );
                                Ext.Msg.show({
                                    title: '提示',
                                    message: '打印失败！',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            //点击确认，显示重复的数据
                                            //old_inb_errorlistStore.loadData(errorList);
                                            //win_oldinb_errorInfo_outbound.show();

                                        }
                                    }
                                });
                            }
                            else if(errorCode == 1000){
                                Ext.MessageBox.alert("提示","打印失败，未知错误！请重新打印" );
                            }
                        }else{
                            Ext.MessageBox.alert("提示","打印成功" );
                        }

                    },
                    failure : function(response) {
                        //var message =Ext.decode(response.responseText).showmessage;
                        Ext.MessageBox.alert("提示","打印失败" );
                    }
                });
            }
        }

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