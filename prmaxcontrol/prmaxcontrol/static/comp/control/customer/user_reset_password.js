define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/user_reset_password.html",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, ContentPane,request,utilities2,lang,topic,domclass, domattr){

 return declare("control.customer.user_reset_password",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this._show_func = null;
	 this._save_call_back = lang.hitch(this, this._save_call)
	},
	load:function(iuserid, name, show_func)
	{
		this._show_func = show_func;
		this.clear();
		this.iuserid.set("value", iuserid);
		domattr.set(this.display_details,"innerHTML", name);
	},
	_update_user_password:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if (confirm("Re-set password"))
		{
			request.post('/customer/user/update_password',
				utilities2.make_params({data:this.form.get("value")})).then
				(this._save_call_back);
		}
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show_func("upd_password_close");
		}
		else
		{
			alert("Problem");
		}
		this.update_ctrl_btn.cancel();
	},
	clear:function()
	{
		this.iuserid.set("value","");
		this.password.set("value","");
		domattr.set(this.display_details,"innerHTML", "");
		this.update_ctrl_btn.cancel();
	}
});
});
