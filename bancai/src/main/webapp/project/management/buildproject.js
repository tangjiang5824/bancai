Ext.define('project.management.buildproject', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '项目立项',
    // reloadPage : function() {
    //     var p = Ext.getCmp('functionPanel');
    //     p.removeAll();
    //     cmp = Ext.create("data.UploadDataTest");
    //     p.add(cmp);
    // },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        //定义表名,计划清单
       // var tableName="planList";
        //var materialtype="0";


        //卡点名称
        // var nameStore = new Ext.data.Store({
        // 	proxy: new Ext.data.HttpProxy({
        // 		url: jt.webContextRoot+'productionOfEvidence/findZhanDianName.action' }),
        // 	reader: new Ext.data.JsonReader(
        // 		{ nameList: "" },        //后台获得的数据，传给前台的数据集合
        // 		["zhandianName"]         //json字符串的key
        // 	)
        // });
        // nameStore.load();
        // //下拉框
        // var zhandianName= new Ext.form.ComboBox({
        // 	fieldLabel: "站点名称",
        // 	name: 'zhandianName',
        // 	id: 'zhandianName',
        // 	displayField: 'zhandianName',   //显示的字段
        // 	triggerAction: 'all',
        // 	store: nameStore,
        // 	mode: 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
        // 	editable: false,
        // 	anchor: '100%',
        // });

        //是否是预加工
        var isPreprocessStore = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"0", "name":"否"},
                {"abbr":"1", "name":"是"},
            ]
        });

        var isPreprocess = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '项目是否为预加工',
            name: 'isPreprocess',
            id: 'isPreprocess',
            store: isPreprocessStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 0 0 40',
            width: 190,
            labelWidth: 110,
            renderTo: Ext.getBody(),
            listeners:{
                select:function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var abbr = select.abbr;//项目名对应的id
                    var value = select.name;//项目名对应的名字
                    console.log('abbr----------',abbr);
                    console.log('avaluebbr----------',value);
                    var addBuild_btn = Ext.getCmp('addBuild');
                    //1--若是预加工项目，则不允许添加楼栋
                    if(abbr == 0){
                        addBuild_btn.setHidden(false);
                    }else{
                        addBuild_btn.setHidden(true);
                    }
                }
            }
        });

        var toolbar_1 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 10 0 0',
                    fieldLabel: '项目名',
                    id :'projectName',
                    // width: '35%',
                    width: 700,
                    labelWidth: 50,
                    allowBlank:false,
                    name: 'projectName',
                    value:"",
                },
                isPreprocess
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
        var toolbar_2 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                // {
                //     xtype: 'textfield',
                //     margin : '0 10 0 0',
                //     fieldLabel: '计划负责人',
                //     id :'planLeader',
                //     width: 180,
                //     labelWidth: 80,
                //     name: 'planLeader',
                //     value:"",
                // },
                {
                    fieldLabel : '计划负责人',
                    xtype : 'combo',
                    name : 'planLeader',
                    id : 'planLeader',
                    margin: '0 10 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '生产负责人',
                    xtype : 'combo',
                    name : 'produceLeader',
                    id : 'produceLeader',
                    margin: '0 10 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '采购负责人',
                    xtype : 'combo',
                    name : 'purchaseLeader',
                    id : 'purchaseLeader',
                    margin: '0 10 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '财务负责人',
                    xtype : 'combo',
                    name : 'financeLeader',
                    id : 'financeLeader',
                    margin: '0 10 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                {
                    fieldLabel : '仓库负责人',
                    xtype : 'combo',
                    name : 'storeLeader',
                    id : 'storeLeader',
                    margin: '0 10 0 0',
                    width: 180,
                    labelWidth: 80,
                    store : workerListStore,
                    displayField : 'workerName',
                    valueField : 'id',
                    editable : true,
                },
                ]
        });
        var toolbar_3 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '计划开始时间',
                    width : 180,
                    labelWidth : 80,
                    id : "proStartTime",
                    name : 'proStartTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                },  {
                    xtype : 'monthfield',
                    margin : '0 10 0 0',
                    fieldLabel : '预计结束时间',
                    width : 180,
                    labelWidth : 80,
                    id : "proEndTime",
                    name : 'proEndTime',
                    //align: 'right',
                    format : 'Y-m-d',
                    editable : false,
                    // value:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.MONTH,-1),"Y-m-d")
                    value : Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY), "Y-m-d")
                }]
        });

        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                id:'addBuild',
                text : '添加楼栋',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        '楼栋编号' : '',
                        '楼栋名' : '',
                        '楼栋负责人' : ''
                    }];

                    //若无项目名，则不能添加楼栋
                    var projectName = Ext.getCmp("projectName").getValue();
                    if(projectName != ''){
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('addDataGrid').getStore().loadData(data,
                            true);
                    }else{
                        Ext.MessageBox.alert("警告","项目名不能为空!",function(r) {
                            //    r = cancel||ok
                        });
                    }
                }
            },
            ]
        });

        var buildingOwnerList=Ext.create('Ext.form.ComboBox',{
            id :  'buildingOwnerList',
            name : 'buildingOwnerList',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'workerName',
            valueField: 'id',
            forceSelection: true,
            editable : false,
            triggerAction: 'all',
            selectOnFocus:true,
            store: workerListStore,
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addDataGrid',
            dockedItems : [toolbar2],
            store : {
                fields: ['楼栋编号',"楼栋名","楼栋负责人"]
            },
            columns : [ {
                dataIndex : 'buildingNo',
                text : '楼栋编号',
                width : 150,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,
                }
            }, {
                dataIndex : 'buildingName',
                text : '楼栋名',
                width : 150,
                editor : {// 文本字段
                    xtype : 'textfield',
                    allowBlank : false,
                }
            },{
                dataIndex : 'buildingOwner',
                text : '楼栋负责人',
                width : 150,
                //下拉框
                // editor : {// 文本字段
                //     xtype : 'textfield',
                //     allowBlank : false,
                // }
                editor:buildingOwnerList,renderer:function(value, cellmeta, record){
                    var index = workerListStore.find(buildingOwnerList.valueField,value);
                    var ehrRecord = workerListStore.getAt(index);
                    var returnvalue = "";
                    if (ehrRecord) {
                        returnvalue = ehrRecord.get('typeName');
                    }
                    return returnvalue;
                }
            }
            ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel',
        });

        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [  {
                xtype: 'displayfield',
                margin : '0 10 0 0',
                fieldLabel: '楼栋信息',
                id :'planList',
                //labelWidth: 60,
            }]
        });

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
                text : '创建新项目',
                region:'center',
                bodyStyle: 'background:#fff;',
                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var select = Ext.getCmp('addDataGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        if(rec.data.buildingNo!="")
                        s.push(JSON.stringify(rec.data));
                    });

                    //获取数据
                    var sTime=Ext.Date.format(Ext.getCmp('proStartTime').getValue(), 'Y-m-d H:i:s');

                    Ext.Ajax.request({
                        url : 'generate_project.do', //createProject.do
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            //tableName:tableName,
                            //materialType:materialtype,
                            proStartTime:sTime,
                            planLeaderId:Ext.getCmp('planLeader').getValue(),
                            produceLeaderId:Ext.getCmp('produceLeader').getValue(),
                            proEndTime:Ext.getCmp('proEndTime').getValue(),
                            purchaseLeaderId:Ext.getCmp('purchaseLeader').getValue(),
                            financeLeaderId:Ext.getCmp('financeLeader').getValue(),
                            storeLeaderId:Ext.getCmp('storeLeader').getValue(),
                            projectName:Ext.getCmp('projectName').getValue(),
                            isPreprocess:Ext.getCmp('isPreprocess').getValue(),//项目是否为预加工
                            s : "[" + s + "]",
                        },
                        success : function(response) {
                            var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示",message );
                        },
                        failure : function(response) {
                            var message =Ext.decode(response.responseText).showmessage;
                            Ext.MessageBox.alert("提示",message );
                        }
                    });

                }
            }]
        });

        this.dockedItems = [toolbar_1,toolbar_2,toolbar_3,grid,toolbar3];
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

