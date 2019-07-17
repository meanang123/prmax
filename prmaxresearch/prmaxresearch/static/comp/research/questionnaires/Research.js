//-----------------------------------------------------------------------------
// Name:    Coding.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/01/2013
// To do:
//-----------------------------------------------------------------------------
//
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Research.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , JsonRest, ItemFileReadStore ){
 return declare("research.questionnaires.Research",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_reset_fields:function()
	{
		this.surname_modified.clear();
		this.firstname_modified.clear();
		this.prefix_modified.clear();
		this.email_modified.clear();
//		this.tel_modified.clear();
		this.job_title_modified.clear();

	},
	load:function( projectitem, research , user_changes )
	{

		this._reset_fields();

		this.surname.set("value", research.surname );
		this.firstname.set("value", research.firstname );
		this.prefix.set("value", research.prefix );
		this.email.set("value", research.email );
//		this.tel.set("value", research.tel );
		this.job_title.set("value", research.job_title )

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 55:
					this.surname_modified.load(change_record.value, research.surname, this.surname);
					break;
				case 56:
					this.firstname_modified.load(change_record.value, research.firstname, this.firstname);
					break;
				case 57:
					this.prefix_modified.load(change_record.value, research.prefix, this.prefix);
					break;
				case 58:
					this.email_modified.load(change_record.value, research.email, this.email);
					break;
//				case 59:
//					this.tel_modified.load(change_record.value, research.tel, this.tel);
//					break;
				case 60:
					this.job_title_modified.load(change_record.value, research.job_title, this.job_title);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();

	},
	clear:function()
	{
		this.outletid.set("value", -1);

		this.savenode.cancel();
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

		request.post('/research/admin/projects/user_feed_research',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Research Details Updated");
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





