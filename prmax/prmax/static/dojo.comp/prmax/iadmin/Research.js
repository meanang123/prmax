dojo.provide("prmax.iadmin.Research");

dojo.declare("prmax.iadmin.Research",
	[  ttl.BaseWidget ],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin","templates/Research.html"),
	postCreate:function()
	{
		this.active_report_date.set("value", new Date());
		this.inherited(arguments);
	},
	_Active_Report:function()
	{
		this.form.submit();
	}
});