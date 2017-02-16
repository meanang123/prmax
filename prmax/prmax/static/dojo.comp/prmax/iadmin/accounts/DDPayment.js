//-----------------------------------------------------------------------------
// Name:    DDPayment.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.DDPayment");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.DDPayment",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/DDPayment.html"),
	constructor: function()
	{
		this._PaymentTakenCallBack = dojo.hitch(this,this._PaymentTakenCall);
		this._daysofmonth =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});

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

		dojo.attr ( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
		this.first_month_value.set("value",defaultvalue );
	},
	_PaymentTakenCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Payment Taken and invoice sent");
			this.Clear();
			dojo.publish(PRCOMMON.Events.Monthly_Payments, [ response.data] ) ;
			this._dialog.hide();
		}
		else
		{
			alert("Problem taking payment");
		}
	},
	_TakePayment:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
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

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._PaymentTakenCallBack),
			url:'/iadmin/payment_dd_first',
			content:content}));

	},
	Clear:function()
	{
		this.payment.set("value","");
		this.first_month_value.set("value","");
		this.email.set("value","");
	}
});