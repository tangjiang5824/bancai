Ext.define('product.product_Format_Input', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '添加产品格式',
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

        var productNameList = Ext.create('Ext.data.Store',{
            fields : [ 'productTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=producttype',
                reader : {
                    type : 'json',
                    rootProperty: 'producttype',
                }
            },
            autoLoad : true
        });
        var productTypeList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品类型',
            labelWidth : 70,
            width : 230,
            id :  'productType',
            name : 'productType',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'productTypeName',
            valueField: 'id',
            editable : false,
            store: productNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(productTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });

        var format1store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format2store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format3store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format4store = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"无"},
                {"abbr":"1", "name":"类型"},
                {"abbr":"2", "name":"m"},
                {"abbr":"3", "name":"n"},
                {"abbr":"4", "name":"a*b"},
                {"abbr":"5", "name":"b*a"},
                {"abbr":"6", "name":"m+n"},
                {"abbr":"7", "name":"后缀"},
                //{"abbr":"7", "name":"n"},
                //...
            ]
        });
        var format1 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择1',
            name: 'pro_basic_info_format1',//'oldpanel_query_records_optionType',
            id: 'pro_basic_info_format1',
            store: format1store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
        });
        var format2 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择2',
            name: 'pro_basic_info_format2',//'oldpanel_query_records_optionType',
            id: 'pro_basic_info_format2',
            store: format2store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
        });
        var format3 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择3',
            name: 'pro_basic_info_format3',//'oldpanel_query_records_optionType',
            id: 'pro_basic_info_format3',
            store: format3store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
        });
        var format4 = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '类型选择4',
            name: 'pro_basic_info_format4',//'oldpanel_query_records_optionType',
            id: 'pro_basic_info_format4',
            store: format4store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 20',
            width: 130,
            labelWidth: 60,
            renderTo: Ext.getBody(),
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                productTypeList,
                format1,
                format2,
                format3,
                format4,
                {xtype : 'button',
                    margin: '0 10 0 70',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler: function(){
                        console.log("123zzy123"+Ext.getCmp('productType').getValue());
                        var productTypeName = Ext.getCmp('productType').rawValue;
                        var productTypeId = Ext.getCmp('productType').getValue();
                        var format1Name = Ext.getCmp('pro_basic_info_format1').rawValue;
                        var format2Name = Ext.getCmp('pro_basic_info_format2').rawValue;
                        var format3Name = Ext.getCmp('pro_basic_info_format3').rawValue;
                        var format4Name = Ext.getCmp('pro_basic_info_format4').rawValue;
                        var format1 = Ext.getCmp('pro_basic_info_format1').getValue();
                        var format2 = Ext.getCmp('pro_basic_info_format2').getValue();
                        var format3 = Ext.getCmp('pro_basic_info_format3').getValue();
                        var format4 = Ext.getCmp('pro_basic_info_format4').getValue();
                        var data = [{
                            'productTypeName' : productTypeName,
                            'productTypeId' : productTypeId,
                            'format1' : format1,
                            'format2' : format2,
                            'format3' : format3,
                            'format4' : format4,
                            'format1Name' : format1Name,
                            'format2Name' : format2Name,
                            'format3Name' : format3Name,
                            'format4Name' : format4Name,

                        }];
                        //点击查询获得输入的数据
                        // console.log(Ext.getCmp('length').getValue());
                        // console.log(Ext.getCmp('cost').getValue());
                        //若品名未填则添加失败
                        if (productTypeId != '') {
                            Ext.getCmp('add_pro_DataGrid').getStore().loadData(data, true);
                            //清除框里的数据
                            // Ext.getCmp('oldpanelName').setValue('');
                            // //Ext.getCmp('classification').setValue('');
                            // //Ext.getCmp('inventoryUnit').setValue('');
                            // //Ext.getCmp('unitWeight').setValue('');
                            // //Ext.getCmp('unitArea').setValue('');
                            // Ext.getCmp('count').setValue('');
                            // Ext.getCmp('storePosition').setValue('');
                            // //Ext.getCmp('remark').setValue('');
                            // Ext.getCmp('operator').setValue('');
                        }else{
                            Ext.MessageBox.alert("警告","品名、入库数量不能为空",function(r) {
                                //    r = cancel||ok
                            });
                        }
                    }
                }
            ]
        });

        //确认添加按钮，
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
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认添加',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {

                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('add_pro_DataGrid').getStore()
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
                        url : 'product/addFormat.do', //旧板入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            s : "[" + s + "]",
                            // projectId : projectId,
                            // buildingId : buildingId,
                            // operator: Ext.getCmp('operator').getValue(),
                        },
                        success : function(response) {
                            console.log("12312312312321",response.responseText);
                            if(response.responseText.includes("false"))
                            {
                                Ext.MessageBox.alert("提示","添加失败" );
                            }
                            //var message =Ext.decode(response.responseText).showmessage;
                            else{
                                Ext.MessageBox.alert("提示","添加成功" );
                            }

                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","添加失败" );
                        }
                    });

                }
            }]
        });



        var grid = Ext.create("Ext.grid.Panel", {
            id : 'add_pro_DataGrid',
            //dockedItems : [toolbar2],
            store : {
                // fields: ['材料名','品号', '长',"；类型","宽",'规格','库存单位','仓库编号','数量','成本','存放位置']
                fields: []
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
                //{dataIndex : 'oldpanelTypeId', text : '旧板类型Id', flex :1,},
                {dataIndex : 'productTypeName', text : '产品类型', flex :1,},
                {dataIndex : 'format1Name', text : '产品格式1', flex :1,},
                {dataIndex : 'format2Name', text : '产品格式2', flex :1,},
                {dataIndex : 'format3Name', text : '产品格式3', flex :1,},
                {dataIndex : 'format4Name', text : '产品格式4', flex :1,},
                {
                    name : '操作',
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
            selType : 'checkboxmodel'//'rowmodel'
        });
        //grid.columns[1].hide();
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('add_pro_DataGrid').columns[columnIndex-1].text;

            console.log("列名：",fieldName)
            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('add_pro_DataGrid').getSelectionModel();
                var oldpanelArr = sm.getSelection();
                if (oldpanelArr.length != 0) {
                    Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                        if (btn == 'yes') {
                            //先删除后台再删除前台
                            //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据

                            //Extjs 4.x 删除
                            Ext.getCmp('add_pro_DataGrid').getStore().remove(oldpanelArr);
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
            //toobar,toolbar1,
            toolbar2, grid, toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

