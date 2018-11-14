//-----------------------------------------------------------------------------
// Name:    add_order.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.clippings.add_order");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.Countries");
dojo.require("prcommon.languages.Languages");
dojo.require("prcommon.clippings.clippingstype");
dojo.require("prmax.customer.clients.add");

dojo.require("prcommon.search.std_search");

dojo.declare("prmax.iadmin.clippings.add_order",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.clippings","templates/add_order.html"),
	constructor: function()
	{
		this._add_call_back = dojo.hitch(this,this._add_call);
		this._Client_Add_Call_Back = dojo.hitch(this, this._Client_Add_Call);
		this._clippings_orders_model = new dojox.data.JsonRestStore({target:'/iadmin/clippings/list_clippingsprices', idAttribute:"clippingspriceid"});
		this._clients = new dojox.data.JsonRestStore({target:"/iadmin/clippings/list_clients", idAttribute:"clientid"});
		this._issues = new dojox.data.JsonRestStore({target:"/iadmin/clippings/list_issues", idAttribute:"issueid"});
		this._pricecodes = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=clippings"});
		this._sources = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=clippingsource"});

	},
	postCreate:function()
	{
		this.clippingspriceid.set("store",this._clippings_orders_model);
		this.clientid.set("store",this._clients);
		this.issueid.set("store",this._issues);
		this.pricecodeid.set("store", this._pricecodes);
		this.clippingsourceid.set("store", this._sources);
		this._clear();
		this.inherited(arguments);
	},
	load:function ( dialog, icustomerid, end_date)
	{
		this._dialog = dialog;
		this.end_date = end_date;
		this.icustomerid.set("value",icustomerid);
		this._icustomerid = icustomerid;
		this.clientid.set("query",{icustomerid:icustomerid});
		this.issueid.set("query",{icustomerid:icustomerid});
		this._dialog.resize({w:1010, h:700})
	},
	_close:function()
	{
		this._dialog.hide();
	},
	_add_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this._dialog.hide();
			this._clear();
			dojo.publish ( "/clippings/order/add" , [response.data ]);
		}
		else
		{
			alert("Problem Adding Clippings Order");
		}
		this.addbtn.cancel();
	},
	_clear:function()
	{
		this.addbtn.cancel();
		this.startdate.set("value",new Date());
		this.enddate.set("value",this.end_date);
		this.keywords.set("value","");
		this.rss_feed.set("value","");
		this.purchaseorder.set("value","");
		this.description.set("value","");
		this.message.set("value","");
		this.clientid.set("value", null);
		this.issueid.set("value", null);
		this.clippingsourceid.set("value", 6);
	},
	_add:function()
	{
		if (this.clippingsourceid != 1 && this.clippingstypes.value == "" )
		{
			alert("Please Enter Clippings Type");
			this.addbtn.cancel();
			return false;
		}
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["startdate"] = ttl.utilities.toJsonDate(this.startdate.get("value"));
		content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._add_call_back),
			url:'/iadmin/clippings/add_order',
			content: content}));
	},
	clear:function()
	{
		this._clear();
	},
	_client_change:function()
	{
		var clientid = this.clientid.get("value");
		if (clientid == undefined)
			clientid = -1;

		this.issueid.set("query",{
			icustomerid: this.icustomerid.get("value"),
			clientid: clientid
		});

		this.issueid.set("value",null);

	},
	_change_source:function()
	{
		var sourceid = this.clippingsourceid.get("value");
		if (sourceid == 1)
		{
			dojo.addClass( this.clippingstypes_node, "prmaxhidden");
			if (this._dialog)
			{
				this._dialog.resize({w:1010, h:525});
			}
		}
		else
		{
			try
			{
				this._dialog.resize({w:1010, h:700});
			}
			catch(e){}

			dojo.removeClass( this.clippingstypes_node, "prmaxhidden");
		}
	},
	_Client_Add_Call:function(action, data )
	{
		this.clientid.set("value", data.clientid );
		this.client_add_dialog.hide();
	},
	_New_Client:function()
	{
		this.client_add_ctrl.Load(-1, this._Client_Add_Call_Back);
		this.client_add_ctrl.set("icustomerid",this._icustomerid);
		this.client_add_dialog.show();
	}
});
