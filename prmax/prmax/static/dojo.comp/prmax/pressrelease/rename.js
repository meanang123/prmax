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
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});

		this._change_client_enabled = true;

	},
	postCreate:function()
	{

		dojo.attr(this.client_label,"innerHTML", PRMAX.utils.settings.client_name );
		dojo.attr(this.issue_label, "innerHTML", PRMAX.utils.settings.issue_description);

		this.clientid.set("store", this._clients);
		this.clientid.set("value",-1);
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );

		if (PRMAX.utils.settings.crm)
			dojo.removeClass(this.issue_view,"prmaxhidden");

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
			this.issueid.set("value", response.data.issueid);
			this._dialog.show();
		}
	},
	_cancel:function()
	{
		this._dialog.hide();
		this._clear();
	},
	_client_change:function()
	{
		if (PRMAX.utils.settings.crm)
		{
			var clientid = this.clientid.get("value");
			if (clientid == undefined)
				clientid = -1;

			this.issueid.set("query",{ clientid: clientid});
			if (this._change_client_enabled==true)
			{
				this.issueid.set("value",null);
			}

			this._change_client_enabled = true ;
		}
	}
});
