define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/details.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("control.customer.details",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._countries = new ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this._save_call_back = lang.hitch(this, this._save_call);
	},
	postCreate:function()
	{
		this.countryid.set("store",this._countries);

		this.inherited(arguments);
	},
	load:function(customer)
	{
		this.icustomerid.set("value",customer.cust.customerid);
		this.customername.set("value", customer.cust.customername);
		this.contact_title.set("value", customer.cust.contact_title);
		this.contact_firstname.set("value", customer.cust.contact_firstname);
		this.contact_surname.set("value", customer.cust.contact_surname);
		this.individual.set("checked",customer.cust.individual);
		this.contactjobtitle.set("value", customer.cust.contactjobtitle);
		this.address1.set("value", customer.address.address1);
		this.address2.set("value", customer.address.address2);
		this.townname.set("value", customer.address.townname);
		this.county.set("value", customer.address.county);
		this.postcode.set("value", customer.address.postcode);
		this.email.set("value", customer.cust.email);
		this.tel.set("value", customer.cust.tel);
		this.countryid.set("value", customer.cust.countryid );
		this.vatnumber.set("value", customer.cust.vatnumber );
		this.savebtn.cancel();

	},
	_customer_save:function()
	{
		if (utilities2.form_validator(this.customer_form) == false)
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		request.post("c/update_customer",
			utilities2.make_params({ data : this.customer_form.get("value")})).
			then(this._save_call_back);
	},
	_save_call:function(response)
	{
		if (response.success=="OK")
		{
			topic.publish("/customer/p_upd", response.data);
			alert("Customer Details Updated");
		}

		this.savebtn.cancel();
	}
});
});
