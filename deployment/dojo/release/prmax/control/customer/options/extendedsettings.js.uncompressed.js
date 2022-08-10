require({cache:{
'url:control/customer/options/templates/extendedsettings.html':"<div class=\"common_prmax_layout\">\r\n<br/>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"common_prmax_layout\"'>\r\n\t\t<input data-dojo-attach-point=\"customerid\" data-dojo-props='name:\"icustomerid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"search_show_job_roles\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"search_show_job_roles\",type:\"checkbox\"'/> Job Title Search</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"search_show_coverage\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"search_show_coverage\",type:\"checkbox\"'/> Coverage Search</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"search_show_profile\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"search_show_profile\",type:\"checkbox\"'/> Profile Search</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"search_show_smart\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"search_show_smart\",type:\"checkbox\"'/> Smart Search</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"view_outlet_results_colours\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"view_outlet_results_colours\",type:\"checkbox\"'/> Outlet Results Colours </label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"no_distribution\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"no_distribution\",type:\"checkbox\"'/> No Distribution </label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"distributionistemplated\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"distributionistemplated\",type:\"checkbox\"'/> Distribution is Templated</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"no_export\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"no_export\",type:\"checkbox\"'/> No Export (Excel)</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"has_clickthrought\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"has_clickthrought\",type:\"checkbox\"'/> Click Through Release</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"cla\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"cla\",type:\"checkbox\",value:\"2\"'/> CLA Licence</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"nla\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"nla\",type:\"checkbox\",value:\"3\"'/> NLA Licence</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"extended_security\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"extended_security\",type:\"checkbox\"'/> Extended Security</label><br/>\r\n\t\t<label class=\"label_3\"><input data-dojo-attach-point=\"required_client\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"required_client\",type:\"checkbox\"'/> Required Client</label><br/><br/><br/>\r\n\t\t<br/><br/>\r\n\t\t<label class=\"label_2\">IP Restrictions</label><input data-dojo-props='type:\"text\",name:\"valid_ips\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"valid_ips\" ><br/>\r\n\t\t<br/><br/>\r\n\t\t<button data-dojo-attach-event=\"onClick:_update\" data-dojo-attach-point=\"updatebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Updating ...\",label:\"Update\",'></button><br/><br/>\r\n\t</form>\r\n</div>\r\n"}});
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
define("control/customer/options/extendedsettings", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/extendedsettings.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.extendedsettings",
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