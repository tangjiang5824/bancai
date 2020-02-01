Ext.define("component.YearList",{
	extend:"Ext.form.ComboBox",
	fieldLabel : '年份',
	name : 'year',
	labelWidth : 50,
	width:150,
	displayField : 'year',
	valueField : 'year',
	emptyText : "--请选择--",
	editable : false,
	onTriggerClick : function() {
		this.expand();
	},
	initComponent:function(){
		var years=[];
		var now=new Date();
		for(var i=2017;i<=now.getFullYear();i++)
		{
			years.push({"year":i});
		}
		this.store={
				fields : ['year'],
				data:years
		}
		this.value=now.getFullYear();
		this.callParent();
	}
});
