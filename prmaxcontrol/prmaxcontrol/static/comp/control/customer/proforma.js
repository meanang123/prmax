//-----------------------------------------------------------------------------
// Name:    proforma.js
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
	"dojo/text!../customer/templates/proforma.html",
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
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/proforma",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._send_proforma_call_back = lang.hitch ( this , this._send_proforma_call );
	},
	_send_proforma_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Proforma Sent ");
			this._dialog.hide();
		}
		else
		{
			alert("Problem Sending Proforma");
		}
	},
	_send_proforma:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;

		request.post("/orderconfirmation/proforma_send",
			utilities2.make_params({ data : content})).
			then(this._send_proforma_call_back);				
	},
	setCustomer:function( customerid , customername , email , dialog)
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
	}
});
});

