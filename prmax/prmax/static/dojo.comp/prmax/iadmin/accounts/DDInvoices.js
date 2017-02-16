//-----------------------------------------------------------------------------
// Name:    DDInvoices.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.DDInvoices");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.DDInvoices",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/DDInvoices.html"),
	constructor: function()
	{
		this._InvoiceCallBack = dojo.hitch(this,this._InvoiceCall);

	},
	_CreateInvoices:function()
	{
		if ( confirm("Create Payment Run"))
		{
			var content = { pay_montly_day: this.pay_montly_day.get("value"),
											take_date: ttl.utilities.toJsonDate ( this.take_date.get("value"))};

			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._InvoiceCallBack),
				url:'/iadmin/payment_dd_invoices',
				content: content }));
		}
		else
		{
			this.invbtn.cancel();
		}
	},
	_InvoiceCall:function(response)
	{

		if ( response.success == "OK" )
		{
			alert("Invoice Run Created");
		}
		else
		{
			alert("Problem creating Invoice Run");
		}

		this.invbtn.cancel();
	},
	_DraftInvoices:function()
	{
		this.tmp_cache.set("value", new Date());
		this.pay_montly_day2.set("value", this.pay_montly_day.get("value"));
		if ( this.take_date.get("value"))
		{
			var d = this.take_date.get("value");
			this.take_date2.set("value", d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate() );
		}
		else
		{
			this.take_date2.set("value", null );
		}
		return true;
	}

});