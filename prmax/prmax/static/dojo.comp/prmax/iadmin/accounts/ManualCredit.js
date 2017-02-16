//-----------------------------------------------------------------------------
// Name:    ManualInvoice.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.ManualCredit");

dojo.require("ttl.BaseWidget");
dojo.require("dojo.io.iframe");
dojo.require("dojox.form.FileInput");
dojo.require("ttl.DateTextBox");
dojo.require("dojo.number");

dojo.declare("prmax.iadmin.accounts.ManualCredit",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/ManualCredit.html"),
	constructor: function()
	{
		this._AddCallBack = dojo.hitch ( this , this._AddCall );
	},
	_AddCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Credit Added");
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Credit");
		}
	},
	_Send:function()
	{
		if ( this.ref.isValid() == false ||
				this.credit_date.isValid() == false ||
			this.amount.isValid() == false ||
			this.unpaidamount.isValid() == false)
		{
			return false ;
		}

		var filename = dojo.attr(this.credit_file,"value").toLowerCase ();
		if ( filename.indexOf(".pdf") == -1)
		{
			alert("This must be a pdf file");
			return false ;
		}

		this.invoice_date2.set("value", this.credit_date.get("ValueISO"));

		dojo.io.iframe.send(
		{
			url: "/iadmin/add_manual_credit",
			handleAs:"json",
				load: this._AddCallBack,
				form : this.form
		});
	},
	setCustomer:function( cust , dialog )
	{
		this.icustomerid.set("value",cust.customerid);
		this.credit_date.set("value",new Date());
		this.ref.set("value","");
		this.amount.set("value",0.0);
		this.vat.set("value",0.0);
		this.unpaidamount.set("value",0.0);
		dojo.attr(this.credit_file, "value","");

		dojo.attr ( this.customername , "innerHTML" , cust.customername ) ;
		this._dialog = dialog;
	},
	_Amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.unpaidamount.set("value",amount);
		this.vat.set("value",dojo.number.format (vat, {places:2}))
	}
});