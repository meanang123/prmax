//-----------------------------------------------------------------------------
// Name:    c.js
// Author:  Chris Hoy
// Purpose:
// Created: 12/11/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.solidsocial.addsearchprofile");

dojo.require("prcommon.documents.adddialog");

dojo.declare("prcommon.crm.solidsocial.addsearchprofile",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.solidsocial","templates/addsearchprofile.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this, this._save_call);
		this._dialog = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	clear:function()
	{
	},
	_close:function()
	{
		this._clear();

		if ( this._dialog)
		{
			this._dialog.hide();
		}
	},
	load:function(issueid)
	{
		this.issueid.set("value", issueid);
	},
	_save:function()
	{
		var content = this.form.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/crm/issues/addsearchprofile',
			content:content}));

	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			this._close();
			dojo.publish("/crm/issue/profile_new",[this.issueid.get(value)]);
		}
		else
		{
			alert("Problem adding");
			this.savebtn.cancel();
		}
	}
});
