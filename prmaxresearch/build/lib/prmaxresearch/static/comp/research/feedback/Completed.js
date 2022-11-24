//-----------------------------------------------------------------------------
// Name:    geographicals.js
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
	"dojo/text!../feedback/templates/Completed.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.feedback.Completed",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._completed_call_back = lang.hitch(this, this._completed_call );
	},
	postCreate:function()
	{
		this.reasoncodes.set("store", PRCOMMON.utils.stores.Research_Reason_Add_Email());

		this.inherited(arguments);
	},
	_complete_submit:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";

		}

		if ( confirm("Complete Email?"))
		{
			request.post('/research/admin/bemails/completed',
				utilities2.make_params({data:this.form.get("value")})).then
				(this._completed_call_back);
		}
	},
	_completed_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Completed");
			this.clear();
			topic.publish(PRCOMMON.Events.BouncedEmail_Completed, this.bounceddistributionid.get("value"));
		}
		else
		{
			alert ( "Problem Completing Bounnced Email" ) ;
		}
	},
	// styandard clear function
	clear:function()
	{
		this.bounceddistributionid.set("value", -1 ) ;
		this.reasoncodes.set("value",null);
		this.reason.set("value","");
		this.has_been_research.set("value", false);
	},
	load:function( bounceddistributionid )
	{
		this.bounceddistributionid.set("value", bounceddistributionid );
		this.reasoncodes.set("value", null);
		this.has_been_research.set("value", false);
		this.reason.focus();
	},
	focus:function()
	{
		this.reason.focus();
	}
});
});





