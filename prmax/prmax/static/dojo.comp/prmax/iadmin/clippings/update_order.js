//-----------------------------------------------------------------------------
// Name:    update_order.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.clippings.update_order");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.Countries");
dojo.require("prcommon.languages.Languages");
dojo.require("prcommon.clippings.clippingstype");

dojo.require("prcommon.search.std_search");

dojo.declare("prmax.iadmin.clippings.update_order",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.clippings","templates/update_order.html"),
	constructor: function()
	{
		this._update_call_back = dojo.hitch(this,this._update_call);
		this._load_call_back = dojo.hitch(this,this._load_call);
		this._resend_conformation_call_back = dojo.hitch(this, this._resend_conformation_call);
		this._cancel_call_back = dojo.hitch(this, this._cancel_call);
		this._reactivate_call_back = dojo.hitch(this, this._reactivate_call);
		this._Client_Add_Call_Back = dojo.hitch(this, this._Client_Add_Call);
		this._clippings_orders_model = new dojox.data.JsonRestStore({target:'/iadmin/clippings/list_clippingsprices', idAttribute:"clippingspriceid"});
		this._clients = new dojox.data.JsonRestStore({target:"/iadmin/clippings/list_clients", idAttribute:"clientid"});
		this._issues = new dojox.data.JsonRestStore({target:"/iadmin/clippings/list_issues", idAttribute:"issueid"});
		this._pricecodes = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=clippings"});
		this._sources = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=clippingsource"});
		this._change_client_enabled=true;
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
	load:function ( clippingsorderid , dialog, icustomerid, end_date)
	{
		this._dialog = dialog;
		this.licence_expire = end_date;
		this.clippingsorderid.set("value",clippingsorderid);
		this.icustomerid.set("value",icustomerid);
		this.clientid.set("query",{icustomerid:icustomerid});
		
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._load_call_back),
			url:'/iadmin/clippings/get_order',
			content: {clippingsorderid:clippingsorderid}}));
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			with (response)
			{
				this.updbtn.cancel();
				this.resendsupemail.set("checked",false);
				this.icustomerid.set("value",order.customerid);
				this.startdate.set("value",order.startdate);
				this.enddate.set("value",order.enddate);
				this.keywords.set("value",order.keywords);
				this.rss_feed.set("value",order.rss_feed);
				this.purchaseorder.set("value",order.purchaseorder);
				this.description.set("value",order.description);
				this.message.set("value","");
				this._change_client_enabled = false;
				this.clientid.set("value",order.defaultclientid);
				this.issueid.set("value",order.defaultissueid);
				this.clippingspriceid.set("value",order.clippingspriceid);
				this.supplierreference.set("value",order.supplierreference);
				this.pricecodeid.set("value",order.pricecodeid);
				this.email.set("value", order.email);
				this.clippingsourceid.set("value", order.clippingsourceid);
				this.countries.set("value", order.countries);
				this.languages.set("value", order.languages);
				this.clippingstypes.set("value", order.clippingstypes);
				if (this.clippingsourceid.get("value") == 1 || this.clippingsourceid.get("value") == 7)
				{
					dojo.addClass( this.clippingstypes_node, "prmaxhidden");
					if (this._dialog)
					{
						this._dialog.resize({w:1010, h:550});
					}					
				}
				else
				{
					this._dialog.resize({w:1010, h:700});
					dojo.removeClass( this.clippingstypes_node, "prmaxhidden");
				};
				if (order.clippingorderstatusid == 2)
				{
					dojo.addClass( this.updbtn.domNode, "prmaxhidden");
					dojo.addClass( this.resendbtn.domNode, "prmaxhidden");
					dojo.addClass( this.cancelbtn.domNode, "prmaxhidden");
					dojo.removeClass( this.reactivatebtn.domNode, "prmaxhidden");
				}
				else
				{
					dojo.removeClass( this.updbtn.domNode, "prmaxhidden");
					dojo.removeClass( this.resendbtn.domNode, "prmaxhidden");
					dojo.removeClass( this.cancelbtn.domNode, "prmaxhidden");
					dojo.addClass( this.reactivatebtn.domNode, "prmaxhidden");
				};
			}
			this._dialog.show();
		}
	},
	_close:function()
	{
		this._dialog.hide();
	},
	_update_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this._dialog.hide();
			dojo.publish ( "/clippings/order/upd" , [response.data ]);
			this._clear();
		}
		else
		{
			alert("Problem Updating Clippings Order");
		}
		this.updbtn.cancel();
	},
	_clear:function()
	{
		this.updbtn.cancel();
		this.resendbtn.cancel();

		this.startdate.set("value",new Date());
		this.enddate.set("value",dojo.date.add(new Date(), "year", 1));
		this.keywords.set("value","");
		this.rss_feed.set("value","");
		this.purchaseorder.set("value","");
		this.description.set("value","");
		this.message.set("value","");
		this._change_client_enabled = false;
		this.clientid.set("value", -1);
		this.issueid.set("value", -1);
		this._change_client_enabled = true;
		this.supplierreference.set("value","");
		this.resendsupemail.set("checked",false);
		this.clippingsourceid.set("value", 1);
	},
	_update:function()
	{
		if (this.clippingsourceid != 1 && this.clippingsourceid != 7 && this.clippingstypes.value == "" )
		{
			alert("Please Enter Clippings Type");
			this.updbtn.cancel();
			return false;
		}
	
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["startdate"] = ttl.utilities.toJsonDate(this.startdate.get("value"));
		content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._update_call_back),
			url:'/iadmin/clippings/update_order',
			content: content}));
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
		
		if (this._change_client_enabled==true)
		{
			this.issueid.set("value",null);
		}
		this._change_client_enabled = true ;		
	},
	_resend_conformation_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish ( "/clippings/order/upd" , [response.data ]);
			alert("Sent");
		}
		else
		{
			alert("Problem");
		}

		this.resendbtn.cancel();
	},
	_resend_conformation:function()
	{

		if (ttl.utilities.formValidator( this.form ) == false )
			{
			alert("Please Enter Details");
			this.resendbtn.cancel();
			return false;
		}

		if ( confirm("Update & Resend Order Conformation"))
		{
			var content = this.form.get("value");

			content["startdate"] = ttl.utilities.toJsonDate(this.startdate.get("value"));
			content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));

			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._resend_conformation_call_back),
				url:'/iadmin/clippings/resend_conformation',
				content: content}));
		}
	},
	_cancel_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Clipping cancelled");
			this._dialog.hide();
		}
		else
		{
			alert("Problem");
		}
	},	
	_cancel:function()
	{
		this.enddate.set("value", new Date());
		var content = this.form.get("value");		
		content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));
		content["startdate"] = ttl.utilities.toJsonDate(this.startdate.get("value"));
		
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._cancel_call_back),
			url:'/iadmin/clippings/cancel_order',
			content: content}));
		
	},	
	_reactivate_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Clipping reactivated");
			this._dialog.hide();
		}
		else
		{
			alert("Problem");
		}
	},	
	_reactivate:function()
	{
		this.enddate.set("value", this.licence_expire);
		var content = this.form.get("value");
		content["enddate"] = ttl.utilities.toJsonDate(this.enddate.get("value"));
		content["startdate"] = ttl.utilities.toJsonDate(this.startdate.get("value"));
		
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._reactivate_call_back),
			url:'/iadmin/clippings/reactivate_order',
			content: content}));
		
	},
	_Client_Add_Call:function(action, data )
	{
		this._change_client_enabled==true
		this.clientid.set("value", data.clientid );
		this.client_add_dialog.hide();
	},
	_New_Client:function()
	{
		this.client_add_ctrl.Load(-1, this._Client_Add_Call_Back);
		this.client_add_dialog.show();
	}
	
});
