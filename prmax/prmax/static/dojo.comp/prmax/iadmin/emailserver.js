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
dojo.provide("prmax.iadmin.emailserver");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.emailserver",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin","templates/emailserver.html"),
	constructor: function()
	{
		this._emailservertypes =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=emailservertypes"});
		this._update_call_back = dojo.hitch(this,this._update_call);
	},
	load:function(customer, emailserver)
	{
		this.thirdparty.set("checked", customer.thirdparty);
		this.customerid.set("value", customer.customerid);
		
		if (this.thirdparty.get("checked"))
		{
			dojo.removeClass(this.emailservertypeid.domNode, "prmaxhidden");		
			dojo.removeClass(this.emailservertype_label, "prmaxhidden");
			if (emailserver)
			{
				this.emailservertypeid.set("value", emailserver.emailservertypeid);
				if (this.emailservertypeid.get("value") == 2)
				{
					dojo.removeClass(this.hostname.domNode, "prmaxhidden");		
					dojo.removeClass(this.hostname_label, "prmaxhidden");
					this.hostname.set("value", emailserver.email_host);
				}
				else
				{
					dojo.addClass(this.hostname.domNode, "prmaxhidden");		
					dojo.addClass(this.hostname_label, "prmaxhidden");		
				}
			}
		}
		else
		{
			dojo.addClass(this.emailservertypeid.domNode, "prmaxhidden");		
			dojo.addClass(this.emailservertype_label, "prmaxhidden");
			dojo.addClass(this.hostname.domNode, "prmaxhidden");		
			dojo.addClass(this.hostname_label, "prmaxhidden");					
		}
	},
	postCreate:function()
	{
		this.emailservertypeid.set("store", this._emailservertypes);
		this.emailservertypeid.set("value", 1);
	},
	_change:function()
	{
		if (this.thirdparty.get("checked"))
		{
			dojo.removeClass(this.emailservertypeid.domNode, "prmaxhidden");		
			dojo.removeClass(this.emailservertype_label, "prmaxhidden");		
			if (this.emailservertypeid.get("value") == 2)
			{
				dojo.removeClass(this.hostname.domNode, "prmaxhidden");		
				dojo.removeClass(this.hostname_label, "prmaxhidden");		
			}
			else
			{
				dojo.addClass(this.hostname.domNode, "prmaxhidden");		
				dojo.addClass(this.hostname_label, "prmaxhidden");		
			}			
		}
		else
		{
			dojo.addClass(this.emailservertypeid.domNode, "prmaxhidden");		
			dojo.addClass(this.emailservertype_label, "prmaxhidden");		
			dojo.addClass(this.hostname.domNode, "prmaxhidden");		
			dojo.addClass(this.hostname_label, "prmaxhidden");		
		}
	},
	_set_emailservertype:function()
	{
		if (this.emailservertypeid.get("value") == 2)
		{
			dojo.removeClass(this.hostname.domNode, "prmaxhidden");		
			dojo.removeClass(this.hostname_label, "prmaxhidden");		
		}
		else
		{
			dojo.addClass(this.hostname.domNode, "prmaxhidden");		
			dojo.addClass(this.hostname_label, "prmaxhidden");		
		}
	
	},
	_update:function()
	{
		var content = {};
		content['icustomerid'] = this.customerid;
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._update_call_back,
				url:'/emailserver/update_emailserver',
				content: this.form.get("value")
			}));
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
