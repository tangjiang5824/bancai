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
                null: { value: 'null', name: 'null' },
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
            fieldLabel: '匹配结果来源',
            name: 'madebyType',
            id: 'madebyType',
            store: madebyTypeList,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            margin : '0 0 0 40',
            width: 180,
            labelWidth: 80,
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
                //groupFiledType,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 40 0 0',
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
                {
                    xtype : 'button',
                    text: '导出Excel',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        Ext.Ajax.request({
                            url : 'project/printMatchResult.do', //导出Excel
                            method:'POST',
                            //submitEmptyText : false,
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
                                buildingpositionId:Ext.getCmp("positionName").getValue(),
                                madeBy:Ext.getCmp("madebyType").getValue(),
                            },
                            success : function(response) {
                                console.log("12312312312321",response.responseText);
                                // if(response.responseText.includes("false"))
                                // {
                                //     Ext.MessageBox.alert("提示","入库失败，品名不规范" );
                                // }
                                // //var message =Ext.decode(response.responseText).showmessage;
                                // else{
                                //     Ext.MessageBox.alert("提示","入库成功" );
                                // }

                                var res = response.responseText;
                                var jsonobj = JSON.parse(res);//将json字符串转换为对象
                                console.log(jsonobj);
                                console.log("success--------------",jsonobj.success);
                                console.log("errorList--------------",jsonobj['errorList']);
                                var success = jsonobj.success;
                                var errorList = jsonobj.errorList;
                                var errorCode = jsonobj.errorCode;
                                var errorCount = jsonobj.errorCount;
                                if(success == false){
                                    //错误输入
                                    if(errorCode == 200){
                                        //关闭进度条
                                        // Ext.MessageBox.alert("提示","匹配失败，产品位置重复或品名不合法！请重新导入" );
                                        Ext.Msg.show({
                                            title: '提示',
                                            message: '导出Excel失败！',
                                            buttons: Ext.Msg.YESNO,
                                            icon: Ext.Msg.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'yes') {
                                                    //点击确认，显示重复的数据
                                                    //old_inb_errorlistStore.loadData(errorList);
                                                    //win_oldinb_errorInfo_outbound.show();

                                                }
                                            }
                                        });
                                    }
                                    else if(errorCode == 1000){
                                        Ext.MessageBox.alert("提示","导出Excel失败，未知错误！请重新导出Excel" );
                                    }
                                }else{
                                    Ext.MessageBox.alert("提示","导出Excel成功" );
                                }

                            },
                            failure : function(response) {
                                //var message =Ext.decode(response.responseText).showmessage;
                                Ext.MessageBox.alert("提示","导出Excel失败" );
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
            autoLoad: false,
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
                editable:true,

                forceFit: false,
                emptyText: "<div style='text-align:center;padding:8px;font-size:16px;'>无数据</div>",
                deferEmptyText: false
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

                    var tableName = 'query_match_result';
                    var columnName = 'designlistId';
                    var columnValue = designlistId;

                    var projectMatch_List = Ext.create('Ext.data.Store',{
                        //id,materialName,length,width,materialType,number
                        fields:['buildingNo','buildingName','buildingLeader'],
                        proxy : {
                            type : 'ajax',
                            url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+columnName+'&columnValue='+columnValue,//获取同类型的原材料  +'&pickNum='+pickNum
                            reader : {
                                type : 'json',
                                rootProperty: 'query_match_result',
                            },
                        },
                        autoLoad : true
                    });
                    oneProject_match_grid.setStore(projectMatch_List);

                    Ext.getCmp('productName_show').setValue(productName_show);
                    Ext.getCmp('positionName_show').setValue(positionName_show);
                    Ext.getCmp('project_show').setValue(projectName_show);
                    Ext.getCmp('building_show').setValue(buildingName_show);
                    Ext.getCmp('edit_designlistId').setValue(designlistId);

                    console.log('11111',designlistId)
                    if(select.length==0)
                        Ext.Msg.alert('错误', '请选择要修改的数据');
                    else
                    {
                        //另一个tab页面
                        var tabPanel = Ext.getCmp('result_tabpanel');
                        var tabs = Ext.getCmp('editPanel');
                        if(!tabs){
                            var t = tabPanel.add({
                                // title:requisitionOrderId+'领料单明细',
                                title:'产品匹配结果修改',
                                id:'editPanel',
                                layout:'fit',
                                items:[edit_res], //edit_panel
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
        //原件类型：枚举类型
        Ext.define('material.model.typeName', {
            statics: { // 关键s
                1: { value: '1', name: '退库成品' },
                2: { value: '2', name: '预加工半产品' },
                3: { value: '3', name: '旧板' },
                4: { value: '4', name: '原材料' },
            }
        });

        // var projectMatch_List = Ext.create('Ext.data.Store',{
        //     //id,materialName,length,width,materialType,number
        //     fields:['buildingNo','buildingName','buildingLeader'],
        //     proxy : {
        //         type : 'ajax',
        //         url : 'material/findAllbyTableNameAndOnlyOneCondition.do?tableName='+tableName+'&columnName='+columnName+'&columnValue='+columnValue,//获取同类型的原材料  +'&pickNum='+pickNum
        //         reader : {
        //             type : 'json',
        //             rootProperty: 'query_match_result',
        //         },
        //         // params:{
        //         //     materialName:materialName,
        //         //     // start: 0,
        //         //     // limit: itemsPerPage
        //         // }
        //     },
        //     autoLoad : true
        // });

        //将projectId传给弹出框
        // Ext.getCmp("toolbar_pop").items.items[0].setText(projectId);
        // oneProject_match_grid.setStore(projectMatch_List);

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

        //退库成品
        var backListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                // url : '/material/findAllBytableName.do?tableName=backproduct_info_store_type',
                url:'store/findAllStoreInfo.do?typeName=backproduct',
                reader : {
                    type : 'json',
                    rootProperty: 'infoList',//rootProperty: 'backproduct_info_store_type',
                },
            },
            autoLoad : true
        });
        //预加工半成品
        var preprocessListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                // url : '/material/findAllBytableName.do?tableName=preprocess_info_store_type',
                url:'store/findAllStoreInfo.do?typeName=preprocess',
                reader : {
                    type : 'json',
                    rootProperty: 'infoList',//preprocess_info_store_type
                },
            },
            autoLoad : true
        });
        //旧板成品
        var oldListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                // url : '/material/findAllBytableName.do?tableName=oldpanel_info_store_type',
                url:'store/findAllStoreInfo.do?typeName=oldpanel',
                reader : {
                    type : 'json',
                    rootProperty: 'infoList',//rootProperty: 'oldpanel_info_store_type',
                },
            },
            autoLoad : true
        });
        //原材料
        var materialListStore = Ext.create('Ext.data.Store',{
            fields : [ 'typeName'],
            proxy : {
                type : 'ajax',
                // url : '/material/findAllBytableName.do?tableName=material_store_view',
                url:'store/findAllStoreInfo.do?typeName=material',
                reader : {
                    type : 'json',
                    rootProperty: 'infoList',//rootProperty: 'material_store_view',
                },
            },
            autoLoad : true
        });

        // var form = Ext.create('Ext.form.Panel', {
        // 	items : [ {
        // 		xtype : 'textfield',
        // 		id : 'workerName_p',
        // 		name : 'workerName_p',
        // 		fieldLabel : '职员名称',
        // 		disabled : true,
        // 		width:'95%',
        // 		editable : false
        // 	}, {
        // 		xtype : 'textfield',
        // 		name : 'tel_p',
        // 		id : 'tel_p',
        // 		width:'95%',
        // 		fieldLabel : '电话'
        // 	},
        // 		// departmentList,
        // 		{
        // 			fieldLabel : '部门名称',
        // 			xtype : 'combo',
        // 			name : 'departmentId',
        // 			id : 'departmentId',
        // 			// disabled : true,
        // 			width:'95%',
        // 			store : departmentListStore,
        // 			displayField : 'departmentName',
        // 			valueField : 'id',
        // 			editable : true,
        // 		}
        //
        // 	],
        // 	buttons : [ {
        // 		text : '更新',
        // 		handler : function() {
        // 			// console.log(me.roleId);
        // 			if (form.isValid()) {
        // 				var workerName = Ext.getCmp("workerName_p").getValue();
        // 				var tel = Ext.getCmp("tel_p").getValue();
        //
        // 				// console.log("--------------------Id:",Ext.getCmp("departmentId").value)
        // 				var departmentId = Ext.getCmp("departmentId").getValue();
        // 				form.submit({
        // 					url : 'department/addOrUpdateWorkerInfo.do',
        // 					waitMsg : '正在更新...',
        // 					params : {
        // 						id:me.userId,//新增id为字符串
        // 						// s : "[" + s + "]",
        // 						workerName:workerName,
        // 						tel:tel,
        // 						departmentId:departmentId
        // 					},
        // 					success : function(form, action) {
        // 						Ext.Msg.alert('消息', '更新成功！');
        // 						me.close();
        // 						Ext.getCmp('addWorkerGrid').store.load({
        // 							params : {
        // 								start : 0,
        // 								limit : itemsPerPage
        // 							}
        // 						});
        // 					},
        // 					failure : function(form, action) {
        // 						Ext.Msg.alert('消息', '更新失败！');
        // 					}
        // 				});
        // 			}
        // 		}
        // 	} ]
        // });

        //板材类型选择
        var storeTypeListStore = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                { "abbr": '0', "name": '退库成品' },
                { "abbr": '1', "name": '预加工半成品' },
                { "abbr": '2', "name": '旧板' },
                { "abbr": '3', "name": '原材料' },
            ]
        });

        // var storeTypeList = Ext.create('Ext.form.ComboBox', {
        // 	fieldLabel: '分组条件',
        // 	name: 'storeTypeList',
        // 	id: 'storeTypeList',
        // 	store: storeTypeListStore,
        // 	queryMode: 'local',
        // 	displayField: 'name',
        // 	valueField: 'abbr',
        // 	margin : '0 40 0 0',
        // 	width: 160,
        // 	labelWidth: 60,
        // 	renderTo: Ext.getBody(),
        // 	//决定分组依据
        // 	listeners:{
        // 		select:function (combo, record) {
        // 			//选中后
        // 			var select = record[0].data;
        //
        // 			console.log("------------00",select.name)
        // 			var typeId = select.abbr;
        // 			var typeName = select.name;
        // 			var store_tableName;
        // 			if (typeId == 0){
        // 				store_tableName = 'backproduct_store';
        // 			}else if(typeId == 1){
        // 				store_tableName = 'preprocess_store';
        // 			}else if(typeId == 2){
        // 				store_tableName = 'oldpanel_store';
        // 			}else if(typeId == 3){
        // 				store_tableName = 'material_store';
        // 			}
        // 			var tableListStore2 = Ext.create('Ext.data.Store',{
        // 				fields : [ 'buildingName'],
        // 				proxy : {
        // 					type : 'ajax',
        // 					//通用接口，material/findAllbyTableNameAndOnlyOneCondition.do传入表名，属性及属性值
        // 					url : '/material/findAllBytableName.do?tableName='+store_tableName,//根据项目id查询对应的楼栋名
        // 					reader : {
        // 						type : 'json',
        // 						rootProperty: store_tableName,
        // 					}
        // 				},
        // 				autoLoad : true,
        // 				listeners:{
        // 					load:function () {
        // 						Ext.getCmp('storeInfo').setValue("");
        // 					}
        // 				}
        // 			});
        // 			//buildingName,下拉框重新加载数据
        // 			storeInfo.setStore(tableListStore2);
        // 		}
        // 	}
        //
        // });

        // var storeInfo = Ext.create('Ext.form.ComboBox', {
        // 	fieldLabel: '材料名',
        // 	labelWidth: 45,
        // 	width: 300,
        // 	id: 'storeInfo',
        // 	name: 'storeInfo',
        // 	matchFieldWidth: false,
        // 	margin: '0 10 0 40',
        // 	emptyText: "--请选择楼栋名--",
        // 	displayField: 'buildingName',
        // 	valueField: 'id',//楼栋的id
        // 	editable: false,
        // 	autoLoad: true,
        // });


        //弹出框的表头
        var toolbar_pop = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_pop',
            baseCls : 'my-panel-no-border',  //去掉边框
            items: [
                {
                    xtype:'tbtext',
                    text:'<strong>新增匹配材料:</strong>',
                    // margin: '0 40 0 0',
                    // width: 80,

                },
                // {
                // 	xtype : 'button',
                // 	iconAlign : 'center',
                // 	iconCls : 'rukuicon ',
                // 	text : '添加匹配材料',
                // 	handler : function() {
                // 		//fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                // 		var data = [{
                //
                // 			'材料名' : Ext.getCmp("back_store").getValue(),
                // 			'数量' : Ext.getCmp("back_count").getValue(),
                //
                // 		}];
                // 		//Ext.getCmp('addDataGrid')返回定义的对象
                // 		Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
                // 			true);
                //
                // 	}
                //
                // },
            ]
        });
        var toolbar1 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar1',
            items: [
                {
                    xtype:'tbtext',
                    text:'退库成品:',
                    margin: '0 40 0 0',
                    width: 100,
                },
                {
                    fieldLabel : '材料名',
                    xtype : 'combo',
                    name : 'back_store',
                    id : 'back_store',
                    // disabled : true,
                    width:350,
                    labelWidth : 45,
                    store : backListStore,
                    margin : '0 40 0 0',
                    displayField : 'productName',
                    valueField : 'id',
                    editable : true,
                    listeners: {
                        select:function (combo, record) {
                            //选中后
                            var select = record[0].data;
                            var id = select.id;//项目名对应的id
                            console.log('select===================....',select);
                            var count_Use = select.countUse;
                            var storeId_back = select.storeId;
                            Ext.getCmp('countUse_back').setValue(count_Use);
                            Ext.getCmp('storeId_back').setValue(storeId_back);

                        }
                    }
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '现可用数量',
                    id :'countUse_back',
                    width: 180,
                    labelWidth: 80,
                    name: 'countUse_back',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '',
                    id :'storeId_back',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeId_back',
                    value:"",
                    hidden:true,
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '数量',
                    id :'back_count',
                    width: 120,
                    labelWidth: 35,
                    name: 'back_count',
                    value:"",
                },
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        console.log("ssss---",Ext.getCmp("back_store").rawValue)
                        var data = [{
                            'name' : Ext.getCmp("back_store").rawValue,
                            'count' : Ext.getCmp("back_count").getValue(),
                            'type':'1',//材料类型
                            'materialMadeBy':'1',
                            'typeName':'backproduct',
                            'id':'-1', //新增的matchresultId
                            'storeId':Ext.getCmp("storeId_back").getValue(),
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
                            true);
                        //清除框里的数据
                        Ext.getCmp('back_store').setValue('');
                        Ext.getCmp('back_count').setValue('');

                    }
                },
            ]
        });

        var toolbar2 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar2',
            items: [
                {
                    xtype:'tbtext',
                    text:'预加工半成品:',
                    margin: '0 40 0 0',
                    width: 100,
                },
                {
                    fieldLabel : '材料名',
                    xtype : 'combo',
                    name : 'pre_store',
                    id : 'pre_store',
                    // disabled : true,
                    width:350,
                    labelWidth : 45,
                    store : preprocessListStore,
                    margin : '0 40 0 0',
                    displayField : 'productName',
                    valueField : 'id',
                    editable : true,
                    listeners: {
                        select:function (combo, record) {
                            //选中后
                            var select = record[0].data;
                            var id = select.id;//项目名对应的id
                            console.log('select===================....',select);
                            var count_Use = select.countUse;
                            var storeId_pre = select.storeId;
                            Ext.getCmp('storeId_pre').setValue(storeId_pre);
                            Ext.getCmp('countUse_pre').setValue(count_Use);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '现可用数量',
                    id :'countUse_pre',
                    width: 180,
                    labelWidth: 80,
                    name: 'countUse_pre',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '',
                    id :'storeId_pre',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeId_pre',
                    value:"",
                    hidden:true,
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '数量',
                    id :'pre_count',
                    width: 120,
                    labelWidth: 35,
                    name: 'pre_count',
                    value:"",
                },{
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{
                            'name' : Ext.getCmp("pre_store").rawValue,
                            'count' : Ext.getCmp("pre_count").getValue(),
                            'type':'2',
                            'materialMadeBy':'2',
                            'typeName':'preprocess',
                            'id':'-1', //新增的matchresultId
                            'storeId':Ext.getCmp("storeId_pre").getValue(),
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
                            true);
                        Ext.getCmp('pre_store').setValue('');
                        Ext.getCmp('pre_count').setValue('');
                    }
                },
            ]
        });
        var toolbar3 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar3',
            items: [
                {
                    xtype:'tbtext',
                    text:'旧板:',
                    margin: '0 40 0 0',
                    width: 100,
                },
                {
                    fieldLabel : '材料名',
                    xtype : 'combo',
                    name : 'old_store',
                    id : 'old_store',
                    // disabled : true,
                    width:350,
                    labelWidth : 45,
                    store : oldListStore,
                    margin : '0 40 0 0',
                    displayField : 'oldpanelName',
                    valueField : 'id',
                    editable : true,
                    listeners: {
                        select:function (combo, record) {
                            //选中后
                            var select = record[0].data;
                            var id = select.id;//项目名对应的id
                            console.log('select===================....',select);
                            var count_Use = select.countUse;
                            var storeId_old = select.storeId;
                            Ext.getCmp('storeId_old').setValue(storeId_old);
                            Ext.getCmp('countUse_old').setValue(count_Use);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '现可用数量',
                    id :'countUse_old',
                    width: 180,
                    labelWidth: 80,
                    name: 'countUse_old',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '',
                    id :'storeId_old',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeId_old',
                    value:"",
                    hidden:true,
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '数量',
                    id :'old_count',
                    width: 120,
                    labelWidth: 35,
                    name: 'old_count',
                    value:"",
                },{
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{
                            'name' : Ext.getCmp("old_store").rawValue,
                            'count' : Ext.getCmp("old_count").getValue(),
                            'type':'3',
                            'materialMadeBy':'3',
                            'typeName':'oldpanel',
                            'id':'-1', //新增的matchresultId
                            'storeId':Ext.getCmp("storeId_old").getValue(),
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
                            true);
                        Ext.getCmp('old_store').setValue('');
                        Ext.getCmp('old_count').setValue('');

                    }
                },
            ]
        });
        var toolbar4 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar4',
            items: [
                {
                    xtype:'tbtext',
                    text:'原材料:',
                    margin: '0 40 0 0',
                    width: 100,
                },
                {
                    fieldLabel : '材料名',
                    xtype : 'combo',
                    name : 'material_store',
                    id : 'material_store',
                    // disabled : true,
                    width:350,
                    labelWidth : 45,
                    margin : '0 40 0 0',
                    store : materialListStore,
                    displayField : 'materialName',
                    valueField : 'id',
                    editable : true,
                    listeners: {
                        select:function (combo, record) {
                            //选中后
                            var select = record[0].data;
                            var id = select.id;//项目名对应的id
                            console.log('select===================....',select);
                            var count_Use = select.countUse;
                            var storeId_material = select.storeId;
                            Ext.getCmp('storeId_material').setValue(storeId_material);
                            Ext.getCmp('countUse_material').setValue(count_Use);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '现可用数量',
                    id :'countUse_material',
                    width: 180,
                    labelWidth: 80,
                    name: 'countUse_material',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '',
                    id :'storeId_material',
                    width: 180,
                    labelWidth: 80,
                    name: 'storeId_material',
                    value:"",
                    hidden:true,
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '数量',
                    id :'material_count',
                    width: 120,
                    labelWidth: 35,
                    name: 'material_count',
                    value:"",
                },{
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '添加',
                    handler : function() {
                        //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                        var data = [{
                            'name' : Ext.getCmp("material_store").rawValue,
                            'count' : Ext.getCmp("material_count").getValue(),
                            'type':'4',
                            'materialMadeBy':'4',
                            'typeName':'material',
                            'id':'-1', //新增的matchresultId
                            'storeId':Ext.getCmp("storeId_material").getValue(),
                        }];
                        //Ext.getCmp('addDataGrid')返回定义的对象
                        Ext.getCmp('oneProject_match_grid').getStore().loadData(data,
                            true);
                        //清除框里的数据
                        Ext.getCmp('material_store').setValue('');
                        Ext.getCmp('material_count').setValue('');

                    }
                },
            ]
        });

        //更新产品匹配信息
        var toolbar_4 = Ext.create('Ext.toolbar.Toolbar', {
            dock: "top",
            id: 'toolbar_4',
            items: [
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '产品名称',
                    id :'productName_show',
                    width: 300,
                    labelWidth: 60,
                    name: 'productName_show',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },{
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '位置',
                    id :'positionName_show',
                    width: 150,
                    labelWidth: 35,
                    name: 'positionName_show',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    margin : '0 40 0 0',
                    fieldLabel: '所属项目',
                    id :'project_show',
                    width: 500,
                    labelWidth: 60,
                    name: 'project_show',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    // margin : '0 40 0 0',
                    fieldLabel: '楼栋',
                    id :'building_show',
                    width: 200,
                    labelWidth: 35,
                    name: 'building_show',
                    value:"",
                    editable : false,//不可修改
                    disabled : true,//隐藏显示
                },
                {
                    xtype: 'textfield',
                    // margin : '0 40 0 0',
                    fieldLabel: '设计清单id',
                    id :'edit_designlistId',
                    width: 200,
                    labelWidth: 35,
                    name: 'edit_designlistId',
                    value:"",
                    hidden:true,
                },
            ]
        });

        //更新产品匹配信息
        var toolbar_5 = Ext.create('Ext.toolbar.Toolbar', {
            dock : "top",
            id:'toolbar_5',
            items: [
                {
                    xtype : 'button',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '更新信息',
                    handler: function(){
                        var select = Ext.getCmp('oneProject_match_grid').getStore()
                            .getData();

                        var s = new Array();
                        select.each(function(rec) {
                            s.push(JSON.stringify(rec.data));
                        });

                        console.log('s===================,,,',s);

                        Ext.Ajax.request({
                            url:"designlist/changeMatchResult.do",  //匹配结果修改
                            params:{
                                designlistId: Ext.getCmp('edit_designlistId').getValue(),
                                s: "[" + s + "]",

                            },
                            success:function (response) {
                                console.log('response=====================??',response)

                                var res = response.responseText;
                                var jsonobj = JSON.parse(res);//将json字符串转换为对象
                                console.log(jsonobj);
                                console.log("success--------------",jsonobj.success);
                                // console.log("errorList--------------",jsonobj['errorList']);
                                var success = jsonobj.success;
                                // var errorList = jsonobj.errorList;
                                var errorCode = jsonobj.errorCode;
                                // var errorCount = jsonobj.errorNum;
                                if(success == false){
                                    if(errorCode == 1000){
                                        Ext.MessageBox.alert("提示", "匹配结果更新失败! 未知错误");
                                    }

                                }else{
                                    Ext.MessageBox.alert("提示", "匹配结果更新成功!");
                                    Ext.getCmp('oneProject_match_grid').getStore().load();
                                }
                            },
                            failure : function(response){
                                Ext.MessageBox.alert("提示", "匹配结果更新失败!");
                            }
                        })

                    }
                },

                //删除一条记录
                {
                    xtype : 'button',
                    margin: '0 10 0 35',
                    iconAlign : 'center',
                    iconCls : 'rukuicon ',
                    text : '删 除',
                    width:60,
                    handler: function(){
                        var sm = Ext.getCmp('oneProject_match_grid').getSelectionModel();
                        var rec = sm.getSelection();

                        console.log("删除数据-----------：",rec[0].data)
                        console.log("删除：",rec[0].data.id)

                        var s = new Array();

                        s.push(JSON.stringify(rec[0].data));


                        console.log("删除数据ss-----------：",s)

                        //匹配结果id
                        var matchResultId = rec[0].data.id;//matchResultId
                        var count = rec[0].data.count;
                        var matchId = rec[0].data.matchId;
                        var madeBy = rec[0].data.materialMadeBy;//matchResultId

                        if (rec.length != 0) {
                            //删除新增的，还未添加到数据库中的数据.直接移除
                            if(matchResultId == -1){
                                Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
                            }
                            else{
                                Ext.Msg.confirm("提示", "共选中" + rec.length + "条数据，是否确认删除？", function (btn) {
                                    if (btn == 'yes') {
                                        //先删除后台再删除前台
                                        //ajax 删除后台数据 成功则删除前台数据；失败则不删除前台数据
                                        //Extjs 4.x 删除
                                        // Ext.getCmp('oneProject_match_grid').getStore().remove(Arr);
                                        Ext.Ajax.request({
                                            url:"designlist/deleteMatchResult.do",  //删除楼栋信息
                                            params:{
                                                // buildingId:buildingId,
                                                // matchResultId:matchResultId,
                                                // count:count,
                                                // matchId:matchId,
                                                // madeBy:madeBy,
                                                s: "[" + s + "]",
                                            },
                                            success:function (response) {
                                                console.log('response=====================??',response)

                                                var res = response.responseText;
                                                var jsonobj = JSON.parse(res);//将json字符串转换为对象
                                                console.log(jsonobj);
                                                console.log("success--------------",jsonobj.success);
                                                // console.log("errorList--------------",jsonobj['errorList']);
                                                var success = jsonobj.success;
                                                // var errorList = jsonobj.errorList;
                                                var errorCode = jsonobj.errorCode;
                                                // var errorCount = jsonobj.errorNum;
                                                if(success == false){
                                                    if(errorCode == 1000){
                                                        Ext.MessageBox.alert("提示", "删除失败！ 未知错误，请联系管理员！");
                                                    }

                                                }else{
                                                    //删除成功
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
                                                }
                                            },
                                            failure : function(response){
                                                Ext.MessageBox.alert("提示", "删除失败!");
                                            }
                                        })

                                    } else {
                                        return;
                                    }
                                });
                            }

                        } else {
                            //Ext.Msg.confirm("提示", "无选中数据");
                            Ext.Msg.alert("提示", "无选中数据");
                        }

                    }
                }
            ]
        });


        //弹出表格，楼栋信息表
        var oneProject_match_grid=Ext.create('Ext.grid.Panel',{
            id : 'oneProject_match_grid',
            style:"text-align:center;",
            // store:me.projectMatch_List,//specificMaterialList，store1的数据固定projectMatch_List
            // store:projectMatch_List,
            title:'产品匹配信息',
            // tbar:toolbar_5,
            dockedItems:[
                {
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar_pop]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar1]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    style:'border-width:0 0 0 0;',
                    items : [toolbar2]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar3]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    style:'border-width:0 0 0 0;',
                    items : [toolbar4]
                },

                {
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar_4]
                },{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [toolbar_5]
                },
            ],
            columns:[
                {
                    text: '材料名',
                    dataIndex: 'name',
                    flex :1,

                },{
                    dataIndex : 'count',
                    text : '数量',
                    flex :1,
                },
                {
                    dataIndex : 'materialMadeBy',
                    text : '材料类型',
                    flex :1,
                    renderer: function (value) {
                        return material.model.typeName[value].name; // key-value
                    },
                },

                {
                    dataIndex : 'type',
                    text : 'type',
                    flex :1,
                    hidden:true,
                },
                {
                    dataIndex : 'typeName',
                    text : 'typeName',
                    flex :1,
                    hidden:true,
                },
                {
                    dataIndex : 'id',
                    text : 'matchResultId',
                    flex :1,
                    hidden:true,
                },
                {
                    dataIndex : 'storeId',
                    text : 'storeId',
                    flex :1,
                    hidden:true,
                },

                // {
                // 	xtype:'actioncolumn',
                // 	text : '删除操作',
                // 	width:100,
                // 	style:"text-align:center;",
                // 	items: [
                // 		//删除按钮
                // 		{
                // 			icon: 'extjs/imgs/delete.png',
                // 			tooltip: 'Delete',
                // 			style:"margin-right:20px;",
                // 			handler: function(grid, rowIndex, colIndex) {
                // 				var rec = grid.getStore().getAt(rowIndex);
                //
                // 				console.log("删除数据-----------：",rec.data)
                // 				console.log("删除：",rec.data.id)
                // 				//匹配结果id
                // 				var matchResultId = rec.data.id;//matchResultId
                // 				var count = rec.data.count;
                // 				var matchId = rec.data.matchId;
                // 				var madeBy = rec.data.materialMadeBy;//matchResultId
                // 				//弹框提醒
                // 				Ext.Msg.show({
                // 					title: '操作确认',
                // 					message: '将删除数据，选择“是”否确认？',
                // 					buttons: Ext.Msg.YESNO,
                // 					icon: Ext.Msg.QUESTION,
                // 					fn: function (btn) {
                // 						if (btn === 'yes') {
                // 							Ext.Ajax.request({
                // 								url:"designlist/deleteMatchResult.do",  //删除楼栋信息
                // 								params:{
                // 									// buildingId:buildingId,
                // 									matchResultId:matchResultId,
                // 									count:count,
                // 									matchId:matchId,
                // 									madeBy:madeBy,
                // 								},
                // 								success:function (response) {
                // 									Ext.MessageBox.alert("提示", "删除成功!");
                // 									Ext.getCmp('oneProject_match_grid').getStore().remove(rec);
                // 								},
                // 								failure : function(response){
                // 									Ext.MessageBox.alert("提示", "删除失败!");
                // 								}
                // 							})
                // 						}
                // 					}
                // 				});
                // 			}
                // 		}]
                // }
            ],
            flex:1,
            //selType:'checkboxmodel',
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],

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
                            Ext.getCmp('oneProject_match_grid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
            }
        });
        var edit_res = Ext.create('Ext.panel.Panel',{
            modal : true,
            height: 500,
            width: 650,
            bodyStyle : 'padding:5 5 5 5',
            items:[oneProject_match_grid],
        });


        //设置panel多行tbar
        // this.dockedItems=[{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toolbar_pop]
        // },{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toolbar1]
        // },{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     style:'border-width:0 0 0 0;',
        //     items : [toolbar2]
        // },{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     items : [toolbar3]
        // },{
        //     xtype : 'toolbar',
        //     dock : 'top',
        //     style:'border-width:0 0 0 0;',
        //     items : [toolbar4]
        // },
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
