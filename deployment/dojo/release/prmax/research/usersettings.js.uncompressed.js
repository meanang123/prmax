require({cache:{
'url:research/templates/usersettings.html':"<div>\r\n\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr><td colspan=\"2\" class=\"prmaxrowdisplaylarge\">PRMax Researcher Setting</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Display Name</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",name:\"display_name\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:15em\"' data-dojo-attach-point=\"display_name\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td>\t<input data-dojo-props='\"class\":\"prmaxrequired\",name:\"job_title\",type:\"text\",style:\"width:15em\",maxlength:\"80\",trim:true,required:true' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"job_title\"  /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"email_address\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"email_address\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:25em\",maxlength:\"70\"'></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"tel\",type:\"text\",size:25,maxlength:40,style:\"width:15em\",required:true'/></td></tr>\r\n<!--\r\n\t\t\t<tr><td colspan=\"2\" class=\"prmaxrowdisplaylarge\">The Media Researcher Company</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Display Name</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",name:\"research_display_name\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:15em\"' data-dojo-attach-point=\"research_display_name\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td>\t<input data-dojo-props='\"class\":\"prmaxrequired\",name:\"research_job_title\",type:\"text\",style:\"width:15em\",maxlength:\"80\",trim:true,required:true' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"research_job_title\"  /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"research_email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"research_email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:25em\",maxlength:\"70\"'></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"research_tel\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"research_tel\",type:\"text\",size:25,maxlength:40,style:\"width:15em\",required:true'/></td></tr>\r\n-->\r\n\t\t\t<tr><td></td><td><button data-dojo-attach-event=\"onClick:_update\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='disabled:\"disabled\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    usersettings.js
// Author:  Chris Hoy
// Purpose:
// Created: 02/04/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/usersettings", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../research/templates/usersettings.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/validate",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang){
 return declare("research.usersettings",
	[BaseWidgetAMD],{
	templateString:template,
	constructor:function()
	{
	 this._load_call_back = lang.hitch(this, this._load_call);
	 this._update_call_back = lang.hitch(this, this._update_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		request.post('/research/admin/user/research_get_settings',
			utilities2.make_params({})).then
			( this._load_call_back);
	},
	_load_call:function (response)
	{
		if ( response.success == "OK" )
		{
			this.display_name.set("value",response.user.display_name);
			this.job_title.set("value",response.user.job_title);
			this.email_address.set("value",response.user.email_address);
			this.tel.set("value",response.user.tel);

			//this.research_display_name.set("value",response.user.research_display_name);
			//this.research_job_title.set("value",response.user.research_job_title);
			//this.research_email.set("value",response.user.research_email);
			//this.research_tel.set("value",response.user.research_tel);

			this.savenode.set("disabled",false);
		}
		else
		{
			alert("problem loading settings");
		}
	},
	_update_call:function(response)
	{
		if ( response.success == "OK" )
		{
			alert("Settings Updated");
		}
		else if ( response.success == "DU" )
		{
			alert("Email Address Already Exists");
		}
		else
		{
			alert("Problem Saving settings");
		}
		this.savenode.cancel();
	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if ( confirm("Update Settings?"))
		{
			request.post('/research/admin/user/research_update_settings',
				utilities2.make_params({data: this.form.get("value")})).then
				(this._update_call_back);
		}
	}
});
});





