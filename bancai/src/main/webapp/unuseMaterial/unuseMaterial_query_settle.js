Ext.define('unuseMaterial.unuseMaterial_query_settle',{
    // extend:'Ext.panel.Panel',
    extend:'Ext.tab.Panel',
    id:'unuseMaterial_tabpanel',
    region: 'center',
    layout:'fit',
    title: '废料结算查询',

    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="material";
        //var materialType="1";

        //存放所选的原材料的具体规格
        var materialList = '';

        var record_start_pop = 0;
        var record_start_bottom = 0;//序号
        var record_start_rec = 0;

        //原件类型：枚举类型
        Ext.define('product.model.originType', {
            statics: { // 关键s
                0: { value: '0', name: '未匹配' },
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料' },
                9: { value: '5', name: '未匹配成功' },
            }
        });

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
            width : 550,
            margin : '0 10 0 0',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: tableListStore,
            listeners:{
                //下拉框默认返回的第一个值

                change : function(combo, record, eOpts) {
                    if(this.callback) {
                        if(combo.lastSelection && combo.lastSelection.length>0) {
                            this.callback(combo.lastSelection[0]);
                        }
                    }
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

                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },

                select:function (combo, record) {
                    projectName:Ext.getCmp('projectName').getValue();
                    //选中后
                    var select = record[0].data;
                    var id = select.id;//项目名对应的id
                    console.log(id)

                    //重新加载行选项
                    //表名
                    var tableName = 'building';
                    //属性名
                    var projectId = 'projectId';

                    var tableListStore2 = Ext.create('Ext.data.Store',{
                        fields : [ 'buildingName'],
                        proxy : {
                            type : 'ajax',
                            //通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+projectId+'&columnValue='+id,//根据项目id查询对应的楼栋名
                            // params : {
                            // 	tableName:tableName,
                            // 	columnName:projectId,
                            // 	columnValue:id,
                            // },
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            }
                        },
                        autoLoad : true,
                        listeners:{
                            load:function () {
                                Ext.getCmp('buildingName').setValue("");
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
            id :  'buildingName',
            name : 'buildingName',
            matchFieldWidth: false,
            margin: '0 10 0 40',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
        });

        //查询领料单
        var backListStore = Ext.create('Ext.data.Store',{
            fields:[],
            proxy : {
                type : 'ajax',
                url : 'waste/querySettle.do', //领料单查询
                reader : {
                    type : 'json',
                    rootProperty: 'value',
                }
            },
            autoLoad : true
        });

        var old_pickList=Ext.create('Ext.data.Store',{
            fields:['materialName','materialCount'],
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

        var backTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"1", "name":"成品退库"},
                {"abbr":"2", "name":"预加工半成品库"},
                {"abbr":"3", "name":"旧版库"},
                {"abbr":"4", "name":"原材料库"}
                //...
            ]
        });
        var backType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '退料类型',
            name: 'backType',
            id: 'backType',
            store: backTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 30 0 0',
            width: 200,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        var toolbar_top = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar_top",
            items: [
                //退料类型
                // backType,
                tableList,
                buildingName,
            ]
        });
        var toolbar = Ext.create('Ext.toolbar.Toolbar',{
            dock : "top",
            id : "toolbar",
            items: [
                {
                    fieldLabel : '结算人',
                    xtype : 'combo',
                    name : 'operator',
                    id : 'operator',
                    // disabled : true,
                    // width:'95%',
                    margin: '0 30 0 0',
                    width: 150,
                    labelWidth: 45,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    fieldLabel : '时间',
                    width : 180,
                    labelWidth : 60,
                    id : "startTime",
                    name : 'startTime',
                    format : 'Y-m-d',
                    editable : false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')

                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },{
                    xtype:'tbtext',
                    text:'---',
                },
                {
                    xtype : 'datefield',
                    margin : '0 0 0 0',
                    // fieldLabel : '结束时间',
                    width : 120,
                    // labelWidth : 60,
                    id : "endTime",
                    name : 'endTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    //value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },

                {
                    xtype : 'button',
                    text: '结算记录查询',
                    width: 100,
                    margin: '0 0 0 40',
                    layout: 'right',
                    handler: function(){
                        // var url='material/materiaPickingWin.jsp';
                        // url=encodeURI(url)
                        //window.open(url,"_blank");
                        console.log('sss')
                        //传入所选项目的id
                        console.log(Ext.getCmp('projectName').getValue())
                        backListStore.load({
                            params : {
                                //type:3,//默认旧板
                                projectId:Ext.getCmp('projectName').getValue(),
                                buildingId:Ext.getCmp('buildingName').getValue(),
                                operator:Ext.getCmp('operator').getValue(),
                                timeStart:Ext.getCmp('startTime').getValue(),
                                timeEnd:Ext.getCmp('endTime').getValue(),
                            }
                        });
                    }
                }]
        });



        var backlistgrid1=Ext.create('Ext.grid.Panel',{
            // id : 'PickingListGrid',
            store:backListStore,//修改
            dock: 'bottom',
            columns:[
                {
                    dataIndex:'workerName',
                    text:'操作人',
                    flex :1
                },
                {
                    dataIndex:'time',
                    text:'创建时间',
                    flex :1,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                },
                {
                    dataIndex:'projectName',
                    text:'所属项目',
                    flex :1
                },
                {
                    dataIndex:'buildingName',
                    text:'所属楼栋',
                    flex :1
                },
                {
                    dataIndex:'account',
                    text:'金额',
                    flex :1
                },
                {
                    dataIndex:'remark',
                    text:'备注',
                    flex :1
                },
            ],
            flex:1,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
            },
            // height:'100%',
            // tbar: toolbar,
            // selType:'checkboxmodel', //选择框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            // dockedItems: [
            //     {
            //         xtype: 'pagingtoolbar',
            //         store: backListStore,   // same store GridPanel is using
            //         dock: 'bottom',
            //         displayInfo: true,
            //         displayMsg:'显示{0}-{1}条，共{2}条',
            //         emptyMsg:'无数据'
            //     }
            // ],

            //多个tbar
            dockedItems:[{
                xtype : 'toolbar',
                dock : 'top',
                items : [toolbar_top]
            },
                {
                    xtype : 'toolbar',
                    dock : 'top',
                    style:'border-width:0 0 0 0;',
                    items : [toolbar]
                },
            ]
        });





        //结算查询信息 panel
        var panel_query = Ext.create('Ext.panel.Panel',{
            //dock: 'bottom',
            title:'结算记录查询',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            width:'100%',
            height:'100%',
            items:[backlistgrid1],
        });

        // this.tbar = toolbar;

        // this.dockedItems=[{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toolbar_top]
        // },
        //     {
        //         xtype : 'toolbar',
        //         dock : 'top',
        //         style:'border-width:0 0 0 0;',
        //         items : [toolbar]
        //     },
        // ];

        this.items = [panel_query];
        this.callParent(arguments);
    }
})