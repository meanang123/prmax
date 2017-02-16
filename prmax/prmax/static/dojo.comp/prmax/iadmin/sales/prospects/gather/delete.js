//-----------------------------------------------------------------------------
// Name:    delete.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/07/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.gather.delete");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.validate.regexp");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.RadioButton");
dojo.require("dojo.data.ItemFileReadStore");

dojo.declare("prmax.iadmin.sales.prospects.gather.delete",
	[ ttl.BaseWidget ],
	{
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/gather/templates/delete.html"),
	constructor: function()
	{

		this._dialog = null;
		this._update_call_back = dojo.hitch(this, this._update_call);
		this._unsubscribereason = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=unsubscribereason"} );
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.unsubscribereasonid.set("store", this._unsubscribereason);
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
			url:"/iadmin/prospects/prospect/delete_prospect",
			content:this.form.get("value")}));
	},
	_update_call:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish("/prospect/prospect/delete", [response.data] );
			alert("Prospect Deleted");
			this._close();
			this.clear();
		}
		else
		{
			alert("Problem Deleting Prospect");
		}
		this.addbtn.cancel();
	},
	load:function( prospectid, dialog, title)
	{
		this._dialog = dialog;
		dojo.attr(this.title,"innerHTML", title );
		this.clear();
		this.prospectid.set("value", prospectid);
	},
	clear:function()
	{
		this.addbtn.cancel();
		this.prospectid.set("value",-1);
	}
});





