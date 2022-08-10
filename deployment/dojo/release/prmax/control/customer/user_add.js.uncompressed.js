require({cache:{
'url:control/customer/templates/user_add.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"common_prmax_layout\"'>\r\n\t\t<input data-dojo-attach-point=\"icustomerid\" name=\"icustomerid\" type=\"hidden\" size=\"40\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" />\r\n\t\t<label class=\"label_size_1 label_align_r\">Email Address</label><input data-dojo-attach-point=\"email\" name=\"email\" type=\"text\" maxlength=\"80\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='trim:true,pattern:dojox.validate.regexp.emailAddress,required:true,invalidMessage:\"invalid email address\",style:\"width:27em\"'/><br/>\r\n\t\t<label class=\"label_size_1 label_align_r\">Display Name</label><input data-dojo-attach-point=\"displayname\" name=\"displayname\" type=\"text\" maxlength=\"80\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='trim:true,required:true,invalidMessage:\"Must be entered\",style:\"width:15em\"'/><br/>\r\n\t\t<label class=\"label_size_1 label_align_r\">Password</label><input data-dojo-attach-point=\"password\" name=\"password\" type=\"password\" size=\"20\" maxlength=\"20\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='required:true,trim:true,invalidMessage:\"Must be entered\",style:\"width:10em\"'/><br/><br/>\r\n\t\t<button class=\"btnright\" data-dojo-attach-point=\"save_user_btn\" data-dojo-attach-event=\"onClick:_add_user\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait Adding...\",label:\"Add\"'></button><br/><br/>\r\n\t</form>\r\n</div>\r\n"}});
define("control/customer/user_add", [
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
