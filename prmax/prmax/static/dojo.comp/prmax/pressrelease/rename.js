//-----------------------------------------------------------------------------
// Name:    rename.js
// Author:  Chris Hoy
// Purpose: rename email
// Created: 21/11/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.rename");
dojo.declare("prmax.pressrelease.rename",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/rename.html"),
	constructor: function()
	{
		this._rename_call_back = dojo.hitch ( this, this._rename_call ) ;
		this._load_call_back = dojo.hitch(this, this._load_call);

		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});

	},
	postCreate:function()
	{

		dojo.attr(this.client_label,"innerHTML", PRMAX.utils.settings.client_name );

		this.clientid.set("store", this._clients);
		this.clientid.set("value",-1);

		this.inherited(arguments);
	},
	_cancelRename:function()
	{
		this._dialog.hide();
		this._clear();
	},
	_rename_call:function( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish("/pr/rename", [response.data]);
			alert("Distribution Renamed");
			this._dialog.hide();
			this._clear();
		}
		else if ( response.success == "DU" )
		{
			alert("Distribution allready Exists");
		}
		else
		{
			alert("Problem Renaming Distrbution");
		}

		this.rename_btn.cancel();

	},
	_rename:function()
	{
		if ( ttl.utilities.formValidator(this.rename_form)==false)
		{
			alert("Not all required field filled in");
			this.rename_btn.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._rename_call_back,
						url:"/emails/template_rename" ,
						content: this.rename_form.get("value")
						})	);
	},
	_clear:function()
	{
		this.emailtemplateid.set("value",-1);
		this.emailtemplatename.set("value","");
		this.clientid.set("value",-1);
		this.rename_btn.cancel();

	},
	load:function(emailtemplateid,dialog)
	{
		this._dialog = dialog;
		this.rename_btn.cancel();

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._load_call_back,
				url:"/emails/templates_get_min" ,
				content: {emailtemplateid: emailtemplateid}
		})	);
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.emailtemplateid.set("value",response.data.emailtemplateid);
			this.emailtemplatename.set("value",response.data.emailtemplatename);
			this.clientid.set("value", response.data.clientid);
			this._dialog.show();
		}
	},
	_cancel:function()
	{
		this._dialog.hide();
		this._clear();
	}
});
