require({cache:{
'url:control/customer/templates/user_update.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='\"class\":\"common_prmax_layout\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"iuserid\" name=\"iuserid\" type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" />\r\n\t\t<label class=\"label_1\">Email Address</label><input data-dojo-attach-point=\"user_email_address\" data-dojo-props='name:\"email\",type:\"text\",trim:true,required:true,invalidMessage:\"Please Enter the name of the business\",style:\"width:27em\"' data-dojo-type=\"dijit/form/ValidationTextBox\"><br/>\r\n\t\t<label class=\"label_1\">Login Name</label><input data-dojo-attach-point=\"user_user_name\" data-dojo-props='name:\"user_name\",type:\"text\",trim:true,required:true,style:\"width:15em\"' data-dojo-type=\"dijit/form/ValidationTextBox\"><br/>\r\n\t\t<label class=\"label_1\">Display Name</label><input data-dojo-attach-point=\"user_display_name\" data-dojo-props='name:\"display_name\",type:\"text\",trim:true,required:true,style:\"width:10em\"' data-dojo-type=\"dijit/form/ValidationTextBox\"><br/>\r\n\t\t<label class=\"label_2\"><input data-dojo-props='name:\"isuseradmin\",type:\"checkbox\"' data-dojo-attach-point=\"isuseradmin\" data-dojo-type=\"dijit/form/CheckBox\">&nbsp;User Admin</label><br/>\r\n\t\t<label class=\"label_2\"><input data-dojo-props='type:\"checkbox\",name:\"nodirectmail\"' data-dojo-attach-point=\"nodirectmail\" data-dojo-type=\"dijit/form/CheckBox\">&nbsp;No Direct Mail</label><br/>\r\n\t\t<label class=\"label_2\"><input data-dojo-props='type:\"checkbox\",name:\"canviewfinancial\"' data-dojo-attach-point=\"canviewfinancial\" data-dojo-type=\"dijit/form/CheckBox\">&nbsp;See Invoices</label><br/><br/>\r\n\t\t<button class=\"btnleft\" data-dojo-attach-event=\"onClick:_send_login_details\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Send Login Details\"' ></button>\r\n\t\t<button class=\"btnright\" data-dojo-attach-event=\"onClick:_update_user_details\" data-dojo-attach-point=\"update_ctrl_btn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait Saving...\",type:\"button\",label:\"Save\"'></button><br/>\r\n\t</form>\r\n</div>\r\n\r\n"}});
define("control/customer/user_update", [
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
