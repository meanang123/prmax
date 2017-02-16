//-----------------------------------------------------------------------------
// Name:    prmax.solidmedia.startup
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.solidmedia.startup");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.search.PersonSearch");

dojo.declare("prmax.solidmedia.startup",
	[ dijit._Widget, dijit._Templated, dijit._Container ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.solidmedia","templates/startup.html"),
		postCreate:function()
		{
			this.issuesbtn.set("label", PRMAX.utils.settings.issue_description);
			this.inherited(arguments);
		},
		_issues:function()
		{
			dijit.byId("std_banner_control")._issues( );
		},
		_people:function()
		{
			this.person_search.start_search();
		},
		_distribution:function()
		{
			dijit.byId("std_banner_control").ShowExistingPressRelease();
		},
		_coverage:function()
		{
			dijit.byId("std_banner_control").show_coverage();
		},
		_tasks:function()
		{
			dijit.byId("std_banner_control").show_tasks();
		}
});
