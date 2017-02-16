//-----------------------------------------------------------------------------
// Name:    prmax.professional.startup
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.professional.startup");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.search.PersonSearch");

dojo.declare("prmax.professional.startup",
	[ dijit._Widget, dijit._Templated, dijit._Container ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.professional","templates/startup.html"),
		postCreate:function()
		{
			dojo.attr(this.issue_label,"label", PRMAX.utils.settings.issue_description);
			this.inherited(arguments);

			if (PRMAX.utils.settings.crm)
			{
				dojo.style(this.issue_frame,"display","block");
				dojo.style(this.task_frame,"display","block");
			}
			if (PRMAX.utils.settings.clippings)
			{
				dojo.style(this.clippings_view,"display","block");
			}
		},
		_issues:function()
		{
			dijit.byId("std_banner_control")._issues( );
		},
		_search:function()
		{
			dijit.byId("std_banner_control").ShowSearchStd();
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
		},
		_clippings:function()
		{
			dijit.byId("std_banner_control")._show_clippings();
		},
		_people:function()
		{
			this.person_search.start_search();
		}
});
