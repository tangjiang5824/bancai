Ext.define('material.material_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '原材料入库',
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
        var tableName="material_info";
        //var materialtype="1";

        var record_start = 0;

        //原材料类型
        var MaterialNameList = Ext.create('Ext.data.Store',{
            fields : [ 'materialName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,
                reader : {
                    type : 'json',
                    rootProperty: 'material_info',
                },
                fields : ['id','materialName']
            },

            // //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true

        });
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            // fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 230,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: true,
            allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'materialName',
            // valueField: 'id',
            triggerAction: 'all',
            editable : false,
            mode: 'local',
            store: MaterialNameList,
            //原材料品名应该包含基础信息中的其他属性值，作为描述信息
            listeners:{
                select: function(combo, record, index) {
                    //下拉框选择的一条记录，所有信息
                    var select = record[0].data;
                    var partNo = select.partNo;
                    var sc = Ext.getCmp('material_addDataGrid').getSelectionModel().getSelection();
                    sc[0].set('partNo',partNo);
                }
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
            margin: '0 0 0 21',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'warehouseName',
            editable : false,
            store: storeNameList,
            listeners:{
                select: function(combo, record, index) {
                }
            }
        });

        //单条录入和添加记录按钮
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype:'tbtext',
                    text:'<strong>单条录入:</strong>',
                    margin: '0 40 0 0',
                },
                {   xtype : 'button',
                    margin: '0 40 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加记录',
                    handler: function(){

                        // var productName = Ext.getCmp('productName').getValue();
                        // var count = Ext.getCmp('count').getValue();
                        // var warehouseName = Ext.getCmp('storePosition').rawValue;
                        var data = [{
                            'materialId' : '',
                            'materialName' : '',
                            'partNo' : '',
                            'totalWeight' : '',
                            'totalArea':'',
                            'count' : '',
                            'warehouseName' : '',
                            'remark' : '',

                        }];
                        Ext.getCmp('material_addDataGrid').getStore().loadData(data, true);
                    }
                },
                //删除行数据
                {
                    xtype : 'button',
                    margin: '0 0 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除',
                    handler: function(){
                        var sm = Ext.getCmp('material_addDataGrid').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('material_addDataGrid').getStore().remove(oldpanelArr);
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
                                                    materialStore.loadData(action.result['value']);

                                                },
                                                failure : function(form, action) {
                                                    var response = action.result;
                                                    switch (response.errorCode) {
                                                        case 100:
                                                            Ext.Msg.show({
                                                                title: '提示',
                                                                message: '上传文件失败,存在错误数据！\n是否查看具体错误数据',
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


        //批量上传下载模板toolbar
        var toolbar4 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items : [
                {
                    xtype:'tbtext',
                    text:'<strong>批量上传:</strong>',
                    margin: '0 40 0 0',
                },
                //模板
                tableList,
                {
                    xtype : 'button',
                    text : '下载模板',
                    margin: '0 40 0 0',
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

                form,
            ]
        });


        //成本 数量 存放位置
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype : 'button',
                    margin: '0 10 0 35',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删 除',
                    width:60,
                    handler: function(){
                        var sm = Ext.getCmp('material_addDataGrid').getSelectionModel();
                        var Arr = sm.getSelection();
                        if (Arr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + Arr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('material_addDataGrid').getStore().remove(Arr);
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

        //防止按钮重复点击，发送多次请求，post_flag
        var post_flag = false;

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
                    valueField : 'id',
                    editable : true,
                },
                {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认入库',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {
                    if(post_flag){
                        return;
                    }
                    post_flag = true;

                    var operator = Ext.getCmp('operator').value;
                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('material_addDataGrid').getStore()
                        .getData();
                    console.log("operator-----------------",operator);

                    var s = new Array();
                    select.each(function(rec) {
                        s.push(JSON.stringify(rec.data));
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                        //s.push();
                    });

                    console.log(select);

                    //获取数据
                    //获得当前操作时间
                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                    Ext.Ajax.request({
                        url : 'material/addData.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:"material_store",
                            //materialType:materialtype,
                            s : "[" + s + "]",
                            operator:operator
                        },
                        success : function(response) {
                            var res = response.responseText;
                            var jsonobj = JSON.parse(res);//将json字符串转换为对象
                            console.log(jsonobj);
                            console.log("success--------------",jsonobj.success);
                            var success = jsonobj.success;
                            var Msg=jsonobj.msg;
                            if(success == false){
                                //错误输入
                                Ext.MessageBox.alert("提示",Msg);
                                post_flag =false;

                            }else{
                                Ext.MessageBox.alert("提示","入库成功" );
                                //刷新
                                Ext.getCmp('material_addDataGrid').getStore().removeAll();
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
            }]
        });

        var materialStore = Ext.create('Ext.data.Store',{
            id: 'materialStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'material_addDataGrid',
            store : materialStore,
            //bbar:,
            columns : [
                {
                    // dataIndex : '序号',
                    name : '序号',
                    text : '序号',
                    width : 60,
                    value:'99',
                    renderer:function(value,metadata,record,rowIndex){
                        return　record_start　+　1　+　rowIndex;
                    }
                },
                {
                    dataIndex : 'materialName',
                    text : '原材料名称',
                    flex :1.8,
                    editor: MaterialTypeList,
                    renderer:function(value, cellmeta, record){
                        var index = MaterialNameList.find(MaterialTypeList.valueField,value);
                        var ehrRecord = MaterialNameList.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('materialName');
                        }
                        return returnvalue;
                    },
                },
                {
                    dataIndex : 'partNo',
                    name : 'partNo',
                    text : '原材料品号',
                    flex :1,
                    //defaultValue:"2333",
                },
                {
                    dataIndex : 'totalWeight',
                    name : 'totalWeight',
                    text : '总重',
                    flex :1,
                    //width : 160,
                    editor : {xtype : 'textfield', allowBlank : false,}
                },
                {
                    dataIndex : 'totalArea',
                    name : 'totalArea',
                    text : '总面积',
                    flex :1,
                    //width : 160,
                    editor : {xtype : 'textfield', allowBlank : false,}
                },
                {
                    dataIndex : 'count',
                    name : 'count',
                    text : '数量',
                    flex :1,
                    //width : 160,
                    editor : {xtype : 'textfield', allowBlank : false,}
                },
                {
                    dataIndex : 'warehouseName',
                    name : 'warehouseName',
                    text : '仓库名称',
                    flex :1,
                    //width : 130,
                    editor : {xtype : 'textfield', allowBlank : false,}
                },
                {
                    dataIndex : 'remark',
                    name : 'remark',
                    text : '备注',
                    flex :1,
                    //width : 130,
                    editor : {xtype : 'textfield', allowBlank : false,}
                },

                // {
                //     // name : '操作',
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
            //selType : 'checkboxmodel'  //rowmodel
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

        this.dockedItems=[
            {
                xtype : 'toolbar',
                dock : 'top',
                items : [toolbar2]
            },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar4]
            },
            {
                xtype : 'toolbar',
                dock : 'top',
                style:'border-width:0 0 0 0;',
                items : [toolbar3]
            },
        ];

        // this.dockedItems = [toolbar,
        //     //toobar,
        //     toolbar1, grid,toolbar3];
        this.items = [ grid ];
        this.callParent(arguments);

    }

})

