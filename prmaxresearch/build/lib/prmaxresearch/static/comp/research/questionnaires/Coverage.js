//-----------------------------------------------------------------------------
// Name:    Coverage.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/04/2013
// To do:
//-----------------------------------------------------------------------------
//
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Coverage.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , domattr ){
 return declare("research.questionnaires.Coverage",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.inherited(arguments);
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
	},
	load:function( projectitem, outlet, user_changes )
	{

		this.coverage.set("value",outlet.coverage ) ;
		domattr.set(this.feedback,"innerHTML","");

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 54:
					domattr.set(this.feedback, "innerHTML", change_record.value);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();
	},
	clear:function()
	{

		this.savenode.cancel();
		domattr.set(this.feedback,"innerHTML","");
	},
	_update_coding:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/projects/user_feed_coverage',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Coverage Updated");
		}
		else
		{
			alert("Problem");
		}
		this.savenode.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}
});
});

