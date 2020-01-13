Ext.define('material.material_Query_Records',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料数据查询',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '操作人员',
                    id :'userName',
                    width: 180,
                    labelWidth: 70,
                    name: 'userName',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '开始时间',
                    id :'startTime',
                    width: 180,
                    labelWidth: 60,
                    name: 'startWidth',
                    value:"",
                }, {
                    xtype: 'textfield',
                    fieldLabel: '结束时间',
                    labelSeparator: '',
                    id :'endTime',
                    labelWidth: 60,
                    width: 180,
                    margin : '0 10 0 0',
                    name: 'endWidth',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '原材料类型',
                    id :'mType',
                    width: 180,
                    labelWidth: 70,
                    name: 'mType',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '宽度下限',
                    id :'startWidth',
                    width: 180,
                    labelWidth: 60,
                    name: 'startWidth',
                    value:"",
                }, {
                    xtype: 'textfield',
                    fieldLabel: '宽度上限',
                    labelSeparator: '',
                    id :'endWidth',
                    labelWidth: 60,
                    width: 180,
                    margin : '0 10 0 0',
                    name: 'endWidth',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '长度下限',
                    id :'startLength',
                    width: 180,
                    labelWidth: 60,
                    name: 'startLength',
                    value:"",
                },
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '长度上限',
                    id :'endLength',
                    width: 180,
                    labelWidth: 60,
                    name: 'endLength',
                    value:"",
                },
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                userName : Ext.getCmp('userName').getValue(),
                                startTime : Ext.getCmp('startTime').getValue(),
                                endTime : Ext.getCmp('endTime').getValue(),
                                startWidth : Ext.getCmp('startWidth').getValue(),
                                endTWidth : Ext.getCmp('endWidth').getValue(),
                                startLength:Ext.getCmp('startLength').getValue(),
                                endLength:Ext.getCmp('endLength').getValue(),
                                mType:Ext.getCmp('mType').getValue()
                            }
                        });
                    }
                },
                {
                    text: '删除',
                    width: 80,
                    margin: '0 0 0 15',
                    handler: function(){
                        var select = grid.getSelectionModel().getSelection();
                        if(select.length==0){
                            Ext.Msg.alert('错误', '请选择要删除的记录')
                        }
                        else{
                            Ext.Ajax.request({
                                url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
                                params:{
                                    tableName:tableName,
                                    id:select[0].data.id
                                },
                                success:function (response) {
                                    Ext.MessageBox.alert("提示","删除成功！")
                                    grid.store.remove(grid.getSelectionModel().getSelection());
                                },
                                failure:function (reponse) {
                                    Ext.MessageBox.alert("提示","删除失败！")

                                }
                            })
                        }
                    }
                }]
        })
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/historyDataList.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,
                        startWidth:Ext.getCmp('startWidth').getValue(),
                        endWidth:Ext.getCmp('endWidth').getValue(),
                        startLength:Ext.getCmp('startLength').getValue(),
                        endLength:Ext.getCmp('endLength').getValue(),
                        mType:Ext.getCmp('mType').getValue(),
                        //materialType:materialType

                    });
                }

            }


        });
        // look = function(){
        //     var sm = gridUserLv.getSelectionModel();
        //     var sel = sm.getSelected();
        //     alert(sel.get('materialName'));
        // };

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '材料名', dataIndex: 'materialName', flex :0.5 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '品号',  dataIndex: '品号' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '长', dataIndex: '长', flex :2 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '类型', dataIndex: '类型',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '宽', dataIndex: '宽', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '规格',  dataIndex: '规格' ,flex :0.4,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '库存单位', dataIndex: '库存单位', flex :2,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '仓库编号', dataIndex: '仓库编号',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '数量', dataIndex: '数量', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '成本', dataIndex: '成本', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '存放位置', dataIndex: '存放位置',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                //{ text: '查看明细', dataIndex: '查看明细',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}
                {
                    flex :1 ,
                    header:"查看",dataIndex:'lookk',
                    renderer:function () {
                     var str = "<input type='button' value='查看' onclick='look()'>";
                     return str;
                    }
                }
            ],

            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 3
            // })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            //console.log(response.responseText);
                        }
                    })
                    // console.log("value is "+e.value);
                    // console.log(e.record.data["id"]);

                }
            }
        });

    }
})