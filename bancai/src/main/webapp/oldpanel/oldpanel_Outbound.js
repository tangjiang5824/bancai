Ext.define('oldpanel.oldpanel_Outbound',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板特殊出库',
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
        var tableName="oldpanel_store";
        //var materialtype="1";
        var itemsPerPage=50;

        //操作类型：枚举类型
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '入库' },
                1: { value: '1', name: '出库' },
                2: { value: '2', name: '退库' },
            }
        });

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

        //长1 长2 宽1 宽2 库存单位
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                // MaterialTypeList,
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '入库人',
                    id :'operator',
                    width: 150,
                    labelWidth: 50,
                    name: 'operator',
                    value:"",
                },
                {
                    xtype : 'datefield',
                    margin : '0 40 0 0',
                    fieldLabel : '入库时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },
                //MaterialTypeList,
                {
                    xtype : 'button',
                    text: '入库查询',
                    width: 80,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        oldpanel_inBoundRecords_Store.load({
                            params : {
                                // operator : Ext.getCmp('operator').getValue(),
                                operator : Ext.getCmp('operator').getValue(),//获取操作员名
                                startTime:Ext.getCmp('startTime').getValue(),
                                type:0
                            }
                        });
                    }
                }

            ]
        });

        var oldpanel_inBoundRecords_Store = Ext.create('Ext.data.Store',{
            id: 'oldpanel_inBoundRecords_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/material_query_records.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: 20,
                    operator : Ext.getCmp('operator').getValue(),//获取操作员名，type操作类型
                    startTime:Ext.getCmp('startTime').getValue(),
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({

                        // operator : Ext.getCmp('operator').getValue(),
                        operator : Ext.getCmp('operator').getValue(),//获取操作员名
                        startTime:Ext.getCmp('startTime').getValue(),
                        // projectId:Ext.getCmp('projectName').getValue(),
                    });
                }

            }


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
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认出库',
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
            // store : {
            //     fields :['projectId','类型','长1','宽1','数量','成本','行','列','库存单位','仓库编号','规格','原材料名称']
            // },
            //bbar:,
            store: oldpanel_inBoundRecords_Store,
            title: "入库详细记录",
            columns : [
                {   text: '录入人员',  dataIndex: 'operator' ,flex :1},
                {   text: '入库/出库',
                    dataIndex: 'type' ,
                    flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {   text: '操作时间',
                    dataIndex: 'time',
                    flex :1 ,
                    editor:{xtype : 'textfield', allowBlank : false},
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='撤销入库' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
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
            selType : 'rowmodel',

            //双击表行响应事件
            itemdblclick: function(me, record, item, index){
                var select = record.data;
                var id = select.id;
                //操作类型opType
                var opType = select.type;
                console.log(id);
                console.log(opType)
                var oldpanellogdetailList = Ext.create('Ext.data.Store',{
                    //id,materialName,length,width,materialType,number
                    fields:['oldpanelName',/*'length','width','materialType',*/'specification','count'],
                    //fields:['materialName','length','materialType','width','count'],//'oldpanelId','oldpanelName','count'
                    proxy : {
                        type : 'ajax',
                        url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=oldpanellogdetail&columnName=oldpanellogId&columnValue='+id,//获取同类型的原材料
                        reader : {
                            type : 'json',
                            rootProperty: 'oldpanellogdetail',
                        },
                    },
                    autoLoad : true
                });
                // 根据出入库0/1，决定弹出框表格列名
                var col = material_Query_Records_specific_data_grid.columns[1];
                if(opType == 1){
                    col.setText("出库数量");
                }
                if(opType == 2){
                    col.setText("退库数量");
                }
                else{
                    col.setText("入库数量");
                }

                material_Query_Records_specific_data_grid.setStore(oldpanellogdetailList);
                console.log(oldpanellogdetailList);
                Ext.getCmp('material_Query_Records_win_showmaterialData').show();
            }

        });
        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('addDataGrid').columns[columnIndex].text;

            console.log("列名：",fieldName)
            if (fieldName == "操作") {
                //设置监听事件getSelectionModel().getSelection()
                var sm = Ext.getCmp('addDataGrid').getSelectionModel();
                var materialArr = sm.getSelection();
                var id = materialArr.id;
                if (materialArr.length != 0) {
                    Ext.Msg.confirm("提示", "共选中" + materialArr.length + "条数据，是否确认撤消？", function (btn) {
                        if (btn == 'yes') {
                            //对该条记录出库var id = select.id;
                            // Ext.getCmp('addDataGrid').getStore().remove(materialArr);
                            //撤销入库记录
                            var materialLog_id = materialArr[0].data.id;  //日志记录id

                            Ext.Ajax.request({
                                url:"",  //入库记录撤销
                                params:{
                                    // tableName:tableName,
                                    materiallogId:materialLog_id

                                },
                                success:function (response) {
                                    //console.log(response.responseText);
                                }
                            })
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
        // this.dockedItems = [toolbar, grid, toolbar3];
        this.dockedItems = [toolbar, grid];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})
