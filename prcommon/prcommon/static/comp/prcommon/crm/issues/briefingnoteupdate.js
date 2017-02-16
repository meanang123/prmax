//-----------------------------------------------------------------------------
// Name:    briefingnoteupdate.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2014
//
// To do:
//
//-----------------------------------------------------------------------------
//
dojo.provide("prcommon.crm.issues.briefingnoteupdate");

dojo.require("prmax.customer.clients.pickcolour");

dojo.declare("prcommon.crm.issues.briefingnoteupdate",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/briefingnoteupdate.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch( this, this._save_call);
		this._load_call_back = dojo.hitch( this, this._load_call);
	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		var content = this.formnode.get("value");

		content["briefingnotesstatusid"] = this._briefingnotesstatusid;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:"/crm/issues/briefingnoteupdate" ,
						content: content
						}));
	},
	_setDialogAttr:function( _dialog )
	{
		this._dialog = _dialog;
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this._close();
			dojo.publish ( "/bn/upd" , [response.data ]);
		}
		else if ( response.success == "DU")
		{
			alert("Briefing Status Already Exists");
			this.savebtn.cancel();
		}
		else
		{
			alert("Problem Updating Briefing Note Status");
			this.savebtn.cancel();
		}
	},
	_clear:function()
	{
		this.savebtn.cancel();
		this.briefingnotesstatusdescription.set("value","");
		this.background_colour.set("value","transparent");
		this.text_colour.set("value","transparent");
	},
	_close:function()
	{
		if ( this._dialog != null)
			this._dialog.hide();

		this._clear();
	},
	clear:function()
	{
		this._clear();
	},
	load:function(briefingnotesstatusid)
	{
		this.clear();
		this._briefingnotesstatusid = briefingnotesstatusid;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_call_back,
						url:"/crm/issues/briefingnoteget" ,
						content: {briefingnotesstatusid:briefingnotesstatusid}
						}));
	},
	_load_call:function(response)
	{

		if ( response.success == "OK")
		{
			with (response)
			{
				this.briefingnotesstatusdescription.set("value",data.briefingnotesstatusdescription);
				this.background_colour.set("value",data.background_colour);
				this.text_colour.set("value",data.text_colour);
			}

			this._dialog.show();
		}
	}
});





