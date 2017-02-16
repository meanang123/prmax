//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/07/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.sources.add");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");

dojo.declare("prmax.iadmin.sales.prospects.sources.add",
	[ ttl.BaseWidget ],
	{
	url:"/iadmin/prospects/sources/add_source",
	mode:"add",
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/sources/templates/add.html"),
	constructor: function()
	{
		this._dialog = null;
		this._save_call_back = dojo.hitch(this, this._save_call);
		this.prospectcompanyid = null;
	},
	_close:function()
	{
		if (this._dialog)
			this._dialog.hide();
	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish("/prospect/sources/add", [response.data] );
			if (this.mode == "add")
			{
				alert("Source Added");
			}
			else
			{
				alert("source Updated");
			}
			this._close();
			this.clear();
		}

		else if ( response.success == "DU")
		{
			alert("Already Exists");
		}
		else
		{
			alert("Problem with saving sources");
		}

		this.addbtn.cancel();

	},
	_update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:this.url,
			content:this.form.get("value")}));
	},
	load:function( dialog  )
	{
		this._dialog = dialog;
		this.clear();
	},
	clear:function()
	{
		this.addbtn.cancel();
		this.prospectsourceid.set("value","-1");
		this.prospectsourcename.set("value", "");
	}
});





