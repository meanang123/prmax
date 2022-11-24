define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/user_update.html",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, ContentPane,request,utilities2,lang,topic,domclass){

 return declare("controls.customer.user_update",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this._show_func = null;
	 this._load_details_call_back = lang.hitch(this, this._load_details_call);
	 this._error_call_back = lang.hitch(this, this._error_call);
	 this._save_call_back = lang.hitch(this, this._save_call);
	},

	load:function(iuserid, show_func)
	{
	 this._show_func = show_func;
	 this.iuserid.set("value",iuserid);
	 request.post('/customer/user/get_internal',
		utilities2.make_params({data: {iuserid:iuserid}})).then
		 (this._load_details_call_back, this._error_call_back);

	},
	_error_call:function()
	{

	},
	_load_details_call:function(response)
	{
		if (response.success=="OK")
		{
			this.user_email_address.set("value",response.data.email_address);
			this.user_user_name.set("value", response.data.user_name);
			this.user_display_name.set("value",response.data.display_name);
			this.isuseradmin.set("checked", response.data.isuseradmin);
			this.nodirectmail.set("checked", response.data.nodirectmail);
			this.canviewfinancial.set("checked", response.data.canviewfinancial);
		 this._show_func("update_show");
		}
	},
	_send_login_details:function()
	{
	},
	_update_user_details:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			this.update_ctrl_btn.cancel();
			return ;
		}

		if (confirm("Save User"))
		{
			request.post('/customer/user/update',
				utilities2.make_params({data:this.form.get("value")})).then
				(this._save_call_back);
		}
		else
		{
			this.update_ctrl_btn.cancel();
		}
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show_func("update_finish", response.data);
		}
		else if ( response.success=="DU")
		{
			alert(response.message);
		}
		this.update_ctrl_btn.cancel();
	}
});
});
