//-----------------------------------------------------------------------------
// Name:    extendedsettings.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.extendedsettings");

dojo.declare("prmax.iadmin.extendedsettings",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin","templates/extendedsettings.html"),
	constructor: function()
	{
		this._update_call_back = dojo.hitch(this,this._update_call);
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
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._update_call_back,
				url:'/iadmin/update_extendedsettings',
				content: this.form.get("value")
			}));
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
