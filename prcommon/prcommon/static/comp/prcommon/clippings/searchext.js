//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.searchext
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.searchext");

dojo.require("ttl.BaseWidget");

dojo.require("prcommon.date.daterange");
dojo.require("dojox.data.JsonRestStore");


dojo.declare("prcommon.clippings.searchext",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/searchext.html"),
	constructor: function()
	{
		this._clients = new dojox.data.JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._outlets = new dojox.data.JsonRestStore({target:'/outlets/list_outlets', idAttribute:"outletid"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
	},
	postCreate:function()
	{
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");
		this.outletid.set("store",this._outlets);
		this.issueid.set("store", this._issues);
		this.issueid.set("value", null );

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);

		this.inherited(arguments);
	},
	load:function(search_func)
	{
		this._search_func=search_func;
	},
	clear:function()
	{
		this.clientid.set("value",  "-1");
		this.issueid.set("value",  "-1");
		this.outletid.set("value",null);
		this.drange.clear();
		this.textid.set("value","");
	},
	_do_clear:function()
	{
		this.clear()
	},
	_do_search:function()
	{
		var query={drange:this.drange.get("value")};

		var valueid = this.clientid.get("value");
		if (valueid != null && valueid != -1 && valueid !='')
		{
			query['clientid'] = valueid;
		}

		valueid = this.issueid.get("value");
		if (valueid != null && valueid != -1 && valueid !='' )
		{
			query['issueid'] = valueid;
		}

		if ( this.textid.get("value")!="")
		{
			query['textid'] = this.textid.get("value");
		}

		value = this.outletid.get("value");
		if (valueid != null && valueid != -1 && valueid !='' )
		{
			query['outletid'] = valueid;
		}

		this._search_func(query);
	}
});
