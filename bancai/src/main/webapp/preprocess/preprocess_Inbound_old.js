Ext.define('preprocess.preprocess_Inbound_old', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '预加工半成品入库',
    // reloadPage : function() {
    //     var p = Ext.getCmp('functionPanel');
    //     p.removeAll();
    //     cmp = Ext.create("data.UploadDataTest");
    //     p.add(cmp);
    // },
    // clearGrid : function() {
    //     var msgGrid = Ext.getCmp("msgGrid");
    //     if (msgGrid != null || msgGrid != undefined)
    //         this.remove(msgGrid);
    // },

    initComponent : function() {
        var me = this;
        //var materialtype="1";
        var record_start = 0;
        var projectId = "-1";
        var buildingId = "-1";
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
            }
        });
        //仓库编号
        var storeNameList = Ext.create('Ext.data.Store',{
            fields : [ 'warehouseName'],
            proxy : {
                type : 'ajax',
                url : 'material/findStore.do', //查询所有的仓库编号
                reader : {
                    type : 'json',
                    rootProperty: 'StoreName',
                }
            },
            autoLoad : true
        });
        var storePosition = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '仓库名',
            labelWidth : 50,
            width : 250,
            margin: '0 0 0 20',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'id',
            editable : false,
            store: storeNameList,
        });

        var oldPanelNameList = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelName'],
            proxy : {
                type : 'ajax',
                url : 'oldpanel/oldpanelType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typeList',
                }
            },
            autoLoad : true
        });


        var classificationListStore = Ext.create('Ext.data.Store',{
            fields : [ 'classificationName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=classification',
                reader : {
                    type : 'json',
                    rootProperty: 'classification',
                },
            },
            autoLoad : true
        });
        var classificationList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '分类',
            labelWidth : 70,
            width : 230,
            id :  'classification',
            name : 'classification',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'classificationName',
            valueField: 'classificationId',
            editable : false,
            store: classificationListStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(classificationList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });

        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: '产品品名', id: 'productName', width: 300, labelWidth: 60,
                    //margin: '0 10 0 40',
                    name: 'productName', value: ""},
                //{xtype: 'textfield', fieldLabel: '重量', id: 'weight', width: 190, labelWidth: 30, margin: '0 10 0 50', name: 'weight', value: ""},
                //{xtype: 'textfield', fieldLabel: '仓库名称', id: 'warehouseNo', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'warehouseNo', value: ""},
                //{xtype: 'textfield', fieldLabel: '存放位置', id: 'position', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'position', value: ""},
                storePosition,
                // {
                //     xtype:'tbtext',
                //     text:'存放位置:',
                //     margin: '0 0 0 20',
                //     //id: 'number',
                //     width: 60,
                //     //labelWidth: 30,
                //     //name: 'number',
                //     //value: "",
                // },
                // speificLocation_row,
                // speificLocation_col,
                {xtype: 'textfield', fieldLabel: '入库数量', id: 'count', margin: '0 0 0 20', width: 190, labelWidth: 60,  name: 'count', value: ""},
                {xtype: 'textfield', fieldLabel: '备注', id: 'remark', margin: '0 10 0 30',width: 190, labelWidth: 30,  name: 'remark', value: ""},

                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        //var classificationName = Ext.getCmp('classification').getValue();
                        var productName = Ext.getCmp('productName').getValue();
                        //var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var count = Ext.getCmp('count').getValue();
                        //var unitWeight = Ext.getCmp('unitWeight').getValue();
                        //var unitArea = Ext.getCmp('unitArea').getValue();
                        var remark = Ext.getCmp('remark').getValue();
                        var warehouseName = Ext.getCmp('storePosition').getValue();
                        var data = [{
                            'productName' : productName,
                            //'classificationName':classificationName,
                            //'inventoryUnit' : inventoryUnit,
                            //'unitArea' : unitArea,
                            //'unitWeight' : unitWeight,
                            'warehouseName':warehouseName,
                            'remark' : remark,
                            'count' : count,
                        }];
                        //点击查询获得输入的数据
                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        //若品名未填则添加失败
                        if (productName != ''&&count!= '') {
                            Ext.getCmp('pre_addDataGrid').getStore().loadData(data, true);
                            //清除框里的数据
                            Ext.getCmp('productName').setValue('');
                            //Ext.getCmp('classification').setValue('');
                            //Ext.getCmp('inventoryUnit').setValue('');
                            //Ext.getCmp('unitWeight').setValue('');
                            //Ext.getCmp('unitArea').setValue('');
                            Ext.getCmp('count').setValue('');
                            Ext.getCmp('storePosition').setValue('');
                            //Ext.getCmp('remark').setValue('');
                            Ext.getCmp('operator').setValue('');
                        }else{
                            Ext.MessageBox.alert("警告","品名、入库数量不能为空",function(r) {
                                //    r = cancel||ok
                            });
                        }
                    }
                },
                //删除行数据
                {
                    xtype : 'button',
                    margin: '0 10 0 30',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    handler: function(){
                        var sm = Ext.getCmp('pre_addDataGrid').getSelectionModel();
                        var pre_Arr = sm.getSelection();
                        if (pre_Arr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + pre_Arr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('pre_addDataGrid').getStore().remove(pre_Arr);
                                } else {
                                    return;
                                }
                            });
                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }
                    }
                }
            ]
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

        //确认入库按钮，
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
            items : [
                {
                    fieldLabel : '入库人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 40 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'workerName',
                    editable : true,
                },
                // {
                //     xtype: 'datefield',
                //     margin : '0 30 0 0',
                //     fieldLabel: '入库日期',
                //     id :'inputTime',
                //     width: 200,
                //     labelWidth: 60,
                //     name: 'inputTime',
                //     format : 'Y-m-d',
                //     editable : false,
                //     // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                //     value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                // },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '确认入库',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('pre_addDataGrid').getStore()
                            .getData();
                        var s = new Array();
                        select.each(function(rec) {
                            //delete rec.data.id;
                            s.push(JSON.stringify(rec.data));
                            //alert(JSON.stringify(rec.data));//获得表格中的数据
                        });
                        console.log(s);
                        //获取数据
                        //获得当前操作时间
                        //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                        Ext.Ajax.request({
                            url : 'preprocess/addData.do', //入库
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                s : "[" + s + "]",
                                projectId : projectId,
                                buildingId : buildingId,
                                operator: Ext.getCmp('operator').getValue(),
                                // inputTime:Ext.getCmp('inputTime').getValue(),
                            },
                            success : function(response) {
                                console.log("12312312312321",response.responseText);
                                if(response.responseText.includes("false"))

                                {
                                    Ext.MessageBox.alert("提示","入库失败，品名不规范" );
                                }
                                //var message =Ext.decode(response.responseText).showmessage;
                                else{
                                    Ext.MessageBox.alert("提示","入库成功" );
                                }

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","入库失败" );
                            }
                        });

                    }
                }]
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'pre_addDataGrid',
            //dockedItems : [toolbar2],
            store : {
                // fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
                fields: ['productName','warehouseName','count']
            },

            columns : [
                // {
                //     // dataIndex : '序号',
                //     name : '序号',
                //     text : '序号',
                //     width : 60,
                //     value:'99',
                //     renderer:function(value,metadata,record,rowIndex){
                //         return　record_start　+　1　+　rowIndex;
                //     }
                // },
                {dataIndex : 'productName', text : '产品名称', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'count', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                //
                {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
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
            selType : 'checkboxmodel'//'rowmodel'
        });

        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar2]
        },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar3]
            },
        ];
        this.items = [ grid ];
        this.callParent(arguments);
    }
})

