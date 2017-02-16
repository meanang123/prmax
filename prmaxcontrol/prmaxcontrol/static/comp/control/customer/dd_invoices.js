//-----------------------------------------------------------------------------
// Name:    dd_invoices.js
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
	"dojo/text!../customer/templates/dd_invoices.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/ComboBox",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/dd_invoices",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._invoice_call_back = lang.hitch(this,this._invoice_call);

	},
	_create_invoices:function()
	{
		if ( confirm("Create Payment Run"))
		{
			var content = { pay_montly_day: this.pay_montly_day.get("value"),
											take_date: utilities2.to_json_date( this.take_date.get("value"))};

			request.post("/payment/payment_dd_invoices",
				utilities2.make_params({ data : content})).
				then(this._invoice_call_back);				
		}
		else
		{
			this.invbtn.cancel();
		}
	},
	_invoice_call:function(response)
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
	_draft_invoices:function()
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
});
	