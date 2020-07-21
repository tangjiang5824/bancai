Ext.define('project.result.newpanel_material_match_result',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '新板匹配结果',
    initComponent: function(){
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
                // console.log("luuuuu:"+count1);
                count2 = grid.getStore().getCount();  //行数(纪录数)
            } else {
                count1 = grid.getStore().getCount();
                count2 = grid.columns.length;
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

        var itemsPerPage = 50;
        //var tableName="material";
        //var materialType="1";
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
            width : '35%',
            id :  'projectName',
            name : '项目名称',
            matchFieldWidth: true,
            // emptyText : "--请选择--",
            displayField: 'projectName',
            valueField: 'id',
            editable : false,
            store: projectListStore,
            listeners:{
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

        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                projectList,
                buildingName,
                buildingPositionList,
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
                        newpanelMaterial_Store.load({
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
                                buildingpositionId:Ext.getCmp("positionName").getValue(),
                            }
                        });
                    }
                },
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

        //新板匹配结果
        var newpanelMaterial_Store = Ext.create('Ext.data.Store',{
            id: 'newpanelMaterial_Store',
            autoLoad: true,
            fields: [],
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
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        projectId:Ext.getCmp("projectName").getValue(),
                        buildingId:Ext.getCmp("buildingName").getValue(),
                        buildingpositionId:Ext.getCmp("positionName").getValue(),
                    });
                }
            }
        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            store: newpanelMaterial_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '项目名', dataIndex: 'projectName', flex :1.2,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '楼栋名', dataIndex: 'buildingName', flex :0.8 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '位置', dataIndex: 'positionName',flex :0.2, editor:{xtype : 'textfield', allowBlank : false}},
                { text: '产品名', dataIndex: 'productName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料数量', dataIndex: 'materialCount', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 3
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: newpanelMaterial_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
            listeners: {
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
                        success:function (response) {
                            //console.log(response.responseText);
                        }
                    })

                }
            }
        });

        this.items = [grid];
        this.callParent(arguments);


        var mergeCells = function(grid,cols){
            // var arrayTr=document.getElementById(grid.getId()+"-body").firstChild.firstChild.firstChild.getElementsByTagName('tr');
            var  arrayTr = document.getElementById(grid.getId()+"-body").firstChild.lastChild.getElementsByTagName('tr')
            var trCount = arrayTr.length;
            var arrayTd;
            var td;

            console.log("arrayTr------------",arrayTr)
            console.log("trCount------------",trCount)

            //定义合并函数
            var merge = function(rowspanObj,removeObjs){
                if(rowspanObj.rowspan != 1){
                    arrayTd =arrayTr[rowspanObj.tr].getElementsByTagName("td"); //合并行

                    td=arrayTd[rowspanObj.td-1];
                    console.log("td------------",td)
                    td.rowSpan=rowspanObj.rowspan;
                    td.vAlign="middle";
                    Ext.each(removeObjs,function(obj){ //隐身被合并的单元格
                        arrayTd =arrayTr[obj.tr].getElementsByTagName("td");
                        arrayTd[obj.td-1].style.display='none';
                    });
                }
            };
            var rowspanObj = {}; //要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
            var removeObjs = []; //要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
            var col;

            //逐列去操作tr
            Ext.each(cols,function(colIndex){
                var rowspan = 1;
                var divHtml = null;//单元格内的数值
                for(var i=1;i<trCount;i++){  //i=0表示表头等没用的行
                    arrayTd = arrayTr[i].getElementsByTagName("td");
                    var cold=0;

                    col=colIndex+cold;//跳过RowNumber列和check列
                    if(!divHtml){
                        divHtml = arrayTd[col-1].innerHTML;
                        rowspanObj = {tr:i,td:col,rowspan:rowspan}
                    }else{
                        var cellText = arrayTd[col-1].innerHTML;
                        //新的单元格
                        var addf=function(){
                            rowspanObj["rowspan"] = rowspanObj["rowspan"]+1;
                            removeObjs.push({tr:i,td:col});
                            if(i==trCount-1)
                                merge(rowspanObj,removeObjs);//执行合并函数
                        };
                        //合并
                        var mergef=function(){
                            merge(rowspanObj,removeObjs);//执行合并函数
                            divHtml = cellText;
                            rowspanObj = {tr:i,td:col,rowspan:rowspan}
                            removeObjs = [];
                        };
                        if(cellText == divHtml){

                            //跳过第一列，不需要判断前一列的合并情况
                            if(colIndex!=cols[0]){
                                var leftDisplay=arrayTd[col-2].style.display;//判断左边单元格值是否已display
                                if(leftDisplay=='none')
                                    addf();
                                else
                                    mergef();
                            }else
                                addf();

                        }else
                            mergef();
                    }
                }
            });
        };

        /**
         * 合并Grid的数据列
         * @param grid {Ext.Grid.Panel} 需要合并的Grid
         * @param colIndexArray {Array} 需要合并列的Index(序号)数组；从0开始计数，序号也包含。
         * @param isAllSome {Boolean} 是否2个tr的colIndexArray必须完成一样才能进行合并。true：完成一样；false：不完全一样
         */
        //合并
        function mergeGrid(grid, colIndexArray, isAllSome) {
            isAllSome = isAllSome == undefined ? true : isAllSome; // 默认为true
            // 1.是否含有数据
            // var gridView = document.getElementById(grid.getView().getId() + '-body');
            // if (gridView == null) {
            //     return;
            // }

            // 2.获取Grid的所有tr
            var trArray = [];
            // if (grid.layout.type == 'table') { // 若是table部署方式，获取的tr方式如下
            //     trArray = gridView.childNodes;
            // } else {
            //     trArray = gridView.getElementsByTagName('tr');
            // }
            trArray = document.getElementById(grid.getId()+"-body").firstChild.lastChild.getElementsByTagName('tr');
            console.log('trArray================',trArray)

            // 3.进行合并操作
            if (isAllSome) { // 3.1 全部列合并：只有相邻tr所指定的td都相同才会进行合并
                var lastTr = trArray[0]; // 指向第一行
                // 1)遍历grid的tr，从第二个数据行开始
                for (var i = 1, trLength = trArray.length; i < trLength; i++) {
                    var thisTr = trArray[i];
                    var isPass = true; // 是否验证通过
                    // 2)遍历需要合并的列
                    for (var j = 0, colArrayLength = colIndexArray.length; j < colArrayLength; j++) {
                        var colIndex = colIndexArray[j];
                        // 3)比较2个td的列是否匹配，若不匹配，就把last指向当前列
                        if (lastTr.childNodes[colIndex].innerText != thisTr.childNodes[colIndex].innerText) {
                            lastTr = thisTr;
                            isPass = false;
                            break;
                        }
                    }

                    // 4)若colIndexArray验证通过，就把当前行合并到'合并行'
                    if (isPass) {
                        for (var j = 0, colArrayLength = colIndexArray.length; j < colArrayLength; j++) {
                            var colIndex = colIndexArray[j];
                            // 5)设置合并行的td rowspan属性
                            if (lastTr.childNodes[colIndex].hasAttribute('rowspan')) {
                                var rowspan = lastTr.childNodes[colIndex].getAttribute('rowspan') - 0;
                                rowspan++;
                                lastTr.childNodes[colIndex].setAttribute('rowspan', rowspan);
                            } else {
                                lastTr.childNodes[colIndex].setAttribute('rowspan', '2');
                            }
                            // lastTr.childNodes[colIndex].style['text-align'] = 'center';; // 水平居中
                            lastTr.childNodes[colIndex].style['vertical-align'] = 'middle';// 纵向居中

                            thisTr.childNodes[colIndex].style.display = 'none';
                        }
                    }
                }
            } else { // 3.2 逐个列合并：每个列在前面列合并的前提下可分别合并
                // 1)遍历列的序号数组
                for (var i = 0, colArrayLength = colIndexArray.length; i < colArrayLength; i++) {
                    var colIndex = colIndexArray[i];
                    var lastTr = trArray[0]; // 合并tr，默认为第一行数据
                    // 2)遍历grid的tr，从第二个数据行开始
                    for (var j = 1, trLength = trArray.length; j < trLength; j++) {
                        var thisTr = trArray[j];
                        // 3)2个tr的td内容一样
                        if (lastTr.childNodes[colIndex].innerText == thisTr.childNodes[colIndex].innerText) {
                            // 4)若前面的td未合并，后面的td都不进行合并操作
                            if (i > 0 && thisTr.childNodes[colIndexArray[i - 1]].style.display != 'none') {
                                lastTr = thisTr;
                                continue;
                            } else {
                                // 5)符合条件合并td
                                if (lastTr.childNodes[colIndex].hasAttribute('rowspan')) {
                                    var rowspan = lastTr.childNodes[colIndex].getAttribute('rowspan') - 0;
                                    rowspan++;
                                    lastTr.childNodes[colIndex].setAttribute('rowspan', rowspan);
                                } else {
                                    lastTr.childNodes[colIndex].setAttribute('rowspan', '2');
                                }
                                // lastTr.childNodes[colIndex].style['text-align'] = 'center';; // 水平居中
                                lastTr.childNodes[colIndex].style['vertical-align'] = 'middle';
                                ; // 纵向居中


                                thisTr.childNodes[colIndex].style.display = 'none'; // 当前行隐藏
                            }
                        } else {
                            // 5)2个tr的td内容不一样
                            lastTr = thisTr;
                        }
                    }
                }
            }
        }


        // function gridSpan(grid, rowOrCol, borderStyle){
        //     var array1 = new Array();
        //     var count1 = 0;
        //     var count2 = 0;
        //     var index1 = 0;
        //     var index2 = 0;
        //     var aRow = undefined;
        //     var preValue = undefined;
        //     var firstSameCell = 0;
        //     var allRecs = grid.getStore().getRange();
        //
        //     if(rowOrCol == 'row'){
        //         count1 = grid.columns.length;
        //         count2 = grid.getStore().getCount();
        //     } else {
        //         count1 = grid.getStore().getCount();
        //         count2 = grid.columns.length;
        //     }
        //
        //     for(i = 0; i < count1; i++){
        //         preValue = undefined;
        //         firstSameCell = 0;
        //         array1[i] = new Array();
        //         for(j = 0; j < count2; j++){
        //             if(rowOrCol == 'row'){
        //                 index1 = j;
        //                 index2 = i;
        //             } else {
        //                 index1 = i;
        //                 index2 = j;
        //             }
        //             var colName = grid.columns[index2].dataIndex;
        //             if(allRecs[index1].get(colName) == preValue){
        //                 allRecs[index1].set(colName, ' ');
        //                 array1[i].push(j);
        //                 if(j == count2 - 1){
        //                     var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
        //                     if(rowOrCol == 'row'){
        //                         allRecs[index].set(colName, preValue);
        //                     } else {
        //                         allRecs[index1].set(grid.getColumnModel().getColumnId(index), preValue);
        //                     }
        //                 }
        //             } else {
        //                 if(j != 0){
        //                     var index = firstSameCell + Math.round((j + 1 - firstSameCell) / 2 - 1);
        //                     if(rowOrCol == 'row'){
        //                         allRecs[index].set(colName, preValue);
        //                     } else {
        //                         allRecs[index1].set(grid.getColumnModel().getColumnId(index), preValue);
        //                     }
        //                 }
        //                 firstSameCell = j;
        //                 preValue = allRecs[index1].get(colName);
        //                 allRecs[index1].set(colName, ' ');
        //                 if(j == count2 - 1){
        //                     allRecs[index1].set(colName, preValue);
        //                 }
        //             }
        //         }
        //     }
        //     grid.getStore().commitChanges();
        //
        //     //添加所有分隔线
        //     for(i = 0; i < grid.getStore().getCount(); i ++){
        //         for(j = 0; j < grid.columns.length; j ++){
        //             // aRow = grid.getView().getCell(i,j);
        //             aRow = Ext.get(grid.view.getNode(i)).query('td')[j]; //获取某一单元格
        //             aRow.style.borderTop = borderStyle;
        //             aRow.style.borderLeft = borderStyle;
        //         }
        //     }
        //
        //     //去除合并的单元格的分隔线
        //     for(i = 0; i < array1.length; i++){
        //         for(j = 0; j < array1[i].length; j++){
        //             if(rowOrCol == 'row'){
        //                 // aRow = grid.getView().getCell(array1[i][j],i);
        //                 aRow = Ext.get(grid.view.getNode(array1[i][j])).query('td')[i]; //获取某一单元格
        //                 aRow.style.borderTop = 'none';
        //             } else {
        //                 aRow = grid.getView().getCell(i, array1[i][j]);
        //                 aRow.style.borderLeft = 'none';
        //             }
        //         }
        //     }
        // };


        // ==>监听load , 执行合并单元格
        var gridp = Ext.getCmp('material_Query_Data_Main');
        Ext.getCmp('material_Query_Data_Main').getStore().on('load', function () {
            // mergeGrid(gridp,[0,1,2,3],true);
            // mergeCells(Ext.getCmp('material_Query_Data_Main'),[1,2,3]);
            gridSpan(gridp,"row","[projectName],[buildingName],[positionName]");  //，以designId分组（为同一个产品的所有组成材料）
            // gridSpan(gridp,"row","1px solid #8080FF");
        });

    }

})
