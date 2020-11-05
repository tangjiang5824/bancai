Ext.define('oldpanel.Old_Query_Data',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板库存查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanel_info_store_type";
        var post_flag = false;
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                4: { value: '4', name: '墙板' },
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
            width : 200,
            margin: '0 10 0 20',
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
            valueField: 'oldpanelTypeName',
            editable : true,
            store: oldPanelNameList,
            listeners:{
                select: function(combo, record, index) {

                    console.log(oldpanelTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
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
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [oldpanelTypeList,
            //     {
            //     xtype: 'textfield',
            //     fieldLabel: '长度下限:',
            //     // labelSeparator: '',
            //     id :'startLength',
            //     labelWidth: 60,
            //     width: 180,
            //     margin : '0 10 0 0',
            //     name: 'startLength',
            //     value:"",
            // },{
            //     xtype: 'textfield',
            //     fieldLabel: '长度上限:',
            //     // labelSeparator: '',
            //     id :'endLength',
            //     labelWidth: 60,
            //     width: 180,
            //     margin : '0 10 0 0',
            //     name: 'endLength',
            //     value:"",
            // },{
            //     xtype: 'textfield',
            //     fieldLabel: '宽度下限:',
            //     // labelSeparator: '',
            //     id :'startWidth',
            //     labelWidth: 60,
            //     width: 180,
            //     margin : '0 10 0 0',
            //     name: 'startWidth',
            //     value:"",
            // },{
            //     xtype: 'textfield',
            //     fieldLabel: '宽度上限:',
            //     // labelSeparator: '',
            //     id :'endWidth',
            //     labelWidth: 60,
            //     width: 180,
            //     margin : '0 10 0 0',
            //     name: 'endWidth',
            //     value:"",
            // },
                {xtype: 'textfield', fieldLabel: '旧板品号', id: 'oldpanelNo',
                    margin: '0 10 0 30',width: 150, labelWidth: 60,
                    name: 'oldpanelNo', value: ""
                },
                {
                    xtype:'tbtext',
                    text:'库存数量:',
                    margin : '0 10 0 20',
                    itemId:'move_left',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    // fieldLabel: '',
                    id :'minCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'minCount',
                    value:"",
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    id :'maxCount',
                    width: 100,
                    // labelWidth: 60,
                    name: 'maxCount',
                    value:"",
                },
                storePosition,
                {
                xtype : 'button',
                text: '查询',
                width: 80,
                margin: '0 0 0 15',
                layout: 'right',
                handler: function(){
                    uploadRecordsStore.load({
                        params : {
                            minCount : Ext.getCmp('minCount').getValue(),
                            maxCount : Ext.getCmp('maxCount').getValue(),
                            oldpanelType:Ext.getCmp('oldpanelType').getValue(),
                            oldpanelNo:Ext.getCmp('oldpanelNo').getValue(),
                            warehouseName:Ext.getCmp('storePosition').rawValue,
                            tableName:tableName,

                        }
                    });
                }
            },
            //     {
            //     xtype : 'button',
            //     text: '修改',
            //     width: 80,
            //     margin: '0 0 0 15',
            //     layout: 'right',
            //     handler: function(){
            //         //保存修改
            //         var select = Ext.getCmp('uploadRecordsMain').getStore().getData();
            //         var s = new Array();
            //         select.each(function(rec) {
            //             //delete rec.data.id;
            //             s.push(JSON.stringify(rec.data));
            //             //alert(JSON.stringify(rec.data));//获得表格中的数据
            //         });
            //         Ext.Ajax.request({
            //             url : 'old/editData.do',
            //             method:'POST',
            //             //submitEmptyText : false,
            //             params : {
            //                 s : "[" + s + "]",
            //             },
            //             success : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改成功！");
            //                 uploadRecordsStore.load({
            //                     params : {
            //                     }
            //                 });
            //                 me.close();
            //
            //             },
            //             failure : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改失败！");
            //             }
            //         });
            //
            //
            //     }
            // },
            //     {
            //         xtype : 'button',
            //         text: '删除选中行',
            //         width: 80,
            //         margin: '0 0 0 15',
            //         layout: 'right',
            //         handler: function(){
            //             //删除
            //             //获得当前选择的行对象
            //             var select = grid.getSelectionModel().getSelection();
            //             if(select.length==0){
            //                 Ext.Msg.alert('错误', '请选择要删除的记录')
            //             }
            //             else{
            //                 Ext.Ajax.request({
            //                     url:"data/deleteItemById.do",
            //                     params:{
            //                         tableName:tableName,
            //                         id:select[0].data.id
            //                     },
            //                     success:function (response) {
            //                         Ext.MessageBox.alert("提示","删除成功！")
            //                         grid.store.remove(grid.getSelectionModel().getSelection());//移除删除的记录
            //                     },
            //                     failure:function (response) {
            //                         Ext.MessageBox.alert("提示","删除失败！")
            //
            //                     }
            //                 })
            //             }
            //
            //         }
            //     }
            ]
        })

        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "oldpanel/query_data.do",
                type: 'ajax',
                method:'POST',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    minCount : Ext.getCmp('minCount').getValue(),
                    maxCount : Ext.getCmp('maxCount').getValue(),
                    oldpanelType:Ext.getCmp('oldpanelType').getValue(),
                    oldpanelNo:Ext.getCmp('oldpanelNo').getValue(),
                    warehouseName:Ext.getCmp('storePosition').rawValue,
                    tableName:tableName,
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        // startWidth : Ext.getCmp('startWidth').getValue(),
                        // endWidth : Ext.getCmp('endWidth').getValue(),
                        // startLength:Ext.getCmp('startLength').getValue(),
                        // endLength:Ext.getCmp('endLength').getValue(),
                        // mType:Ext.getCmp('mType').getValue(),
                        start: 0,
                        limit: itemsPerPage,
                        minCount : Ext.getCmp('minCount').getValue(),
                        maxCount : Ext.getCmp('maxCount').getValue(),
                        oldpanelType:Ext.getCmp('oldpanelType').getValue(),
                        oldpanelNo:Ext.getCmp('oldpanelNo').getValue(),
                        warehouseName:Ext.getCmp('storePosition').rawValue,
                        tableName:tableName,
                    });
                }

            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true
            },
            //readOnly:true,
            columns : [
                {dataIndex : 'oldpanelName', text : '旧板名称', flex :1, },
                {dataIndex : 'oldpanelNo', text : '旧板品号', flex :1, },
                //{dataIndex : 'classificationName', text : '分类', flex :1, },
                {text: '分类', dataIndex: 'classificationId', flex :1,
                    //枚举，1：出库，0：入库
                    renderer: function (value) {
                        return Soims.model.application.ApplicationState[value].name; // key-value
                    },
                    editor:{xtype : 'textfield', allowBlank : false}
                },
                {dataIndex : 'inventoryUnit', text : '库存单位', flex :1, },
                {dataIndex : 'countUse', text : '可用数量', flex :1, },
                {dataIndex : 'countStore', text : '库存数量', flex :1, },
                {dataIndex : 'warehouseName', text : '仓库名称', flex :1, },
                {dataIndex : 'unitArea', text : '单面积', flex :1,},
                {dataIndex : 'unitWeight', text : '单重', flex :1,},
                {dataIndex : 'totalArea', text : '总面积', flex :1,},
                {dataIndex : 'totalWeight', text : '总重', flex :1,},
                // {dataIndex : 'length', text : '长', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'width', text : '宽', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                // {dataIndex : 'remark', text : '备注', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
            ],

            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            viewConfig: {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            //点击表项修改
            // listeners: {
            //
            //     validateedit: function(editor, e){//监听点击表格
            //
            //         //获得当前行的id
            //         var cellId = e.record.id;
            //         var cellField = e.field;
            //         var cellValue = e.value//当前值
            //
            //         Ext.Ajax.request({
            //             url : 'data/EditCellById.do',
            //             method:'POST',
            //             //submitEmptyText : false,
            //             params : {
            //                 tableName:tableName,
            //                 id:cellId,
            //                 field:cellField,
            //                 value:cellValue
            //             },
            //             success : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改成功！");
            //                 // uploadRecordsStore.load({
            //                 //
            //                 // });
            //                 // me.close();
            //
            //             },
            //             failure : function(response) {
            //                 Ext.MessageBox.alert("提示", "修改失败！");
            //             }
            //         });
            //     },
            // }
            //对表的行双击，响应的事件

            // listeners: {
            // 	itemdblclick: function(me, item, index){
            // 		//var select = record.data;
            // 		//var id =select.id;
            // 		//var tableName=select.tableName;
            // 		var url='showData.jsp?taxTableName='
            // 			+ tableName
            // 			+ "&taxTableId=" + id;
            // 		url=encodeURI(url)
            // 		window.open(url,
            // 			'_blank');
            // 	}
            // }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})