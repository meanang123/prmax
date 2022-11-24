//-----------------------------------------------------------------------------
// Name:    send_dd_conf.js
// Author:  
// Purpose:
// Created: Dec 2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/send_dd_conf.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control.customer.send_dd_conf",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._send_dd_conf_call_back = lang.hitch(this,this._send_dd_conf_call);
	},
	set_customer:function( customer, dialog)
	{
		this.btn.cancel();

		this._customerid = customer.customerid;
		this._customername = customer.customername;

		domattr.set( this.customername , "innerHTML" , customer.customername ) ;
		this.email.set("value", customer.email);
		this._dialog = dialog;

	},
	_send_dd_conf_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Confirmation DD Sent");
			this._dialog.hide();
		}
		else
		{
			alert("Problem Sending");
		}
		this.btn.cancel();
	},
	_send_dd_conf:function( )
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["icustomerid"] = this._customerid;

		request.post("/orderconfirmation/send_conf_dd", 
			utilities2.make_params({data: content})).
			then(this._send_dd_conf_call_back)
			
	}
});
});