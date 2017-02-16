dojo.provide("prmax.display.startup");

dojo.declare("prmax.display.startup",
	[ ttl.BaseWidget ],{
		templatePath: dojo.moduleUrl( "prmax.display","templates/startup.html"),
		widgetsInTemplate: true,
	constructor: function() {
	},
	postCreate:function()
	{
		this.front_panel_1.set("href","/layout/front_panel_1");
		if (PRMAX.utils.settings.useemail == false || PRMAX.utils.settings.isdemo == true)
		{
			dojo.style(this.distribute_exists,"display","none");
			dojo.style(this.distribute_add,"display","none");
		}

		this.inherited(arguments);

	},
	startup:function()
	{
		ttl.utilities.hideMessage();
		this.inherited(arguments);
	},
	_DoSearch:function()
	{
		dijit.byId("std_banner_control").ShowSearchStd();
	},
	_DoLists:function()
	{
		dijit.byId("std_banner_control").ShowListsPage();
	},
	_Existing:function()
	{
		dijit.byId("std_banner_control").ShowExistingPressRelease();
	},
	_New:function()
	{
		dijit.byId("std_banner_control").ShowNewPressRelease();
	}
});