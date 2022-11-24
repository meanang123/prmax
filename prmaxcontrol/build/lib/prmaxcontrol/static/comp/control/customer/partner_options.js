define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/partner_options.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dijit/form/DateTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Form",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass){

 return declare("control.customer.partner_options",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._save_call_back = lang.hitch(this, this._save_call);
		this._extended_licence_call_back = lang.hitch(this, this._extended_licence_call);
	},
	load:function(customer)
	{
		this.startdate.set("value",utilities2.from_object_date_no_date(customer.cust.licence_start_date_d));
		this.enddate.set("value",utilities2.from_object_date_no_date(customer.cust.licence_expire));
		this.demo_to_live_customerid.set("value",customer.cust.customerid);

		this.extended_licence_enddate.set("value",utilities2.from_object_date_no_date(customer.cust.licence_expire));
		this.extended_licence_customerid.set("value",customer.cust.customerid);
		this.extended_licence_advancefeatures.set("checked", customer.cust.advancefeatures);
		this.extended_licence_maxnbrofusersaccounts.set("value", customer.cust.maxnbrofusersaccounts);
		this.extended_licence_logins.set("value", customer.cust.logins);

		this._show_hide_options(customer.cust.isdemo);

	},
	_show_hide_options:function(isdemo)
	{
		if ( isdemo == true )
		{
			domclass.remove(this.view_demo_to_live,"prmaxhidden");
			domclass.add(this.view_extended_licence,"prmaxhidden");
		}
		else
		{
			domclass.add(this.view_demo_to_live,"prmaxhidden");
			domclass.remove(this.view_extended_licence,"prmaxhidden");
		}
	},
	_demo_to_live:function()
	{
		if ( utilities2.form_validator(this.demo_to_live_form)==false)
		{
			alert("Not all required fields filled in");
			this.demo_to_live_btn.cancel();
			return;
		}

		if (confirm("Convert Demo to Live Account"))
		{
			var content = this.demo_to_live_form.get("value");

			content["enddate"] = utilities2.to_json_date(this.enddate.get("value"));
			content["startdate"] = utilities2.to_json_date(this.startdate.get("value"));

			request.post('/customer/partner_demo_to_live',
					utilities2.make_params({data:content})).then
					(this._save_call_back);
		}
		else
		{
			this.demo_to_live_btn.cancel();
		}
	},
	_save_call:function(response)
	{
		if (response.success == "OK")
		{
			topic.publish("/customer/p_upd", response.data);
			this._show_hide_options(false);
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
		this.demo_to_live_btn.cancel();
	},
	_extended_licence:function()
	{
	if ( utilities2.form_validator(this.extended_licence_form)==false)
		{
			alert("Not all required fields filled in");
			this.extended_licence_btn.cancel();
			return;
		}

		if (confirm("Extend Live Account"))
		{
			var content = this.extended_licence_form.get("value");

			content["enddate"] = utilities2.to_json_date(this.extended_licence_enddate.get("value"));

			request.post('/customer/partner_extend_live',
					utilities2.make_params({data:content})).then
					(this._extended_licence_call_back);
		}
		else
		{
			this.extended_licence_btn.cancel();
		}
	},
	_extended_licence_call:function(response)
	{
		if (response.success == "OK")
		{
			topic.publish("/customer/p_upd", response.data);
			alert("Extended");
		}
		else
		{
			alert("Problem");
		}
		this.extended_licence_btn.cancel();
	}
});
});
