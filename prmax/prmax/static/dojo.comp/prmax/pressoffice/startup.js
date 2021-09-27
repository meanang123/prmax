//-----------------------------------------------------------------------------
// Name:    prmax.pressoffice.startup
// Author:  Stamatia Vatsi
// Purpose:
// Created: Nov 2019
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressoffice.startup");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.search.PersonSearch");
dojo.require("prcommon.recovery.passwordrecoverydetails");

dojo.declare("prmax.pressoffice.startup",
	[ dijit._Widget, dijit._Templated, dijit._Container ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.pressoffice","templates/startup.html"),
		constructor: function()
		{
			dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
		},
		postCreate:function()
		{
			dojo.attr(this.issue_label,"label", PRMAX.utils.settings.issue_description);
			dojo.attr(this.distribution_label,"innerHTML", PRMAX.utils.settings.distribution_description_plural);

			this.inherited(arguments);

			if (PRMAX.utils.settings.crm)
			{
				dojo.style(this.issue_frame,"display","block");
				dojo.style(this.task_frame,"display","block");
			}
			if (PRMAX.utils.settings.force_passwordrecovery)
			{
				var message = 'set';
				if (PRMAX.utils.settings.passwordrecovery)
				{
					message = 'update';
				}
				this.set_passwordrecovery_dialog.show();
				this.set_passwordrecovery_ctrl.load(this.set_passwordrecovery_dialog, true, message);
			}
		},
		_UpdateDistributionLabelEvent:function()
		{
			dojo.attr(this.distribution_label,"innerHTML", PRMAX.utils.settings.distribution_description_plural);
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
