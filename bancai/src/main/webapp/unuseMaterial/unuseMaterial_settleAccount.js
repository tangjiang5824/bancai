Ext.define('unuseMaterial.unuseMaterial_settleAccount', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '废料结算',
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
        var tableName="material_info";
        //var materialtype="1";

        //方法重写，表单验证，必填项加*号
        Ext.override(Ext.form.field.Base,{
            initComponent:function(){
                if(this.allowBlank!==undefined && !this.allowBlank){
                    if(this.fieldLabel){
                        this.fieldLabel += '<font color=red>*</font>';
                    }
                }
                this.callParent(arguments);
            }
        });

        var projectListStore = Ext.create('Ext.data.Store',{
            fields : ['id'],
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
            fieldLabel : '项目名称',
            labelWidth : 70,
            // width : '35%',
            width : 500,
            id :  'projectId',
            name : 'projectId',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
            allowBlank:false,
            blankText  : "项目名不能为空",
            listeners: {
                // select: function(combo, record, index) {
                //     console.log(record[0].data.projectName);
                // }
                //下拉框默认返回的第一个值
                render: function (combo) {//渲染
                    combo.getStore().on("load", function (s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });

                },

                select: function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store', {
                        fields: ['buildingName'],
                        proxy: {
                            type: 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url: 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName=' + tableName + '&columnName=' + projectId + '&columnValue=' + id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
                            reader: {
                                type: 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad: true,
                        listeners: {
                            load: function () {
                                Ext.getCmp('buildingId').setValue("");
                            }
                        }
                    });
                    //buildingName,下拉框重新加载数据
                    buildingName.setStore(tableListStore2);
                }
            }
        });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 300,
            margin: '0 10 0 40',
            id :  'buildingId',
            name : 'buildingId',
            matchFieldWidth: false,
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            // allowBlank:false,
            blankText  : "楼栋不能为空",
            //store: tableListStore2,
            listeners: {
                load:function () {

                }
            }
        });


        var toolbar0 = Ext.create('Ext.toolbar.Toolbar', {
            border:false,
            items : [
                {
                    xtype: 'tbtext',
                    text: '<strong>创建原材料退库单:</strong>',
                }
            ]
        });

        //职员信息
        var workerListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                url : '/material/findAllBytableName.do?tableName=department_worker',
                reader : {
                    type : 'json',
                    rootProperty: 'department_worker',
                },
            },
            autoLoad : true
        });

        var archive_form = new Ext.form.FormPanel({
            // title:'新建原材料退库表',
            id:'formMain',
            autoHeight: true,
            autoWidth: true,
            // layout: 'form',
            border: false,
            bodyStyle:'text-align:center;',
            // height:700,
            // baseCls : 'my-panel-no-border',  //去掉边框
            // 居中
            layout: {
                align: 'middle',
                pack: 'center',
                type: 'vbox'
            },

            items: [
                {
                columnWidth: .3,
                xtype: 'fieldset',
                title: '项目废料结算信息',
                layout: 'form',
                defaults: {anchor: '95%'},
                style: 'margin-left: 5px;margin-bottom: 50px;padding-left: 5px;',
                width:500,
                height:250,
                // 第二列中的表项
                bodyStyle:'text-align:center;',
                items:[
                    {
                        fieldLabel : '结算人',
                        xtype : 'combo',
                        name : 'operator',
                        id : 'operator',
                        // disabled : true,
                        // width:'95%',
                        margin: '20 0 0 0',
                        width: 150,
                        labelWidth: 45,
                        store : workerListStore,
                        displayField : 'workerName',
                        valueField : 'id',
                        editable : true,
                        allowBlank:false,
                        blankText  : "退库人姓名不能为空"
                    },
                    projectList,
                    buildingName,
                    {
                        xtype: 'textfield',
                        margin: '0 10 0 40',
                        fieldLabel: '金额',
                        id: 'account',
                        width: 140,
                        labelWidth: 30,
                        name: 'account',
                        value: "",
                        allowBlank:false,
                    },
                    {
                        xtype: 'textarea',
                        margin: '0 10 0 40',
                        fieldLabel: '备注',
                        id: 'remark',
                        width: 140,
                        labelWidth: 30,
                        name: 'remark',
                        value: "",
                        // allowBlank:false,
                    },
                    {
                        xtype:'button',
                        layout:'center',
                        margin: '10 0 0 0',
                        text:'添加',
                        handler:function() {
                            Ext.getCmp('formMain').getForm().submit({
                                url: 'waste/settleAccount.do', //原材料退库
                                method: 'POST',
                                //submitEmptyText : false,
                                success: function (response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示", "添加成功");
                                },
                                failure: function (response) {
                                    //var message =Ext.decode(response.responseText).showmessage;
                                    Ext.MessageBox.alert("提示", "添加失败");
                                }
                            })
                        }
                    }
                ]
            }],
            buttonAlign:"right",
            // buttons :  [{
            //         text: "添加",
            //         // formBind:true,//将表单和button绑定
            //         handler : function(btn) { // 按钮响应函数
            //             Ext.getCmp('formMain').getForm().submit({
            //                 url: 'waste/settleAccount.do', //原材料退库
            //                 method: 'POST',
            //                 //submitEmptyText : false,
            //                 success: function (response) {
            //                     //var message =Ext.decode(response.responseText).showmessage;
            //                     Ext.MessageBox.alert("提示", "添加成功");
            //                 },
            //                 failure: function (response) {
            //                     //var message =Ext.decode(response.responseText).showmessage;
            //                     Ext.MessageBox.alert("提示", "添加失败");
            //                 }
            //             })
            //         },
            //     }]
        });
        var form = new Ext.form.FieldSet({
            // title: '新建原材料退库表',
            layout: 'form',
            border:false,
            defaults: {anchor: '95%'},
            style: 'margin-left: 5px;padding-left: 5px;',
            height:700,
            // 第二列中的表项
            // bodyStyle:'text-align:center;',
            // layout: {
            //     align: 'middle',
            //     pack: 'center',
            //     type: 'vbox'
            // },
            items: [archive_form]
        });

        // this.tbar = toolbar0;
        // this.dockedItems = [
        //     // {
        //     //     xtype : 'toolbar',
        //     //     dock : 'top',
        //     //     items : [toolbar0]
        //     // },
        //     form];
        this.items = [ archive_form ];
        this.callParent(arguments);

    }

})

