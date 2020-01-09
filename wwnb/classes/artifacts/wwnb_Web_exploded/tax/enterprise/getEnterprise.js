Ext.define('tax.enterprise.getEnterprise',{
	extend : 'Ext.form.Panel',
	width : 1000,
	height : 600,
	layout : 'fit',
	title : '企业信息',
	initComponent: function(){
		var me = this;
		var enterpriseStore = Ext.create('Ext.data.Store', {
			proxy: {
		         type: 'memory',
		         reader: {
		             type: 'json',
		             rootProperty: 'value'
		         }
		     },
		     autoLoad: true
		});
		Ext.Ajax.request({
			url : 'tax/enterprise/getEnterprise.do',
			params : {
				taxIds : me.taxIds
			},
			success: function(response){
				var respText = Ext.util.JSON.decode(response.responseText);
				var data = respText.value;
				var columns = respText.columns;
				var obj = data[0];
	        		var fields = new Array();
	        		var i = 0;
	        		for(var key in data[0]){
	        			fields[i] = key;
	        			i++;
	        		}
	        		enterpriseStore.setFields(fields);
	        		//console.log(fields)
	        		enterpriseStore.loadData(data);
					var grid = Ext.create('Ext.grid.Panel',{
						store: enterpriseStore,
						columns: columns,
						autoScroll: true,
						viewConfig : {
							enableTextSelection : true
						}
					})
	        		me.add(grid);
			},
			failure : function(response) {
  				Ext.MessageBox.alert("提示", "服务器异常，请检查网络连接，或者联系管理员");
  			}
			
		})
		
		this.callParent()
	}
});