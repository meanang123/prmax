//-----------------------------------------------------------------------------
// Name:    one_off_invoice.js
// Author:  
// Purpose:
// Created: Dec 2016
//
// To do:
//
//--------------------------------------------------------------g---------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/one_off_invoice.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"ttl/DateTextBox2",
	"dijit/form/Textarea",
	"dijit/form/CurrencyTextBox",
	"dojox/form/BusyButton",
	"dijit/form/ValidationTextBox",
	"dojo/io/iframe",
	"dojox/form/FileInput",
	"dojo/number"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control.customer.one_off_invoice",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._SendInvoiceCallBack = lang.hitch ( this , this._SendInvoiceCall );
	},
	_SendInvoiceCall:function( response )
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
			this.btn.cancel();
	},
	_Send:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["invoice_date"] = utilities2.to_json_date ( this.invoice_date.get("value"));

		request.post('/payment/invoice_one_off_send',
			utilities2.make_params({data: content})).
			then(this._SendInvoiceCallBack);
	},
	setCustomer:function( cust , dialog )
	{
		this.icustomerid.set("value",cust.customerid);
		this.invoice_date.set("value",new Date());
		this.amount.set("value",0.01);
		this.vat.set("value",0.0);

		domattr.set ( this.customername , "innerHTML" , cust.customername ) ;
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
});