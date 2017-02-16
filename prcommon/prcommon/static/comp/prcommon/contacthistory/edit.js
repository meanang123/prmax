//-----------------------------------------------------------------------------
// Name:    prcommon.contacthistory.edit
// Author:  Chris Hoy
// Purpose: Simple Private note edit Dialog
// Created: 05/11/2013
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.contacthistory.edit");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.contacthistory.edit",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	displaytitle:"Keywords",
	templatePath: dojo.moduleUrl( "prcommon.contacthistory","templates/edit.html"),
	constructor: function()
	{

		dojo.subscribe("/crm/edit_notes", dojo.hitch(this,this._show_event));
		this._show_notes_call_back = dojo.hitch(this, this._show_notes_call );
		this._update_notes_call_back = dojo.hitch(this, this._update_notes_call );

	},
	_show_notes_call:function ( response )
	{

		if ( response.success == "OK")
		{
			this.profile.set("value", response.data);
			this.savenode.cancel();
			this.dialog_ctrl.show();
		}
		else
		{
			alert( "Problem Loading Private notes");
		}
	},
	_update_notes_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Private Notes Updated");
			dojo.publish ( PRCOMMON.Events.Update_Notes , [ this._outletid, this._employeeid ]);
			this.dialog_ctrl.hide();

		}
		else
		{
			alert( "Problem Updating Private notes");
		}
		this.savenode.cancel();
	},
	_show_event:function(outletid, employeeid)
	{
		this._outletid = outletid;
		this._employeeid = employeeid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._show_notes_call_back,
					url:'/crm/get_private_notes',
					content:{ outletid : outletid,
										employeeid : employeeid}}));

		this.dialog_ctrl.show();
	},
	_Update:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._update_notes_call_back,
					url:'/crm/update_private_notes',
					content:{ outletid : this._outletid,
										employeeid : this._employeeid,
										profile : this.profile.get("value")}}));

	},
	_Close:function()
	{
		this.dialog_ctrl.hide();
	}
});