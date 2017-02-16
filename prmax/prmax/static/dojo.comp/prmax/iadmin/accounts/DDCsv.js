//-----------------------------------------------------------------------------
// Name:    DDCsv.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.DDCsv");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.DDCsv",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/DDCsv.html"),
	_CreateCsv:function()
	{

		if ( confirm("Create DD Csv"))
			return true ;

		return false;
	},
	_DraftInvoices:function()
	{
		this.tmp_cache.set("value", new Date());
		this.pay_montly_day2.set("value", this.pay_montly_day.get("value"));

		return true;
	},
	_ClearDown:function()
	{
		if ( confirm("Reset the Montly Payment Values to the Default Values"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadCustomerCall,
				url:'/iadmin/payment_dd_reset',
				content:{'pay_montly_day':this.pay_montly_day.get("value")}
			}));
		}
	}
});