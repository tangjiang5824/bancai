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
        var tableName="material";
        //var materialtype="1";

        //原材料类型
        var MaterialNameList = Ext.create('Ext.data.Store',{
            fields : [ 'materialName'],
            proxy : {
                type : 'ajax',
                url : 'material/materialType.do',
                reader : {
                    type : 'json',
                    rootProperty: 'typeList',
                }
            },
            autoLoad : true
        });
        var MaterialTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料类型',
            labelWidth : 70,
            width : 230,
            id :  'materialName',
            name : 'materialName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'materialTypeName',
            valueField: 'materialType',
            editable : false,
            store: MaterialNameList,
            listeners:{
                select: function(combo, record, index) {
                    var type = MaterialTypeList.rawValue;
                    var L2 = Ext.getCmp('length2');
                    var W2 = Ext.getCmp('width2');
                    var chang2 = Ext.getCmp('长2');
                    var kuan2 = Ext.getCmp('宽2');
                    if(type=='IC'){
                        //该类型为1000X200类型
                        L2.setHidden(false);
                        W2.setHidden(false);
                        chang2.setHidden(false);
                        kuan2.setHidden(false);
                    }else{
                        L2.setHidden(true);
                        W2.setHidden(true);
                        chang2.setHidden(true);
                        kuan2.setHidden(true);
                    }
                    //console.log(MaterialTypeList.rawValue)//选择的值
                    console.log(MaterialTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
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
            width : 200,
            margin: '0 10 0 20',
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

        //长1 长2 宽1 宽2 库存单位
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                MaterialTypeList,
                {
                    xtype: 'textfield',
                    margin: '0 10 0 20',
                    fieldLabel: '长1',
                    id: 'length1',
                    width: 140,
                    labelWidth: 40,
                    name: 'length1',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 20',
                    fieldLabel: '长2',
                    hidden:true,//隐藏
                    id: 'length2',
                    width: 140,
                    labelWidth: 40,
                    name: 'length2',
                    value: "",
                    allowBlank : true,
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '宽1',
                    //labelSeparator: '',
                    id: 'width1',
                    labelWidth: 40,
                    width: 140,
                    margin: '0 10 0 20',
                    name: 'width1',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '宽2',
                    //labelSeparator: '',
                    hidden:true,//隐藏
                    id: 'width2',
                    labelWidth: 40,
                    width: 140,
                    margin: '0 10 0 20',
                    name: 'width2',
                    value: "",
                    allowBlank : true
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 50',
                    fieldLabel: '库存单位',
                    id: 'stockUnit',
                    width: 220,
                    labelWidth: 60,
                    name: 'stockUnit',
                    value: "",
                },
            ]
        });
        //成本 数量 存放位置
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [

                {
                    xtype: 'textfield',
                    margin: '0 10 0 40',
                    fieldLabel: '成本',
                    id: 'cost',
                    width: 187,
                    labelWidth: 30,
                    name: 'cost',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 10 0 20',
                    fieldLabel: '数量',
                    id: 'number',
                    width: 140,
                    labelWidth: 30,
                    name: 'number',
                    value: "",
                },storePosition,
                {
                    xtype:'tbtext',
                    text:'存放位置:',
                    margin: '0 0 0 20',
                    //id: 'number',
                    width: 60,
                    //labelWidth: 30,
                    //name: 'number',
                    //value: "",
                },
                speificLocation_row,
                speificLocation_col,
                {
                    xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        var materialType = Ext.getCmp('materialName').rawValue;
                        var length1 = Ext.getCmp('length1').getValue();
                        var width1 = Ext.getCmp('width1').getValue();
                        var cost = Ext.getCmp('cost').getValue();
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
                                '类型' : materialType,
                                '长1' : length1,
                                '长2' : length2,
                                '宽1' : width1,
                                '宽2' : width2,
                                '数量' : number,
                                '成本' : cost,
                                //'存放位置' : location,
                                '行': row,
                                '列': col,
                                '品号' : 'a',
                                '库存单位' : stockUnit,
                                '仓库编号' : warehouse,
                                '规格' : '',
                                '原材料名称' : ''
                            }];
                            console.log("bbbbbb");
                            // Ext.getCmp('addDataGrid').getStore().loadData(data,
                            //     true);
                        }else{
                            console.log("bbbbbb")
                            data = [{
                                '类型' : materialType,
                                '长1' : length1,
                                '宽1' : width1,
                                '数量' : number,
                                '成本' : cost,
                                //'存放位置' : location,
                                '行':row,
                                '列':col,
                                '品号' : '',
                                '库存单位' : stockUnit,
                                '仓库编号' : warehouse,
                                '规格' : '',
                                '原材料名称' : ''
                            }];
                        }
                        //var materialType = Ext.getCmp('materialName').getValue();//获得对应的id值

                        //点击查询获得输入的数据

                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        // Ext.getCmp('addDataGrid').getStore().loadData(data,
                        //     true);
                        //console.log("bbbbbb");
                        Ext.getCmp('addDataGrid').getStore().loadData(data,
                            true);
                        //console.log("bbbbbb");
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
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认入库',
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
                fields :['类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            },
            //bbar:,

            columns : [
                {
                    dataIndex : '品号',
                    name : '品号',
                    text : '品号',
                    //width : 110,
                    value:'99',
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true
                    },
                    //defaultValue:"2333",
                },
                {
                    dataIndex : '长1',
                    text : '长1',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                {
                    dataIndex : '长2',
                    text : '长2',
                    //width : 110,
                    id:'长2',
                    hidden:true,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true,

                    },
                    // defaultValue:"",

                },
                {
                    dataIndex : '类型',
                    text : '类型',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,

                    }

                },{
                    dataIndex : '宽1',
                    text : '宽1',
                    //width : 110,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : false,
                    }
                },
                {
                    dataIndex : '宽2',
                    text : '宽2',
                    //width : 110,
                    id:'宽2',
                    hidden:true,
                    editor : {// 文本字段
                        xtype : 'textfield',
                        allowBlank : true,
                    }
                },
                {
                    dataIndex : '规格',
                    text : '规格',
                    //width : 192,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : false
                    }
                }, {
                    dataIndex : '库存单位',
                    text : '库存单位',
                    //width : 110,
                    editor : {// 文本字段
                        id : 'isNullCmb',
                        xtype : 'textfield',
                        allowBlank : true

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

                },{
                    dataIndex : '成本',
                    name : '成本',
                    text : '成本',
                    //width : 160,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : false
                    }
                },
                {
                    dataIndex : '仓库编号',
                    name : '仓库编号',
                    text : '仓库编号',
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
                } ,{
                    dataIndex: '原材料名称',
                    text: '材料名',
                    //width : 110,
                    editor: {// 文本字段
                        xtype: 'textfield',
                        allowBlank: false,
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
            selType : 'rowmodel'
        });
        this.dockedItems = [toolbar,
            //toobar,
            toolbar1, grid,toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

