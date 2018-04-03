//-----------------------------------------------------------------------------
// Name:    prmax.updatum.stdview
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.updatum.stdview");

dojo.require("prcommon.recovery.passwordrecoverydetails");
dojo.require("prmax.display.StdViewCommon");

dojo.declare("prmax.updatum.stdview",
	[ ttl.BaseWidget,prmax.display.StdViewCommon],{
		widgetsInTemplate: true,
		private_data:true,
		templatePath: dojo.moduleUrl( "prmax.updatum","templates/stdview.html"),
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
});