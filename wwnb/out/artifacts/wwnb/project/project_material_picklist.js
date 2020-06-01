Ext.define('project.project_material_picklist',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目领料单查询',
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
            width : 400,
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }
        });
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                projectList,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        projectMaterial_Store.load({
                            params : {
                                tableName:'projectmateriallist',
                                columnName:'projectId',
                                columnValue:Ext.getCmp('projectName').getValue()//''
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
        var projectMaterial_Store = Ext.create('Ext.data.Store',{
            id: 'projectMaterial_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "material/findAllbyTableNameAndOnlyOneCondition.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'projectmateriallist',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage
                }
            },
        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            store: projectMaterial_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '材料名', dataIndex: 'materialName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '材料数量', dataIndex: 'materialCount',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '已领数量', dataIndex: 'countReceived', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '待领数量', dataIndex: 'countNotReceived', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: projectMaterial_Store,   // same store GridPanel is using
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