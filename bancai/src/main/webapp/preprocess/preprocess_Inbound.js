Ext.define('preprocess.preprocess_Inbound', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '预加工半成品入库',
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
            autoLoad : true
        });
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 270,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: true,
            allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'materialName',
            valueField: 'id',
            editable : false,
            store: MaterialNameList,
            //原材料品名应该包含基础信息中的其他属性值，作为描述信息
            listeners:{
                // select: function(combo, record, index) {
                //     var type = MaterialTypeList.rawValue;
                //     var L2 = Ext.getCmp('length2');
                //     var W2 = Ext.getCmp('width2');
                //     var chang2 = Ext.getCmp('长2');
                //     var kuan2 = Ext.getCmp('宽2');
                //     if(type=='IC'){
                //         //该类型为1000X200类型
                //         L2.setHidden(false);
                //         W2.setHidden(false);
                //         chang2.setHidden(false);
                //         kuan2.setHidden(false);
                //     }else{
                //         L2.setHidden(true);
                //         W2.setHidden(true);
                //         chang2.setHidden(true);
                //         kuan2.setHidden(true);
                //     }
                //     //console.log(MaterialTypeList.rawValue)//选择的值
                //     console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                //     //console.log(record[0].data.materialName);
                // }
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

        var speificLocation_row = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '行',
            labelWidth : 20,
            width : 100,
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

        var speificLocation_col = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '列',
            labelWidth : 20,
            width : 100,
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

        //长1 长2 宽1 宽2 库存单位
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                // MaterialTypeList,
                {
                    xtype: 'textfield',
                    // margin: '0 10 0 40',
                    fieldLabel: '产品名称',
                    id: 'pre_product',
                    labelWidth : 60,
                    width : 270,
                    name: 'pre_product',
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
                },

                // {
                //     xtype: 'textfield',
                //     margin: '0 10 0 40',
                //     fieldLabel: '规格',
                //     id: 'length1',
                //     width: 140,
                //     labelWidth: 30,
                //     name: 'length1',
                //     value: "",
                //     allowBlank:false,
                // },
                // {
                //     xtype: 'textfield',
                //     margin: '0 10 0 40',
                //     fieldLabel: '横截面',
                //     id: 'width',
                //     labelWidth : 50,
                //     width : 180,
                //     name: 'width',
                //     value: "",
                // },
                // {
                //     xtype: 'textfield',
                //     margin: '0 10 0 40',
                //     fieldLabel: '长2',
                //     hidden:true,//隐藏
                //     id: 'length2',
                //     width: 140,
                //     labelWidth: 40,
                //     name: 'length2',
                //     value: "",
                //     allowBlank : true,
                // },
                //
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
            ]
        });
        //成本 数量 存放位置
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
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
                //     fieldLabel: '数量',
                //     id: 'number',
                //     width: 140,
                //     labelWidth: 30,
                //     name: 'number',
                //     value: "",
                // },
                storePosition,
                {
                    xtype:'tbtext',
                    text:'存放位置 ---',
                    margin: '0 0 0 35',
                    //id: 'number',
                    width: 60,
                    // width: 180,
                    // labelWidth: 30,
                    //labelWidth: 30,
                    //name: 'number',
                    //value: "",
                },
                speificLocation_row,
                speificLocation_col,
                // {
                //     xtype: 'textfield',
                //     margin: '0 0 0 40',
                //     fieldLabel: ' 入库人',
                //     id: 'operator',
                //     width: 150,
                //     labelWidth: 45,
                //     name: 'operator',
                //     value: "",
                // },
                {
                    xtype : 'button',
                    margin: '0 10 0 35',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添  加',
                    width:60,
                    handler: function(){
                        console.log("原材料名：",Ext.getCmp('materialName').rawValue);
                        console.log("原材料id：",Ext.getCmp('materialName').value)
                        // var operator = Ext.getCmp('operator').value;
                        var materialNo = Ext.getCmp('materialName').value;
                        var materialName = Ext.getCmp('materialName').rawValue;
                        var length1 = Ext.getCmp('length1').getValue();
                        var width = Ext.getCmp('width').getValue();
                        var unitWeight = Ext.getCmp('unitWeight').getValue();
                        var totalWeight = Ext.getCmp('totalWeight').getValue();
                        var number = Ext.getCmp('number').getValue();
                        //var location = Ext.getCmp('location').getValue();
                        //存放位置，行列
                        //var locationNameList_row = Ext.getCmp('locationNameList_row').getValue();
                        //var locationNameList_col = Ext.getCmp('locationNameList_col').getValue();
                        var row = Ext.getCmp('speificLocation_row').getValue();
                        var col = Ext.getCmp('speificLocation_col').getValue();
                        var warehouse = Ext.getCmp('storePosition').getValue();
                        var stockUnit = Ext.getCmp('stockUnit').getValue();
                        var data;
                        //判断是否有长2、宽2选项,存在时
                        //console.log(Ext.getCmp('length2').hidden)
                        //console.log("aaaaaa")
                        if(Ext.getCmp('length2').hidden==false && Ext.getCmp('width2').hidden==false){
                            var length2 = Ext.getCmp('length2').getValue();
                            var width2 = Ext.getCmp('width2').getValue();
                            data = [{
                                '品号' : materialNo,
                                '品名' : materialName,
                                '规格' : length1,
                                '横截面' : width,
                                '库存单位' : stockUnit,
                                '单重' : unitWeight,
                                '总重' : totalWeight,
                                '数量' : number,
                                '仓库名称' : warehouse,
                                '行': row,
                                '列': col,
                                // '入库人':operator

                            }];
                            console.log("bbbbbb");
                            // Ext.getCmp('addDataGrid').getStore().loadData(data,
                            //     true);
                        }else{
                            console.log("bbbbbb")
                            data = [{
                                '品号' : materialNo,
                                '品名' : materialName,
                                '规格' : length1,
                                '横截面' : width,
                                '库存单位' : stockUnit,
                                '单重' : unitWeight,
                                '总重' : totalWeight,
                                '数量' : number,
                                '仓库名称' : warehouse,
                                '行': row,
                                '列': col,
                                // '入库人':operator
                            }];
                        }
                        //var materialType = Ext.getCmp('materialName').getValue();//获得对应的id值

                        //点击查询获得输入的数据

                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        // Ext.getCmp('addDataGrid').getStore().loadData(data,
                        //     true);
                        //console.log("bbbbbb");
                        //若品名未填则添加失败
                        if (materialName != ''){
                            console.log("-------------------")
                            console.log(materialName)
                            Ext.getCmp('addDataGrid').getStore().loadData(data,
                                true);

                            //清除框里的数据
                            Ext.getCmp('materialName').setValue('');
                            Ext.getCmp('length1').setValue('');
                            Ext.getCmp('width').setValue('');
                            Ext.getCmp('unitWeight').setValue('');
                            Ext.getCmp('totalWeight').setValue('');
                            Ext.getCmp('number').setValue('');
                            Ext.getCmp('speificLocation_row').setValue('');
                            Ext.getCmp('speificLocation_col').setValue('');
                            Ext.getCmp('storePosition').setValue('');
                            Ext.getCmp('stockUnit').setValue('');
                        }else{
                            Ext.MessageBox.alert("警告","品名不能为空",function(r) {
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
                    margin: '0 40 0 0',
                    fieldLabel: ' 入库人',
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
                    text : '确认入库',
                    region:'center',
                    bodyStyle: 'background:#fff;',
                    handler : function() {

                        var operator = Ext.getCmp('operator').value;
                        // 取出grid的字段名字段类型
                        var select = Ext.getCmp('addDataGrid').getStore()
                            .getData();
                        console.log("select",select);

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
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","入库成功" );
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
            id : 'addDataGrid',
            //dockedItems : [toolbar2],

            store : {
                fields :['原材料名称','规格','库存单位','单重','总重','数量','仓库名称','行','列']
            },
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
                    dataIndex : '品号',
                    name : '品号',
                    text : '品号',
                    hidden:true,  //隐藏
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true
                    },
                    //defaultValue:"2333",
                },
                {
                    dataIndex : '品名',
                    name : '品名',
                    text : '品名',
                    //width : 110,
                    value:'99',
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true
                    },
                    //defaultValue:"2333",
                },
                {
                    dataIndex : '规格',
                    text : '规格',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                {
                    dataIndex : '横截面',
                    text : '横截面',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                {
                    dataIndex : '库存单位',
                    text : '库存单位',
                    //width : 110,
                    editor : {// 文本字段
                        id : 'isNullCmb',
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },{
                    dataIndex : '单重',
                    name : '单重',
                    text : '单重',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : false
                    }
                },{
                    dataIndex : '总重',
                    name : '总重',
                    text : '总重',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : false
                    }
                },
                {
                    dataIndex : '数量',
                    name : '数量',
                    text : '数量',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : false
                    }

                },
                {
                    dataIndex : '仓库名称',
                    name : '仓库名称',
                    text : '仓库名称',
                    //width : 130,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    dataIndex : '行',
                    name : '行',
                    text : '位置-行',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    dataIndex : '列',
                    name : '列',
                    text : '位置-列',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                // {
                //     dataIndex : '入库人',
                //     name : '入库人',
                //     text : '入库人',
                //     //width : 160,
                //     editor : {
                //         xtype : 'textfield',
                //         allowBlank : true
                //     }
                // },
                {
                    // name : '操作',
                    text : '操作',
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                }
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
            selType : 'checkboxmodel'  //rowmodel
        });
        //添加cell单击事件
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
                var materialArr = sm.getSelection();
                if (materialArr.length != 0) {
                    Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认删除？", function (btn) {
                        if (btn == 'yes') {
                            //先删除后台再删除前台
                            //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据

                            //Extjs 4.x 删除
                            Ext.getCmp('addDataGrid').getStore().remove(materialArr);
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

        }
        this.dockedItems = [toolbar,
            //toobar,
            toolbar1, grid,toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

