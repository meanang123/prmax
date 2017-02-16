dojo.provide("prmax.display.startup.plugins.updatum");

dojo.require("dojox.widget.Portlet");

dojo.declare("prmax.display.startup.plugins.updatum",
	[ ttl.BaseWidget ],{
	templateString: dojo.cache( "prmax","display/startup/plugins/templates/updatum.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	}
});