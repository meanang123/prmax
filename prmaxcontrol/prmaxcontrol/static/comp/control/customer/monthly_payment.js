//-----------------------------------------------------------------------------
// Name:    monthly_payment.js
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
	"dojo/text!../customer/templates/monthly_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/CurrencyTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/monthly_payment",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._payment_taken_call_back = lang.hitch(this,this._payment_taken_call);
		this._months = new ItemFileReadStore ( { url:"/common/lookups?searchtype=months"});
		this._years = new ItemFileReadStore ( { url:"/common/lookups?searchtype=years"});
	},
	setCustomer:function( customerid , customername , email , dialog, defaultvalue )
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
	},
	_payment_taken_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Payment Taken and invoice sent");
			this.clear();
			topic.publish(PRCOMMON.Events.Monthly_Payments, [ response.data] ) ;
			this._dialog.hide();
		}
		else
		{
			alert("Problem taking payment");
		}
	},
	_take_payment:function()
	{
		if (utilities2.form_validator( this.form ) == false)
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		// fix up the date
		var d = this.payment_date.get("value");
		if ( d != null )
			content["payment_date"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		content["icustomerid"] = this._customerid;
			
		request.post("/payment/payment_monthly_take",
			utilities2.make_params({ data : content})).
			then(this._payment_taken_call_back);				

	},
	clear:function()
	{
		this.payment.set("value","");
		this.email.set("value","");
	},
	postCreate:function()
	{
		this.monthid.set("store", this._months);
		this.yearid.set("store", this._years);
		var date = new Date();
		var year = date.getFullYear() ;
		var month  = date.getMonth() + 1;

		this.monthid.set("value", month) ;
		this.yearid.set("value", year) ;

		this.inherited(arguments);
	}
});
});

