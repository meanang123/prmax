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
dojo.provide("prmax.iadmin.sales.prospects.companies.add");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");

dojo.declare("prmax.iadmin.sales.prospects.companies.add",
	[ ttl.BaseWidget ],
	{
	url:"/iadmin/prospects/companies/add_company",
	mode:"add",
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/companies/templates/add.html"),
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
			dojo.publish("/prospect/comp/add", [response.data] );
			if (this.mode == "add")
			{
				alert("Company Added");
			}
			else
			{
				alert("Company Updated");
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
			alert("Problem with saving company");
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
	load:function( dialog, prospectcompanyid , prospectcompanyname )
	{
		this._dialog = dialog;
		this.clear();
		this.prospectcompanyid.set("value", prospectcompanyid);
		this._prospectcompanyid = prospectcompanyid;
		if (this._prospectcompanyid)
		this.prospectcompanyname.set("value", prospectcompanyname);
	},
	clear:function()
	{
		this.addbtn.cancel();
		this.prospectcompanyid.set("value","-1");
		this.prospectcompanyname.set("value", "");
	}
});





