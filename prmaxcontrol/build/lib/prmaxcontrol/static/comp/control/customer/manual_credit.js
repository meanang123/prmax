//-----------------------------------------------------------------------------
// Name:    manual_credit.js
// Author:  
// Purpose:
// Created: 23/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/manual_credit.html",
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
	"dojox/form/FileInput",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/DateTextBox",
	"ttl/DateTextBox2"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/manual_credit",
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
			alert("Credit Added");
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Credit");
		}
	},
	_send:function()
	{
		if ( this.ref.isValid() == false ||
				this.credit_date.isValid() == false ||
			this.amount.isValid() == false ||
			this.unpaidamount.isValid() == false)
		{
			return false ;
		}

		var filename = domattr.get(this.credit_file,"value").toLowerCase ();
		if ( filename.indexOf(".pdf") == -1)
		{
			alert("This must be a pdf file");
			return false ;
		}

		this.invoice_date2.set("value", this.credit_date.get("ValueISO"));

		dojo.io.iframe.send(
		{
			url: "/payment/add_manual_credit",
			handleAs:"json",
				load: this._add_call_back,
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
		domattr.set(this.credit_file, "value","");

		domattr.set(this.customername , "innerHTML" , cust.customername ) ;
		this._dialog = dialog;
	},
	_amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.unpaidamount.set("value",amount);
		this.vat.set("value",dojo.number.format (vat, {places:2}))
	}
});
});