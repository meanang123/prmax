//-----------------------------------------------------------------------------
// Name:    persondelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/PersonDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dojox/form/BusyButton",
	"dijit/form/Form",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic,domattr ){
 return declare("research.employees.PersonDelete",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
			this._deleted_contact_call_back = lang.hitch(this, this._deleted_contact_call );
		},
		postCreate:function()
		{
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Codes());

			this.inherited(arguments);
		},
		_delete_submit:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				throw "N";
			}

			if  ( confirm ("Delete " + domattr.get(this.heading,"innerHTML" ) + " ?" ))
			{
				request.post('/research/admin/contacts/research_person_delete',
					utilities2.make_params({ data: this.form.get("value")} )).
					then (this._deleted_contact_call_back);
			}
		},
		_deleted_contact_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Person_Delete, response.contact);
				alert("Person Deleted");
				this.clear();
			}
			else
			{
				alert ( "Problem Deleteing Person" ) ;
				this.deletebtn.cancel();
			}
		},
		clear:function()
		{
			this.contactid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			this.deletebtn.cancel();
		},
		load:function( employeeid, name )
		{
			this.contactid.set("value", employeeid );
			domattr.set(this.heading,"innerHTML" , name ) ;
			this.reasoncodes.set("value", null);
			this.reason.set("value","");
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
});
});