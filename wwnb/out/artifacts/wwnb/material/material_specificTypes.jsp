<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css"
          href="../extjs/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css">
    <script src="../extjs/ext-all.js"></script>
    <script src="../extjs/packages/ext-locale/build/ext-locale-zh_CN.js"></script>
    <script src="../extjs/json2.js"></script>
    <script type="text/javascript">

        Ext.onReady(function(){

            var sampleData,
                store1,
                store2,
                grid1,
                grid2,
                clms;

            sampleData=[{
                userId:1,
                name:'Zeng'
            },{
                userId:2,
                name:'Lee'
            },{
                userId:3,
                name:'Chang'
            }];

            store1=Ext.create('Ext.data.Store',{
                fields:['userId','name'],
                data:sampleData
            });

            store2=Ext.create('Ext.data.Store',{
                fields:['userId','name']
            });

            clms=[
                //     {
                //     dataIndex:'materialName',
                //     text:'项目名'
                // },
                {
                    dataIndex:'userId',
                    text:'材料名'
                },
                {
                    dataIndex:'name',
                    text:'数量'
                }];

            grid1=Ext.create('Ext.grid.Panel',{
                store:store1,
                columns:clms,
                flex:1,
                selType:'checkboxmodel'
            });

            grid2=Ext.create('Ext.grid.Panel',{
                store:store2,
                columns:clms,
                flex:1,
                selType:'checkboxmodel'
            });


            Ext.create('Ext.panel.Panel',{
                layout:{
                    type:'hbox',
                    align:'stretch'
                },
                width:600,
                height:500,
                region : 'east',
                closable : true,

                items:[grid1,{
                    xtype:'container',
                    flex:0.3,
                    items:[{
                        xtype:'button',
                        margin: '0 0 0 10',
                        text:'>>',
                        itemId:'move_right',
                        handler:function(){
                            var records=grid1.getSelectionModel().getSelection();
                            store1.remove(records);
                            store2.add(records);
                        }
                    },{
                        xtype:'button',
                        text:'<<',
                        itemId:'move_left',
                        handler:function(){
                            var records=grid2.getSelectionModel().getSelection();
                            store2.remove(records);
                            store1.add(records);
                        }
                    }]
                },grid2],
                renderTo:Ext.getBody()
            });
        });

    </script>

    <title>登录测试页面</title>
</head>
<body>


</body>
</html>