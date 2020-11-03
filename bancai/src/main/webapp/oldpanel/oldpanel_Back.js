Ext.define('oldpanel.oldpanel_Back', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '旧板退库',
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
            width : 210,
            margin: '0 40 0 0',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehousename',
            valueField: 'warehousename',
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

                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });

        var projectNameListStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
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
        var projectNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 60,
            margin: '0 40 0 0',
            width : 550,
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectNameListStore,
            listeners: {

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });

                },

                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
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

                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedProjectName.do',
                    // 	params:{
                    // 		projectName:Ext.getCmp('projectName').getValue()
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })
                }
            }

        });
        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 60,
            width : 300,
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
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
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                projectNameList,
                buildingName,
            ]
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {xtype: 'textfield', fieldLabel: '旧板品名', id: 'oldpanelName', width: 300, labelWidth: 60,
                    margin: '0 40 0 0',
                    name: 'oldpanelNo', value: ""},
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
                {xtype: 'textfield', fieldLabel: '入库数量', id: 'count', width: 190, labelWidth: 65, margin: '0 40 0 0',  name: 'count', value: ""},

                {xtype : 'button',
                    margin: '0 40 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        //var classificationName = Ext.getCmp('classification').getValue();
                        var oldpanelName = Ext.getCmp('oldpanelName').getValue();
                        //var inventoryUnit = Ext.getCmp('inventoryUnit').getValue();
                        var count = Ext.getCmp('count').getValue();
                        //var unitWeight = Ext.getCmp('unitWeight').getValue();
                        //var unitArea = Ext.getCmp('unitArea').getValue();
                        //var remark = Ext.getCmp('remark').getValue();
                        var warehouseName = Ext.getCmp('storePosition').getValue();
                        var data = [{
                            'oldpanelName' : oldpanelName,
                            //'classificationName':classificationName,
                            //'inventoryUnit' : inventoryUnit,
                            //'unitArea' : unitArea,
                            //'unitWeight' : unitWeight,
                            'warehouseName':warehouseName,
                            //'remark' : remark,
                            'count' : count,
                        }];
                        //点击查询获得输入的数据
                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        //若品名未填则添加失败
                        if (oldpanelName != ''&&count!= '') {
                            Ext.getCmp('addDataGrid').getStore().loadData(data, true);
                            //清除框里的数据
                            Ext.getCmp('oldpanelName').setValue('');
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
                }
            ]
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
                    xtype: 'textfield',
                    margin: '0 20 0 0',
                    fieldLabel: ' 退库人',
                    id: 'operator',
                    width: 150,
                    labelWidth: 45,
                    name: 'operator',
                    value: "",
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '确认退库',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('addDataGrid').getStore()
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
                                projectId : Ext.getCmp('projectName').getValue(),
                                buildingId : Ext.getCmp('buildingName').getValue(),
                                operator: Ext.getCmp('operator').getValue(),
                            },
                            success : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","退库成功" );
                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","退库失败" );
                            }
                        });

                    }
                }]
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            //dockedItems : [toolbar2],
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
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'count', text : '入库数量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {
                    name : '操作',
                    text : '操作',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                }

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
            selType : 'checkboxmodel'//'rowmodel'
        });

        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('addDataGrid').columns[columnIndex-1].text;

            console.log("列名：",fieldName)
            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('addDataGrid').getSelectionModel();
                var oldpanelArr = sm.getSelection();
                if (oldpanelArr.length != 0) {
                    Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                        if (btn == 'yes') {
                            //先删除后台再删除前台
                            //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据

                            //Extjs 4.x 删除
                            Ext.getCmp('addDataGrid').getStore().remove(oldpanelArr);
                        } else {
                            return;
                        }
                    });
                } else {
                    //Ext.Msg.confirm("提示", "无选中数据");
                    Ext.Msg.alert("提示", "无选中数据");
                }
            }


            console.log("rowIndex:",rowIndex)
            console.log("columnIndex:",columnIndex)
            // var record = grid.getStore().getAt(rowIndex);
            // var id = record.get('id');
            // var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
            // if (fieldName == "c_reply") {
            //     Ext.Msg.alert('c_reply', rowIndex + "  -  " + id);
            // }else if (fieldName == "c_agree") {
            //     Ext.Msg.alert('c_agree', rowIndex + "  -  " + id);
            // }

        };

        this.dockedItems = [
            //toolbar,
            toolbar1,
            toolbar2, grid, toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

