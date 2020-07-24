Ext.define('project.project_check_worksheet',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '工单审核',
    initComponent: function(){
        var itemsPerPage = 50;
        var table_workoderLog="work_order_log";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

        //项目名称选择
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
            width : '35%',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            //
        });


        //查询的工单数据存放位置---上界面
        var worksheetListStore = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllbyTableNameAndOnlyOneCondition.do',
                reader : {
                    type : 'json',
                    rootProperty: 'work_order_log',
                }
            },
            autoLoad : false
        });


        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [tableList,
                {
                    xtype : 'button',
                    text: '项目工单查询',
                    width: 100,
                    margin: '0 0 0 10',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        worksheetListStore.load({
                            params : {
                                tableName:table_workoderLog,
                                columnName:'projectId',
                                columnValue:Ext.getCmp('projectName').getValue(),

                            }
                        });
                    }
                }]
        });


        var worksheet_Grid=Ext.create('Ext.grid.Panel',{
            title: '工单查询',
            id : 'worksheet_Grid',
            store:worksheetListStore,
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'projectName',
                    text:'项目名',
                    flex :1
                },
                {
                    dataIndex:'buildingName',
                    text:'楼栋名',
                    flex :1
                },
                {
                    dataIndex:'buildingPositionName',
                    text:'清单位置',
                    flex :1
                },
                {
                    dataIndex:'worksheetName',
                    text:'工单名称',
                    flex :1
                },
                {
                    dataIndex:'operator',
                    text:'创建人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    //editor:{xtype : 'textfield', allowBlank : false}
                    flex :1
                },
            ],
            flex:1,
            // height:'100%',
            tbar: toolbar,
            selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                xtype: 'pagingtoolbar',
                store: worksheetListStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }
            ],
            listeners: {
                //双击表行响应事件
                // itemdblclick: function(me, record, item, index,rowModel){
                //     var select = record.data;
                //     //类型名
                //     var materialName = select.materialName;
                //     //该类型领取的数量
                //     //var pickNum= select.countTemp;
                //     var pickNum = select.countNotReceived;
                //     console.log(select.countNotReceived)
                //
                //     console.log(index+1)
                //     //var pickNumber = select.
                //     var specificMaterialList = Ext.create('Ext.data.Store',{
                //         //id,materialName,length,width,materialType,number
                //         fields:['materialName','length','materialType','width','specification','number'],
                //         proxy : {
                //             type : 'ajax',
                //             url : 'material/materiallsitbyname.do?materialName='+materialName,//获取同类型的原材料  +'&pickNum='+pickNum
                //             reader : {
                //                 type : 'json',
                //                 rootProperty: 'materialstoreList',
                //             },
                //         },
                //         autoLoad : true
                //     });
                //
                //     Ext.getCmp("toolbar5").items.items[1].setText(pickNum);//修改id为win_num的值，动态显示在窗口中
                //     //传rowNum响应的行号:index+1
                //     Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                //     specific_data_grid.setStore(specificMaterialList);
                //     Ext.getCmp('win_showmaterialData').show();
                // }

            }

        });


        // var panel = Ext.create('Ext.panel.Panel',{
        //     //dock: 'bottom',
        //     layout:{
        //         type:'vbox',
        //         align:'stretch'
        //     },
        //     width:'100%',
        //     height:800,
        //     items:[
        //         worksheet_Grid,
        //     ],
        // });


        this.items = [worksheet_Grid];
        this.callParent(arguments);
    }
})