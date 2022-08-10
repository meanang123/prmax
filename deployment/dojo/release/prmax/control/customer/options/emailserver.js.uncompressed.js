require({cache:{
'url:control/customer/options/templates/emailserver.html':"<div class=\"common_prmax_layout\">\r\n<br/>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"common_prmax_layout\"'>\r\n\t\t<input data-dojo-attach-point=\"customerid\" data-dojo-props='name:\"customerid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t<label class=\"label_size_1 label_tag label_align_r\"><input data-dojo-attach-point=\"thirdparty\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"thirdparty\",type:\"checkbox\"' data-dojo-attach-event=\"onChange: _change\"/> Via 3rd Party</label><br/><br/><br/><br/>\r\n\t\t<label class=\"label_size_2 label_tag label_align_r\" data-dojo-attach-point=\"emailservertype_label\" class\"=\"prmaxhidden\">Email Server Type</label><select data-dojo-props='\"class\":\"prmaxinput prmaxhidden\",name:\"emailservertypeid\",autoComplete:true,style:\"width:8em\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"emailservertypeid\" data-dojo-attach-event=\"onChange: _set_emailservertype\"></select></br>\r\n\t\t<label class=\"label_size_2 label_tag label_align_r\" data-dojo-attach-point=\"hostname_label\" class=\"prmaxhidden\">Host Name</label><input data-dojo-props='\"class\":\"prmaxhidden\", type:\"text\",name:\"hostname\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"hostname\" ><br/></br>\r\n\t\t<label class=\"label_size_2 label_tag label_align_r\" data-dojo-attach-point=\"user_name_label\" class=\"prmaxhidden\">Username:</label><input data-dojo-props='\"class\":\"prmaxhidden\",trim:true,name:\"email_username\",type:\"text\",required:false,placeHolder:\"Email server login name\"' data-dojo-attach-point=\"email_username\" data-dojo-type=\"dijit.form.ValidationTextBox\" ><br/>\r\n\t\t<div data-dojo-type=\"dojox.form.PasswordValidator\" name=\"password\" class=\"prmaxrowtag\" data-dojo-attach-point=\"email_password\" data-dojo-props='\"class\":\"prmaxhidden\"'>\r\n\t\t\t<label class=\"label_size_2 label_tag label_align_r\" data-dojo-attach-point=\"password_1_label\" data-dojo-props='\"class\":\"prmaxhidden\"'>Password:</label><input class=\"prmaxrequired\" type=\"password\" pwType=\"new\" name=\"email_password\"/><br/>\r\n\t\t\t<label class=\"label_size_2 label_tag label_align_r\" data-dojo-attach-point=\"password_2_label\" data-dojo-props='\"class\":\"prmaxhidden\"'>Verify:</label><input class=\"prmaxrequired\" type=\"password\" pwType=\"verify\" /><br/>\r\n\t\t</div>\r\n\t\t<br/><br/>\r\n\t\t<button data-dojo-attach-event=\"onClick:_update\" data-dojo-attach-point=\"updatebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Updating ...\",label:\"Update\",'></button><br/><br/>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    emailserver.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("control/customer/options/emailserver", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/emailserver.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dojox/form/PasswordValidator"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.emailserver",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._emailservertypes =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=emailservertypes"});
		this._update_call_back = lang.hitch(this,this._update_call);
	},
	load:function(customer, emailserver)
	{
		this.thirdparty.set("checked", customer.thirdparty);
		this.customerid.set("value", customer.customerid);
		this.email_password.set("value","");

		if ( emailserver)
		{
			this.emailservertypeid.set("value", emailserver.emailservertypeid);
			this.hostname.set("value", emailserver.email_host);
			this.email_username.set("value", emailserver.email_username);

		}
		else
		{
			this.emailservertypeid.set("value", 1);
			this.hostname.set("value", "");
			this.email_username.set("value", "");
			this.email_password.set("value", "");
		}


		this._set_options_display();

	},
	postCreate:function()
	{
		this.emailservertypeid.set("store", this._emailservertypes);
		this.emailservertypeid.set("value", 1);
	},
	_change:function()
	{
		this._set_options_display();
	},
	_set_options_display:function()
	{
		if (this.thirdparty.get("checked"))
		{
			domclass.remove(this.emailservertypeid.domNode, "prmaxhidden");
			domclass.remove(this.emailservertype_label, "prmaxhidden");
			switch (this.emailservertypeid.get("value") )
			{
			case "2":
				domclass.remove(this.hostname.domNode, "prmaxhidden");
				domclass.remove(this.hostname_label, "prmaxhidden");
				this.email_username.set("required",false);
				domclass.add(this.email_username.domNode,"prmaxhidden");
				break;
			case "3":
				domclass.add(this.hostname.domNode, "prmaxhidden");
				domclass.add(this.hostname_label, "prmaxhidden");
				domclass.remove(this.user_name_label,"prmaxhidden");
				domclass.remove(this.email_username.domNode,"prmaxhidden");
				domclass.remove(this.email_password.domNode,"prmaxhidden");
				this.email_username.set("required",true);
				break;
			case "4":
				domclass.remove(this.hostname.domNode, "prmaxhidden");
				domclass.remove(this.hostname_label, "prmaxhidden");
				this.email_username.set("required",false);
				domclass.add(this.email_username.domNode,"prmaxhidden");
				break;
			default:
				this.email_username.set("required",false);
				domclass.add(this.email_username.domNode,"prmaxhidden");
				domclass.add(this.user_name_label,"prmaxhidden");
				domclass.add(this.email_password.domNode,"prmaxhidden")
				domclass.add(this.hostname.domNode, "prmaxhidden");
				domclass.add(this.hostname_label, "prmaxhidden");
				break;
			}
		}
		else
		{
			domclass.add(this.emailservertypeid.domNode, "prmaxhidden");
			domclass.add(this.emailservertype_label, "prmaxhidden");
			domclass.add(this.hostname.domNode, "prmaxhidden");
			domclass.add(this.hostname_label, "prmaxhidden");
			domclass.add(this.user_name_label,"prmaxhidden");
			this.email_username.set("required",false);
			domclass.add(this.email_username.domNode,"prmaxhidden");
			domclass.add(this.email_password.domNode,"prmaxhidden")
		}

	},
	_set_emailservertype:function()
	{
		this._set_options_display();
	},
	_update:function()
	{
		var content = this.form.get("value");
		content['icustomerid'] = this.customerid.value;

		request.post ('/emailserver/update_emailserver',
			utilities2.make_params({ data : content})).
			then ( this._update_call_back);

	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
//			dojo.publish("extended_settings",[response.data]);
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}

		this.updatebtn.cancel();
	}
});
});
