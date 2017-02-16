//-----------------------------------------------------------------------------
// Name:    Credit.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/04/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.Credit");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("prmax.iadmin.accounts.Allocation");
dojo.require("dojox.validate.regexp");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.Credit",
	[ ttl.BaseWidget, prmax.iadmin.accounts.Allocation ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/credit.html"),
	constructor: function()
	{
		this._credit_call_back = dojo.hitch(this,this._credit_call);
	},
	setCustomer:function( cust , dialog)
	{
		this._customerid = cust.customerid;
		this._customername = cust.customername;

		this.email.set("value",cust.invoiceemail? cust.invoiceemail:cust.email);
		dojo.attr ( this.customername , "innerHTML" , this._customername ) ;
		this._dialog = dialog;

		this.alloc_grid.resize( {w:590, h:300} );
		this.alloc_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache({ icustomerid:cust.customerid,
			source:"payment"})));
		this.addbtn.cancel();
	},
	_credit_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Credit Added");
			this.Clear();
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem adding credit");
		}
		this.addbtn.cancel();
	},
	_create:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		if ( this.toallocate.get("value") > this.payment.get("value"))
		{
			alert("Over Allocation");
			this.addbtn.cancel();
			return ;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		content["payment_date"] = ttl.utilities.toJsonDate ( this.payment_date.get("value") ) ;
		content["unpaidamount"] = this.toallocate.get("value");
		content['allocations'] = this.getAllocations();

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._credit_call_back,
			url:'/iadmin/credit_take',
			content:content}));
	},
	_on_amount:function()
	{

		var cost = this.cost.get("value");
		var vat = cost *.2;

		this.vat.set("value",dojo.number.format (vat, {places:2}));
		this.payment.set("value",dojo.number.format (cost + vat, {places:2}));

		this._doallocation();
	},
	Clear:function()
	{
		this.payment.set("value","0");
		this.vat.set("value",0);
		this.cost.set("value","0");

		this.message.set("value","");

		this.addbtn.cancel();
	},
	postCreate:function()
	{
		this._postCreate();
		this.inherited(arguments);
	},
	_email_required:function()
	{
		this.email.set("required",this.emailtocustomer.get("checked"));
	},
	_on_vat_amount:function()
	{
		var cost = this.cost.get("value");
		var vat = this.vat.get("value");

		this.payment.set("value",dojo.number.format (cost + vat, {places:2}));

		this._doallocation();

	}
});
