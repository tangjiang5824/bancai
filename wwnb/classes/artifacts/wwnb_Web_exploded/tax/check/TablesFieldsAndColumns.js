Ext.define("tax.check.TablesFieldsAndColumns", {

	getManualResultColumns : function(standard) {
		var column = this.getColumns(standard);
		var newcolumn = [];
		for (var i = 0; i < column.length; i++) {
			if (column[i].text != '处理时间' && column[i].text != '处理人' && column[i].text != '校验时间') {
				newcolumn.push(column[i]);
			}
		}
		return newcolumn;
	},
	getStandards : function() {
		var ret;
		Ext.Ajax.request({
			async : false,
			url : 'tax/check/getStandards.do',
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				ret = obj;
			}
		});
		return ret;
	},
	getFields : function(standard) {
		var ret;
		Ext.Ajax.request({
			async : false,
			url : 'tax/check/getFields.do',
			params:{
				standard:standard
			},
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				ret = obj;
			}
		});
		return ret;
	},
	getColumns : function(standard) {
		var ret;
		Ext.Ajax.request({
			async : false,
			url : 'tax/check/getColumns.do',
			params:{
				standard:standard
			},
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				for (var i = 0; i < obj.length; i++) {
					if (obj[i].text == '处理时间' ||obj[i].text=='校验时间') {
						obj[i].renderer=DateRender;
					}
				}
				ret = obj;
			}
		});
		return ret;
	}
})