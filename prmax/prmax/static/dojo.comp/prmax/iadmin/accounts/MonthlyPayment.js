//-----------------------------------------------------------------------------
// Name:    MonthlyPayment.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prmax.iadmin.accounts.MonthlyPayment");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.MonthlyPayment",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/MonthlyPayment.html"),
	constructor: function()
	{
		this._PaymentTakenCallBack = dojo.hitch(this,this._PaymentTakenCall);
		this._months = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=months"});
		this._years = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=years"});
	},
	setCustomer:function( customerid , customername , email , dialog, defaultvalue )
	{
		this._customerid = customerid;
		this._customername = customername;

		dojo.attr ( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
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
		var d = this.payment_date.get("value");
		if ( d != null )
			content["payment_date"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._PaymentTakenCallBack),
			url:'/iadmin/payment_monthly_take',
			content:content}));

	},
	Clear:function()
	{
		this.payment.set("value","");
		this.email.set("value","");
	},
	postCreate:function()
	{
		this.monthid.store = this._months;
		this.yearid.store = this._years;
		var date = new Date();
		var year = date.getFullYear() ;
		var month  = date.getMonth() + 1;

		this.monthid.set("value", month) ;
		this.yearid.set("value", year) ;

		this.inherited(arguments);
	}
});
