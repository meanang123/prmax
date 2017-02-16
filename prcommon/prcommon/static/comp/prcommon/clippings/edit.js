//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.edit
// Author:  Chris Hoy
// Purpose:
// Created: 7/06/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.edit");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.clippings.edit",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/edit.html"),
	constructor: function()
	{
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});

		this._update_call_back = dojo.hitch(this, this._update_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.clientid.set("store",this._clients);
		this.clientid.set("value", "-1" );
		this.issueid.set("store", this._issues);
		this.issueid.set("value", "-1" );

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
	},
	clear:function()
	{
		this.clippingid.set("value",-1);
		this.clientid.set("value", "-1" );
		this.issueid.set("value", "-1" );
		this.savebtn.cancel();
	},
	_save:function()
	{
		if (ttl.utilities.formValidator( this.formnode ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._update_call_back,
			url:'/clippings/update_clipping',
			content: this.formnode.get("value")}));
	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("/clipping/update", [response.data]);
		}
		else
		{
			alert("Problem");
		}
		this.savebtn.cancel();
	},
	load:function(clipping)
	{
		this.savebtn.cancel();
		this.clippingid.set("value",clipping.clippingid);
		this.clientid.set("value", clipping.clientid);
		this.issueid.set("value", clipping.issueid);
	}
});
