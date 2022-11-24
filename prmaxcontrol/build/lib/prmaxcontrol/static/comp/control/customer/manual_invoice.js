//-----------------------------------------------------------------------------
// Name:    manual_invoice.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/manual_invoice.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/number",
	"dojo/io/iframe",
	"dojo/request/iframe",
	"dojox/form/FileInput",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"ttl/DateTextBox2",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/DateTextBox"	
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/manual_invoice",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._add_call_back = lang.hitch ( this , this._add_call );
	},
	_add_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Invoice Added");
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Invoice");
		}
	},
	_send:function()
	{
		if ( this.invoice_ref.isValid() == false ||
				this.invoice_date.isValid() == false ||
			this.amount.isValid() == false ||
			this.vat.isValid() == false ||
			this.unpaidamount.isValid() == false)
		{
			return false ;
		}

		var filename = domattr.get(this.invoice_file,"value").toLowerCase ();
		if ( filename.indexOf(".pdf") == -1)
		{
			alert("This must be a pdf file");
			return false ;
		}

		this.invoice_date2.set("value", this.invoice_date.get("ValueISO"));

		dojo.io.iframe.send(
		{
			url: "/payment/add_manual_invoice",
			handleAs:"json",
				load: this._add_call_back,
				form : this.form
		});
	},
	setCustomer:function( customerid , customername , dialog )
	{
		this.icustomerid.set("value",customerid);
		this.invoice_date.set("value",new Date());
		this.invoice_ref.set("value","");
		this.amount.set("value",0.0);
		this.unpaidamount.set("value",0.0);
		this.vat.set("value",0.0);
		domattr.set(this.invoice_file, "value","");

		domattr.set( this.customername , "innerHTML" , customername ) ;
		this._dialog = dialog;
	},
	_amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.unpaidamount.set("value",amount);
		this.vat.set("value",dojo.number.format(vat, {places:2}))
	}
});
});