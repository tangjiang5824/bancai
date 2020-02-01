Ext.define("component.TableList",{
	extend:"Ext.form.ComboBox",
	fieldLabel : '数据类型',
	labelWidth : 60,
	width : 400,
	name : 'tableName',
	emptyText : "--请选择--",
	displayField : 'tableName',
	valueField : 'tableName',
	editable : false,
	onTriggerClick : function() {
		this.expand();
	},
	store : {
		fields : ['tableName'],
		proxy : {
			type : 'ajax',
			url : 'tableList.do',
			reader : {
				type : 'json'
			}
		},
		autoLoad : true
	}
});