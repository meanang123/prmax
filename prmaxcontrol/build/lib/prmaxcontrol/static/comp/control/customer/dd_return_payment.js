//-----------------------------------------------------------------------------
// Name:    dd_return_payment.js
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
	"dojo/text!../customer/templates/dd_return_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/TextBox",
	"dojox/form/BusyButton",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/dd_return_payment",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._failed_call_back = lang.hitch(this, this._failed_call);
		this.paymentreturnreasons = new ItemFileReadStore (
				{url:'/common/lookups?searchtype=paymentreturnreasons',
				onError:utilities2.globalerrorchecker,
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
	_clear:function()
	{
		this.icustomerid.set("value",null);
		this.reason.set("value","");
		this.okbtn.cancel();

	},
	_failed_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("DD cancelled");
			this._clear();
			this._dialog.hide();
		}
		else
		{
			alert("Problem Failing Last DD");
		}
		this.okbtn.cancel();
	},
	_cancel_payment:function()
	{
		if ( confirm("Fail Last DD Payment"))
		{
			var content = this.form.get("value");

			request.post("/payment/payment_dd_failed",
				utilities2.make_params({ data : content})).
				then(this._failed_call_back);				
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

		domattr.set( this.customername , "innerHTML" , customername ) ;
		this._dialog = dialog;
	}
});
});