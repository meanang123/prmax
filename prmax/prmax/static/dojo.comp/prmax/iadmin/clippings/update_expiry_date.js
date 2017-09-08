//-----------------------------------------------------------------------------
// Name:    update_expiry_date.js
// Author:  
// Purpose:
// Created: Sept 2017
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.clippings.update_expiry_date");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.clippings.update_expiry_date",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.clippings","templates/update_expiry_date.html"),
	constructor: function()
	{
		this._update_expiry_date_call_back = dojo.hitch(this,this._update_expiry_date_call);
	},
	postCreate:function()
	{
		this._clear();
		this.inherited(arguments);
	},
	load:function(dialog, icustomerid)
	{
		this._dialog = dialog;
//		this.icustomerid.set("value",icustomerid);
		this._icustomerid = icustomerid;
	},
	_close:function()
	{
		this._dialog.hide();
	},
	_update_expiry_date:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = {};
		content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));
		content["icustomerid"] = this._icustomerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._update_expiry_date_call_back),
			url:'/iadmin/clippings/update_expiry_date',
			content: content}));
	},
	_update_expiry_date_call:function(response)
	{
		if ( response.success == "OK" )
		{
			this._dialog.hide();
			this._clear();
			dojo.publish("/clippings/order/update_expiry_date" , [ttl.utilities.toJsonDate2(this.enddate.get("value"))]);
		}
		else
		{
			alert("Problem Updating Expiry Date");
		}
	},
	_clear:function()
	{
		this.enddate.set("value",this.end_date);
	},
	clear:function()
	{
		this._clear();
	},

});
