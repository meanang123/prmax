//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/RelatedOutlets.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/outlet/OutletSelectSimple",
	"prcommon2/outlet/SelectMultipleOutlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request , JsonRest, ItemFileReadStore){
 return declare("prmaxquestionnaires.pages.RelatedOutlets",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.load(PRMAX.questionnaire);

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			if ( outlet.research != null)
			{
				this.surname.set("value", outlet.research.research_surname );
				this.firstname.set("value", outlet.research.research_firstname );
				this.prefix.set("value", outlet.research.research_prefix );
				this.email.set("value", outlet.research.research_email );
//				this.tel.set("value", outlet.research.research_tel );
				this.job_title.set("value", outlet.research.research_job_title );
			}
		}
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update_related:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/questionnaire/update_related_outlets',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Related Outlets Updated");
		}
		else
		{
			alert("Changes Failed to Apply");
			if ( this._page_error)
				this._page_error();
		}
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		if ( this._page_error)
			this._page_error();
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update_related();
	}
});
});





