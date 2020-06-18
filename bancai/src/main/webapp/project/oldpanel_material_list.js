Ext.define('project.oldpanel_material_list',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目旧板材料清单查询',
    initComponent: function(){
        var itemsPerPage = 50;
        //var tableName="material";
        //var materialType="1";
        var projectListStore = Ext.create('Ext.data.Store',{
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
            width : '35%',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners:{
                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }
        });
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [projectList,

                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        console.log(Ext.getCmp('projectName').getValue());
                        oldpanelMaterial_Store.load({
                            params : {
                                tableName:'oldpanelmateriallist_name',
                                columnName:'projectId',
                                columnValue:Ext.getCmp('projectName').getValue()//''
                                //proNum : Ext.getCmp('proNum').getValue(),
                                // startWidth : Ext.getCmp('startWidth').getValue(),
                                // endTWidth : Ext.getCmp('endWidth').getValue(),
                                // startLength:Ext.getCmp('startLength').getValue(),
                                // endLength:Ext.getCmp('endLength').getValue(),
                                // mType:Ext.getCmp('mType').getValue()

                            }
                        });
                    }
                },
                // {
                //     text: '删除',
                //     width: 80,
                //     margin: '0 0 0 15',
                //     handler: function(){
                //         var select = grid.getSelectionModel().getSelection();
                //         if(select.length==0){
                //             Ext.Msg.alert('错误', '请选择要删除的记录')
                //         }
                //         else{
                //             Ext.Ajax.request({
                //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
                //                 params:{
                //                     tableName:tableName,
                //                     id:select[0].data.id
                //                 },
                //                 success:function (response) {
                //                     Ext.MessageBox.alert("提示","删除成功！")
                //                     grid.store.remove(grid.getSelectionModel().getSelection());
                //                 },
                //                 failure:function (reponse) {
                //                     Ext.MessageBox.alert("提示","删除失败！")
                //
                //                 }
                //             })
                //         }
                //     }
                // }
                ]
        })
        var oldpanelMaterial_Store = Ext.create('Ext.data.Store',{
            id: 'oldpanelMaterial_Store',
            autoLoad: false,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/findAllbyTableNameAndOnlyOneCondition.do",//通用接口
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'oldpanelmateriallist_name',
                    totalProperty: 'totalCount'
                },
            },
            // listeners : {
            //     beforeload : function(store, operation, eOpts) {
            //         store.getProxy().setExtraParams({
            //             tableName :tableName,
            //             startWidth:Ext.getCmp('startWidth').getValue(),
            //             endWidth:Ext.getCmp('endWidth').getValue(),
            //             startLength:Ext.getCmp('startLength').getValue(),
            //             endLength:Ext.getCmp('endLength').getValue(),
            //             mType:Ext.getCmp('mType').getValue(),
            //             //materialType:materialType
            //
            //         });
            //     }
            //
            // }


        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            store: oldpanelMaterial_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '产品名', dataIndex: 'productName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '旧板名', dataIndex: 'oldpanelName',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料数量', dataIndex: 'materialCount', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: oldpanelMaterial_Store,   // same store GridPanel is using
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

        this.items = [grid];
        this.callParent(arguments);
    }
})