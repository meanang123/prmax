//-----------------------------------------------------------------------------
// Name:    briefingnoteadd.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2014
//
// To do:
//
//-----------------------------------------------------------------------------
//
dojo.provide("prcommon.crm.issues.briefingnoteadd");

dojo.require("prmax.customer.clients.pickcolour");

dojo.declare("prcommon.crm.issues.briefingnoteadd",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/briefingnoteadd.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch( this, this._save_call);
	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:"/crm/issues/briefingnoteadd" ,
						content: this.formnode.get("value")
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
			dojo.publish ( "/bn/add" , [response.data ]);
		}
		else
		{
			alert("Problem Adding Briefing Note Status");
			this.savebtn.cancel();
		}
	},
	_clear:function()
	{
		this.savebtn.cancel();
		this.briefingnotesstatusdescription.set("value","");
		this.background_colour.set("value","");
		this.text_colour.set("value","");
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
	}
});





