dojo.provide("prmax.display.startup.plugins.contactus");

dojo.require("dojox.widget.Portlet");

dojo.declare("prmax.display.startup.plugins.contactus",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.display.startup.plugins","templates/contactus.html"),
	_ShowDetais:function()
	{
	 this.contact_details_dialog.show();
	},
	_Close:function()
	{
	 this.contact_details_dialog.hide();
	},
	_show_journalists:function()
	{
	 this.ppr_request_dialog.show();
	 this.ppr_request_ctrl.set_size();
	}
});