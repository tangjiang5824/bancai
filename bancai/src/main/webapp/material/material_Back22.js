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
            id :  'id',
            name : 'id',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
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
                    // projectName:Ext.getCmp('projectName').getValue();
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
                            reader: {
                                type: 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad: true,
                        listeners: {
                            load: function () {
                                Ext.getCmp('buildingName').setValue("");
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
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
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
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: true,
            allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'id',
            editable : false,
            store: MaterialNameList,
            listeners:{
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
            width : 180,
            margin: '0 10 0 40',
            id :  'storePosition',
            name : 'storePosition',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'warehouseName',
            valueField: 'warehouseNo',
            editable : false,
            store: storeNameList,
            listeners:{
                select: function(combo, record, index) {
                    var type = MaterialTypeList.rawValue;
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //选中后
                    var select = record[0].data;
                    var warehouseNo = select.warehouseNo;
                    console.log(warehouseNo)

                    //重新加载行选项
                    var locationNameList_row = Ext.create('Ext.data.Store',{
                        id:'locationNameList_row',
                        fields : ['rowNum'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
                            reader : {
                                type : 'json',
                                rootProperty: 'rowNum',
                            }
                        },
                        autoLoad : true
                    });
                    speificLocation_row.setStore(locationNameList_row);

                    //重新加载列选项
                    var locationNameList_col = Ext.create('Ext.data.Store',{
                        id:'locationNameList_col',
                        fields : [ 'columnNum'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findStorePosition.do?warehouseNo='+warehouseNo,
                            reader : {
                                type : 'json',
                                rootProperty: 'columnNum',
                            }
                        },
                        autoLoad : true
                    });
                    speificLocation_col.setStore(locationNameList_col);

                }
            }
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
            dock : "top",
            items: [
                {
                    xtype: 'textfield',
                    margin: '0 40 0 0',
                    fieldLabel: '退库人',
                    id: 'oprator',
                    width: 140,
                    labelWidth: 50,
                    name: 'oprator',
                    value: "",
                    allowBlank:false,
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    fieldLabel: '退库时间',
                    id: 'backTime',
                    labelWidth : 60,
                    width : 180,
                    name: 'backTime',
                    value: "",
                },
            ]
        });

        // var toolbar0 = Ext.create('Ext.toolbar.Toolbar', {
        //     dock : "top",
        //     items: [
        //         projectList,buildingName
        //     ]
        // });

        //长1 长2 宽1 宽2 库存单位
        // var toolbar = Ext.create('Ext.toolbar.Toolbar', {
        //     dock : "top",
        //     items: [
        //         MaterialTypeList,
        //         {
        //             xtype: 'textfield',
        //             margin: '0 10 0 40',
        //             fieldLabel: '规格',
        //             id: 'length1',
        //             width: 140,
        //             labelWidth: 30,
        //             name: 'length1',
        //             value: "",
        //             allowBlank:false,
        //         },
        //         {
        //             xtype: 'textfield',
        //             margin: '0 10 0 40',
        //             fieldLabel: '横截面',
        //             id: 'width',
        //             labelWidth : 50,
        //             width : 180,
        //             name: 'width',
        //             value: "",
        //         },
        //         {
        //             xtype: 'textfield',
        //             margin: '0 10 0 40',
        //             fieldLabel: '单重',
        //             id: 'unitWeight',
        //             width: 180,
        //             labelWidth: 30,
        //             name: 'unitWeight',
        //             value: "",
        //         },
        //         {
        //             xtype: 'textfield',
        //             margin: '0 10 0 40',
        //             fieldLabel: '总重',
        //             id: 'totalWeight',
        //             width: 180,
        //             labelWidth: 30,
        //             name: 'totalWeight',
        //             value: "",
        //         },
        //     ]
        // });
        //成本 数量 存放位置
        // var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
        //     dock : "top",
        //     items: [
        //
        //         {
        //             xtype: 'textfield',
        //             // margin: '0 10 0 0',
        //             fieldLabel: ' 库存单位',
        //             id: 'stockUnit',
        //             width: 230,
        //             labelWidth: 70,
        //             name: 'stockUnit',
        //             value: "",
        //         },
        //         {
        //             xtype: 'textfield',
        //             margin: '0 10 0 40',
        //             fieldLabel: '数量',
        //             id: 'number',
        //             width: 140,
        //             labelWidth: 30,
        //             name: 'number',
        //             value: "",
        //         },storePosition,
        //         {
        //             xtype:'tbtext',
        //             text:'存放位置 ---',
        //             margin: '0 0 0 35',
        //             //id: 'number',
        //             width: 60,
        //
        //         },
        //         speificLocation_row,
        //         speificLocation_col,
        //         {
        //             xtype : 'button',
        //             margin: '0 10 0 70',
        //             iconAlign : 'center',
        //             iconCls : 'rukuicon ',
        //             text : '添加',
        //             handler: function(){
        //                 var projectId = Ext.getCmp('id').getValue();
        //                 var materialType = Ext.getCmp('materialName').rawValue;
        //                 var length1 = Ext.getCmp('length1').getValue();
        //                 var width1 = Ext.getCmp('width1').getValue();
        //                 var cost = Ext.getCmp('cost').getValue();
        //                 var number = Ext.getCmp('number').getValue();
        //                 //var location = Ext.getCmp('location').getValue();
        //                 //存放位置，行列
        //                 //var locationNameList_row = Ext.getCmp('locationNameList_row').getValue();
        //                 //var locationNameList_col = Ext.getCmp('locationNameList_col').getValue();
        //                 var row = Ext.getCmp('speificLocation_row').getValue();
        //                 var col = Ext.getCmp('speificLocation_col').getValue();
        //                 var warehouse = Ext.getCmp('storePosition').getValue();
        //                 var stockUnit = Ext.getCmp('stockUnit').getValue();
        //                 var data;
        //                 //判断是否有长2、宽2选项,存在时
        //                 //console.log(Ext.getCmp('length2').hidden)
        //                 //console.log("aaaaaa")
        //                 if(Ext.getCmp('length2').hidden==false && Ext.getCmp('width2').hidden==false){
        //                     var length2 = Ext.getCmp('length2').getValue();
        //                     var width2 = Ext.getCmp('width2').getValue();
        //                     data = [{
        //                         'projectId' : projectId,
        //                         '类型' : materialType,
        //                         '长1' : length1,
        //                         '长2' : length2,
        //                         '宽1' : width1,
        //                         '宽2' : width2,
        //                         '数量' : number,
        //                         '成本' : cost,
        //                         //'存放位置' : location,
        //                         '行': row,
        //                         '列': col,
        //                         '品号' : 'a',
        //                         '库存单位' : stockUnit,
        //                         '仓库编号' : warehouse,
        //                         '规格' : '',
        //                         '原材料名称' : ''
        //                     }];
        //                     console.log("bbbbbb");
        //                     // Ext.getCmp('addDataGrid').getStore().loadData(data,
        //                     //     true);
        //                 }else{
        //                     console.log("bbbbbb")
        //                     data = [{
        //                         'projectId' : projectId,
        //                         '类型' : materialType,
        //                         '长1' : length1,
        //                         '宽1' : width1,
        //                         '数量' : number,
        //                         '成本' : cost,
        //                         //'存放位置' : location,
        //                         '行':row,
        //                         '列':col,
        //                         '品号' : '',
        //                         '库存单位' : stockUnit,
        //                         '仓库编号' : warehouse,
        //                         '规格' : '',
        //                         '原材料名称' : ''
        //                     }];
        //                 }
        //                 //var materialType = Ext.getCmp('materialName').getValue();//获得对应的id值
        //
        //                 //点击查询获得输入的数据
        //
        //                 // console.log(Ext.getCmp('length').getValue());
        //                 // console.log(Ext.getCmp('cost').getValue());
        //                 // Ext.getCmp('addDataGrid').getStore().loadData(data,
        //                 //     true);
        //                 //console.log("bbbbbb");
        //                 Ext.getCmp('addDataGrid').getStore().loadData(data,
        //                     true);
        //                 //console.log("bbbbbb");
        //             }
        //         }
        //
        //     ]
        // });

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
            items : [{
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
                        s.push(JSON.stringify(rec.data));
                        // s.push('品号','');
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                        //s.push();
                    });

                    console.log(select);

                    Ext.Msg.show({
                        title: '操作确认',
                        message: '原材料将退库，选择“是”、“否”确认？',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                //获取数据
                                //获得当前操作时间
                                //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                                Ext.Ajax.request({
                                    url : 'material/addData.do', //原材料入库
                                    method:'POST',
                                    //submitEmptyText : false,
                                    params : {
                                        tableName:tableName,
                                        //materialType:materialtype,
                                        s : "[" + s + "]",
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
                        }
                    });

                }
            }]
        });


        // var grid = Ext.create("Ext.grid.Panel", {
        //     id : 'addDataGrid',
        //     //dockedItems : [toolbar2],
        //     store : {
        //         fields :['projectId','类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
        //     },
        //     //bbar:,
        //
        //     columns : [
        //         {dataIndex : 'projectId', text : '项目编号', hidden:true, flex :1, editor : {xtype : 'textfield',allowBlank : false,}},
        //         {
        //             dataIndex : '品号',
        //             name : '品号',
        //             text : '品号',
        //             //width : 110,
        //             value:'99',
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : true
        //             },
        //             //defaultValue:"2333",
        //         },
        //         {
        //             dataIndex : '长1',
        //             text : '长1',
        //             //width : 110,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : false,
        //             }
        //         },
        //         {
        //             dataIndex : '长2',
        //             text : '长2',
        //             //width : 110,
        //             id:'长2',
        //             hidden:true,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : true,
        //
        //             },
        //             // defaultValue:"",
        //
        //         },
        //         {
        //             dataIndex : '类型',
        //             text : '类型',
        //             //width : 110,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : false,
        //
        //             }
        //
        //         },{
        //             dataIndex : '宽1',
        //             text : '宽1',
        //             //width : 110,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : false,
        //             }
        //         },
        //         {
        //             dataIndex : '宽2',
        //             text : '宽2',
        //             //width : 110,
        //             id:'宽2',
        //             hidden:true,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : true,
        //             }
        //         },
        //         {
        //             dataIndex : '规格',
        //             text : '规格',
        //             //width : 192,
        //             editor : {
        //                 xtype : 'textfield',
        //                 allowBlank : false
        //             }
        //         }, {
        //             dataIndex : '库存单位',
        //             text : '库存单位',
        //             //width : 110,
        //             editor : {// 文本字段
        //                 id : 'isNullCmb',
        //                 xtype : 'textfield',
        //                 allowBlank : true
        //
        //             }
        //
        //         },
        //         {
        //             dataIndex : '数量',
        //             name : '数量',
        //             text : '数量',
        //             //width : 160,
        //             editor : {
        //                 xtype : 'textfield',
        //                 allowBlank : false
        //             }
        //
        //         },{
        //             dataIndex : '成本',
        //             name : '成本',
        //             text : '成本',
        //             //width : 160,
        //             editor : {
        //                 xtype : 'textfield',
        //                 allowBlank : false
        //             }
        //         },
        //         {
        //             dataIndex : '仓库编号',
        //             name : '仓库编号',
        //             text : '仓库编号',
        //             //width : 130,
        //             editor : {// 文本字段
        //                 xtype : 'textfield',
        //                 allowBlank : true
        //             }
        //         },
        //         {
        //             dataIndex : '行',
        //             name : '行',
        //             text : '位置-行',
        //             //width : 160,
        //             editor : {
        //                 xtype : 'textfield',
        //                 allowBlank : true
        //             }
        //         },
        //         {
        //             dataIndex : '列',
        //             name : '列',
        //             text : '位置-列',
        //             //width : 160,
        //             editor : {
        //                 xtype : 'textfield',
        //                 allowBlank : true
        //             }
        //         } ,{
        //             dataIndex: '原材料名称',
        //             text: '材料名',
        //             //width : 110,
        //             editor: {// 文本字段
        //                 xtype: 'textfield',
        //                 allowBlank: false,
        //             }
        //         }
        //     ],
        //     viewConfig : {
        //         plugins : {
        //             ptype : "gridviewdragdrop",
        //             dragText : "可用鼠标拖拽进行上下排序"
        //         }
        //     },
        //     plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
        //         clicksToEdit : 1
        //     })],
        //     selType : 'rowmodel'
        // });

        // var set = new Ext.form.FieldSet({
        //     title: '退库信息',
        //     height:60,
        //     columnWidth: 1,
        //     layout: 'column',
        //     border: true,
        //     anchor:'100%',
        //     labelWidth: 40,
        //     buttonAlign: 'center',
        //     items:[{
        //         bodyStyle: 'background:transparent;border:0px;',
        //         columnWidth:.2,
        //         layout: 'form',
        //         border:false,
        //         items: [{
        //             xtype: 'textfield',
        //             margin: '0 40 0 0',
        //             fieldLabel: '退库人',
        //             id: 'oprator',
        //             width: 140,
        //             labelWidth: 50,
        //             name: 'oprator',
        //             value: "",
        //             allowBlank:false,
        //         },]
        //     }, {
        //         bodyStyle: 'background:transparent;border:0px;',
        //         columnWidth: .2,
        //         layout: 'form',
        //         border: false,
        //         items: [{
        //             xtype: 'datefield',
        //             margin: '0 10 0 0',
        //             fieldLabel: '退库时间',
        //             id: 'backTime',
        //             labelWidth : 60,
        //             width : 180,
        //             name: 'backTime',
        //             value: "",
        //             format : 'Y-m-d',
        //             editable : false,
        //             value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
        //
        //         }]
        //     }]
        // });


        var set = new Ext.form.FieldSet({
            // title: '退库信息',
            height: 30,
            columnWidth: 1,
            layout: 'column',
            border: true,
            anchor: '100%',
            labelWidth: 40,
            buttonAlign: 'center',
        });

        var form = Ext.create('Ext.form.Panel',{
            title:'新建退库单',
            width:500,
            frame : true,
            layout : 'column',
            border:false,
            // baseCls : 'my-panel-no-border',  //去掉边框
            verticalAlign:'center',

            bodyStyle: 'background-color:#FFFFFF;line-height:50px;',
            fieldDefaults:{
              labelAlign:'right',
              labelWidth:80,
            },
            // renderTo : Ext.getBody(),
            items: [
                {
                    columnWidth: 100,
                    // columnHeight:200,
                    // xtype: 'fieldset',
                    frame : true,
                    width: 450,
                    layout: 'form', //column
                    bodyStyle : 'padding:5 5 5 5;line-height:50px;',
                    baseCls : 'my-panel-no-border',  //去掉边框
                    // defaults: {anchor: '95%'},
                    // style: 'margin-left: 5px;padding-left: 5px;background-color:#FFFFFF;',

                    // 第一列中的表项
                    items:[
                        {
                            xtype: 'textfield',
                            margin: '0 40 0 0',
                            fieldLabel: '退库人',
                            id: 'oprator',
                            width: 140,
                            labelWidth: 50,
                            name: 'oprator',
                            value: "",
                            allowBlank:false,
                        },
                        projectList,
                        MaterialTypeList,
                        {
                            xtype: 'textfield',
                            margin: '0 10 0 40',
                            fieldLabel: '规格',
                            id: 'length1',
                            width: '35%',
                            height:200,
                            // labelWidth: 30,
                            name: 'length1',
                            value: "",
                            allowBlank:false,
                        },
                        {
                            xtype: 'textfield',
                            margin: '0 10 0 40',
                            fieldLabel: '横截面',
                            id: 'width',
                            labelWidth : 50,
                            width : 180,
                            height:200,
                            name: 'width',
                            value: "",
                        },
                        {
                            xtype: 'textfield',
                            margin: '0 10 0 40',
                            fieldLabel: '单重',
                            id: 'unitWeight',
                            width: 180,
                            labelWidth: 30,
                            name: 'unitWeight',
                            value: "",
                        },
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
                    ]
                }, {
                    columnWidth: 100,
                    // xtype: 'fieldset',
                    // title: '要填写的信息',
                    width: 450,
                    layout: 'form',
                    frame : true,
                    baseCls : 'my-panel-no-border',  //去掉边框
                    bodyStyle : 'padding:5 5 5 5;',
                    // defaults: {anchor: '95%'},
                    // style: 'margin-left: 5px;padding-left: 5px;background-color:#FFFFFF;',

                    // // 第二列中的表项
                    items:[
                        {
                            xtype: 'textfield',
                            margin: '0 10 0 0',
                            fieldLabel: '退库时间',
                            id: 'backTime',
                            labelWidth : 60,
                            width : 180,
                            name: 'backTime',
                            value: "",
                        },
                        buildingName,
                        {
                            xtype: 'textfield',
                            // margin: '0 10 0 0',
                            fieldLabel: ' 库存单位',
                            id: 'stockUnit',
                            width: 230,
                            labelWidth: 70,
                            name: 'stockUnit',
                            value: "",
                        },
                        {
                            xtype: 'textfield',
                            margin: '0 10 0 40',
                            fieldLabel: '数量',
                            id: 'number',
                            width: 140,
                            labelWidth: 30,
                            name: 'number',
                            value: "",
                        },storePosition,

                    ]
                },
                //     {
                //     width: 345,
                //     height: 100,
                //     xtype: 'textarea',
                //     fieldLabel: '四个汉字'
                // }
            ],

            buttons : {
                align : "right",
                items : [{
                    text: "退库",
                    handler : function() { // 按钮响应函数
                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('addDataGrid').getStore()
                            .getData();
                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                            // s.push('品号','');
                            //alert(JSON.stringify(rec.data));//获得表格中的数据
                            //s.push();
                        });

                        console.log(select);

                        Ext.Msg.show({
                            title: '操作确认',
                            message: '原材料将退库，选择“是”、“否”确认？',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    //获取数据
                                    //获得当前操作时间
                                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                                    Ext.Ajax.request({
                                        url : 'material/addData.do', //原材料入库
                                        method:'POST',
                                        //submitEmptyText : false,
                                        params : {
                                            tableName:tableName,
                                            //materialType:materialtype,
                                            s : "[" + s + "]",
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
                            }
                        });

                    }
                },
                //     {
                //     text : "取消",
                //     handler : function() { // 按钮响应函数
                //
                //     }
                // }
                ]
            }
        });

        // var setform = new Ext.form.Panel({
        //     height: 80,
        //     border: false,
        //     labelWidth:80,
        //     labelAlign:'right',
        //     layout:'column',
        //     frame:true,
        //     items:[set,set1
        //     ]
        // });



        // this.style("background-color:#FFFFFF");
        // this.dockedItems = [toolbar0, toolbar, toolbar1, grid, toolbar3];
        this.dockedItems = [set,form];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

