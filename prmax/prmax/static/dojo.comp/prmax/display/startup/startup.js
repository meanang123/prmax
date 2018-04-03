dojo.provide("prmax.display.startup.startup");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.layout.GridContainer");
dojo.require("dojox.widget.Portlet");

dojo.require("prmax.display.startup.plugins.standing");
dojo.require("prmax.display.startup.plugins.distribution");
dojo.require("prmax.display.startup.plugins.contactus");
dojo.require("prmax.display.startup.plugins.updatum");
dojo.require("prmax.display.startup.plugins.prrequests");
dojo.require("prmax.display.startup.plugins.passwordrecovery");

dojo.require("prcommon.recovery.passwordrecoverydetails");

dojo.require("dojox.data.AtomReadStore");

dojo.declare("prmax.display.startup.startup",
	[ ttl.BaseWidget ],{
	url:"",
	templatePath: dojo.moduleUrl( "prmax.display.startup","templates/startup.html"),
	postCreate:function()
	{

		// for later
		//if (PRMAX.utils.settings.updatum == true)
		//{
			//var updatum = new prmax.display.startup.plugins.updatum({ dndType:"Portlet", dragRestriction:true});
			//this.frame.addChild(updatum, 0, 0);
		//}
		var tmp = new dijit.layout.ContentPane({ dndType:"Portlet", dragRestriction:true, style:"width:100%;height:100%"});
		this.frame.addChild(tmp, 0, 0);

		this.frame.addChild(new prmax.display.startup.plugins.distribution({ dndType:"Portlet", dragRestriction:true}), 0, 0);
		this.frame.addChild(new prmax.display.startup.plugins.standing({ dndType:"Portlet", dragRestriction:true}), 0, 0);

		this.frame.addChild(new prmax.display.startup.plugins.contactus({ dndType:"Portlet", dragRestriction:true}), 1, 0);

		this.frame.addChild(new prmax.display.startup.plugins.prrequests({ dndType:"Portlet", dragRestriction:true}), 1, 0);

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
		var tmp = arguments[0];
		console.log("STARTUP",tmp);
		this.frame.resize( arguments[0] );
	}
});
