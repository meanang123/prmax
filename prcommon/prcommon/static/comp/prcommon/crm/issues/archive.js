//-----------------------------------------------------------------------------
// Name:    archive.js
// Author:  Chris Hoy
// Purpose:
// Created: 06/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.issues.archive");

dojo.declare("prcommon.crm.issues.archive",
	[ ttl.BaseWidget ],
	{
	mode:"archive",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/archive.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch( this, this._save_call);
		this._add_issue_call_back = dojo.hitch(this, this._add_issue_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this._dialog = null;
	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}
		var url = "/crm/issues/archive";
		if ( this.mode =="unarchive")
			url = "/crm/issues/unarchive";

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:url,
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
			dojo.publish ( PRCOMMON.Events.Issue_Update , [response.data ]);
			this._close();
		}
		else
		{

			alert("Problem Changing Issue Status");
			this.savebtn.cancel();
		}
	},
	_clear:function()
	{
		this.savebtn.cancel();

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
	load:function( issue, mode )
	{
		this._clear();
		this.mode = mode;
		this.issueid.set("value", issue.issueid);
		dojo.attr(this.issuename,"innerHTML",issue.name);
	}
});





