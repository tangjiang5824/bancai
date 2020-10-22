Ext.define('material.material_Receive',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '原材料领料',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
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
            editable : false,
            store: tableListStore,
            listeners:{
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }

        });

        //查询的数据存放位置 左侧界面
        var MaterialList = Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
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

        var MaterialList2=Ext.create('Ext.data.Store',{
            //fields:['材料名称','材料数量','已领数量','要领数量']
            fields:['materialName','materialCount','countReceived','countNotReceived','countTemp'],
        });

        var clms=[
            //     {
            //     dataIndex:'materialName',
            //     text:'项目名'
            // },
            {
                dataIndex:'materialName',
                text:'材料名',
            },
            {
                dataIndex:'materialCount',
                text:'所需数量',
            },
            {
                dataIndex:'countReceived',
                text:'已领数量',
            },
            {
                dataIndex:'countNotReceived',
                text:'待领数量',
                //editor:{xtype : 'textfield', allowBlank : false}
            },
            {
                dataIndex:'countTemp',//countTemp
                text:'本次领取数量',
                id:'temp',
                //editor:{xtype : 'textfield', allowBlank : true},

            }
        ];
        var clms1=[ {dataIndex:'materialName', text:'材料名',},
                    {dataIndex:'countNotReceived', text:'要领数量',
                     //editor:{xtype : 'textfield', allowBlank : false}
                    }];

        var sampleData=[{
            materialName:1,
            length:'Zeng',
            materialType:'2',
            width:'ttt',
            number:'12'
        }];

        var store1=Ext.create('Ext.data.Store',{
            id: 'store1',
            fields:['原材料名称','长','类型','宽','数量','领取数量'],
            data:sampleData
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
                text : '确认领料',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {

                    // 取出grid的字段名字段类型pickingMaterialGrid
                    console.log('===========')
                    console.log(materialList)
                    var select = Ext.getCmp('PickingListGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        s.push(JSON.stringify(rec.data));
                    });
                    //获取数据
                    Ext.Ajax.request({
                        url : 'material/updateprojectmateriallist.do', //原材料入库
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            s : "[" + s + "]",//存储选择领料的数量
                            materialList : "[" + materialList + "]",
                        },
                        success : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","领取成功" );
                            //刷新页面
                            MaterialList.reload();

                        },
                        failure : function(response) {
                            //var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示","领取失败" );
                        }
                    });

                }
            }]
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
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        MaterialList.load({
                            params : {
                                projectId:Ext.getCmp('projectName').getValue(),
                                //projectId:'1',
                            }
                        });
                    }
                }]
        });

        //
        var toolbar4 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "bottom",
            id : "toolbar4",
            style:{
                //marginLeft: '900px'
                layout: 'right'
            },
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '确认',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {
                    // 取出grid的字段名字段类型
                    var select = Ext.getCmp('specific_data_grid').getStore()
                        .getData();

                    var s = new Array();
                    select.each(function(rec) {
                        s.push(JSON.stringify(rec.data));
                    });
                    console.log('335553');
                    var a = "[" + s + "]";
                    // console.log(a);
                    materialList = materialList + s;
                    materialList = materialList+',';

                    //点击确认后，关闭窗口
                    Ext.getCmp('win_showmaterialData').close();

                    //点击确认后将数据传到前一个页面
                    //选择的总数
                    console.log('总数');
                    //console.log(s)
                    //计算总米数
                    var count = 0;
                    select.each(function(rec) {
                        if(undefined == rec.data.tempPickNum)
                            console.log('没有值');
                        else
                            count += parseFloat(rec.data.tempPickNum)*parseFloat(rec.data.length);
                    });
                    console.log(count)
                    // 修改指定行的数据.getSelection()[0].data
                    //this.up('panel').
                    //console.log(Ext.getCmp('PickingListGrid').getSelectionModel().getSelection()[0].set('countTemp',count));
                    Ext.getCmp("PickingListGrid").getSelectionModel().getSelection()[0].set('countTemp',count);
                    var notP = Ext.getCmp("PickingListGrid").getSelectionModel().getSelection()[0].get('countNotReceived')

                    //判断数值是否规范,本次领取数量不能超过待领数量
                    if(count > notP){
                        console.log("领取失败！！！")
                        Ext.MessageBox.alert("警告","错误，请重新选择领取数量！");
                        Ext.getCmp("PickingListGrid").getSelectionModel().getSelection()[0].set('countTemp',0);
                    }

                    //点击确认后将数据返回到前一个页面，操作数据
                    // Ext.Ajax.request({
                    //     url : 'material/updateMaterialNum.do', //原材料入库
                    //     method:'POST',
                    //     //submitEmptyText : false,
                    //     params : {
                    //         s : "[" + s + "]",//S存储选择领料的数量
                    //     },
                    //     success : function(response) {
                    //         //var message =Ext.decode(response.responseText).showmessage;
                    //         Ext.MessageBox.alert("提示","领取成功" );
                    //         //出库成功，关闭窗口
                    //         Ext.getCmp('win_showmaterialData').close();
                    //
                    //     },
                    //     failure : function(response) {
                    //         //var message =Ext.decode(response.responseText).showmessage;
                    //         Ext.MessageBox.alert("提示","领取失败" );
                    //     }
                    // });

                }
            }]
        });

        var specific_data_grid=Ext.create('Ext.grid.Panel',{
            id : 'specific_data_grid',
            store:store1,//specificMaterialList，store1的数据固定
            dock: 'bottom',
            bbar:toolbar4,
            columns:[
                {
                    text: '原材料名称',
                    dataIndex: 'materialName',
                    width:"80"
                },{
                    text: '长',
                    dataIndex: 'length',
                    width:"150"
                },{
                    text: '类型',
                    dataIndex: 'materialType',
                    width:"80"
                },{
                    text: '宽',
                    dataIndex: 'width',
                    width:"150"
                },
                {
                    text: '规格',
                    flex:1,
                    dataIndex: 'specification'
                },
                {
                    text: '数量',
                    flex:1,
                    dataIndex: 'number'

                },
                {
                    text: '领取数量',
                    dataIndex: 'tempPickNum',
                    flex:1,
                    editor:{xtype : 'textfield', allowBlank : false}
                }
                ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],

            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field = e.field
                    var id = e.record.data.id
                    console.log(e.record)
                    console.log(field)
                },
            }
        });

        var toolbar5 = Ext.create('Ext.toolbar.Toolbar', {
            dock: "top",
            id: "toolbar5",

            style: {
                //marginLeft: '900px'
                layout: 'right'
            },
            items: [{
                xtype: 'tbtext',
                iconAlign: 'center',
                iconCls: 'rukuicon ',
                text: '当前需材料：',
                region: 'center',
                bodyStyle: 'background:#fff;',
            },{
                xtype: 'tbtext',
                id:'win_num',
                iconAlign: 'center',
                iconCls: 'rukuicon ',
                text: ' ',//默认为空
                region: 'center',
                bodyStyle: 'background:#fff;',
            },
            {
                xtype: 'tbtext',
                id:'rowNum',
                iconAlign: 'center',
                iconCls: 'rukuicon ',
                text: 'q ',//默认为空
                hidden:true,
                region: 'center',
                bodyStyle: 'background:#fff;',
            }
            ]
        });

        var win_showmaterialData = Ext.create('Ext.window.Window', {
            id:'win_showmaterialData',
            title: '领取同类型下的具体规格',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            tbar:toolbar5,
            items:specific_data_grid,
            closeAction : 'hide',
            modal:true,//模态窗口，背景窗口不可编辑
        });


        var grid1=Ext.create('Ext.grid.Panel',{
            id : 'PickingListGrid',
            store:MaterialList,
            dock: 'bottom',
            columns:clms,
            flex:1,
            // tbar: toolbar,
            selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            dockedItems: [
            //     {
            //     xtype: 'pagingtoolbar',
            //     store: MaterialList,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // },
            //     toolbar3
            ],
            listeners: {
                //监听修改
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    // console.log(field)
                    // console.log(field)
                },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data;
                    //类型名
                    var materialName = select.materialName;
                    //该类型领取的数量
                    //var pickNum= select.countTemp;
                    var pickNum = select.countNotReceived;
                    console.log(select.countNotReceived)

                    console.log(index+1)
                    //var pickNumber = select.
                    var specificMaterialList = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['materialName','length','materialType','width','specification','number'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/materiallsitbyname.do?materialName='+materialName,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'materialstoreList',
                            },
                            // params:{
                            //     materialName:materialName,
                            //     // start: 0,
                            //     // limit: itemsPerPage
                            // }
                        },
                        autoLoad : true
                    });

                    Ext.getCmp("toolbar5").items.items[1].setText(pickNum);//修改id为win_num的值，动态显示在窗口中
                    //传rowNum响应的行号:index+1
                    Ext.getCmp("toolbar5").items.items[2].setText(index+1)
                    // var tableName=select.tableName;
                    // var url='showData.jsp?taxTableName='
                    //     + tableName
                    //     + "&taxTableId=" + id;
                    // var url='material/material_specificTypes.jsp';
                    // url=encodeURI(url)
                    // window.open(url,
                    //     '_blank','width=800, height=500');
                    specific_data_grid.setStore(specificMaterialList);
                    Ext.getCmp('win_showmaterialData').show();
                }
            }

        });

        var grid2=Ext.create('Ext.grid.Panel',{
            id : 'pickingMaterialGrid',
            store:MaterialList2,
            dock: 'bottom',
            columns:clms1,
            flex:1,
            selType:'checkboxmodel'
        });





        var panel = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:600,
            height:500,

            items:[grid1,
                {
                xtype:'container',
                flex:0.3,
                items:[{
                    xtype:'button',
                    margin: '0 0 0 30',
                    text:'选择',
                    itemId:'move_right',
                    handler:function(){
                        var records=grid1.getSelectionModel().getSelection();
                        console.log(records)
                        console.log(records[0].previousValues==undefined)//代领的数量，未修改前的数量
                        //console.log(records[0].data['countReceived'])
                        console.log(records[0].data['countNotReceived'])//最终的数量

                        //若未修改数量，不变.直接remove
                        if(records[0].previousValues==undefined){
                            MaterialList.remove(records);
                            MaterialList2.add(records);

                        }
                        //若修改领取数量,则不remove
                        else{
                            MaterialList2.add(records);

                        }

                        //若要领数量<领取数量，则不能直接remove，需要更改数量值

                    }
                },{
                    xtype:'button',
                    text:'撤销',
                    itemId:'move_left',
                    handler:function(){
                        var records=grid2.getSelectionModel().getSelection();
                        MaterialList2.remove(records);
                        MaterialList.add(records);
                    }
                }]
            },grid2
            ],
        });



        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            //store: uploadRecordsStore,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },

        });


        this.dockedItems = [toolbar,panel,toolbar3];
        // this.items = [grid1];
        this.callParent(arguments);
    }
})

