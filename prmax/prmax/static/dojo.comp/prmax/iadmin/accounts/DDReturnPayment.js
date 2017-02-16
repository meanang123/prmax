//-----------------------------------------------------------------------------
// Name:    DDReturnPayment.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.DDReturnPayment");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.DDReturnPayment",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/DDReturnPayment.html"),
	constructor: function()
	{
		this._FailedCallBack = dojo.hitch(this, this._FailedCall);
		this.paymentreturnreasons = new dojo.data.ItemFileReadStore (
				{url:'/common/lookups?searchtype=paymentreturnreasons',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.paymentreturnreasonid.store = this.paymentreturnreasons;
		this.paymentreturnreasonid.set("value",1);

		this.inherited(arguments);
	},
	_Clear:function()
	{
		this.icustomerid.set("value",null);
		this.reason.set("value","");
		this.okbtn.cancel();

	},
	_FailedCall:function( response )
	{
		if ( response.success == "OK")
		{
			alert("DD cancelled");
			this._Clear();
			this._dialog.hide();
		}
		else
		{
			alert("Problem Failing Last DD");
		}
		this.okbtn.cancel();
	},
	_CancelPayment:function()
	{
		if ( confirm("Fail Last DD Payment"))
		{
			var content = this.form.get("value");
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._FailedCallBack),
				url:'/iadmin/payment_dd_failed',
				content:content}));
		}
		else
		{
			this.okbtn.cancel();
		}
	},
	setCustomer:function( customerid , customername , email , dialog)
	{
		this.okbtn.cancel();
		this.icustomerid.set("value", customerid ) ;
		this._email = email;

		dojo.attr ( this.customername , "innerHTML" , customername ) ;
		this._dialog = dialog;
	}
});