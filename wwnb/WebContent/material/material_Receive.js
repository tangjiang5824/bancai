Ext.define('material.material_Receive',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料领料',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";
        var tableListStore = Ext.create('Ext.data.Store',{
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
        var tableList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 400,
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: '项目名称',
            valueField: 'id',
            editable : false,
            store: tableListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }

        });

        var sampleData=[{
            materialName:1,
            materialNum:'Zeng'
        },{
            materialName:2,
            materialNum:'Lee'
        },{
            materialName:3,
            materialNum:'Chang'
        }];

        var store1=Ext.create('Ext.data.Store',{
            id: 'store1',
            fields:['materialName','materialNum'],
            data:sampleData
        });
        var MaterialList = Ext.create('Ext.data.Store',{
            fields:['材料名称','材料数量'],
            proxy : {
                type : 'ajax',
                url : 'material/materiallsitbyproject.do',
                reader : {
                    type : 'json',
                    rootProperty: 'materialList',
                }
            },
            autoLoad : false
        });


        var store2=Ext.create('Ext.data.Store',{
            fields:['材料名称','材料数量']
        });

        var clms=[
            //     {
            //     dataIndex:'materialName',
            //     text:'项目名'
            // },
            {
                dataIndex:'材料名称',
                text:'材料名',
            },
            {
                dataIndex:'材料数量',
                text:'未领数量',
                //editor:{xtype : 'textfield', allowBlank : false}
            },
            {
                dataIndex:'材料数量',
                text:'领取数量',
                editor:{xtype : 'textfield', allowBlank : false}
            }];
        var clms1=[ {
                dataIndex:'材料名称',
                text:'材料名',
            },
            {
                dataIndex:'材料数量',
                text:'领取数量',
                //editor:{xtype : 'textfield', allowBlank : false}
            }];

        var grid1=Ext.create('Ext.grid.Panel',{
            store:MaterialList,
            dock: 'bottom',
            columns:clms,
            flex:1,
            selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            listeners: {
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    // Ext.Ajax.request({
                    //     url:"data/EditCellById.do",  //EditDataById.do
                    //     params:{
                    //         tableName:tableName,
                    //         field:field,
                    //         value:e.value,
                    //         id:id
                    //     },
                    //     success:function (response) {
                    //         //console.log(response.responseText);
                    //     }
                    // })
                    // console.log("value is "+e.value);
                    // console.log(e.record.data["id"]);

                }
            }

        });

        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'pickingMaterialGrid',
            store:store2,
            dock: 'bottom',
            columns:clms1,
            flex:1,
            selType:'checkboxmodel'
        });



        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                {
                    xtype : 'button',
                    text: '领料单查询',
                    width: 80,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        var url='material/materiaPickingWin.jsp';
                        url=encodeURI(url)
                        //window.open(url,"_blank");
                        //window.open(url, 'mywindow1', 'width=500, height=400');
                        //store1.loadData(action.result['value']);
                        console.log('sss')
                        console.log(Ext.getCmp('projectName').getValue())
                        MaterialList.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),
                                //proejctId:Ext.getCmp('projectName').getValue(),
                                proejctId:'1',
                            }
                        });
                    }
                }]
        });

        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:600,
            height:500,

            items:[grid1,{
                xtype:'container',
                flex:0.3,
                items:[{
                    xtype:'button',
                    margin: '0 0 0 30',
                    text:'选择',
                    itemId:'move_right',
                    handler:function(){
                        var records=grid1.getSelectionModel().getSelection();
                        MaterialList.remove(records);
                        store2.add(records);
                    }
                },{
                    xtype:'button',
                    text:'撤销',
                    itemId:'move_left',
                    handler:function(){
                        var records=grid2.getSelectionModel().getSelection();
                        store2.remove(records);
                        MaterialList.add(records);
                    }
                }]
            },grid2],
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
                    var select = Ext.getCmp('pickingMaterialGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        s.push(JSON.stringify(rec.data));

                    });
                    console.log("领料----");
                    console.log(s);

                    //获取数据
                    //获得当前操作时间
                    //var sTime=Ext.Date.format(Ext.getCmp('startTime').getValue(), 'Y-m-d H:i:s');
                    Ext.Ajax.request({
                        //url : 'addMaterial.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            //materialType:materialtype,
                            s : "[" + s + "]",//S存储选择领料的数量
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


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            //store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            // columns : [
            //     { text: '材料名', dataIndex: 'materialName', flex :0.5 ,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '品号',  dataIndex: '品号' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '长', dataIndex: '长', flex :2 ,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '类型', dataIndex: '类型',flex :1,editor:{xtype : 'textfield', allowBlank : false} },
            //     { text: '宽', dataIndex: '宽', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '规格',  dataIndex: '规格' ,flex :0.4,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '库存单位', dataIndex: '库存单位', flex :2,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '仓库编号', dataIndex: '仓库编号',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '数量', dataIndex: '数量', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
            //     { text: '成本', dataIndex: '成本', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
            //     { text: '存放位置', dataIndex: '存放位置',flex :1 ,editor:{xtype : 'textfield', allowBlank : false}}
            // ],
            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 3
            // })],
            //tbar: toolbar,

        });


        this.dockedItems = [toolbar,panel,toolbar3];
        this.callParent(arguments);
    }
})

