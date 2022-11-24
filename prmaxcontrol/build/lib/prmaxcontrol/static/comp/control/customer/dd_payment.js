//-----------------------------------------------------------------------------
// Name:    dd_payment.js
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
	"dojo/text!../customer/templates/dd_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/ComboBox",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/dd_payment",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._payment_taken_call_back = lang.hitch(this,this._payment_taken_call);
		this._daysofmonth =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});

	},
	postCreate:function()
	{
		this.pay_montly_day.store = this._daysofmonth;
		this.sub_start_day.store = this._daysofmonth;
		this.inherited(arguments);
	},
	setCustomer:function( customerid , customername , email , dialog, defaultvalue )
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
		this.first_month_value.set("value",defaultvalue );
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
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		// fix up the date
		var d = this.dd_collectiondate.get("value");
		if ( d != null )
			content["dd_collectiondate"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		content["icustomerid"] = this._customerid;

		request.post("/iadmin/payment_dd_first",
			utilities2.make_params({ content : content})).
			then(this._payment_taken_call_back);
	},
	clear:function()
	{
		this.payment.set("value","");
		this.first_month_value.set("value","");
		this.email.set("value","");
	}
});
});
