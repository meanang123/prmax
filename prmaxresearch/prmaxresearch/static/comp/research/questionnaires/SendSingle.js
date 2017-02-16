//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.questionnaires.SendSingle.js
// Author:  Chris Hoy
// Purpose:
// Created: 29/03/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/SendSingle.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass){
 return declare("research.questionnaires.SendSingle",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._send_call_back = dojo.hitch(this, this._send_call );
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_send:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		request.post('/research/admin/send_questionnaire',
			utilities2.make_params({data:this.form.get("value")})).then
			( this._send_call_back);
	},
	_send_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Questionnaire Sent");
			this._dialog.hide();
		}
		else
		{

			alert("Problem Sending Questionnaire");
			this.sendemail.cancel();
		}
	},
	_close:function()
	{
		this._dialog.hide();
	},
	load:function( objectid , objecttypeid, emailaddress, name, dialog )
	{
		this._clear();
		this.objecttypeid.set("value",objecttypeid);
		this.objectid.set("value",objectid);
		this.toemail.set("value",emailaddress);
		this.toname.set("value", name);
		this._dialog = dialog;
		this._dialog.show();
	},
	_clear:function()
	{
		this.sendemail.cancel();
		this.objecttypeid.set("value",-1);
		this.objectid.set("value",-1);
		this.toname.set("value","");
		this.toemail.set("value","");
		this.subject.set("value","");
		this.body.set("value","");
	}
});
});





