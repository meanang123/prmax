//-----------------------------------------------------------------------------
// Name:    extendedsettings.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("control/customer/extendedsettings", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../admin/templates/extendedsettings.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.admin.extendedsettings",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this,this._update_call);
	},
	load:function(customer, customermediaaccesstypes)
	{
		this.search_show_job_roles.set("checked", customer.search_show_job_roles);
		this.search_show_coverage.set("checked", customer.search_show_coverage);
		this.search_show_profile.set("checked", customer.search_show_profile);
		this.search_show_smart.set("checked", customer.search_show_smart);
		this.view_outlet_results_colours.set("checked", customer.view_outlet_results_colours);
		this.no_distribution.set("checked", customer.no_distribution);
		this.no_export.set("checked", customer.no_export);
		this.has_clickthrought.set("checked", customer.has_clickthrought);
		this.customerid.set("value", customer.customerid);
		this.distributionistemplated.set("checked", customer.distributionistemplated);
		this.cla.set("checked", false);
		this.nla.set("checked", false);
		this.extended_security.set("checked", customer.extended_security);
		this.required_client.set("checked", customer.required_client);
		this.valid_ips.set("value", customer.valid_ips);
		if (customermediaaccesstypes != null && customermediaaccesstypes.length > 0)
		{
			for (var i = 0; i < customermediaaccesstypes.length; i++) {
				if (customermediaaccesstypes[i] == 2) //CLA
				{
					this.cla.set("checked", true);
				}
				if (customermediaaccesstypes[i] == 3)//NLA
				{
					this.nla.set("checked", true);
				}
			}
		}
	},
	_update:function()
	{
		var content = this.form.get("value");
		request.post ('/extendedsettings/update_extendedsettings',
			utilities2.make_params({ data : content})).
			then ( this._update_call_back);	

	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("extended_settings",[response.data]);
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