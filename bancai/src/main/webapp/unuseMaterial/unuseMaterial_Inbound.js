Ext.define('unuseMaterial.unuseMaterial_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '废料入库',
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
        //var materialtype="1";
        var record_start = 0;
        var itemsPerPage = 50;
        // var projectId = "-1";
        // var buildingId = "-1";
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
            // fieldLabel : '入库仓库',
            // labelWidth : 60,
            // width : 200,
            // margin: '0 30 0 0',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'warehouseName',
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
        var oldpanelTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '旧板类型',
            labelWidth : 70,
            width : 230,
            id :  'oldpanelType',
            name : 'oldpanelType',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'oldpanelTypeName',
            valueField: 'oldpanelType',
            editable : false,
            store: oldPanelNameList,
            listeners:{
                select: function(combo, record, index) {
                    // console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
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

                    // console.log(classificationList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });

        //单条录入
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype:'tbtext',
                    text:'<strong>单条录入:</strong>',
                    margin: '0 40 0 0',
                },
                // {xtype: 'textfield', fieldLabel: '品名', id: 'productName', width: 300, labelWidth: 30,
                //     margin: '0 30 0 0',
                //     name: 'productName', value: ""},
                // storePosition,
                // {xtype: 'textfield', fieldLabel: '入库数量', id: 'count', margin: '0 30 0 0', width: 190, labelWidth: 60,  name: 'count', value: ""},

                {   xtype : 'button',
                    margin: '0 30 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加新退料',
                    handler: function(){
                        // var productName = Ext.getCmp('productName').getValue();
                        // var count = Ext.getCmp('count').getValue();
                        // var warehouseName = Ext.getCmp('storePosition').rawValue;
                        // var data = [{
                        //     'productName' : productName,
                        //     'warehouseName':warehouseName,
                        //     'count' : count,
                        // }];
                        var data = [{
                            'productName' : '',
                            'warehouseName':'',
                            'count' : '',
                            'inventoryUnit':'',
                            'remark':'',
                        }];
                        Ext.getCmp('waste_addDataGrid').getStore().loadData(data, true);
                        //若品名未填则添加失败
                        // if (productName != ''&&count!= '') {
                        //     Ext.getCmp('waste_addDataGrid').getStore().loadData(data, true);
                        //     //清除框里的数据
                        //     Ext.getCmp('productName').setValue('');
                        //     //Ext.getCmp('classification').setValue('');
                        //     //Ext.getCmp('inventoryUnit').setValue('');
                        //     //Ext.getCmp('unitWeight').setValue('');
                        //     //Ext.getCmp('unitArea').setValue('');
                        //     Ext.getCmp('count').setValue('');
                        //     Ext.getCmp('storePosition').setValue('');
                        //     //Ext.getCmp('remark').setValue('');
                        //     Ext.getCmp('operator').setValue('');
                        // }else{
                        //     Ext.MessageBox.alert("警告","品名、入库数量不能为空",function(r) {
                        //         //    r = cancel||ok
                        //     });
                        // }
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
                        var sm = Ext.getCmp('waste_addDataGrid').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('waste_addDataGrid').getStore().remove(oldpanelArr);
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
        var waste_inb_errorlistStore = Ext.create('Ext.data.Store',{
            id: 'waste_inb_errorlistStore',
            autoLoad: true,
            fields: ['productName','position'],
            //pageSize: itemsPerPage, // items per page
            data:[],
            editable:false,
        });

        //弹出框，出入库详细记录
        var waste_inb_errorlist_outbound=Ext.create('Ext.grid.Panel',{
            id : 'waste_inb_errorlist_outbound',
            // tbar: toolbar_pop,
            store:waste_inb_errorlistStore,//oldpanellogdetailList，store1的数据固定
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
                    text: '废料名称',
                    dataIndex: 'wasteName',
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
                    text: '库存单位',
                    flex :1,
                    dataIndex: 'inventoryUnit',
                },
                {
                    text: '备注',
                    flex :1,
                    dataIndex: 'remark',
                },
                {
                    text: '错误原因',
                    flex :1,
                    dataIndex: 'errorType',
                }
                //fields:['oldpanelId','oldpanelName','count'],specification

            ],
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
            },
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
        });

        var win_wasteinb_errorInfo_outbound = Ext.create('Ext.window.Window', {
            // id:'win_wasteinb_errorInfo_outbound',
            title: '错误详情',
            height: 500,
            width: 750,
            layout: 'fit',
            closable : true,
            draggable:true,
            closeAction : 'hidden',
            // tbar:toolbar_pop1,
            items:waste_inb_errorlist_outbound,
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
        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,
            margin : '0 30 0 0',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        // combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },
                select:function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    //console.log(id)
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
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 30 0 0',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
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
                //项目名
                projectList,
                //楼栋名
                buildingName,
                {
                    fieldLabel : '入库人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
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
                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('waste_addDataGrid').getStore()
                            .getData();
                        var s = new Array();
                        select.each(function(rec) {
                            //delete rec.data.id;
                            s.push(JSON.stringify(rec.data));
                            //alert(JSON.stringify(rec.data));//获得表格中的数据
                        });
                        //console.log(s);
                        //显示匹配进度
                        Ext.MessageBox.show(
                            {
                                title:'请稍候',
                                msg:'数据上传中，请耐心等待...',
                                progressText:'',    //进度条文本
                                width:300,
                                progress:true,
                                closable:false
                            }
                        );

                        //获取数据
                        //获得当前操作时间
                        //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                        Ext.Ajax.request({
                            url : 'waste/addData.do', //入库
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                s : "[" + s + "]",
                                projectId : Ext.getCmp("projectName").getValue(),
                                buildingId : Ext.getCmp("buildingName").getValue(),
                                operator: Ext.getCmp('operator').getValue(),
                            },
                            success : function(response) {
                               // console.log("12312312312321",response.responseText);
                                // if(response.responseText.includes("false"))
                                // {
                                //     Ext.MessageBox.alert("提示","入库失败，品名不规范" );
                                // }
                                // //var message =Ext.decode(response.responseText).showmessage;
                                // else{
                                //     Ext.MessageBox.alert("提示","入库成功" );
                                // }
                                //关闭进度条
                                Ext.MessageBox.hide();

                                 var res = response.responseText;
                                var jsonobj = JSON.parse(res);//将json字符串转换为对象
                               // console.log(jsonobj);
                               // console.log("success--------------",jsonobj.success);
                               // console.log("errorList--------------",jsonobj['errorList']);
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
                                            message: '入库失败！提交的数据存在错误内容',
                                            buttons: Ext.Msg.YESNO,
                                            icon: Ext.Msg.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'yes') {
                                                    //点击确认，显示重复的数据
                                                    waste_inb_errorlistStore.loadData(errorList);
                                                    win_wasteinb_errorInfo_outbound.show();
                                                }
                                            }
                                        });
                                    }
                                    else if(errorCode == 100){
                                        Ext.MessageBox.alert("提示","入库失败！提交的数据为空" );
                                    }
                                    else if(errorCode == 300){
                                        Ext.MessageBox.alert("提示","入库失败！未选择项目或楼栋" );
                                    }
                                    else if(errorCode == 400){
                                        Ext.MessageBox.alert("提示","入库失败！未选择入库人" );
                                    }
                                    else if(errorCode == 1000){
                                        Ext.MessageBox.alert("提示","入库失败，未知错误！请联系管理员" );
                                    }
                                }else{
                                    Ext.MessageBox.alert("提示","入库成功" );

                                    //重新加载表格
                                    Ext.getCmp('waste_addDataGrid').getStore().removeAll();
                                }
                            },
                            failure : function(response) {
                                //关闭进度条
                                Ext.MessageBox.hide();
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","入库失败" );
                            }
                        });

                    }
                }]
        });

        //模板
        var tableNameList =  Ext.create('Ext.data.Store', {
            fields: ['tableName'],
            data : [
                {tableName:"废料信息表"},
                // {tableName:"成品信息表"},
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
                                            url : 'waste/uploadExcel.do', //上传excel文件，并回显数据
                                            waitMsg : '正在上传...',
                                            params : {
                                                // tableName:tableName,
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
                                            //     wasteStore.loadData(action.result['value']);
                                            // },
                                            success : function(exceluploadform,response, action) {
                                              //  console.log("response=========================>",response);
                                                Ext.MessageBox.alert("提示", "上传成功!");
                                                var List = response.result['value'];
                                              //  console.log("List=========================>List",List)
                                                var success =response.result['success'];

                                              //  console.log("success=========================>success",success)
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
                                                                // old_up_errorlistStore.loadData(errorList);
                                                                // win_oldup_errorInfo_outbound.show();
                                                            }
                                                        }
                                                    });

                                                }else{
                                                    Ext.MessageBox.alert("提示", "上传成功!");
                                                    //重新加载数据
                                                    wasteStore.loadData(List);
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

        var wasteStore = Ext.create('Ext.data.Store',{
            id: 'wasteStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            data:[],
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'waste_addDataGrid',
            store:wasteStore,
            columns : [
                {dataIndex : 'wasteName', text : '品名', flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
                {   dataIndex : 'warehouseName',
                    text : '入库仓库',
                    flex :1,
                    editor:storePosition,renderer:function(value, cellmeta, record){
                     //   console.log(storeNameList.find('warehouseName','105'));
                     //   console.log(storeNameList.find('id','1'));
                        var index = storeNameList.find(storePosition.valueField,value);
                        var ehrRecord = storeNameList.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('warehouseName');
                        }
                        return returnvalue;
                    },
                    render:{}

                },
                {dataIndex : 'count', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
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
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            // selType : 'checkboxmodel'//'rowmodel'
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

        this.items = [ grid ];
        this.callParent(arguments);

    }

})

