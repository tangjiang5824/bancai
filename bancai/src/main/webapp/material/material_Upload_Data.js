Ext.define('material' +
    '.material_Upload_Data', {
    extend : 'Ext.panel.Panel',
    id:'material_Upload_Data',
    region : 'center',
    layout : "fit",
    title : '原材料批量入库',
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
        var tableName="material_store";
        //var materialtype="1";

        //新增表项和保存的按钮

        var MaterialStore = Ext.create('Ext.data.Store',{
            id: 'MaterialStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,

                        //materialType:materialType

                    });
                }

            }


        });

        //错误提示，弹出框
        var errorlistStore = Ext.create('Ext.data.Store',{
            id: 'errorlistStore',
            autoLoad: true,
            fields: [],
            //pageSize: itemsPerPage, // items per page
            data:[],
            editable:false,
        });

        //弹出框，出入库详细记录
        var specific_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'specific_errorlist_outbound',
            // tbar: toolbar_pop,
            store:errorlistStore,//oldpanellogdetailList，store1的数据固定
            dock: 'bottom',
            columns:[
                {
                    dataIndex : '序号',
                    text : 'excel中错误序号',
                    width : "80",
                    flex:1
                    // renderer:function(value,metadata,record,rowIndex){
                    // 	return　record_start_pop　+　1　+　rowIndex;
                    // }
                },
                {
                    dataIndex: '原材料名',
                    text: '原材料名',
                    flex :1,
                    width:"80"
                },
                {
                    dataIndex: '总重',
                    text: '总重',
                    flex :1,
                    width:"80"
                },
                {
                    dataIndex: '数量',
                    text: '数量',
                    flex :1,
                    width:"80"
                },
                {
                    text: '仓库名称',
                    dataIndex: '仓库名称',
                    flex :1,
                    width:"80"
                },
                {
                    text: '备注',
                    dataIndex: '备注',
                    flex :1,
                    width:"80"
                },
                {
                    text: '错误原因',
                    dataIndex: '错误原因',
                    flex :1,
                    width:"280"
                    // dataIndex: 'errorCode',
                    // renderer: function (value) {
                    // 	return designlist.errorcode.type[value].name; // key-value
                    // },
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
        });

        var win_errorInfo_outbound = Ext.create('Ext.window.Window', {
            // id:'win_errorInfo_outbound',
            title: '错误详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            // tbar:toolbar_pop1,
            items:specific_errorlist_outbound,
        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsmaterial',
            store: MaterialStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [

                // { text: '材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '品号',  dataIndex: 'materialNo' ,flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '长1', dataIndex: 'length', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '长2', dataIndex: 'length2', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '类型', dataIndex: 'materialType',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                // { text: '宽1', dataIndex: 'width', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '宽2', dataIndex: 'width2', flex :0.7 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '数量', dataIndex: 'number', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                // { text: '成本', dataIndex: 'cost', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '规格',  dataIndex: 'specification' ,flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '库存单位', dataIndex: 'inventoryUnit', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '仓库编号', dataIndex: 'warehouseNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '位置-行', dataIndex: 'rowNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                // { text: '位置-列', dataIndex: 'columNo',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}

                {
                    dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    //width : 160,
                    flex :1
                },
                {
                    dataIndex : 'materialName',
                    name : '原材料名',
                    text : '原材料名',
                    //width : 110,
                    flex :1
                    //defaultValue:"2333",
                },

                // {
                //     dataIndex : 'inventoryUnit',
                //     text : '库存单位',
                //     //width : 110,
                //     flex :1,
                //     editor : {// 文本字段
                //         id : 'isNullCmb',
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },
                {
                    dataIndex : '单重',
                    name : '单重',
                    text : '单重',
                    //width : 160,
                    flex :1
                },
                {
                    dataIndex : '单面积',
                    name : '单面积',
                    text : '单面积',
                    //width : 160,
                    flex :1
                },
                {
                    dataIndex : 'totalWeight',
                    name : '总重',
                    text : '总重',
                    flex :1

                },{
                    dataIndex : 'totalArea',
                    name : '总面积',
                    text : '总面积',
                    flex :1

                },

                {
                    dataIndex : 'count',
                    name : '数量',
                    text : '数量',
                    flex :1
                    //width : 160,

                },
                {
                    dataIndex : 'warehouseName',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    flex :1

                },
                {
                    dataIndex : 'description',
                    name : '备注',
                    text : '备注',
                    //width : 130,
                    flex :1

                }
                //
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: MaterialStore,   // same store GridPanel is using    uploadMaterialRecordsStore
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }],
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

        var form = Ext.create("Ext.form.Panel", {
            border : false,
            items : [
                {
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
                                       // var operator=Ext.getCmp("operator").getValue();
                                        form.submit({
                                            url : 'uploadMaterialExcel.do', //上传excel文件，并回显数据
                                            waitMsg : '正在上传...',
                                            params : {
                                                // tableName:tableName
                                                //materialtype:materialtype,
                                                //check:check
                                            },
                                            success : function(form, action) {
                                                //上传成功
                                                var response = action.result;
                                                //回显
                                                console.log(action.result['value']);
                                                Ext.MessageBox.alert("提示", "上传成功!");
                                                //重新加载数据
                                                MaterialStore.loadData(action.result['value']);

                                            },
                                            failure : function(form, action) {
                                                var response = action.result;
                                                switch (response.errorCode) {
                                                    case 100:
                                                        Ext.Msg.show({
                                                            title: '提示',
                                                            message: '匹配失败，产品位置重复或品名不合法！\n是否查看具体错误数据',
                                                            buttons: Ext.Msg.YESNO,
                                                            icon: Ext.Msg.QUESTION,
                                                            fn: function (btn) {
                                                                if (btn === 'yes') {
                                                                    //点击确认，显示重复的数据
                                                                    errorlistStore.loadData(response.errorlist);
                                                                    win_errorInfo_outbound.show();
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    case 1000:
                                                        Ext.MessageBox.alert("错误", "上传文件出现未知错误，请检查上传文件格式！<br>若无法解决问题，请联系管理员！");
                                                        Ext.MessageBox.alert("错误原因", response.msg);
                                                        break;
                                                    default:
                                                        Ext.MessageBox.alert("错误", "上传失败");
                                                }

                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }

            ]
        });


        var tableNameList =  Ext.create('Ext.data.Store', {
            fields: ['tableName'],
            data : [
                {tableName:"原材料信息表"},
                {tableName:"旧版信息表"},
                {tableName:"产品信息表"}
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

        //防止按钮重复点击，发送多次请求，post_flag
        var post_flag = false;

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
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '确认入库',
                    margin: '0 0 0 0',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {
                        if(post_flag){
                            return;
                        }
                        post_flag = true;

                        // var projectId = "-1";
                        // var buildingId = "-1";

                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('uploadRecordsmaterial').getStore()
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
                            url : '/material/addData.do', //原材料入库
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                s : "[" + s + "]",
                                // projectId : projectId,
                                // buildingId : buildingId,
                                operator: Ext.getCmp('operator').getValue(),
                                // inputTime:Ext.getCmp('operator').getValue(),
                            },
                            success : function(response) {
                                var res = response.responseText;
                                var jsonobj = JSON.parse(res);//将json字符串转换为对象
                                console.log(jsonobj);
                                console.log("success--------------",jsonobj.success);
                                console.log("errorList--------------",jsonobj['errorList']);
                                var success = jsonobj.success;
                                var Msg=jsonobj.msg;
                                var errorCode = jsonobj.errorCode;
                                if(success == false){
                                    //错误输入
                                    Ext.MessageBox.alert("提示",Msg);

                                    post_flag =false;

                                }else{
                                    Ext.MessageBox.alert("提示","入库成功" );
                                    //刷新
                                    Ext.getCmp('uploadRecordsmaterial').getStore().remove();

                                    post_flag =false;
                                }

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","入库失败" );

                                post_flag =false;
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
                        if(tableName=='原材料信息表'){
                            window.location.href = encodeURI('excel/原材料入库信息表.xls');
                        }else{
                            window.location.href = encodeURI('excel/旧版信息表.xls');
                            //window.location.href = encodeURI('data/downloadExcelTemplate.do?tableName=' + tableName);
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

        this.dockedItems = [toolbar1,toolbar,grid,
            {
                xtype: 'pagingtoolbar',
                store: MaterialStore,   // same store GridPanel is using    uploadMaterialRecordsStore
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }
        ];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

