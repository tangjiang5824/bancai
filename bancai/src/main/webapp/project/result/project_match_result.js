Ext.define('project.result.project_match_result',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目总览',
    autoLoad:{
        scripts:true
    },
    initComponent: function(){

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
            editable : true,
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


        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                projectList,
                buildingName,
                // buildingPositionList,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        project_match_Store.load({
                            params : {
                                projectId:Ext.getCmp("projectName").getValue(),
                                buildingId:Ext.getCmp("buildingName").getValue(),
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
        var project_match_Store = Ext.create('Ext.data.Store',{
            id: 'project_match_Store',
            // autoLoad: true,
            fields: [],
            pageSize: itemsPerPage, // items per page
            proxy:{
                url : "project/findProjectMatchResult.do",//通用接口
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
                    // buildingId:'',
                }
            },
            listeners : {
                beforeload : function(store, operation, eOpts) {
                    store.getProxy().setExtraParams({
                        // projectId:'1',
                        // buildingId:'',
                        projectId:Ext.getCmp("projectName").getValue(),
                        buildingId:Ext.getCmp("buildingName").getValue(),
                    });
                }
            }
        });


        var grid = Ext.create('Ext.grid.Panel',{
            id: 'material_Query_Data_Main',
            store: project_match_Store,
            viewConfig : {
                enableTextSelection : true,
                editable:true
            },
            columns : [
                { text: '原件', dataIndex: 'madeBy', flex :1.2,
                    renderer: function (value) {
                        return product.model.originType[value].name; // key-value
                    },
                },
                { text: '使用数量', dataIndex: 'count', flex :1 },
                {
                    text : '匹配详细信息',
                    flex :1 ,
                    renderer:function(value, cellmeta){
                        return "<INPUT type='button' value='查看' style='font-size: 10px;'>";  //<INPUT type='button' value=' 删 除'>
                    }
                    // header : "匹配详细信息",
                    // dataIndex : "",
                    // menuDisabled : true,
                    // sortable : false,
                    // width : 100,
                    // renderer : function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    //     //获取物流单号
                    //     var id= record.data["xxx"];
                    //     console.log("record======",record)
                    //     return "<div><a href='project/result/newpanel_material_match_result'>查看</a></div>"
                    // }
                },
            ],
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            tbar: toobar,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: project_match_Store,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                displayMsg:'显示{0}-{1}条，共{2}条',
                emptyMsg:'无数据'
            }],
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
                //
                // },
            }
        });


        //添加cell单击事件
        grid.addListener('cellclick', cellclick);
        function cellclick(grid, rowIndex, columnIndex, e) {
            if (rowIndex < 0) {
                return;
            }
            var fieldName = Ext.getCmp('material_Query_Data_Main').columns[columnIndex].text;
            var sm = Ext.getCmp('material_Query_Data_Main').getSelectionModel();
            console.log(" e.data===========", e.data.madeBy)
            var madeBy = e.data.madeBy;
            if (fieldName == "匹配详细信息") {

                console.log(" 点击查看===========")
                //1:退库成品
                if(madeBy==1){
                    var p = Ext.getCmp('functionPanel');
                    p.removeAll();
                    cmp = Ext.create('project.result.Query_Backproduct_Match_Result');
                    p.add(cmp);
                }
                //1:预加工半成品
                else if(madeBy==2){
                    var p = Ext.getCmp('functionPanel');
                    p.removeAll();
                    cmp = Ext.create('project.result.preProduct_material_match_result');
                    p.add(cmp);
                }
                //3：旧板
                else if(madeBy==3){
                    var p = Ext.getCmp('functionPanel');
                    p.removeAll();
                    cmp = Ext.create('project.result.oldpanel_material_match_result');
                    p.add(cmp);
                }
                //4.原材料新版
                else if(madeBy==4){
                        var p = Ext.getCmp('functionPanel');
                        p.removeAll();
                        cmp = Ext.create('project.result.newpanel_material_match_result');
                        p.add(cmp);
                }
                //9和0：未匹配和匹配失败
                else {
                       //
                }

                //设置监听事件getSelectionModel().getSelection()
                // var sm = Ext.getCmp('material_Query_Data_Main').getSelectionModel();
                // var materialArr = sm.getSelection();
                // var re = Ext.getCmp('material_Query_Data_Main').getSelectionModel();
                // console.log("qqqqqqqqqqqq:",re.data);


                // 根据出入库0/1，决定弹出框表格列名
                // var col = specific_data_grid_outbound.columns[1];
                // if (opType == 1) {
                //     col.setText("出库数量");
                // }
                // if (opType == 2) {
                //     col.setText("退库数量");
                // } else {
                //     col.setText("入库数量");
                // }


            }

        }

        this.items = [grid];
        this.callParent(arguments);


    }

})
