Ext.define('material.material_Back', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '原材料退库',
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
        var tableName="material_info";
        //var materialtype="1";

        //方法重写，表单验证，必填项加*号
        Ext.override(Ext.form.field.Base,{
            initComponent:function(){
                if(this.allowBlank!==undefined && !this.allowBlank){
                    if(this.fieldLabel){
                        this.fieldLabel += '<font color=red>*</font>';
                    }
                }
                this.callParent(arguments);
            }
        });

        var projectListStore = Ext.create('Ext.data.Store',{
            fields : ['id'],
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
            fieldLabel : '项目名称',
            labelWidth : 70,
            // width : '35%',
            width : 500,
            id :  'projectId',
            name : 'projectId',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
            allowBlank:false,
            blankText  : "项目名不能为空",
            listeners: {
                // select: function(combo, record, index) {
                //     console.log(record[0].data.projectName);
                // }
                //下拉框默认返回的第一个值
                render: function (combo) {//渲染
                    combo.getStore().on("load", function (s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });

                },

                select: function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store', {
                        fields: ['buildingName'],
                        proxy: {
                            type: 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=' + tableName + '&columnName=' + projectId + '&columnValue=' + id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
                            reader: {
                                type: 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad: true,
                        listeners: {
                            load: function () {
                                Ext.getCmp('buildingId').setValue("");
                            }
                        }
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);
                }
            }
        });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            margin: '0 10 0 40',
            id :  'buildingId',
            name : 'buildingId',
            matchFieldWidth: false,
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            allowBlank:false,
            blankText  : "楼栋不能为空",
            //store: tableListStore2,
            listeners: {
                load:function () {

                }
            }
        });

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
            autoLoad : true
        });
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 230,
            id :  'materialId',
            name : 'materialId',
            matchFieldWidth: true,
            allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'id',
            editable : false,
            store: MaterialNameList,
            // listeners:{
            //     select: function(combo, record, index) {
            //         var type = MaterialTypeList.rawValue;
            //         //选中后
            //         var select = record[0].data;
            //         console.log("select=========",select)
            //         var specification = select.specification;
            //         var width = select.width;
            //         var inventoryUnit = select.inventoryUnit;
            //         var description = select.description;
            //         //设置其他的值
            //         Ext.getCmp("specification").setValue(specification);//开始时间
            //         Ext.getCmp("width").setValue(width);//开始时间
            //         Ext.getCmp("stockUnit").setValue(inventoryUnit);//开始时间
            //     }
            // }

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
            width : 180,
            margin: '0 10 0 40',
            id :  'warehouseName',
            // name : 'warehouseName',
            hiddenName:'warehouseName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'id',
            // value:'101',
            editable : false,
            store: storeNameList,

            // listeners:{
            //     select: function(combo, record, index) {
            //         var type = MaterialTypeList.rawValue;
            //         //console.log(MaterialTypeList.rawValue)//选择的值
            //         console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
            //         //选中后
            //         var select = record[0].data;
            //         var warehouseNo = select.warehouseNo;
            //         console.log(warehouseNo)
            //
            //         //重新加载行选项
            //         var locationNameList_row = Ext.create('Ext.data.Store',{
            //             id:'locationNameList_row',
            //             fields : ['rowNum'],
            //             proxy : {
            //                 type : 'ajax',
            //                 url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
            //                 reader : {
            //                     type : 'json',
            //                     rootProperty: 'rowNum',
            //                 }
            //             },
            //             autoLoad : true
            //         });
            //         speificLocation_row.setStore(locationNameList_row);
            //
            //         //重新加载列选项
            //         var locationNameList_col = Ext.create('Ext.data.Store',{
            //             id:'locationNameList_col',
            //             fields : [ 'columnNum'],
            //             proxy : {
            //                 type : 'ajax',
            //                 url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
            //                 reader : {
            //                     type : 'json',
            //                     rootProperty: 'columnNum',
            //                 }
            //             },
            //             autoLoad : true
            //         });
            //         speificLocation_col.setStore(locationNameList_col);
            //
            //     }
            // }
        });

        //仓库存放位置--行
        // var locationNameList_row = Ext.create('Ext.data.Store',{
        //     fields : [ 'columnNum'],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'material/findStorePosition.do',
        //         reader : {
        //             type : 'json',
        //             rootProperty: 'columnNum',
        //         }
        //     },
        //     autoLoad : true
        // });
        var speificLocation_row = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '行',
            labelWidth : 20,
            width : 80,
            margin: '0 10 0 10',
            id :  'speificLocation_row',
            name : 'speificLocation_row',
            matchFieldWidth: false,
            //emptyText : "--请选择--",
            displayField: 'rowNum',
            valueField: 'rowNum',
            editable : false,
            //store: locationNameList_row,
            listeners:{
                select: function(combo, record, index) {
                    var type = MaterialTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }
        });
        //仓库存放位置--列
        // var locationNameList_col = Ext.create('Ext.data.Store',{
        //     fields : [ 'columnNum'],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'material/findStorePosition.do',
        //         reader : {
        //             type : 'json',
        //             rootProperty: 'columnNum',
        //         }
        //     },
        //     autoLoad : true
        // });
        var speificLocation_col = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '列',
            labelWidth : 20,
            width : 80,
            id :  'speificLocation_col',
            name : 'speificLocation_col',
            matchFieldWidth: false,
            //emptyText : "--请选择--",
            displayField: 'columnNum',
            valueField: 'columnNum',
            editable : false,
            //store: locationNameList_col,
            listeners:{
                select: function(combo, record, index) {
                    var type = MaterialTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }
        });

        var toolbar0 = Ext.create('Ext.toolbar.Toolbar', {
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>创建原材料退库单:</strong>',
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

        var archive_form = new Ext.form.FormPanel({
            // title:'新建原材料退库表',
            id:'formMain',
            autoHeight: true,
            autoWidth: true,
            layout: 'form',
            border: false,
            bodyStyle:'text-align:center;',
            // height:700,
            // baseCls : 'my-panel-no-border',  //去掉边框
            //居中
            // layout: {
            //     align: 'middle',
            //     pack: 'center',
            //     type: 'vbox'
            // },
            items: [{
                columnWidth: .3,
                rowHeight:200,
                xtype: 'fieldset',
                title: '基本信息',
                layout: 'form',
                defaults: {anchor: '95%'},
                style: 'margin-left: 5px;padding-left: 5px;',
                width:500,
                bodyStyle:'text-align:center;margin-top:5px;',
                // 第一列中的表项
                // style:"margin-top:50px;",
                fieldDefaults:{
                    labelAlign:'right',
                    labelWidth:80,
                },
                items:[{
                    xtype: 'container',
                    layout:'column',
                    style:"margin-top:5px;",
                    items:[{
                        xtype: 'container',
                        columnWidth:.6,
                        layout: 'form',
                        height:30,
                        border:true,
                        style:"margin-left:10px;",
                        items:[
                            // {
                            //         xtype: 'textfield',
                            //         margin: '0 40 0 0',
                            //         fieldLabel: '退库人',
                            //         id: 'operator',
                            //         // width: 140,
                            //         // labelWidth: 50,
                            //         name: 'operator',
                            //         value: "",
                            //         allowBlank:false,
                            //         blankText  : "退库人姓名不能为空"
                            //     },
                            {
                                fieldLabel : '退库人',
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
                                allowBlank:false,
                                blankText  : "退库人姓名不能为空"
                            },
                        ]}]},
                    // {
                    //     xtype: 'container',
                    //     layout:'column',
                    //     items:[{
                    //         xtype: 'container',
                    //         columnWidth:.6,
                    //         layout: 'form',
                    //         height:40,
                    //         border:true,
                    //         items:[{
                    //             xtype: 'datefield',
                    //             margin: '0 10 0 0',
                    //             fieldLabel: '退库时间',
                    //             id: 'backTime',
                    //             labelWidth : 60,
                    //             width : 180,
                    //             height:80,
                    //             name: 'backTime',
                    //             value: "",
                    //             format : 'Y-m-d',
                    //             editable : false,
                    //             matchFieldWidth: true,
                    //             style:"margin-top:50px;",
                    //         }
                    //         ]}]},

                    ]
            }, {
                columnWidth: .3,
                xtype: 'fieldset',
                title: '退库信息',
                layout: 'form',
                defaults: {anchor: '95%'},
                style: 'margin-left: 5px;padding-left: 5px;',
                width:500,
                // 第二列中的表项
                bodyStyle:'text-align:center;',
                items:[
                    //行的宽度

                    // {xtype: 'container',
                    //     layout:'column',
                    //     items:[{
                    //         xtype: 'container',
                    //         columnWidth:1,
                    //         layout: 'form',
                    //         height:30,
                    //         border:true,
                    //         items:[projectList]
                    //     }]
                    // },
                    // {
                    //     xtype: 'container',
                    //     layout:'column',
                    //     items:[{
                    //         xtype: 'container',
                    //         columnWidth:.5,
                    //         layout: 'form',
                    //         height:30,
                    //         border:true,
                    //         items:[buildingName]
                    //     }]
                    // },
                    //
                    projectList,
                    buildingName,
                    MaterialTypeList,
                    // {
                    //     xtype: 'textfield',
                    //     margin: '0 10 0 40',
                    //     fieldLabel: '规格',
                    //     id: 'specification',
                    //     width: 140,
                    //     labelWidth: 30,
                    //     name: 'specification',
                    //     value: "",
                    //     allowBlank:false,
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     margin: '0 10 0 40',
                    //     fieldLabel: '宽',
                    //     id: 'width',
                    //     labelWidth : 50,
                    //     width : 180,
                    //     name: 'width',
                    //     value: "",
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     // margin: '0 10 0 0',
                    //     fieldLabel: ' 库存单位',
                    //     id: 'stockUnit',
                    //     width: 230,
                    //     labelWidth: 70,
                    //     name: 'stockUnit',
                    //     value: "",
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     margin: '0 10 0 40',
                    //     fieldLabel: '单重',
                    //     id: 'unitWeight',
                    //     width: 180,
                    //     labelWidth: 30,
                    //     name: 'unitWeight',
                    //     value: "",
                    // },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '总重',
                        id: 'totalWeight',
                        width: 180,
                        labelWidth: 30,
                        name: 'totalWeight',
                        value: "",
                    },
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '数量',
                        id: 'count',
                        width: 140,
                        labelWidth: 30,
                        name: 'count',
                        value: "",
                        allowBlank:false,
                    },

                    storePosition,
                    // {xtype: 'textfield',fieldLabel: '职工类别',name: 'personType'}
                ]
            }],
            buttonAlign:"left",
            buttons :  [{
                    text: "退库",
                    // formBind:true,//将表单和button绑定
                    handler : function(btn) { // 按钮响应函数
                        Ext.Msg.show({
                            title: '操作确认',
                            message: '原材料将退库，选择“是”、“否”确认？',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                console.log("btn:----",btn)
                                // console.log("operatorName:----",Ext.getCmp('formMain').getForm().findField('projectName').getValue())
                                // console.log("projectid:----",Ext.getCmp('formMain').getForm().findField('projectName').value)
                                if (btn === 'yes') {
                                    Ext.getCmp('formMain').getForm().submit({
                                        url: 'material/backmaterial.do', //原材料退库
                                        method: 'POST',
                                        //submitEmptyText : false,
                                        params: {
                                            //怎么获取form字段的值
                                            // operator: Ext.getCmp('formMain').getForm().findField('operator').getValue(),
                                            // backTime: Ext.getCmp('formMain').getForm().findField('backTime').getValue(),
                                            // // projectName: Ext.getCmp('formMain').getForm().findField('projectName').rawValue,//名称
                                            // // buildingName: Ext.getCmp('formMain').getForm().findField('buildingName').rawValue,
                                            // // materialName: Ext.getCmp('formMain').getForm().findField('materialName').rawValue,
                                            // // projectId: Ext.getCmp('formMain').getForm().findField('projectName').value,//id
                                            // // buildingId: Ext.getCmp('formMain').getForm().findField('buildingName').value,
                                            // // materialId: Ext.getCmp('formMain').getForm().findField('materialName').value,
                                            // // // specification: Ext.getCmp('formMain').getForm().findField('specification').getValue(),
                                            // // width: Ext.getCmp('formMain').getForm().findField('width').getValue(),
                                            // totalWeight: Ext.getCmp('formMain').getForm().findField('totalWeight').getValue(),
                                            // count: Ext.getCmp('formMain').getForm().findField('count').getValue(),
                                            warehouseName: Ext.getCmp('formMain').getForm().findField('warehouseName').rawValue

                                        },
                                        waitMsg: '请稍等,正在退库',
                                        success: function (response) {
                                            //var message =Ext.decode(response.responseText).showmessage;
                                            Ext.MessageBox.alert("提示", "退库成功");
                                        },
                                        failure: function (response) {
                                            //var message =Ext.decode(response.responseText).showmessage;
                                            Ext.MessageBox.alert("提示", "退库失败");
                                        }
                                    })
                                }
                            }
                        })
                    },
                }]

        });
        var form = new Ext.form.FieldSet({
            // title: '新建原材料退库表',
            layout: 'form',
            border:false,
            defaults: {anchor: '95%'},
            style: 'margin-left: 5px;padding-left: 5px;',
            height:700,
            // 第二列中的表项
            // bodyStyle:'text-align:center;',
            // layout: {
            //     align: 'middle',
            //     pack: 'center',
            //     type: 'vbox'
            // },
            items: [archive_form]
        });

        // this.tbar = toolbar0;
        this.dockedItems = [{
                xtype : 'toolbar',
                dock : 'top',
                items : [toolbar0]
            },
            form];
        // this.items = [ archive_form ];
        this.callParent(arguments);

    }

})

