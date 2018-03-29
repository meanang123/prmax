define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/SetFreeSEOCount.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"dijit/form/SimpleTextarea"],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.SetFreeSEOCount",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);
	},
	Load:function( customerid)
	{
		this.icustomerid.set("value", customerid);

		request.post ('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid:customerid}})).then
			(this._LoadedCallBack);
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this.Clear();
			this.reason.set("value", "");
			this.seonbrincredit.set("value", response.data.cust.seonbrincredit);
			this.dlg.show();
		}
		else
		{
			alert("Problem Loading SEO Value");
		}
	},
	Clear:function()
	{
		this.updBtn.cancel();
		this.reason.set("value, ");
		this.seonbrincredit.set("value", 0);

	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("SEO Free Count Updated");
			this.dlg.hide();
			this.Clear();
		}
		else
		{
			if ( response.message)
				alert( response.message ) ;
			else
				alert("Problem Upating");
		}
		this.updBtn.cancel();
	},
	_Update:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Missing Data");
			this.updBtn.cancel();
			return false;
		}

		request.post ('/customer/customer_seo_qty_update',
			utilities2.make_params({ data : this.form.get("value")})).then
			(this._UpdatedCallBack);
	},
	_Close:function()
	{
		this.dlg.hide();
		this.Clear();
	}
});
});
