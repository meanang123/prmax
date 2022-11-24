define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/ReActivateDemo.html",
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

return declare("control.customer.options.ReActivateDemo",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._UpdatedCallBack = lang.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = lang.hitch(this, this._LoadedCall);
		this._userfilter = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales"});
	},
	postCreate:function()
	{
		this.assigntoid.set("store", this._userfilter ) ;
	},
	Load:function( customerid, dialog )
	{
		this.updBtn.set("disabled", true ) ;
		this.icustomerid.set("value", customerid);
		this._dialog = dialog;
		
		request.post ('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid : customerid }})).then
			(this._LoadedCallBack);
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			var td = new Date();
			var t = new Date(td.getTime()  + 4*24*60*60*1000);
			this.licence_expire.set("value", t);
			this.email.set("value", response.data.cust.email ) ;
			this.displayname.set("value", response.data.cust.displayname );
			this.sendemail.set("checked", true ) ;
			this.updBtn.set("disabled", false ) ;
			this._dialog.show();
			this.updBtn.cancel();
		}
		else
		{
			alert("Problem Loading Expire Details");
		}
	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			if (this ._dialog)
				this._dialog.hide();
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

		var content = this.form.get("value");
		content["licence_expire"] = utilities2.to_json_date ( this.licence_expire.get("value"));

		request.post ('/customer/get_internal',
			utilities2.make_params({ data : content})).then
			(this._UpdatedCallBack);
	}
});
});
