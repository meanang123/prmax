//-----------------------------------------------------------------------------
// Name:    prmax.journolink.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2016
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.journolink.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");
dojo.require("prcommon.recovery.passwordrecoverydetails");

dojo.declare("prmax.journolink.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.journolink","templates/stdview.html"),
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
