require({cache:{
'url:control/customer/templates/partner_options.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-attach-point=\"view_demo_to_live\" class=\"common_prmax_layout prmaxhidden\" style=\"width:450px\">\r\n\t\t\t<h1>Demo to Live</h1>\r\n\t\t\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"demo_to_live_form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t<input data-dojo-attach-point=\"demo_to_live_customerid\" name=\"icustomerid\" type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Start Date</label><input data-dojo-props='type:\"text\",name:\"startdate\",required:true,style:\"width:8em\"' data-dojo-attach-point=\"startdate\" data-dojo-type=\"dijit/form/DateTextBox\" ><br/>\r\n\t\t\t\t<label class=\"label_size_1 label_tag label_align_r\">End Date</label><input data-dojo-props='type:\"text\",name:\"enddate\",required:true,style:\"width:8em\"' data-dojo-attach-point=\"enddate\" data-dojo-type=\"dijit/form/DateTextBox\" ><br/>\r\n\t\t\t\t<button data-dojo-attach-point=\"demo_to_live_btn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_demo_to_live\" class=\"btnright\" style=\"float:right\" data-dojo-props='busyLabel:\"Please Wait Updating...\",label:\"Demo Account to Live\"'></button>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"view_extended_licence\" class=\"common_prmax_layout prmaxhidden\" style=\"width:450px\">\r\n\t\t\t<h1>Extended Licence</h1>\r\n\t\t\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"extended_licence_form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t<input data-dojo-attach-point=\"extended_licence_customerid\" name=\"icustomerid\" type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<label class=\"label_size_2 label_tag label_align_r\">Nbr Logins</label><input data-dojo-type=\"dijit/form/NumberTextBox\" type=\"text\" name=\"maxnbrofusersaccounts\" required=\"true\" value=\"3\" data-dojo-props=\"constraints:{min:1,max:11,places:0},invalidMessage:'Please enter a numeric value.',rangeMessage:'Invalid elevation.',style:'width:2em'\" data-dojo-attach-point=\"extended_licence_maxnbrofusersaccounts\"/><br/>\r\n\t\t\t\t<label class=\"label_size_2 label_tag label_align_r\">Concurrent Users</label><input data-dojo-type=\"dijit/form/NumberTextBox\" type=\"text\" name=\"logins\" required=\"true\" value=\"1\" data-dojo-props=\"constraints:{min:1,max:5,places:0},invalidMessage:'Please enter a numeric value.',rangeMessage:'Invalid elevation.',style:'width:2em'\" data-dojo-attach-point=\"extended_licence_logins\"/><br/>\r\n\t\t\t\t<label class=\"label_size_2 label_tag label_align_r\">Features</label><input data-dojo-attach-point=\"extended_licence_advancefeatures\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"advancefeatures\",value:\"1\"'/></br>\r\n\t\t\t\t<label class=\"label_size_2 label_tag label_align_r\">End Date</label><input data-dojo-props='type:\"text\",name:\"enddate\",required:true,style:\"width:8em\"' data-dojo-attach-point=\"extended_licence_enddate\" data-dojo-type=\"dijit/form/DateTextBox\" ><br/>\r\n\t\t\t\t<button data-dojo-attach-point=\"extended_licence_btn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_extended_licence\" class=\"btnright\" style=\"float:right\" data-dojo-props='busyLabel:\"Please Wait Updating...\",label:\"Extended Licence\"'></button>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
define("control/customer/partner_options", [
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
