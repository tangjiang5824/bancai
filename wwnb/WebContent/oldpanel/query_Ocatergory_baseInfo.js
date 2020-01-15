Ext.define('oldpanel.query_Ocatergory_baseInfo',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '旧板材库数据查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="oldpanelbasicinfo";
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [{
                xtype: 'textfield',
                fieldLabel: '旧版类型:',
                // labelSeparator: '',
                id :'oldpanelCatergory',
                labelWidth: 80,
                width: 300,
                margin : '0 10 0 0',
                name: 'mType',
                value:"",
            },{
                xtype : 'button',
                text: '查询',
                width: 80,
                margin: '0 0 0 15',
                layout: 'right',
                handler: function(){
                    uploadRecordsStore.load({
                        params : {
                            oldpanelCatergory:Ext.getCmp('oldpanelCatergory').getValue(),
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
                {
                    xtype : 'button',
                    text: '删除选中行',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        //删除
                        //获得当前选择的行对象
                        var select = grid.getSelectionModel().getSelection();
                        if(select.length==0){
                            Ext.Msg.alert('错误', '请选择要删除的记录')
                        }
                        else{
                            Ext.Ajax.request({
                                url:"????",
                                params:{
                                    tableName:tableName,
                                    id:select[0].data.id
                                },
                                success:function (response) {
                                    Ext.MessageBox.alert("提示","删除成功！")
                                    grid.store.remove(grid.getSelectionModel().getSelection());//移除删除的记录
                                },
                                failure:function (response) {
                                    Ext.MessageBox.alert("提示","删除失败！")

                                }
                            })
                        }

                    }
                }
            ]
        })

        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "material/findOldpanelbasicinfoList.do",
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
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        oldpanelCatergory:Ext.getCmp('oldpanelCatergory').getValue(),
                        tableName:tableName,
                    });
                }
            }

        });

        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            height:400,
            width:600,
            store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true
            },
            columns : [
                { text: '旧版名称',  dataIndex: '旧版名称' ,flex :1, editor : {xtype : 'textfield', allowBlank : false}},
                { text: '类型',  dataIndex: '类型' ,flex :1,editor : {xtype : 'textfield', allowBlank : false}},
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

            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],

            listeners: {

                validateedit: function(editor, e){//监听点击表格

                    //获得当前行的id
                    var cellId = e.record.id;
                    var cellField = e.field;
                    var cellValue = e.value//当前值

                    Ext.Ajax.request({
                        url : 'data/EditCellById.do',
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            id:cellId,
                            field:cellField,
                            value:cellValue
                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "修改成功！");
                            // uploadRecordsStore.load({
                            //
                            // });
                            // me.close();

                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "修改失败！");
                        }
                    });
                },
            }
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