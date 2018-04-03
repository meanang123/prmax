dojo.provide("prmax.display.startup.plugins.passwordrecovery");

dojo.declare("prmax.display.startup.plugins.passwordrecovery",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.display.startup.plugins","templates/passwordrecovery.html"),
	constructor: function()
	{
	},	
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

});