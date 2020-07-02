Ext.define('project.newpanel_material_list',{
    extend:'Ext.panel.Panel',
    region: 'center',
    layout:'fit',
    title: '项目新板材料清单查询',
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
                        combo.setValue(r[0].get('projectName'));//第一个值
                    });
                },
                select: function(combo, record, index) {
                    console.log(record[0].data.projectName);
                }
            }
        });
        var toobar = Ext.create('Ext.toolbar.Toolbar',{
            items: [
                projectList,
                {
                    xtype : 'button',
                    text: '查询',
                    width: 80,
                    margin: '0 0 0 15',
                    layout: 'right',
                    handler: function(){
                        newpanelMaterial_Store.load({
                            params : {
                                tableName:'newpanelmateriallist_name',
                                columnName:'projectId',
                                columnValue:Ext.getCmp('projectName').getValue(), //''
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
        })
        var newpanelMaterial_Store = Ext.create('Ext.data.Store',{
            id: 'newpanelMaterial_Store',
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
                        // endWidth:Ext.getCmp('endWidth').getValue(),
                        // startLength:Ext.getCmp('startLength').getValue(),
                        // endLength:Ext.getCmp('endLength').getValue(),
                        // mType:Ext.getCmp('mType').getValue(),
                        //materialType:materialType

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
                { text: '产品名', dataIndex: 'productName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
                { text: '原材料数量', dataIndex: 'materialCount', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
                { text: '楼栋Id', dataIndex: 'buildingId',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
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

        // ==>监听load , 执行合并单元格
        var gridp = Ext.getCmp('material_Query_Data_Main');
        Ext.getCmp('material_Query_Data_Main').getStore().on('load', function () {
            gridSpan(gridp,"row","[productName]");

        });

    }

})


// Ext.define('project.newpanel_material_list',{
//     extend:'Ext.panel.Panel',
//     region: 'center',
//     layout:'fit',
//     title: '项目新板材料清单查询',
//     initComponent: function(){
//         var itemsPerPage = 50;
//         //var tableName="material";
//         //var materialType="1";
//         var projectListStore = Ext.create('Ext.data.Store',{
//             fields : [ "项目名称","id"],
//             proxy : {
//                 type : 'ajax',
//                 url : 'project/findProjectList.do',
//                 reader : {
//                     type : 'json',
//                     rootProperty: 'projectList',
//                 }
//             },
//             autoLoad : true
//         });
//         var projectList = Ext.create('Ext.form.ComboBox',{
//             fieldLabel : '项目名',
//             labelWidth : 45,
//             width : 400,
//             id :  'projectName',
//             name : '项目名称',
//             matchFieldWidth: false,
//             emptyText : "--请选择--",
//             displayField: 'projectName',
//             valueField: 'id',
//             editable : false,
//             store: projectListStore,
//             listeners:{
//                 select: function(combo, record, index) {
//                     console.log(record[0].data.projectName);
//                 }
//             }
//         });
//         var toobar = Ext.create('Ext.toolbar.Toolbar',{
//             items: [
//                 projectList,
//                 {
//                     xtype : 'button',
//                     text: '查询',
//                     width: 80,
//                     margin: '0 0 0 15',
//                     layout: 'right',
//                     handler: function(){
//                         newpanelMaterial_Store.load({
//                             params : {
//                                 tableName:'newpanelmateriallist_name',
//                                 columnName:'projectId',
//                                 columnValue:Ext.getCmp('projectName').getValue()//''
//                             }
//                         });
//                     }
//                 },
//                 // {
//                 //     text: '删除',
//                 //     width: 80,
//                 //     margin: '0 0 0 15',
//                 //     handler: function(){
//                 //         var select = grid.getSelectionModel().getSelection();
//                 //         if(select.length==0){
//                 //             Ext.Msg.alert('错误', '请选择要删除的记录')
//                 //         }
//                 //         else{
//                 //             Ext.Ajax.request({
//                 //                 url:"data/deleteItemById.do",  //公共方法，在commonMethod包下
//                 //                 params:{
//                 //                     tableName:tableName,
//                 //                     id:select[0].data.id
//                 //                 },
//                 //                 success:function (response) {
//                 //                     Ext.MessageBox.alert("提示","删除成功！")
//                 //                     grid.store.remove(grid.getSelectionModel().getSelection());
//                 //                 },
//                 //                 failure:function (reponse) {
//                 //                     Ext.MessageBox.alert("提示","删除失败！")
//                 //
//                 //                 }
//                 //             })
//                 //         }
//                 //     }
//                 // }
//                 ]
//         })
//         var newpanelMaterial_Store = Ext.create('Ext.data.Store',{
//             id: 'newpanelMaterial_Store',
//             autoLoad: false,
//             fields: [],
//             pageSize: itemsPerPage, // items per page
//             proxy:{
//                 url : "material/findAllbyTableNameAndOnlyOneCondition.do",//通用接口
//                 type: 'ajax',
//                 reader:{
//                     type : 'json',
//                     rootProperty: 'newpanelmateriallist_name',
//                     totalProperty: 'totalCount'
//                 },
//             },
//             // listeners : {
//             //     beforeload : function(store, operation, eOpts) {
//             //         store.getProxy().setExtraParams({
//             //             tableName :tableName,
//             //             startWidth:Ext.getCmp('startWidth').getValue(),
//             //             endWidth:Ext.getCmp('endWidth').getValue(),
//             //             startLength:Ext.getCmp('startLength').getValue(),
//             //             endLength:Ext.getCmp('endLength').getValue(),
//             //             mType:Ext.getCmp('mType').getValue(),
//             //             //materialType:materialType
//             //
//             //         });
//             //     }
//             //
//             // }
//
//
//         });
//
//
//         var grid = Ext.create('Ext.grid.Panel',{
//             id: 'material_Query_Data_Main',
//             store: newpanelMaterial_Store,
//             viewConfig : {
//                 enableTextSelection : true,
//                 editable:true
//             },
//             columns : [
//                 { text: '产品名', dataIndex: 'productName', flex :1,editor:{xtype : 'textfield', allowBlank : false}},
//                 { text: '原材料名', dataIndex: 'materialName', flex :1 ,editor:{xtype : 'textfield', allowBlank : false}},
//                 { text: '原材料数量', dataIndex: 'materialCount', flex :1,editor:{xtype : 'textfield', allowBlank : false} },
//                 { text: '楼栋Id', dataIndex: 'buildingId',flex :1, editor:{xtype : 'textfield', allowBlank : false}},
//             ],
//             plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
//                 clicksToEdit : 3
//             })],
//             tbar: toobar,
//             dockedItems: [{
//                 xtype: 'pagingtoolbar',
//                 store: newpanelMaterial_Store,   // same store GridPanel is using
//                 dock: 'bottom',
//                 displayInfo: true,
//                 displayMsg:'显示{0}-{1}条，共{2}条',
//                 emptyMsg:'无数据'
//             }],
//             listeners: {
//                 validateedit : function(editor, e) {
//                     var field=e.field
//                     var id=e.record.data.id
//                     Ext.Ajax.request({
//                         url:"data/EditCellById.do",  //EditDataById.do
//                         params:{
//                             tableName:tableName,
//                             field:field,
//                             value:e.value,
//                             id:id
//                         },
//                         success:function (response) {
//                             //console.log(response.responseText);
//                         }
//                     })
//
//                 }
//             }
//         });
//
//         this.items = [grid];
//         this.callParent(arguments);
//     }
// })