//-----------------------------------------------------------------------------
// Name:    prmax.levelcert.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 19/10/2015
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.levelcert.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.display.StdViewCommon");
dojo.require("prcommon.recovery.passwordrecoverydetails");

dojo.declare("prmax.levelcert.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container, prmax.display.StdViewCommon],{
	widgetsInTemplate: true,
	private_data:true,
	templatePath: dojo.moduleUrl( "prmax.levelcert","templates/stdview.html"),
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
