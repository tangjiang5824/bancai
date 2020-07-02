Ext.define('project.product_produce_list',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '生产材料单查询',
    initComponent: function(){
        var itemsPerPage = 50;
        var tableName="materialstore";
        var materialType="0"; //旧版

        var projectListStore = Ext.create('Ext.data.Store',{
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


        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,//'35%'
            id :  'projectName',
            name : 'projectName',
            matchFieldWidth: true,
            emptyText : "--请选择项目名--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners: {
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
        //楼栋
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

        //弹出窗口的表格，产品信息表
        var product_grid=Ext.create('Ext.grid.Panel',{
            id : 'product_grid',
            style:"text-align:center;",
            // store: newpanelMaterial_Store,
            columns:[
                { text: '产品名', dataIndex: 'productName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料数量', dataIndex: 'materialCount', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '楼栋Id', dataIndex: 'buildingId',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
            ],
            flex:1,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                // store: productMaterial_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
        });


        //具体信息弹出窗口
        var win_showSpecial_ProductData = Ext.create('Ext.window.Window', {
            id:'win_showbuildingData',
            title: '项目楼栋信息',
            height: 500,
            width: 650,
            layout: 'fit',
            closable : true,
            draggable:true,
            // tbar:toolbar_pop, //弹出框的toolbar
            items:product_grid,
            closeAction : 'hide',
            modal:true,//模态窗口，背景窗口不可编辑
        });



        //产品匹配结果store
        var product_matchResult_Store = Ext.create('Ext.data.Store',{
            id: 'product_matchResult_Store',
            autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                // url : "org/data/history_ExcelList.do",
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        tableName :tableName,
                    });
                }
            }
        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'uploadRecordsMain',
            store: product_matchResult_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '产品名称',  dataIndex: 'productName' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '生产数量',  dataIndex: 'count' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '清单名称',  dataIndex: 'listName' ,flex :0.4, editor:{xtype : 'textfield', allowBlank : false}},

            ],
            //对单元格单击响应的插件
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: product_matchResult_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data
                    //项目id
                    // var projectId = select.id;//项目名对应的id
                    // console.log("iiiii")
                    // console.log(projectId)

                    var productMaterial_Store = Ext.create('Ext.data.Store',{
                        id: 'productMaterial_Store',
                        autoLoad: false,
                        fields: [],
                        pageSize: itemsPerPage, // items per page
                        proxy:{
                            url : "material/findAllbyTableNameAndOnlyOneCondition.do",//通用接口
                            type: 'ajax',
                            reader:{
                                type : 'json',
                                rootProperty: 'newpanelmateriallist_name',
                                totalProperty: 'totalCount'
                            },
                        },
                        listeners : {
                            beforeload : function(store, operation, eOpts) {
                                store.getProxy().setExtraParams({
                                    // tableName :tableName,
                                    // startWidth:Ext.getCmp('startWidth').getValue(),
                                });
                            }
                        }
                    });

                    //将projectId传给弹出框
                    // Ext.getCmp("toolbar_pop").items.items[0].setText(projectId);
                    product_grid.setStore(productMaterial_Store);
                    Ext.getCmp('win_showSpecial_ProductData').show();

                },

                //双击修改
                //监听单元格数据修改
                validateedit : function(editor, e) {
                    var field=e.field
                    var id=e.record.data.id
                    //后台响应
                    Ext.Ajax.request({
                        url:"EditDataById.do",
                        method:'POST',
                        //传入的参数
                        params:{
                            tableName:tableName,
                            field:field,
                            value:e.value,
                            id:id
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示", "修改成功！");
                            //console.log(response.responseText);
                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "修改失败！");
                        }
                    })

                }
                }
        });

        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar1",
            items : [   projectList,
                buildingName,

            ]//exceluploadform
        });
        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id : "toolbar2",
            items : [
                {
                    xtype: 'textfield',
                    // margin: '0 10 0 0',
                    fieldLabel: ' 清单名称',
                    id: 'listName',
                    width: 230,
                    labelWidth: 60,
                    name: 'listName',
                    value: "",
                },{
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        product_matchResult_Store.load({
                            params : {
                                //proNum : Ext.getCmp('proNum').getValue(),

                            }
                        });
                    }
                },
            ]
        });

        //多行toolbar
        this.dockedItems=[{
            xtype : 'toolbar',
            dock : 'top',
            items : [toolbar1]
        },{
            xtype : 'toolbar',
            dock : 'top',
            style:'border-width:0 0 0 0;',
            items : [toolbar2]
        },
        ];

        this.items = [grid];
        this.callParent(arguments);


        /*
         * *合并单元格的函数，合并表格内所有连续的具有相同值的单元格。调用方法示例：
         * *store.on("load",function(){gridSpan(grid,"row","[FbillNumber],[FbillDate],[FAudit],[FAuditDate],[FSure],[FSureDate]","FbillNumber");});
         * *参数：grid-需要合并的表格,rowOrCol-合并行还是列,cols-需要合并的列（行合并的时候有效）,sepCols以哪个列为分割(即此字段不合并的2行，其他字段也不许合并)，默认为空
         */
        function gridSpan(grid, rowOrCol, cols, sepCol){
            // alert('grid===='+grid+';rowOrCol='+rowOrCol+';cols='+cols);
            var array1 = new Array();
            var arraySep = new Array();
            var count1 = 0;
            var count2 = 0;
            var index1 = 0;
            var index2 = 0;
            var aRow = undefined;
            var preValue = undefined;
            var firstSameCell = 0;
            var allRecs = grid.getStore().getRange();
            if(rowOrCol == "row"){
                // count1 = grid.getColumnModel().getColumnCount();  //列数columns
                count1 = grid.columns.length;
                // console.log("luuuuu:"+count1);
                count2 = grid.getStore().getCount();  //行数(纪录数)
            } else {
                count1 = grid.getStore().getCount();
                count2 = grid.getColumnModel().getColumnCount();
            }
            for(i = 0; i < count1; i++){
                if(rowOrCol == "row"){
                    // var curColName = grid.getColumnModel().getDataIndex(i); //列名
                    var curColName = grid.columns[i].dataIndex; //列名
                    // console.log("lieming:"+curColName);
                    var curCol = "[" + curColName + "]";

                    if(cols.indexOf(curCol) < 0)
                        continue;
                }

                preValue = undefined;
                firstSameCell = 0;
                array1[i] = new Array();
                for(j = 0; j < count2; j++){

                    if(rowOrCol == "row"){
                        index1 = j;
                        index2 = i;
                    } else {
                        index1 = i;
                        index2 = j;
                    }
                    // var colName = grid.getColumnModel().getDataIndex(index2);
                    var colName = grid.columns[index2].dataIndex;
                    if(sepCol && colName == sepCol)
                        arraySep[index1] = allRecs[index1].get(sepCol);
                    var seqOldValue = seqCurValue = "1";
                    if(sepCol && index1 > 0){
                        seqOldValue = arraySep[index1 - 1];
                        seqCurValue = arraySep[index1];
                    }

                    if(allRecs[index1].get(colName) == preValue && (colName == sepCol || seqOldValue == seqCurValue)){
                        //alert(colName + "======" + seqOldValue + "======" + seqCurValue);
                        allRecs[index1].set(colName, "");
                        array1[i].push(j);
                        if(j == count2 - 1){
                            var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
                            if(rowOrCol == "row"){
                                allRecs[index].set(colName, preValue);
                            } else {
                                allRecs[index1].set(grid.getColumnModel().getColumnId(index), preValue);
                            }
                        }
                    } else {
                        if(j != 0){
                            var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
                            if(rowOrCol == "row"){
                                allRecs[index].set(colName, preValue);
                            } else {
                                allRecs[index1].set(grid.getColumnModel().getColumnId(index), preValue);
                            }
                        }
                        firstSameCell = j;
                        preValue = allRecs[index1].get(colName);
                        allRecs[index1].set(colName, "");
                        if(j == count2 - 1){
                            allRecs[index1].set(colName, preValue);
                        }
                    }

                }
            }
            grid.getStore().commitChanges();

            // 添加所有分隔线
            var rCount = grid.getStore().getCount();
            for(i = 0; i < rCount; i ++){
                hRow = grid.getView().getRow(i);
                hRow.style.border = "none";
                //hRow.style.borderBottom= "none";
                for(j = 0; j < grid.columns.length; j ++){
                    console.log(Ext.get(grid.view.getNode(i)).query('td')[j]);
                    // console.log(grid.getView());
                    // console.log(grid.store.getAt(i,j).style.margin="0");
                    console.log("loglog------------");
                    // aRow = grid.getView().getCell(i,j);
                    aRow = Ext.get(grid.view.getNode(i)).query('td')[j]; //获取某一单元格

                    aRow.style.margin="0";
                    aRow.style.padding="0";

                    if(i == 0){
                        aRow.style.borderTop = "none";
                        aRow.style.borderLeft = "1px solid #8db2e3";

                    }else if(i == rCount - 1){
                        aRow.style.borderTop = "1px solid #8db2e3";
                        aRow.style.borderLeft = "1px solid #8db2e3";
                        aRow.style.borderBottom = "1px solid #8db2e3";
                    }else{
                        aRow.style.borderTop = "1px solid #8db2e3";
                        aRow.style.borderLeft = "1px solid #8db2e3";
                    }
                    if(j == grid.columns.length-1)
                        aRow.style.borderRight = "1px solid #8db2e3";
                    if(i == rCount-1)
                        aRow.style.borderBottom = "1px solid #8db2e3";
                }
            }
            // 去除合并的单元格的分隔线
            for(i = 0; i < array1.length; i++){
                if(!Ext.isEmpty(array1[i])){
                    for(j = 0; j < array1[i].length; j++){
                        if(rowOrCol == "row"){
                            aRow = Ext.get(grid.view.getNode(array1[i][j])).query('td')[i]; //获取某一单元格
                            // aRow = grid.getView().getCell(array1[i][j],i);
                            aRow.style.borderTop = "none";

                        } else {
                            // aRow = grid.getView().getCell(i, array1[i][j]);
                            aRow = Ext.get(grid.view.getNode(i)).query('td')[array1[i][j]];
                            aRow.style.borderLeft = "none";
                        }
                    }
                }
            }

            for(i = 0; i < count1; i++){
                if(rowOrCol == "row"){
                    var curColName = grid.columns[i].dataIndex; //列名
                    var curCol = "[" + curColName + "]";
                    if(cols.indexOf(curCol) < 0)
                        continue;
                }

                for(j = 0; j < count2; j++){
                    // var hbcell = grid.getView().getCell(j,i);
                    var hbcell = Ext.get(grid.view.getNode(j)).query('td')[i];
                    hbcell.style.background="#FFF"; //改变合并列所有单元格背景为白色
                }
            }

        };
        // ==>监听load , 执行合并单元格
        var gridp = Ext.getCmp('product_grid');
        Ext.getCmp('product_grid').getStore().on('load', function () {
            gridSpan(gridp,"row","[productName]");

        });
    }
})