Ext.define('userManagement.department_worker', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '公司职员基础信息',

    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("material.add_Mcatergory_baseInfo");
        p.add(cmp);
    },

    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        //定义表名
        var tableName="department_info_work";

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });

        //部门信息
        var departmentListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=department_info',
                reader : {
                    type : 'json',
                    rootProperty: 'department_info',
                },
            },
            autoLoad : true
        });
        var departmentList=Ext.create('Ext.form.ComboBox',{
            fieldLabel : '部门',
            labelWidth : 35,
            width : 180,
            margin: '0 0 0 40',
            id :  'departmentList',
            name : 'departmentList',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'departmentName',
            forceSelection: true,
            valueField: 'id',
            editable : false,
            triggerAction: 'all',
            selectOnFocus:true,
            store: departmentListStore,
        });

        var toolbar_top = Ext.create("Ext.toolbar.Toolbar", {
            // dock : "top",
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>新增人员:</strong>',
                }
            ]
        });

        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [
                {
                    xtype: 'textfield',
                    margin: '0 0 0 0',
                    fieldLabel: ' 职员名字',
                    id: 'workerName',
                    width: 150,
                    labelWidth: 60,
                    name: 'workerName',
                    value: "",
                },
                {
                    xtype: 'textfield',
                    margin: '0 0 0 40',
                    fieldLabel: ' 联系方式',
                    id: 'tel',
                    width: 200,
                    labelWidth: 60,
                    name: 'tel',
                    value: "",
                },
                departmentList,
                {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                margin: '0 0 0 40',
                text : '保存',
                handler : function() {

                    var workerName=Ext.getCmp("workerName").getValue();
                    var tel=Ext.getCmp("tel").getValue();
                    var departmentId=Ext.getCmp("departmentList").getValue();//departmentId

                    Ext.Ajax.request({
                        url:"department/addOrUpdateWorkerInfo.do",  //EditDataById.do
                        params:{
                            id:'add001',//新增id为字符串
                            // s : "[" + s + "]",
                            workerName:workerName,
                            tel:tel,
                            departmentId:departmentId
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","保存成功" );
                            //重新加载
                            Ext.getCmp('addWorkerGrid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","保存失败" );
                        }
                    })
                }
            },{
                xtype : 'button',
                text : '修改',
                id : 'editUser',
                handler : function() {
                    var select = Ext.getCmp('addWorkerGrid').getSelectionModel().getSelection();

                    //选择的记录id
                    var userId = select[0].get('id');
                    var workerName = select[0].get('workerName');
                    var tel = select[0].get('tel');
                    var departmentName = select[0].get('departmentName');
                    var departmentId = select[0].get('departmentId');
                    console.log('11111',select)
                    if(select.length==0)
                        Ext.Msg.alert('错误', '请选择要修改的数据');
                    else
                    {
                        var edit = Ext.create('userManagement.userEdit',{
                            //页面传参数
                            userId:userId,
                            workerName: workerName,
                            tel:tel,
                            departmentName:departmentName,
                            departmentId:departmentId
                        });
                        edit.show();
                    }
                }}
            ]
        });

        //职员信息
        var workerStore = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:[],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'department_info_work',
                },
            },
            autoLoad : true
        });

        var grid = Ext.create("Ext.grid.Panel", {
            title:'职员信息查询',
            id : 'addWorkerGrid',
            // dockedItems : [toolbar2],
            store : workerStore,
            columns : [
                {dataIndex : 'workerName', text : '职员名字', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'tel', text : '联系方式', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                {
                    dataIndex : 'departmentName',
                    text : '所属部门',
                    width :300,
                    // editor:departmentList,renderer:function(value, cellmeta, record){
                    //     var index = departmentListStore.find(departmentList.valueField,value);
                    //     var ehrRecord = departmentListStore.getAt(index);
                    //     var returnvalue = "";
                    //     if (ehrRecord) {
                    //         returnvalue = ehrRecord.get('departmentName');
                    //     }
                    //     return returnvalue;
                    // }
                },
                {
                    xtype:'actioncolumn',
                    text : '删除操作',
                    width:100,
                    style:"text-align:center;",
                    items: [
                        //删除按钮
                        {
                            icon: 'extjs/imgs/delete.png',
                            tooltip: 'Delete',
                            style:"margin-right:20px;",
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                console.log("删除--------：",rec.data.typeName)
                                console.log("删除--------：",rec.data.id)
                                //类型id
                                var typeId = rec.data.id;
                                //弹框提醒
                                Ext.Msg.show({
                                    title: '操作确认',
                                    message: '将删除数据，选择“是”否确认？',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url:"data/EditCellById.do",  //EditDataById.do
                                                params:{
                                                    type:'delete',
                                                    tableName:tableName,
                                                    field:'typeName',
                                                    value:rec.data.typeName,
                                                    id:typeId
                                                },
                                                success:function (response) {
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('addWorkerGrid').getStore().remove(rec);
                                                },
                                                failure : function(response){
                                                    Ext.MessageBox.alert("提示", "删除失败!");
                                                }
                                            })
                                        }
                                    }
                                });
                                // alert("Terminate " + rec.get('firstname'));
                            }
                        }]

                }
                 ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 1
            // })],
            plugins : [rowEditing], //行编辑

            selType : 'rowmodel',
            listeners: {
                //监听修改
                // validateedit: function (editor, e) {
                //     var id=e.record.data.id
                //     //修改的字段
                //     var field=e.field;
                //     //修改的值
                //     var newV = e.value;
                //
                //     //修改的行数据
                //     var data = editor.context.newValues;
                //     console.log("含数据：==========",data)
                //     //每个属性值
                //     var workerName = data.workerName;
                //     var tel = data.tel;
                //     var departmentName = data.departmentName;
                //
                //
                //     var s = new Array();
                //     //修改的一行数据
                //     s.push(JSON.stringify(data));
                //     // console.log("editor===",editor.context.newValues)  //
                //
                //     Ext.Ajax.request({
                //         url:"department/addOrUpdateWorkerInfo.do",  //EditDataById.do
                //         params:{
                //             id:id,
                //             // s : "[" + s + "]",
                //             workerName:workerName,
                //             tel:tel,
                //             departmentName:departmentName
                //         },
                //         success:function (response) {
                //             Ext.MessageBox.alert("提示","修改成功" );
                //             if(flag){
                //                 e.record.data.id=response.responseText;
                //             }
                //             //重新加载
                //             Ext.getCmp('building_grid').getStore().load();
                //         },
                //         failure:function (response) {
                //             Ext.MessageBox.alert("提示","修改失败" );
                //         }
                //     })
                // }
            }
        });

        //设置panel多行tbar
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar_top]
        },{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar2]
        }
        ];

        this.items = [ grid];//toolbar2,
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

