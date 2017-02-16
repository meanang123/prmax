//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.newrelease
// Author:  Chris Hoy
// Purpose: To Select and existing release and then start the release wizard
// Created: 09/03/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.newrelease");

dojo.declare("prmax.pressrelease.newrelease",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/newrelease.html"),
	constructor: function()
	{
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
	},
	postCreate:function()
	{
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");

		this.inherited(arguments);
	},
	_Cancel:function()
	{
		this.hide();
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavedCall,
				url: "/emails/templates_add" ,
				content: this.form.get("value")
			}));
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.PressReleaseStart, [response.data]) ;
			this.hide();
			this._Clear();
		}
		else if (response.success=="DU")
		{
			alert("Press Release Name Already Exists");
			this.emailtemplatename.focus();
		}
		else if (response.success=="VF")
		{
			alert( "Press Release: " + response.error_message[0][1]);
			this.emailtemplatename.focus();
		}
		else
		{
			alert("Problem with Press Release");
			this.emailtemplatename.focus();
		}
		this.saveNode.cancel();
	},
	_Clear:function()
	{
		this.emailtemplatename.set("value",null);
		this.clientid.set("value",  "-1");

		this.saveNode.cancel();
	},
	show:function()
	{
		this._Clear();
		this.dlg.show();
	},
	hide:function()
	{
		this.dlg.hide();
		this._Clear();
	}
});
