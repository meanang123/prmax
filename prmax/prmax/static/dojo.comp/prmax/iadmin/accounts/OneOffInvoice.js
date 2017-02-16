//-----------------------------------------------------------------------------
// Name:    ManualInvoice.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//--------------------------------------------------------------g---------------
dojo.provide("prmax.iadmin.accounts.OneOffInvoice");

dojo.require("ttl.BaseWidget");
dojo.require("dojo.io.iframe");
dojo.require("dojox.form.FileInput");
dojo.require("ttl.DateTextBox");
dojo.require("dojo.number");

dojo.declare("prmax.iadmin.accounts.OneOffInvoice",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/OneOffInvoice.html"),
	constructor: function()
	{
		this._SendInvoiceCallBack = dojo.hitch ( this , this._SendInvoiceCall );
	},
	_SendInvoiceCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Invoice Added");
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Invoice");
		}
			this.btn.cancel();
	},
	_Send:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["invoice_date"] = ttl.utilities.toJsonDate ( this.invoice_date.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SendInvoiceCallBack,
			url:'/iadmin/invoice_one_off_send',
			content:content}));
	},
	setCustomer:function( cust , dialog )
	{
		this.icustomerid.set("value",cust.customerid);
		this.invoice_date.set("value",new Date());
		this.amount.set("value",0.01);
		this.vat.set("value",0.0);

		dojo.attr ( this.customername , "innerHTML" , cust.customername ) ;
		this._dialog = dialog;
		this.btn.cancel();
	},
	_Amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.vat.set("value",dojo.number.format (vat, {places:2}))
	}
});