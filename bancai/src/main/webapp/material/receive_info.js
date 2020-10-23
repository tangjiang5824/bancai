Ext.define('material.receive_info',{
    extend:'Ext.grid.Panel',
    title: '领料单明细',
    //dock: 'bottom',
    layout:{
        type:'hbox',
        align:'stretch'
    },
    width:'100%',
    height:500,
    closable:true,
    closeAction : 'hidden',
    autoDestroy: false,

    initComponent: function(){
        Ext.apply(this,{

            // tbar:'toolbar_specific_pickList',
            store:'specificMaterialList',
            autoScroll: true, //超过长度带自动滚动条
            dock: 'bottom',
            closable:true,
            columns:[
                {
                    dataIndex:'name',
                    text:'材料名',
                    flex :1
                },
                {
                    dataIndex:'type',
                    text:'类型',
                    flex :1,
                    // renderer: function (value) {
                    //     return product.model.originType[value].name; // key-value
                    // },
                },
                {
                    dataIndex:'warehouseName',
                    text:'仓库名',
                    flex :1,
                },
                {
                    dataIndex:'countAll',
                    text:'总数量',
                    flex :1,
                },
                {
                    dataIndex:'countRec',
                    text:'待领数量',
                    flex :1,
                },
                {
                    dataIndex:'count',
                    text:'领取数量',
                    flex :1,
                    editor : {
                        xtype : 'textfield',
                        allowBlank : true
                    }
                },
            ],
            // height:'100%',
            flex:1,
            // selType:'checkboxmodel' ,//每行的复选框
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 2
            })],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    // store: specificMaterialList,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg:'显示{0}-{1}条，共{2}条',
                    emptyMsg:'无数据'
                }
            ],


        });


        // this.items = [grid__query_pickList_specific];

    }

});



//
// //原件类型：枚举类型
// Ext.define('product.model.originType', {
//     statics: { // 关键s
//         0: { value: '0', name: '未匹配' },
//         1: { value: '1', name: '退库成品' },
//         2: { value: '2', name: '预加工半产品' },
//         3: { value: '3', name: '旧板' },
//         4: { value: '4', name: '原材料' },
//         9: { value: '5', name: '未匹配成功' },
//     }
// });
//
// var toolbar_specific_pickList = Ext.create('Ext.toolbar.Toolbar',{
//     dock : "top",
//     // id : "toolbar_specific_pickList",
//     items: [
//         {
//             xtype: 'textfield',
//             margin : '0 10 0 0',
//             id :'picklistId',
//             width: 180,
//             labelWidth: 30,
//             name: 'picklistId',
//             value:"",
//             hidden:true
//         },
//         //楼栋
//         // buildingName,
//         // //位置
//         // buildingPositionList,
//         // //仓库
//         // storePosition,
//         {
//             xtype : 'button',
//             text: '领料单明细查询',
//             width: 100,
//             margin: '0 0 0 40',
//             layout: 'right',
//             handler: function(){
//                 //材料的筛选条件
//                 // var requisitionOrderId = Ext.getCmp('picklistId').getValue();
//                 //
//                 // var buildingId = Ext.getCmp('buildingName').getValue();
//                 // var buildingpositionId = Ext.getCmp('positionName').getValue();
//                 // var warehouseName = Ext.getCmp('storePosition').rawValue;
//
//                 console.log('sss')
//                 //传入所选项目的id
//                 console.log(Ext.getCmp('projectName').getValue())
//                 specificMaterialList.load({
//                     params : {
//                         // buildingId:buildingId,
//                         // buildingpositionId:buildingpositionId,
//                         // warehouseName:warehouseName,
//                         // //projectId:'1',
//                         // //type和领料单Id
//                         // requisitionOrderId:requisitionOrderId,
//                         // type:4,//原材料
//                     }
//                 });
//             }
//         }]
// });
//
// var specificMaterialList = Ext.create('Ext.data.Store',{
//     //id,materialName,length,width,materialType,number
//     fields:['materialName','length','materialType','width','specification','number'],
//     proxy : {
//         type : 'ajax',
//         url : 'order/queryRequisitionOrderDetail.do',//获取同类型的原材料  +'&pickNum='+pickNum
//         reader : {
//             type : 'json',
//             rootProperty: 'requisitionOrderDetailList',
//         },
//     },
//     autoLoad : true
// });
//
// var grid__query_pickList_specific=Ext.create('Ext.grid.Panel',{
//     // id : 'grid__query_pickList_specific',
//     tbar:toolbar_specific_pickList,
//     store:specificMaterialList,
//     autoScroll: true, //超过长度带自动滚动条
//     dock: 'bottom',
//     closable:true,
//     columns:[
//         {
//             dataIndex:'name',
//             text:'材料名',
//             flex :1
//         },
//         {
//             dataIndex:'type',
//             text:'类型',
//             flex :1,
//             renderer: function (value) {
//                 return product.model.originType[value].name; // key-value
//             },
//         },
//         {
//             dataIndex:'warehouseName',
//             text:'仓库名',
//             flex :1,
//         },
//         {
//             dataIndex:'countAll',
//             text:'总数量',
//             flex :1,
//         },
//         {
//             dataIndex:'countRec',
//             text:'待领数量',
//             flex :1,
//         },
//         {
//             dataIndex:'count',
//             text:'领取数量',
//             flex :1,
//             editor : {
//                 xtype : 'textfield',
//                 allowBlank : true
//             }
//         },
//     ],
//     // height:'100%',
//     flex:1,
//     // selType:'checkboxmodel' ,//每行的复选框
//     plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
//         clicksToEdit : 2
//     })],
//     dockedItems: [
//         {
//             xtype: 'pagingtoolbar',
//             store: specificMaterialList,   // same store GridPanel is using
//             dock: 'bottom',
//             displayInfo: true,
//             displayMsg:'显示{0}-{1}条，共{2}条',
//             emptyMsg:'无数据'
//         }
//     ],
// });