require({cache:{
'url:control/customer/templates/user_reset_password.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='\"class\":\"common_prmax_layout\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"iuserid\" name=\"iuserid\" type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" />\r\n\t\t<p data-dojo-attach-point=\"display_details\" class=\"heading\"></p><br/>\r\n\t\t<label class=\"label_size_1 label_align_r\">Password</label><input data-dojo-attach-point=\"password\" name=\"password\" type=\"password\" size=\"20\" maxlength=\"20\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='required:true,trim:true,invalidMessage:\"Must be entered\",style:\"width:10em\"'/><br/><br/>\r\n\t\t<button class=\"btnright\" data-dojo-attach-event=\"onClick:_update_user_password\" data-dojo-attach-point=\"update_ctrl_btn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait Saving...\",type:\"button\",label:\"Save\"'></button><br/>\r\n\t</form>\r\n</div>\r\n\r\n"}});
define("control/customer/user_reset_password", [
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
