//-----------------------------------------------------------------------------
// Name:    usersettings.js
// Author:  Chris Hoy
// Purpose:
// Created: 02/04/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.usersettings");

dojo.declare("prmax.dataadmin.usersettings",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/usersettings.html"),
	constructor:function()
	{
	 this._LoadCallBack = dojo.hitch(this, this._LoadCall);
	 this._UpdateCallBack = dojo.hitch(this, this._UpdateCall);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCallBack,
			url:'/user/research_get_settings'
			}));

	},
	_LoadCall:function (response)
	{
		if ( response.success == "OK" )
		{
			this.display_name.set("value",response.user.display_name);
			this.job_title.set("value",response.user.job_title);
			this.email_address.set("value",response.user.email_address);
			this.tel.set("value",response.user.tel);
			this.saveNode.set("disabled",false);
		}
		else
		{
			alert("problem loading settings");
		}
	},
	_UpdateCall:function(response)
	{
		if ( response.success == "OK" )
		{
			alert("Settings Updated");
		}
		else if ( response.success == "DU" )
		{
			alert("Email Address Already Exists");
		}
		else
		{
			alert("Problem Saving settings");
		}
		this.saveNode.cancel();
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		if ( confirm("Update Settings?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._UpdateCallBack,
				url:'/user/research_update_settings',
				content: this.form.get("value")
				}));
		}
	}
});





