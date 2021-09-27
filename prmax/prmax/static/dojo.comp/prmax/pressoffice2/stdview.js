//-----------------------------------------------------------------------------
// Name:    prmax.pressoffice.stdview
// Author:  Stamatia Vatsi
// Purpose:
// Created: Nov 2019
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressoffice.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");
dojo.require("prcommon.recovery.passwordrecoverydetails");

dojo.declare("prmax.pressoffice.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.pressoffice","templates/stdview.html"),
	postCreate:function()
	{
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
		this.inherited(arguments);
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});
