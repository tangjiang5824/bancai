function DateRender(v) {
	if (v != null) {
		var d = new Date();
		d.setTime(v);
		return Ext.util.Format.date(d, 'Y-m-d H:i:s');
	} else {
		return "";
	}
}