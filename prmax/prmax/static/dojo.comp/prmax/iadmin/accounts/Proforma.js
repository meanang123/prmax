//-----------------------------------------------------------------------------
// Name:    Proforma.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.Proforma");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.Proforma",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/Proforma.html"),

	constructor: function()
	{
		this._SendProformaCallBack = dojo.hitch ( this , this._SendProformaCall );
	},
	_SendProformaCall:function( response )
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
	_SendProforma:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._SendProformaCallBack),
			url:'/iadmin/profoma_send',
			content:content}));

	},
	setCustomer:function( customerid , customername , email , dialog)
	{
		this._customerid = customerid;
		this._customername = customername;

		dojo.attr ( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
	}
});