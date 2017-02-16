define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/user_add.html",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, ContentPane,request,utilities2,lang,topic,domclass){

 return declare("controls.customer.user_add",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this._show_func = null;
	 this._save_call_back = lang.hitch(this, this._save_call)
	},
	load:function(icustomerid, show_func)
	{
	 this._show_func = show_func;
	 this.clear();
	 this.icustomerid.set("value", icustomerid);
	},
	_add_user:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if (confirm("Add User"))
		{
			request.post('/customer/user/add',
				utilities2.make_params({data:this.form.get("value")})).then
				(this._save_call_back);
		}
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show_func("add",response.data);
		}
		else if ( response.success=="DU")
		{
			alert(response.message);
		}
		else
		{
			alert("Problem");
		}
		this.save_user_btn.cancel();
	},
	clear:function()
	{
		this.icustomerid.set("value","");
		this.email.set("value","");
		this.displayname.set("value","");
		this.password.set("value","");

		this.save_user_btn.cancel();
	}
});
});
