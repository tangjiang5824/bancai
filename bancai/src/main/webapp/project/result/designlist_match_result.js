Ext.define('project.result.designlist_match_result',{
    // extend:'Ext.panel.Panel',
    extend:'Ext.tab.Panel',
    id:'result_tabpanel',
    region: 'center',
    layout:'fit',
    // title: '产品匹配结果查询',
    initComponent: function(){

        var itemsPerPage = 50;
        //var tableName="material";
        //var materialType=

        var fieldValue = 'projectName';

        var tableName = 'query_match_result';
        var columnName = 'designlistId';
        // var columnValue = me.designlistId;

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
                if(grid.columns!=null)
                    count1 = grid.columns.length;
                //console.log("luuuuu:"+count1);
                count2 = grid.getStore().getCount();  //行数(纪录数)
            } else {
                count1 = grid.getStore().getCount();
                count2 = grid.columns.length;
            }
            i=3;
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
                            // var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
                            var index = firstSameCell; //值显示的位置
                            if(rowOrCol == "row"){
                                allRecs[index].set(colName, preValue);
                            } else {
                                allRecs[index1].set(grid.getColumnModel().getColumnId(index), preValue);
                            }
                        }
                    } else {
                        if(j != 0){
                            // var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
                            var index = firstSameCell;//值显示的位置
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
            // var rCount = grid.getStore().getCount();
            // for(i = 0; i < rCount; i ++){
            //     hRow = grid.getView().getRow(i);
            //     hRow.style.border = "none";
            //     //hRow.style.borderBottom= "none";
            //     for(j = 0; j < grid.columns.length; j ++){
            //         // console.log(Ext.get(grid.view.getNode(i)).query('td')[j]);
            //         // console.log(grid.getView());
            //         // console.log(grid.store.getAt(i,j).style.margin="0");
            //         console.log("loglog------------");
            //         // aRow = grid.getView().getCell(i,j);
            //         aRow = Ext.get(grid.view.getNode(i)).query('td')[j]; //获取某一单元格
            //
            //         console.log("---------------pooo:",aRow);
            //         if(aRow != undefined) {
            //             console.log("---------------aRow.:", aRow.getAttribute("class"));
            //             var className = aRow.getAttribute("class");
            //
            //             //若为分组头，则不添加分割线
            //             if ('x-group-hd-container' != className) {
            //                 //
            //                 aRow.style.margin = "0";
            //                 aRow.style.padding = "0";
            //
            //                 if (i == 0) {
            //                     aRow.style.borderTop = "none";
            //                     aRow.style.borderLeft = "1px solid #8db2e3";
            //
            //                 } else if (i == rCount - 1) {
            //                     aRow.style.borderTop = "1px solid #8db2e3";
            //                     aRow.style.borderLeft = "1px solid #8db2e3";
            //                     aRow.style.borderBottom = "1px solid #8db2e3";
            //                 } else {
            //                     aRow.style.borderTop = "1px solid #8db2e3";
            //                     aRow.style.borderLeft = "1px solid #8db2e3";
            //                 }
            //                 if (j == grid.columns.length - 1)
            //                     aRow.style.borderRight = "1px solid #8db2e3";
            //                 if (i == rCount - 1)
            //                     aRow.style.borderBottom = "1px solid #8db2e3";
            //             }
            //         }
            //
            //     }
            // }
            //
            // // 去除合并的单元格的分隔线
            // for(i = 0; i < array1.length; i++){
            //     if(!Ext.isEmpty(array1[i])){
            //         for(j = 0; j < array1[i].length; j++){
            //             if(rowOrCol == "row"){
            //                 aRow = Ext.get(grid.view.getNode(array1[i][j])).query('td')[i]; //获取某一单元格
            //                 // aRow = grid.getView().getCell(array1[i][j],i);
            //                 aRow.style.borderTop = "none";
            //
            //             } else {
            //                 // aRow = grid.getView().getCell(i, array1[i][j]);
            //                 aRow = Ext.get(grid.view.getNode(i)).query('td')[array1[i][j]];
            //                 aRow.style.borderLeft = "none";
            //             }
            //         }
            //     }
            // }
            //
            // for(i = 0; i < count1; i++){
            //     if(rowOrCol == "row"){
            //         var curColName = grid.columns[i].dataIndex; //列名
            //         var curCol = "[" + curColName + "]";
            //         if(cols.indexOf(curCol) < 0)
            //             continue;
            //     }
            //
            //     for(j = 0; j < count2; j++){
            //         // var hbcell = grid.getView().getCell(j,i);
            //         var hbcell = Ext.get(grid.view.getNode(j)).query('td')[i];
            //         hbcell.style.background="#FFF"; //改变合并列所有单元格背景为白色
            //     }
            // }

        };

        //原件类型：枚举类型
        Ext.define('product.model.originType', {
            statics: { // 关键s
                0: { value: '0', name: '未匹配' },
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料新板' },
                9: { value: '5', name: '未匹配成功' },
            }
        });

        var projectListStore = Ext.create('Ext.data.Store',{
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
        var projectList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '项目名',
            labelWidth : 45,
            width : 550,
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : true,
            store: projectListStore,
            listeners:{

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
                        // combo.setValue(r[0].get('projectName'));//第一个值
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
            margin: '0 0 0 40',
            emptyText : "--请选择楼栋名--",
            displayField: 'buildingName',
            valueField: 'id',//楼栋的id
            editable : false,
            autoLoad: true,
            //store: tableListStore2,
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
        //楼栋位置
        var buildingPositionList = Ext.create('Ext.form.ComboBox',{
            fieldLabel : '位置',
            labelWidth : 35,
            width : 200,
            id :  'positionName',
            margin: '0 10 0 40',
            name : 'positionName',
            matchFieldWidth: true,
            // emptyText : "--请选择项目--",
            displayField: 'positionName',
            valueField: 'id',
            // typeAhead : true,
            editable : true,
            store: buildingPositionStore,
        });

        //madeby
        var madebyTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                { "abbr": '0', "name": '未匹配' },
                { "abbr": '1', "name": '退库成品' },
                { "abbr": '2', "name": '预加工半产品' },
                { "abbr": '3', "name": '旧板' },
                { "abbr": '4', "name": '原材料新板' },
                { "abbr": '5', "name": '未匹配成功'}
            ]
        });

        var madebyType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'madeBy',
            name: 'madebyType',
            id: 'madebyType',
            store: madebyTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 20 0 40',
            width: 160,
            labelWidth: 60,
            renderTo: Ext.getBody()
        });

        //分组条件
        var groupFiledTypeList = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                { "abbr": '0', "name": '项目' },
                { "abbr": '1', "name": 'madeBy' },
            ]
        });

        var groupFiledType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '分组条件',
            name: 'groupFiledType',
            id: 'groupFiledType',
            store: groupFiledTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            // margin : '0 20 0 40',
            width: 160,
            labelWidth: 60,
            renderTo: Ext.getBody(),
            //决定分组依据
            listeners:{
                //下拉框默认返回的第一个值
                render : function(combo) {//渲染
                    combo.getStore().on("load", function(s, r, o) {
                        combo.setValue(r[0].get('name'));//第一个值
                    });
                },
                select:function (combo, record) {
                    //选中后
                    var select = record[0].data;
                    var condition = select.name;
                    console.log("------------00",condition)
                    if(condition == '项目'){
                        // groupField
                        fieldValue = 'projectName',
                        console.log("------------1",allpanel_Store.groupField)
                    }else if(condition == 'madeBy'){
                        fieldValue = 'madeBy',
                        console.log("------------2",fieldValue)
                    }
                    //buildingName,下拉框重新加载数据
                    // buildingName.setStore(tableListStore2);

                }
            }

        });

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                projectList,
                buildingName,
                buildingPositionList,
                //madeby
                madebyType,
                // {
                //     xtype : 'button',
                //     text: '查询',
                //     width: 80,
                //     margin: '0 0 0 15',
                //     layout: 'right',
                //     handler: function(){
                //         // var Id = Ext.getCmp("positionName").getValue();
                //         // var projectName = Ext.getCmp("projectName").rawValue;
                //         // console.log("Id-----------",Id)
                //         // console.log("projectName-----------",projectName)
                //         allpanel_Store.load({
                //             params : {
                //                 projectId:Ext.getCmp("projectName").getValue(),
                //                 buildingId:Ext.getCmp("buildingName").getValue(),
                //                 buildingpositionId:Ext.getCmp("positionName").getValue(),
                //                 madeBy:Ext.getCmp("madebyType").getValue(),
                //             }
                //         });
                //     }
                // },
                // {
                //     text: '删除',
                //     width: 80,
                //     margin: '0 0 0 15',
                //     handler: function(){
                //         var select = grid.getSelectionModel().getSelection();
                //         if(select.length==0){
                //             Ext.Msg.alert('错误', '请选择要删除的记录')
                //         }
                //         else{
                //             Ext.Ajax.request({
                //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
                //                 params:{
                //                     tableName:tableName,
                //                     id:select[0].data.id
                //                 },
                //                 success:function (response) {
                //                     Ext.MessageBox.alert("提示","删除成功！")
                //                     grid.store.remove(grid.getSelectionModel().getSelection());
                //                 },
                //                 failure:function (reponse) {
                //                     Ext.MessageBox.alert("提示","删除失败！")
                //
                //                 }
                //             })
                //         }
                //     }
                // }
            ]
        });
        var toobar2 = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                groupFiledType,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        // var Id = Ext.getCmp("positionName").getValue();
                        // var projectName = Ext.getCmp("projectName").rawValue;
                        // console.log("Id-----------",Id)
                        // console.log("projectName-----------",projectName)
                        allpanel_Store.load({
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
                                buildingpositionId:Ext.getCmp("positionName").getValue(),
                                madeBy:Ext.getCmp("madebyType").getValue(),
                            }
                        });
                    }
                },

            ]
        });



        //表格分组，字段名
        var myModel = Ext.define("filedInfo", {
            extend : "Ext.data.Model",
            fields : [ {
                name : "productName_Des",
                type : "string"
            }, {
                name : "materialName",
                type : "string"
            }, {
                name : "materialCount",
                type : "number"
            }, {
                name : "projectName",
                type : "string"
            }, {
                name : "buildingName",
                type : "string"
            }, {
                name : "positionName",
                type : "string"
            },{
                name:'mydeBy',
                type : "string"
            }

            ]
        });

        var str = 'aa';
        //匹配结果
        var allpanel_Store = Ext.create('Ext.data.Store',{
            id: 'allpanel_Store',
            autoLoad: true,
            fields: ['productName_Des','materialName','materialCount'],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "project/queryNewPanelMatchResult.do",//通用接口
                type: 'ajax',
                reader:{
                    type : 'json',
                    rootProperty: 'value',
                    totalProperty: 'totalCount'
                },
                params:{
                    start: 0,
                    limit: itemsPerPage,
                    // projectId:'1',
                    // buildingId:'1',
                    // buildingpositionId:'1',
                }
            },
            model : "filedInfo",
            //表格分组条件
            // groupField : "projectName",
            groupField : fieldValue,
            listeners : {

                //字段拼接
                load:function(store,records){
                    for(var i=0;i<records.length;i++){
                        records[i].set('productName_Des',records[i].get('productName')+" &nbsp;&nbsp;&nbsp;&nbsp;(序号:"+records[i].get('designlistId')+","+product.model.originType[records[i].get('productMadeBy')].name+")");
                    }
                },

                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        projectId:Ext.getCmp("projectName").getValue(),
                        buildingId:Ext.getCmp("buildingName").getValue(),
                        buildingpositionId:Ext.getCmp("positionName").getValue(),
                        madeBy:Ext.getCmp("madebyType").getValue()
                    });
                }
            }
        });

        var grid = Ext.create('Ext.grid.Panel',{
            title: '项目产品匹配结果',
            id: 'all_match_result_dataGrid',
            // model : "filedInfo",
            store: allpanel_Store,
            // groupField : "projectName",
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '项目', dataIndex: 'projectName', flex :1.2,hidden:true},
                { text: '楼栋名', dataIndex: 'buildingName', flex :0.8,hidden:true },
                { text: '位置', dataIndex: 'positionName',flex :0.2, hidden:true},
                { text: 'mydeBy', dataIndex: 'mydeBy', flex :1.2,hidden:true},
                // { text: 'designlistId', dataIndex: 'designlistId',flex :0.2}, //,hidden:true
                { text: '产品名', dataIndex: 'productName_Des', flex :1},
                // { text: '原件', dataIndex: 'madeBy', flex :1.2,
                //     renderer: function (value) {
                //         return product.model.originType[value].name; // key-value
                //     },
                // },
                { text: '材料名', dataIndex: 'name', flex :1 },
                { text: '材料数量', dataIndex: 'count', flex :1},
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            // tbar: toobar,

            features : [ {//定义表格特征
                ftype : "groupingsummary",
                hideGroupedHeader : true//隐藏当前分组的表头
            } ],

            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     store: allpanel_Store,   // same store GridPanel is using
            //     dock: 'bottom',
            //     displayInfo: true,
            //     displayMsg:'显示{0}-{1}条，共{2}条',
            //     emptyMsg:'无数据'
            // }],
            //设置panel多行tbar
            dockedItems:[{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toobar]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toobar2]
                },
                //分页
                {
                    xtype: 'pagingtoolbar',
                    store: allpanel_Store,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],
            listeners: {
                // validateedit : function(editor, e) {
                //     var field=e.field
                //     var id=e.record.data.id
                //     Ext.Ajax.request({
                //         url:"data/EditCellById.do",  //EditDataById.do
                //         params:{
                //             tableName:tableName,
                //             field:field,
                //             value:e.value,
                //             id:id
                //         },
                //         success:function (response) {
                //             //console.log(response.responseText);
                //         }
                //     })
                // },

                //双击表行响应事件
                itemdblclick: function(me, record, item, index,rowModel){
                    var select = record.data
                    //项目id
                    var projectId = select.id;//项目名对应的id

                    console.log("iiiii-----------")
                    console.log(record)

                    // var select = Ext.getCmp('addWorkerGrid').getSelectionModel().getSelection();

                    //选择的产品id
                    var designlistId = record.get('designlistId');

                    var projectName_show = record.get('projectName');
                    var buildingName_show = record.get('buildingName');
                    var positionName_show = record.get('positionName');
                    var productName_show = record.get('productName');

                    console.log('11111',designlistId)
                    if(select.length==0)
                        Ext.Msg.alert('错误', '请选择要修改的数据');
                    else
                    {
                        // //修改匹配结果
                        // var edit = Ext.create('project.result.matchResultEdit',{
                        //     //页面传参数
                        //     designlistId:designlistId,
                        //     // projectMatch_List:projectMatch_List,
                        // });
                        // edit.show();
                        var edit_panel = Ext.create('project.result.matchResult_Edit_panel',{
                                //页面传参数
                            designlistId:designlistId,
                            productName_show:productName_show,
                            positionName_show:positionName_show,
                            projectName_show:projectName_show,
                            buildingName_show:buildingName_show,
                                // projectMatch_List:projectMatch_List,
                        });

                        //另一个tab页面
                        var tabPanel = Ext.getCmp('result_tabpanel');
                        var tabs = Ext.getCmp('editPanel');
                        if(!tabs){
                            var t = tabPanel.add({
                                // title:requisitionOrderId+'领料单明细',
                                title:'产品匹配结果修改',
                                id:'editPanel',
                                layout:'fit',
                                items:[edit_panel],
                                closable:true,
                                closeAction:'hide',
                                autoDestroy: true,
                            });
                            tabPanel.setActiveTab(t);
                        }
                        else{
                            tabs.show();
                        }

                        //关闭
                        tabPanel.on('beforeremove', function(tabs, tab) {
                            // console.log("beforeremove----",tabs)
                            // tabPanel.remove(tab);
                            // Ext.getCmp("pick_tabpanel").remove(Ext.getCmp("myPanel"));
                            return false;
                        });


                    }

                }
            }
        });

        // //设置panel多行tbar
        // this.dockedItems=[{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toobar]
        // },{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toobar2]
        // }
        // ];

        this.items = [grid];
        this.callParent(arguments);



        // ==>监听load , 执行合并单元格
        var gridp = Ext.getCmp('all_match_result_dataGrid');
        Ext.getCmp('all_match_result_dataGrid').getStore().on('load', function () {
            gridSpan(gridp,"row","[productName_Des]");  //，以designId分组（为同一个产品的所有组成材料）
        });

    }

})
