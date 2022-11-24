define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/partner_add.html",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/ValidationTextBox",
	"dojox/form/PasswordValidator",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dojox/validate/regexp",
	"dojox/form/BusyButton",
	"dijit/form/Textarea",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("controls.customer.partner_add",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this.countries = new ItemFileReadStore ({url:"/common/lookups?searchtype=countries"});
	 this._save_call_back = lang.hitch(this, this._save_call);
	},
	postCreate:function()
	{
		this.countryid.set("store",this.countries);
		this.countryid.set("value",1);
		this._setup_dates();

	},
	_setup_dates:function()
	{
	 this.startdate.set("value", new Date());

	 var tmp = new Date();
	 tmp.setFullYear(new Date().getFullYear() + 1);
	 this.enddate.set("value", tmp );

	},
	_show_vat:function()
	{

	},
	_customer_save:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if (confirm("Add Account"))
		{
			var content = this.form.get("value");

			content["enddate"] = utilities2.to_json_date(this.enddate.get("value"));
			content["startdate"] = utilities2.to_json_date(this.startdate.get("value"));

			request.post('/customer/add_partner_customer',
					utilities2.make_params({data:content})).then
					(this._save_call_back);
		}
	},
	_save_call:function(response)
	{
		if (response.success == "OK")
		{
			topic.publish("/customer/p_add", response.data);
			this._clear();
		}
		else if (response.success=="DU")
		{
			alert(response.message);
		}

		this.save_node.cancel();
	},
	_clear:function()
	{
		this.countryid.set("value",1);
		this.isdemo.set("checked",false);
		this._setup_dates();
	},
	_demo_active:function(isChecked)
	{
		var tmp = new Date();

		if ( isChecked == true)
		{
			tmp.setDate(tmp.getDate() + 7);
			this.enddate.constraints.max = tmp ;
		}
		else
		{
			tmp.setFullYear(new Date().getFullYear() + 1);
			delete this.enddate.constraints.max;
		}
		this.enddate.set("value", tmp );
	}
});
});
