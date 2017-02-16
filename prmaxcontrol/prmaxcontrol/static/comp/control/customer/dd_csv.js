//-----------------------------------------------------------------------------
// Name:    dd_cvs.js
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
	"dojo/text!../customer/templates/dd_csv.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/TextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/dd_csv",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	_create_csv:function()
	{

		if ( confirm("Create DD Csv"))
			return true ;

		return false;
	},
	_draft_invoices:function()
	{
		this.tmp_cache.set("value", new Date());
		this.pay_montly_day2.set("value", this.pay_montly_day.get("value"));

		return true;
	},
	_clear_down:function()
	{
		if ( confirm("Reset the Montly Payment Values to the Default Values"))
		{
			request.post("/payment/payment_dd_reset",
				utilities2.make_params({ data : {'pay_montly_day':this.pay_montly_day.get("value")}})).
				then(this._LoadCustomerCall);			
		}
	}
});
});