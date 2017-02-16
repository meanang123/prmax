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
dojo.provide("prmax.iadmin.sales.prospects.gather.add");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.validate.regexp");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");
dojo.require("prmax.iadmin.sales.prospects.companies.add");
dojo.require("dijit.Dialog");


dojo.declare("prmax.iadmin.sales.prospects.gather.add",
	[ ttl.BaseWidget ],
	{
	url:"/iadmin/prospects/prospect/add_prospect",
	mode:"add",
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/gather/templates/add.html"),
	constructor: function()
	{
		this._dialog = null;
		this._store = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/companies/list", idAttribute:"prospectcompanyid"});
		dojo.subscribe("/prospect/comp/add", dojo.hitch(this, this._add_event));
		this._update_call_back = dojo.hitch(this, this._update_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.prospectcompanyid.set("store", this._store);
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
			url:this.url,
			content:this.form.get("value")}));
	},
	_update_call:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish("/prospect/prospect/add", [response.data] );
			if (this.mode == "add")
			{
				alert("Prospect Added");
			}
			else
			{
				alert("Prospect Updated");
			}
			this._close();
			this.clear();
		}
		else if ( response.success == "DU")
		{
			alert("Email Address already exists");
		}
		else
		{
			if (response.message != null)
				alset(response.message);
			else
				alert("Problem adding Entry");
		}

		this.addbtn.cancel();
	},
	load:function( dialog)
	{
		this._dialog = dialog;
		this.clear();
	},
	clear:function()
	{
		this.email.set("value","");
		this.familyname.set("value","");
		this.firstname.set("value","");
		this.title.set("value","");
		this.prospectcompanyid.set("value",null);
		this.addbtn.cancel();
	},
	_add_company:function()
	{
		this.addctrl.clear();
		this.addctrl.load( this.adddialog );
		this.adddialog.show();
	},
	_add_event:function( company )
	{
		this.prospectcompanyid.set("value", company.prospectcompanyid);
	}
});





