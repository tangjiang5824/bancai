Ext.define('project.project_package_list',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '查询新板匹配规则',
    initComponent: function(){
        var itemsPerPage = 50;
        //var tableName="package";
        Ext.define('Soims.model.application.ApplicationState', {
            statics: { // 关键
                0: { value: '0', name: '墙板' },
                1: { value: '1', name: '梁板' },
                2: { value: '2', name: 'K板' },
                3: { value: '3', name: '异型' },
                //
            }
        });

        //是否后缀匹配：枚举类型
        Ext.define('newPanel.material.isCompleteSuffix', {
            statics: { // 关键s
                0: { value: '0', name: '否' },
                1: { value: '1', name: '是' },
            }
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
        var productTypeNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'productTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=producttype',
                reader : {
                    type : 'json',
                    rootProperty: 'producttype',
                }
            },
            autoLoad : true
        });
        var productTypeNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品类型',
            labelWidth : 70,
            width : 230,
            id :  'productTypeName',
            name : 'productTypeName',
            matchFieldWidth: false,
            emptyText : "--请选择--",
            displayField: 'productTypeName',
            valueField: 'id',
            editable : false,
            store: productTypeNameStore,
            listeners:{
                select: function(combo, record, index) {

                    console.log(productTypeList.getValue());// MaterialTypeList.getValue()获得选择的类型
                    //console.log(record[0].data.materialName);
                }
            }

        });
        var MaterialTypeNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'MaterialTypeName'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=material_type',
                reader : {
                    type : 'json',
                    rootProperty: 'material_type',
                },
                fields : ['id','typeName']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });
        var MaterialTypeNameList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '原材料品名',
            labelWidth : 70,
            width : 260,
            id :  'typeName',
            name : 'typeName',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'typeName',
            valueField: 'id', //显示name
            editable : true,
            store: MaterialTypeNameStore,
        });
        var productFormatStore = Ext.create('Ext.data.Store',{
            fields : [ 'productFormat'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=product_format',
                reader : {
                    type : 'json',
                    rootProperty: 'product_format',
                },
                fields : ['id','productFormat']
            },
            //字段拼接
            // listeners:{
            //     load:function(store,records){
            //         for(var i=0;i<records.length;i++){
            //             records[i].set('material_name',records[i].get('materialName')+"(规格:"+records[i].get('specification')+")");
            //         }
            //     }
            // },
            autoLoad : true
        });
        var productFormatList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '产品格式',
            labelWidth : 70,
            width : 260,
            id :  'productFormat',
            name : 'productFormat',
            matchFieldWidth: true,
            // allowBlank:false,
            emptyText : "--请选择--",
            displayField: 'productFormat',
            valueField: 'id', //显示name
            editable : true,
            store: productFormatStore,
        });

        var projectNameStore = Ext.create('Ext.data.Store',{
            fields : [ 'projectName'],
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
        var projectNameCombo = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 300,//'35%'
            queryMode: 'local',
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectNameStore,
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus:true,
            listeners: {
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

                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedProjectName.do',
                    // 	params:{
                    // 		projectName:Ext.getCmp('projectName').getValue()
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })
                }
            }

        });

        var buildingName = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '楼栋名',
            labelWidth : 45,
            width : 200,
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
            listeners: {
                load:function () {

                    // // projectName:Ext.getCmp('projectName').getValue();
                    // // buildingName:Ext.getCmp('buildingName').getValue();
                    // Ext.Ajax.request({
                    // 	url:'project/getSelectedBuildingName.do',
                    // 	params:{
                    // 		//projectName:Ext.getCmp('projectName').getValue(),
                    // 		buildingName:Ext.getCmp('buildingName').getValue(),
                    // 	},
                    // 	success:function (response,config) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	},
                    // 	failure:function (form, action) {
                    // 		//alert("combox1把数据传到后台成功");
                    // 	}
                    // })

                }
            }
        });

        var buildingPositionStore = Ext.create('Ext.data.Store',{
            fields : [ 'buildingPosition'],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName=building_position',

                reader : {
                    type : 'json',
                    rootProperty: 'building_position',
                }
            },
            autoLoad : true
        });


        var buildingPositionList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '位置',
            labelWidth : 60,
            width : 200,
            margin: '0 10 0 40',
            id :  'positionName',
            name : 'positionName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'positionName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: buildingPositionStore,
            // listeners: {
            //
            //     //下拉框默认返回的第一个值
            //     render: function (combo) {//渲染
            //         combo.getStore().on("load", function (s, r, o) {
            //             combo.setValue(r[0].get('projectName'));//第一个值
            //         });
            //     }
            // }

        });

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                // productTypeNameList,
                // MaterialTypeNameList,
                // productFormatList,
                projectNameCombo,
                buildingName,
                buildingPositionList,
                {
                    xtype : 'button',
                    text: '查看包',
                    //width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        uploadRecordsStore.load({
                            params : {
                                projectId : Ext.getCmp("projectName").getValue(),
                                buildingId : Ext.getCmp("buildingName").getValue(),
                                positionId : Ext.getCmp("positionName").getValue(),
                                tableName:"package",

                            }
                        });
                    }
                },
            ]
        })
        //添加、删除包
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            items: [
                {
                    xtype:'tbtext',
                    text:'<strong>添加/删除包:</strong>',
                    margin: '0 40 0 0',
                },
                {   xtype : 'button',
                    margin: '0 40 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加包',
                    handler: function(){
                        var data = [{
                            'packageId' : '',
                            'packageName':'',
                            'packageWeight' : '',
                        }];
                        Ext.getCmp('uploadRecordsMain').getStore().loadData(data, true);
                    }
                },
                //删除行数据
                {
                    xtype : 'button',
                    margin: '0 0 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除包',
                    handler: function(){
                        var sm = Ext.getCmp('uploadRecordsMain').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('uploadRecordsMain').getStore().remove(oldpanelArr);
                                } else {
                                    return;
                                }
                            });
                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }
                    }
                },
                {
                    xtype : 'button',
                    margin: '0 0 0 0',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删除包',
                    handler: function(){
                        var sm = Ext.getCmp('uploadRecordsMain').getSelectionModel();
                        var oldpanelArr = sm.getSelection();
                        if (oldpanelArr.length != 0) {
                            Ext.Msg.confirm("提示", "共选中" + oldpanelArr.length + "条数据，是否确认删除？", function (btn) {
                                if (btn == 'yes') {
                                    //先删除后台再删除前台
                                    //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                    //Extjs 4.x 删除
                                    Ext.getCmp('uploadRecordsMain').getStore().remove(oldpanelArr);
                                } else {
                                    return;
                                }
                            });
                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }
                    }
                },
            ]
        });
        //自动将读取到的数据返回到页面中
        var uploadRecordsStore = Ext.create('Ext.data.Store',{
            //id: 'uploadRecordsStore',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                //url:"hisExcelList.do",
                url : "project/queryPackageList.do",
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
                    projectId : Ext.getCmp("projectName").getValue(),
                    buildingId : Ext.getCmp("buildingName").getValue(),
                    positionId : Ext.getCmp("positionName").getValue(),
                    tableName:"package",
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        projectId : Ext.getCmp("projectName").getValue(),
                        buildingId : Ext.getCmp("buildingName").getValue(),
                        positionId : Ext.getCmp("positionName").getValue(),
                        tableName:"package",

                    });
                }

            }

        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            saveBtnText: '保存',
            cancelBtnText: '取消',
            autoCancel: false
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
        //弹出表格，楼栋信息表
        var building_grid=Ext.create('Ext.grid.Panel',{
            id : 'building_grid',
            style:"text-align:center;",
            // store:store1,//specificMaterialList，store1的数据固定
            // dock: 'bottom',
            // bbar:toolbar4,
            columns:[
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 60,
                    align: 'center',
                    sortable: false
                },
                {
                    text: '产品名称',
                    dataIndex: 'productName',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    text: '位置',
                    dataIndex: 'position',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    text: '图号',
                    dataIndex: 'figureNum',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    text: '状态',
                    dataIndex: 'productInPackage',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    text: '楼栋编号',
                    dataIndex: 'buildingNo',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
                {
                    dataIndex : 'buildingName',
                    text : '楼栋名',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },{
                    dataIndex : 'buildingLeader',
                    text : '楼栋负责人',
                    flex :1,
                    editor:buildingOwnerList,renderer:function(value, cellmeta, record){
                        var index = workerListStore.find(buildingOwnerList.valueField,value);
                        var ehrRecord = workerListStore.getAt(index);
                        var returnvalue = "";
                        if (ehrRecord) {
                            returnvalue = ehrRecord.get('workerName');
                        }
                        return returnvalue;
                    }


                },{
                    xtype:'actioncolumn',
                    text : '删除操作',
                    width:100,
                    style:"text-align:center;",
                    items: [
                        //修改按钮
                        // {
                        //     icon: 'extjs/imgs/edit.png',  // Use a URL in the icon config
                        //     tooltip: 'Edit',
                        //     style:"margin-right:20px;",
                        //     handler: function(grid, rowIndex, colIndex) {
                        //         // var records = grid.getSelectionModel();
                        //         // var rec = records.getSelection();
                        //
                        //         var rec = grid.getStore().getAt(rowIndex);
                        //         console.log("当前修改选中：",rec)
                        //         // Ext.getCmp('building_grid').getStore().remove(rec);
                        //     }
                        // },
                        //删除按钮
                        {
                            icon: 'extjs/imgs/delete.png',
                            tooltip: 'Delete',
                            style:"margin-right:20px;",
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                console.log("删除：",rec.data.id)
                                //楼栋id
                                var buildingId = rec.data.id;
                                //弹框提醒
                                Ext.Msg.show({
                                    title: '操作确认',
                                    message: '将删除数据，选择“是”否确认？',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                // url:"material/backMaterialstore.do",  //删除楼栋信息
                                                params:{
                                                    buildingId:buildingId,
                                                },
                                                success:function (response) {
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('building_grid').getStore().remove(rec);
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
                    // name : '操作',
                    // text : '操作',
                    // renderer:function(value, cellmeta){
                    //     return "<INPUT type='button' value='删除' style='font-size: 6px;height:20px;width:35px;'>";
                    //     // return "<INPUT type='button' value='删 除' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    // }
                }
            ],
            flex:1,
            selType:'checkboxmodel',
            // plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
            //     clicksToEdit : 2
            // })],
            plugins : [rowEditing], //行编辑

            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    var flag=false;
                    if(id === "" || id ==null|| isNaN(id)){
                        flag=true;
                        id='0'
                    }
                    //项目id
                    var project_Id = Ext.getCmp("project_id").text;
                    console.log("项目id：",project_Id)

                    //修改的行数据
                    var data = editor.context.newValues;
                    //每个属性值
                    var buildingNo = data.buildingNo;
                    var buildingName = data.buildingName;
                    var buildingLeader = data.buildingLeader;


                    var s = new Array();
                    //修改的一行数据
                    s.push(JSON.stringify(data));
                    // console.log("editor===",editor.context.newValues)  //

                    Ext.Ajax.request({
                        url:"project/addAndupdateBuiling.do",  //EditDataById.do
                        params:{
                            // tableName:table_name,
                            projectId:project_Id,
                            // field:field,
                            // value:e.value,
                            id:id,
                            // s : "[" + s + "]",
                            buildingNo:buildingNo,
                            buildingName:buildingName,
                            buildingLeader:buildingLeader
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            if(flag){
                                e.record.data.id=response.responseText;
                            }
                            //重新加载
                            Ext.getCmp('building_grid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
            }
        });

        //弹出框的表头
        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            items: [
                // MaterialTypeList,
                {
                    //保存projectId的值
                    xtype: 'tbtext',
                    id:'project_id',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    text: ' ',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    hidden:true
                },
                {
                    xtype: 'textfield',
                    id:'selectWeight',
                    iconAlign: 'center',
                    iconCls: 'rukuicon ',
                    width: 180,
                    labelWidth: 80,
                    fieldLabel: '已选重量',//默认为空
                    region: 'center',
                    bodyStyle: 'background:#fff;',
                    //hidden:true
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '确认入包',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{

                            '楼栋编号' : '',
                            '楼栋名' : '',
                            '楼栋负责人' : ''

                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('building_grid').getStore().loadData(data,
                            true);

                    }

                },
            ]
        });

        //弹出窗口
        var win_showbuildingData = Ext.create('Ext.window.Window', {
            // id:'win_showbuildingData', //添加id，会影响弹框界面混乱
            title: '包中信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            tbar:toolbar_pop,
            items:building_grid,
            closeAction : 'hidden',
            modal:true,//模态窗口，背景窗口不可编辑
        });
        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: uploadRecordsStore,
            viewConfig : {
                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>查询无数据</div>",
                deferEmptyText: false,
                enableTextSelection : true,
                ptype : "gridviewdragdrop",
                dragText : "可用鼠标拖拽进行上下排序"
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            //readOnly:true,
            columns : [
                {dataIndex : 'projectName', text : '项目名', flex :1,editor : {xtype : 'textfield', allowBlank : false,},},
                {dataIndex : 'buildingName', text : '楼栋名', flex :1,editor : {xtype : 'textfield', allowBlank : false,},},
                {dataIndex : 'buildingpositionName', text : '位置', flex :1,editor : {xtype : 'textfield', allowBlank : false,},},
                {dataIndex : 'packageId', text : '打包编号', flex :1,editor : {xtype : 'textfield', allowBlank : false,},},
                {text: '包名', dataIndex: 'packageName', flex :1,  editor : {xtype : 'textfield', allowBlank : false,}  },
                {dataIndex : 'packageWeight', text : '累计重量', flex :1, editor : {xtype : 'textfield', allowBlank : false,}},
                {
                    // name : '操作',
                    // name : '操作',
                    text : '操作',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='包内产品' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                },
            ],

            //tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: uploadRecordsStore,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            },{
                xtype : 'toolbar',
                //dock : 'top',
                items : [toolbar1]
            },

                {
                    xtype : 'toolbar',
                    //dock : 'top',
                    items : [toolbar2]
                },
            ],
            listeners: {
                //监听修改
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
                    })
                },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data
                    //项目id
                    var projectId = select.id;//项目名对应的id

                    console.log("iiiii")
                    console.log(projectId)

                    var buildinglList_projectId = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['buildingNo','buildingName','buildingLeader'],
                        proxy : {
                            type : 'ajax',
                            url : 'project/findBuilding.do?projectId='+projectId,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'building',
                            },
                            // params:{
                            //     materialName:materialName,
                            //     // start: 0,
                            //     // limit: itemsPerPage
                            // }
                        },
                        autoLoad : true
                    });

                    //将projectId传给弹出框
                    Ext.getCmp("toolbar_pop").items.items[0].setText(projectId);
                    building_grid.setStore(buildinglList_projectId);
                    win_showbuildingData.show();
                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);
    }
})