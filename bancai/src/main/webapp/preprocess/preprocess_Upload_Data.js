Ext.define('preprocess.preprocess_Upload_Data', {
    extend : 'Ext.panel.Panel',
    id:'preprocess.preprocess__Upload_Data',
    region : 'center',
    layout : "fit",
    title : '预加工半成品批量入库',
    //requires : [ 'component.TableList', "component.YearList" ],
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("data.UploadDataTest");
        p.add(cmp);
    },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        var itemsPerPage = 50;
        var tableName="oldpanel";
        //var oldpaneltype="1";

        //新增表项和保存的按钮
        var preproductStore = Ext.create('Ext.data.Store',{
            id: 'preproductStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,
                        //oldpanelType:oldpanelType
                    });
                }

            }
        });

        //错误提示，弹出框
        var pre_up_errorlistStore = Ext.create('Ext.data.Store',{
            id: 'pre_up_errorlistStore',
            autoLoad: true,
            fields: ['productName','position'],
            //pageSize: itemsPerPage, // items per page
            data:[],
            editable:false,
        });

        //弹出框，出入库详细记录
        var pre_up_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'pre_up_errorlist_outbound',
            // tbar: toolbar_pop,
            store:pre_up_errorlistStore,//oldpanellogdetailList，store1的数据固定
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
                    text: '预加工产品名称',
                    dataIndex: 'productName',
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

        var win_preup_errorInfo_outbound = Ext.create('Ext.window.Window', {
            // id:'win_preup_errorInfo_outbound',
            title: '错误详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            // tbar:toolbar_pop1,
            items:pre_up_errorlist_outbound,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: preproductStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                {dataIndex : 'productName', text : '产品名称', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'count', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},

            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: preproductStore,   // same store GridPanel is using    uploadMaterialRecordsStore
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            //console.log(response.responseText);
                        }
                    })
                    // console.log("value is "+e.value);
                    // console.log(e.record.data["id"]);

                }
            }
        });
        //上传数据文件按钮
        var form = Ext.create("Ext.form.Panel", {
            border : false,
            items : [ {
                xtype : 'filefield',
                width : 400,
                margin: '1 0 0 0',
                buttonText : '上传数据文件',
                name : 'uploadFile',
                //id : 'uploadFile',
                listeners : {
                    change : function(file, value, eOpts) {
                        if (value.indexOf('.xls',value.length-4)==-1) {
                            Ext.Msg.alert('错误', '文件格式错误，请重新选择xls格式的文件！')
                        } else {
                            Ext.Msg.show({
                                title : '操作确认',
                                message : '将上传数据，选择“是”否确认？',
                                buttons : Ext.Msg.YESNO,
                                icon : Ext.Msg.QUESTION,
                                fn : function(btn) {
                                    if (btn === 'yes') {
                                        //var check=Ext.getCmp("check").getValue();

                                        form.submit({
                                            url : 'oldpanel/uploadExcel.do', //上传excel文件，并回显数据
                                            waitMsg : '正在上传...',
                                            params : {
                                                tableName:tableName,
                                                operator: Ext.getCmp('operator').getValue(),
                                                //materialtype:materialtype,
                                                //check:check
                                            },
                                            // success : function(form, action) {
                                            //     //上传成功
                                            //     var response = action.result;
                                            //     //回显
                                            //     console.log('1100000')
                                            //     console.log(action.result['value']);
                                            //     Ext.MessageBox.alert("提示", "上传成功!");
                                            //     //重新加载数据
                                            //     preproductStore.loadData(action.result['value']);
                                            // },
                                            success : function(exceluploadform,response, action) {
                                                var response1 = action;
                                                console.log("response=========================>",response)
                                                Ext.MessageBox.alert("提示", "上传成功!");
                                                console.log(response.response.responseText);
                                                var res = response.response.responseText;
                                                var jsonobj = JSON.parse(res);
                                                //上传成功
                                                var success = jsonobj.success;
                                                var dataList = jsonobj.dataList;
                                                //回显
                                                console.log("response1=========================>",dataList);
                                                if(success == false){
                                                    //excel上传失败
                                                    Ext.Msg.show({
                                                        title: '提示',
                                                        message: '入库失败！存在错误内容',
                                                        buttons: Ext.Msg.YESNO,
                                                        icon: Ext.Msg.QUESTION,
                                                        fn: function (btn) {
                                                            if (btn === 'yes') {
                                                                //点击确认，显示重复的数据
                                                                // pre_up_errorlistStore.loadData(errorList);
                                                                // win_preup_errorInfo_outbound.show();
                                                            }
                                                        }
                                                    });

                                                }else{
                                                    Ext.MessageBox.alert("提示", "上传成功!");
                                                    //重新加载数据
                                                    preproductStore.loadData(dataList);
                                                }
                                                // Ext.MessageBox.alert("提示", "上传成功!");

                                            },

                                            failure : function(form, action) {
                                                var response = action.result;
                                                switch (response.errorCode) {
                                                    case 0:
                                                        Ext.MessageBox.alert("错误", "上传批次或者所属期错误，重新生成上传批次和所属期!");
                                                        break;
                                                    case 1:
                                                        Ext.MessageBox.alert("错误", "上传文件中的批次与生成的上传批次不同，请检查上传文件!");
                                                        me.showMsgGrid([ "name", "input", "expected" ], response.value, [ {
                                                            text : "错误字段",
                                                            dataIndex : "name",
                                                            width : 100
                                                        }, {
                                                            text : "上传文件中的值",
                                                            dataIndex : "input",
                                                            width : 200
                                                        }, {
                                                            text : "期望值",
                                                            dataIndex : "expected",
                                                            width : 100
                                                        } ]);
                                                        break;
                                                    case 2:
                                                        Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
                                                        me.showMsgGrid([ "name", "value" ], response.value, [ {
                                                            text : "错误描述",
                                                            dataIndex : "name",
                                                            width : 250
                                                        }, {
                                                            text : "错误字段",
                                                            dataIndex : "value",
                                                            width : 400
                                                        } ]);
                                                        break;
                                                    case 3:
                                                        Ext.MessageBox.alert("错误", "上传文件中的数据项与系统需要的不一致，请检查上传文件!");
                                                        me.showMsgGrid([ "row", "col", "value", "type" ], response.value, [ {
                                                            text : "出错行",
                                                            dataIndex : "row",
                                                            width : 100
                                                        }, {
                                                            text : "出错列",
                                                            dataIndex : "col",
                                                            width : 250
                                                        }, {
                                                            text : "出错值",
                                                            dataIndex : "value",
                                                            width : 250
                                                        }, {
                                                            text : "期望类型",
                                                            dataIndex : "type",
                                                            width : 250
                                                        } ]);
                                                        break;
                                                    case 1000:
                                                        Ext.MessageBox.alert("错误", "上传文件出现未知错误，请检查上传文件格式！<br>若无法解决问题，请联系管理员！");
                                                        Ext.MessageBox.alert("错误原因", response.msg);
                                                        break;
                                                    default:
                                                        Ext.MessageBox.alert("错误", "服务器异常，请检查网络连接，或者联系管理员");
                                                }

                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            },
            ]
        });

        //模板下载
        var tableNameList =  Ext.create('Ext.data.Store', {
            fields: ['tableName'],
            data : [
                {tableName:"旧板信息表"},
                //{tableName:"原材料信息表"},
                //{tableName:"产品信息表"}
                //...
            ]
        });
        var tableList = Ext.create('Ext.form.ComboBox', {
            fieldLabel : '数据表类型',
            labelWidth : 70,
            width : 400,
            name : 'table',
            emptyText : "--请选择--",
            store: tableNameList,
            queryMode: 'local',
            displayField: "tableName",
            valueField: "tableName",
            editable : false,
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

        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [
                form,
                {
                    fieldLabel : '入库人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    margin: '0 40 0 40',
                    // disabled : true,
                    // width:'95%',
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
                //确认入库
                //确认上传
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '确认入库',
                    margin: '0 0 0 0',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        var projectId = "-1";
                        var buildingId = "-1";

                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('uploadRecordsMain').getStore()
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
                                                    pre_up_errorlistStore.loadData(errorList);
                                                    win_preup_errorInfo_outbound.show();
                                                }
                                            }
                                        });
                                    }
                                    else if(errorCode == 1000){
                                        Ext.MessageBox.alert("提示","入库失败，未知错误！请重新领取" );
                                    }
                                }else{
                                    Ext.MessageBox.alert("提示","入库成功" );
                                    //刷新
                                    Ext.getCmp('uploadRecordsMain').getStore().remove();
                                }

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","入库失败" );
                            }
                        });
                    }
                }
            ]
        });

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items : [ tableList,{
                xtype : 'button',
                text : '下载模板',
                handler : function() {
                    var tableName = tableList.getValue();
                    if (tableName != null) {
                        if(tableName=='旧板信息表'){
                            window.location.href = encodeURI('excel/旧板信息表.xls');
                        }else{
                            Ext.Msg.alert('消息', '下载失败！');
                        }
                    } else {
                        Ext.Msg.alert('消息', '请选择数据类型！');
                    }
                }
            },
                // {
                //     text: '当前时间：'+Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                //     layout:'left'
                // }
            ]
        });

        // this.dockedItems = [toolbar1,toolbar,grid,
        //     {
        //         xtype: 'pagingtoolbar',
        //         store: preproductStore,   // same store GridPanel is using    uploadMaterialRecordsStore
        //         dock: 'bottom',
        //         displayInfo: true,
        //         displayMsg:'显示{0}-{1}条，共{2}条',
        //         emptyMsg:'无数据'
        //     }
        // ];

        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar1]
        },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar]
            },
        ];

        this.items = [ grid ];
        this.callParent(arguments);

    }

})

