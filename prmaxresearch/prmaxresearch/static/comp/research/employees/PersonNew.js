//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeNew
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/PersonNew.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, ItemFileReadStore ){
 return declare("research.employees.PersonNew",
	[BaseWidgetAMD],{
	displayname:"New Person",
	templateString: template,
	constructor: function()
	{
		this._sourcetypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes"});

		this._add_call_back = lang.hitch(this,this._add_call);
		this._exist_call_back = lang.hitch(this,this._exist_call);
		this._parentcallback = null;
		this._dialog = null;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.sourcetypeid.set("store", this._sourcetypes);
		this.sourcetypeid.set("value", 2);

		this.inherited(arguments);
	},
	_add_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if ( confirm("Add Contact?"))
		{
			request.post('/research/admin/contacts/research_exist',
				utilities2.make_params({ data : this.form.get("value")})).
				then(this._exist_call_back);
		}		
		
//		{
//			request.post('/research/admin/contacts/research_addnew',
//				utilities2.make_params({ data : this.form.get("value")})).
//				then(this._add_call_back);
//		}
	},
	_exist_call:function(response)
	{
		if (response.success == "OK")
		{
			if ((response.exist == true && confirm("Contact already exist with same Firstname and Surname. Do you want to proceed?")) || response.exist == false)
			{
				request.post('/research/admin/contacts/research_addnew',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);				
			}
		}
	},
	_add_call:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Contact Added");
			if ( this._parentcallback )
				this._parentcallback(response.contact);
			topic.publish(PRCOMMON.Events.Person_Added, response.contact);
			this._clear_add_form();
			if (this._dialog)
				this._dialog.hide();
		}
		else
		{
				alert("Failed");
		}
	},
	clear:function()
	{
		this._clear_add_form();
	},
	_clear_add_form:function()
	{
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.sourcetypeid.set("value", 2);
	},
	_setCallbackAttr:function( func)
	{
		this._parentcallback = func;
	},
	focus:function()
	{
		this.prefix.focus();
	},
	disabled:function( status )
	{
		this.prefix.set("disabled",status);
		this.firstname.set("disabled",status);
		this.familyname.set("disabled",status);
		this.reasoncodeid.set("disabled",status);
		this.sourcetypeid.set("disabled", status);
	}
});
});
