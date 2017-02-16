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
define([
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

			this.research_display_name.set("value",response.user.research_display_name);
			this.research_job_title.set("value",response.user.research_job_title);
			this.research_email.set("value",response.user.research_email);
			this.research_tel.set("value",response.user.research_tel);

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





