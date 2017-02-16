//-----------------------------------------------------------------------------
// Name:    SendDDConf.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.SendDDConf");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.SendDDConf",
	[ ttl.BaseWidget],{
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/sendddconf.html"),
	constructor: function()
	{
		this._send_dd_conf_call_back = dojo.hitch(this,this._send_dd_conf_call);
	},
	set_customer:function( customer, dialog)
	{
		this.btn.cancel();

		this._customerid = customer.customerid;
		this._customername = customer.customername;

		dojo.attr ( this.customername , "innerHTML" , customer.customername ) ;
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
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._send_dd_conf_call_back,
			url:'/iadmin/send_conf_dd',
			content:content}));
	}
});