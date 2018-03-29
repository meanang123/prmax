//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.ai.stdview");

dojo.require("prmax.display.StdViewCommon");
dojo.require("prcommon.recovery.passwordrecoverydetails");

// Create control button on a row

dojo.declare("prmax.ai.stdview",
	[dijit._Widget, dijit._Templated, dijit._Container,prmax.display.StdViewCommon],{
		widgetsInTemplate: true,
		private_data:false,
		templatePath: dojo.moduleUrl( "prmax.ai","templates/stdview.html"),
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
		}
	//,
	// Ai only has single view so this is a dummy function
	//showView:function( viewname )
	//{
	//}
});