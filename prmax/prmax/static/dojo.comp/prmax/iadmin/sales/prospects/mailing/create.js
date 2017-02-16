//-----------------------------------------------------------------------------
// Name:    create.js
// Author:  Chris Hoy
// Purpose:
// Created: 01/08/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.mailing.create");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.validate.regexp");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");
dojo.require("prmax.iadmin.sales.prospects.companies.add");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.BorderContainer");

dojo.declare("prmax.iadmin.sales.prospects.mailing.create",
	[ ttl.BaseWidget ],
	{
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/mailing/templates/create.html"),
	constructor: function()
	{
		this._update_call_back = dojo.hitch(this,this._update_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_close:function()
	{
		this._dialog.hide();
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
			load: this._update_call_back,
			url:"/iadmin/prospects/mailing/add_mailing",
			content:this.form.get("value")}));
	},
	_update_call:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish("/prospect/mailing/add", [response.data] );
				alert("Mailing Added");
			this._close();
			this.clear();
		}
		else if ( response.success == "DU")
		{
			alert("Mailing already exists");
		}
		else
		{
			alert("Problem Adding Mailing");
		}

		this.addbtn.cancel();
	},
	load:function( dialog )
	{
		this._dialog = dialog;
		this.clear();
	},
	clear:function()
	{
		this.addbtn.cancel();
	}
});





