//-----------------------------------------------------------------------------
// Name:    emailserver.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/emailserver.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dojox/form/PasswordValidator"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.emailserver",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._emailservertypes =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=emailservertypes"});
		this._update_call_back = lang.hitch(this,this._update_call);
	},
	load:function(customer, emailserver)
	{
		this.thirdparty.set("checked", customer.thirdparty);
		this.customerid.set("value", customer.customerid);
		this.email_password.set("value","");

		if ( emailserver)
		{
			this.emailservertypeid.set("value", emailserver.emailservertypeid);
			this.hostname.set("value", emailserver.email_host);
			this.email_username.set("value", emailserver.email_username);

		}
		else
		{
			this.emailservertypeid.set("value", 1);
			this.hostname.set("value", "");
			this.email_username.set("value", "");
			this.email_password.set("value", "");
		}


		this._set_options_display();

	},
	postCreate:function()
	{
		this.emailservertypeid.set("store", this._emailservertypes);
		this.emailservertypeid.set("value", 1);
	},
	_change:function()
	{
		this._set_options_display();
	},
	_set_options_display:function()
	{
		if (this.thirdparty.get("checked"))
		{
			domclass.remove(this.emailservertypeid.domNode, "prmaxhidden");
			domclass.remove(this.emailservertype_label, "prmaxhidden");
			switch (this.emailservertypeid.get("value") )
			{
			case "2":
				domclass.remove(this.hostname.domNode, "prmaxhidden");
				domclass.remove(this.hostname_label, "prmaxhidden");
				this.email_username.set("required",false);
				domclass.add(this.email_username.domNode,"prmaxhidden");
				break;
			case "3":
				domclass.add(this.hostname.domNode, "prmaxhidden");
				domclass.add(this.hostname_label, "prmaxhidden");
				domclass.remove(this.user_name_label,"prmaxhidden");
				domclass.remove(this.email_username.domNode,"prmaxhidden");
				domclass.remove(this.email_password.domNode,"prmaxhidden");
				this.email_username.set("required",true);
			break;
			default:
				this.email_username.set("required",false);
				domclass.add(this.email_username.domNode,"prmaxhidden");
				domclass.add(this.user_name_label,"prmaxhidden");
				domclass.add(this.email_password.domNode,"prmaxhidden")
				domclass.add(this.hostname.domNode, "prmaxhidden");
				domclass.add(this.hostname_label, "prmaxhidden");
				break;
			}
		}
		else
		{
			domclass.add(this.emailservertypeid.domNode, "prmaxhidden");
			domclass.add(this.emailservertype_label, "prmaxhidden");
			domclass.add(this.hostname.domNode, "prmaxhidden");
			domclass.add(this.hostname_label, "prmaxhidden");
			domclass.add(this.user_name_label,"prmaxhidden");
			this.email_username.set("required",false);
			domclass.add(this.email_username.domNode,"prmaxhidden");
			domclass.add(this.email_password.domNode,"prmaxhidden")
		}

	},
	_set_emailservertype:function()
	{
		this._set_options_display();
	},
	_update:function()
	{
		var content = this.form.get("value");
		content['icustomerid'] = this.customerid.value;

		request.post ('/emailserver/update_emailserver',
			utilities2.make_params({ data : content})).
			then ( this._update_call_back);

	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
//			dojo.publish("extended_settings",[response.data]);
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}

		this.updatebtn.cancel();
	}
});
});
