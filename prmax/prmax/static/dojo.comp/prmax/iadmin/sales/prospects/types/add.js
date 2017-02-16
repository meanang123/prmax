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
dojo.provide("prmax.iadmin.sales.prospects.types.add");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");

dojo.declare("prmax.iadmin.sales.prospects.types.add",
	[ ttl.BaseWidget ],
	{
	url:"/iadmin/prospects/types/add_type",
	mode:"add",
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/types/templates/add.html"),
	constructor: function()
	{
		this._dialog = null;
		this._save_call_back = dojo.hitch(this, this._save_call);
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
			dojo.publish("/prospect/types/add", [response.data] );
			if (this.mode == "add")
			{
				alert("Source Added");
			}
			else
			{
				alert("Soure Updated");
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
			alert("Problem with saving Source");
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
	load:function( dialog)
	{
		this._dialog = dialog;
		this.clear();
	},
	clear:function()
	{
		this.addbtn.cancel();
		this.prospecttypeid.set("value","-1");
		this.prospecttypename.set("value", "");
	}
});





