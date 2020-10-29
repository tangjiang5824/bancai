Ext.define('oldpanel.oldpanel_Inbound____', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '旧板入库',
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
            width : 200,
            margin: '0 10 0 20',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'id',
            editable : false,
            store: storeNameList,
        });

        var oldPanelNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'oldpanelName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=oldpanel_info',
                reader : {
                    type : 'json',
                    rootProperty: 'oldpanel_info',
                }
            },
            autoLoad : true
        });
        var oldpanelNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板品名',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelNameList',
            name : 'oldpanelNameList',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelName',
            valueField: 'oldpanelName',
            editable : true,
            store: oldPanelNameStore,
            listeners:{
                select: function(combo, record, index) {

                    //console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                },
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
                // {xtype: 'textfield', fieldLabel: '旧板品名', id: 'oldpanelName', width: 300, labelWidth: 60,
                //     //margin: '0 10 0 40',
                //     name: 'oldpanelName', value: ""},
                oldpanelNameList,
                //{xtype: 'textfield', fieldLabel: '重量', id: 'weight', width: 190, labelWidth: 30, margin: '0 10 0 50', name: 'weight', value: ""},
                //{xtype: 'textfield', fieldLabel: '仓库名称', id: 'warehouseNo', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'warehouseNo', value: ""},
                //{xtype: 'textfield', fieldLabel: '存放位置', id: 'position', width: 220, labelWidth: 60, margin: '0 10 0 50', name: 'position', value: ""},
                {xtype: 'textfield', fieldLabel: '旧板品号', id: 'oldpanelNo', margin: '0 10 0 30',width: 150, labelWidth: 60,  name: 'oldpanelNo', value: ""},
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
                {xtype: 'textfield', fieldLabel: '入库数量', id: 'count', margin: '0 10 0 30',width: 150, labelWidth: 60,  name: 'count', value: ""},
                {xtype: 'textfield', fieldLabel: '备注', id: 'remark', margin: '0 10 0 30',width: 150, labelWidth: 30,  name: 'remark', value: ""},

                {   xtype : 'button',
                    margin: '0 10 0 30',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        //var classificationName = Ext.getCmp('classification').getValue();
                        log(Ext.getCmp('oldpanelNameList').getValue())
                        var oldpanelName = Ext.getCmp('oldpanelNameList').getValue();
                        var oldpanelNo = Ext.getCmp('oldpanelNo').getValue();
                        //var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var count = Ext.getCmp('count').getValue();
                        //var unitWeight = Ext.getCmp('unitWeight').getValue();
                        //var unitArea = Ext.getCmp('unitArea').getValue();
                        var remark = Ext.getCmp('remark').getValue();
                        var warehouseName = Ext.getCmp('storePosition').rawValue;
                        var data = [{
                            'oldpanelName' : oldpanelName,
                            'oldpanelNo' : oldpanelNo,
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
                        if (oldpanelName != ''&&count!= ''&&warehouseName!= '') {
                            Ext.getCmp('old_addDataGrid').getStore().loadData(data, true);
                            //清除框里的数据
                            Ext.getCmp('oldpanelName').setValue('');
                            //Ext.getCmp('classification').setValue('');
                            //Ext.getCmp('inventoryUnit').setValue('');
                            //Ext.getCmp('unitWeight').setValue('');
                            //Ext.getCmp('unitArea').setValue('');
                            Ext.getCmp('count').setValue('');
                            Ext.getCmp('storePosition').setValue('');
                            Ext.getCmp('remark').setValue('');
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
                        var sm = Ext.getCmp('old_addDataGrid').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('old_addDataGrid').getStore().remove(oldpanelArr);
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


        //错误提示，弹出框
        var old_inb_errorlistStore = Ext.create('Ext.data.Store',{
            id: 'old_inb_errorlistStore',
            autoLoad: true,
            fields: ['productName','position'],
            //pageSize: itemsPerPage, // items per page
            data:[],
            editable:false,
        });

        //弹出框，出入库详细记录
        var old_inb_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'old_inb_errorlist_outbound',
            // tbar: toolbar_pop,
            store:old_inb_errorlistStore,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 60,
                    align: 'center',
                    sortable: false
                },
                {
                    text: '旧板名称',
                    dataIndex: 'oldpanelName',
                    flex :1,
                    width:"80"
                },
                {
                    text: '仓库名称',
                    dataIndex: 'warehouseName',
                    flex :1,
                    width:"80"
                },
                {
                    text: '入库数量',
                    dataIndex: 'count',
                    flex :1,
                    width:"80"
                },
                {
                    text: '错误原因',
                    flex :1,
                    dataIndex: 'errorType',
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
        });

        var win_oldinb_errorInfo_outbound = Ext.create('Ext.window.Window', {
            // id:'win_oldinb_errorInfo_outbound',
            title: '错误详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            // tbar:toolbar_pop1,
            items:old_inb_errorlist_outbound,
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
                // {
                //     xtype: 'textfield',
                //     margin: '0 20 0 0',
                //     fieldLabel: ' 入库人',
                //     id: 'operator',
                //     width: 150,
                //     labelWidth: 45,
                //     name: 'operator',
                //     value: "",
                // },
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
                    valueField : 'id',
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
                    var select = Ext.getCmp('old_addDataGrid').getStore()
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
                        url : 'oldpanel/addData.do', //旧板入库
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
                                        message: '入库失败！存在错误内容',
                                        buttons: Ext.Msg.YESNO,
                                        icon: Ext.Msg.QUESTION,
                                        fn: function (btn) {
                                            if (btn === 'yes') {
                                                //点击确认，显示重复的数据
                                                old_inb_errorlistStore.loadData(errorList);
                                                win_oldinb_errorInfo_outbound.show();

                                            }
                                        }
                                    });
                                }
                                else if(errorCode == 1000){
                                    Ext.MessageBox.alert("提示","入库失败，未知错误！请重新领取" );
                                }
                            }else{
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



        var old_addDataGrid = Ext.create("Ext.grid.Panel", {
            id : 'old_addDataGrid',
            store : {
                // fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
                fields: ['oldpanelName','warehouseName','count']
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
                {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'oldpanelNo', text : '旧板品号', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'count', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

                // {
                //     name : '操作',
                //     text : '操作',
                //     renderer:function(value, cellmeta){
                //         return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                //     }
                // }

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

        // old_addDataGrid.addListener('cellclick', cellclick);
        // function cellclick(grid, rowIndex, columnIndex, e) {
        //     if (rowIndex < 0) {
        //         return;
        //     }
        //     var fieldName = Ext.getCmp('old_addDataGrid').columns[columnIndex-1].text;
        //
        //     console.log("列名：",fieldName)
        //     if (fieldName == "操作") {
        //         //设置监听事件getSelectionModel().getSelection()
        //         var sm = Ext.getCmp('old_addDataGrid').getSelectionModel();
        //         var oldpanelArr = sm.getSelection();
        //         if (oldpanelArr.length != 0) {
        //             Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
        //                 if (btn == 'yes') {
        //                     //先删除后台再删除前台
        //                     //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
        //
        //                     //Extjs 4.x 删除
        //                     Ext.getCmp('old_addDataGrid').getStore().remove(oldpanelArr);
        //                 } else {
        //                     return;
        //                 }
        //             });
        //         } else {
        //             //Ext.Msg.confirm("提示", "无选中数据");
        //             Ext.Msg.alert("提示", "无选中数据");
        //         }
        //     }
        //
        //     console.log("rowIndex:",rowIndex)
        //     console.log("columnIndex:",columnIndex)
        //     // var record = grid.getStore().getAt(rowIndex);
        //     // var id = record.get('id');
        //     // var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
        //     // if (fieldName == "c_reply") {
        //     //     Ext.Msg.alert('c_reply', rowIndex + "  -  " + id);
        //     // }else if (fieldName == "c_agree") {
        //     //     Ext.Msg.alert('c_agree', rowIndex + "  -  " + id);
        //     // }
        // };

        // this.dockedItems = [
        //     //toolbar,
        //     //toobar,toolbar1,
        //     toolbar2, old_addDataGrid];
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
        // this.tbar = toolbar2;
        this.items = [ old_addDataGrid ];
        this.callParent(arguments);

    }

})

